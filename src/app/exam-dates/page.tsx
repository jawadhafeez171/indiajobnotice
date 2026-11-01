import React from "react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { SocialAlertBar } from "@/components/common/SocialAlertBar";
import { ExamDatesView } from "@/components/jobs/ExamDatesView";
import { getExamDates, JobNotification, ExamDateEntry } from "@/data/jobs";
import { getAllJobs } from "@/lib/jobs-store";

export const revalidate = 3600;

export const metadata = {
  title: "Upcoming Government Exam Dates 2026 - Admit Cards & Schedules",
  description:
    "Upcoming government exam, physical test and interview dates from official admit cards and exam schedules, soonest first, for central and state recruitments.",
  alternates: { canonical: "https://www.indiajobnotice.com/exam-dates" },
  openGraph: {
    title: "Upcoming Government Exam Dates - IndiaJobNotice",
    description: "Exam dates from official admit cards and exam schedules, soonest first.",
    url: "https://www.indiajobnotice.com/exam-dates",
    siteName: "India Job Notice",
    locale: "en_IN",
    type: "website",
  },
};

// only what the page shows goes to the browser (a recruitment can have many dates)
function slim(e: ExamDateEntry): ExamDateEntry {
  const j = e.job;
  const job = {
    id: j.id, slug: j.slug, title: j.title, shortTitle: j.shortTitle, organization: j.organization,
    orgShortCode: j.orgShortCode, isCentral: j.isCentral, stateSlug: j.stateSlug, officialPdfUrl: j.officialPdfUrl,
  } as JobNotification;
  const stage = e.stage && { kind: e.stage.kind, title: e.stage.title, url: e.stage.url, summary: e.stage.summary };
  return { ...e, job, stage };
}

export default async function ExamDatesPage() {
  const entries = getExamDates(await getAllJobs()).map(slim);
  const recruitments = new Set(entries.map((e) => e.job.id)).size;

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar currentStateSlug="central" />

      <section className="border-b border-line bg-subtle py-7 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink tracking-tight">Upcoming exam dates</h1>
          <p className="text-sm text-ink-2 mt-1.5 max-w-2xl">
            Exams, physical tests and interviews still ahead, soonest first: {entries.length} dates in{" "}
            {recruitments} recruitments. Dates come from the official admit cards and exam schedules; a date
            printed only in the notification is marked tentative.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-10">
        <ExamDatesView entries={entries} />
        <SocialAlertBar />
      </main>

      <Footer />
    </div>
  );
}
