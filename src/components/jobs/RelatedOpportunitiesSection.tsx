import React from "react";
import Link from "next/link";
import { JobNotification, getJobCanonicalPath, getStages, isJobApplicationClosed } from "@/data/jobs";
import { RelatedOpportunity, noticeArea } from "@/lib/internal-links";
import { formatDate } from "@/lib/utils";

interface Props {
  currentJob: JobNotification;
  related: RelatedOpportunity[];   // getGenuinelyRelatedOpportunities, worked out on the server
}

// Similar jobs as plain rows: the part that tells look-alike notices apart (KK / RPC) first, the
// facts that decide whether to open one, and stage links only for documents that exist.
export function RelatedOpportunitiesSection({ currentJob, related }: Props) {
  if (!related || related.length === 0) return null;
  // a title shared with this job or another row gets its advertisement number, so the rows differ
  const titles = [currentJob.title, ...related.map((r) => r.job.title)];
  const repeated = (t: string) => titles.filter((x) => x === t).length > 1;

  return (
    <section aria-labelledby="similar" className="border-t border-line pt-7 print:hidden">
      <h2 id="similar" className="font-serif text-xl font-bold text-ink">
        {isJobApplicationClosed(currentJob) ? "Similar jobs" : "Other jobs open now"}
      </h2>
      <ul className="mt-3 divide-y divide-line-soft border-y border-line-soft">
        {related.map(({ job, relationshipReason }) => {
          const href = getJobCanonicalPath(job);
          const area = noticeArea(job);
          const closed = isJobApplicationClosed(job);
          const stageLinks = [
            getStages(job, "admit_card").length ? { label: "Admit card", href: `${href}/admit-card` } : null,
            getStages(job, "result").length ? { label: "Result", href: `${href}/result` } : null,
          ].filter((l): l is { label: string; href: string } => Boolean(l));
          return (
            <li key={job.id} className="py-3">
              <Link href={href} className="group block">
                <span className="block text-sm font-bold text-ink group-hover:text-navy leading-snug line-clamp-2">
                  {area && <span className="text-saffron">{area.code} · </span>}
                  {job.title}
                  {repeated(job.title) && job.advtNo && <span className="font-normal text-muted"> · Advt. {job.advtNo}</span>}
                </span>
                <span className="mt-1 block text-xs text-muted">
                  {job.totalVacancies ? `${job.totalVacancies.toLocaleString("en-IN")} posts · ` : ""}
                  {job.applicationEndDate
                    ? `${closed ? "Closed" : "Last date"} ${formatDate(job.applicationEndDate)}`
                    : job.currentStage || "See notification"}
                  {relationshipReason ? ` · ${relationshipReason}` : ""}
                </span>
              </Link>
              {stageLinks.length > 0 && (
                <span className="mt-0.5 flex gap-3 text-xs">
                  {stageLinks.map((l) => (
                    <Link key={l.href} href={l.href} className="inline-flex items-center min-h-[32px] font-semibold text-navy underline underline-offset-2 hover:text-saffron">
                      {l.label}
                    </Link>
                  ))}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
