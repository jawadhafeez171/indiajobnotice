import React from "react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { JobCard } from "@/components/jobs/JobCard";
import { SocialAlertBar } from "@/components/common/SocialAlertBar";
import { EligibilityCalculator } from "@/components/eligibility/EligibilityCalculator";
import { MajorRecruitmentsSection } from "@/components/jobs/MajorRecruitmentsSection";
import { TricolorCapsule } from "@/components/common/BrandLogo";
import { getStateBySlug, STATES_REGISTRY, getStateBadgeColor } from "@/config/states";
import { getJobsByState } from "@/data/jobs";
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

  return {
    title: `${state.name} Govt Job Notifications & Gazettes - ${state.slug}.indiajobnotice.com`,
    description: `Official employment gazette notifications, exam patterns, admit cards, and results for ${state.name} (${state.nativeName}). Official commission links: ${state.majorExams.join(", ")}.`,
  };
}

export default async function StateHomePage({ params }: PageProps) {
  const { state: stateSlug } = await params;
  const state = getStateBySlug(stateSlug);

  if (!state) {
    notFound();
  }

  const jobs = getJobsByState(state.slug);
  const badgeStyle = getStateBadgeColor(state.code);

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF4]">
      <Navbar currentStateSlug={state.slug} />

      {/* Editorial State Header with Regional Tint Accent */}
      <section className="border-b border-[#EAE2D2] bg-[#FCFAF4] py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb with Tricolor Accent */}
          <div className="flex items-center gap-2 text-xs text-[#68635B] mb-3">
            <a href={getCentralPortalUrl()} className="hover:text-[#1E3799] font-medium transition-colors">
              All-India Gazettes
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
                <span className="text-sm font-serif italic text-[#68635B]">
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
                <span className="text-xs font-mono text-[#68635B]">
                  Capital: {state.capital}
                </span>
              </div>

              {/* Dignified Cultural Greeting Line */}
              <p className="mt-2 text-xs font-semibold text-[#1E3799]">
                {state.greeting}
              </p>

              <p className="mt-1 text-sm text-[#524E48] max-w-2xl leading-relaxed">
                Official employment notifications, syllabus patterns, and gazette notices issued by state departments and public service commissions in {state.name}.
              </p>
            </div>

            {/* Subdomain Context Pill */}
            <div className="flex items-center gap-2 text-xs font-mono shrink-0">
              <span className="text-[#68635B] font-medium">Direct Subdomain:</span>
              <span className={cn("px-2.5 py-1 rounded font-bold border", badgeStyle.bg, badgeStyle.text, badgeStyle.border)}>
                {state.slug}.indiajobnotice.com
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-10">
        {/* Social Alert Bar */}
        <SocialAlertBar state={state} />

        {/* Active Notifications Section with Interactive View Switcher */}
        <MajorRecruitmentsSection jobs={jobs} currentStateSlug={state.slug} />

        {/* Age & Eligibility Calculator */}
        <section id="calculator">
          <EligibilityCalculator currentStateSlug={state.slug} />
        </section>

        {/* Authorized Recruitment Bodies */}
        <section className="bg-white rounded-lg border border-[#EAE2D2] p-5 shadow-2xs">
          <div className="flex items-center gap-2 mb-2.5">
            <TricolorCapsule className="w-10 h-1.5" />
            <h3 className="font-serif text-sm font-bold text-[#1A1918]">
              Key Recruitment Boards & Commissions in {state.name}
            </h3>
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
        </section>
      </main>

      <Footer />
    </div>
  );
}
