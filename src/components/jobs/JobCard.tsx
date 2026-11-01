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
    <article className="group bg-surface rounded-lg border border-line hover:border-navy/50 transition-all p-5 flex flex-col justify-between relative overflow-hidden shadow-2xs hover:shadow-xs">
      {/* Subtle brand color accent line on left */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1", categoryColors.stripe)} />

      <div className="pl-1.5">
        {/* Top Tag Row */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wide border",
                categoryColors.bg,
                categoryColors.text,
                categoryColors.border
              )}
            >
              {categoryColors.label}
            </span>

            <span className="text-[11px] font-mono uppercase text-muted font-semibold">
              {job.orgShortCode} · {job.isCentral ? "Central" : job.stateSlug.toUpperCase()}
            </span>

            {job.isDistrictSpecific && job.districtName && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-saffron-tint text-saffron border border-saffron-line">
                📍 {job.districtName} Only
              </span>
            )}

            {districtQuota && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-green-tint text-green border border-green-line">
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
                  ? "text-saffron hover:text-saffron"
                  : "text-faint hover:text-navy"
              )}
              title={saved ? "Remove from Pinned Notices" : "Pin notice to Watchlist"}
              aria-label={saved ? "Unpin notice" : "Pin notice"}
            >
              <Bookmark className={cn("w-4 h-4", saved && "fill-saffron-bright")} />
            </button>
          </div>
        </div>

        {/* Title */}
        <Link href={detailLink} className="block group">
          <h3 className="font-serif text-lg font-bold text-ink group-hover:text-navy transition-colors leading-snug">
            {job.title}
          </h3>
        </Link>

        {/* Organization Name */}
        <p className="text-xs text-muted mt-1 line-clamp-1 font-medium">
          {job.organization}
        </p>

        {/* Essential Specs Row */}
        <div className="mt-4 pt-3 border-t border-line-soft flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-2">
          <span>
            <span className="text-muted">Posts: </span>
            <b className="text-navy font-mono font-bold">{job.totalVacancies ? job.totalVacancies.toLocaleString("en-IN") : "—"}</b>
          </span>
          <span className="text-faint">·</span>
          <span>
            <span className="text-muted">Age: </span>
            <b>{formatAgeRange(job)}</b>
          </span>
          <span className="text-faint">·</span>
          <span className="truncate">
            <span className="text-muted">Qual: </span>
            <b>{job.qualifications[0]}</b>
          </span>
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="pl-1.5 mt-4 pt-3 border-t border-line-soft flex items-center justify-between text-xs">
        <div className="text-muted flex items-center gap-1.5 flex-wrap">
          <div>
            <span>Closing: </span>
            <span className={cn("font-medium", isEndingSoon ? "text-saffron font-bold" : "text-ink")}>
              {formatDate(job.applicationEndDate)}
            </span>
            {isEndingSoon && (
              <span className="ml-1 text-[11px] font-bold text-saffron bg-saffron-tint px-1.5 py-0.2 rounded border border-saffron-line">
                {daysLeft}d left
              </span>
            )}
          </div>
          <span className="text-faint hidden sm:inline">·</span>
          <span className="text-[11px] text-green font-bold hidden sm:inline-flex items-center gap-0.5 bg-green-tint px-1.5 py-0.2 rounded border border-green-line">
            <ShieldCheck className="w-3 h-3 text-green" />
            <span>Verified</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={job.officialPdfUrl}
            target="_blank"
            rel="noreferrer"
            className="text-muted hover:text-navy flex items-center gap-1 font-medium text-xs transition-colors"
            title="Download Official Notification PDF"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PDF</span>
          </a>

          <Link
            href={detailLink}
            className="text-saffron hover:text-saffron font-bold flex items-center gap-1 transition-colors"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
