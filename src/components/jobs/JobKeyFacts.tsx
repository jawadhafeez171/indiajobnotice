import React from "react";
import { BellRing } from "lucide-react";
import { JobNotification, formatAgeRange, formatFee, isJobApplicationClosed } from "@/data/jobs";
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

// The answers a candidate looks for first: can I still apply, by when, how many posts, am I
// eligible, what does it cost. Only facts from the notification; unknown ones say so.
export function JobKeyFacts({ job }: Props) {
  const closed = isJobApplicationClosed(job);
  const daysLeft = getDaysRemaining(job.applicationEndDate);
  const end = job.applicationEndDate ? formatDate(job.applicationEndDate) : "";
  const qualifications = (job.qualifications || []).filter(Boolean);
  const manyPosts = (job.posts || []).length > 1;
  const clip = (t: string) => (t.length > 170 ? `${t.slice(0, 167).trimEnd()}…` : t);
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
        <Fact label="Age limit">{formatAgeRange(job, "years")}</Fact>
        <Fact label="Qualification" wide>
          {qualifications.length
            ? <>
                {clip(qualifications[0])}
                {(manyPosts || qualifications.length > 1) && (
                  <span className="block text-xs font-normal text-muted mt-0.5">Varies by post: see the table below.</span>
                )}
              </>
            : "See notification"}
        </Fact>
        <Fact label="Application fee">{formatFee(job)}</Fact>
        {job.salary && <Fact label="Pay">{job.salary}</Fact>}
        {job.applicationStartDate && !job.isWalkIn && (
          <Fact label="Applications open">{formatDate(job.applicationStartDate)}</Fact>
        )}
        {job.examDate && <Fact label="Exam date">{iso.test(job.examDate) ? formatDate(job.examDate) : job.examDate}</Fact>}
        {job.advtNo && <Fact label="Advertisement no.">{job.advtNo}</Fact>}
      </dl>
    </section>
  );
}
