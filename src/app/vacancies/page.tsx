import { safeJson } from "@/lib/json-ld";
import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { QualificationVacancyTracker } from "@/components/vacancies/QualificationVacancyTracker";
import { getListingJobs } from "@/data/jobs";
import { getAllJobs } from "@/lib/jobs-store";

import { SocialAlertBar } from "@/components/common/SocialAlertBar";
import { ReservedAdSlot } from "@/components/ads/ReservedAdSlot";
import { SITE_OG_IMAGES } from "@/lib/site-image";

export const metadata: Metadata = {
  title: "Qualification-Wise Government Job Vacancy Tracker 2026",
  description: "Live cross-sector tracker of government job vacancies by qualification (10th Pass, 12th Pass, Diploma, Graduate Degree, B.Tech Engineering). Campus bulletin printout for college placement cells and libraries.",
  alternates: {
    canonical: "https://www.indiajobnotice.com/vacancies",
  },
  openGraph: {
    images: SITE_OG_IMAGES,
    title: "Qualification-Wise Government Vacancy Tracker 2026",
    description: "Track live verified government job vacancies categorized by educational qualification. 100% verified gazette circulars.",
    url: "https://www.indiajobnotice.com/vacancies",
    siteName: "India Job Notice",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Qualification-Wise Govt Job Vacancy Tracker 2026",
    description: "Consolidated live vacancy counts across Graduate, Engineering, Diploma, 12th, and 10th pass government recruitments.",
  },
};

export default async function VacanciesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Qualification-Wise Government Job Vacancy Tracker 2026",
    description: "Live cross-sector tracker of government job vacancies by educational criteria.",
    url: "https://www.indiajobnotice.com/vacancies",
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJson(jsonLd) }}
      />

      <Navbar currentStateSlug="central" />

      <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-7 flex-1 w-full space-y-6">
        <header className="max-w-3xl">
          <h1 className="font-serif text-[24px] sm:text-4xl font-bold text-ink tracking-tight leading-tight text-balance">
            Government job vacancies by qualification
          </h1>
          <p className="mt-2 text-sm text-ink-2 leading-relaxed max-w-[68ch]">
            Central and state recruitments grouped by the education they ask for, each read from its official
            notice. Colleges and libraries print this list for their notice boards.
          </p>
        </header>
        <QualificationVacancyTracker jobs={getListingJobs(await getAllJobs())} />

        {/* Reserved Ad Slot (0.00 CLS Protection) */}
        <ReservedAdSlot slotType="leaderboard" slotId="vacancies-tracker-bottom" className="print:hidden" />

        <SocialAlertBar />
      </main>

      <Footer />
    </div>
  );
}
