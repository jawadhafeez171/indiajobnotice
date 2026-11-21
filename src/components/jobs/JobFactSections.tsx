import React from "react";
import Link from "next/link";
import { BellRing, CheckCircle2, ChevronDown, Circle, CircleDot, ExternalLink, FileText } from "lucide-react";
import {
  JobNotification, StageKind, ageText, formatFee, getJobCanonicalPath, isJobApplicationClosed, stageDatesText, stageEvent, stageText, todayIST,
} from "@/data/jobs";
import { formatDate, getDaysRemaining } from "@/lib/utils";
import { getJobCategoryMatrix, CategoryStatutoryMatrixItem } from "@/lib/exam-details";
import { AgeCheck } from "./AgeCheck";
import { qualificationLabel } from "./JobListCard";
import {
  ApplySteps, DataTable, DocumentsList, FeeTable, Helpline, OtherConditions, PageRef, PhysicalTable, RelaxationTable, extraDates,
} from "./NoticeTables";

// The job's facts in the order candidates look for them, each said once: the dates, the posts, who can
// apply, the fee and how to apply, the selection process. Only what the notification states; the rest says so.
// Sections are separated by a rule and space, not boxed: the page reads as one document (11 Nov, owner's
// "too cluttered").

export const sectionCls = "scroll-mt-28 md:scroll-mt-36 border-t border-line pt-7";
export const h2Cls = "font-serif text-xl font-bold text-ink";
export const h3Cls = "text-sm font-bold text-ink";

/** A folded part: its title is the tap target; the content is there for whoever wants it. */
export function Fold({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <details className={`group ${className}`}>
      <summary className="flex items-center gap-1.5 min-h-[44px] cursor-pointer list-none text-sm font-bold text-navy hover:text-saffron [&::-webkit-details-marker]:hidden">
        <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" aria-hidden />
        {title}
      </summary>
      <div className="pt-2">{children}</div>
    </details>
  );
}

/**
 * A notice's run-on wording as one line per group: "Rs 750 (general…); Rs 500 (SC, ST…); Rs 250 (PwBD)"
 * and "maximum 40 years (general), 43 years (Cat 2A…), 45 years (SC, ST…)" become lists. A comma after a
 * bracket splits only when a new amount follows ("Junior Engineer (Electric), NDMC" stays one line).
 */
function Groups({ text }: { text: string }) {
  const parts = text.split(/;\s+|(?<=\)),\s+(?=(?:₹|Rs\.?\s*)?\d)/).map((t) => t.trim()).filter(Boolean);
  if (parts.length < 2) return <p className="mt-1 text-sm text-ink-2 max-w-prose">{text}</p>;
  return (
    <ul className="mt-1 space-y-1 text-sm text-ink-2 max-w-prose list-disc pl-5 marker:text-faint">
      {parts.map((t, i) => <li key={i}>{t.charAt(0).toUpperCase() + t.slice(1)}</li>)}
    </ul>
  );
}

/** Web addresses in a notice's wording as links named by their site ("dsssbonline.nic.in"). */
export function Linked({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s;,)]+)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (!/^https?:\/\//.test(p)) return <React.Fragment key={i}>{p}</React.Fragment>;
        let host = p;
        try { host = new URL(p).hostname.replace(/^www\./, ""); } catch { /* keep the address as written */ }
        return <a key={i} href={p} target="_blank" rel="noreferrer" className="font-semibold text-navy underline underline-offset-2 hover:text-saffron">{host}</a>;
      })}
    </>
  );
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
  "October", "November", "December"];

/** "08 Jan 2027", "January 2027", the notice's own short words, or "To be announced" for a long sentence. */
export function examWhen(e: NonNullable<JobNotification["exams"]>[number]): string {
  if (e.precision === "day") return formatDate(e.date);
  if (e.precision === "month") return `${MONTHS[Number(e.date.slice(5, 7)) - 1]} ${e.date.slice(0, 4)}`;
  return e.text && e.text.length <= 32 ? e.text : "To be announced";
}

