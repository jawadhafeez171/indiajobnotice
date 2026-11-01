import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { SocialAlertBar } from "@/components/common/SocialAlertBar";
import { MajorRecruitmentsSection } from "@/components/jobs/MajorRecruitmentsSection";
import { TricolorCapsule } from "@/components/common/BrandLogo";
import { ReservedAdSlot } from "@/components/ads/ReservedAdSlot";
import { HeroCounterDeck } from "@/components/home/HeroCounterDeck";
import { getListingJobs, getExamsInProgress } from "@/data/jobs";
import { ExamsInProgressSection } from "@/components/jobs/ExamsInProgressSection";
import { ExamCalendarSections } from "@/components/jobs/ExamCalendarSections";
import { getAllJobs } from "@/lib/jobs-store";

import { STATES_REGISTRY, getStateBadgeColor } from "@/config/states";
import { getStateSubdomainUrl } from "@/lib/subdomains";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "IndiaJobNotice.com - Government Job Notifications, Admit Cards & Results",
  description: "Government job notifications from official sources across India: last dates, eligibility, admit cards and results for central and state recruitments.",
  alternates: {
    canonical: "https://www.indiajobnotice.com",
  },
  openGraph: {
    title: "IndiaJobNotice.com - Central & State Government Jobs",
    description: "Official notifications, admit cards and results from all 36 states and union territories.",
    url: "https://www.indiajobnotice.com",
    siteName: "India Job Notice",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IndiaJobNotice.com - Government Job Notifications",
    description: "Official notifications, admit cards, exam schedules and results.",
  },
};

export default async function HomePage() {
  const allJobs = await getAllJobs();
  const listedJobs = getListingJobs(allJobs);
  const admitCards = listedJobs.filter((j) => j.status === "ADMIT_CARD_OUT");
  const results = listedJobs.filter((j) => j.status === "RESULT_OUT");

  const totalVacancies = listedJobs.reduce((acc, j) => acc + (j.totalVacancies || 0), 0);
  const openApplicationsCount = listedJobs.filter((j) => j.status === "APPLY_OPEN" || j.status === "LAST_DATE_NEAR").length;
  const closingSoonCount = listedJobs.filter((j) => j.status === "LAST_DATE_NEAR").length;
  const admitCardsCount = admitCards.length;
  const resultsCount = results.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F1ECE1]">
      <Navbar currentStateSlug="central" />

      {/* Hero */}
      <section className="border-b border-[#D5CAB5] bg-[#FCFAF4] py-6 sm:py-7 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              {/* Status capsule */}
              <div className="flex items-center gap-2 mb-2 flex-wrap text-xs">
                <TricolorCapsule className="w-12 h-1.5" />
                <span className="font-mono text-[12px] font-bold uppercase tracking-wider text-[#1E3799]">
                  Central & state government jobs
                </span>
                <span className="text-[#D8CFBF]">·</span>
                <span className="text-[12px] font-mono text-[#17803A] bg-[#EDF7F0] px-2 py-0.5 rounded font-bold border border-[#C6E7D0]">
                  Official sources
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1918] tracking-tight">
                Government Job Notifications & Exam Schedules
              </h1>

              <p className="mt-1.5 text-xs sm:text-sm text-[#3F3B35] max-w-2xl">
                Last dates, eligibility, admit cards and results, taken from official notifications.
              </p>
            </div>

            {/* Jobs by state */}
            <div className="flex flex-col sm:items-start lg:items-end gap-1.5 shrink-0 pt-2 lg:pt-0">
              <span className="text-[12px] font-mono text-[#4F4A43] font-semibold">
                Jobs by state:
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
                      <span className="text-[11px] font-mono opacity-70">{st.code}</span>
                    </a>
                  );
                })}
                <a
                  href="#all-states"
                  className="px-2 py-0.5 text-xs text-[#B84D0A] hover:text-[#D4590A] hover:underline font-bold flex items-center gap-0.5"
                >
                  <span>All 36 States</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>

          {/* Counters (desktop only: on a phone they push the first job a screen down) */}
          <div className="hidden md:block">
          <HeroCounterDeck
            totalVacancies={totalVacancies}
            openApplicationsCount={openApplicationsCount}
            closingSoonCount={closingSoonCount}
            admitCardsCount={admitCardsCount}
            resultsCount={resultsCount}
            statesCount={36}
          />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-12">
        {/* Jobs: search, filters and the list come first */}
        <MajorRecruitmentsSection jobs={listedJobs} currentStateSlug="central" />

        {/* Alerts */}
        <SocialAlertBar />

        {/* Exams coming (admit cards out) and latest results, from the official documents */}
        <ExamCalendarSections jobs={allJobs} limit={5} />

        {/* Applications closed, exams or results under way */}
        <ExamsInProgressSection jobs={getExamsInProgress(allJobs)} limit={6} />

        {/* Reserved Ad Space (0.00 CLS Protected) */}
        <ReservedAdSlot slotType="leaderboard" slotId="home-leaderboard" />

        {/* Age check: one line here, the calculator has its own page */}
        <Link
          href="/calculator"
          className="flex items-center justify-between gap-3 p-4 rounded-xl bg-white border border-[#D5CAB5] hover:border-[#1E3799] shadow-2xs"
        >
          <span>
            <span className="block font-serif font-bold text-[#1A1918]">Am I eligible? Check your age</span>
            <span className="block text-xs text-[#4F4A43] mt-0.5">
              Enter your date of birth to see which open jobs you can apply for.
            </span>
          </span>
          <span className="text-sm font-bold text-[#1E3799] shrink-0">Open →</span>
        </Link>

        {/* Jobs by state */}
        <section id="all-states" className="bg-white rounded-lg border border-[#D5CAB5] p-5 shadow-2xs">
          <h2 className="font-serif text-lg font-bold text-[#1A1918] mb-3">Jobs by state and union territory</h2>
          <div className="flex flex-wrap gap-2 text-xs">
            {STATES_REGISTRY.map((st) => (
              <a
                key={st.slug}
                href={getStateSubdomainUrl(st.slug)}
                className="px-2.5 py-1.5 rounded border border-[#D5CAB5] hover:border-[#1E3799] hover:bg-[#EEF2FA]/40 font-semibold text-[#1A1918]"
              >
                {st.name}
              </a>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
