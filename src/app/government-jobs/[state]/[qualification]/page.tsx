import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { JobCard } from "@/components/jobs/JobCard";
import { ReservedAdSlot } from "@/components/ads/ReservedAdSlot";
import { TricolorCapsule } from "@/components/common/BrandLogo";
import { getStateBySlug, getStateBadgeColor } from "@/config/states";
import { 
  VERIFIED_STATE_QUAL_HUBS, 
  getStateQualHub, 
  getJobsForStateQualHub 
} from "@/data/state-qualification-hubs";
import { 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  ArrowRight, 
  Compass, 
  MapPin,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

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
  if (!hub) return { title: "Category Not Found | IndiaJobNotice.com" };

  const canonicalUrl = `https://www.indiajobnotice.com/government-jobs/${hub.stateSlug}/${hub.qualSlug}`;

  return {
    title: hub.title,
    description: hub.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
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

  const jobs = getJobsForStateQualHub(hub);
  const badgeStyle = getStateBadgeColor(state.code);
  const totalPosts = jobs.reduce((sum, j) => sum + (j.totalVacancies || 0), 0);

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
    <div className="min-h-screen flex flex-col bg-[#FCFAF4]">
      {/* Schema.org JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar currentStateSlug={state.slug} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#68635B]">
          <Link href="/" className="hover:text-[#1E3799] font-medium transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/government-jobs/${state.slug}`} className="hover:text-[#1E3799] font-medium transition-colors">
            {state.name} Jobs
          </Link>
          <span>/</span>
          <span className="text-[#1A1918] font-bold">{hub.qualLabel}</span>
        </nav>

        {/* Editorial Header */}
        <section className="bg-white rounded-xl border border-[#EAE2D2] border-t-4 border-t-[#1E3799] p-6 sm:p-8 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <TricolorCapsule className="w-12 h-1.5" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#1E3799] font-bold">
                  Curated Candidate Hub
                </span>
                <span className="text-[#D8CFBF]">·</span>
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>
                  {state.name} ({state.code})
                </span>
                <span className="text-[11px] font-mono font-bold text-[#1E3799] bg-[#EEF2FA] px-2 py-0.5 rounded border border-[#CCD8F0]">
                  {hub.qualLabel}
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#1A1918] tracking-tight">
                {hub.h1}
              </h1>

              <p className="mt-2 text-sm sm:text-base text-[#524E48] leading-relaxed">
                {hub.subtitle}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2.5 shrink-0 w-full md:w-56">
              <div className="p-3 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#68635B] font-bold block">
                  Active Posts
                </span>
                <span className="text-xl font-serif font-bold text-[#1E3799] block mt-0.5">
                  {totalPosts.toLocaleString("en-IN")}+ Vacancies
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#68635B] font-bold block">
                  Recruiting Boards
                </span>
                <span className="text-xs font-mono font-bold text-[#209948] block mt-0.5">
                  {state.majorExams.slice(0, 2).join(", ")}
                </span>
              </div>
            </div>
          </div>

          {/* Domicile, Language & Eligibility Directive */}
          <div className="mt-6 pt-5 border-t border-[#F2ECE1] bg-[#FCFAF4] p-4 rounded-xl border border-[#EAE2D2]">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#1E3799] shrink-0 mt-0.5" />
              <div>
                <span className="font-serif font-bold text-xs text-[#1A1918] block">
                  {state.name} Statutory Domicile & Eligibility Rules for {hub.qualLabel} Aspirants:
                </span>
                <p className="text-xs text-[#524E48] mt-1 leading-relaxed">
                  {hub.stateDomicileNote}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Reserved Ad Slot (0.00 CLS Protection) */}
        <ReservedAdSlot slotType="leaderboard" slotId={`state-qual-${state.slug}-${hub.qualSlug}`} />

        {/* Verified Listings Section */}
        <section className="space-y-4">
          <div className="flex items-baseline justify-between border-b border-[#EAE2D2] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E3799]" />
              <h2 className="font-serif text-xl font-bold text-[#1A1918]">
                Verified Recruitment Circulars ({jobs.length})
              </h2>
            </div>
            <span className="text-xs text-[#68635B] font-mono">
              Live Openings
            </span>
          </div>

          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  currentStateSlug={job.isCentral ? "central" : job.stateSlug} 
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-lg border border-[#EAE2D2]">
              <p className="text-xs text-[#68635B]">
                New circulars under this category for {state.name} are expected shortly. Check national central drives open to {state.name} candidates.
              </p>
            </div>
          )}
        </section>

        {/* Bidirectional Permanent Pathways */}
        <section className="bg-white rounded-xl border border-[#EAE2D2] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <span className="font-bold text-sm text-[#1A1918] block">
              Looking for other streams or national openings?
            </span>
            <span className="text-[#68635B]">
              Browse all {state.name} departments or explore all-India openings for this qualification.
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/government-jobs/${state.slug}`}
              className="px-3.5 py-2 rounded-lg bg-[#FAF7EF] border border-[#DDD5C7] text-[#1E3799] font-bold hover:bg-[#EEF2FA] transition-colors"
            >
              All {state.name} Gazettes →
            </Link>
            <Link
              href={hub.qualSlug === "engineering" ? "/engineering-jobs" : `/qualification/${hub.qualSlug}`}
              className="px-3.5 py-2 rounded-lg bg-[#1E3799] text-white font-bold hover:bg-[#15286D] transition-colors"
            >
              All-India {hub.qualLabel} Hub →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
