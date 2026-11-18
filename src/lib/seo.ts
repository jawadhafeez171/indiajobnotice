import { JobNotification, formatAgeRange, isJobApplicationClosed, todayIST } from "@/data/jobs";
import { cleanTitle, opensWithBoilerplate, qualificationLabel, rowTitle, withoutAdvtNo } from "@/components/jobs/JobListCard";
import { payRange, PayRange } from "@/lib/pay";

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dayMon = (iso: string) => `${Number(iso.slice(8, 10))} ${MON[Number(iso.slice(5, 7)) - 1]}`;

/** Year of the recruitment: the notification's own dates, else today (IST). */
export function jobYear(job: JobNotification): string {
  return (job.applicationStartDate || job.notificationDate || job.applicationEndDate || todayIST()).slice(0, 4);
}

/** The short title without a cut-off ending ("… posts in…" -> "… posts"). */
function baseTitle(job: JobNotification): string {
  return cleanTitle(job)
    .replace(/\s*…\s*$/, "")
    .replace(/\s+(in|of|for|and|the|to|at|on|with|under|from|by)$/i, "")
    .replace(/[\s,;:–-]+$/, "")
    .trim();
}

/** Search results show about 60 characters; the site name the layout adds comes after and may be cut. */
const TITLE_MAX = 60;
const STOP_END = /\s+(?:in|of|for|and|the|to|at|on|with|under|from|by|&|-|–)$/i;

/**
 * The name a search title starts with: the stored short title without advert numbers or post codes; when that
 * opens with wording that names no post ("APPSC Direct Recruitment to the post", "TPSC General Recruitment",
 * 18 Nov), the body's short code and the post instead: "APPSC Assistant Statistical Officer".
 */
function seoName(job: JobNotification): string {
  // the badge may say "APPSC · AP" when two bodies share a code (disambiguateCodes): the title uses the code
  const code = (job.orgShortCode || "").split(" · ")[0].trim();
  const strip = (t: string) => withoutAdvtNo(t.replace(/\s*,?\s*\(?\badvt\.?\s*(?:no\.?)?\s*[:.-]?\s*\d+\s+of\s+\d{4}\)?/gi, ""))
    .replace(/\s+,/g, ",").replace(/^(\S+),\s*/, "$1 ")
    .replace(/\s*,?\s*post\s+code[:\s]*[\w/.-]*\d[\w/.-]*/gi, "")
    .replace(/\s+(in|of|for|and|the|to|at|on|with|under|from|by)$/i, "").replace(/[\s,;:–-]+$/, "").trim();
  const base = strip(baseTitle(job));
  const rest = code && base.startsWith(code + " ") ? base.slice(code.length + 1) : base;
  if (!code || code.length > 16 || !opensWithBoilerplate(rest)) return base;
  // the body named again at the end ("Teaching Faculty at ESIC") goes
  const post = rowTitle(job).replace(/\s*…\s*$/, "").split(` at ${code}`).join("").split(` of ${code}`).join("").trim();
  if (!post || opensWithBoilerplate(post)) return base;
  return strip(post.toLowerCase().startsWith(code.toLowerCase() + " ") ? post : `${code} ${post}`);
}

/**
 * Search title of a job page, e.g. "KEA Junior Engineer (Civil) Recruitment 2026: 31 Posts, Last Date 26 Nov".
 * Kept to ~60 characters so it is not cut in results (11 Nov: 10 of 12 job pages checked ran past 70): first
 * without "Recruitment", then with the name shortened at a word. The site name is added by the layout template.
 */
export function jobSeoTitle(job: JobNotification): string {
  const base = seoName(job);
  const year = jobYear(job);
  const kind = /recruitment|notification|walk[\s-]?in/i.test(base) ? "" : job.isWalkIn ? " Walk-in" : " Recruitment";
  const withYear = (t: string) => (t.includes(year) ? t : `${t} ${year}`);
  const facts: string[] = [];
  if (job.totalVacancies) facts.push(`${job.totalVacancies.toLocaleString("en-IN")} Post${job.totalVacancies === 1 ? "" : "s"}`);
  if (job.applicationEndDate && !isJobApplicationClosed(job)) {
    facts.push(`${job.isWalkIn ? "Walk-in" : "Last Date"} ${dayMon(job.applicationEndDate)}`);
  }
  const join = (t: string, f: string[]) => (f.length ? `${t}: ${f.join(", ")}` : t);
  const fit = [join(withYear(base + kind), facts), join(withYear(base), facts), join(withYear(base + kind), facts.slice(0, 1))]
    .find((c) => c.length <= TITLE_MAX);
  if (fit) return fit;
  // the name shortened at a word so the year and facts stay whole (the last date is what people click for)
  const tail = join(base.includes(year) ? "" : ` ${year}`, facts);
  let name = base;
  // at least ~30 characters of name, so it stays recognisable ("CRPF Meritorious Sportsperson")
  const room = Math.max(30, TITLE_MAX - tail.length);
  if (name.length > room) {
    name = name.slice(0, room);
    name = name.slice(0, Math.max(name.lastIndexOf(" "), 16)).replace(/[\s,;:(–-]+$/, "");
    while (STOP_END.test(name)) name = name.replace(STOP_END, "");
  }
  return `${name}${tail}`;
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

/** Pay range from the stated pay ("37,640 – 1,15,500"), or null when it cannot be read safely (see lib/pay.ts). */
export function salaryRange(job: JobNotification): PayRange | null {
  return payRange(job.salary);
}

