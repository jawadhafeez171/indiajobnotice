import React from "react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { ExamCalendarView } from "@/components/calendar/ExamCalendarView";
import { SocialAlertBar } from "@/components/common/SocialAlertBar";
import { TricolorCapsule } from "@/components/common/BrandLogo";

export const metadata = {
  title: "Government Exam Schedule & Calendar 2026-2027 - IndiaJobNotice.com",
  description: "Official timeline and schedule of upcoming Central and State government recruitment exam dates, admit card releases, and application deadlines.",
};

export default function CalendarPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF4]">
      <Navbar currentStateSlug="central" />

      {/* Editorial Calendar Header */}
      <section className="border-b border-[#EAE2D2] bg-[#FCFAF4] py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <TricolorCapsule className="w-14 h-1.5" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#1E3799] font-bold">
              Official Public Employment Gazettes
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1918] tracking-tight">
            Government Exam Schedule & Calendar 2026
          </h1>

          <p className="text-sm sm:text-base text-[#524E48] mt-2 max-w-3xl leading-relaxed">
            Consolidated timeline of all verified recruitment deadlines, CBT test schedules, hall ticket dates, and result announcements for UPSC, SSC, Railways, Banking, and State PSCs. Sync directly to your smartphone calendar with one click.
          </p>
        </div>
      </section>

      {/* Main Calendar Experience */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-10">
        <ExamCalendarView />

        <SocialAlertBar />
      </main>

      <Footer />
    </div>
  );
}
