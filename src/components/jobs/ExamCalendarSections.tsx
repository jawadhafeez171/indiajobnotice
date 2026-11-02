import React from "react";
import Link from "next/link";
import { CalendarClock, Award, ExternalLink } from "lucide-react";
import { JobNotification, getJobCanonicalPath, getUpcomingExams, getLatestResults, todayIST } from "@/data/jobs";
import { formatDateShort } from "@/lib/utils";
import { examWhen } from "./JobListCard";

interface Props {
  jobs: JobNotification[];
  limit?: number;
}

const card = "relative overflow-hidden pl-5 pr-4 py-4 rounded-xl bg-surface border border-line shadow-2xs flex flex-col gap-1.5";

// "Admit card out, exam coming" and "Latest results": from the official documents the notice agent
// read (exam dates from admit card / schedule notices, result dates). Each section shows only when
// it has entries.
export function ExamCalendarSections({ jobs, limit = 10 }: Props) {
  // today's exams are not "coming up": count them, list the future ones
  const today = todayIST();
  const allUpcoming = getUpcomingExams(jobs);
  const todayCount = allUpcoming.filter((u) => u.nextDate === today).length;
  const upcoming = allUpcoming.filter((u) => u.nextDate > today).slice(0, limit);
  const results = getLatestResults(jobs).slice(0, limit);
  if (!upcoming.length && !todayCount && !results.length) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {(upcoming.length > 0 || todayCount > 0) && (
        <section aria-labelledby="upcoming-exams" className="space-y-3">
          <h2 id="upcoming-exams" className="font-serif text-xl font-bold text-ink flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-navy" /> Exams coming up
          </h2>
          {todayCount > 0 && (
            <p className="text-sm text-ink-2">
              <b className="text-ink">{todayCount} exam{todayCount === 1 ? "" : "s"} today.</b>{" "}
              <Link href="/exam-dates" className="font-semibold text-navy underline underline-offset-2">See exam dates</Link>
            </p>
          )}
          <ul className="space-y-2.5">
            {upcoming.map(({ job, stage, nextDate }) => (
              <li key={job.id} className={card}>
                <span aria-hidden className="absolute left-0 inset-y-0 w-1.5 bg-navy-solid" />
                <span className="text-xs font-bold text-navy">
                  Exam {formatDateShort(nextDate)} · {examWhen(nextDate)}
                </span>
                <Link href={getJobCanonicalPath(job)} className="text-sm font-bold text-ink hover:text-navy leading-snug">
                  {job.shortTitle}
                </Link>
                <span className="text-xs text-muted">{job.organization}</span>
                <a href={stage.url} target="_blank" rel="noreferrer" className="self-start text-xs font-bold text-navy inline-flex items-center gap-1 hover:underline py-3 -my-3">
                  {stage.kind === "admit_card" ? "Admit card notice" : "Exam schedule"} <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            ))}
          </ul>
          <Link href="/exam-dates" className="inline-flex items-center gap-1 min-h-[44px] text-sm font-bold text-navy hover:underline">
            See all exam dates →
          </Link>
        </section>
      )}
      {results.length > 0 && (
        <section aria-labelledby="latest-results" className="space-y-3">
          <h2 id="latest-results" className="font-serif text-xl font-bold text-ink flex items-center gap-2">
            <Award className="w-5 h-5 text-purple" /> Latest results
          </h2>
          <ul className="space-y-2.5">
            {results.map(({ job, stage }) => (
              <li key={job.id} className={card}>
                <span aria-hidden className="absolute left-0 inset-y-0 w-1.5 bg-purple-solid" />
                <span className="text-xs font-bold text-purple">
                  {stage.kind === "final_result" ? "Final result" : "Result"} · {formatDateShort(stage.date || "")}
                </span>
                <Link href={getJobCanonicalPath(job)} className="text-sm font-bold text-ink hover:text-navy leading-snug">
                  {job.shortTitle}
                </Link>
                <span className="text-xs text-muted">{job.organization}</span>
                <a href={stage.url} target="_blank" rel="noreferrer" className="self-start text-xs font-bold text-navy inline-flex items-center gap-1 hover:underline py-3 -my-3">
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
