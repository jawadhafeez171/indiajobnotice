import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { MajorRecruitmentsSection } from "@/components/jobs/MajorRecruitmentsSection";
import { ReservedAdSlot } from "@/components/ads/ReservedAdSlot";
import { getStateBySlug, STATES_REGISTRY } from "@/config/states";
import { getJobsByState, getListingJobs, getExamsInProgress, isOpenOrOpening } from "@/data/jobs";
import { ExamsInProgressSection } from "@/components/jobs/ExamsInProgressSection";
import { ExamCalendarSections } from "@/components/jobs/ExamCalendarSections";
import { getAllJobs } from "@/lib/jobs-store";

import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { SITE_OG_IMAGES } from "@/lib/site-image";
import { forList } from "@/lib/list-jobs";
import { OpenJobLinks } from "@/components/jobs/OpenJobLinks";
import { YEAR } from "@/lib/year";
import { stateHasListings } from "@/lib/index-rules";

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
  const listed = stateHasListings(await getAllJobs(), state.slug);

  return {
    title: `${state.name} Govt Jobs ${YEAR}: Notifications, Admit Cards & Results`,
    description: `Government job notifications from ${state.name}'s commissions, boards, police and courts: last dates, eligibility, admit cards and results, each with the official notification link.`,
    alternates: {
      canonical: canonicalUrl,
    },
    // nothing of its own open or under way: out of search until there is, links still followed (11 Nov)
    robots: listed ? undefined : { index: false, follow: true },
    openGraph: {
      images: SITE_OG_IMAGES,
      title: `${state.name} Government Jobs - India Job Notice`,
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
  const ownOpen = jobs.some((j) => !j.isCentral && isOpenOrOpening(j));

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar currentStateSlug={state.slug} />

      {/* Editorial State Header with Regional Tint Accent */}
      <section className="border-b border-line bg-subtle py-5 sm:py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs items={[{ label: state.name }]} className="mb-3" />

          {/* the state's name and what the page holds; 11 Nov: the code badge, capital and "State Hub" address pill went */}
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink tracking-tight">
              {state.name} government jobs
            </h1>
            <span className="text-base font-semibold text-muted">
              {state.nativeName}
            </span>
          </div>
          <p className="mt-2 text-sm text-ink-2 max-w-2xl leading-relaxed">
            Recruitments from {state.name}&apos;s commissions, boards, courts and departments, each with its last date
            and the link to the official notification.
          </p>

          {/* District buttons come back when notices record their district (11 Nov: every district page
              repeated the state's list, so they now lead here) */}
        </div>
      </section>

      {/* Main Content Area */}
      <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-10">
        {/* The jobs: the state's own first when it has open ones (11 Nov, owner's choice), central a tap away */}
        <MajorRecruitmentsSection
          jobs={jobs.map(forList)}
          currentStateSlug={state.slug}
          defaultScope={ownOpen ? "STATE" : "ALL"}
        />

        <OpenJobLinks jobs={jobs} heading={`All open notifications for ${state.name}`} />

        {/* Short lists; the rest open in place */}
        <ExamCalendarSections jobs={getJobsByState(allJobs, state.slug, false)} limit={5} expandRest />

        <ExamsInProgressSection jobs={getJobsByState(getExamsInProgress(allJobs), state.slug, false)} limit={6} expandRest />

        {/* Reserved Ad Space (0.00 CLS Protected) */}
        <ReservedAdSlot slotType="leaderboard" slotId={`state-${state.slug}-leaderboard`} />

        {/* The bodies that recruit here, and more ways in; the age check has its own page */}
        <section aria-labelledby="bodies-h" className="border-t border-line pt-6 space-y-4">
          <h2 id="bodies-h" className="font-serif text-xl font-bold text-ink">Recruiting bodies in {state.name}</h2>
          <ul className="flex flex-wrap gap-x-2 gap-y-2 text-sm">
            {state.majorExams.map((exam) => (
              <li key={exam} className="px-3 py-1.5 rounded-md bg-surface border border-line font-semibold text-ink">{exam}</li>
            ))}
          </ul>
          <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm font-semibold">
            {[
              { href: "/calculator", label: "Check which jobs your age fits" },
              { href: "/engineering-jobs", label: "Engineering jobs" },
              { href: "/police-defense-jobs", label: "Police and defence jobs" },
              { href: "/qualification/graduate", label: "Graduate jobs" },
              { href: "/qualification/12th-pass", label: "12th pass jobs" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex items-center min-h-[44px] text-navy hover:text-saffron underline-offset-4 hover:underline">
                  {l.label} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
