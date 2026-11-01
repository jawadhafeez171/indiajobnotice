import React from "react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { JobCard } from "@/components/jobs/JobCard";
import { SocialAlertBar } from "@/components/common/SocialAlertBar";
import { EligibilityCalculator } from "@/components/eligibility/EligibilityCalculator";
import { MajorRecruitmentsSection } from "@/components/jobs/MajorRecruitmentsSection";
import { ReservedAdSlot } from "@/components/ads/ReservedAdSlot";
import { TricolorCapsule } from "@/components/common/BrandLogo";
import { DistrictSelectorBar } from "@/components/common/DistrictSelectorBar";
import { getStateBySlug, STATES_REGISTRY, getStateBadgeColor } from "@/config/states";
import { getJobsByState, getListingJobs, getCalculatorJobs, getExamsInProgress } from "@/data/jobs";
import { ExamsInProgressSection } from "@/components/jobs/ExamsInProgressSection";
import { ExamCalendarSections } from "@/components/jobs/ExamCalendarSections";
import { getAllJobs } from "@/lib/jobs-store";

import { getCentralPortalUrl } from "@/lib/subdomains";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ state: string }>;
}

export async function generateStaticParams() {
  return STATES_REGISTRY.map((s) => ({
    state: s.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { state: stateSlug } = await params;
  const state = getStateBySlug(stateSlug);
  if (!state) return { title: "State Not Found" };

  const canonicalUrl = `https://www.indiajobnotice.com/state/${state.slug}`;

  return {
    title: `${state.name} Govt Jobs 2026: Notifications, Admit Cards & Results`,
    description: `Official public employment gazettes and notifications for ${state.name} (${state.nativeName}). Official commission updates: ${state.majorExams.join(", ")}. Capital: ${state.capital}.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${state.name} Government Jobs - IndiaJobNotice`,
      description: `Official job alerts, exam schedules, and circulars for ${state.name}.`,
      url: canonicalUrl,
      siteName: "India Job Notice",
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${state.name} Govt Job Notifications`,
      description: `Official gazette notices for ${state.name}. Commissions: ${state.majorExams.join(", ")}.`,
    },
  };
}

export default async function StateHomePage({ params }: PageProps) {
  const { state: stateSlug } = await params;
  const state = getStateBySlug(stateSlug);

  if (!state) {
    notFound();
  }

  const allJobs = await getAllJobs();
  const jobs = getJobsByState(getListingJobs(allJobs), state.slug);
  const badgeStyle = getStateBadgeColor(state.code);

  return (
    <div className="min-h-screen flex flex-col bg-[#F1ECE1]">
      <Navbar currentStateSlug={state.slug} />

      {/* Editorial State Header with Regional Tint Accent */}
      <section className="border-b border-[#D5CAB5] bg-[#FCFAF4] py-5 sm:py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb with Tricolor Accent */}
          <div className="flex items-center gap-2 text-xs text-[#4F4A43] mb-3">
            <a href={getCentralPortalUrl()} className="hover:text-[#1E3799] font-medium transition-colors">
              All-India jobs
            </a>
            <span>/</span>
            <span className="text-[#1A1918] font-bold">{state.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1918] tracking-tight">
                  {state.name}
                </h1>
                <span className="text-sm font-serif italic text-[#4F4A43]">
                  {state.nativeName}
                </span>
                <span
                  className={cn(
                    "text-xs font-mono px-2 py-0.5 rounded font-bold border",
                    badgeStyle.bg,
                    badgeStyle.text,
                    badgeStyle.border
                  )}
                >
                  {state.code}
                </span>
                <span className="text-xs font-mono text-[#4F4A43]">
                  Capital: {state.capital}
                </span>
              </div>

              {/* Dignified Cultural Greeting Line */}
              <p className="mt-2 text-xs font-semibold text-[#1E3799]">
                {state.greeting}
              </p>

              <p className="mt-1 text-sm text-[#3F3B35] max-w-2xl leading-relaxed">
                Official employment notifications, syllabus patterns, and gazette notices issued by state departments and public service commissions in {state.name}.
              </p>
            </div>

            {/* Subdirectory Context Pill */}
            <div className="flex items-center gap-2 text-xs font-mono shrink-0">
              <span className="text-[#4F4A43] font-medium">State Hub:</span>
              <span className={cn("px-2.5 py-1 rounded font-bold border", badgeStyle.bg, badgeStyle.text, badgeStyle.border)}>
                /state/{state.slug}
              </span>
            </div>
          </div>

          {/* Interactive District Quick Selector */}
          <DistrictSelectorBar stateSlug={state.slug} stateName={state.name} />
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-10">
        {/* Social Alert Bar */}
        <SocialAlertBar state={state} />

        {/* Active Notifications Section with Interactive View Switcher */}
        <MajorRecruitmentsSection jobs={jobs} currentStateSlug={state.slug} />

        <ExamCalendarSections jobs={getJobsByState(allJobs, state.slug, false)} limit={15} />

        <ExamsInProgressSection jobs={getJobsByState(getExamsInProgress(allJobs), state.slug, false)} limit={20} />

        {/* Reserved Ad Space (0.00 CLS Protected) */}
        <ReservedAdSlot slotType="leaderboard" slotId={`state-${state.slug}-leaderboard`} />

        {/* Age & Eligibility Calculator */}
        <section id="calculator">
          <EligibilityCalculator currentStateSlug={state.slug} jobs={getCalculatorJobs(allJobs)} />
        </section>

        {/* Authorized Recruitment Bodies & Stream Navigation */}
        <section className="bg-white rounded-lg border border-[#D5CAB5] p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2D8C6] pb-3">
            <div className="flex items-center gap-2">
              <TricolorCapsule className="w-10 h-1.5" />
              <h3 className="font-serif text-sm font-bold text-[#1A1918]">
                Key Recruitment Boards & Commissions in {state.name}
              </h3>
            </div>
            <a
              href={`/government-jobs/${state.slug}`}
              className="text-xs font-bold text-[#1E3799] hover:underline flex items-center gap-1"
            >
              <span>View Permanent {state.name} Hub</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {state.majorExams.map((exam) => (
              <span
                key={exam}
                className={cn(
                  "px-3 py-1 rounded border font-semibold text-xs shadow-2xs",
                  badgeStyle.bg,
                  badgeStyle.text,
                  badgeStyle.border
                )}
              >
                {exam}
              </span>
            ))}
          </div>

          {/* Links to qualification and sector pages */}
          <div className="pt-2 border-t border-[#E2D8C6] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <a
              href="/engineering-jobs"
              className="p-2.5 rounded bg-[#FCFAF4] border border-[#D5CAB5] hover:border-[#1E3799] transition-colors block text-center"
            >
              <span className="font-bold text-[#1A1918] block truncate">Engineering Jobs</span>
              <span className="text-[11px] text-[#4F4A43]">B.Tech & Diploma</span>
            </a>
            <a
              href="/police-defense-jobs"
              className="p-2.5 rounded bg-[#FCFAF4] border border-[#D5CAB5] hover:border-[#E96B15] transition-colors block text-center"
            >
              <span className="font-bold text-[#1A1918] block truncate">Police & Defense</span>
              <span className="text-[11px] text-[#4F4A43]">SI & Constable</span>
            </a>
            <a
              href="/qualification/graduate"
              className="p-2.5 rounded bg-[#FCFAF4] border border-[#D5CAB5] hover:border-[#1E3799] transition-colors block text-center"
            >
              <span className="font-bold text-[#1A1918] block truncate">Graduate Jobs</span>
              <span className="text-[11px] text-[#4F4A43]">Any Degree</span>
            </a>
            <a
              href="/qualification/12th-pass"
              className="p-2.5 rounded bg-[#FCFAF4] border border-[#D5CAB5] hover:border-[#209948] transition-colors block text-center"
            >
              <span className="font-bold text-[#1A1918] block truncate">12th Pass Jobs</span>
              <span className="text-[11px] text-[#4F4A43]">Clerk & Assistant</span>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
