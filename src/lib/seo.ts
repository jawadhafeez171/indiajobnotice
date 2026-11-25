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

/**
 * Search results show about 60-65 characters before cutting; the site name the layout adds comes after and may be
 * cut. 25 Nov: 60 cut the post itself ("KEA Assistant Public 2026" for Assistant Public Prosecutor), and those pages
 * sat at position 5 with 1% clicks; the post's name is what people search, so it comes first.
 */
const TITLE_MAX = 65;
const STOP_END = /\s+(?:in|of|for|and|or|the|to|at|on|with|under|from|by|against|as|cum|per|via|&|-|–|\/)$/i;
// Indic scripts (U+0900 Devanagari to U+0DFF Sinhala) with zero-width joiners and spaces between their words
const INDIC =/[ऀ-෿][ऀ-෿‌‍\s]*/g;

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

/** Brackets that close: an unclosed "(" and what follows go (or only the "(" when little would be left); a ")"
 *  with no "(" goes. 25 Nov: 61 of 838 titles ended inside a bracket ("… (Rec No.", "… (Music 2026"). */
function balanced(t: string): string {
  let out = "";
  const open: number[] = [];
  for (const ch of t) {
    if (ch === "(") { open.push(out.length); out += ch; }
    else if (ch === ")") { if (open.length) { open.pop(); out += ch; } }
    else out += ch;
  }
  while (open.length) {
    const i = open.pop() as number;
    out = i >= 20 ? out.slice(0, i) : out.slice(0, i) + out.slice(i + 1);
  }
  return out;
}

/** A title fit for a search result: one script (the Hindi half of "Stenographer Grade-2-ग्रेड-2" goes when English
 *  is there), brackets closed, no dangling advert-number stub or joining word at the end. */
