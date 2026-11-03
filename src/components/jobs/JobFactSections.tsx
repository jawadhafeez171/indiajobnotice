import React from "react";
import { BellRing, ExternalLink, FileText } from "lucide-react";
import { JobNotification, ageText, formatFee, isJobApplicationClosed } from "@/data/jobs";
import { formatDate, getDaysRemaining } from "@/lib/utils";
import { AgeCheck } from "./AgeCheck";

// The job's facts in the order candidates look for them (dates, who can apply, fee, how to apply),
// one section each, each fact once. Only what the notification states; the rest says so.

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

function Row({ label, children, strong }: { label: string; children: React.ReactNode; strong?: boolean }) {
  return (
    <div className={`grid grid-cols-[minmax(0,9.5rem)_1fr] sm:grid-cols-[14rem_1fr] gap-3 px-3 py-2.5 ${strong ? "bg-green-tint rounded-lg" : ""}`}>
      <dt className="text-sm text-ink-2">{label}</dt>
      <dd className={`text-sm text-ink ${strong ? "font-bold" : "font-semibold"}`}>{children}</dd>
    </div>
  );
}

export function ImportantDates({ job }: { job: JobNotification }) {
  const closed = isJobApplicationClosed(job);
  const end = job.applicationEndDate;
  const daysLeft = end ? getDaysRemaining(end) : -1;
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  const update = (job.updates || [])[(job.updates || []).length - 1];

  return (
    <section id="dates" aria-labelledby="dates-h" className={card}>
      <h2 id="dates-h" className={h2}>Important dates</h2>
      {update && (
        <p className="mt-3 flex items-start gap-2 rounded-lg bg-saffron-tint px-3 py-2 text-sm text-ink">
          <BellRing className="w-4 h-4 text-saffron shrink-0 mt-0.5" aria-hidden />
          <span>
            <strong>Update{update.date ? ` (${formatDate(update.date)})` : ""}:</strong> {update.text}
          </span>
        </p>
      )}
      <dl className="mt-3 divide-y divide-line-soft">
        {job.applicationStartDate && !job.isWalkIn && (
          <Row label="Applications open">{formatDate(job.applicationStartDate)}</Row>
        )}
        <Row label={job.isWalkIn ? "Walk-in interview" : "Last date to apply"} strong={Boolean(end) && !closed}>
          {end ? formatDate(end) : "See notification"}
          {end && !closed && daysLeft >= 0 && (
            <span className="ml-2 font-semibold text-green">
              {daysLeft === 0 ? "today" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`}
            </span>
          )}
          {end && closed && <span className="ml-2 font-normal text-muted">closed</span>}
        </Row>
        {job.feeLastDate && job.feeLastDate !== end && <Row label="Last date to pay the fee">{formatDate(job.feeLastDate)}</Row>}
        {job.exams?.length
          ? job.exams.map((e, i) => (
              <Row key={i} label={e.stage || "Exam"}>
                {examWhen(e)}
                {e.tentative && <span className="font-normal text-muted"> (tentative)</span>}
              </Row>
            ))
          : job.examDate && <Row label="Exam">{iso.test(job.examDate) ? formatDate(job.examDate) : job.examDate}</Row>}
      </dl>
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

export function ApplicationFee({ job }: { job: JobNotification }) {
  return (
    <section id="fee" aria-labelledby="fee-h" className={card}>
      <h2 id="fee-h" className={h2}>Application fee</h2>
      <Groups text={formatFee(job).replace(/\bRs\.?\s*/g, "₹")} />
      {job.feeLastDate && <p className="mt-1 text-sm text-muted">Pay by {formatDate(job.feeLastDate)}.</p>}
    </section>
  );
}

/** How to apply in the notice's words, then the official links. */
export function HowToApply({ job, applyHost }: { job: JobNotification; applyHost: string }) {
  const closed = isJobApplicationClosed(job);
  return (
    <section id="apply" aria-labelledby="apply-h" className={card}>
      <h2 id="apply-h" className={h2}>How to apply</h2>
      <p className="mt-2 text-sm text-ink-2 max-w-prose">
        {job.howToApply?.trim() || "Apply on the official website. The steps are in the official notification."}
      </p>
      <ul className="mt-4 divide-y divide-line-soft border-y border-line-soft">
        {!closed && job.applyOnlineUrl && (
          <li>
            <a href={job.applyOnlineUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 min-h-[44px] text-sm font-semibold text-navy hover:text-saffron">
              <span>Apply online{applyHost && <span className="font-normal text-muted"> · {applyHost}</span>}</span>
              <ExternalLink className="w-4 h-4 shrink-0" aria-hidden />
            </a>
          </li>
        )}
        <li>
          <a href={job.officialPdfUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 min-h-[44px] text-sm font-semibold text-navy hover:text-saffron">
            <span>Official notification{job.advtNo && <span className="font-normal text-muted"> · Advt. {job.advtNo}</span>}</span>
            <FileText className="w-4 h-4 shrink-0" aria-hidden />
          </a>
        </li>
      </ul>
    </section>
  );
}
