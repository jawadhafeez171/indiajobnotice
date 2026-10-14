"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { 
  Bookmark, 
  X, 
  Trash2, 
  Calendar, 
  ExternalLink, 
  ArrowRight, 
  Clock, 
  Download,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { useWatchlist } from "@/lib/watchlist";
import { formatDate, getDaysRemaining, cn } from "@/lib/utils";
import { downloadCombinedIcsFile, CalendarEventParams } from "@/lib/calendar";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { getCategoryColors } from "@/data/jobs";
import { TricolorCapsule } from "./BrandLogo";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function WatchlistDrawer({ isOpen, onClose }: Props) {
  const { savedJobs, savedCount, removeJob, clearAll } = useWatchlist();

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
      <div className="relative w-full max-w-md bg-[#FCFAF4] h-full shadow-2xl flex flex-col border-l border-[#EAE2D2] z-10 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#EAE2D2] bg-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TricolorCapsule className="w-10 h-1" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1E3799] font-bold">
                Personal Aspirant Watchlist
              </span>
            </div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg font-bold text-[#1A1918]">
                Pinned Circulars
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-[#EEF2FA] text-[#1E3799] border border-[#CCD8F0]">
                {savedCount}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#68635B] hover:text-[#1A1918] hover:bg-[#EEF2FA] transition-colors"
            aria-label="Close Watchlist Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar if items exist */}
        {savedCount > 0 && (
          <div className="px-5 py-2.5 bg-[#FAF7EF] border-b border-[#EAE2D2] flex items-center justify-between text-xs">
            <button
              onClick={handleExportAllToCalendar}
              className="inline-flex items-center gap-1.5 font-bold text-[#1E3799] hover:underline"
              title="Download calendar schedule (.ics) for all pinned exams"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export to Calendar (.ics)</span>
            </button>

            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1 text-[#C41C1C] hover:underline font-semibold"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          </div>
        )}

        {/* Job List / Empty State */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {savedCount === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#68635B]">
              <div className="w-14 h-14 rounded-full bg-[#EEF2FA] text-[#1E3799] flex items-center justify-center mb-4 border border-[#CCD8F0]">
                <Bookmark className="w-7 h-7 stroke-[1.5]" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#1A1918]">
                No Pinned Notices Yet
              </h3>
              <p className="text-xs text-[#68635B] mt-1.5 max-w-xs leading-relaxed">
                Click the <span className="font-semibold text-[#1E3799]">Pin / Bookmark</span> button on any recruitment card to track application deadlines, admit card releases, and exam dates in one place.
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-4 py-2 bg-[#1E3799] text-white text-xs font-bold rounded-md hover:bg-[#162a75] transition-colors shadow-2xs"
              >
                Browse Latest Notifications
              </button>
            </div>
          ) : (
            savedJobs.map((job) => {
              const daysLeft = getDaysRemaining(job.applicationEndDate);
              const isUrgent = daysLeft > 0 && daysLeft <= 5;
              const isExpired = daysLeft < 0;
              const categoryColors = getCategoryColors(job.category);
              const detailLink = job.isCentral
                ? `/jobs/${job.slug}`
                : `/state/${job.stateSlug}/jobs/${job.slug}`;

              return (
                <div
                  key={job.id}
                  className="bg-white rounded-lg border border-[#EAE2D2] p-4 shadow-2xs relative overflow-hidden flex flex-col justify-between hover:border-[#1E3799]/40 transition-all"
                >
                  <div className={cn("absolute left-0 top-0 bottom-0 w-1", categoryColors.stripe)} />

                  <div className="pl-1">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono uppercase font-bold text-[#68635B]">
                          {job.orgShortCode} · {job.isCentral ? "CENTRAL" : job.stateSlug.toUpperCase()}
                        </span>
                      </div>
                      <button
                        onClick={() => removeJob(job.id)}
                        className="text-[#999] hover:text-[#C41C1C] transition-colors p-1"
                        title="Remove from watchlist"
                        aria-label="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <Link
                      href={detailLink}
                      onClick={onClose}
                      className="font-serif text-sm font-bold text-[#1A1918] hover:text-[#1E3799] transition-colors block line-clamp-2"
                    >
                      {job.title}
                    </Link>

                    <p className="text-[11px] text-[#68635B] mt-1 font-medium">
                      {job.organization} · {job.totalVacancies.toLocaleString()} Posts
                    </p>

                    {/* Deadline Ribbon */}
                    <div className="mt-3 pt-2.5 border-t border-[#F2ECE1] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 font-mono text-[11px]">
                        <Clock className={cn("w-3.5 h-3.5", isUrgent ? "text-[#E96B15]" : "text-[#68635B]")} />
                        {isExpired ? (
                          <span className="text-[#888]">Application Closed</span>
                        ) : isUrgent ? (
                          <span className="text-[#E96B15] font-bold">Ends in {daysLeft} {daysLeft === 1 ? "day" : "days"}!</span>
                        ) : (
                          <span className="text-[#68635B]">Last Date: {formatDate(job.applicationEndDate)}</span>
                        )}
                      </div>

                      <JobStatusBadge status={job.status} />
                    </div>

                    {/* Quick Link Buttons */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs pt-1">
                      <Link
                        href={detailLink}
                        onClick={onClose}
                        className="py-1.5 px-2 rounded bg-[#EEF2FA] hover:bg-[#E0E9F8] text-[#1E3799] font-bold text-center border border-[#CCD8F0] transition-colors flex items-center justify-center gap-1"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>

                      <a
                        href={job.applyOnlineUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="py-1.5 px-2 rounded bg-[#E96B15] hover:bg-[#D4590A] text-white font-bold text-center transition-colors flex items-center justify-center gap-1 shadow-2xs"
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
        <div className="p-3.5 bg-white border-t border-[#EAE2D2] text-[11px] text-[#68635B] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#209948] shrink-0" />
          <span>Tracked offline in your browser. Data is private and never shared.</span>
        </div>
      </div>
    </div>
  );
}
