import "server-only";
import postgres from "postgres";
import { unstable_cache } from "next/cache";
import { computeJobStatus, JobNotification } from "@/data/jobs";

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
  const rows = await conn<{ data: string }[]>`
    select data from notices where status = 'published'
    order by coalesce(published_at, created_at) desc`;
  return rows.map((r) => JSON.parse(r.data) as JobNotification);
}

// Cached for an hour and refreshed at once when the agent publishes (POST /api/revalidate, tag "jobs").
const cachedJobs = unstable_cache(loadJobs, ["published-jobs"], { tags: ["jobs"], revalidate: 3600 });

/** Every published job, with its status worked out from today's date. */
const SMALL_WORDS = new Set(["of", "the", "and", "for", "in", "&", "at", "to", "office"]);
const KEEP_WORDS = new Set(["District Court", "High Court"]);

/**
 * The short code shown on cards and tags. Some sources store a place name ("BENGALURURURAL",
 * "ARUNACHAL") or a word ("Constable") instead of the body's initials: build the initials from the
 * organisation's name then (Bengaluru Rural District Court -> BRDC). A real acronym the name
 * itself gives in brackets (MAHAGENCO) is kept.
 */
function cleanOrgCode(job: JobNotification): string {
  const code = (job.orgShortCode || "").trim();
  const org = job.organization || "";
  if (KEEP_WORDS.has(code)) return code;
  const looksRight = /^[A-Z][A-Z0-9&.-]{1,6}$/.test(code);
  const statedInName = /^[A-Z0-9&.-]+$/.test(code) && org.includes(`(${code})`);
  if (code && (looksRight || statedInName)) return code;
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

export async function getAllJobs(): Promise<JobNotification[]> {
  const jobs = await cachedJobs();
  return jobs.map((job) => ({ ...job, orgShortCode: cleanOrgCode(job), status: computeJobStatus(job) }));
}
