import React from "react";
import Link from "next/link";
import { JobNotification, JobStatus, ExamDateEntry, getJobCanonicalPath, formatAgeRange, daysUntil, stageSummary } from "@/data/jobs";
import { formatDateShort, getDaysRemaining, cn } from "@/lib/utils";
import { getStateBySlug } from "@/config/states";

/** Colour of the left stripe and the status word, one per stage. */
export const STATUS_STYLE: Record<JobStatus, { stripe: string; text: string; label: string }> = {
  APPLY_OPEN: { stripe: "bg-green-solid", text: "text-green", label: "Open" },
  LAST_DATE_NEAR: { stripe: "bg-saffron", text: "text-saffron", label: "Closing soon" },
  ADMIT_CARD_OUT: { stripe: "bg-navy", text: "text-navy", label: "Admit card" },
  RESULT_OUT: { stripe: "bg-purple", text: "text-purple", label: "Result" },
  UPCOMING: { stripe: "bg-faint", text: "text-navy", label: "Announced" },
  APPLICATIONS_CLOSED: { stripe: "bg-faint", text: "text-muted", label: "Closed" },
};

// Lowest level a qualification text asks for; specific degrees win over the generic level.
const SPECIFIC: [RegExp, string][] = [
  [/\bMBBS\b/i, "MBBS"],
  // abbreviations are case-sensitive: "be" / "ma" are ordinary words
  [/\bB\.\s?E\b|\bBE\b|\bB\.?\s?Tech/, "B.E./B.Tech"],
  [/\bLL\.?\s?B\b|law degree/i, "Law degree"],
  [/nursing|\bGNM\b|\bANM\b/i, "Nursing"],
];
const LEVELS: [RegExp, string][] = [
  [/\b(8th|class\s*viii)\b/i, "8th"],
  [/\b(10th|matric|sslc|class\s*x)\b|secondary school/i, "10th"],
  [/\bITI\b/, "ITI"],
  [/\b(12th|intermediate|higher secondary|class\s*xii|10\s*\+\s*2)\b|\b(PUC|HSC)\b/i, "12th"],
  [/diploma/i, "Diploma"],
  [/graduat|bachelor|\bdegree\b|\bB\.\s?(A|Sc|Com)\b|\bB(Sc|Com)\b/i, "Graduate"],
  [/post.?graduat|master'?s|\bMBA\b|\bM\.\s?(A|Sc|Com|Tech)\b|\bM(Sc|Com|Tech)\b/i, "Postgraduate"],
  [/\bPh\.?\s?D\b/, "PhD"],
];
// "Master's degree", "post graduate degree": not a plain graduate requirement
const PG_PHRASE = /(post[\s-]?graduat\w*|\bPG\b|master'?s?)(\s+degree)?|\bM\.?\s?(A|Sc|Com|Tech|Phil)\b\.?(\s+degree)?|\bMBA\b|\bPh\.?\s?D\b(\s+degree)?/gi;

function levelOf(text: string): string | null {
  for (const [re, label] of SPECIFIC) if (re.test(text)) return label;
  const withoutPg = text.replace(PG_PHRASE, " ");
  for (const [re, label] of LEVELS) {
    if (re.test(label === "Graduate" ? withoutPg : text)) return label;
  }
  return null;
}

/** "Graduate", "12th", "B.E./B.Tech", "Varies by post", or null when the notice gives nothing usable. */
export function qualificationLabel(job: JobNotification): string | null {
  const texts = job.posts?.length
    ? job.posts.map((p) => p.qualification).filter(Boolean)
    : job.qualifications.filter(Boolean);
  const levels = new Set(texts.map(levelOf).filter((l): l is string => !!l));
  if (levels.size === 1) return [...levels][0];
  if (levels.size > 1) return "Varies by post";
  return null;
}

/** Short title without a trailing "(196 Posts)": the posts are shown on their own. */
export function cleanTitle(job: JobNotification): string {
  return (job.shortTitle || job.title).replace(/\s*\(\s*[\d,]+\s+posts?\s*\)\s*$/i, "");
}

/** "Central", or the state's name (Karnataka, Andhra Pradesh…). */
export function placeLabel(job: JobNotification): string {
  return job.isCentral ? "Central" : getStateBySlug(job.stateSlug)?.name || job.stateSlug.toUpperCase();
}

/**
 * The official website a notice comes from ("kea.kar.nic.in"), or null. District courts and many
 * state bodies host files on the government's S3WaaS service, whose address names no body: say so.
 */
export function sourceHost(job: JobNotification): string | null {
  for (const u of [job.officialPdfUrl, job.applyOnlineUrl]) {
    try {
      if (!u) continue;
      const host = new URL(u).hostname.replace(/^www\./, "");
      return /(^|\.)s3waas\.gov\.in$/.test(host) ? "official gov.in website" : host;
    } catch {
      // not a full URL
    }
  }
  return null;
}

// wording in front of the post that says nothing about it
const TITLE_BOILERPLATE = [
  /^(notification|advertisement|notice)\s+(for|of|regarding)\s+(the\s+)?/i,
  /^(direct\s+)?recruitment\s+(to|for|of)\s+(the\s+)?(posts?\s+of\s+)?/i,
  /^(panel|engagement)\s+for\s+contract(ual)?\s+appointment\s+to\s+the\s+posts?\s+of\s+/i,
  /^applications?\s+(are\s+)?invited\s+for\s+(the\s+)?(posts?\s+of\s+)?/i,
  /^applications?\s+(are\s+)?invited\s+from\s+[^,]{3,60}?\s+for\s+(the\s+)?/i,
  /^panel\s+for\s+(appointment\s+)?(on\s+)?contract(ual)?\s+(basis\s+)?(appointment\s+)?(to|of|for)\s+(the\s+)?(posts?\s+of\s+)?/i,
  /^(appointment|engagement)\s+on\s+contract(ual)?\s+basis\s+(to|for|of)\s+(the\s+)?(posts?\s+of\s+)?/i,
  /^walk[- ]?in[- ]?interview\s+(for\s+)?(the\s+)?((engagement|appointment|selection|recruitment)\s+)?((of|for|to)\s+)?(the\s+)?(posts?\s+of\s+)?/i,
  /^(vacancy\s+)?notification\s+inviting\s+applications\s+for\s+(filling\s+up\s+of\s+)?(the\s+)?(posts?\s+of\s+)?/i,
  /^applications?\s+(are\s+)?invited\s+from\s+.{3,100}?\s+for\s+(appointment\s+)?(on\s+a?\s*contract\s+basis\s+)?(to|of|for)\s+(the\s+)?(posts?\s+of\s+)?/i,
  /^(essential\s+information\s+for\s+)?panel\s+formation\s+for\s+(appointment\s+to\s+)?/i,
  /^general\s+recruitment\s+for\s+the\s+posts?\s+of\s+/i,
  /^written\s+examination\s+for\s+(filling\s+up\s+of\s+)?/i,
  /^online\s+applications?\s+for\s+(the\s+)?(posts?\s+of\s+)?/i,
  /^(engagement|appointment|selection|filling\s+up)\s+of\s+(the\s+)?(posts?\s+of\s+)?/i,
  /^recruitment\s+notification\s+(for|of)\s+(the\s+)?(posts?\s+of\s+)?/i,
  /^posts?\s+of\s+/i,
];
// wording inside a title that the row says elsewhere (Contract / Deputation in the grey line, the
// grade in the notice) or that says nothing about the post
const TITLE_FILLER = [
  /\s+on\s+(a\s+)?(contract(ual)?|deputation|outsourcing|temporary|tenure)\s+basis\b/gi,
  /\s*\(general recruitment\)/gi,
  /\s+and\s+equivalent\s+(group[- ][a-d]\s+)?posts?\b/gi,
  /\s+in\s+various\s+(departments|disciplines)(\s+of\s+[A-Z][\w.]*)?/gi,
  /\s+in\s+level\s+\d+\s+of\s+(the\s+)?pay\s+matrix(\s*\(\s*7th\s+CPC\s*\))?/gi,
  /\b(full[- ]time\s*\/\s*part[- ]time|full[- ]time|part[- ]time)\s+/gi,
  /\bcontractual\s+/gi,
  // dates and codes: the job page has them
  /\s*,?\s*notification\s+(dated\s+[\d./-]+|[a-z0-9][\w/.-]*\d[\w/.-]*)/gi,
  /\s*,?\s*post\s+code[:\s]*[\w/.-]*\d[\w/.-]*/gi,
  /\s*\((jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}\)/gi,
  /\s*\((excluding|including|except)\b[^()]*\)/gi,
  /\s+direct\s+recruitment$/i,
];
// over this many characters a title is cut down to the post names, when the notice lists them
const LONG_TITLE = 70;
// still long: the employing department or service at the end goes (the badge names the body)
const TRAILING_DEPARTMENT =
  /(\s*,\s*(directorate|department|ministry)\s+of\s+[^,]+|\s+(in|under)\s+(the\s+)?((directorate|department|ministry)\s+of\s+[^,]+|[^,]{3,80}?\s+(department|sub[\s-]+(ordinate\s+)?services?|subordinate\s+services?|services?)))(\s*,\s*(directorate|department)\s+of\s+[^,]+)*\s*$/i;
// a post name's aside that names an employer ("(Uttarakhand Jal Vidyut Nigam Ltd)") or is a note
// ("(form lists L.D Typist)"), not the post
const EMPLOYER_ASIDE = /\s*\((?=[^()]*\b(ltd|limited|corporation|nigam|board|company|authority|university|council|form|as per|see|lists)\b)[^()]*\)/gi;
// the room the post names get in a list title
const NAMES_ROOM = 80;

/** Without the department / service it ends with, when that leaves a usable title. */
function withoutDepartment(t: string): string {
  const cut = t.replace(TRAILING_DEPARTMENT, "").trim();
  return cut.length >= 12 ? cut : t;
}
// a batch / exam code after a post name ("Navik (General Duty) - CGEPT-01/27")
const NAME_CODE = /\s*[-–]\s*[A-Z]{2,}[-\s]?\d[\w/-]*$/;

/** The posts a notice lists, as many as fit in a list title, then "+N more". */
function postNames(job: JobNotification): string {
  const names = [...new Set((job.posts || [])
    .map((p) => withoutDepartment((p.postName || "").replace(EMPLOYER_ASIDE, "").replace(NAME_CODE, "").trim()))
    .filter(Boolean))];
  let out = "";
  let n = 0;
  for (const name of names) {
    const next = out ? `${out}, ${name}` : name;
    if (n > 0 && next.length > NAMES_ROOM) break;
    out = next;
    n += 1;
  }
  return n < names.length ? `${out} +${names.length - n} more` : out;
}

/** "Contract" / "Deputation" for the row's grey line (the title no longer says it). */
export function termsLabel(job: JobNotification): string | null {
  if (/deputation/i.test(job.title)) return "Deputation";
  if (CONTRACT.test(job.title)) return "Contract";
  return null;
}

const CONTRACT = /contract(?!or)|outsourc|ad[- ]?hoc|locum|tenure|temporary|fixed[- ]term|guest\s+(?:faculty|lecturer|teacher)/i;
// retired people: the title, or a pay line written for them; a mention of ex-servicemen elsewhere is
// only a reservation or an age relaxation
const FOR_RETIRED = /\bretired\b|\bretd\b|superannuat|pensioner|re-?employ|ex-?servicem[ae]n/i;
const RETIRED_PAY = /\bretired\b|\bretd\b/i;
// a PSU goes by its registered name; ESIC, municipal and city corporations, co-operatives and banks
// (a type of their own) are not
const PSU = /\b(?:limited|ltd)\b|corporation|\bnigam\b|airports authority/i;
const NOT_PSU = /municipal|city corporation|greater \w+ corporation|employees'? state insurance|co-?operative|sahakari|\bbank\b/i;

// Medicine: the degrees the notice asks for, or the post itself (many notices give no qualification
// text). "MS" alone is left out: it also means MS Office. Bio-medical engineering is not medicine.
const MEDICAL_DEGREE = /\b(?:mbbs|m\.b\.b\.s|bds|bams|bhms|bums|dnb|gnm|anm|nursing|pharmacy|b\.?\s?pharm|d\.?\s?pharm|m\.?\s?pharm|medicine|dental|nmc)\b/i;
const MEDICAL_POST = /\b(?:medical officer|doctors?|nurses?|nursing|pharmacy officer|pharmacists?|physicians?|surgeons?|senior residents?|junior residents?|dentists?|dental|ayurved\w*|homoeo\w*|unani|medicine|consultants? \(doctor)/i;

/** Jobs for those with a medical, nursing or pharmacy qualification. */
export function isMedicalJob(j: JobNotification): boolean {
  const quals = [...j.qualifications, ...(j.posts || []).map((p) => p.qualification)].join(" ");
  if (MEDICAL_DEGREE.test(quals.replace(/bio-?medical/gi, ""))) return true;
  return MEDICAL_POST.test([j.title, ...(j.posts || []).map((p) => p.postName)].join(" "));
}

/** The kinds of job in the job list's "Type of job" filter, beside its sectors. */
export const JOB_KINDS: { value: string; label: string; test: (job: JobNotification) => boolean }[] = [
  {
    value: "contract",
    label: "Contract jobs",
    test: (j) => termsLabel(j) === "Contract" || CONTRACT.test([...j.keyHighlights, ...(j.posts || []).map((p) => p.postName)].join(" ")),
  },
  { value: "retired", label: "For retired people", test: (j) => FOR_RETIRED.test(j.title) || RETIRED_PAY.test(j.salary) },
  { value: "walkin", label: "Walk-in interviews", test: (j) => !!j.isWalkIn || /walk[- ]?in/i.test(j.title) },
  { value: "psu", label: "PSU jobs", test: (j) => PSU.test(j.organization) && !NOT_PSU.test(j.organization) },
];
// a title that names no post at all: the posts the notice lists say more
const GENERIC_TITLE = /^(employment|recruitment|job|vacancy)\s+(notification|notice|advertisement)\b[^a-z]*$/i;
// advertisement / notice numbers ("Advt. No. 25/2025", "(Advt. 01/2026)", "Notification No. 12/2025"):
// lists leave them to the job page
const ADVT_NO = [
  /\s*[([]?\s*\b(?:advt\.?|advertisement)\s*(?:no\.?|number)?\s*[:.-]?\s*(?=[\w/.-]*\d)[\w/.-]+(?:\s*(?:dated|dt\.?)\s*[\d/.-]+)?\s*[)\]]?/gi,
  /\s*[([]?\s*\b(?:(?:employment|recruitment)\s+)?(?:notification|notice)\s+(?:no\.?|number)\s*[:.-]?\s*(?=[\w/.-]*\d)[\w/.-]+\s*[)\]]?/gi,
];
export function withoutAdvtNo(t: string): string {
  for (const re of ADVT_NO) t = t.replace(re, " ");
  return t.replace(/\(\s*\)/g, "").replace(/\s{2,}/g, " ").replace(/^[\s,;:–—-]+|[\s,;:–—-]+$/g, "").trim();
}

/**
 * Title for lists that already show the body: the post first ("Assistant Statistical Officer in
 * A.P. Economics…"), from the full title (the stored short title is often cut before the post);
 * the layout clips it to two lines.
 */
export function rowTitle(job: JobNotification): string {
  let t = (job.title || "").trim();
  const org = job.organization || "";
  if (org && t.toLowerCase().startsWith(org.toLowerCase())) t = t.slice(org.length).replace(/^[\s,:–—-]+/, "");
  const code = job.orgShortCode;
  if (code && t.startsWith(code + " ")) t = t.slice(code.length + 1);
  for (let i = 0; i < 3; i++) for (const re of TITLE_BOILERPLATE) t = t.replace(re, "");
  t = t.replace(/\s*\(\s*[\d,]+\s+posts?\s*\)\s*$/i, "").trim();
  for (const re of TITLE_FILLER) t = t.replace(re, " ");
  t = t.replace(/\s+([,)])/g, "$1").replace(/\s{2,}/g, " ").replace(/^[\s,;:–—-]+|[\s,;:–—-]+$/g, "").trim();
  const withNo = t;
  t = withoutAdvtNo(t);
  const postList = postNames(job);
  if (GENERIC_TITLE.test(t) && postList) t = postList;
  // a long title: first without the department or service it ends with; still long, the post names
  if (t.length > LONG_TITLE) t = withoutDepartment(t);
  if (t.length > LONG_TITLE && postList && postList.length < t.length - 10) t = postList;
  if (t.length < 6) {
    // nothing left but the number: the posts, else the short title without it, else as published
    const short = withoutAdvtNo(cleanTitle(job));
    const shortNoCode = code && (short === code || short.startsWith(code + " ")) ? short.slice(code.length + 1) : short;
    t = postList || (shortNoCode.length >= 6 ? shortNoCode : withNo);
  }
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** "in 3 days" / "Tomorrow" / "Today" for an exam date. */
export function examWhen(date: string): string {
  const d = daysUntil(date);
  return d <= 0 ? "Today" : d === 1 ? "Tomorrow" : `in ${d} days`;
}

/**
 * "Answer key out · result awaited · 04 Nov" as the stage and the date, one per line ("result
 * awaited" follows from the stage): a narrow date column would otherwise break it anywhere.
 */
function StageLines({ text }: { text: string }) {
  const parts = text.split(" · ");
  if (parts.length < 2) return <>{text}</>;
  const shown = parts.length > 2 ? [parts[0], parts[parts.length - 1]] : parts;
  return <>{shown.map((p, i) => <span key={i} className="block">{p}</span>)}</>;
}

/** How soon a last date is, and whether that is close enough to stand out (a week or less). */
export function closesIn(date: string): { text: string; urgent: boolean } | null {
  const d = getDaysRemaining(date);
  if (d < 0) return null;
  return { text: d === 0 ? "Closes today" : d === 1 ? "Closes tomorrow" : `${d} days left`, urgent: d <= 7 };
}

export function JobDeadline({ job, exam }: { job: JobNotification; exam?: ExamDateEntry | null }) {
  if (exam) {
    return (
      <>
        <span className="text-ink-2">
          Exam <b className="text-ink">{formatDateShort(exam.date)}</b>
          {exam.tentative && <span className="text-muted"> (tentative)</span>}
        </span>
        <span className="text-[12px] font-semibold text-navy">{examWhen(exam.date)}</span>
      </>
    );
  }
  const open = job.status === "APPLY_OPEN" || job.status === "LAST_DATE_NEAR";
  if (job.status === "UPCOMING" && job.applicationStartDate) {
    return (
      <>
        <span className="text-ink-2">Opens <b className="text-ink">{formatDateShort(job.applicationStartDate)}</b></span>
        {job.applicationEndDate && (
          <span className="text-[12px] text-muted">Last date {formatDateShort(job.applicationEndDate)}</span>
        )}
      </>
    );
  }
  if (open && job.applicationEndDate) {
    const soon = closesIn(job.applicationEndDate);
    return (
      <>
        <span className="text-ink-2">
          {job.isWalkIn && "Walk-in "}
          <b className="text-ink">{formatDateShort(job.applicationEndDate)}</b>
        </span>
        {soon && (
          <span className={cn("text-[12px]", soon.urgent ? "font-semibold text-saffron" : "text-muted")}>{soon.text}</span>
        )}
      </>
    );
  }
  const stage = job.inProgress ? stageSummary(job) : null;
  const text = stage
    ? stage
    : job.status === "ADMIT_CARD_OUT"
      ? job.examDate ? `Admit card out · exam ${formatDateShort(job.examDate)}` : "Admit card out"
      : job.status === "RESULT_OUT"
        ? "Result out"
        : stageSummary(job) || (open ? "Last date: see notification" : "Applications closed");
  return (
    <span className={cn("font-bold", STATUS_STYLE[job.status]?.text || "text-ink-2")}>
      <StageLines text={text} />
    </span>
  );
}

interface Props {
  job: JobNotification;
  /** Extra chips after the facts (district quota, etc.). */
  extra?: React.ReactNode;
  /** Show this exam date on the bottom line instead of the last date. */
  exam?: ExamDateEntry | null;
  /** Top-right control (e.g. save button); sits above the card's link. */
  action?: React.ReactNode;
  className?: string;
}

/**
 * Job card with a stage-coloured stripe: organisation, title, key facts as chips, then the
 * deadline (or the stage). The whole card is the link; `action` stays clickable on top.
 */
export function JobListCard({ job, extra, exam, action, className }: Props) {
  const style = STATUS_STYLE[job.status] || STATUS_STYLE.UPCOMING;
  const qual = qualificationLabel(job);
  const age = job.ageKnown !== false && job.maxAge > 0 ? formatAgeRange(job) : null;
  const chips = [
    job.totalVacancies ? `${job.totalVacancies.toLocaleString("en-IN")} post${job.totalVacancies === 1 ? "" : "s"}` : null,
    qual,
    age,
  ].filter(Boolean) as string[];

  return (
    <article
      className={cn(
        "group relative h-full flex flex-col rounded-xl bg-surface border border-line shadow-2xs overflow-hidden pl-5 pr-4 py-3.5 transition-colors hover:border-navy/50",
        className
      )}
    >
      <span className={cn("absolute left-0 inset-y-0 w-1.5", style.stripe)} aria-hidden />

      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 min-w-0">
          <abbr title={job.organization} className="shrink-0 no-underline px-1.5 py-0.5 rounded bg-navy-tint text-navy font-bold text-[12px] leading-none border border-navy-line">
            {job.orgShortCode}
          </abbr>
          <span className="text-[12px] text-muted truncate">{placeLabel(job)}</span>
        </span>
        <span className="flex items-center gap-1.5 shrink-0">
          <span className={cn("text-[12px] font-bold", style.text)}>{style.label}</span>
          {action && <span className="relative z-10">{action}</span>}
        </span>
      </div>

      <h3 className="mt-1.5 font-bold text-[15px] sm:text-base leading-snug text-ink line-clamp-2 group-hover:text-navy">
        <Link href={getJobCanonicalPath(job)} className="after:absolute after:inset-0">
          {/* "(196 Posts)" at the end repeats the posts chip */}
          {rowTitle(job)}
        </Link>
      </h3>

      {(chips.length > 0 || extra) && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {chips.map((c) => (
            <span key={c} className="px-2 py-0.5 rounded-full bg-subtle border border-line-soft text-[12px] text-ink-2">
              {c}
            </span>
          ))}
          {extra}
        </div>
      )}

      <div className="mt-auto pt-2.5">
        <div className="pt-2.5 border-t border-line-soft flex items-center justify-between gap-2 text-[13px]">
          <JobDeadline job={job} exam={exam} />
        </div>
      </div>
    </article>
  );
}


/**
 * The date that matters and how soon, on one line at the end of a list row's second line:
 * "05 Nov · today", "Walk-in 19 Nov · 14 days left", "Exam 11 Nov · in 6 days", "Answer key out · 04 Nov".
 */
function RowDate({ job, exam }: { job: JobNotification; exam?: ExamDateEntry | null }) {
  const open = job.status === "APPLY_OPEN" || job.status === "LAST_DATE_NEAR";
  if (exam) {
    return (
      <>
        <span className="text-muted">Exam </span>
        <b className="text-ink">{formatDateShort(exam.date)}</b>
        <span className="font-semibold text-navy"> · {examWhen(exam.date).toLowerCase()}</span>
      </>
    );
  }
  if (job.status === "UPCOMING" && job.applicationStartDate) {
    return (
      <>
        <span className="text-muted">Opens </span>
        <b className="text-ink">{formatDateShort(job.applicationStartDate)}</b>
        {job.applicationEndDate && <span className="text-muted"> · closes {formatDateShort(job.applicationEndDate)}</span>}
      </>
    );
  }
  if (open && job.applicationEndDate) {
    const soon = closesIn(job.applicationEndDate);
    return (
      <>
        {job.isWalkIn && <span className="text-muted">Walk-in </span>}
        <b className="text-ink">{formatDateShort(job.applicationEndDate)}</b>
        {soon && (
          <span className={soon.urgent ? "font-semibold text-saffron" : "text-muted"}>
            {" · "}{soon.text.replace("Closes ", "")}
          </span>
        )}
      </>
    );
  }
  const style = STATUS_STYLE[job.status] || STATUS_STYLE.UPCOMING;
  const stage = job.inProgress ? stageSummary(job) : null;
  if (stage) {
    // the stage and its date ("result awaited" follows from the stage)
    const parts = stage.split(" · ");
    return <span className="font-semibold text-ink-2">{parts.length > 2 ? `${parts[0]} · ${parts[parts.length - 1]}` : stage}</span>;
  }
  return <span className={cn("font-bold", style.text)}>{style.label}</span>;
}

/** What a screen reader hears after a row's title: the date that matters, as the row shows it. */
function deadlineText(job: JobNotification, exam?: ExamDateEntry | null): string {
  const open = job.status === "APPLY_OPEN" || job.status === "LAST_DATE_NEAR";
  if (exam) return `exam ${formatDateShort(exam.date)}`;
  if (job.status === "UPCOMING" && job.applicationStartDate) {
    const end = job.applicationEndDate ? `, last date ${formatDateShort(job.applicationEndDate)}` : "";
    return `opens ${formatDateShort(job.applicationStartDate)}${end}`;
  }
  if (open && job.applicationEndDate) return `${job.isWalkIn ? "walk-in" : "last date"} ${formatDateShort(job.applicationEndDate)}`;
  return (job.inProgress && stageSummary(job)) || (STATUS_STYLE[job.status] || STATUS_STYLE.UPCOMING).label;
}

/**
 * Compact list row (phones and tablets): stage dot and the title (with the body's code) across the
 * whole width, then one line of facts with the date and `action` at its end (the facts give way first).
 * The full name and the age are on the job page. No box; rows are separated by lines. The whole row is
 * the link; `action` sits on top.
 */
export function JobRow({ job, exam, action, title, showStage = false, note }: {
  job: JobNotification;
  exam?: ExamDateEntry | null;
  action?: React.ReactNode;
  /** The title to show, when the list needs a fuller one than rowTitle (two look-alike rows). */
  title?: string;
  /** Say the stage in words (lists that mix stages: All, search results); the dot alone is colour only. */
  showStage?: boolean;
  /** What changed today ("New", "Result"), shown before the title in the Today list. */
  note?: string;
}) {
  const style = STATUS_STYLE[job.status] || STATUS_STYLE.UPCOMING;
  // phones keep the short facts, so the line is not cut off: terms and qualification are on the job page
  const meta = [
    { text: showStage ? style.label : null },
    { text: placeLabel(job) },
    { text: termsLabel(job), wide: true },
    { text: job.totalVacancies ? `${job.totalVacancies.toLocaleString("en-IN")} post${job.totalVacancies === 1 ? "" : "s"}` : null },
    { text: qualificationLabel(job), wide: true },
  ].filter((m) => m.text);

  return (
    <div className="relative flex gap-3 pl-3 pr-1.5 pt-3 pb-1.5 hover:bg-subtle active:bg-subtle transition-colors">
      <span aria-hidden className={cn("mt-[7px] w-2 h-2 rounded-full shrink-0", style.stripe)} />
      <div className="min-w-0 flex-1">
        <Link
          href={getJobCanonicalPath(job)}
          className="block pr-1.5 font-semibold text-[14px] leading-snug text-ink line-clamp-2 after:absolute after:inset-0"
        >
          {note && <span className="text-saffron font-bold">{note} · </span>}
          <b className="text-navy">{job.orgShortCode}</b> {title ?? rowTitle(job)}
          <span className="sr-only">, {job.organization}, {deadlineText(job, exam)}</span>
        </Link>
        <div className="flex items-center gap-2 text-[11px] leading-tight">
          <p className="min-w-0 flex-1 truncate text-muted">
            {meta.map((m, i) => (
              <span key={m.text} className={m.wide ? "hidden sm:inline" : undefined}>{i > 0 && " · "}{m.text}</span>
            ))}
          </p>
          <p className="shrink-0 whitespace-nowrap">
            <RowDate job={job} exam={exam} />
          </p>
          {action && <span className="relative z-10 shrink-0">{action}</span>}
        </div>
      </div>
    </div>
  );
}
