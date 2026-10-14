import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { JobCard } from "@/components/jobs/JobCard";
import { SocialAlertBar } from "@/components/common/SocialAlertBar";
import { EligibilityCalculator } from "@/components/eligibility/EligibilityCalculator";
import { MajorRecruitmentsSection } from "@/components/jobs/MajorRecruitmentsSection";
import { TricolorCapsule } from "@/components/common/BrandLogo";
import { SAMPLE_JOBS } from "@/data/jobs";
import { STATES_REGISTRY, getStateBadgeColor } from "@/config/states";
import { getStateSubdomainUrl } from "@/lib/subdomains";
import { cn } from "@/lib/utils";
import { ArrowRight, FileCheck, Award, ShieldCheck, Sparkles } from "lucide-react";

export const metadata = {
  title: "India Job Notice - Central & State Government Employment Gazettes",
  description: "Independent verified repository of Central and State government recruitment notifications, official circulars, admit cards, and results.",
};

export default function HomePage() {
  const centralJobs = SAMPLE_JOBS.filter((j) => j.isCentral);
  const featuredJobs = SAMPLE_JOBS.filter((j) => j.featured);
  const admitCards = SAMPLE_JOBS.filter((j) => j.status === "ADMIT_CARD_OUT");
  const results = SAMPLE_JOBS.filter((j) => j.status === "RESULT_OUT");

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF4]">
      <Navbar currentStateSlug="central" />

      {/* Editorial Hero Infused with Brand Identity */}
      <section className="border-b border-[#EAE2D2] bg-[#FCFAF4] py-12 sm:py-16 px-4 sm:px-6 relative overflow-hidden">
        {/* Subtle royal blue line at very top accentuating the header baseline */}
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="max-w-3xl">
            {/* Signature Tricolor & Authority Tags */}
            <div className="flex items-center gap-2.5 mb-4 flex-wrap">
              <TricolorCapsule className="w-16 h-2" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#68635B] font-semibold">
                Official Public Employment Gazettes
              </span>
              <span className="text-[#D8CFBF]">·</span>
              <span className="text-[11px] font-mono text-[#1E3799] bg-[#EEF2FA] px-2 py-0.5 rounded font-bold border border-[#CCD8F0]">
                Central Hub
              </span>
              <span className="text-[11px] font-mono text-[#E96B15] bg-[#FDF3EB] px-2 py-0.5 rounded font-bold border border-[#F9D9C3]">
                36 State Subdomains
              </span>
              <span className="text-[11px] font-mono text-[#209948] bg-[#EDF7F0] px-2 py-0.5 rounded font-bold border border-[#C6E7D0]">
                100% Verified
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1A1918] tracking-tight leading-tight">
              Verified Government Job Circulars & Exam Schedules
            </h1>

            <p className="mt-3 text-sm sm:text-base text-[#524E48] leading-relaxed">
              Direct access to official PDF notifications, syllabus patterns, and application dates for UPSC, SSC, Railways, Defense, and state public service commissions. Zero clickbait, zero third-party redirection.
            </p>

            {/* Quick State Subdomain Pills Harmonized with Brand Palette */}
            <div className="mt-6 pt-5 border-t border-[#EAE2D2]">
              <div className="text-xs text-[#68635B] mb-2.5 flex items-center justify-between">
                <span className="font-medium">Jump directly to State Gazettes:</span>
                <span className="font-mono text-[#1E3799] hidden sm:inline text-[11px] font-semibold">
                  [state].indiajobnotice.com
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {STATES_REGISTRY.slice(0, 8).map((st) => {
                  const badge = getStateBadgeColor(st.code);
                  return (
                    <a
                      key={st.slug}
                      href={getStateSubdomainUrl(st.slug)}
                      className={cn(
                        "px-2.5 py-1 rounded text-xs font-semibold border transition-all flex items-center gap-1.5 shadow-2xs hover:shadow-xs",
                        badge.bg,
                        badge.text,
                        badge.border,
                        "hover:border-[#1E3799]"
                      )}
                    >
                      <span>{st.name}</span>
                      <span className="text-[10px] font-mono opacity-80">{st.code}</span>
                    </a>
                  );
                })}
                <a
                  href="#all-states"
                  className="px-2.5 py-1 text-xs text-[#E96B15] hover:text-[#D4590A] hover:underline font-bold flex items-center gap-0.5"
                >
                  <span>All 36 States</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-12">
        {/* Notice Alert Bar */}
        <SocialAlertBar />

        {/* Major Open Recruitments with Interactive 4-Category Switcher & Views */}
        <MajorRecruitmentsSection jobs={SAMPLE_JOBS} currentStateSlug="central" />

        {/* Age & Eligibility Calculator */}
        <section id="calculator">
          <EligibilityCalculator currentStateSlug="central" />
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
                    <a href={`/jobs/${job.slug}`} className="font-semibold text-[#1A1918] hover:text-[#1E3799] block">
                      {job.shortTitle}
                    </a>
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
                    <a href={`/state/${job.stateSlug}/jobs/${job.slug}`} className="font-semibold text-[#1A1918] hover:text-[#209948] block">
                      {job.shortTitle}
                    </a>
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

        {/* State Subdomain Directory - Distinct Regional Palettes */}
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
                Each state operates on its dedicated subdomain with localized circulars and syllabus
              </p>
            </div>
            <span className="text-xs font-mono text-[#1E3799] font-bold">36 Subdomains Active</span>
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
                    <span className="text-[10px] text-[#68635B] font-mono group-hover:text-[#1E3799]/80">{st.slug}.indiajobnotice.com</span>
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
