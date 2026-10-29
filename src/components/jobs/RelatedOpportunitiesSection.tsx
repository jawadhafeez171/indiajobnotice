import React from "react";
import Link from "next/link";
import { 
  Briefcase, 
  Building2, 
  Users, 
  Calendar, 
  ArrowRight, 
  FileText, 
  Award,
  Sparkles,
  MapPin,
  GraduationCap
} from "lucide-react";
import { JobNotification } from "@/data/jobs";
import { RelatedOpportunity } from "@/lib/internal-links";
import { JobStatusBadge } from "./JobStatusBadge";
import { formatDate, getDaysRemaining } from "@/lib/utils";

interface Props {
  currentJob: JobNotification;
  related: RelatedOpportunity[];   // getGenuinelyRelatedOpportunities, worked out on the server
}

export function RelatedOpportunitiesSection({ currentJob, related }: Props) {

  if (!related || related.length === 0) {
    return null;
  }

  const getReasonBadgeStyle = (type: RelatedOpportunity["relationshipType"]) => {
    switch (type) {
      case "organisation":
        return "bg-[#EEF2FA] text-[#1E3799] border-[#CCD8F0]";
      case "state":
        return "bg-[#FDF3EB] text-[#E96B15] border-[#F9D9C3]";
      case "sector":
        return "bg-[#EDF7F0] text-[#209948] border-[#C6E7D0]";
      case "qualification":
      default:
        return "bg-[#FAF7EF] text-[#68635B] border-[#EAE2D2]";
    }
  };

  const getReasonIcon = (type: RelatedOpportunity["relationshipType"]) => {
    switch (type) {
      case "organisation":
        return <Building2 className="w-3 h-3 text-[#1E3799]" />;
      case "state":
        return <MapPin className="w-3 h-3 text-[#E96B15]" />;
      case "sector":
        return <Briefcase className="w-3 h-3 text-[#209948]" />;
      case "qualification":
      default:
        return <GraduationCap className="w-3 h-3 text-[#68635B]" />;
    }
  };

  return (
    <section className="bg-white rounded-xl border border-[#EAE2D2] p-6 sm:p-7 shadow-2xs print:hidden space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAE2D2] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#E96B15]" />
            <h3 className="font-serif text-lg font-bold text-[#1A1918]">
              Genuinely Related Opportunities & Alternate Drives
            </h3>
          </div>
          <p className="text-xs text-[#68635B] mt-0.5">
            Recruitments matching candidate eligibility, commissioning authority, and cadre stream
          </p>
        </div>
        <span className="text-[11px] font-mono font-bold text-[#1E3799] bg-[#EEF2FA] px-2.5 py-1 rounded border border-[#CCD8F0] self-start sm:self-auto">
          {related.length} Peer Gazettes Linked
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {related.map(({ job, relationshipReason, relationshipType }) => {
          const jobHref = job.isCentral
            ? `/jobs/${job.slug}`
            : `/state/${job.stateSlug}/jobs/${job.slug}`;

          const daysLeft = getDaysRemaining(job.applicationEndDate);

          return (
            <div
              key={job.id}
              className="p-4 rounded-xl border border-[#EAE2D2] bg-[#FCFAF4] hover:bg-white hover:border-[#1E3799] hover:shadow-2xs transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Relationship Reason Chip */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold border ${getReasonBadgeStyle(
                      relationshipType
                    )}`}
                  >
                    {getReasonIcon(relationshipType)}
                    <span>{relationshipReason}</span>
                  </span>
                  <JobStatusBadge status={job.status} />
                </div>

                {/* Job Link and Title */}
                <Link href={jobHref} className="block group-hover:text-[#1E3799] transition-colors">
                  <h4 className="font-serif font-bold text-sm text-[#1A1918] line-clamp-2 leading-snug">
                    {job.title}
                  </h4>
                </Link>

                <p className="text-xs text-[#68635B] mt-1 font-medium flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#1E3799] shrink-0" />
                  <span className="truncate">{job.organization}</span>
                </p>

                {/* Vacancy and Pay details */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-white border border-[#EAE2D2]/80">
                    <span className="text-[10px] uppercase font-mono text-[#68635B] block font-semibold">Vacancies</span>
                    <span className="font-mono font-bold text-sm text-[#1A1918]">{job.totalVacancies ? job.totalVacancies.toLocaleString("en-IN") : "—"}</span>
                  </div>
                  <div className="p-2 rounded bg-white border border-[#EAE2D2]/80">
                    <span className="text-[10px] uppercase font-mono text-[#68635B] block font-semibold">Pay Scale</span>
                    <span className="font-mono font-bold text-xs text-[#209948] truncate block" title={job.salary}>
                      {job.salary ? job.salary.split("(")[0].trim() : "Standard Pay Matrix"}
                    </span>
                  </div>
                </div>

                {/* Minimum Qualification tags */}
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {job.qualifications.slice(0, 2).map((q, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-white border border-[#EAE2D2] text-[#524E48] font-medium"
                    >
                      {q}
                    </span>
                  ))}
                  {job.qualifications.length > 2 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-[#EAE2D2] text-[#68635B]">
                      +{job.qualifications.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Actions & Deep Internal Links */}
              <div className="mt-4 pt-3 border-t border-[#EAE2D2] flex items-center justify-between gap-2 text-xs">
                {/* Secondary Sub-page links for crawlers & candidates */}
                <div className="flex items-center gap-2 text-[11px] font-medium text-[#68635B]">
                  <Link
                    href={`${jobHref}/admit-card`}
                    className="hover:text-[#1E3799] hover:underline"
                    title={`Admit Card for ${job.shortTitle}`}
                  >
                    Admit Card
                  </Link>
                  <span>•</span>
                  <Link
                    href={`${jobHref}/result`}
                    className="hover:text-[#209948] hover:underline"
                    title={`Merit List & Result for ${job.shortTitle}`}
                  >
                    Result
                  </Link>
                </div>

                <Link
                  href={jobHref}
                  className="font-bold text-xs text-[#1E3799] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>View Gazette</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
