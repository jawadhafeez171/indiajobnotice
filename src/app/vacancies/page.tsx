import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { QualificationVacancyTracker } from "@/components/vacancies/QualificationVacancyTracker";
import { getListingJobs } from "@/data/jobs";
import { getAllJobs } from "@/lib/jobs-store";

import { TricolorCapsule } from "@/components/common/BrandLogo";
import { SocialAlertBar } from "@/components/common/SocialAlertBar";
import { ReservedAdSlot } from "@/components/ads/ReservedAdSlot";

export const metadata: Metadata = {
  title: "Qualification-Wise Government Job Vacancy Tracker 2026 | IndiaJobNotice.com",
  description: "Live cross-sector tracker of government job vacancies by qualification (10th Pass, 12th Pass, Diploma, Graduate Degree, B.Tech Engineering). Campus bulletin printout for college placement cells and libraries.",
  alternates: {
    canonical: "https://www.indiajobnotice.com/vacancies",
  },
  openGraph: {
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
    <div className="min-h-screen flex flex-col bg-[#FCFAF4]">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar currentStateSlug="central" />

      {/* Editorial Header */}
      <section className="border-b border-[#EAE2D2] bg-[#FCFAF4] py-8 sm:py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <TricolorCapsule className="w-14 h-1.5" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#1E3799] font-bold">
              Official Public Gazette Intelligence
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1918] tracking-tight">
            Qualification-Wise Government Job Vacancy Tracker
          </h1>

          <p className="text-sm sm:text-base text-[#524E48] mt-2 max-w-3xl leading-relaxed">
            Consolidated directory of all active and upcoming Central & State government vacancies classified by minimum educational eligibility criteria. Maintained as a public resource for candidates, university career centers, coaching faculty, and public libraries.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        <QualificationVacancyTracker jobs={getListingJobs(await getAllJobs())} />

        {/* Reserved Ad Slot (0.00 CLS Protection) */}
        <ReservedAdSlot slotType="leaderboard" slotId="vacancies-tracker-bottom" className="print:hidden" />

        <SocialAlertBar />
      </main>

      <Footer />
    </div>
  );
}
