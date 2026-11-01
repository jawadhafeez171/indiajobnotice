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
        return "bg-navy-tint text-navy border-navy-line";
      case "state":
        return "bg-saffron-tint text-saffron border-saffron-line";
      case "sector":
        return "bg-green-tint text-green border-green-line";
      case "qualification":
      default:
        return "bg-subtle text-muted border-line";
    }
  };

  const getReasonIcon = (type: RelatedOpportunity["relationshipType"]) => {
    switch (type) {
      case "organisation":
        return <Building2 className="w-3 h-3 text-navy" />;
      case "state":
        return <MapPin className="w-3 h-3 text-saffron" />;
      case "sector":
        return <Briefcase className="w-3 h-3 text-green" />;
      case "qualification":
      default:
        return <GraduationCap className="w-3 h-3 text-muted" />;
    }
  };

  return (
    <section className="bg-surface rounded-xl border border-line p-6 sm:p-7 shadow-2xs print:hidden space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-saffron" />
            <h3 className="font-serif text-lg font-bold text-ink">
              Similar jobs
            </h3>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Same qualification, organisation or kind of post
          </p>
        </div>
        <span className="text-[12px] font-mono font-bold text-navy bg-navy-tint px-2.5 py-1 rounded border border-navy-line self-start sm:self-auto">
          {related.length} similar
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
              className="p-4 rounded-xl border border-line bg-subtle hover:bg-surface hover:border-navy hover:shadow-2xs transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Relationship Reason Chip */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[12px] font-bold border ${getReasonBadgeStyle(
                      relationshipType
                    )}`}
                  >
                    {getReasonIcon(relationshipType)}
                    <span>{relationshipReason}</span>
                  </span>
                  <JobStatusBadge status={job.status} />
                </div>

                {/* Job Link and Title */}
                <Link href={jobHref} className="block group-hover:text-navy transition-colors">
                  <h4 className="font-serif font-bold text-sm text-ink line-clamp-2 leading-snug">
                    {job.title}
                  </h4>
                </Link>

                <p className="text-xs text-muted mt-1 font-medium flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-navy shrink-0" />
                  <span className="truncate">{job.organization}</span>
                </p>

                {/* Posts and last date */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-surface border border-line/80">
                    <span className="text-[11px] uppercase text-muted block font-semibold">Posts</span>
                    <span className="font-bold text-sm text-ink">
                      {job.totalVacancies ? job.totalVacancies.toLocaleString("en-IN") : "See notification"}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-surface border border-line/80">
                    <span className="text-[11px] uppercase text-muted block font-semibold">
                      {job.isWalkIn ? "Walk-in" : "Last date"}
                    </span>
                    <span className="font-bold text-xs text-ink block">
                      {job.applicationEndDate ? formatDate(job.applicationEndDate) : job.currentStage || "See notification"}
                    </span>
                  </div>
                </div>

                {/* Minimum Qualification tags */}
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {job.qualifications.slice(0, 2).map((q, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded bg-surface border border-line text-ink-2 font-medium"
                    >
                      {q}
                    </span>
                  ))}
                  {job.qualifications.length > 2 && (
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-surface border border-line text-muted">
                      +{job.qualifications.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Actions & Deep Internal Links */}
              <div className="mt-4 pt-3 border-t border-line flex items-center justify-between gap-2 text-xs">
                {/* Secondary Sub-page links for crawlers & candidates */}
                <div className="flex items-center gap-2 text-[12px] font-medium text-muted">
                  <Link
                    href={`${jobHref}/admit-card`}
                    className="hover:text-navy hover:underline"
                    title={`Admit Card for ${job.shortTitle}`}
                  >
                    Admit Card
                  </Link>
                  <span>•</span>
                  <Link
                    href={`${jobHref}/result`}
                    className="hover:text-green hover:underline"
                    title={`Merit List & Result for ${job.shortTitle}`}
                  >
                    Result
                  </Link>
                </div>

                <Link
                  href={jobHref}
                  className="font-bold text-xs text-navy flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>View job</span>
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
