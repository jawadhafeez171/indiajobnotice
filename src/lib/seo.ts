import { JobNotification, formatAgeRange, isJobApplicationClosed, todayIST } from "@/data/jobs";
import { cleanTitle, qualificationLabel } from "@/components/jobs/JobListCard";

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dayMon = (iso: string) => `${Number(iso.slice(8, 10))} ${MON[Number(iso.slice(5, 7)) - 1]}`;

/** Year of the recruitment: the notification's own dates, else today (IST). */
export function jobYear(job: JobNotification): string {
  return (job.applicationStartDate || job.applicationEndDate || todayIST()).slice(0, 4);
}

/** The short title without a cut-off ending ("… posts in…" -> "… posts"). */
function baseTitle(job: JobNotification): string {
  return cleanTitle(job)
    .replace(/\s*…\s*$/, "")
    .replace(/\s+(in|of|for|and|the|to|at|on|with|under|from|by)$/i, "")
    .replace(/[\s,;:–-]+$/, "")
    .trim();
}

/**
 * Search title of a job page, e.g. "KEA Group-C Junior Engineer (Civil) Recruitment 2026: 31 Posts,
 * Last Date 26 Nov". The site name is added by the layout template.
 */
export function jobSeoTitle(job: JobNotification): string {
  let t = baseTitle(job);
  const year = jobYear(job);
  if (!/recruitment|notification|walk[\s-]?in/i.test(t)) t += job.isWalkIn ? " Walk-in" : " Recruitment";
  if (!t.includes(year)) t += ` ${year}`;
  const bits: string[] = [];
  if (job.totalVacancies) bits.push(`${job.totalVacancies.toLocaleString("en-IN")} Post${job.totalVacancies === 1 ? "" : "s"}`);
  if (job.applicationEndDate && !isJobApplicationClosed(job)) {
    bits.push(`${job.isWalkIn ? "Walk-in" : "Last Date"} ${dayMon(job.applicationEndDate)}`);
  }
  return bits.length ? `${t}: ${bits.join(", ")}` : t;
}

/** Search description: the facts people look for, in one or two sentences (about 155 characters). */
export function jobSeoDescription(job: JobNotification): string {
  const parts: string[] = [];
  const posts = job.totalVacancies
    ? `${job.totalVacancies.toLocaleString("en-IN")} post${job.totalVacancies === 1 ? "" : "s"}`
    : "";
  const last = job.applicationEndDate
    ? isJobApplicationClosed(job)
      ? `applications closed on ${dayMon(job.applicationEndDate)} ${job.applicationEndDate.slice(0, 4)}`
      : `${job.isWalkIn ? "walk-in on" : "last date"} ${dayMon(job.applicationEndDate)} ${job.applicationEndDate.slice(0, 4)}`
    : "";
  const head = [posts, last].filter(Boolean).join(", ");
  parts.push(head ? `${job.organization}: ${head}.` : `${job.organization}.`);
  const qual = qualificationLabel(job);
  const age = job.ageKnown !== false && job.maxAge > 0 ? formatAgeRange(job, "years").replace(/^Up to/, "up to") : "";
  if (qual || age) parts.push(`Eligibility: ${[qual, age && `age ${age}`].filter(Boolean).join(", ")}.`);
  parts.push("Fee, selection process and the official notification link.");
  return parts.join(" ");
}

/** Monthly pay range from the stated pay ("37,640 – 1,15,500"), or null when none is stated. */
export function salaryRange(job: JobNotification): { min: number; max?: number } | null {
  const nums = (job.salary || "").match(/\d[\d,]*/g)?.map((n) => Number(n.replace(/,/g, ""))).filter((n) => n >= 1000) || [];
  if (!nums.length) return null;
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  return max > min ? { min, max } : { min };
}

/** "KEA Junior Engineer (Civil) 2026: Age Limit 18–40 years, Qualification" */
export function eligibilityTitle(job: JobNotification): string {
  let t = baseTitle(job);
  const year = jobYear(job);
  if (!t.includes(year)) t += ` ${year}`;
  const age = job.ageKnown !== false && job.maxAge > 0 ? `Age Limit ${formatAgeRange(job, "years")}` : "Age Limit";
  return `${t}: ${age}, Qualification`;
}
