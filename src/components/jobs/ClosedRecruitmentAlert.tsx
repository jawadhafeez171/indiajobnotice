import React from "react";
import Link from "next/link";
import { JobNotification, getJobCanonicalPath } from "@/data/jobs";
import { formatDate } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface Props {
  job: JobNotification;
  stateSlug?: string;
  activeJobs: JobNotification[];   // open recruitments to suggest instead (getActiveOpportunities)
}

export function ClosedRecruitmentAlert({ job, activeJobs }: Props) {
  return (
    <section aria-labelledby="closed" className="bg-surface rounded-xl border border-line p-5 sm:p-6 shadow-2xs space-y-4 print:hidden" id="applications-closed-notice">
      <div>
        <h2 id="closed" className="font-serif text-lg font-bold text-ink">
          Applications closed{job.applicationEndDate ? ` on ${formatDate(job.applicationEndDate)}` : ""}
        </h2>
        <p className="mt-1 text-sm text-ink-2 max-w-prose">
          This page stays up for the candidates who applied: the admit card, answer key and result will
          appear here when the official site publishes them.
        </p>
      </div>

      {activeJobs.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between gap-3 mb-2">
            <h3 className="text-sm font-bold text-ink">Open now instead</h3>
            <Link href="/" className="inline-flex items-center gap-1 py-1.5 text-xs font-bold text-navy hover:underline">
              All open jobs
              <ArrowRight className="w-3.5 h-3.5" aria-hidden />
            </Link>
          </div>
          <ul className="divide-y divide-line-soft border-y border-line-soft">
            {activeJobs.map((activeJob) => (
              <li key={activeJob.id}>
                <Link
                  href={getJobCanonicalPath(activeJob)}
                  className="flex items-baseline justify-between gap-3 py-2.5 group"
                >
                  <span className="min-w-0 text-sm font-semibold text-ink group-hover:text-navy line-clamp-2">
                    <span className="font-bold text-navy">{activeJob.orgShortCode}</span>{" "}
                    {activeJob.shortTitle.startsWith(`${activeJob.orgShortCode} `)
                      ? activeJob.shortTitle.slice(activeJob.orgShortCode.length + 1)
                      : activeJob.shortTitle}
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-saffron tabular-nums">
                    Last date {formatDate(activeJob.applicationEndDate)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
