import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { SocialAlertBar } from "@/components/common/SocialAlertBar";
import { MajorRecruitmentsSection } from "@/components/jobs/MajorRecruitmentsSection";
import { ReservedAdSlot } from "@/components/ads/ReservedAdSlot";
import { getListingJobs, getExamsInProgress, todayIST, getJobCanonicalPath } from "@/data/jobs";
import { cleanTitle } from "@/components/jobs/JobListCard";
import type { JobNotification } from "@/data/jobs";
import { ExamsInProgressSection } from "@/components/jobs/ExamsInProgressSection";
import { ExamCalendarSections } from "@/components/jobs/ExamCalendarSections";
import { getAllJobs } from "@/lib/jobs-store";
import { StepsArt } from "@/components/home/StepsArt";
import { HomeSearch } from "@/components/home/HomeSearch";

import { STATES_REGISTRY, getStateBadgeColor } from "@/config/states";
import { TricolorCapsule } from "@/components/common/BrandLogo";
import { cn } from "@/lib/utils";
import { getStateSubdomainUrl } from "@/lib/subdomains";


// ticker text: the title without the body's name in front (it is shown in bold) and cut short
function tickerTitle(j: JobNotification): string {
  const t = cleanTitle(j);
  const rest = t.startsWith(j.orgShortCode + " ") ? t.slice(j.orgShortCode.length + 1) : t;
  return rest.length > 60 ? rest.slice(0, 58).trimEnd() + "…" : rest;
}

const AGE_GLOW = {
  backgroundImage: "radial-gradient(520px 220px at 100% 100%, rgb(var(--c-green-solid) / 0.10), transparent 70%), radial-gradient(420px 200px at 0% 0%, rgb(var(--c-saffron-bright) / 0.08), transparent 70%)",
};

// the year in the title follows the calendar (set when the page is built)
const YEAR = new Date().getFullYear();

export const metadata = {
  title: `Latest Government Jobs ${YEAR}, Sarkari Naukri Notifications | India Job Notice`,
  description: "Government job notifications from official sources across India: last dates, eligibility, admit cards and results for central and state recruitments.",
  alternates: {
    canonical: "https://www.indiajobnotice.com",
  },
  openGraph: {
    title: "India Job Notice - Central & State Government Jobs",
    description: "Official notifications, admit cards and results from all 36 states and union territories.",
    url: "https://www.indiajobnotice.com",
    siteName: "India Job Notice",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "India Job Notice - Government Job Notifications",
    description: "Official notifications, admit cards, exam schedules and results.",
  },
};

