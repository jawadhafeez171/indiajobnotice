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
export async function getAllJobs(): Promise<JobNotification[]> {
  const jobs = await cachedJobs();
  return jobs.map((job) => ({ ...job, status: computeJobStatus(job) }));
}