const KIND_LABEL: Record<StageKind, string> = {
  schedule: "Exam schedule",
  admit_card: "Admit card",
  answer_key: "Answer key",
  result: "Result",
  final_result: "Final result",
};
// the page of each released stage (admit card, answer key, result)
const KIND_PAGE: Partial<Record<StageKind, string>> = {
  admit_card: "admit-card",
  answer_key: "answer-key",
  result: "result",
  final_result: "result",
};

type When = "done" | "now" | "next";
export interface Step {
  key: string;
  label: string;
  /** YYYY-MM-DD or YYYY-MM for the order; "" for a step with no date yet (it goes last). */
  sortKey: string;
  when: When;
  value: React.ReactNode;
  /** an official document: its summary, its PDF and its page here */
  doc?: { summary: string; url: string; page?: string; examDates?: string[]; copyName?: string; datesText?: string };
}

const MARK: Record<When, { icon: typeof Circle; cls: string; sr: string }> = {
  done: { icon: CheckCircle2, cls: "text-green", sr: "done" },
  now: { icon: CircleDot, cls: "text-navy", sr: "now" },
  next: { icon: Circle, cls: "text-faint", sr: "to come" },
};

/** Our stored copy of a notice sent by hand; the official page sits beside it. */
export function CopyLink({ name }: { name: string }) {
  return (
    <a href={`/pdf/${name}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 py-1 text-navy hover:text-saffron">
      PDF (our copy) <FileText className="w-3.5 h-3.5" aria-hidden />
    </a>
  );
}

/** Applications open on a day still to come: the notice is out, applying is not possible yet. */
export function opensLater(job: JobNotification): string {
  const start = job.applicationStartDate;
  return start && !job.isWalkIn && !isJobApplicationClosed(job) && start > todayIST() ? start : "";
}

/** The dates section's name: the documents since, once applications have closed. */
export function datesHeading(job: JobNotification): string {
  return isJobApplicationClosed(job) ? "Dates and documents" : "Important dates";
}

/** Whether "Who can apply" has anything the notice states (a closed recruitment without it shows none). */
export function hasEligibility(job: JobNotification): boolean {
  return !isJobApplicationClosed(job) || (job.qualifications || []).some(Boolean) || (job.ageLimits || []).length > 0
    || !/^see notification/i.test(ageText(job).trim());
}

/** The fee and how to apply: only while applications are open or still to open. */
export function hasFeeSection(job: JobNotification): boolean {
  return !isJobApplicationClosed(job);
}

// --- the facts at a glance ------------------------------------------------------------------------

/** The fee in a few words: "₹100", "₹250–₹750, by category", "₹100; some exempt", else "See below". */
function feeSummary(job: JobNotification): string {
  const t = formatFee(job).replace(/\bRs\.?\s*/gi, "₹").trim();
  if (t.length <= 16) return t;
  const amounts = [...new Set([...t.matchAll(/₹\s?([\d,]+)/g)].map((m) => Number(m[1].replace(/,/g, ""))))].sort((a, b) => a - b);
  if (!amounts.length) return "See below";
  const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  const money = amounts.length === 1 ? rupees(amounts[0]) : `${rupees(amounts[0])}–${rupees(amounts[amounts.length - 1])}`;
  if (/\b(nil|exempt\w*|no fee|free)\b/i.test(t)) return `${money}; some exempt`;
  return amounts.length > 1 ? `${money}, by category` : money;
}

/** The age limit in a few words, from the printed limits: "18–27 years", "Up to 27 or 32 years, by post". */
function ageSummary(job: JobNotification): string {
  const limits = job.ageLimits || [];
  if (limits.length) {
    const maxes = [...new Set(limits.map((l) => l.max))].sort((a, b) => a - b);
    const mins = new Set(limits.map((l) => l.min || 0));
    const min = mins.size === 1 ? [...mins][0] : 0;
    if (maxes.length === 1) return min ? `${min} to ${maxes[0]} years` : `Up to ${maxes[0]} years`;
    // the general limit, said as such: a relaxed category's higher limit is not everyone's (PwBD 45 vs General 28)
    const lows = [...mins].filter(Boolean);
    // a relaxed category that names General ("PwBD (General/EWS)", "Ex-servicemen (General)") is not the general limit
    const relaxed = /pwbd|pwd|\bph\b|disab|divyang|ex-?s|ex-?serv|widow|sport|meritorious|depart|in-?service|govt\.? ?emp/i;
    const general = limits.filter((l) => !relaxed.test(l.category || "") && (!l.category || /gen|unreserved|\bur\b|\bgm\b|open|other/i.test(l.category)));
    const byPost = new Set(general.map((l) => l.post || ""));
    if (general.length && byPost.size > 1 && !byPost.has("")) {
      const ranges = [...new Set(general.map((l) => (l.min ? `${l.min}–${l.max}` : `up to ${l.max}`)))];
      if (ranges.length > 3) return "Differs by post";
      if (ranges.length > 1) return `${ranges.join(" or ")} years, by post`;
    }
    const gMax = [...new Set((general.length ? general : limits).map((l) => l.max))].sort((a, b) => a - b);
    const range = gMax.length === 1 ? `${gMax[0]}` : `${gMax[0]}–${gMax[gMax.length - 1]}`;
    const from = lows.length ? `${Math.min(...lows)} to ${range}` : `Up to ${range}`;
    return `${from} years${general.length ? " (General; more for some)" : " (varies)"}`;
  }
  const t = ageText(job).trim();
  if (t && t.length <= 24) return t;
  // the printed wording's own numbers: "18 to 23 years as on…" -> "18–23 years"; "General 40 years; … 45 years" -> "Up to 40–45 years, varies"
  const range = t.match(/\b(\d{2})\s*(?:to|-|–)\s*(\d{2})\s*years/i);
  if (range) return `${range[1]}–${range[2]} years`;
  // a printed minimum is not one of the upper limits
  const minimum = t.match(/\bmin(?:imum)?\.?\s*(?:age\s*)?(?:of\s*)?(\d{2})/i);
  const minAge = minimum ? Number(minimum[1]) : 0;
  const ages = [...new Set([...t.matchAll(/\b(\d{2})\s*years/gi)].map((m) => Number(m[1])))].filter((a) => a !== minAge).sort((a, b) => a - b);
  if (minAge && ages.length === 1) return `${minAge} to ${ages[0]} years`;
  // several printed upper limits: the lowest is the general one, the others are relaxations
  if (minAge && ages.length > 1) return `${minAge} to ${ages[0]} years (General; more for some)`;
  if (ages.length === 1) return `Up to ${ages[0]} years`;
  // several upper limits ("General 40 years; SC/ST 45 years") are maximums, not a range from 40
  if (ages.length > 1) return `Up to ${ages[0]} years (General; more for some)`;
  return /^see notification/i.test(t) || !t ? "See notification" : "See below";
}

/** The page's main link is one of its later documents (an eligibility list...), not the advertisement. */
export function documentOnly(job: JobNotification): boolean {
  return Boolean(job.officialPdfUrl) && (job.stages || []).some((s) => s.url === job.officialPdfUrl);
}

export interface GlanceFact { label: string; value: string; note?: string; href?: string; strong?: boolean }

/** The few facts that decide whether to apply, in a few words each; the sections below give the detail. */
export function glanceFacts(job: JobNotification): GlanceFact[] {
  const closed = isJobApplicationClosed(job);
  const end = job.applicationEndDate;
  const out: GlanceFact[] = [];
  if (job.totalVacancies > 0) out.push({ label: "Posts", value: job.totalVacancies.toLocaleString("en-IN"), href: "#posts" });
  if (end) {
    const left = getDaysRemaining(end);
    out.push({
      label: job.isWalkIn ? "Walk-in" : "Last date",
      value: formatDate(end),
      note: closed ? "Closed" : left >= 0 ? (left === 0 ? "Closes today" : `${left} day${left === 1 ? "" : "s"} left`) : undefined,
      strong: !closed,
    });
  }
  if (!closed) {
    out.push({ label: "Fee", value: feeSummary(job), href: "#fee" });
    const age = ageSummary(job);
    out.push({ label: "Age limit", value: age, href: age === "See notification" ? undefined : "#eligibility" });
    const quals = (job.qualifications || []).filter(Boolean);
    const stated = quals.length > 0 || (job.posts || []).some((p) => p.qualification?.trim());
    const level = qualificationLabel(job) || (quals.length === 1 && quals[0].length <= 28 ? quals[0] : stated ? "Differs by post" : "See notification");
    out.push({ label: "Qualification", value: level === "Varies by post" ? "Differs by post" : level, href: level === "See notification" ? undefined : "#eligibility" });
  }
  return out;
}

// --- dates ----------------------------------------------------------------------------------------

/**
 * The recruitment from start to now in one list: the application window, the last dates, every
 * official document found since the notification (admit card, answer key, result: each with its
 * PDF and its page here) and the exam dates the notice gives, each marked done, now or to come.
 */
/** A list published as a "result" that is not one: eligibility, provisional, disqualified or rejected lists. */
function listLabel(s: NonNullable<JobNotification["stages"]>[number]): string {
  if (s.kind !== "result") return "";
  const t = stageText(s).main;
  if (/disqualif|rejected|not eligible|ineligible/i.test(t)) return "Rejected list";
  if (/eligib|provisional list|scrutiny/i.test(t)) return "Eligibility list";
  return "";
}

export function datesOf(job: JobNotification): { steps: Step[]; update?: NonNullable<JobNotification["updates"]>[number] } {
  const today = todayIST();
  const month = today.slice(0, 7);
  const closed = isJobApplicationClosed(job);
  const end = job.applicationEndDate;
  const daysLeft = end ? getDaysRemaining(end) : -1;
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  const update = (job.updates || [])[(job.updates || []).length - 1];
  const base = getJobCanonicalPath(job);
  const byDate = (d: string): When => (d.length === 7 ? (d < month ? "done" : "next") : d < today ? "done" : d === today ? "now" : "next");

  const steps: Step[] = [];
  if (job.applicationStartDate && !job.isWalkIn) {
    steps.push({ key: "open", label: "Applications open", sortKey: job.applicationStartDate,
      when: job.applicationStartDate <= today ? "done" : "next", value: formatDate(job.applicationStartDate) });
  } else if (job.notificationDate) {
    steps.push({ key: "notice", label: "Notice dated", sortKey: job.notificationDate, when: "done",
      value: formatDate(job.notificationDate) });
  }
  const pastApplying = closed || (job.stages || []).length > 0;
  if (end || !pastApplying) steps.push({
    key: "end",
    label: job.isWalkIn ? "Walk-in interview" : "Last date to apply",
    sortKey: end || today,
    when: end ? (closed ? "done" : "now") : "now",
    value: (
      <>
        {end ? formatDate(end) : "See notification"}
        {end && !closed && daysLeft >= 0 && " "}
        {end && !closed && daysLeft >= 0 && (
          <span className={`ml-2 whitespace-nowrap font-semibold ${daysLeft <= 7 ? "text-saffron" : "text-green"}`}>
            {daysLeft === 0 ? "Closes today" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`}
          </span>
        )}
        {end && closed && <span className="ml-2 whitespace-nowrap font-normal text-muted">closed</span>}
      </>
    ),
  });
  if (job.feeLastDate && job.feeLastDate !== end) {
    steps.push({ key: "fee", label: "Last date to pay the fee", sortKey: job.feeLastDate, when: byDate(job.feeLastDate),
      value: formatDate(job.feeLastDate) });
  }
  const seenDocs = new Set<string>();
  (job.stages || []).forEach((s, i) => {
    const same = `${s.kind}|${s.date || ""}|${stageText(s).main.slice(0, 80).toLowerCase()}`;
    if (seenDocs.has(same)) return;
    seenDocs.add(same);
    steps.push({
      key: `doc-${i}`,
      label: s.shortlist ? "Shortlist" : stageEvent(s) && s.kind === "schedule" ? `${stageEvent(s)} schedule` : listLabel(s) || KIND_LABEL[s.kind],
      sortKey: s.date || s.found || today,
      when: "done",
      value: s.date ? formatDate(s.date) : "Released",
      doc: { summary: stageText(s).main, url: s.url, page: KIND_PAGE[s.kind] ? `${base}/${KIND_PAGE[s.kind]}` : undefined, examDates: s.examDates, copyName: s.copyName,
        datesText: (s.examDates || []).length ? `${stageEvent(s) ? `${stageEvent(s)}s` : "Exam / test"}: ${stageDatesText(s, formatDate)}` : "" },
    });
  });
  if (job.exams?.length) {
    job.exams.forEach((e, i) => {
      if (/\bage\b|reckon/i.test(e.stage || "")) return;      // the age date is said under "Who can apply"
      const dated = e.precision === "day" || e.precision === "month";
      steps.push({
        key: `exam-${i}`,
        // "Paper-1" alone does not say it is an exam
        label: !e.stage ? "Exam" : /exam|test|interview|written|cbt|viva|skill/i.test(e.stage) ? e.stage : `${e.stage} exam`,
        sortKey: dated ? e.date : "",
        when: dated ? byDate(e.date) : "next",
        value: <>{examWhen(e)}{e.tentative && <span className="font-normal text-muted"> (tentative)</span>}</>,
      });
    });
    for (let i = steps.length - 1; i > 0; i--) {
      const a = steps[i - 1], b = steps[i];
      if (a.key.startsWith("exam-") && b.key.startsWith("exam-") && a.sortKey && a.sortKey === b.sortKey) {
        const name = (l: string) => l.replace(/\s+exam$/i, "");
        steps.splice(i - 1, 2, { ...a, label: `${name(a.label)} and ${name(b.label)}${/exam/i.test(a.label) ? " exams" : ""}` });
      }
    }
  } else if (job.examDate) {
    const dated = iso.test(job.examDate);
    steps.push({ key: "exam", label: "Exam", sortKey: dated ? job.examDate : "", when: dated ? byDate(job.examDate) : "next",
      value: dated ? formatDate(job.examDate) : job.examDate.length <= 32 ? job.examDate : "To be announced" });
  }
  // the other dates the notice gives (correction window, admit card...), as it names them
  extraDates(job.details, [job.applicationStartDate, end, job.feeLastDate || "", job.notificationDate || "",
    job.examDate || "", ...(job.exams || []).map((e) => e.date)]).forEach((d, i) => {
    steps.push({
      key: `notice-${i}`, label: d.event, sortKey: d.date, when: byDate(d.date),
      value: d.date.length === 10 ? formatDate(d.date) : `${MONTHS[Number(d.date.slice(5, 7)) - 1]} ${d.date.slice(0, 4)}`,
    });
  });
  // nothing ahead on the list yet: say what comes next, without guessing a date
  const finished = (job.stages || []).some((s) => s.kind === "final_result");
  if (!finished && !steps.some((s) => s.when === "next")) {
    const open = Boolean(end) && !closed;
    // not every recruitment has an exam or an admit card (some select by marks): name no step the notice does not give
    steps.push({ key: "next", label: "Next stage", sortKey: "", when: "next",
      value: open ? `To be announced by ${job.orgShortCode} after applications close` : `To be announced by ${job.orgShortCode}` });
  }
  // a date known only to the month goes after that month's days ("December 2026" after "11 Dec")
  const order = (k: string) => (!k ? "9999" : k.length === 7 ? `${k}-32` : k);
  steps.sort((a, b) => order(a.sortKey).localeCompare(order(b.sortKey)));
  return { steps, update };
}

