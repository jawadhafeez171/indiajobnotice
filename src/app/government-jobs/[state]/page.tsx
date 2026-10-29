import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { JobCard } from "@/components/jobs/JobCard";
import { ReservedAdSlot } from "@/components/ads/ReservedAdSlot";
import { TricolorCapsule } from "@/components/common/BrandLogo";
import { STATES_REGISTRY, getStateBySlug, getStateBadgeColor } from "@/config/states";
import { getJobsByState, getListingJobs } from "@/data/jobs";
import { getAllJobs } from "@/lib/jobs-store";

import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  FileCheck, 
  ArrowRight, 
  Calculator,
  Compass,
  CheckCircle2 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ state: string }>;
}

export async function generateStaticParams() {
  return STATES_REGISTRY.map((s) => ({
    state: s.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const state = getStateBySlug(stateSlug);
  if (!state) return { title: "State Government Jobs Not Found | IndiaJobNotice.com" };

  const canonicalUrl = `https://www.indiajobnotice.com/government-jobs/${state.slug}`;

  return {
    title: `Government Jobs in ${state.name} 2026 - Latest Notifications & Vacancies | IndiaJobNotice.com`,
    description: `Explore all Government Jobs in ${state.name} (${state.nativeName}) for 2026. Official public service commission notifications (${state.majorExams.join(", ")}), eligibility rules, age limit, and direct application links.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Government Jobs in ${state.name} 2026 - Notifications & Syllabus`,
      description: `Official employment gazette circulars for ${state.name}. Domicile rules, capital: ${state.capital}, and commission updates.`,
      url: canonicalUrl,
      siteName: "India Job Notice",
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Government Jobs in ${state.name} 2026 | IndiaJobNotice.com`,
      description: `Official notifications for ${state.name} (${state.majorExams.join(", ")}).`,
    },
  };
}

export default async function StateGovernmentJobsPage({ params }: Props) {
  const { state: stateSlug } = await params;
  const state = getStateBySlug(stateSlug);

  if (!state) {
    notFound();
  }

  // Get state specific circulars + national central drives valid in this state
  const jobs = getListingJobs(await getAllJobs());
  const stateJobs = getJobsByState(jobs, state.slug, false);
  const centralJobs = jobs.filter((j) => j.isCentral);
  const allAvailableJobs = [...stateJobs, ...centralJobs];
  const badgeStyle = getStateBadgeColor(state.code);

  const totalVacancies = allAvailableJobs.reduce((acc, j) => acc + (j.totalVacancies || 0), 0);

  // Schema.org CollectionPage
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Government Jobs in ${state.name} 2026`,
    description: `Official public employment circulars and gazettes in ${state.name}.`,
    url: `https://www.indiajobnotice.com/government-jobs/${state.slug}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: allAvailableJobs.map((job, idx) => ({
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
    <div className="min-h-screen flex flex-col bg-[#FCFAF4]">
      {/* Schema.org CollectionPage Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar currentStateSlug={state.slug} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#68635B]">
          <Link href="/" className="hover:text-[#1E3799] font-medium transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/#all-states" className="hover:text-[#1E3799] font-medium transition-colors">
            State Gazettes
          </Link>
          <span>/</span>
          <span className="text-[#1A1918] font-bold">{state.name}</span>
        </nav>

        {/* Editorial State Govt Jobs Banner */}
        <section className="bg-white rounded-xl border border-[#EAE2D2] p-6 sm:p-8 shadow-2xs border-t-4 border-t-[#1E3799]">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
                <TricolorCapsule className="w-12 h-1.5" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#1E3799] font-bold">
                  Permanent State Gazette Hub
                </span>
                <span className="text-[#D8CFBF]">·</span>
                <span className={cn("text-xs font-mono px-2 py-0.5 rounded font-bold border", badgeStyle.bg, badgeStyle.text, badgeStyle.border)}>
                  {state.code}
                </span>
                <span className="text-xs font-serif italic text-[#68635B]">
                  {state.nativeName}
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#1A1918] tracking-tight">
                Government Jobs in {state.name} 2026
              </h1>

              <p className="mt-1.5 text-xs sm:text-sm font-semibold text-[#1E3799]">
                {state.greeting}
              </p>

              <p className="mt-2 text-sm text-[#524E48] leading-relaxed">
                Direct access to official employment notifications issued by state public service commissions, police recruitment boards, high courts, and administrative departments in {state.name}.
              </p>

              <div className="mt-4 pt-3 border-t border-[#F2ECE1] flex items-center gap-2 text-xs text-[#68635B] flex-wrap">
                <span className="font-medium text-[#1A1918]">Major Recruiting Commissions:</span>
                {state.majorExams.map((exam, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-[#EEF2FA] text-[#1E3799] font-mono font-bold text-[11px] border border-[#CCD8F0]">
                    {exam}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2.5 shrink-0 w-full md:w-56">
              <div className="p-3 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#68635B] font-bold block">
                  State Capital
                </span>
                <span className="text-base font-serif font-bold text-[#1A1918] block mt-0.5">
                  {state.capital}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#68635B] font-bold block">
                  Active Vacancies
                </span>
                <span className="text-xl font-serif font-bold text-[#1E3799] block mt-0.5">
                  {totalVacancies.toLocaleString("en-IN")}+ Posts
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* State Specific Statutory Eligibility Guidance */}
        <section className="bg-white rounded-xl border border-[#EAE2D2] p-6 shadow-2xs">
          <div className="flex items-center gap-2 mb-4 border-b border-[#F2ECE1] pb-3">
            <ShieldCheck className="w-5 h-5 text-[#1E3799]" />
            <div>
              <h2 className="font-serif text-lg font-bold text-[#1A1918]">
                {state.name} Domicile, Language & Age Criteria
              </h2>
              <p className="text-xs text-[#68635B]">
                Key statutory conditions for applying to state departments vs all-India quotas
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#3E3C38]">
            <div className="p-4 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
              <span className="font-bold text-[#1E3799] block mb-1 uppercase font-mono text-[10px]">
                1. Domicile & Reservation Rules
              </span>
              <p className="leading-relaxed text-[#524E48]">
                Reserved category benefits (SC, ST, OBC, EWS) apply strictly to bona fide permanent residents of {state.name}. Candidates from other states may apply under the Open / General (Unreserved) merit quota.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
              <span className="font-bold text-[#1E3799] block mb-1 uppercase font-mono text-[10px]">
                2. Regional Language Paper
              </span>
              <p className="leading-relaxed text-[#524E48]">
                Most Group B and C positions in {state.name} require proof of having studied the official regional language up to 10th standard matriculation or qualifying a mandatory state language screening test.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
              <span className="font-bold text-[#1E3799] block mb-1 uppercase font-mono text-[10px]">
                3. Employment Exchange Registration
              </span>
              <p className="leading-relaxed text-[#524E48]">
                Select technical and clerical drives require an active registration number on the official {state.name} State Employment Exchange portal prior to the application deadline.
              </p>
            </div>
          </div>
        </section>

        {/* Reserved Ad Slot (0.00 CLS Protection) */}
        <ReservedAdSlot slotType="leaderboard" slotId={`gov-jobs-${state.slug}-top`} />

        {/* State Circulars */}
        <section className="space-y-4">
          <div className="flex items-baseline justify-between border-b border-[#EAE2D2] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E96B15]" />
              <h2 className="font-serif text-xl font-bold text-[#1A1918]">
                {state.name} State Gazette Circulars ({stateJobs.length})
              </h2>
            </div>
            <Link 
              href={`/state/${state.slug}`}
              className="text-xs font-bold text-[#1E3799] hover:underline"
            >
              Open Dedicated /state/{state.slug} Hub →
            </Link>
          </div>

          {stateJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stateJobs.map((job) => (
                <JobCard key={job.id} job={job} currentStateSlug={state.slug} />
              ))}
            </div>
          ) : (
            <div className="p-6 text-center bg-white rounded-lg border border-[#EAE2D2]">
              <p className="text-xs text-[#68635B]">
                New state commission notifications for {state.name} will be gazetted shortly. Check national central drives below currently accepting applications from {state.name}.
              </p>
            </div>
          )}
        </section>

        {/* Deliberate Domain & Qualification Pathways for Candidates in this State */}
        <section className="bg-white rounded-xl border border-[#EAE2D2] p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#1E3799]" />
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1A1918]">
                  Browse {state.name} Opportunities by Stream & Cadre
                </h3>
                <p className="text-xs text-[#68635B]">
                  Direct routes to departmental cadres and educational eligibility hubs
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <Link
              href="/engineering-jobs"
              className="p-3.5 rounded-lg border border-[#EAE2D2] bg-[#FCFAF4] hover:border-[#1E3799] hover:bg-white transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-[#209948] block mb-1">
                  Technical & Engineering
                </span>
                <span className="font-serif font-bold text-[#1A1918] group-hover:text-[#1E3799] transition-colors block">
                  {state.name} Engineering Jobs
                </span>
                <p className="text-[11px] text-[#68635B] mt-1">
                  AE & JE recruitments across PWD, WRD, and Electricity Boards
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#1E3799] mt-3 flex items-center gap-1">
                <span>View Engineering Gazettes</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>

            <Link
              href="/police-defense-jobs"
              className="p-3.5 rounded-lg border border-[#EAE2D2] bg-[#FCFAF4] hover:border-[#1E3799] hover:bg-white transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-[#E96B15] block mb-1">
                  Uniformed Services
                </span>
                <span className="font-serif font-bold text-[#1A1918] group-hover:text-[#1E3799] transition-colors block">
                  {state.name} Police & Defense
                </span>
                <p className="text-[11px] text-[#68635B] mt-1">
                  Police Sub-Inspector, Constable, and Forest Guard circulars
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#1E3799] mt-3 flex items-center gap-1">
                <span>View Police Gazettes</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>

            <Link
              href="/qualification/graduate"
              className="p-3.5 rounded-lg border border-[#EAE2D2] bg-[#FCFAF4] hover:border-[#1E3799] hover:bg-white transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-[#1E3799] block mb-1">
                  Degree Cadre
                </span>
                <span className="font-serif font-bold text-[#1A1918] group-hover:text-[#1E3799] transition-colors block">
                  Graduate Officer Posts
                </span>
                <p className="text-[11px] text-[#68635B] mt-1">
                  Group A & B administrative civil services and officer appointments
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#1E3799] mt-3 flex items-center gap-1">
                <span>View Graduate Hub</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>

            <Link
              href="/qualification/12th-pass"
              className="p-3.5 rounded-lg border border-[#EAE2D2] bg-[#FCFAF4] hover:border-[#1E3799] hover:bg-white transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-[#68635B] block mb-1">
                  Intermediate
                </span>
                <span className="font-serif font-bold text-[#1A1918] group-hover:text-[#1E3799] transition-colors block">
                  12th Pass Vacancies
                </span>
                <p className="text-[11px] text-[#68635B] mt-1">
                  Clerical assistants, data entry operators, and junior staff posts
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#1E3799] mt-3 flex items-center gap-1">
                <span>View 12th Pass Hub</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          </div>
        </section>

        {/* Central Govt Jobs Open in this State */}
        <section className="space-y-4">
          <div className="flex items-baseline justify-between border-b border-[#EAE2D2] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E3799]" />
              <h2 className="font-serif text-xl font-bold text-[#1A1918]">
                Central Government Jobs Open to {state.name} Candidates
              </h2>
            </div>
            <span className="text-xs font-mono text-[#68635B]">
              National Eligibility
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {centralJobs.slice(0, 6).map((job) => (
              <JobCard key={job.id} job={job} currentStateSlug="central" />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
