import "server-only";
import postgres from "postgres";
import { unstable_cache } from "next/cache";
import { gunzipSync } from "node:zlib";
import { signedR2Url } from "@/lib/r2-link";
import { getStateBySlug } from "@/config/states";
import { computeJobStatus, JobNotification, ofThisRecruitment, stageSummary } from "@/data/jobs";

// Notices published by the notice agent (indiajobnotice-agent, stage 4) live in the Supabase table
// `notices`; `data` holds the job in the JobNotification shape. JOBS_DATABASE_URL is a read-only
// role that can see published rows only (row level security), through the Supabase pooler.
let sql: postgres.Sql | null = null;

function db(): postgres.Sql | null {
  const url = process.env.JOBS_DATABASE_URL;
  if (!url) return null;
  // transaction-mode pooler: no prepared statements
  sql ??= postgres(url, { prepare: false, max: 3, idle_timeout: 20, connect_timeout: 15 });
  return sql;
}

// Localhost reads a saved copy, so testing does not use the live database's data allowance. The first
// load makes it; `npm run jobs:refresh` deletes it and the next load fetches a fresh one.
const SNAPSHOT = ".local/jobs-snapshot.json";

async function readSnapshot(): Promise<JobNotification[] | null> {
  const { readFile } = await import("node:fs/promises");
  try {
    return JSON.parse(await readFile(SNAPSHOT, "utf8")) as JobNotification[];
  } catch {
    return null;
  }
}

async function saveSnapshot(jobs: JobNotification[]): Promise<void> {
  const { mkdir, writeFile } = await import("node:fs/promises");
  await mkdir(".local", { recursive: true });
  await writeFile(SNAPSHOT, JSON.stringify(jobs));
}

const dev = process.env.NODE_ENV === "development";

// The agent writes every published notice to R2 (private) on each change, gzipped: loading that instead of the
// database keeps the site off Supabase's egress allowance (9 Nov: ~280 full loads a day, ~1.2 MB each).
const R2_SNAPSHOT = "site/jobs.json.gz";

async function loadFromR2(): Promise<JobNotification[] | null> {
  const url = signedR2Url(R2_SNAPSHOT, false);
  if (!url) return null;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const jobs = JSON.parse(gunzipSync(Buffer.from(await res.arrayBuffer())).toString("utf8"));
    return Array.isArray(jobs) && jobs.length ? (jobs as JobNotification[]) : null;
  } catch (err) {
    console.warn("jobs snapshot from R2 failed, reading the database:", err);
    return null;
  }
}

async function loadJobs(): Promise<JobNotification[]> {
  if (dev) {
    const saved = await readSnapshot();
    if (saved) return saved;
  } else {
    const stored = await loadFromR2();
    if (stored) return stored;
  }
  const conn = db();
  if (!conn) {
    console.warn("JOBS_DATABASE_URL is not set: no jobs to show");
    return [];
  }
  const rows = await conn<{ data: string; at: string | null; source: string | null }[]>`
    select n.data, coalesce(n.published_at, n.created_at)::text as at, s.slug as source
    from notices n left join site_sources s on s.id = n.source_id where n.status = 'published'
    order by coalesce(n.published_at, n.created_at) desc`;
  const jobs = rows.map((r) => ({ ...(JSON.parse(r.data) as JobNotification), publishedAt: r.at || undefined,
    ...(r.source ? { source: r.source } : {}) }));
  if (dev) await saveSnapshot(jobs);
  return jobs;
}

// Cached for a day and refreshed at once after every agent run and approval (POST /api/revalidate, tag
// "jobs"). Each load is the whole list, so this is what the site's database use comes down to. Statuses
// and days left are worked out below on every request, so they stay right however old the copy is.
const cachedJobs = dev ? loadJobs : unstable_cache(loadJobs, ["published-jobs"], { tags: ["jobs"], revalidate: 86400 });

// Job pages (and district pages) must not be rebuilt on every refresh: ~800 of them at ~190 KB each used up
// Vercel's free 200K ISR writes (9 Nov). They read their own job under the tag "job:<slug>", which the agent
// names only when that job changed (or was withdrawn), and the other jobs they show (related, open elsewhere)
// from a copy renewed once a day.
const cachedJobsDaily = dev ? loadJobs : unstable_cache(loadJobs, ["published-jobs-daily"], { tags: ["jobs-daily"], revalidate: 86400 });

