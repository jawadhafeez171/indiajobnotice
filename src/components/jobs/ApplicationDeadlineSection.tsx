import React from "react";
import { JobNotification, isJobApplicationClosed } from "@/data/jobs";
import { formatDate, getDaysRemaining } from "@/lib/utils";
import { generateGoogleCalendarUrl } from "@/lib/calendar";
import { getJobCorrigendum } from "@/lib/exam-details";
import { 
  Clock, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  BellRing,
  ShieldAlert,
} from "lucide-react";
import { TricolorCapsule } from "@/components/common/BrandLogo";

interface Props {
  job: JobNotification;
  stateSlug?: string;
}

export function ApplicationDeadlineSection({ job }: Props) {
  const isClosed = isJobApplicationClosed(job);
  const daysLeft = getDaysRemaining(job.applicationEndDate);
  const corrigendum = getJobCorrigendum(job);

  const deadlineCalendarUrl = generateGoogleCalendarUrl({
    title: `LAST DATE: ${job.shortTitle} Application Closes`,
    description: `Official IndiaJobNotice deadline alert for ${job.organization} (${job.totalVacancies} Posts).\nApply online: ${job.applyOnlineUrl}`,
    startDate: job.applicationEndDate,
    location: job.isCentral ? "All India / Central" : `${job.stateSlug.toUpperCase()} State`,
    url: job.applyOnlineUrl,
  });

  return (
    <section 
      id="last-date-to-apply" 
      className="bg-white rounded-xl border border-[#EAE2D2] p-6 sm:p-7 shadow-2xs space-y-6 scroll-mt-20"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2ECE1] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TricolorCapsule className="w-10 h-1.5" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#E96B15] font-bold">
              Deadlines & Important Dates
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1918]">
            {job.shortTitle} 2026 Last Date to Apply & Application Schedule
          </h2>
          <p className="text-xs text-[#68635B] mt-1">
            Official timeline for registration opening, final submission cutoff, fee payment window, and corrigendum notices.
          </p>
        </div>

        {/* Live Status Pill */}
        <div className="shrink-0">
          {isClosed ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7EF] border border-[#DDD5C7] text-[#68635B] font-mono font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-[#68635B]" />
              Applications Closed
            </span>
          ) : daysLeft <= 3 ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FDF3EB] border border-[#E96B15] text-[#E96B15] font-mono font-bold text-xs animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[#E96B15]" />
              Closing Soon: {daysLeft} Day{daysLeft === 1 ? "" : "s"} Remaining
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EDF7F0] border border-[#209948] text-[#209948] font-mono font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-[#209948]" />
              Registrations Active ({daysLeft} Days Left)
            </span>
          )}
        </div>
      </div>

      {/* Corrigendum or Extension Alert Box if Applicable */}
      {corrigendum && (
        <div className="bg-[#FDF3EB] border-l-4 border-l-[#E96B15] rounded-r-lg p-4 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-[#E96B15]">
            <BellRing className="w-4 h-4" />
            <span>Official Date Extension / Corrigendum Notice</span>
          </div>
          <p className="text-[#524E48] leading-relaxed">
            {corrigendum.details}
          </p>
        </div>
      )}

      {/* Comprehensive Application Schedule Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border border-[#EAE2D2] rounded-lg overflow-hidden bg-white">
          <thead>
            <tr className="bg-[#FAF7EC] border-b border-[#EAE2D2] font-mono text-[11px] text-[#68635B] uppercase">
              <th className="py-3 px-4 font-bold text-[#1E3799]">Recruitment Event</th>
              <th className="py-3 px-4 font-bold text-[#1A1918]">Official Scheduled Date</th>
              <th className="py-3 px-4 font-semibold text-right">Remarks & Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2ECE1]">
            <tr className="hover:bg-[#FCFAF4] transition-colors">
              <td className="py-3 px-4 font-semibold text-[#1A1918] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1E3799] shrink-0" />
                <span>Online Registration Start Date</span>
              </td>
              <td className="py-3 px-4 font-mono font-bold text-[#1A1918]">
                {formatDate(job.applicationStartDate)}
              </td>
              <td className="py-3 px-4 text-right">
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#EDF7F0] text-[#209948]">
                  Portal Opened
                </span>
              </td>
            </tr>

            {/* Crucial Application Last Date Row (Highlighted) */}
            <tr className={isClosed ? "bg-[#FAF7EF]" : "bg-[#FDF3EB]/60 font-semibold"}>
              <td className="py-3.5 px-4 text-[#1A1918] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#E96B15] shrink-0" />
                <span className="font-bold text-sm text-[#E96B15]">{job.isWalkIn ? "Walk-in Interview Date" : "Last Date to Apply"}</span>
              </td>
              <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#E96B15]">
                {job.applicationEndDate ? formatDate(job.applicationEndDate) : "See notification"}
              </td>
              <td className="py-3.5 px-4 text-right">
                {isClosed ? (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#DDD5C7] text-[#524E48]">
                    Window Closed
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E96B15] text-white">
                    {daysLeft > 0 ? `${daysLeft} Days Left` : "Closing Today"}
                  </span>
                )}
              </td>
            </tr>

            {/* Only dates the notification gives; fee, correction and admit-card windows vary and are not guessed */}
            {job.examDate && (
              <tr className="hover:bg-[#FCFAF4] transition-colors">
                <td className="py-3 px-4 font-semibold text-[#1A1918] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#209948] shrink-0" />
                  <span>Examination Date</span>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-[#209948]">{job.examDate}</td>
                <td className="py-3 px-4 text-right text-[11px] text-[#68635B]">As per the notification</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Server Crash & Final Day Advisory */}
      <div className="bg-[#FCFAF4] rounded-lg border border-[#EAE2D2] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-[#E96B15] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-[#1A1918] block">
              Official Server Congestion Advisory for Aspirants
            </span>
            <p className="text-[#524E48] leading-relaxed">
              Recruitment servers face heavy traffic spikes during the final 48 hours. Candidates are strongly advised not to wait until the last date to complete online registration and fee payment.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {!isClosed && (
            <a
              href={job.applyOnlineUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg bg-[#E96B15] hover:bg-[#D4590A] text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Apply Online Now</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <a
            href={deadlineCalendarUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-lg bg-white border border-[#DDD5C7] hover:border-[#1E3799] text-[#1E3799] font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
            title="Add last date to Google Calendar"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Add Deadline to Calendar</span>
          </a>
        </div>
      </div>
    </section>
  );
}
