import "server-only";
import postgres from "postgres";
import { unstable_cache } from "next/cache";
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

async function loadJobs(): Promise<JobNotification[]> {
  const conn = db();
  if (!conn) {
    console.warn("JOBS_DATABASE_URL is not set: no jobs to show");
    return [];
  }
  const rows = await conn<{ data: string; at: string | null }[]>`
    select data, coalesce(published_at, created_at)::text as at from notices where status = 'published'
    order by coalesce(published_at, created_at) desc`;
  return rows.map((r) => ({ ...(JSON.parse(r.data) as JobNotification), publishedAt: r.at || undefined }));
}

// Cached for an hour and refreshed at once when the agent publishes (POST /api/revalidate, tag "jobs").
const cachedJobs = unstable_cache(loadJobs, ["published-jobs"], { tags: ["jobs"], revalidate: 3600 });

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
  const jobs = await cachedJobs();
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
