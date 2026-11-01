import React from "react";
import Link from "next/link";
import { JobNotification } from "@/data/jobs";
import { getJobTaxonomyLinks, TaxonomyLink } from "@/lib/internal-links";
import { 
  Building2, 
  GraduationCap, 
  MapPin, 
  Briefcase, 
  Compass, 
  ArrowRight,
  ExternalLink
} from "lucide-react";

interface Props {
  job: JobNotification;
}

export function JobTaxonomyBar({ job }: Props) {
  const taxonomy = getJobTaxonomyLinks(job);

  return (
    <div className="bg-subtle rounded-xl border border-line p-4 sm:p-5 shadow-2xs print:hidden space-y-3">
      <div className="flex items-center justify-between border-b border-line pb-2.5">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-navy" />
          <span className="font-serif font-bold text-sm text-ink">
            More jobs like this
          </span>
        </div>
        <span className="text-[11px] font-mono text-muted uppercase font-bold hidden sm:inline">
          Browse
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
        {/* 1. Recruiting Organisation Hub */}
        {taxonomy.organisationHub && (
          <Link
            href={taxonomy.organisationHub.href}
            className="p-3 rounded-lg bg-surface border border-line hover:border-navy hover:shadow-2xs transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted font-bold uppercase mb-1">
                <Building2 className="w-3.5 h-3.5 text-navy" />
                <span>Organisation Hub</span>
              </div>
              <span className="font-serif font-bold text-xs text-ink group-hover:text-navy transition-colors block">
                {taxonomy.organisationHub.label}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-navy mt-2 flex items-center gap-1">
              <span>See all jobs</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        )}

        {/* 2. State Jobs Hub */}
        {taxonomy.stateHub && (
          <Link
            href={taxonomy.stateHub.href}
            className="p-3 rounded-lg bg-surface border border-line hover:border-saffron-bright hover:shadow-2xs transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted font-bold uppercase mb-1">
                <MapPin className="w-3.5 h-3.5 text-saffron" />
                <span>State Administration</span>
              </div>
              <span className="font-serif font-bold text-xs text-ink group-hover:text-saffron transition-colors block">
                {taxonomy.stateHub.label}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-saffron mt-2 flex items-center gap-1">
              <span>State Directory</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        )}

        {/* 3. Sector / Domain Hub */}
        {taxonomy.sectorHub && (
          <Link
            href={taxonomy.sectorHub.href}
            className="p-3 rounded-lg bg-surface border border-line hover:border-green hover:shadow-2xs transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted font-bold uppercase mb-1">
                <Briefcase className="w-3.5 h-3.5 text-green" />
                <span>Sector & Domain Hub</span>
              </div>
              <span className="font-serif font-bold text-xs text-ink group-hover:text-green transition-colors block">
                {taxonomy.sectorHub.label}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-green mt-2 flex items-center gap-1">
              <span>Explore Domain</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        )}

        {/* 4. Qualification Hub */}
        {taxonomy.qualificationHubs.length > 0 && (
          <Link
            href={taxonomy.qualificationHubs[0].href}
            className="p-3 rounded-lg bg-surface border border-line hover:border-navy hover:shadow-2xs transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted font-bold uppercase mb-1">
                <GraduationCap className="w-3.5 h-3.5 text-navy" />
                <span>Qualification Hub</span>
              </div>
              <span className="font-serif font-bold text-xs text-ink group-hover:text-navy transition-colors block">
                {taxonomy.qualificationHubs[0].label}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-navy mt-2 flex items-center gap-1">
              <span>View Eligibility Criteria</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
