import React from "react";
import Link from "next/link";
import { BellRing, CheckCircle2, Circle, CircleDot, ExternalLink, FileText } from "lucide-react";
import {
  JobNotification, StageKind, ageText, formatFee, getJobCanonicalPath, isJobApplicationClosed, stageText, todayIST,
} from "@/data/jobs";
import { formatDate, getDaysRemaining } from "@/lib/utils";
import { AgeCheck } from "./AgeCheck";

// The job's facts in the order candidates look for them: the dates (with the documents since and how
// to apply), then who can apply; each fact once. Only what the notification states; the rest says so.

const card = "bg-surface rounded-xl border border-line p-5 sm:p-6 shadow-2xs scroll-mt-32 md:scroll-mt-44";

/**
 * A notice's run-on wording as one line per group: "Rs 750 (general…); Rs 500 (SC, ST…); Rs 250 (PwBD)"
 * and "maximum 40 years (general), 43 years (Cat 2A…), 45 years (SC, ST…)" become lists. Wording that
 * is one statement stays a sentence.
 */
function Groups({ text }: { text: string }) {
  const parts = text.split(/;\s+|(?<=\)),\s+/).map((t) => t.trim()).filter(Boolean);
  if (parts.length < 2) return <p className="mt-1 text-sm text-ink-2 max-w-prose">{text}</p>;
  return (
    <ul className="mt-1 space-y-1 text-sm text-ink-2 max-w-prose list-disc pl-5 marker:text-faint">
      {parts.map((t, i) => <li key={i}>{t.charAt(0).toUpperCase() + t.slice(1)}</li>)}
    </ul>
  );
}
const h2 = "font-serif text-lg font-bold text-ink";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
  "October", "November", "December"];

