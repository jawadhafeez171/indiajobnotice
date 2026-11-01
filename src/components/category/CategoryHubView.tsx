import React from "react";
import Link from "next/link";
import { CategoryHubInfo, getJobsForHub } from "@/data/permanent-categories";
import { getAllJobs } from "@/lib/jobs-store";
import { JobCard } from "@/components/jobs/JobCard";
import { ReservedAdSlot } from "@/components/ads/ReservedAdSlot";
import { TricolorCapsule } from "@/components/common/BrandLogo";
import { 
  GraduationCap, 
  Calendar, 
  Calculator, 
  FileCheck, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  Briefcase,
  Sparkles,
  BookOpen
} from "lucide-react";

interface Props {
  hub: CategoryHubInfo;
  parentCrumb?: { label: string; href: string };
}

export async function CategoryHubView({ hub, parentCrumb }: Props) {
  const jobs = getJobsForHub(await getAllJobs(), hub);
  const totalPosts = jobs.reduce((acc, j) => acc + (j.totalVacancies || 0), 0);
  const activeDrives = jobs.filter((j) => j.status === "APPLY_OPEN" || j.status === "LAST_DATE_NEAR");

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Schema.org CollectionPage Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-muted">
        <Link href="/" className="hover:text-navy font-medium transition-colors">
          Home
        </Link>
        <span>/</span>
        {parentCrumb && (
          <>
            <Link href={parentCrumb.href} className="hover:text-navy font-medium transition-colors">
              {parentCrumb.label}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-ink font-bold">{hub.badge}</span>
      </nav>

      {/* Editorial Category Header */}
      <section className="bg-surface rounded-xl border border-line p-6 sm:p-8 shadow-2xs border-t-4 border-t-navy">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <TricolorCapsule className="w-12 h-1.5" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-navy font-bold">
                All jobs in this category
              </span>
              <span className="text-faint">·</span>
              <span className="text-[12px] font-mono text-saffron bg-saffron-tint px-2 py-0.5 rounded font-bold border border-saffron-line">
                {hub.badge}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-ink tracking-tight">
              {hub.h1}
            </h1>

            <p className="mt-2 text-sm sm:text-base text-ink-2 leading-relaxed">
              {hub.subtitle}
            </p>

            <p className="mt-3 text-xs sm:text-sm text-muted leading-relaxed border-t border-line-soft pt-3">
              {hub.overview}
            </p>
          </div>

          {/* Key Metrics Quick Box */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-2.5 shrink-0 w-full md:w-56">
            <div className="p-3 rounded-lg bg-subtle border border-line">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted font-bold block">
                Total Posts
              </span>
              <span className="text-xl font-serif font-bold text-navy block mt-0.5">
                {totalPosts.toLocaleString("en-IN")}+
              </span>
            </div>

            <div className="p-3 rounded-lg bg-subtle border border-line">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted font-bold block">
                Active Drives
              </span>
              <span className="text-xl font-serif font-bold text-green block mt-0.5">
                {activeDrives.length} Open Now
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Statutory Eligibility & Procedural Guidance */}
      <section className="bg-surface rounded-xl border border-line p-6 shadow-2xs">
        <div className="flex items-center gap-2 mb-4 border-b border-line-soft pb-3">
          <ShieldCheck className="w-5 h-5 text-navy" />
          <div>
            <h2 className="font-serif text-lg font-bold text-ink">
              Eligibility, age limits and how to apply
            </h2>
            <p className="text-xs text-muted">
              Standard recruitment rules, category concessions, and verification requirements
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-ink-2">
          {/* Col 1: Criteria */}
          <div className="space-y-4">
            <div className="p-3.5 rounded-lg bg-subtle border border-line">
              <span className="font-bold text-navy block mb-1 uppercase font-mono text-[11px]">
                Educational Standard
              </span>
              <p className="text-xs text-ink leading-relaxed">
                {hub.eligibilityGuidance.minimumQualification}
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-subtle border border-line">
              <span className="font-bold text-navy block mb-1 uppercase font-mono text-[11px]">
                Age limits and relaxations
              </span>
              <p className="text-xs text-ink font-medium">
                Standard Age: {hub.eligibilityGuidance.typicalAgeLimit}
              </p>
              <p className="text-xs text-green font-semibold mt-1">
                Relaxations: {hub.eligibilityGuidance.ageRelaxations}
              </p>
            </div>

            <div>
              <span className="font-bold text-ink block mb-2 font-mono text-[12px] uppercase">
                Selection Process Stages
              </span>
              <ul className="space-y-1.5">
                {hub.eligibilityGuidance.selectionRounds.map((round, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-navy-tint text-navy font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{round}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col 2: Documents & Tips */}
          <div className="space-y-4">
            <div>
              <span className="font-bold text-ink block mb-2 font-mono text-[12px] uppercase">
                Mandatory Documentation Checklist
              </span>
              <ul className="space-y-1.5">
                {hub.eligibilityGuidance.keyDocumentsRequired.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <FileCheck className="w-3.5 h-3.5 text-green shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-lg bg-saffron-tint border border-saffron-line">
              <span className="font-bold text-saffron block mb-1 uppercase font-mono text-[11px]">
                Tips for candidates
              </span>
              <ul className="space-y-1">
                {hub.eligibilityGuidance.expertTips.map((tip, idx) => (
                  <li key={idx} className="text-ink-2 leading-relaxed">
                    • {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Reserved Ad Slot (0.00 CLS Protection) */}
      <ReservedAdSlot slotType="leaderboard" slotId={`category-${hub.slug}-top`} />

      {/* Verified Open Recruitments List */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between border-b border-line pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-navy-solid" />
            <h2 className="font-serif text-xl font-bold text-ink">
              Recruitments ({jobs.length})
            </h2>
          </div>
          <span className="text-xs text-muted font-mono">
            Latest first
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
          <div className="p-8 text-center bg-surface rounded-lg border border-line">
            <p className="text-sm text-muted">
              No active circulars are currently open under this category. Check upcoming notices on the{" "}
              <Link href="/calendar" className="text-navy font-bold hover:underline">
                Exam Calendar
              </Link>.
            </p>
          </div>
        )}
      </section>

      {/* Quick Action Navigation Links */}
      <section className="bg-surface rounded-xl border border-line p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calculator className="w-5 h-5 text-saffron" />
          <div>
            <span className="font-bold text-sm text-ink block">
              Not sure if you qualify for these exams?
            </span>
            <span className="text-xs text-muted">
              Calculate statutory age relaxations (OBC +3y, SC/ST +5y) using our official tool.
            </span>
          </div>
        </div>

        <Link
          href="/calculator"
          className="px-4 py-2 rounded bg-saffron-solid hover:bg-saffron-strong text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
        >
          <span>Open Age Calculator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </div>
  );
}
