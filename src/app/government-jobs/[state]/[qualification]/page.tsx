import { isOpenOrOpening } from "@/data/jobs";
import { safeJson } from "@/lib/json-ld";
import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { MajorRecruitmentsSection } from "@/components/jobs/MajorRecruitmentsSection";
import { ReservedAdSlot } from "@/components/ads/ReservedAdSlot";
import { getStateBySlug } from "@/config/states";
import {
  VERIFIED_STATE_QUAL_HUBS,
  getStateQualHub,
  getJobsForStateQualHub
} from "@/data/state-qualification-hubs";
import { getAllJobs } from "@/lib/jobs-store";
import { SITE_OG_IMAGES } from "@/lib/site-image";
import { forList } from "@/lib/list-jobs";

interface Props {
  params: Promise<{ state: string; qualification: string }>;
}

export async function generateStaticParams() {
  return VERIFIED_STATE_QUAL_HUBS.map((hub) => ({
    state: hub.stateSlug,
    qualification: hub.qualSlug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, qualification: qualSlug } = await params;
  const hub = getStateQualHub(stateSlug, qualSlug);
  if (!hub) return { title: "Category Not Found" };

  const canonicalUrl = `https://www.indiajobnotice.com/government-jobs/${hub.stateSlug}/${hub.qualSlug}`;

  return {
    title: hub.title,
    description: hub.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      images: SITE_OG_IMAGES,
      title: hub.title,
      description: hub.metaDescription,
      url: canonicalUrl,
      siteName: "India Job Notice",
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: hub.title,
      description: hub.metaDescription,
    },
  };
}

export default async function StateQualificationPage({ params }: Props) {
  const { state: stateSlug, qualification: qualSlug } = await params;
  const hub = getStateQualHub(stateSlug, qualSlug);
  const state = getStateBySlug(stateSlug);

  if (!hub || !state) {
    notFound();
  }

  const jobs = getJobsForStateQualHub(await getAllJobs(), hub);
  const open = jobs.filter(isOpenOrOpening);
  const openPosts = open.reduce((n, j) => n + (j.totalVacancies || 0), 0);
  const underWay = jobs.filter((j) => j.inProgress).length;

  // Schema.org CollectionPage + BreadcrumbList JSON-LD
  const canonicalUrl = `https://www.indiajobnotice.com/government-jobs/${hub.stateSlug}/${hub.qualSlug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: hub.h1,
        description: hub.metaDescription,
        url: canonicalUrl,
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
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.indiajobnotice.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: `${state.name} Jobs`,
            item: `https://www.indiajobnotice.com/government-jobs/${state.slug}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `${state.name} ${hub.qualLabel}`,
            item: canonicalUrl,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      {/* Schema.org JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJson(jsonLd) }}
      />

      <Navbar currentStateSlug={state.slug} />

      <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-7 flex-1 w-full space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted">
          <Link href="/" className="hover:text-navy font-medium transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/government-jobs/${state.slug}`} className="hover:text-navy font-medium transition-colors">
            {state.name} Jobs
          </Link>
          <span>/</span>
          <span className="text-ink font-bold">{hub.qualLabel}</span>
        </nav>

        <header className="max-w-3xl">
          <h1 className="font-serif text-[24px] sm:text-4xl font-bold text-ink tracking-tight leading-tight text-balance">
            {hub.h1}
          </h1>
          <p className="mt-2 text-sm text-ink-2">
            <b className="text-ink">{open.length} open now</b>
            {openPosts > 0 && <> ({openPosts.toLocaleString("en-IN")} posts)</>}
            {underWay > 0 && <> · {underWay} more with exams or results to come</>}
            , {state.name} and central jobs, each read from its official notice.
          </p>
          <p className="mt-3 text-sm text-muted leading-relaxed max-w-[68ch]">{hub.subtitle}</p>
        </header>

        <MajorRecruitmentsSection jobs={jobs.map(forList)} hideSearch showLayoutSwitch={false} />

        <ReservedAdSlot slotType="leaderboard" slotId={`state-qual-${state.slug}-${hub.qualSlug}`} />

        <section aria-labelledby="domicile" className="border-t border-line pt-6 max-w-3xl">
          <h2 id="domicile" className="font-serif text-xl font-bold text-ink">
            {state.name} rules for {hub.qualLabel} candidates
          </h2>
          <p className="mt-2 text-sm text-ink-2 leading-relaxed">{hub.stateDomicileNote}</p>
          <p className="mt-1 text-[13px] text-muted">The usual rules; each notification sets its own, so check it before you apply.</p>
          <div className="mt-4 flex flex-wrap gap-x-6">
            <Link href={`/government-jobs/${state.slug}`} className="inline-flex items-center min-h-[44px] text-sm font-semibold text-navy hover:underline">
              All {state.name} jobs
            </Link>
            <Link
              href={hub.qualSlug === "engineering" ? "/engineering-jobs" : `/qualification/${hub.qualSlug}`}
              className="inline-flex items-center min-h-[44px] text-sm font-semibold text-navy hover:underline"
            >
              {hub.qualLabel} jobs across India
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