/** "08 Jan 2027", "January 2027", or the notice's words ("to be announced later"). */
function examWhen(e: NonNullable<JobNotification["exams"]>[number]): string {
  if (e.precision === "day") return formatDate(e.date);
  if (e.precision === "month") return `${MONTHS[Number(e.date.slice(5, 7)) - 1]} ${e.date.slice(0, 4)}`;
  return e.text || "To be announced";
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
interface Step {
  key: string;
  label: string;
  /** YYYY-MM-DD or YYYY-MM for the order; "" for a step with no date yet (it goes last). */
  sortKey: string;
  when: When;
  value: React.ReactNode;
  /** an official document: its summary, its PDF and its page here */
  doc?: { summary: string; url: string; page?: string; examDates?: string[]; copyName?: string };
}

const MARK: Record<When, { icon: typeof Circle; cls: string; sr: string }> = {
  done: { icon: CheckCircle2, cls: "text-green", sr: "done" },
  now: { icon: CircleDot, cls: "text-navy", sr: "now" },
  next: { icon: Circle, cls: "text-faint", sr: "to come" },
};

/** Our stored copy of a notice sent by hand; the official page sits beside it. */
function CopyLink({ name }: { name: string }) {
  return (
    <a href={`/pdf/${name}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 py-1 text-navy hover:text-saffron">
      PDF (our copy) <FileText className="w-3.5 h-3.5" aria-hidden />
    </a>
  );
}

/** The dates card's name: with how to apply while applications are open. */
export function datesHeading(job: JobNotification): string {
  return isJobApplicationClosed(job) ? "Dates and documents" : "Dates and how to apply";
}

/** Whether "Who can apply" has anything the notice states (a closed recruitment without it shows none). */
export function hasEligibility(job: JobNotification): boolean {
  return !isJobApplicationClosed(job) || (job.qualifications || []).some(Boolean) || (job.ageLimits || []).length > 0
    || !/^see notification/i.test(ageText(job).trim());
}

/**
 * The recruitment from start to now in one list: the application window, the last dates, every
 * official document found since the notification (admit card, answer key, result: each with its
 * PDF and its page here) and the exam dates the notice gives, each marked done, now or to come.
 * Then the fee and how to apply. Only what the notice and the official documents state.
 */
export function DatesAndApply({ job }: { job: JobNotification }) {
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
        {end && !closed && daysLeft >= 0 && (
          <span className="ml-2 font-semibold text-green">
            {daysLeft === 0 ? "today" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`}
          </span>
        )}
        {end && closed && <span className="ml-2 font-normal text-muted">closed</span>}
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
      label: s.shortlist ? "Shortlist" : KIND_LABEL[s.kind],
      sortKey: s.date || s.found || today,
      when: "done",
      value: s.date ? formatDate(s.date) : "Released",
      doc: { summary: stageText(s).main, url: s.url, page: KIND_PAGE[s.kind] ? `${base}/${KIND_PAGE[s.kind]}` : undefined, examDates: s.examDates, copyName: s.copyName },
    });
  });
  if (job.exams?.length) {
    job.exams.forEach((e, i) => {
      const dated = e.precision === "day" || e.precision === "month";
      steps.push({
        key: `exam-${i}`,
        label: e.stage || "Exam",
        sortKey: dated ? e.date : "",
        when: dated ? byDate(e.date) : "next",
        value: <>{examWhen(e)}{e.tentative && <span className="font-normal text-muted"> (tentative)</span>}</>,
      });
    });
  } else if (job.examDate) {
    const dated = iso.test(job.examDate);
    steps.push({ key: "exam", label: "Exam", sortKey: dated ? job.examDate : "", when: dated ? byDate(job.examDate) : "next",
      value: dated ? formatDate(job.examDate) : job.examDate });
  }
  // nothing ahead on the list yet: say what comes next, without guessing a date
  const finished = (job.stages || []).some((s) => s.kind === "final_result");
  if (!finished && !steps.some((s) => s.when === "next")) {
    const open = Boolean(end) && !closed;
    steps.push({ key: "next", label: open ? "Admit card and exam" : "Next stage", sortKey: "", when: "next",
      value: open ? "After applications close" : `To be announced by ${job.orgShortCode}` });
  }
  steps.sort((a, b) => (a.sortKey || "9999").localeCompare(b.sortKey || "9999"));

  const fee = formatFee(job).replace(/\bRs\.?\s*/g, "₹");
  return (
    <section id="dates" aria-labelledby="dates-h" className={card}>
      <h2 id="dates-h" className={h2}>{datesHeading(job)}</h2>
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
                    {s.doc.examDates && s.doc.examDates.length > 0 && (
                      <p className="mt-0.5 text-[13px] font-semibold text-saffron">
                        Exam / test: {s.doc.examDates.map((x) => formatDate(x)).join(", ")}
                      </p>
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

      {/* the fee and the way to apply, under the dates they go with (the apply links are at the top);
          not once applications have closed */}
      {!closed && <div className="mt-5 pt-5 border-t border-line-soft grid gap-5 sm:grid-cols-2">
        <div id="fee" className="scroll-mt-32 md:scroll-mt-44">
          <h3 className="text-sm font-bold text-ink">Application fee</h3>
          <Groups text={fee} />
        </div>
        <div id="apply" className="scroll-mt-32 md:scroll-mt-44">
          <h3 className="text-sm font-bold text-ink">How to apply</h3>
          <p className="mt-1 text-sm text-ink-2 max-w-prose">
            {job.howToApply?.trim() || "Apply on the official website. The steps are in the official notification."}
          </p>
          {job.advtNo && <p className="mt-1 text-[13px] text-muted">Advt. No. {job.advtNo}</p>}
          {job.copyName && <p className="mt-1 text-[13px] font-semibold"><CopyLink name={job.copyName} /></p>}
        </div>
      </div>}
    </section>
  );
}

/** Age (as worded, the printed limits, a date-of-birth check) and qualification. */
export function WhoCanApply({ job }: { job: JobNotification }) {
  const quals = (job.qualifications || []).filter(Boolean);
  const postQuals = new Set((job.posts || []).map((p) => p.qualification.trim()).filter(Boolean));
  const varies = (postQuals.size > 1 || quals.length > 1) && (job.posts || []).length > 1;
  const limits = job.ageLimits || [];
  const byPost = new Set(limits.map((l) => l.post)).size > 1;
  if (!hasEligibility(job)) return null;

  return (
    <section id="eligibility" aria-labelledby="eligibility-h" className={card}>
      <h2 id="eligibility-h" className={h2}>Who can apply</h2>

      <h3 className="mt-4 text-sm font-bold text-ink">Age limit</h3>
      <Groups text={ageText(job)} />
      {job.ageAsOn && <p className="mt-1 text-sm text-muted">Age is counted as on {formatDate(job.ageAsOn)}.</p>}
      {limits.length > 1 && (
        <table className="mt-3 w-full max-w-lg text-sm">
          <thead className="text-left text-xs text-muted">
            <tr>
              {byPost && <th scope="col" className="py-1.5 pr-3 font-semibold">Post</th>}
              <th scope="col" className="py-1.5 pr-3 font-semibold">Category</th>
              <th scope="col" className="py-1.5 font-semibold">Age</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft border-t border-line-soft">
            {limits.map((l, i) => (
              <tr key={i}>
                {byPost && <td className="py-1.5 pr-3 text-ink-2">{l.post || "All posts"}</td>}
                <td className="py-1.5 pr-3 text-ink-2">{l.category || "All candidates"}</td>
                <td className="py-1.5 font-semibold text-ink tabular-nums">{l.min ? `${l.min} to ${l.max}` : `Up to ${l.max}`} years</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {job.ageAsOn && limits.length > 0 && (
        <div className="mt-4">
          <AgeCheck asOn={job.ageAsOn} limits={limits} />
        </div>
      )}

      <h3 className="mt-5 text-sm font-bold text-ink">Qualification</h3>
      <p className="mt-1 text-sm text-ink-2 max-w-prose">
        {varies ? (
          <>
            Differs by post.{" "}
            <a href="#posts" className="font-semibold text-navy underline underline-offset-2 hover:text-saffron">
              See each post&apos;s qualification
            </a>
          </>
        ) : quals.length ? quals.join("; ") : "See the official notification."}
      </p>
    </section>
  );
}