export default async function HomePage() {
  const allJobs = await getAllJobs();
  const listedJobs = getListingJobs(allJobs);
  // recruitments whose applications opened in the last 7 days (the date the site added a notice
  // says little: everything already open was added when the site started publishing)

  // ticker: newest open notifications first
  const latest = listedJobs
    .filter((j) => (j.status === "APPLY_OPEN" || j.status === "LAST_DATE_NEAR") && j.applicationStartDate)
    .sort((a, b) => b.applicationStartDate.localeCompare(a.applicationStartDate))
    .slice(0, 12);

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar currentStateSlug="central" />

      {/* Hero: label, heading and one line on the left; the main states on the right */}
      <section className="border-b border-line bg-subtle py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap text-xs">
              <TricolorCapsule className="w-12 h-1.5" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-navy">
                Central &amp; state government jobs
              </span>
              <span className="text-faint" aria-hidden>·</span>
              <span className="text-[11px] font-mono text-green bg-green-tint px-2 py-0.5 rounded font-bold border border-green-line">
                Official sources
              </span>
            </div>
            <h1 className="font-serif text-[26px] sm:text-4xl lg:text-[40px] font-bold text-ink tracking-tight leading-tight text-balance">
              Government Job Notifications &amp; Exam Schedules
            </h1>
            <p className="mt-2 text-sm text-ink-2 max-w-2xl">
              Last dates, eligibility, admit cards and results, taken from official notifications.
            </p>
          </div>

          {/* Jobs by state */}
          <div className="flex flex-col lg:items-end gap-1.5 shrink-0">
            <span className="text-[11px] font-mono text-muted font-semibold">Jobs by state:</span>
            <div className="flex flex-wrap gap-1.5 max-w-md lg:justify-end">
              {STATES_REGISTRY.slice(0, 6).map((st) => {
                const badge = getStateBadgeColor(st.code);
                return (
                  <a
                    key={st.slug}
                    href={getStateSubdomainUrl(st.slug)}
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-semibold border transition-colors flex items-center gap-1 hover:border-navy",
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
                className="px-2 py-0.5 text-xs text-saffron hover:underline font-bold flex items-center gap-0.5"
              >
                All 36 States →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Search: one box, and "Advanced search" with every filter */}
      <HomeSearch />

      {/* Latest notices ticker: moves slowly, stops on hover/touch; still for reduced motion */}
      {latest.length > 0 && (
        <div className="border-b border-line bg-surface">
          <div className="max-w-6xl mx-auto flex items-center">
            <span className="shrink-0 z-10 flex items-center gap-1.5 pl-4 sm:pl-6 pr-3 py-2.5 bg-surface text-[12px] font-bold text-saffron">
              <span className="w-1.5 h-1.5 rounded-full bg-saffron-bright motion-safe:animate-pulse" aria-hidden />
              NEW
            </span>
            <div className="group relative flex-1 overflow-hidden motion-reduce:overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)]">
              <ul className="flex w-max motion-safe:animate-marquee group-hover:[animation-play-state:paused] group-active:[animation-play-state:paused]">
                {[0, 1].map((copy) =>
                  latest.map((j) => (
                    <li key={`${copy}-${j.id}`} aria-hidden={copy === 1 || undefined} className="shrink-0">
                      <Link
                        href={getJobCanonicalPath(j)}
                        tabIndex={copy === 1 ? -1 : undefined}
                        className="flex items-center gap-2 px-4 py-2.5 text-[13px] text-ink-2 hover:text-navy whitespace-nowrap"
                      >
                        <b className="text-navy">{j.orgShortCode}</b>
                        <span>{tickerTitle(j)}</span>
                        {j.totalVacancies > 0 && (
                          <span className="text-muted">· {j.totalVacancies.toLocaleString("en-IN")} posts</span>
                        )}
                        <span className="text-faint" aria-hidden>•</span>
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-12">
        {/* Jobs: search, filters and the list come first */}
        <MajorRecruitmentsSection jobs={listedJobs} currentStateSlug="central" hideSearch />

        {/* Alerts */}
        <SocialAlertBar />

        {/* Exams coming (admit cards out) and latest results, from the official documents */}
        <ExamCalendarSections jobs={allJobs} limit={5} />

        {/* Applications closed, exams or results under way */}
        <ExamsInProgressSection jobs={getExamsInProgress(allJobs)} limit={6} />

        {/* Reserved Ad Space (0.00 CLS Protected) */}
        <ReservedAdSlot slotType="leaderboard" slotId="home-leaderboard" />

        {/* Age check: date of birth here, the full calculator on its own page */}
        <section
          aria-labelledby="age-check"
          className="relative overflow-hidden rounded-2xl border border-line bg-surface shadow-2xs"
          style={AGE_GLOW}
        >
          <div className="grid md:grid-cols-[1fr_auto] items-center gap-4 md:gap-8 p-5 sm:p-7">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-tint text-green text-[12px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-solid" aria-hidden /> Free · takes 10 seconds
              </span>
              <h2 id="age-check" className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-ink leading-tight text-balance">
                Am I eligible? Check your age
              </h2>
              <p className="mt-1.5 text-sm text-ink-2 max-w-md">
                Enter your date of birth and see which open jobs you can apply for, with age relaxation
                for your category.
              </p>
              <form action="/calculator" method="get" className="mt-4 flex flex-col sm:flex-row gap-2 max-w-md">
                <label className="flex-1">
                  <span className="sr-only">Date of birth</span>
                  <input
                    type="date"
                    name="dob"
                    required
                    max={todayIST()}
                    className="w-full h-12 px-3 rounded-xl border-2 border-line bg-surface text-[15px] text-ink focus:outline-none focus:border-navy"
                  />
                </label>
                <button
                  type="submit"
                  className="h-12 px-5 rounded-xl bg-navy-solid hover:bg-navy-strong text-white font-bold text-sm whitespace-nowrap"
                >
                  Check jobs for me →
                </button>
              </form>
            </div>
            <StepsArt className="hidden md:block w-64 lg:w-80 h-auto" />
          </div>
        </section>

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