async function loadOne(slug: string): Promise<JobNotification | null> {
  if (dev) return (await loadJobs()).find((j) => j.slug.toLowerCase() === slug.toLowerCase()) || null;
  const conn = db();
  if (!conn) return null;
  const rows = await conn<{ data: string; at: string | null; source: string | null }[]>`
    select n.data, coalesce(n.published_at, n.created_at)::text as at, s.slug as source
    from notices n left join site_sources s on s.id = n.source_id
    where n.status = 'published' and lower(n.slug) = lower(${slug}) limit 1`;
  const r = rows[0];
  return r ? { ...(JSON.parse(r.data) as JobNotification), publishedAt: r.at || undefined, ...(r.source ? { source: r.source } : {}) } : null;
}

const cachedJob = (slug: string) => dev ? loadOne(slug)
  : unstable_cache(() => loadOne(slug), ["published-job", slug.toLowerCase()], { tags: [`job:${slug.toLowerCase()}`], revalidate: 86400 })();

/** Every published job, with its status worked out from today's date. */
const SMALL_WORDS = new Set(["of", "the", "and", "for", "in", "&", "at", "to", "office"]);
const KEEP_WORDS = new Set(["District Court", "High Court"]);
const RESERVED_CODES: Record<string, { name: RegExp; suffix: string }> = {
  UPSC: { name: /union public service/i, suffix: "PSC" },
  SSC: { name: /^staff selection commission/i, suffix: "SSC" },
};

/**
 * The short code shown on cards and tags. Some sources store a place name ("BENGALURURURAL",
 * "ARUNACHAL") or a word ("Constable") instead of the body's initials: build the initials from the
 * organisation's name then (Bengaluru Rural District Court -> BRDC). A real acronym the name
 * itself gives in brackets (MAHAGENCO) is kept.
 */
function cleanOrgCode(job: JobNotification): string {
  const code = bodyCode(job);
  // a central body's code on a state body (UP Public Service Commission -> UPSC): state code + rest (UPPSC)
  const reserved = RESERVED_CODES[code];
  const st = !job.isCentral ? getStateBySlug(job.stateSlug)?.code : null;
  return reserved && !reserved.name.test(job.organization || "") && st ? `${st}${reserved.suffix}` : code;
}

function bodyCode(job: JobNotification): string {
  const code = (job.orgShortCode || "").trim();
  const org = job.organization || "";
  if (KEEP_WORDS.has(code)) return code;
  // a bare state code ("UP") is not a body: build the body's initials (UPPSC)
  const stateCodeOnly = /^[A-Z]{2}$/.test(code) && org.split(/\s+/).length > 2;
  const looksRight = /^[A-Z][A-Z0-9&.-]{1,6}$/.test(code);
  const statedInName = /^[A-Z0-9&.-]+$/.test(code) && org.includes(`(${code})`);
  if (code && !stateCodeOnly && (looksRight || statedInName)) return code;
  // the name in brackets when it is the body itself ("Office of the DGP, Nagaland (Nagaland Police)")
  const bracket = org.match(/\(([^)]+)\)/)?.[1] || "";
  const base = /police|commission|board|court/i.test(bracket) && !/court/i.test(org.split("(")[0])
    ? bracket : org.split("(")[0].split(",")[0];
  const words = base.replace(/[,.]/g, " ").split(/\s+/).filter((w) => w && !SMALL_WORDS.has(w.toLowerCase()));
  const initials = words.map((w) => w[0].toUpperCase()).join("");
  if (initials.length >= 2 && initials.length <= 6) {
    // keep a word in the code when it is the whole point ("Nagaland Police" -> NP is unclear)
    return initials.length === 2 && words.length === 2 ? words.join(" ") : initials;
  }
  return code || initials.slice(0, 6);
}

/**
 * One badge, one body: when a code stands for different bodies (MPSC is Manipur, Meghalaya and
 * Maharashtra PSC), add the state's code ("MPSC · MN").
 */
function disambiguateCodes(jobs: JobNotification[]): JobNotification[] {
  const bodies = new Map<string, Set<string>>();
  const norm = (o: string) => o.split("(")[0].replace(/[,.]+$/, "").trim().toLowerCase();
  for (const j of jobs) {
    if (!bodies.has(j.orgShortCode)) bodies.set(j.orgShortCode, new Set());
    bodies.get(j.orgShortCode)!.add(norm(j.organization || ""));
  }
  return jobs.map((j) => {
    const many = (bodies.get(j.orgShortCode)?.size || 0) > 1 && !KEEP_WORDS.has(j.orgShortCode);
    const st = !j.isCentral ? getStateBySlug(j.stateSlug)?.code : null;
    return many && st ? { ...j, orgShortCode: `${j.orgShortCode} · ${st}` } : j;
  });
}

export async function getAllJobs(): Promise<JobNotification[]> {
  return prepare(await cachedJobs());
}

