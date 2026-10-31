import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, FileText, Clock, Building2 } from "lucide-react";
import { JobNotification, StageKind, getStages, getJobCanonicalPath, stageText } from "@/data/jobs";
import { formatDate } from "@/lib/utils";
import { ExaminationLifecycleBar } from "./ExaminationLifecycleBar";

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

// Admit card / answer key / result page of one recruitment: only the official documents the notice
// agent found on the recruiting body's site, or a plain note that none has been released yet.
export function StageView({ job, kind, stateSlug }: Props) {
  const label = STAGE_LABEL[kind];
  const parentUrl = getJobCanonicalPath(job);
  const docs = getStages(job, kind as StageKind);
  const schedules = kind === "admit_card" ? getStages(job, "schedule") : [];
  const active = kind === "admit_card" ? "admit-card" : kind === "answer_key" ? "answer-key" : "result";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      <nav className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#68635B]">
        <div className="flex items-center gap-2 min-w-0">
          <Link href="/" className="hover:text-[#1E3799] font-medium">Home</Link>
          <span>/</span>
          <Link href={parentUrl} className="hover:text-[#1E3799] font-medium truncate">{job.shortTitle}</Link>
          <span>/</span>
          <span className="text-[#1A1918] font-bold">{label}</span>
        </div>
        <Link href={parentUrl} className="text-[#1E3799] hover:underline font-bold flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to the notification</span>
        </Link>
      </nav>

      <ExaminationLifecycleBar job={job} activeStage={active} stateSlug={stateSlug} />

      <div className="bg-white rounded-xl border border-[#EAE2D2] border-t-4 border-t-[#1E3799] p-6 sm:p-8 shadow-2xs space-y-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#EEF2FA] text-[#1E3799] font-bold text-xs border border-[#CCD8F0]">
          <Building2 className="w-3.5 h-3.5" />
          {job.orgShortCode}
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1918] leading-tight">
          {job.shortTitle} {label}
        </h1>
        <p className="text-sm text-[#68635B]">
          {job.organization}
          {job.advtNo ? ` · Advt. No. ${job.advtNo}` : ""}
        </p>
        {job.currentStage && (
          <p className="text-sm font-bold text-[#1A1918] bg-[#FCFAF4] border border-[#EAE2D2] rounded-lg px-3 py-2">
            {job.currentStage}
          </p>
        )}

        {docs.length > 0 || schedules.length > 0 ? (
          <ul className="divide-y divide-[#F2ECE1] border border-[#EAE2D2] rounded-lg">
            {[...docs, ...schedules].map((d) => (
              <li key={d.url} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#1A1918] break-words">{stageText(d).main}</p>
                  {stageText(d).original && (
                    <p className="text-xs text-[#68635B] break-words mt-0.5">{stageText(d).original}</p>
                  )}
                  {d.date && <p className="text-xs text-[#68635B] mt-0.5">{formatDate(d.date)}</p>}
                </div>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#1E3799] hover:bg-[#15286D] text-white text-xs font-bold"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Official document
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-start gap-2.5 p-4 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2] text-sm text-[#3E3C38]">
            <Clock className="w-4 h-4 text-[#68635B] shrink-0 mt-0.5" />
            <p>
              No {label.toLowerCase()} has been released for this recruitment yet. When {job.organization} publishes
              one on its official website, it will be listed here with a link to the official document.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-1">
          <a
            href={job.officialPdfUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#CCD8F0] hover:border-[#1E3799] text-[#1E3799] text-sm font-bold"
          >
            <FileText className="w-4 h-4" />
            Official notification
          </a>
          {job.applyOnlineUrl && (
            <a
              href={job.applyOnlineUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#EAE2D2] hover:border-[#1E3799] text-[#1A1918] text-sm font-bold"
            >
              Official website
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
