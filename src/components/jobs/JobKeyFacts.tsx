import React from "react";
import { BellRing } from "lucide-react";
import Link from "next/link";
import { JobNotification, ageText, formatFee, getJobCanonicalPath, isJobApplicationClosed, payText } from "@/data/jobs";
import { formatDate, getDaysRemaining } from "@/lib/utils";

interface Props {
  job: JobNotification;
}

function Fact({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <dt className="text-[12px] font-bold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold text-ink leading-snug">{children}</dd>
    </div>
  );
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
  "October", "November", "December"];

/** "08 Jan 2027", "January 2027", or the notice's words ("to be announced later"). */
function examWhen(e: NonNullable<JobNotification["exams"]>[number]): string {
  if (e.precision === "day") return formatDate(e.date);
  if (e.precision === "month") return `${MONTHS[Number(e.date.slice(5, 7)) - 1]} ${e.date.slice(0, 4)}`;
  return e.text || "To be announced";
}

// The answers a candidate looks for first: can I still apply, by when, how many posts, am I
// eligible, what does it cost. Only facts from the notification; unknown ones say so.
export function JobKeyFacts({ job }: Props) {
  const closed = isJobApplicationClosed(job);
  const daysLeft = getDaysRemaining(job.applicationEndDate);
  const end = job.applicationEndDate ? formatDate(job.applicationEndDate) : "";
  const qualifications = (job.qualifications || []).filter(Boolean);
  // "varies by post" only when the posts' own qualifications actually differ
  const postQuals = new Set((job.posts || []).map((p) => p.qualification.trim()).filter(Boolean));
  const varies = postQuals.size > 1 || qualifications.length > 1;
  const clip = (t: string, n = 170) => (t.length > n ? `${t.slice(0, n - 3).trimEnd()}…` : t);
  const age = ageText(job);
  const fee = formatFee(job);
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  const latestUpdate = (job.updates || [])[(job.updates || []).length - 1];

  return (
    <section aria-labelledby="key-facts" className="bg-surface rounded-xl border border-line p-5 sm:p-6 shadow-2xs space-y-4">
      <h2 id="key-facts" className="sr-only">Key facts</h2>

      {latestUpdate && (
        <p className="flex items-start gap-2 rounded-lg bg-saffron-tint border border-saffron-line px-3 py-2 text-sm text-ink">
          <BellRing className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
          <span>
            <strong>Update{latestUpdate.date ? ` (${formatDate(latestUpdate.date)})` : ""}:</strong> {latestUpdate.text}
          </span>
        </p>
      )}

      {/* The deadline, the one thing nobody should have to search for */}
      <div className={`rounded-lg px-4 py-3 ${closed ? "bg-subtle border border-line" : "bg-green-tint border border-green-line"}`}>
        <p className="text-[12px] font-bold uppercase tracking-wide text-muted">
          {job.isWalkIn ? "Walk-in interview" : "Last date to apply"}
        </p>
        <p className="text-lg sm:text-xl font-bold text-ink">
          {end || "See notification"}
          {end && !closed && daysLeft >= 0 && (
            <span className="ml-2 text-sm font-semibold text-green">
              ({daysLeft === 0 ? "today" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`})
            </span>
          )}
          {end && closed && <span className="ml-2 text-sm font-semibold text-muted">(closed)</span>}
        </p>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        <Fact label="Posts">
          {job.totalVacancies ? job.totalVacancies.toLocaleString("en-IN") : "See notification"}
        </Fact>
        <Fact label="Age limit" wide={age.length > 40}>
          {age}
          <Link
            href={`${getJobCanonicalPath(job)}/eligibility`}
            className="flex items-center w-fit min-h-[28px] text-xs font-semibold text-navy underline underline-offset-2 hover:text-saffron"
          >
            Age and eligibility details
          </Link>
        </Fact>
        <Fact label="Qualification" wide>
          {varies && (job.posts || []).length > 1 ? (
            <>
              Differs by post.{" "}
              <a href="#posts" className="text-navy underline underline-offset-2 hover:text-saffron">
                See each post&apos;s qualification
              </a>
            </>
          ) : qualifications.length ? (
            clip(qualifications.join("; "), 260)
          ) : (
            "See notification"
          )}
        </Fact>
        <Fact label="Application fee" wide={fee.length > 40}>{clip(fee, 300)}</Fact>
        {job.salary && <Fact label="Pay">{payText(job.salary)}</Fact>}
        {job.applicationStartDate && !job.isWalkIn && (
          <Fact label="Applications open">{formatDate(job.applicationStartDate)}</Fact>
        )}
        {job.exams?.length ? (
          <Fact label={job.exams.length > 1 ? "Exam dates" : "Exam date"} wide={job.exams.length > 1}>
            <ul className="space-y-0.5">
              {job.exams.map((e, i) => (
                <li key={i}>
                  {e.stage && <span className="font-normal text-ink-2">{e.stage}: </span>}
                  {examWhen(e)}
                  {e.tentative && <span className="font-normal text-muted"> (tentative)</span>}
                </li>
              ))}
            </ul>
          </Fact>
        ) : job.examDate ? (
          <Fact label="Exam date">{iso.test(job.examDate) ? formatDate(job.examDate) : job.examDate}</Fact>
        ) : null}
        {job.advtNo && <Fact label="Advertisement no.">{job.advtNo}</Fact>}
      </dl>
    </section>
  );
}
