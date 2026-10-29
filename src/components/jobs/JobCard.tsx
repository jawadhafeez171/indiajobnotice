"use client";

import React from "react";
import Link from "next/link";
import { JobNotification, getCategoryColors, formatAgeRange } from "@/data/jobs";
import { JobStatusBadge } from "./JobStatusBadge";
import { formatDate, getDaysRemaining, cn } from "@/lib/utils";
import { FileText, ArrowRight, Bookmark, ShieldCheck } from "lucide-react";
import { useWatchlist } from "@/lib/watchlist";

interface Props {
  job: JobNotification;
  currentStateSlug?: string;
  currentDistrictSlug?: string;
}

export function JobCard({ job, currentStateSlug, currentDistrictSlug }: Props) {
  const { isSaved, toggleSave } = useWatchlist();
  const saved = isSaved(job.id);

  const daysLeft = getDaysRemaining(job.applicationEndDate);
  const isEndingSoon = daysLeft > 0 && daysLeft <= 7;
  const categoryColors = getCategoryColors(job.category);
  
  const detailLink = job.isCentral
    ? `/jobs/${job.slug}`
    : `/state/${job.stateSlug}/jobs/${job.slug}`;

  const districtQuota = currentDistrictSlug 
    ? job.districtWiseVacancies?.find((v) => v.districtSlug.toLowerCase() === currentDistrictSlug.toLowerCase())
    : null;

  return (
    <article className="group bg-white rounded-lg border border-[#EAE2D2] hover:border-[#1E3799]/50 transition-all p-5 flex flex-col justify-between relative overflow-hidden shadow-2xs hover:shadow-xs">
      {/* Subtle brand color accent line on left */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1", categoryColors.stripe)} />

      <div className="pl-1.5">
        {/* Top Tag Row */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide border",
                categoryColors.bg,
                categoryColors.text,
                categoryColors.border
              )}
            >
              {categoryColors.label}
            </span>

            <span className="text-[10px] font-mono uppercase text-[#706B62] font-semibold">
              {job.orgShortCode} · {job.isCentral ? "Central" : job.stateSlug.toUpperCase()}
            </span>

            {job.isDistrictSpecific && job.districtName && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FDF3EB] text-[#E96B15] border border-[#F9D7C0]">
                📍 {job.districtName} Only
              </span>
            )}

            {districtQuota && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#EBF7EE] text-[#1E7E34] border border-[#C3E6CB]">
                🎯 {districtQuota.vacancies.toLocaleString("en-IN")} Local Posts
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <JobStatusBadge status={job.status} />
            <button
              onClick={() => toggleSave(job.id)}
              className={cn(
                "p-1 rounded transition-colors",
                saved
                  ? "text-[#E96B15] hover:text-[#D4590A]"
                  : "text-[#B8B0A2] hover:text-[#1E3799]"
              )}
              title={saved ? "Remove from Pinned Notices" : "Pin notice to Watchlist"}
              aria-label={saved ? "Unpin notice" : "Pin notice"}
            >
              <Bookmark className={cn("w-4 h-4", saved && "fill-[#E96B15]")} />
            </button>
          </div>
        </div>

        {/* Title */}
        <Link href={detailLink} className="block group">
          <h3 className="font-serif text-lg font-bold text-[#1A1918] group-hover:text-[#1E3799] transition-colors leading-snug">
            {job.title}
          </h3>
        </Link>

        {/* Organization Name */}
        <p className="text-xs text-[#68635B] mt-1 line-clamp-1 font-medium">
          {job.organization}
        </p>

        {/* Essential Specs Row */}
        <div className="mt-4 pt-3 border-t border-[#F2ECE1] flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#423F3A]">
          <span>
            <span className="text-[#757067]">Posts: </span>
            <b className="text-[#1E3799] font-mono font-bold">{job.totalVacancies ? job.totalVacancies.toLocaleString("en-IN") : "—"}</b>
          </span>
          <span className="text-[#D8CFBF]">·</span>
          <span>
            <span className="text-[#757067]">Age: </span>
            <b>{formatAgeRange(job)}</b>
          </span>
          <span className="text-[#D8CFBF]">·</span>
          <span className="truncate">
            <span className="text-[#757067]">Qual: </span>
            <b>{job.qualifications[0]}</b>
          </span>
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="pl-1.5 mt-4 pt-3 border-t border-[#F2ECE1] flex items-center justify-between text-xs">
        <div className="text-[#68635B] flex items-center gap-1.5 flex-wrap">
          <div>
            <span>Closing: </span>
            <span className={cn("font-medium", isEndingSoon ? "text-[#E96B15] font-bold" : "text-[#1A1918]")}>
              {formatDate(job.applicationEndDate)}
            </span>
            {isEndingSoon && (
              <span className="ml-1 text-[10px] font-bold text-[#E96B15] bg-[#FDF3EB] px-1.5 py-0.2 rounded border border-[#F9D7C0]">
                {daysLeft}d left
              </span>
            )}
          </div>
          <span className="text-[#D8CFBF] hidden sm:inline">·</span>
          <span className="text-[10px] text-[#209948] font-bold hidden sm:inline-flex items-center gap-0.5 bg-[#EDF7F0] px-1.5 py-0.2 rounded border border-[#C6E7D0]">
            <ShieldCheck className="w-3 h-3 text-[#209948]" />
            <span>Verified</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={job.officialPdfUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[#68635B] hover:text-[#1E3799] flex items-center gap-1 font-medium text-xs transition-colors"
            title="Download Official Notification PDF"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PDF</span>
          </a>

          <Link
            href={detailLink}
            className="text-[#E96B15] hover:text-[#D4590A] font-bold flex items-center gap-1 transition-colors"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
