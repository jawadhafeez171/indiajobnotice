import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import React from "react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { AgeFinder, AgeJob } from "@/components/eligibility/AgeFinder";
import { getJobCanonicalPath, isOpenOrOpening, JobNotification } from "@/data/jobs";
import { getAllJobs } from "@/lib/jobs-store";
import { getStateBySlug } from "@/config/states";
import { rowTitle } from "@/components/jobs/JobListCard";
import { SocialAlertBar } from "@/components/common/SocialAlertBar";
import { SITE_OG_IMAGES } from "@/lib/site-image";
import { YEAR } from "@/lib/year";

// Age calculator (21 Nov, owner's choice): each open notice checked against the age limits it prints, on the
// date it counts age from. No relaxation is added and no cut-off date assumed; the old calculator added
// OBC +3 / SC-ST +5 / PwD +10 to every job and measured age on the last date.

export const metadata = {
  title: `Age Calculator for Government Jobs ${YEAR}: Which Open Jobs Fit Your Age`,
  description: "Enter your date of birth to see which open central and state government job notifications fit your age, checked against each notice's own printed age limits and the date it counts age on.",
  alternates: { canonical: "https://www.indiajobnotice.com/calculator" },
  openGraph: {
    images: SITE_OG_IMAGES,
    title: `Government Job Age Calculator ${YEAR}`,
    description: "Which open government jobs fit your age, checked against each notice's printed limits.",
    url: "https://www.indiajobnotice.com/calculator",
    siteName: "India Job Notice",
    locale: "en_IN",
    type: "website",
  },
};

function forAge(j: JobNotification): AgeJob | null {
  const limits = (j.ageLimits || []).filter((l) => l.max > 0);
  if (!limits.length && (j.ageKnown === false || !(j.maxAge > 0))) return null;
  const state = j.isCentral ? null : getStateBySlug(j.stateSlug);
  const dom = j.details?.facts?.domicile;
  return {
    id: j.id,
    href: getJobCanonicalPath(j),
    code: (j.orgShortCode || "").split(" · ")[0],
    title: rowTitle(j),
    place: state ? state.name : "Central",
    placeSlug: state ? state.slug : "central",
    lastDate: j.applicationEndDate,
    asOn: j.ageAsOn || "",
    limits,
    minAge: j.minAge || 0,
    maxAge: j.maxAge || 0,
    ...(dom?.value ? { domicile: { value: dom.value, page: dom.page || 0 } } : {}),
  };
}

export default async function CalculatorPage() {
  const jobs = (await getAllJobs())
    .filter((j) => !j.inProgress && isOpenOrOpening(j) && j.applicationEndDate)
    .map(forAge).filter((j): j is AgeJob => Boolean(j));
  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar currentStateSlug="central" />
      <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-1 w-full space-y-6">
        <Breadcrumbs items={[{ label: "Age calculator" }]} className="mb-3" />
        <div className="max-w-3xl">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink tracking-tight">Which government jobs fit your age?</h1>
          <p className="mt-2 text-base text-ink-2 leading-relaxed max-w-[62ch]">
            Enter your date of birth. Every open notice is checked against the age limits it prints, by category,
            on the date it counts age from.
          </p>
        </div>

        <AgeFinder jobs={jobs} />

        <SocialAlertBar />
      </main>
      <Footer />
    </div>
  );
}
