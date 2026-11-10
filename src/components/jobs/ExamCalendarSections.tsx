import React from "react";
import Link from "next/link";
import { ChevronDown, ExternalLink } from "lucide-react";
import { JobNotification, getJobCanonicalPath, getUpcomingExams, getLatestResults, todayIST } from "@/data/jobs";
import { formatDateShort } from "@/lib/utils";
import { examWhen } from "./JobListCard";

interface Props {
  jobs: JobNotification[];
  limit?: number;
  /** The other results open in place under "Show all" (a state page). */
  expandRest?: boolean;
}

const row = "py-3 flex flex-col gap-0.5";

type ResultItem = ReturnType<typeof getLatestResults>[number];

function ResultRow({ job, stage }: ResultItem) {
  return (
    <li className={row}>
      <span className="text-sm font-bold text-purple tabular-nums">
        {stage.kind === "final_result" ? "Final result" : "Result"} · {formatDateShort(stage.date || "")}
      </span>
      <Link href={getJobCanonicalPath(job)} className="text-sm font-semibold text-ink hover:text-navy leading-snug">
        {job.shortTitle}
      </Link>
      <a href={stage.url} target="_blank" rel="noreferrer" className="self-start inline-flex items-center gap-1 min-h-[32px] text-[13px] font-semibold text-navy hover:underline">
        Official result <ExternalLink className="w-3 h-3" aria-hidden />
      </a>
    </li>
  );
}
const h2 = "font-serif text-xl font-bold text-ink";

// "Exams coming up" and "Latest results": from the official documents the notice agent read (exam dates
// from admit card / schedule notices, result dates). Plain rows under a rule, like the job page (11 Nov);
// each part shows only when it has entries.
export function ExamCalendarSections({ jobs, limit = 10, expandRest = false }: Props) {
  // today's exams are not "coming up": count them, list the future ones
  const today = todayIST();
  const allUpcoming = getUpcomingExams(jobs);
  const todayCount = allUpcoming.filter((u) => u.nextDate === today).length;
  const future = allUpcoming.filter((u) => u.nextDate > today);
  const upcoming = future.slice(0, limit);
  const allResults = getLatestResults(jobs);
  const results = allResults.slice(0, limit);
  if (!upcoming.length && !todayCount && !results.length) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-9">
      {(upcoming.length > 0 || todayCount > 0) && (
        <section aria-labelledby="upcoming-exams" className="border-t border-line pt-6">
          <h2 id="upcoming-exams" className={h2}>Exams coming up</h2>
          {todayCount > 0 && (
            <p className="mt-2 text-sm text-ink-2">
              <b className="text-ink">{todayCount} exam{todayCount === 1 ? "" : "s"} today.</b>
            </p>
          )}
          <ul className="mt-2 divide-y divide-line-soft">
            {upcoming.map(({ job, stage, nextDate }) => (
              <li key={job.id} className={row}>
                <span className="text-sm font-bold text-navy tabular-nums">
                  {formatDateShort(nextDate)} <span className="font-semibold text-muted">· {examWhen(nextDate)}</span>
                </span>
                <Link href={getJobCanonicalPath(job)} className="text-sm font-semibold text-ink hover:text-navy leading-snug">
                  {job.shortTitle}
                </Link>
                <a href={stage.url} target="_blank" rel="noreferrer" className="self-start inline-flex items-center gap-1 min-h-[32px] text-[13px] font-semibold text-navy hover:underline">
                  {stage.kind === "admit_card" ? "Admit card notice" : "Exam schedule"} <ExternalLink className="w-3 h-3" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
          <Link href="/calendar?type=exams" className="inline-flex items-center min-h-[44px] text-sm font-bold text-navy hover:underline">
            {future.length > upcoming.length ? `See all ${future.length} exam dates →` : "Exam calendar →"}
          </Link>
        </section>
      )}
      {results.length > 0 && (
        <section aria-labelledby="latest-results" className="border-t border-line pt-6">
          <h2 id="latest-results" className={h2}>Latest results</h2>
          <ul className="mt-2 divide-y divide-line-soft">
            {results.map(({ job, stage }) => <ResultRow key={job.id} job={job} stage={stage} />)}
          </ul>
          {expandRest && allResults.length > results.length && (
            <details className="group">
              <summary className="inline-flex items-center gap-1.5 min-h-[44px] cursor-pointer list-none text-sm font-bold text-navy hover:text-saffron [&::-webkit-details-marker]:hidden">
                <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" aria-hidden />
                Show all {allResults.length} results
              </summary>
              <ul className="divide-y divide-line-soft border-t border-line-soft">
                {allResults.slice(limit).map(({ job, stage }) => <ResultRow key={job.id} job={job} stage={stage} />)}
              </ul>
            </details>
          )}
        </section>
      )}
    </div>
  );
}
