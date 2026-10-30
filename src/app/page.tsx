import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { JobCard } from "@/components/jobs/JobCard";
import { SocialAlertBar } from "@/components/common/SocialAlertBar";
import { EligibilityCalculator } from "@/components/eligibility/EligibilityCalculator";
import { MajorRecruitmentsSection } from "@/components/jobs/MajorRecruitmentsSection";
import { TricolorCapsule } from "@/components/common/BrandLogo";
import { ReservedAdSlot } from "@/components/ads/ReservedAdSlot";
import { HeroCounterDeck } from "@/components/home/HeroCounterDeck";
import { getJobCanonicalPath, getListingJobs, getCalculatorJobs, getExamsInProgress } from "@/data/jobs";
import { ExamsInProgressSection } from "@/components/jobs/ExamsInProgressSection";
import { ExamCalendarSections } from "@/components/jobs/ExamCalendarSections";
import { getAllJobs } from "@/lib/jobs-store";

import { STATES_REGISTRY, getStateBadgeColor } from "@/config/states";
import { getStateSubdomainUrl } from "@/lib/subdomains";
import { cn } from "@/lib/utils";
import { ArrowRight, FileCheck, Award, ShieldCheck, Sparkles } from "lucide-react";

export const metadata = {
  title: "IndiaJobNotice.com - Official Govt Job Notifications, Gazettes & Admit Cards",
  description: "India's dedicated government job notification portal. 100% verified official circulars, syllabus patterns, exam schedules, and results across Central & 36 State portals.",
  alternates: {
    canonical: "https://www.indiajobnotice.com",
  },
  openGraph: {
    title: "IndiaJobNotice.com - Central & State Government Employment Gazettes",
    description: "Verified official notifications, admit cards, and results across all 36 States & Union Territories.",
    url: "https://www.indiajobnotice.com",
    siteName: "India Job Notice",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IndiaJobNotice.com - Official Govt Job Notifications",
    description: "Official notifications, admit cards, exam schedules, and direct PDF downloads.",
  },
};

