import React from "react";
import Link from "next/link";
import { OpenStatePicker } from "@/components/common/OpenStatePicker";
import { STATUS_STYLE, rowTitle } from "./JobListCard";
import { noticeArea } from "@/lib/internal-links";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { JobNotification, getJobCanonicalPath, stageText, stageSummary } from "@/data/jobs";

interface Props {
  jobs: JobNotification[];
  /** How many to show before "See all". */
  limit?: number;
  /** The rest open in place under "Show all" (a state page); else the state picker. */
  expandRest?: boolean;
  /** The state's name, for the headings (a state page). */
  place?: string;
  /** A heading of the page's own ("Other Karnataka recruitments under way"). */
  heading?: string;
  /** What the list leaves out and where it is. */
  note?: React.ReactNode;
}

/** Each row's title: the post, its cadre (KK / RPC), and the advert number when two rows still read alike. */
function titles(jobs: JobNotification[]): Map<string, string> {
  const base = (j: JobNotification) => {
    const t = rowTitle(j);
    const area = noticeArea(j)?.code;
    return area ? `${t.replace(/\s*\((?:KK|RPC)\)/g, "").trim()} · ${area === "KK" ? "Kalyana Karnataka (KK)" : "Rest of Karnataka (RPC)"}` : t;
  };
  const seen = new Map<string, number>();
  for (const j of jobs) seen.set(base(j), (seen.get(base(j)) || 0) + 1);
  return new Map(jobs.map((j) => {
    const t = base(j);
    return [j.id, (seen.get(t) || 0) > 1 && j.advtNo ? `${t} (Advt. ${j.advtNo})` : t];
  }));
}

function Row({ job, title }: { job: JobNotification; title: string }) {
  const last = (job.stages || [])[(job.stages || []).length - 1];
  const style = STATUS_STYLE[job.status] || STATUS_STYLE.UPCOMING;
  return (
    <li>
      <Link href={getJobCanonicalPath(job)} className="group block py-3">
        <span className="block text-sm font-semibold text-ink group-hover:text-navy leading-snug">
          <span className="font-bold text-navy">{job.orgShortCode}</span> {title}
        </span>
        <span className={cn("mt-0.5 block text-[13px] font-bold", style.text)}>{stageSummary(job) || (last ? stageText(last).main : "")}</span>
      </Link>
    </li>
  );
}

// Recruitments whose applications have closed and whose exams or results are under way, with the
// latest official document, as plain rows (11 Nov: the boxed two-column grid ran to many screens).
// Shown only when there is at least one.
export function ExamsInProgressSection({ jobs, limit = 12, expandRest = false, place, heading, note }: Props) {
  if (!jobs.length) return null;
  const shown = jobs.slice(0, limit);
  const named = titles(jobs);

  return (
    <section className="border-t border-line pt-6" aria-labelledby="exams-in-progress" id="recruitments-under-way">
      <h2 id="exams-in-progress" className="font-serif text-xl font-bold text-ink">
        {heading || (place ? `${place} recruitments under way` : "Recruitments under way")} <span className="ml-1 font-sans text-base font-semibold text-muted tabular-nums">{jobs.length}</span>
      </h2>
      <p className="mt-1 text-sm text-ink-2 max-w-prose">
        Applications have closed; admit cards, answer keys or results are coming out.{note && <> {note}</>}
      </p>
      <details className="group/h mt-1">
        <summary className="inline-flex min-h-[44px] cursor-pointer list-none items-center gap-1.5 text-sm font-semibold text-navy hover:text-saffron [&::-webkit-details-marker]:hidden">
          <ChevronDown className="h-4 w-4 transition-transform group-open/h:rotate-180" aria-hidden />What the stage words mean
        </summary>
        <dl className="mb-2 grid gap-1 [&>dd]:mb-1.5 sm:[&>dd]:mb-0 text-[13px] text-ink-2 sm:grid-cols-[auto_1fr] sm:gap-x-4">
          <dt className="font-bold text-ink">Admit card issued</dt><dd>Hall tickets for the exam are out on the official site.</dd>
          <dt className="font-bold text-ink">Answer key out · result awaited</dt><dd>The provisional answers are published. The result comes next.</dd>
          <dt className="font-bold text-ink">Shortlist / eligibility list out</dt><dd>Candidates called to the next round, or whose documents are checked next. Not the final selection.</dd>
          <dt className="font-bold text-ink">Result out</dt><dd>The recruiting body has published a result. Its document says which round.</dd>
        </dl>
      </details>
      <ul className="mt-1 divide-y divide-line-soft">
        {shown.map((job) => <Row key={job.id} job={job} title={named.get(job.id) || job.shortTitle} />)}
      </ul>
      {jobs.length > shown.length && (
        expandRest ? (
          <details className="group">
            <summary className="inline-flex items-center gap-1.5 min-h-[44px] cursor-pointer list-none text-sm font-bold text-navy hover:text-saffron [&::-webkit-details-marker]:hidden">
              <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" aria-hidden />
              See all {jobs.length}
            </summary>
            <ul className="divide-y divide-line-soft border-t border-line-soft">
              {jobs.slice(limit).map((job) => <Row key={job.id} job={job} title={named.get(job.id) || job.shortTitle} />)}
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
