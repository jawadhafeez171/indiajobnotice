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
      <dt className="text-[11px] font-bold uppercase tracking-wide text-[#68635B]">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold text-[#1A1918] leading-snug">{children}</dd>
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
    <section aria-labelledby="key-facts" className="bg-white rounded-xl border border-[#EAE2D2] p-5 sm:p-6 shadow-2xs space-y-4">
      <h2 id="key-facts" className="sr-only">Key facts</h2>

      {latestUpdate && (
        <p className="flex items-start gap-2 rounded-lg bg-[#FDF3EB] border border-[#F9D9C3] px-3 py-2 text-sm text-[#1A1918]">
          <BellRing className="w-4 h-4 text-[#E96B15] shrink-0 mt-0.5" />
          <span>
            <strong>Update{latestUpdate.date ? ` (${formatDate(latestUpdate.date)})` : ""}:</strong> {latestUpdate.text}
          </span>
        </p>
      )}

      {/* The deadline, the one thing nobody should have to search for */}
      <div className={`rounded-lg px-4 py-3 ${closed ? "bg-[#FAF7EF] border border-[#EAE2D2]" : "bg-[#EDF7F0] border border-[#C6E7D0]"}`}>
        <p className="text-[11px] font-bold uppercase tracking-wide text-[#68635B]">
          {job.isWalkIn ? "Walk-in interview" : "Last date to apply"}
        </p>
        <p className="text-lg sm:text-xl font-bold text-[#1A1918]">
          {end || "See notification"}
          {end && !closed && daysLeft >= 0 && (
            <span className="ml-2 text-sm font-semibold text-[#209948]">
              ({daysLeft === 0 ? "today" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`})
            </span>
          )}
          {end && closed && <span className="ml-2 text-sm font-semibold text-[#68635B]">(closed)</span>}
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
                  <span className="block text-xs font-normal text-[#68635B] mt-0.5">Varies by post: see the table below.</span>
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
