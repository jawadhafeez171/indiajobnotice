import React from "react";
import Link from "next/link";
import { JobNotification } from "@/data/jobs";
import { getJobTaxonomyLinks } from "@/lib/internal-links";
import { ArrowRight } from "lucide-react";

interface Props {
  job: JobNotification;
}

// More jobs by organisation, state, kind of post and qualification: only the groups this job belongs to.
export function JobTaxonomyBar({ job }: Props) {
  const taxonomy = getJobTaxonomyLinks(job);
  const links = [
    taxonomy.organisationHub,
    taxonomy.stateHub && { ...taxonomy.stateHub, label: job.isCentral ? "Central government jobs" : taxonomy.stateHub.label.replace(/ Govt Jobs Hub$/, " government jobs") },
    taxonomy.sectorHub,
    taxonomy.qualificationHubs[0],
  ].filter((l): l is NonNullable<typeof l> => Boolean(l));
  if (!links.length) return null;

  return (
    <nav aria-labelledby="more-jobs" className="print:hidden">
      <h2 id="more-jobs" className="font-serif text-lg font-bold text-ink mb-2">More jobs like this</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 border-t border-line-soft">
        {links.map((l) => (
          <li key={l.href + l.label} className="border-b border-line-soft">
            <Link href={l.href} className="flex items-center justify-between gap-2 min-h-[44px] text-sm font-semibold text-navy hover:text-saffron group">
              <span>{l.label.replace(/ Hub$/, "")}</span>
              <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
