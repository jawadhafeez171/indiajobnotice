import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, FileText, Clock, Building2 } from "lucide-react";
import { JobNotification, StageKind, getStages, getJobCanonicalPath, stageText } from "@/data/jobs";
import { formatDate } from "@/lib/utils";
import { ExaminationLifecycleBar } from "./ExaminationLifecycleBar";
import { NoticeTitle } from "./NoticeTitle";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { getStateBySlug } from "@/config/states";

export const STAGE_LABEL: Record<"admit_card" | "answer_key" | "result", string> = {
  admit_card: "Admit Card",
  answer_key: "Answer Key",
  result: "Result",
};

interface Props {
  job: JobNotification;
  kind: "admit_card" | "answer_key" | "result";
  stateSlug?: string;
}

/** A document's line as the site printed it, without the download link's leftovers ("| 934.08 KB Download"). */
function tidy(text: string): string {
  return text
    .replace(/\s*\|\s*[\d.,]+\s*(?:KB|MB|GB)\b.*$/i, "")
    .replace(/\s*\(?\s*[\d.,]+\s*(?:KB|MB)\s*\)?\s*$/i, "")
    .replace(/\s*[|-]?\s*(?:Download|Click here(?: to download)?)\s*$/i, "")
    .trim();
}

// Admit card / answer key / result page of one recruitment: only the official documents the notice
// agent found on the recruiting body's site, or a plain note that none has been released yet. Same
// layout as the job page (11 Nov): the full title, the recruitment's pages as links, flat sections.
export function StageView({ job, kind }: Props) {
  const label = STAGE_LABEL[kind];
  const parentUrl = getJobCanonicalPath(job);
  const docs = [...getStages(job, kind as StageKind), ...(kind === "admit_card" ? getStages(job, "schedule") : [])]
    .sort((a, b) => (b.date || b.found || "").localeCompare(a.date || a.found || ""));
  const active = kind === "admit_card" ? "admit-card" : kind === "answer_key" ? "answer-key" : "result";
  const state = job.isCentral ? null : getStateBySlug(job.stateSlug);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-12 sm:pt-6">
      <Breadcrumbs
        items={[
          ...(state ? [{ label: `${state.name} jobs`, href: `/state/${state.slug}` }] : []),
          { label: job.shortTitle.length > 48 ? `${job.shortTitle.slice(0, 46).trimEnd()}…` : job.shortTitle, href: parentUrl },
          { label },
        ]}
        aside={
          <Link href={parentUrl} className="inline-flex text-navy hover:underline font-bold items-center gap-1 py-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to the notification</span>
          </Link>
        }
      />

      <header className="mt-4 sm:mt-6 max-w-4xl">
        <div className="mb-3 flex items-center gap-2">
          <span className="px-2 py-1 rounded bg-navy-tint text-navy font-bold text-xs inline-flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" aria-hidden />
            {job.orgShortCode}
          </span>
          {job.advtNo && <span className="text-xs text-muted">Advt. No. {job.advtNo}</span>}
        </div>
        <NoticeTitle text={job.title} prefix={label} />
        {!job.title.startsWith(job.organization) && <p className="mt-2 text-sm font-semibold text-ink-2">{job.organization}</p>}
        {job.currentStage && <p className="mt-2 text-sm text-ink"><span className="text-muted">Where it stands: </span><b>{job.currentStage}</b></p>}
      </header>

      <div className="mt-6">
        <ExaminationLifecycleBar job={job} activeStage={active} />
      </div>

      <section aria-labelledby="docs-h" className="mt-7">
        <h2 id="docs-h" className="font-serif text-xl font-bold text-ink">
          {docs.length > 1 ? `Official documents (${docs.length})` : "Official document"}
        </h2>
        {docs.length > 0 ? (
          <ul className="mt-3 divide-y divide-line-soft border-y border-line-soft">
            {docs.map((d) => {
              const t = stageText(d);
              return (
                <li key={d.url} className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="min-w-0 max-w-prose">
                    {d.date && <p className="text-sm font-bold text-ink">{formatDate(d.date)}</p>}
                    <p className="mt-0.5 text-sm text-ink-2 break-words">{tidy(t.main)}</p>
                    {t.original && <p className="mt-1 text-[13px] text-muted break-words">{tidy(t.original)}</p>}
                  </div>
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 self-start inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-lg bg-navy-solid hover:bg-navy-strong text-white text-sm font-bold"
                  >
                    <FileText className="w-4 h-4" aria-hidden />
                    Open the official document
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden />
                  </a>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-3 flex items-start gap-2.5 max-w-prose text-sm text-ink-2">
            <Clock className="w-4 h-4 text-muted shrink-0 mt-0.5" aria-hidden />
            <span>
              No {label.toLowerCase()} has been released for this recruitment yet. When {job.organization} publishes
              one on its official website, it will be listed here with a link to the official document.
            </span>
          </p>
        )}
      </section>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold">
        <Link href={parentUrl} className="inline-flex items-center gap-1.5 min-h-[44px] text-navy hover:text-saffron">
          <ArrowLeft className="w-4 h-4" aria-hidden />
          Dates, posts and eligibility
        </Link>
        <a href={job.officialPdfUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 min-h-[44px] text-navy hover:text-saffron">
          <FileText className="w-4 h-4" aria-hidden />
          Official notification
        </a>
        {job.applyOnlineUrl && (
          <a href={job.applyOnlineUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 min-h-[44px] text-navy hover:text-saffron">
            Official website
            <ExternalLink className="w-3.5 h-3.5" aria-hidden />
          </a>
        )}
      </div>

      <p className="mt-8 text-xs text-muted max-w-prose">
        IndiaJobNotice is not a government website. Download admit cards and results only from the official website.
      </p>
    </div>
  );
}
