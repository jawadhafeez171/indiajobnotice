import React from "react";
import Link from "next/link";
import { OpenStatePicker } from "@/components/common/OpenStatePicker";
import { STATUS_STYLE } from "./JobListCard";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { JobNotification, getJobCanonicalPath, stageText, stageSummary } from "@/data/jobs";

interface Props {
  jobs: JobNotification[];
  /** How many to show before "See all". */
  limit?: number;
  /** The rest open in place under "Show all" (a state page); else the state picker. */
  expandRest?: boolean;
}

function Row({ job }: { job: JobNotification }) {
  const last = (job.stages || [])[(job.stages || []).length - 1];
  const style = STATUS_STYLE[job.status] || STATUS_STYLE.UPCOMING;
  return (
    <li>
      <Link href={getJobCanonicalPath(job)} className="group block py-3">
        <span className="block text-sm font-semibold text-ink group-hover:text-navy leading-snug">
          <span className="font-bold text-navy">{job.orgShortCode}</span> · {job.shortTitle}
        </span>
        {stageSummary(job) && <span className={cn("mt-0.5 block text-[13px] font-bold", style.text)}>{stageSummary(job)}</span>}
        {last && <span className="mt-0.5 text-[13px] text-muted line-clamp-1">Latest: {last.summary || stageText(last).main}</span>}
      </Link>
    </li>
  );
}

// Recruitments whose applications have closed and whose exams or results are under way, with the
// latest official document, as plain rows (11 Nov: the boxed two-column grid ran to many screens).
// Shown only when there is at least one.
export function ExamsInProgressSection({ jobs, limit = 12, expandRest = false }: Props) {
  if (!jobs.length) return null;
  const shown = jobs.slice(0, limit);

  return (
    <section className="border-t border-line pt-6" aria-labelledby="exams-in-progress" id="recruitments-under-way">
      <h2 id="exams-in-progress" className="font-serif text-xl font-bold text-ink">
        Recruitments under way <span className="ml-1 font-sans text-base font-semibold text-muted tabular-nums">{jobs.length}</span>
      </h2>
      <p className="mt-1 text-sm text-ink-2 max-w-prose">
        Applications have closed; admit cards, answer keys or results are coming out.
      </p>
      <ul className="mt-2 divide-y divide-line-soft">
        {shown.map((job) => <Row key={job.id} job={job} />)}
      </ul>
      {jobs.length > shown.length && (
        expandRest ? (
          <details className="group">
            <summary className="inline-flex items-center gap-1.5 min-h-[44px] cursor-pointer list-none text-sm font-bold text-navy hover:text-saffron [&::-webkit-details-marker]:hidden">
              <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" aria-hidden />
              Show all {jobs.length}
            </summary>
            <ul className="divide-y divide-line-soft border-t border-line-soft">
              {jobs.slice(limit).map((job) => <Row key={job.id} job={job} />)}
            </ul>
          </details>
        ) : (
          <p className="mt-2 text-sm text-ink-2">
            Showing {shown.length} of {jobs.length}.{" "}
            <OpenStatePicker className="font-semibold text-navy underline underline-offset-2">Choose your state</OpenStatePicker>{" "}
            to see the rest for that state.
          </p>
        )
      )}
    </section>
  );
}
