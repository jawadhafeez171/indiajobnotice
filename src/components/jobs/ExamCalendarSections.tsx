import React from "react";
import Link from "next/link";
import { CalendarClock, Award, ExternalLink } from "lucide-react";
import { JobNotification, getJobCanonicalPath, getUpcomingExams, getLatestResults } from "@/data/jobs";
import { formatDate } from "@/lib/utils";

interface Props {
  jobs: JobNotification[];
  limit?: number;
}

const card = "p-4 rounded-xl bg-surface border border-line shadow-2xs flex flex-col gap-1.5";

// "Admit card out, exam coming" and "Latest results": from the official documents the notice agent
// read (exam dates from admit card / schedule notices, result dates). Each section shows only when
// it has entries.
export function ExamCalendarSections({ jobs, limit = 10 }: Props) {
  const upcoming = getUpcomingExams(jobs).slice(0, limit);
  const results = getLatestResults(jobs).slice(0, limit);
  if (!upcoming.length && !results.length) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {upcoming.length > 0 && (
        <section aria-labelledby="upcoming-exams" className="space-y-3">
          <h2 id="upcoming-exams" className="font-serif text-xl font-bold text-ink flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-navy" /> Admit card out, exam coming
          </h2>
          <ul className="space-y-2.5">
            {upcoming.map(({ job, stage, nextDate }) => (
              <li key={job.id} className={card}>
                <span className="text-xs font-bold text-saffron">Exam {formatDate(nextDate)}</span>
                <Link href={getJobCanonicalPath(job)} className="text-sm font-bold text-ink hover:text-navy leading-snug">
                  {job.shortTitle}
                </Link>
                <span className="text-xs text-muted">{job.organization}</span>
                <a href={stage.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-navy inline-flex items-center gap-1 hover:underline">
                  {stage.kind === "admit_card" ? "Admit card notice" : "Exam schedule"} <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
      {results.length > 0 && (
        <section aria-labelledby="latest-results" className="space-y-3">
          <h2 id="latest-results" className="font-serif text-xl font-bold text-ink flex items-center gap-2">
            <Award className="w-5 h-5 text-green" /> Latest results
          </h2>
          <ul className="space-y-2.5">
            {results.map(({ job, stage }) => (
              <li key={job.id} className={card}>
                <span className="text-xs font-bold text-green">
                  {stage.kind === "final_result" ? "Final result" : "Result"} · {formatDate(stage.date || "")}
                </span>
                <Link href={getJobCanonicalPath(job)} className="text-sm font-bold text-ink hover:text-navy leading-snug">
                  {job.shortTitle}
                </Link>
                <span className="text-xs text-muted">{job.organization}</span>
                <a href={stage.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-navy inline-flex items-center gap-1 hover:underline">
                  Official result <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
