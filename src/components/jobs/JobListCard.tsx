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
  /^posts?\s+of\s+/i,
];
// a title that names no post at all: the posts the notice lists say more
const GENERIC_TITLE = /^(employment|recruitment|job|vacancy)\s+(notification|notice|advertisement)\b[^a-z]*$/i;

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
  if (GENERIC_TITLE.test(t)) {
    const names = [...new Set((job.posts || []).map((p) => p.postName).filter(Boolean))];
    if (names.length) t = names.slice(0, 2).join(", ") + (names.length > 2 ? ` and ${names.length - 2} more posts` : "");
  }
  if (t.length < 6) {
    const short = cleanTitle(job);
    return code && short.startsWith(code + " ") ? short.slice(code.length + 1) : short;
  }
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** "in 3 days" / "Tomorrow" / "Today" for an exam date. */
export function examWhen(date: string): string {
  const d = daysUntil(date);
  return d <= 0 ? "Today" : d === 1 ? "Tomorrow" : `in ${d} days`;
}

export function JobDeadline({ job, exam }: { job: JobNotification; exam?: ExamDateEntry | null }) {
  if (exam) {
    return (
      <>
        <span className="text-ink-2">
          Exam <b className="text-ink">{formatDateShort(exam.date)}</b>
          {exam.tentative && <span className="text-muted"> (tentative)</span>}
        </span>
        <span className="px-2 py-0.5 rounded-full font-bold text-[12px] bg-navy-tint text-navy">{examWhen(exam.date)}</span>
      </>
    );
  }
  const open = job.status === "APPLY_OPEN" || job.status === "LAST_DATE_NEAR";
  const daysLeft = getDaysRemaining(job.applicationEndDate);
  if (open && job.applicationEndDate) {
    return (
      <>
        <span className="text-ink-2">
          {job.isWalkIn ? "Walk-in" : "Last date"} <b className="text-ink">{formatDateShort(job.applicationEndDate)}</b>
        </span>
        {daysLeft >= 0 && (
          <span
            className={cn(
              "px-2 py-0.5 rounded-full font-bold text-[12px]",
              job.status === "LAST_DATE_NEAR" ? "bg-saffron-solid text-white" : "bg-green-tint text-green"
            )}
          >
            {daysLeft === 0 ? "Closes today" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`}
          </span>
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
  return <span className={cn("font-bold", STATUS_STYLE[job.status]?.text || "text-ink-2")}>{text}</span>;
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

      <h3 className="mt-1.5 font-serif font-bold text-[15px] sm:text-base leading-snug text-ink line-clamp-2 group-hover:text-navy">
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


/** Right-hand column of a list row: the date that matters and how far away it is. */
function RowDate({ job, exam }: { job: JobNotification; exam?: ExamDateEntry | null }) {
  const open = job.status === "APPLY_OPEN" || job.status === "LAST_DATE_NEAR";
  if (exam) {
    return (
      <>
        <span className="text-[12px] text-muted">Exam</span>
        <b className="text-[14px] text-ink">{formatDateShort(exam.date)}</b>
        <span className="text-[12px] font-semibold text-navy">{examWhen(exam.date)}</span>
      </>
    );
  }
  if (open && job.applicationEndDate) {
    const d = getDaysRemaining(job.applicationEndDate);
    return (
      <>
        <span className="text-[12px] text-muted">{job.isWalkIn ? "Walk-in" : "Last date"}</span>
        <b className="text-[14px] text-ink">{formatDateShort(job.applicationEndDate)}</b>
        {d >= 0 && (
          <span className={cn("text-[12px] font-bold", job.status === "LAST_DATE_NEAR" ? "px-1.5 rounded bg-saffron-solid text-white" : "text-green")}>
            {d === 0 ? "Today" : `${d} day${d === 1 ? "" : "s"} left`}
          </span>
        )}
      </>
    );
  }
  const style = STATUS_STYLE[job.status] || STATUS_STYLE.UPCOMING;
  const stage = job.inProgress ? stageSummary(job) : null;
  return stage
    ? <span className="text-[12px] font-semibold text-ink-2 text-right">{stage}</span>
    : <span className={cn("text-[12px] font-bold", style.text)}>{style.label}</span>;
}

/** What a screen reader hears after a row's title: the date that matters, as the row shows it. */
function deadlineText(job: JobNotification, exam?: ExamDateEntry | null): string {
  const open = job.status === "APPLY_OPEN" || job.status === "LAST_DATE_NEAR";
  if (exam) return `exam ${formatDateShort(exam.date)}`;
  if (open && job.applicationEndDate) return `${job.isWalkIn ? "walk-in" : "last date"} ${formatDateShort(job.applicationEndDate)}`;
  return (job.inProgress && stageSummary(job)) || (STATUS_STYLE[job.status] || STATUS_STYLE.UPCOMING).label;
}

/**
 * Compact list row (phones and tablets): stage dot, title, one grey line of facts, the date on
 * the right. No box; rows are separated by lines. The whole row is the link; `action` sits on top.
 */
export function JobRow({ job, exam, action, title, showStage = false }: {
  job: JobNotification;
  exam?: ExamDateEntry | null;
  action?: React.ReactNode;
  /** The title to show, when the list needs a fuller one than rowTitle (two look-alike rows). */
  title?: string;
  /** Say the stage in words (lists that mix stages: All, search results); the dot alone is colour only. */
  showStage?: boolean;
}) {
  const style = STATUS_STYLE[job.status] || STATUS_STYLE.UPCOMING;
  const qual = qualificationLabel(job);
  const age = job.ageKnown !== false && job.maxAge > 0 ? formatAgeRange(job) : null;
  const host = sourceHost(job);
  const meta = [
    showStage ? style.label : null,
    placeLabel(job),
    job.totalVacancies ? `${job.totalVacancies.toLocaleString("en-IN")} post${job.totalVacancies === 1 ? "" : "s"}` : null,
    qual,
    age,
  ].filter(Boolean);

  return (
    <div className="relative flex gap-3 px-3 py-3 hover:bg-subtle active:bg-subtle transition-colors">
      <span aria-hidden className={cn("mt-[7px] w-2 h-2 rounded-full shrink-0", style.stripe)} />
      <div className="min-w-0 flex-1">
        <Link
          href={getJobCanonicalPath(job)}
          className="font-semibold text-[15px] leading-snug text-ink line-clamp-2 after:absolute after:inset-0"
        >
          <b className="text-navy">{job.orgShortCode}</b> {title ?? rowTitle(job)}
          <span className="sr-only">, {job.organization}, {deadlineText(job, exam)}</span>
        </Link>
        <p className="mt-1 text-[12px] text-ink-2 truncate">
          {job.organization}
          {host && host !== "official gov.in website" && <span className="text-faint"> · {host}</span>}
        </p>
        <p className="mt-0.5 text-[12px] text-muted line-clamp-2">{meta.join(" · ")}</p>
      </div>
      <div className="shrink-0 w-[92px] flex flex-col items-end text-right leading-tight gap-0.5">
        <RowDate job={job} exam={exam} />
        {action && <span className="relative z-10 mt-1">{action}</span>}
      </div>
    </div>
  );
}
