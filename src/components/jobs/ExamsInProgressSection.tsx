import React from "react";
import Link from "next/link";
import { Hourglass, ArrowRight } from "lucide-react";
import { JobNotification, getJobCanonicalPath } from "@/data/jobs";

interface Props {
  jobs: JobNotification[];
  /** How many to show before "and N more". */
  limit?: number;
}

// Recruitments whose applications have closed and whose exams or results are under way, with the
// latest official document. Shown only when there is at least one.
export function ExamsInProgressSection({ jobs, limit = 12 }: Props) {
  if (!jobs.length) return null;
  const shown = jobs.slice(0, limit);

  return (
    <section className="space-y-4" aria-labelledby="exams-in-progress">
      <div className="flex items-center gap-2">
        <Hourglass className="w-5 h-5 text-[#E96B15]" />
        <h2 id="exams-in-progress" className="font-serif text-xl sm:text-2xl font-bold text-[#1A1918]">
          Exams in progress
        </h2>
        <span className="text-xs font-mono text-[#68635B]">{jobs.length}</span>
      </div>
      <p className="text-sm text-[#68635B] -mt-2">
        Applications have closed; admit cards, answer keys or results are coming out. Each entry links to the
        official documents.
      </p>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {shown.map((job) => {
          const last = (job.stages || [])[(job.stages || []).length - 1];
          return (
            <li key={job.id}>
              <Link
                href={getJobCanonicalPath(job)}
                className="block h-full p-4 rounded-xl bg-white border border-[#EAE2D2] hover:border-[#1E3799] shadow-2xs transition-colors"
              >
                <span className="inline-block px-2 py-0.5 rounded bg-[#EEF2FA] text-[#1E3799] font-bold text-[11px] border border-[#CCD8F0]">
                  {job.orgShortCode}
                </span>
                <p className="mt-2 text-sm font-bold text-[#1A1918] leading-snug line-clamp-2">{job.shortTitle}</p>
                {job.currentStage && (
                  <p className="mt-1.5 text-xs font-bold text-[#E96B15]">{job.currentStage}</p>
                )}
                {last && <p className="mt-1 text-xs text-[#68635B] line-clamp-1">Latest: {last.title}</p>}
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#1E3799]">
                  Stages & documents <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      {jobs.length > shown.length && (
        <p className="text-xs text-[#68635B]">and {jobs.length - shown.length} more on the state pages.</p>
      )}
    </section>
  );
}
