import React from "react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { ExamCalendarView } from "@/components/calendar/ExamCalendarView";
import { getListingJobs } from "@/data/jobs";
import { getAllJobs } from "@/lib/jobs-store";

import { SocialAlertBar } from "@/components/common/SocialAlertBar";
import { TricolorCapsule } from "@/components/common/BrandLogo";

export const metadata = {
  title: "Government Exam Schedule & Calendar 2026-2027",
  description: "Official timeline and schedule of upcoming Central and State government recruitment exam dates, admit card releases, and application deadlines.",
  alternates: {
    canonical: "https://www.indiajobnotice.com/calendar",
  },
  openGraph: {
    title: "Government Exam Calendar & Timeline 2026 - India Job Notice",
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

      {/* Editorial Calendar Header */}
      <section className="border-b border-line bg-subtle py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <TricolorCapsule className="w-14 h-1.5" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-navy font-bold">
              Exam and last-date calendar
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink tracking-tight">
            Government Exam Schedule & Calendar 2026
          </h1>

          <p className="text-sm sm:text-base text-ink-2 mt-2 max-w-3xl leading-relaxed">
            Consolidated timeline of all verified recruitment deadlines, CBT test schedules, hall ticket dates, and result announcements for UPSC, SSC, Railways, Banking, and State PSCs. Sync directly to your smartphone calendar with one click.
          </p>
        </div>
      </section>

      {/* Main Calendar Experience */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-10">
        <ExamCalendarView jobs={getListingJobs(await getAllJobs())} />

        <SocialAlertBar />
      </main>

      <Footer />
    </div>
  );
}