/**
 * Every published job, read now (R2 copy, else the database), past every cache: for the sitemap. On Vercel it kept
 * the list of its 25 Nov build for days while the pages moved on (27 Nov: 182 jobs published since were missing,
 * and Google learnt of none of them); the list is ~3.7 MB, over the data cache's 2 MB item limit.
 */
export async function getAllJobsFresh(): Promise<JobNotification[]> {
  return prepare(await loadJobs());
}

/** Every published job as of the daily copy: for pages that need not change on every refresh (districts). */
export async function getAllJobsDaily(): Promise<JobNotification[]> {
  return prepare(await cachedJobsDaily());
}

/**
 * A job page's data: its own job, current (null when not published), and the other jobs from the daily copy,
 * with this job in its current form among them.
 */
export async function getJobPage(slug: string): Promise<{ job: JobNotification | null; allJobs: JobNotification[] }> {
  const own = await cachedJob(slug);
  if (!own) return { job: null, allJobs: [] };
  const others = (await cachedJobsDaily()).filter((j) => j.id !== own.id && j.slug !== own.slug);
  const allJobs = prepare([own, ...others]);
  return { job: allJobs.find((j) => j.id === own.id) || null, allJobs };
}

function prepare(jobs: JobNotification[]): JobNotification[] {
  const cleaned = jobs.map((stored) => {
    // a document the recruitment's dates rule out is not one of its stages (the agent checks too)
    const stages = stored.stages?.filter((s) => ofThisRecruitment(s, stored));
    const job = stages && stages.length !== stored.stages?.length
      ? { ...stored, stages, currentStage: stages.length ? stageSummary({ ...stored, stages }) || undefined : undefined }
      : stored;
    const code = cleanOrgCode(job);
    // the stored short title starts with the stored code ("UPSC Uttarakhand..."): use the cleaned one
    const old = (job.orgShortCode || "").trim();
    const shortTitle = old && code !== old && job.shortTitle?.startsWith(old + " ")
      ? code + job.shortTitle.slice(old.length) : job.shortTitle;
    return { ...job, orgShortCode: code, shortTitle, status: computeJobStatus(job) };
  });
  return disambiguateCodes(cleaned);
}

// When each state's official sites were last checked by the agent (view site_state_checks: one row per state,
// readable by the site's role, 21 Nov). Cached with the job list and refreshed with it after each agent run, so
// it adds no page rebuilds of its own.
const stateKey = (name: string) => name.toLowerCase().replace(/\s*\([^)]*\)/g, "").replace(/&/g, "and").replace(/[^a-z]/g, "");

async function loadStateChecks(): Promise<Record<string, string>> {
  const conn = db();
  if (!conn) return {};
  try {
    const rows = await conn<{ state: string; at: string | null }[]>`
      select state, last_checked::text as at from site_state_checks`;
    return Object.fromEntries(rows.filter((r) => r.at).map((r) => [stateKey(r.state), r.at as string]));
  } catch (err) {
    console.warn("state check times not read:", err);
    return {};
  }
}

const cachedStateChecks = dev ? loadStateChecks : unstable_cache(loadStateChecks, ["state-checks"], { tags: ["jobs"], revalidate: 86400 });

/** When the agent last checked this state's official sites successfully (ISO), or null when not known. */
export async function getStateCheckedAt(stateName: string): Promise<string | null> {
  return (await cachedStateChecks())[stateKey(stateName)] || null;
}

// When each of the agent's sources was last read successfully (view site_sources), for board pages; cached with
// the job list like the state times.
async function loadSourceChecks(): Promise<Record<string, string>> {
  const conn = db();
  if (!conn) return {};
  try {
    const rows = await conn<{ slug: string; at: string | null }[]>`
      select slug, last_checked::text as at from site_sources where last_checked is not null`;
    return Object.fromEntries(rows.map((r) => [r.slug, r.at as string]));
  } catch (err) {
    console.warn("source check times not read:", err);
    return {};
  }
}

const cachedSourceChecks = dev ? loadSourceChecks : unstable_cache(loadSourceChecks, ["source-checks"], { tags: ["jobs"], revalidate: 86400 });

/** The latest successful check among these sources (ISO), or null. */
export async function getSourcesCheckedAt(sources: string[]): Promise<string | null> {
  const all = await cachedSourceChecks();
  return sources.map((s) => all[s]).filter(Boolean).sort().pop() || null;
}

/** The agent's latest successful check of any state's official sites (ISO), or null: the site-wide "last checked". */
export async function getLastCheckedAt(): Promise<string | null> {
  return Object.values(await cachedStateChecks()).sort().pop() || null;
}