export default async function HomePage() {
  const allJobs = await getAllJobs();
  const listedJobs = getListingJobs(allJobs);
  const centralJobs = listedJobs.filter((j) => j.isCentral);
  const featuredJobs = listedJobs.filter((j) => j.featured);
  const admitCards = listedJobs.filter((j) => j.status === "ADMIT_CARD_OUT");
  const results = listedJobs.filter((j) => j.status === "RESULT_OUT");

  const totalVacancies = listedJobs.reduce((acc, j) => acc + (j.totalVacancies || 0), 0);
  const openApplicationsCount = listedJobs.filter((j) => j.status === "APPLY_OPEN" || j.status === "LAST_DATE_NEAR").length;
  const closingSoonCount = listedJobs.filter((j) => j.status === "LAST_DATE_NEAR").length;
  const admitCardsCount = admitCards.length;
  const resultsCount = results.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF4]">
      <Navbar currentStateSlug="central" />

      {/* Short & Direct Gazette Hero */}
      <section className="border-b border-[#EAE2D2] bg-[#FCFAF4] py-6 sm:py-7 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              {/* Status capsule */}
              <div className="flex items-center gap-2 mb-2 flex-wrap text-xs">
                <TricolorCapsule className="w-12 h-1.5" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#1E3799]">
                  Central & State Employment Gazettes
                </span>
                <span className="text-[#D8CFBF]">·</span>
                <span className="text-[11px] font-mono text-[#209948] bg-[#EDF7F0] px-2 py-0.5 rounded font-bold border border-[#C6E7D0]">
                  100% Official
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1918] tracking-tight">
                Government Job Notifications & Exam Schedules
              </h1>

              <p className="mt-1.5 text-xs sm:text-sm text-[#524E48] max-w-2xl">
                Direct official circulars, syllabus breakdown & deadlines for Central, Defense, Railways & 36 State portals.
              </p>
            </div>

            {/* Quick State Gazette Switcher */}
            <div className="flex flex-col sm:items-start lg:items-end gap-1.5 shrink-0 pt-2 lg:pt-0">
              <span className="text-[11px] font-mono text-[#68635B] font-semibold">
                Direct State Gazettes:
              </span>
              <div className="flex flex-wrap gap-1.5 max-w-md lg:justify-end">
                {STATES_REGISTRY.slice(0, 6).map((st) => {
                  const badge = getStateBadgeColor(st.code);
                  return (
                    <a
                      key={st.slug}
                      href={getStateSubdomainUrl(st.slug)}
                      className={cn(
                        "px-2 py-0.5 rounded text-xs font-semibold border transition-all flex items-center gap-1 shadow-2xs hover:border-[#1E3799]",
                        badge.bg,
                        badge.text,
                        badge.border
                      )}
                    >
                      <span>{st.name}</span>
                      <span className="text-[10px] font-mono opacity-70">{st.code}</span>
                    </a>
                  );
                })}
                <a
                  href="#all-states"
                  className="px-2 py-0.5 text-xs text-[#E96B15] hover:text-[#D4590A] hover:underline font-bold flex items-center gap-0.5"
                >
                  <span>All 36 States</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>

          {/* Live Gazette Counters */}
          <HeroCounterDeck
            totalVacancies={totalVacancies}
            openApplicationsCount={openApplicationsCount}
            closingSoonCount={closingSoonCount}
            admitCardsCount={admitCardsCount}
            resultsCount={resultsCount}
            statesCount={36}
          />
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-12">
        {/* Notice Alert Bar */}
        <SocialAlertBar />

        {/* Major Open Recruitments with Interactive 4-Category Switcher & Views */}
        <MajorRecruitmentsSection jobs={listedJobs} currentStateSlug="central" />

        {/* Exams coming (admit cards out) and latest results, from the official documents */}
        <ExamCalendarSections jobs={allJobs} />

        {/* Applications closed, exams or results under way */}
        <ExamsInProgressSection jobs={getExamsInProgress(allJobs)} />

        {/* Reserved Ad Space (0.00 CLS Protected) */}
        <ReservedAdSlot slotType="leaderboard" slotId="home-leaderboard" />

        {/* Age & Eligibility Calculator */}
        <section id="calculator">
          <EligibilityCalculator currentStateSlug="central" jobs={getCalculatorJobs(allJobs)} />
        </section>

        {/* Central Govt Circulars */}
        <section id="central-jobs">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4 border-b border-[#EAE2D2] pb-2">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E3799]" />
              <div>
                <h2 className="font-serif text-xl font-bold text-[#1A1918]">
                  Central Government Gazette Circulars
                </h2>
                <p className="text-xs text-[#68635B]">
                  Complete coverage across UPSC (CSE, NDA, CDS, CAPF), SSC (CGL, CHSL, GD, MTS, CPO), Railways (NTPC, Group D, ALP, JE), Banking (SBI, IBPS, RBI), Teaching & Postal
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-[#1E3799] bg-[#EEF2FA] px-2.5 py-1 rounded border border-[#CCD8F0] self-start sm:self-auto shrink-0">
              {centralJobs.length} Central Gazettes Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {centralJobs.map((job) => (
              <JobCard key={job.id} job={job} currentStateSlug="central" />
            ))}
          </div>
        </section>

        {/* Two-Column Admit Cards & Results (Subtly Colored Boxes) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="admit-cards">
          {/* Admit Cards Box - Royal Navy Accents from Logo */}
          <section className="bg-white rounded-lg border border-[#CCD8F0] p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#EEF2FA]">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#1E3799]" />
                <h3 className="font-serif text-base font-bold text-[#1E3799]">
                  Admit Cards Active
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EEF2FA] text-[#1E3799] font-bold border border-[#CCD8F0]">
                CBT & Written
              </span>
            </div>

            <div className="space-y-3">
              {admitCards.map((job) => (
                <div key={job.id} className="flex items-baseline justify-between text-xs py-2 border-b border-[#FCFAF4] hover:bg-[#EEF2FA]/30 px-1 rounded transition-colors">
                  <div>
                    <Link href={getJobCanonicalPath(job)} className="font-semibold text-[#1A1918] hover:text-[#1E3799] block">
                      {job.shortTitle}
                    </Link>
                    <span className="text-[11px] text-[#68635B]">{job.organization} · Exam: {job.examDate}</span>
                  </div>
                  <a
                    href={job.applyOnlineUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#1E3799] hover:underline shrink-0 ml-3 font-bold"
                  >
                    Download →
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Results Box - Tiranga Green Accents from Logo */}
          <section className="bg-white rounded-lg border border-[#C6E7D0] p-5 shadow-2xs" id="results">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#EDF7F0]">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#209948]" />
                <h3 className="font-serif text-base font-bold text-[#209948]">
                  Recent Results & Cut-off Marks
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EDF7F0] text-[#209948] font-bold border border-[#C6E7D0]">
                Merit Lists
              </span>
            </div>

            <div className="space-y-3">
              {results.map((job) => (
                <div key={job.id} className="flex items-baseline justify-between text-xs py-2 border-b border-[#FCFAF4] hover:bg-[#EDF7F0]/30 px-1 rounded transition-colors">
                  <div>
                    <Link href={getJobCanonicalPath(job)} className="font-semibold text-[#1A1918] hover:text-[#209948] block">
                      {job.shortTitle}
                    </Link>
                    <span className="text-[11px] text-[#68635B]">{job.organization} · {job.totalVacancies.toLocaleString()} Posts</span>
                  </div>
                  <a
                    href={job.applyOnlineUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#209948] hover:underline shrink-0 ml-3 font-bold"
                  >
                    View Score →
                  </a>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* State Subdirectory Directory - Distinct Regional Palettes */}
        <section id="all-states" className="bg-white rounded-lg border border-[#EAE2D2] p-6 shadow-2xs">
          <div className="mb-4 pb-2 border-b border-[#F2ECE1] flex items-baseline justify-between">
            <div>
              <div className="flex items-center gap-2">
                <TricolorCapsule className="w-12 h-1.5" />
                <h2 className="font-serif text-lg font-bold text-[#1A1918]">
                  State & Union Territory Gazettes Directory
                </h2>
              </div>
              <p className="text-xs text-[#68635B] mt-0.5">
                Each state operates on its dedicated subfolder hub with localized circulars and syllabus
              </p>
            </div>
            <span className="text-xs font-mono text-[#1E3799] font-bold">36 State Hubs Active</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 text-xs">
            {STATES_REGISTRY.map((st) => {
              const badge = getStateBadgeColor(st.code);
              return (
                <a
                  key={st.slug}
                  href={getStateSubdomainUrl(st.slug)}
                  className="p-3 rounded border border-[#EAE2D2] hover:border-[#1E3799] hover:bg-[#EEF2FA]/40 transition-all flex items-baseline justify-between group shadow-2xs hover:shadow-xs"
                >
                  <div>
                    <span className="font-bold text-[#1A1918] group-hover:text-[#1E3799] transition-colors block">
                      {st.name}
                    </span>
                    <span className="text-[10px] text-[#68635B] font-mono group-hover:text-[#1E3799]/80">/state/{st.slug}</span>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-mono px-1.5 py-0.2 rounded font-bold border",
                      badge.bg,
                      badge.text,
                      badge.border
                    )}
                  >
                    {st.code}
                  </span>
                </a>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
