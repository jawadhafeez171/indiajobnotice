"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { 
  Bookmark, 
  X, 
  Trash2, 
  ExternalLink, 
  ArrowRight, 
  Clock, 
  Download,
  ShieldCheck
} from "lucide-react";
import { useWatchlist } from "@/lib/watchlist";
import { formatDate, getDaysRemaining, cn } from "@/lib/utils";
import { downloadCombinedIcsFile, CalendarEventParams } from "@/lib/calendar";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { getStateBySlug } from "@/config/states";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function WatchlistDrawer({ isOpen, onClose }: Props) {
  const { savedJobs, savedCount, removeJob, clearAll } = useWatchlist({ withJobs: true });

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleExportAllToCalendar = () => {
    if (savedJobs.length === 0) return;

    const events: CalendarEventParams[] = [];
    savedJobs.forEach((job) => {
      // Application deadline event
      events.push({
        title: `DEADLINE: ${job.shortTitle} Application Closes`,
        description: `Last date to submit online application for ${job.organization} (${job.totalVacancies} Posts).\n\nApply at: ${job.applyOnlineUrl}`,
        startDate: job.applicationEndDate,
        location: job.isCentral ? "All India / Central" : `${job.stateSlug.toUpperCase()} State`,
        url: job.applyOnlineUrl,
      });

      // Exam date event if known
      if (job.examDate && /\d{4}/.test(job.examDate)) {
        // approximate date or extract
        const match = job.examDate.match(/\d{4}-\d{2}-\d{2}/);
        if (match) {
          events.push({
            title: `EXAM: ${job.shortTitle}`,
            description: `Scheduled examination date for ${job.organization} (${job.title}).`,
            startDate: match[0],
            location: "Designated Examination Center",
            url: job.officialPdfUrl,
          });
        }
      }
    });

    downloadCombinedIcsFile(events, "indiajobnotice-my-tracked-exams.ics");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-subtle h-full shadow-2xl flex flex-col border-l border-line z-10 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-line bg-surface flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-lg font-bold text-ink">Saved jobs</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-navy-tint text-navy tabular-nums">{savedCount}</span>
          </div>

          <button
            onClick={onClose}
            className="w-11 h-11 -mr-2 flex items-center justify-center rounded-lg text-muted hover:text-ink hover:bg-navy-tint transition-colors"
            aria-label="Close saved jobs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar if items exist */}
        {savedCount > 0 && (
          <div className="px-5 py-2.5 bg-subtle border-b border-line flex items-center justify-between text-xs">
            <button
              onClick={handleExportAllToCalendar}
              className="inline-flex items-center gap-1.5 font-bold text-navy hover:underline"
              title="Download the last dates of your saved jobs as a calendar file (.ics)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Add all to calendar</span>
            </button>

            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1 text-danger hover:underline font-semibold"
            >
              <Trash2 className="w-3 h-3" />
              <span>Remove all</span>
            </button>
          </div>
        )}

        {/* Job List / Empty State */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {savedCount === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted">
              <div className="w-14 h-14 rounded-full bg-navy-tint text-navy flex items-center justify-center mb-4 border border-navy-line">
                <Bookmark className="w-7 h-7 stroke-[1.5]" />
              </div>
              <h3 className="font-serif text-base font-bold text-ink">No saved jobs yet</h3>
              <p className="text-sm text-muted mt-1.5 max-w-xs leading-relaxed">
                Tap <span className="font-semibold text-navy">Save</span> on a job to keep its last date here.
              </p>
              <button
                onClick={onClose}
                className="mt-6 min-h-[44px] px-5 bg-navy-solid text-white text-sm font-bold rounded-lg hover:bg-navy-strong transition-colors"
              >
                See open jobs
              </button>
            </div>
          ) : (
            savedJobs.map((job) => {
              const daysLeft = getDaysRemaining(job.applicationEndDate);
              const isUrgent = daysLeft > 0 && daysLeft <= 5;
              const isExpired = daysLeft < 0;
              const detailLink = job.isCentral
                ? `/jobs/${job.slug}`
                : `/state/${job.stateSlug}/jobs/${job.slug}`;

              return (
                <div
                  key={job.id}
                  className="bg-surface rounded-lg border border-line p-4 shadow-2xs flex flex-col justify-between hover:border-navy/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-muted">
                          {job.orgShortCode} · {job.isCentral ? "Central" : getStateBySlug(job.stateSlug)?.name || job.stateSlug}
                        </span>
                      </div>
                      <button
                        onClick={() => removeJob(job.id)}
                        className="w-9 h-9 -mr-2 flex items-center justify-center text-muted hover:text-danger transition-colors"
                        title="Remove from saved jobs"
                        aria-label={`Remove ${job.shortTitle} from saved jobs`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <Link
                      href={detailLink}
                      onClick={onClose}
                      className="font-serif text-sm font-bold text-ink hover:text-navy transition-colors block line-clamp-2"
                    >
                      {job.title}
                    </Link>

                    <p className="text-[12px] text-muted mt-1 font-medium">
                      {job.organization}{job.totalVacancies ? ` · ${job.totalVacancies.toLocaleString("en-IN")} posts` : ""}
                    </p>

                    {/* Deadline Ribbon */}
                    <div className="mt-3 pt-2.5 border-t border-line-soft flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-[12px]">
                        <Clock className={cn("w-3.5 h-3.5", isUrgent ? "text-saffron" : "text-muted")} />
                        {isExpired ? (
                          <span className="text-muted">Applications closed</span>
                        ) : isUrgent ? (
                          <span className="text-saffron font-bold">Closes in {daysLeft} {daysLeft === 1 ? "day" : "days"}</span>
                        ) : (
                          <span className="text-muted">Last date {formatDate(job.applicationEndDate)}</span>
                        )}
                      </div>

                      <JobStatusBadge status={job.status} />
                    </div>

                    {/* Quick Link Buttons */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs pt-1">
                      <Link
                        href={detailLink}
                        onClick={onClose}
                        className="min-h-[40px] px-2 rounded bg-navy-tint hover:bg-navy-tint-2 text-navy font-bold text-center border border-navy-line transition-colors flex items-center justify-center gap-1"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>

                      <a
                        href={job.applyOnlineUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="min-h-[40px] px-2 rounded bg-saffron-solid hover:bg-saffron-strong text-white font-bold text-center transition-colors flex items-center justify-center gap-1 shadow-2xs"
                      >
                        <span>Apply</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Note */}
        <div className="p-3.5 bg-surface border-t border-line text-[12px] text-muted flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green shrink-0" />
          <span>Saved on this device only. Nothing is sent to us.</span>
        </div>
      </div>
    </div>
  );
}
