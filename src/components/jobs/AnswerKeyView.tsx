import React from "react";
import Link from "next/link";
import { JobNotification, getActiveOpportunities } from "@/data/jobs";
import { formatDate } from "@/lib/utils";
import { ExaminationLifecycleBar } from "./ExaminationLifecycleBar";
import { 
  KeyRound, 
  ArrowLeft, 
  ExternalLink, 
  Calendar, 
  Clock, 
  FileCheck2, 
  AlertCircle, 
  Download, 
  HelpCircle,
  FileText,
  Building2,
  CheckCircle2,
  IndianRupee
} from "lucide-react";

interface Props {
  job: JobNotification;
  stateSlug?: string;
}

export function AnswerKeyView({ job, stateSlug }: Props) {
  const parentUrl = job.isCentral || !stateSlug || stateSlug === "central"
    ? `/jobs/${job.slug}`
    : `/state/${stateSlug}/jobs/${job.slug}`;

  const activeJobs = getActiveOpportunities(job.id, job.category, job.stateSlug, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center justify-between text-xs text-[#68635B]">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-[#1E3799] font-medium transition-colors">Home</Link>
          <span>/</span>
          <Link href={parentUrl} className="hover:text-[#1E3799] font-medium transition-colors">{job.shortTitle}</Link>
          <span>/</span>
          <span className="text-[#1A1918] font-bold">Answer Key</span>
        </div>

        <Link
          href={parentUrl}
          className="text-[#1E3799] hover:underline font-bold flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Recruitment Notice</span>
        </Link>
      </nav>

      {/* Prominent Back Link Banner to Master Notice */}
      <div className="bg-[#EEF2FA] border border-[#CCD8F0] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <FileText className="w-4 h-4 text-[#1E3799] shrink-0" />
          <span className="text-[#1E3799] font-medium">
            Looking for complete vacancy breakdown, eligibility criteria, or detailed exam pattern?
          </span>
        </div>
        <Link
          href={parentUrl}
          className="px-3 py-1.5 rounded-md bg-[#1E3799] text-white font-bold hover:bg-[#15286D] transition-colors shrink-0 self-start sm:self-auto text-center"
        >
          View Master Notification & Syllabus →
        </Link>
      </div>

      {/* 4-Stage Lifecycle Navigation Bar */}
      <ExaminationLifecycleBar job={job} activeStage="answer-key" stateSlug={stateSlug} />

      {/* Main Answer Key Header Banner */}
      <div className="bg-white rounded-xl border border-[#EAE2D2] border-t-4 border-t-[#E96B15] p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-[#FDF3EB] text-[#E96B15] font-bold text-xs flex items-center gap-1.5 border border-[#F9D7C0]">
              <Building2 className="w-3.5 h-3.5" />
              {job.orgShortCode}
            </span>
            <span className="text-xs font-mono text-[#68635B] px-2 py-0.5 rounded bg-[#FAF7EF] border border-[#EAE2D2]">
              {job.category}
            </span>
          </div>
          <span className="px-2.5 py-1 rounded font-bold text-xs bg-[#FDF3EB] text-[#E96B15] border border-[#F9D7C0]">
            ● Provisional Answer Key & Objection Window
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1918] leading-tight">
          {job.shortTitle} Answer Key 2026 - Question Paper & Candidate Response Sheet
        </h1>
        <p className="text-sm text-[#68635B] mt-1 font-medium">
          Official Commission: <span className="text-[#1A1918] font-bold">{job.organization}</span>
        </p>

        {/* Timetable Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-[#F2ECE1]">
          <div className="p-3.5 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
            <span className="text-[10px] font-mono uppercase text-[#68635B] block font-bold">Answer Key Release</span>
            <span className="font-serif text-base font-bold text-[#1E3799] mt-0.5 block">
              Provisional Key Live
            </span>
          </div>
          <div className="p-3.5 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
            <span className="text-[10px] font-mono uppercase text-[#68635B] block font-bold">Objection Challenge Fee</span>
            <span className="font-serif text-base font-bold text-[#209948] mt-0.5 block">
              ₹100 per Question
            </span>
          </div>
          <div className="p-3.5 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
            <span className="text-[10px] font-mono uppercase text-[#68635B] block font-bold">Fee Refund Policy</span>
            <span className="font-bold text-xs text-[#1A1918] mt-0.5 block">
              Refunded if challenge is upheld by subject experts
            </span>
          </div>
        </div>

        {/* Direct Action */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={job.applyOnlineUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#E96B15] hover:bg-[#D4590A] text-white font-bold text-sm shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Download Response Sheet & File Objections</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <Link
            href={`${parentUrl}/result`}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-[#CCD8F0] hover:border-[#1E3799] bg-[#EEF2FA] text-[#1E3799] font-bold text-sm transition-colors"
          >
            <span>View Expected Result & Cut-Offs →</span>
          </Link>
        </div>
      </div>

      {/* Objection Filing & Score Calculation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step-by-Step Objection Procedure */}
        <div className="bg-white rounded-xl border border-[#EAE2D2] p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#F2ECE1] pb-3">
            <KeyRound className="w-5 h-5 text-[#E96B15]" />
            <div>
              <h3 className="font-serif text-base font-bold text-[#1A1918]">How to Submit Objections</h3>
              <p className="text-xs text-[#68635B]">Official protocol to challenge incorrect answer keys</p>
            </div>
          </div>

          <ol className="space-y-2.5 text-xs text-[#3E3C38]">
            <li className="p-2.5 rounded bg-[#FAF7EF] border border-[#EAE2D2] flex items-start gap-2">
              <span className="font-mono font-bold text-[#E96B15]">1.</span>
              <span>Login to the commission portal using your Roll Number and Password.</span>
            </li>
            <li className="p-2.5 rounded bg-[#FAF7EF] border border-[#EAE2D2] flex items-start gap-2">
              <span className="font-mono font-bold text-[#E96B15]">2.</span>
              <span>Download your individual Question Paper along with candidate attempted answers.</span>
            </li>
            <li className="p-2.5 rounded bg-[#FAF7EF] border border-[#EAE2D2] flex items-start gap-2">
              <span className="font-mono font-bold text-[#E96B15]">3.</span>
              <span>Select the specific Question ID and Question Number you wish to challenge.</span>
            </li>
            <li className="p-2.5 rounded bg-[#FAF7EF] border border-[#EAE2D2] flex items-start gap-2">
              <span className="font-mono font-bold text-[#E96B15]">4.</span>
              <span>Upload standard textbook documentary proof (NCERT, Government gazettes, or authoritative academic references).</span>
            </li>
            <li className="p-2.5 rounded bg-[#FAF7EF] border border-[#EAE2D2] flex items-start gap-2">
              <span className="font-mono font-bold text-[#E96B15]">5.</span>
              <span>Pay the statutory ₹100 fee per challenged question via online net banking / UPI.</span>
            </li>
          </ol>
        </div>

        {/* Raw Score Calculation Formula */}
        <div className="bg-white rounded-xl border border-[#EAE2D2] p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#F2ECE1] pb-3">
            <FileCheck2 className="w-5 h-5 text-[#209948]" />
            <div>
              <h3 className="font-serif text-base font-bold text-[#1A1918]">Score Calculation Methodology</h3>
              <p className="text-xs text-[#68635B]">Formula to estimate your raw score before normalization</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2] text-xs space-y-3">
            <div className="p-2.5 rounded bg-white border border-[#CCD8F0] font-mono text-[11px] font-bold text-[#1E3799]">
              Estimated Raw Score = (Correct Answers × Marks per Question) - (Incorrect Answers × Negative Deduction)
            </div>

            <ul className="space-y-1.5 text-xs text-[#524E48]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#209948] shrink-0 mt-0.5" />
                <span>Unattempted questions are awarded 0 marks (no negative deduction).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#209948] shrink-0 mt-0.5" />
                <span>Multi-shift examinations will undergo statistical normalization as per commission formula.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#209948] shrink-0 mt-0.5" />
                <span>Final Answer Key is prepared after expert committee evaluation of all representations.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Cross-Link to Active Opportunities */}
      {activeJobs.length > 0 && (
        <div className="bg-[#FAF7EF] rounded-xl border border-[#EAE2D2] p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#EAE2D2] pb-2">
            <span className="font-serif font-bold text-sm text-[#1A1918]">Active Government Recruitments Open for Application</span>
            <Link href="/" className="text-xs font-bold text-[#1E3799] hover:underline">All Jobs →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {activeJobs.map((aj) => (
              <Link
                key={aj.id}
                href={aj.isCentral ? `/jobs/${aj.slug}` : `/state/${aj.stateSlug}/jobs/${aj.slug}`}
                className="p-3 rounded bg-white border border-[#EAE2D2] hover:border-[#1E3799] transition-all"
              >
                <span className="text-[10px] font-mono font-bold text-[#1E3799] block">{aj.orgShortCode}</span>
                <span className="font-bold text-xs text-[#1A1918] line-clamp-1 mt-0.5">{aj.shortTitle}</span>
                <span className="text-[11px] text-[#209948] font-semibold mt-1 block">{aj.totalVacancies.toLocaleString("en-IN")} Posts</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