function tidy(t: string): string {
  const latin = t.replace(INDIC, " ");
  let s = (latin.match(/[A-Za-z]{2,}/g) || []).length >= 2 ? latin : t;
  s = balanced(s.replace(/[-–]+(?=\s|\)|$)/g, " ").replace(/\(\s*\)/g, " ").replace(/\s{2,}/g, " "));
  for (let i = 0; i < 3; i++) {
    s = s.replace(/\s*\(?\b(?:rec(?:ruitment)?|advt|advertisement|notification|notice)\.?\s*no\.?\s*$/i, "")
      .replace(STOP_END, "").replace(/[\s,;:(–-]+$/, "").trim();
  }
  return s;
}

/** Search title of a job page, e.g. "KEA Junior Engineer (Civil) Recruitment 2026: 31 Posts, Last Date 26 Nov".
 *  Open: the last date always (what people click for), the number of posts when there is room, the name cut at a
 *  word when it must be (at least ~40 characters of it). Closed: the name whole, then the year and the posts.
 *  No second year when the name has one ("RPSC … - 2025" was "… - 2025 … 2026"). */
export function jobSeoTitle(job: JobNotification): string {
  const base = tidy(seoName(job));
  const year = jobYear(job);
  const kind = /recruitment|notification|walk[\s-]?in/i.test(base) ? "" : job.isWalkIn ? " Walk-in" : " Recruitment";
  const withYear = (t: string) => (/\b20\d\d\b/.test(base) ? t : `${t} ${year}`);
  const posts = job.totalVacancies ? `${job.totalVacancies.toLocaleString("en-IN")} Post${job.totalVacancies === 1 ? "" : "s"}` : "";
  const last = job.applicationEndDate && !isJobApplicationClosed(job)
    ? `${job.isWalkIn ? "Walk-in" : "Last Date"} ${dayMon(job.applicationEndDate)}` : "";
  const join = (t: string, f: string[]) => (f.filter(Boolean).length ? `${t}: ${f.filter(Boolean).join(", ")}` : t);
  const whole = last
    ? [join(withYear(base + kind), [posts, last]), join(withYear(base), [posts, last]), join(withYear(base), [last])]
    : [join(withYear(base + kind), [posts]), join(withYear(base), [posts]), withYear(base + kind), withYear(base)];
  const fit = whole.find((c) => c.length <= TITLE_MAX);
  if (fit) return fit;
  // the name cut at a word so that the tail stays whole: posts and last date, else the last date alone
  const cut = (room: number) => {
    if (base.length <= room) return base;
    const s = base.slice(0, room);
    return tidy(s.slice(0, Math.max(s.lastIndexOf(" "), 16)));
  };
  const tails = last ? [join(withYear(""), [posts, last]), join(withYear(""), [last])] : [join(withYear(""), [posts]), withYear("")];
  for (const tail of tails) {
    if (TITLE_MAX - tail.length >= 40) return `${cut(TITLE_MAX - tail.length)}${tail}`;
  }
  return `${cut(Math.max(30, TITLE_MAX - tails[tails.length - 1].length))}${tails[tails.length - 1]}`;
}

/** The body as people know it: its name up to the first comma ("Ministry of Finance, Department of Revenue, …" ->
 *  "Ministry of Finance"; "Bharat Heavy Electricals Limited (BHEL), Power Sector …" -> "… (BHEL)"). */
function orgLabel(job: JobNotification): string {
  const first = balanced((job.organization || "").split(/,\s+/)[0]).trim();
  return first.length >= 3 ? first : job.organization;
}

const DESC_MAX = 155;

/** Search description, kept to ~155 characters so Google does not cut it: the post and the body, posts and last date,
 *  who can apply; the closing line only when there is room. 25 Nov: 246 of 838 ran past 160, the body's full name
 *  and address first. */
export function jobSeoDescription(job: JobNotification): string {
  const posts = job.totalVacancies
    ? `${job.totalVacancies.toLocaleString("en-IN")} post${job.totalVacancies === 1 ? "" : "s"}`
    : "";
  const last = job.applicationEndDate
    ? isJobApplicationClosed(job)
      ? `applications closed on ${dayMon(job.applicationEndDate)} ${job.applicationEndDate.slice(0, 4)}`
      : `${job.isWalkIn ? "walk-in on" : "last date"} ${dayMon(job.applicationEndDate)} ${job.applicationEndDate.slice(0, 4)}`
    : "";
  const org = orgLabel(job);
  const name = tidy(seoName(job));
  const who = name.toLowerCase().includes(org.toLowerCase()) ? name : `${name}, ${org}`;
  const facts = [posts, last].filter(Boolean).join(", ");
  const qual = qualificationLabel(job) || "";
  const age = job.ageKnown !== false && job.maxAge > 0 ? formatAgeRange(job, "years").replace(/^Up to/, "up to") : "";
  const elig = (q: string, a: string) => ([q, a && `age ${a}`].filter(Boolean).length
    ? ` Eligibility: ${[q, a && `age ${a}`].filter(Boolean).join(", ")}.` : "");
  const tails = [" Fee, selection process and the official notification.", " Fee and the official notification.", ""];
  const lead = (w: string) => (facts ? `${w}: ${facts}.` : `${w}.`);
  for (const [w, e] of [[who, elig(qual, age)], [who, elig(qual, "")], [name, elig(qual, age)], [name, elig(qual, "")], [name, ""]]) {
    for (const t of tails) {
      const d = lead(w) + e + t;
      if (d.length <= DESC_MAX) return d;
    }
  }
  // a very long name: cut at a word, the facts kept
  const room = DESC_MAX - (facts ? facts.length + 3 : 1);
  const cut = tidy(name.slice(0, room).slice(0, Math.max(name.slice(0, room).lastIndexOf(" "), 20)));
  return lead(cut);
}

/** Pay range from the stated pay ("37,640 – 1,15,500"), or null when it cannot be read safely (see lib/pay.ts). */
export function salaryRange(job: JobNotification): PayRange | null {
  return payRange(job.salary);
}

