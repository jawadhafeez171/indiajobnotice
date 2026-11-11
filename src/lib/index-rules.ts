import { getJobsByDistrict, getStages, isOpenOrOpening, JobNotification, StageKind, todayIST } from "@/data/jobs";

// Which pages are offered to Google (sitemap) and which ask not to be indexed (9 Nov). Search Console
// showed 400+ pages "Discovered – currently not indexed": a young site listing 1,035 addresses, many of
// them thin, gets crawled slowly everywhere. Only pages with something of their own are offered.

const DAY = 86400000;
const daysAgo = (day: string | undefined, today: string) =>
  day ? Math.floor((Date.parse(today) - Date.parse(day.slice(0, 10))) / DAY) : Infinity;

/** A stage document (admit card, answer key, result) counts as news this long. */
export const STAGE_NEWS_DAYS = 30;
/** A notice dated this recently is offered even when it is no longer open (its own date, not the day we listed it). */
const NEW_NOTICE_DAYS = 21;

/** The newest document of this kind is recent enough for its own page to be indexed. */
export function stagePageIndexable(job: JobNotification, kind: StageKind, today = todayIST()): boolean {
  const days = getStages(job, kind).map((s) => s.date || s.found || "").filter(Boolean).sort();
  return days.length > 0 && daysAgo(days[days.length - 1], today) <= STAGE_NEWS_DAYS;
}

/** A job page worth offering in the sitemap: open or opening, newly published, or a recent stage document. */
export function jobInSitemap(job: JobNotification, today = todayIST()): boolean {
  if (isOpenOrOpening(job)) return true;
  if (daysAgo(job.notificationDate || job.applicationStartDate, today) <= NEW_NOTICE_DAYS) return true;
  const latest = (job.stages || []).map((s) => s.date || s.found || "").filter((d) => d && d <= today).sort().pop();
  return daysAgo(latest, today) <= STAGE_NEWS_DAYS;
}

/**
 * A state page has something of its own: an open or opening job of that state, or one of its recruitments under
 * way. Without one it only repeats central jobs, so it is kept out of search until it has (11 Nov).
 */
export function stateHasListings(jobs: JobNotification[], stateSlug: string): boolean {
  return jobs.some((j) => !j.isCentral && j.stateSlug === stateSlug && (isOpenOrOpening(j) || Boolean(j.inProgress)));
}

/** A district page has jobs of its own (district posts or a district quota), not only its state's list. */
export function districtHasOwnJobs(jobs: JobNotification[], stateSlug: string, districtSlug: string): boolean {
  return getJobsByDistrict(jobs, stateSlug, districtSlug, false).length > 0;
}
