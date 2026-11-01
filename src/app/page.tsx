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
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar currentStateSlug="central" />

      {/* Hero */}
      <section className="border-b border-line bg-subtle py-6 sm:py-7 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              {/* Status capsule */}
              <div className="flex items-center gap-2 mb-2 flex-wrap text-xs">
                <TricolorCapsule className="w-12 h-1.5" />
                <span className="font-mono text-[12px] font-bold uppercase tracking-wider text-navy">
                  Central & state government jobs
                </span>
                <span className="text-faint">·</span>
                <span className="text-[12px] font-mono text-green bg-green-tint px-2 py-0.5 rounded font-bold border border-green-line">
                  Official sources
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight">
                Government Job Notifications & Exam Schedules
              </h1>

              <p className="mt-1.5 text-xs sm:text-sm text-ink-2 max-w-2xl">
                Last dates, eligibility, admit cards and results, taken from official notifications.
              </p>
            </div>

            {/* Jobs by state */}
            <div className="flex flex-col sm:items-start lg:items-end gap-1.5 shrink-0 pt-2 lg:pt-0">
              <span className="text-[12px] font-mono text-muted font-semibold">
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
                        "px-2 py-0.5 rounded text-xs font-semibold border transition-all flex items-center gap-1 shadow-2xs hover:border-navy",
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
                  className="px-2 py-0.5 text-xs text-saffron hover:text-saffron hover:underline font-bold flex items-center gap-0.5"
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
          className="flex items-center justify-between gap-3 p-4 rounded-xl bg-surface border border-line hover:border-navy shadow-2xs"
        >
          <span>
            <span className="block font-serif font-bold text-ink">Am I eligible? Check your age</span>
            <span className="block text-xs text-muted mt-0.5">
              Enter your date of birth to see which open jobs you can apply for.
            </span>
          </span>
          <span className="text-sm font-bold text-navy shrink-0">Open →</span>
        </Link>

        {/* Jobs by state */}
        <section id="all-states" className="bg-surface rounded-lg border border-line p-5 shadow-2xs">
          <h2 className="font-serif text-lg font-bold text-ink mb-3">Jobs by state and union territory</h2>
          <div className="flex flex-wrap gap-2 text-xs">
            {STATES_REGISTRY.map((st) => (
              <a
                key={st.slug}
                href={getStateSubdomainUrl(st.slug)}
                className="px-2.5 py-1.5 rounded border border-line hover:border-navy hover:bg-navy-tint/40 font-semibold text-ink"
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