export function DatesAndApply({ job }: { job: JobNotification }) {
  const { steps, update } = datesOf(job);
  return (
    <section id="dates" aria-labelledby="dates-h" className={sectionCls}>
      <h2 id="dates-h" className={h2Cls}>{datesHeading(job)}</h2>
      {update && (
        <p className="mt-3 flex items-start gap-2 rounded-lg bg-saffron-tint px-3 py-2 text-sm text-ink">
          <BellRing className="w-4 h-4 text-saffron shrink-0 mt-0.5" aria-hidden />
          <span>
            <strong>Update{update.date ? ` (${formatDate(update.date)})` : ""}:</strong> {update.text}
          </span>
        </p>
      )}

      <ol className="mt-3 divide-y divide-line-soft">
        {steps.map((s) => {
          const m = MARK[s.when];
          const Icon = m.icon;
          return (
            <li
              key={s.key}
              aria-current={s.when === "now" ? "step" : undefined}
              className={`grid grid-cols-[1.25rem_minmax(0,8.5rem)_1fr] sm:grid-cols-[1.25rem_13rem_1fr] gap-x-3 px-3 py-2.5 ${s.when === "now" ? "bg-green-tint rounded-lg" : ""}`}
            >
              <Icon className={`w-[18px] h-[18px] mt-px ${m.cls}`} aria-hidden />
              <span className={`text-sm ${s.when === "next" ? "text-muted" : "text-ink-2"}`}>
                {s.label}
                <span className="sr-only"> ({m.sr})</span>
              </span>
              <div className={`min-w-0 text-sm ${s.doc ? "col-start-2 col-span-2 mt-1 sm:mt-0 sm:col-start-auto sm:col-span-1" : ""}`}>
                <span className={s.when === "now" ? "font-bold text-ink" : s.when === "next" ? "font-semibold text-muted" : "font-semibold text-ink"}>
                  {s.value}
                </span>
                {s.doc && (
                  <>
                    <p className="mt-0.5 text-[13px] text-ink-2 line-clamp-2">{s.doc.summary}</p>
                    {s.doc.datesText && (
                      <p className="mt-0.5 text-[13px] font-semibold text-saffron">{s.doc.datesText}</p>
                    )}
                    <p className="mt-1 flex flex-wrap gap-x-4 text-[13px] font-semibold">
                      {s.doc.copyName && <CopyLink name={s.doc.copyName} />}
                      <a href={s.doc.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 py-1 text-navy hover:text-saffron">
                        Official document <ExternalLink className="w-3.5 h-3.5" aria-hidden />
                      </a>
                      {s.doc.page && (
                        <Link href={s.doc.page} className="py-1 text-navy underline underline-offset-2 hover:text-saffron">
                          Details
                        </Link>
                      )}
                    </p>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

// --- fee and how to apply -------------------------------------------------------------------------

const th = "py-2.5 px-3.5 font-bold";

/** The fee as printed, how to apply (its web addresses as links), the advert number; while applying is possible. */
export function FeeAndApply({ job }: { job: JobNotification }) {
  if (!hasFeeSection(job)) return null;
  const fee = formatFee(job).replace(/\bRs\.?\s*/gi, "₹");
  const d = job.details || {};
  const facts = d.facts || {};
  // the notice's own fee and relaxation tables replace the general category table
  const categories = d.fees?.length || d.ageRelaxations?.length ? [] : getJobCategoryMatrix(job);
  const tables = Boolean(d.fees?.length || d.applySteps?.length);
  return (
    <section id="fee" aria-labelledby="fee-h" className={sectionCls}>
      <h2 id="fee-h" className={h2Cls}>Fee and how to apply</h2>
      <div className={`mt-4 grid gap-6 ${tables ? "grid-cols-[minmax(0,1fr)]" : "sm:grid-cols-2 [&>*]:min-w-0"}`}>
        <div className={tables ? "max-w-2xl" : ""}>
          <h3 className={h3Cls}>Application fee</h3>
          {d.fees?.length ? <FeeTable job={job} fees={d.fees} /> : <Groups text={fee} />}
          {facts.feePaymentMode?.value && (
            <p className="mt-2 text-sm text-ink-2 max-w-prose">
              <span className="font-semibold text-ink">How to pay:</span> {facts.feePaymentMode.value}{" "}
              <PageRef job={job} page={facts.feePaymentMode.page} />
            </p>
          )}
        </div>
        <div id="apply" className="scroll-mt-28 md:scroll-mt-36">
          <h3 className={h3Cls}>How to apply</h3>
          {d.applySteps?.length ? <ApplySteps job={job} steps={d.applySteps} /> : (
            <p className="mt-1 text-sm text-ink-2 max-w-prose">
              <Linked text={job.howToApply?.trim() || "Apply on the official website. The steps are in the official notification."} />
            </p>
          )}
          {job.advtNo && <p className="mt-1 text-[13px] text-muted">Advt. No. {job.advtNo}</p>}
          {job.copyName && <p className="mt-1 text-[13px] font-semibold"><CopyLink name={job.copyName} /></p>}
          {d.documents?.length ? <DocumentsList job={job} docs={d.documents} /> : null}
          <Helpline facts={facts} />
        </div>
      </div>
      {categories.length > 0 && (
        <Fold title="Fees and age relaxation by category" className="mt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="border-b border-line text-[12px] uppercase tracking-wide text-muted">
                <tr>
                  <th className={th}>Category</th>
                  <th className={th}>Fee</th>
                  <th className={th}>Age relaxation</th>
                  <th className={th}>Maximum age</th>
                  <th className={th}>Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft text-ink">
                {categories.map((item: CategoryStatutoryMatrixItem, idx: number) => (
                  <tr key={idx}>
                    <td className="py-3 px-3.5 font-bold">{item.category}</td>
                    <td className="py-3 px-3.5">{item.fee}</td>
                    <td className="py-3 px-3.5">{item.ageRelaxation}</td>
                    <td className="py-3 px-3.5">{item.maxEligibleAge}</td>
                    <td className="py-3 px-3.5 text-ink-2">{item.exemptionNote}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Fold>
      )}
    </section>
  );
}

// --- who can apply --------------------------------------------------------------------------------

type Limit = NonNullable<JobNotification["ageLimits"]>[number];

/**
 * The printed limits said once: posts and categories that share a limit are one line ("18 to 27 years:
 * all other posts"), so a notice with 14 posts and two limits shows two lines, not fourteen.
 */
function AgeLines({ limits }: { limits: Limit[] }) {
  const allPosts = [...new Set(limits.map((l) => l.post).filter(Boolean))];
  const cats = new Set(limits.map((l) => l.category));
  const groups = new Map<string, { min?: number; max: number; category: string; posts: string[] }>();
  for (const l of limits) {
    const key = `${l.category}|${l.min || 0}|${l.max}`;
    const g = groups.get(key) || { min: l.min || undefined, max: l.max, category: l.category, posts: [] };
    if (l.post && !g.posts.includes(l.post)) g.posts.push(l.post);
    groups.set(key, g);
  }
  const list = [...groups.values()];
  const biggest = list.reduce((a, b) => (b.posts.length > a.posts.length ? b : a), list[0]);
  const covered = (g: typeof biggest) => g.posts.length === allPosts.length;
  const whom = (g: typeof biggest): string => {
    const cat = cats.size > 1 && g.category ? g.category : "";
    let posts = "";
    if (allPosts.length > 1) {
      if (covered(g)) posts = "all posts";
      else if (g === biggest && g.posts.length > 3 && list.filter((x) => x.category === g.category).length > 1) posts = "all other posts";
      else posts = g.posts.join("; ");
    }
    return [cat, posts].filter(Boolean).join(", ") || "All candidates";
  };
  // the line for "all other posts" goes last
  const ordered = [...list].sort((a, b) => Number(a === biggest && allPosts.length > 1) - Number(b === biggest && allPosts.length > 1));
  return (
    <div className="max-w-2xl">
      <DataTable caption="Age limit" rows={ordered} columns={[
        { key: "a", label: "Age", cell: (g) => <span className="tabular-nums whitespace-nowrap">{g.min ? `${g.min} to ${g.max}` : `Up to ${g.max}`} years</span> },
        { key: "w", label: "Applies to", wide: true, cell: (g) => whom(g).charAt(0).toUpperCase() + whom(g).slice(1) },
      ]} />
    </div>
  );
}

/** Age (the printed limits once, the notice's wording and a date-of-birth check folded away) and qualification. */
export function WhoCanApply({ job }: { job: JobNotification }) {
  const quals = (job.qualifications || []).filter(Boolean);
  const postQuals = new Set((job.posts || []).map((p) => p.qualification.trim()).filter(Boolean));
  const varies = (postQuals.size > 1 || quals.length > 1) && (job.posts || []).length > 1;
  const limits = job.ageLimits || [];
  if (!hasEligibility(job)) return null;
  const wording = ageText(job).trim();

  return (
    <section id="eligibility" aria-labelledby="eligibility-h" className={sectionCls}>
      <h2 id="eligibility-h" className={h2Cls}>Who can apply</h2>

      <h3 className={`mt-4 ${h3Cls}`}>Age limit</h3>
      {limits.length > 0 ? <AgeLines limits={limits} /> : <Groups text={wording} />}
      {job.ageAsOn && <p className="mt-2 text-sm text-muted">Age is counted as on {formatDate(job.ageAsOn)}.</p>}
      {job.details?.ageRelaxations?.length ? (
        <div className="mt-4 max-w-md">
          <h4 className="text-sm font-semibold text-ink">Upper age relaxation</h4>
          <RelaxationTable job={job} rows={job.details.ageRelaxations} />
        </div>
      ) : null}
      {(limits.length > 0 && wording || job.ageAsOn && limits.length > 0) && (
        <div className="mt-1 flex flex-col">
          {limits.length > 0 && wording && (
            <Fold title="Age rule as worded in the notice">
              <Groups text={wording} />
            </Fold>
          )}
          {job.ageAsOn && limits.length > 0 && (
            <Fold title="Check your age for this notice">
              <AgeCheck asOn={job.ageAsOn} limits={limits} />
            </Fold>
          )}
        </div>
      )}

      <h3 className={`mt-5 ${h3Cls}`}>Qualification</h3>
      <p className="mt-1 text-sm text-ink-2 max-w-prose">
        {varies ? (
          <>
            Differs by post{qualificationLabel(job) && qualificationLabel(job) !== "Varies by post" ? ` (${qualificationLabel(job)})` : ""}.{" "}
            <a href="#posts" className="font-semibold text-navy underline underline-offset-2 hover:text-saffron">
              See each post&apos;s qualification
            </a>
          </>
        ) : quals.length ? quals.join("; ") : "See the official notification."}
      </p>
      {job.details?.facts && <OtherConditions job={job} facts={job.details.facts} />}
      {job.details?.physical?.length ? (
        <>
          <h3 className={`mt-5 ${h3Cls}`}>Physical standards</h3>
          <PhysicalTable job={job} rows={job.details.physical} />
        </>
      ) : null}
    </section>
  );
}
