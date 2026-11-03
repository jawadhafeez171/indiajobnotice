import React from "react";
import Link from "next/link";
import { CategoryHubInfo, getJobsForHub } from "@/data/permanent-categories";
import { getAllJobs } from "@/lib/jobs-store";
import { MajorRecruitmentsSection } from "@/components/jobs/MajorRecruitmentsSection";
import { ReservedAdSlot } from "@/components/ads/ReservedAdSlot";
import { ArrowRight } from "lucide-react";

interface Props {
  hub: CategoryHubInfo;
  parentCrumb?: { label: string; href: string };
}

// bodies the agent cannot read automatically (same note as the home page search)
const KNOWN_GAPS: Record<string, { text: string; href: string; site: string }> = {
  upsc: {
    text: "UPSC's website blocks automated readers, so its notices are checked by hand and may appear late.",
    href: "https://upsc.gov.in",
    site: "upsc.gov.in",
  },
};

/**
 * A sector, recruiting body or qualification page: heading and live counts, then the same job list
 * as the home page (stage tabs, closing-date groups). No general advice: each notice sets its own
 * rules, and its job page shows them as the notice gives them.
 */
export async function CategoryHubView({ hub, parentCrumb }: Props) {
  const jobs = getJobsForHub(await getAllJobs(), hub);
  const open = jobs.filter((j) => j.status === "APPLY_OPEN" || j.status === "LAST_DATE_NEAR");
  const openPosts = open.reduce((n, j) => n + (j.totalVacancies || 0), 0);
  const underWay = jobs.filter((j) => j.inProgress).length;
  const gap = KNOWN_GAPS[hub.slug];

  // Schema.org CollectionPage + BreadcrumbList JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: hub.h1,
    description: hub.metaDescription,
    url: `https://www.indiajobnotice.com${hub.canonicalPath}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: jobs.map((job, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: job.isCentral
          ? `https://www.indiajobnotice.com/jobs/${job.slug}`
          : `https://www.indiajobnotice.com/state/${job.stateSlug}/jobs/${job.slug}`,
        name: job.title,
      })),
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-7 space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted">
        <Link href="/" className="hover:text-navy font-medium">Home</Link>
        <span aria-hidden>/</span>
        {parentCrumb && (
          <>
            <Link href={parentCrumb.href} className="hover:text-navy font-medium">{parentCrumb.label}</Link>
            <span aria-hidden>/</span>
          </>
        )}
        <span className="text-ink font-bold">{hub.badge}</span>
      </nav>

      <header className="max-w-3xl">
        <h1 className="font-serif text-[24px] sm:text-4xl font-bold text-ink tracking-tight leading-tight text-balance">
          {hub.h1}
        </h1>
        <p className="mt-2 text-sm text-ink-2">
          <b className="text-ink">{open.length} open now</b>
          {openPosts > 0 && <> ({openPosts.toLocaleString("en-IN")} posts)</>}
          {underWay > 0 && <> · {underWay} more with exams or results to come</>}
          , each read from its official notice.{" "}
          <Link href="/editorial-policy" className="font-semibold text-navy underline underline-offset-2">
            How we verify
          </Link>
        </p>
        <p className="mt-3 text-sm text-muted leading-relaxed max-w-[68ch]">{hub.overview}</p>
        {gap && (
          <p className="mt-3 text-[13px] text-ink-2 px-3 py-2 rounded-lg bg-saffron-tint">
            {gap.text}{" "}
            <a href={gap.href} target="_blank" rel="noreferrer" className="font-semibold text-navy underline underline-offset-2">
              See {gap.site}
            </a>
          </p>
        )}
      </header>

      <MajorRecruitmentsSection jobs={jobs} hideSearch showLayoutSwitch={false} />

      <ReservedAdSlot slotType="leaderboard" slotId={`category-${hub.slug}-top`} />

      {/* no general rules here: each notice sets its own, shown on its job page */}
      <section aria-labelledby="hub-rules" className="border-t border-line pt-6">
        <h2 id="hub-rules" className="font-serif text-xl font-bold text-ink">Age limits, qualification and fee</h2>
        <p className="mt-1 text-sm text-ink-2 max-w-[68ch]">
          Each notification sets its own, often different for each category and post. Open a job to see
          them as its notification gives them, with the link to the notification itself.
        </p>
        <Link
          href="/calculator"
          className="mt-3 inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-navy hover:underline"
        >
          Check which open jobs fit your age <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      </section>
    </div>
  );
}
