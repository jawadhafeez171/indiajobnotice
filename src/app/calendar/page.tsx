import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import React from "react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { ExamCalendarView } from "@/components/calendar/ExamCalendarView";
import { getListingJobs } from "@/data/jobs";
import { getAllJobs } from "@/lib/jobs-store";

import { SocialAlertBar } from "@/components/common/SocialAlertBar";
import { SITE_OG_IMAGES } from "@/lib/site-image";
import { forList } from "@/lib/list-jobs";
import { YEAR } from "@/lib/year";

export const metadata = {
  title: `Government Exam Schedule & Calendar ${YEAR}-${YEAR + 1}`,
  description: "Official timeline and schedule of upcoming Central and State government recruitment exam dates, admit card releases, and application deadlines.",
  alternates: {
    canonical: "https://www.indiajobnotice.com/calendar",
  },
  openGraph: {
    images: SITE_OG_IMAGES,
    title: `Government Exam Calendar & Timeline ${YEAR} - India Job Notice`,
    description: "Export exam dates to Google Calendar and download .ics schedules for UPSC, SSC, Railways, and State PSCs.",
    url: "https://www.indiajobnotice.com/calendar",
    siteName: "India Job Notice",
    locale: "en_IN",
    type: "website",
  },
};

export default async function CalendarPage() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar currentStateSlug="central" />

      <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-7 flex-1 w-full space-y-8">
        <Breadcrumbs items={[{ label: "Exam calendar" }]} className="mb-3" />
        <header className="max-w-3xl">
          <h1 className="font-serif text-[24px] sm:text-4xl font-bold text-ink tracking-tight leading-tight text-balance">
            Calendar of last dates and exams
          </h1>
          <p className="mt-2 text-sm text-ink-2 leading-relaxed max-w-[68ch]">
            Last dates of open recruitments, exam dates from admit cards and schedules, and recent results, each
            from an official document. Add any date to your phone&apos;s calendar.
          </p>
        </header>
        <ExamCalendarView jobs={getListingJobs(await getAllJobs()).map(forList)} />

        <SocialAlertBar />
      </main>

      <Footer />
    </div>
  );
}
