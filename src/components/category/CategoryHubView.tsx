import React from "react";
import Link from "next/link";
import { CategoryHubInfo, getJobsForHub } from "@/data/permanent-categories";
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

export function CategoryHubView({ hub, parentCrumb }: Props) {
  const jobs = getJobsForHub(hub);
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
      <nav className="flex items-center gap-2 text-xs text-[#68635B]">
        <Link href="/" className="hover:text-[#1E3799] font-medium transition-colors">
          Home
        </Link>
        <span>/</span>
        {parentCrumb && (
          <>
            <Link href={parentCrumb.href} className="hover:text-[#1E3799] font-medium transition-colors">
              {parentCrumb.label}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-[#1A1918] font-bold">{hub.badge}</span>
      </nav>

      {/* Editorial Category Header */}
      <section className="bg-white rounded-xl border border-[#EAE2D2] p-6 sm:p-8 shadow-2xs border-t-4 border-t-[#1E3799]">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <TricolorCapsule className="w-12 h-1.5" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1E3799] font-bold">
                Permanent Public Gazette Hub
              </span>
              <span className="text-[#D8CFBF]">·</span>
              <span className="text-[11px] font-mono text-[#E96B15] bg-[#FDF3EB] px-2 py-0.5 rounded font-bold border border-[#F9D9C3]">
                {hub.badge}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#1A1918] tracking-tight">
              {hub.h1}
            </h1>

            <p className="mt-2 text-sm sm:text-base text-[#524E48] leading-relaxed">
              {hub.subtitle}
            </p>

            <p className="mt-3 text-xs sm:text-sm text-[#68635B] leading-relaxed border-t border-[#F2ECE1] pt-3">
              {hub.overview}
            </p>
          </div>

          {/* Key Metrics Quick Box */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-2.5 shrink-0 w-full md:w-56">
            <div className="p-3 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#68635B] font-bold block">
                Total Posts
              </span>
              <span className="text-xl font-serif font-bold text-[#1E3799] block mt-0.5">
                {totalPosts.toLocaleString("en-IN")}+
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#68635B] font-bold block">
                Active Drives
              </span>
              <span className="text-xl font-serif font-bold text-[#209948] block mt-0.5">
                {activeDrives.length} Open Now
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Statutory Eligibility & Procedural Guidance */}
      <section className="bg-white rounded-xl border border-[#EAE2D2] p-6 shadow-2xs">
        <div className="flex items-center gap-2 mb-4 border-b border-[#F2ECE1] pb-3">
          <ShieldCheck className="w-5 h-5 text-[#1E3799]" />
          <div>
            <h2 className="font-serif text-lg font-bold text-[#1A1918]">
              Statutory Eligibility, Age Limits & Application Checklist
            </h2>
            <p className="text-xs text-[#68635B]">
              Standard recruitment rules, category concessions, and verification requirements
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#3E3C38]">
          {/* Col 1: Criteria */}
          <div className="space-y-4">
            <div className="p-3.5 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
              <span className="font-bold text-[#1E3799] block mb-1 uppercase font-mono text-[10px]">
                Educational Standard
              </span>
              <p className="text-xs text-[#1A1918] leading-relaxed">
                {hub.eligibilityGuidance.minimumQualification}
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
              <span className="font-bold text-[#1E3799] block mb-1 uppercase font-mono text-[10px]">
                Age Limits & Statutory Relaxations
              </span>
              <p className="text-xs text-[#1A1918] font-medium">
                Standard Age: {hub.eligibilityGuidance.typicalAgeLimit}
              </p>
              <p className="text-xs text-[#209948] font-semibold mt-1">
                Relaxations: {hub.eligibilityGuidance.ageRelaxations}
              </p>
            </div>

            <div>
              <span className="font-bold text-[#1A1918] block mb-2 font-mono text-[11px] uppercase">
                Selection Process Stages
              </span>
              <ul className="space-y-1.5">
                {hub.eligibilityGuidance.selectionRounds.map((round, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#EEF2FA] text-[#1E3799] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
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
              <span className="font-bold text-[#1A1918] block mb-2 font-mono text-[11px] uppercase">
                Mandatory Documentation Checklist
              </span>
              <ul className="space-y-1.5">
                {hub.eligibilityGuidance.keyDocumentsRequired.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <FileCheck className="w-3.5 h-3.5 text-[#209948] shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-lg bg-[#FDF3EB] border border-[#F9D9C3]">
              <span className="font-bold text-[#E96B15] block mb-1 uppercase font-mono text-[10px]">
                Gazette Aspirant Advice
              </span>
              <ul className="space-y-1">
                {hub.eligibilityGuidance.expertTips.map((tip, idx) => (
                  <li key={idx} className="text-[#524E48] leading-relaxed">
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
        <div className="flex items-baseline justify-between border-b border-[#EAE2D2] pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E3799]" />
            <h2 className="font-serif text-xl font-bold text-[#1A1918]">
              Verified Recruitment Circulars ({jobs.length})
            </h2>
          </div>
          <span className="text-xs text-[#68635B] font-mono">
            Sorted by Gazette Priority
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
            <p className="text-sm text-[#68635B]">
              No active circulars are currently open under this category. Check upcoming notices on the{" "}
              <Link href="/calendar" className="text-[#1E3799] font-bold hover:underline">
                Exam Calendar
              </Link>.
            </p>
          </div>
        )}
      </section>

      {/* Quick Action Navigation Links */}
      <section className="bg-white rounded-xl border border-[#EAE2D2] p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calculator className="w-5 h-5 text-[#E96B15]" />
          <div>
            <span className="font-bold text-sm text-[#1A1918] block">
              Not sure if you qualify for these exams?
            </span>
            <span className="text-xs text-[#68635B]">
              Calculate statutory age relaxations (OBC +3y, SC/ST +5y) using our official tool.
            </span>
          </div>
        </div>

        <Link
          href="/calculator"
          className="px-4 py-2 rounded bg-[#E96B15] hover:bg-[#D4590A] text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
        >
          <span>Open Age Calculator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </div>
  );
}
