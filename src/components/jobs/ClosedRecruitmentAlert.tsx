import React from "react";
import Link from "next/link";
import { JobNotification } from "@/data/jobs";
import { formatDate } from "@/lib/utils";
import { AlertCircle, ArrowRight, Briefcase, ExternalLink, Calendar, Building2 } from "lucide-react";

interface Props {
  job: JobNotification;
  stateSlug?: string;
  activeJobs: JobNotification[];   // open recruitments to suggest instead (getActiveOpportunities)
}

export function ClosedRecruitmentAlert({ job, stateSlug, activeJobs }: Props) {

  return (
    <div className="space-y-4 print:hidden" id="applications-closed-notice">
      {/* Primary Alert Banner */}
      <div className="bg-[#FAF7EF] border-2 border-[#DDD5C7] rounded-xl p-5 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-lg bg-[#68635B] text-white shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#68635B] text-white">
                Applications Closed for This Cycle
              </span>
              <span className="text-xs font-mono text-[#68635B] font-semibold">
                Closed Date: {formatDate(job.applicationEndDate)}
              </span>
            </div>
            <h3 className="font-serif text-base font-bold text-[#1A1918]">
              Online Application Window for {job.shortTitle} Has Concluded
            </h3>
            <p className="text-xs text-[#524E48] leading-relaxed">
              New registrations are no longer accepted for this recruitment cycle. This master gazette page remains permanently accessible as an authoritative reference for eligibility criteria, post-wise qualification mappings, detailed syllabus, and historical cut-offs. Registered candidates can check Admit Card, Answer Key, and Result stages using the lifecycle tabs above.
            </p>
          </div>
        </div>
      </div>

      {/* Active Opportunities Callout */}
      {activeJobs.length > 0 && (
        <div className="bg-white rounded-xl border border-[#EAE2D2] p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3 border-b border-[#F2ECE1] pb-2.5">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#209948]" />
              <h4 className="font-serif text-sm font-bold text-[#1A1918]">
                Looking for Active Opportunities? Check Ongoing Recruitments:
              </h4>
            </div>
            <Link
              href="/"
              className="text-xs font-bold text-[#1E3799] hover:underline flex items-center gap-1"
            >
              <span>View All Active Gazettes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {activeJobs.map((activeJob) => (
              <Link
                key={activeJob.id}
                href={activeJob.isCentral ? `/jobs/${activeJob.slug}` : `/state/${activeJob.stateSlug}/jobs/${activeJob.slug}`}
                className="p-3 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2] hover:border-[#1E3799] hover:bg-white transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="text-[#1E3799] font-bold">{activeJob.orgShortCode}</span>
                    <span className="text-[#209948] font-bold bg-[#EDF7F0] px-1.5 py-0.2 rounded border border-[#C6E7D0]">
                      Open Now
                    </span>
                  </div>
                  <span className="font-serif font-bold text-xs text-[#1A1918] group-hover:text-[#1E3799] transition-colors line-clamp-2">
                    {activeJob.title}
                  </span>
                </div>
                <div className="mt-2.5 pt-2 border-t border-[#F2ECE1] flex items-center justify-between text-[10px] text-[#68635B]">
                  <span>{activeJob.totalVacancies.toLocaleString("en-IN")} Posts</span>
                  <span className="text-[#E96B15] font-semibold">Ends {formatDate(activeJob.applicationEndDate)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
