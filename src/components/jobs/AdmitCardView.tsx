import React from "react";
import Link from "next/link";
import { JobNotification, getActiveOpportunities } from "@/data/jobs";
import { formatDate } from "@/lib/utils";
import { ExaminationLifecycleBar } from "./ExaminationLifecycleBar";
import { TricolorCapsule } from "@/components/common/BrandLogo";
import { 
  Ticket, 
  ArrowLeft, 
  ExternalLink, 
  Calendar, 
  Clock, 
  FileCheck2, 
  AlertTriangle, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  FileText,
  Building2,
  Briefcase
} from "lucide-react";

interface Props {
  job: JobNotification;
  stateSlug?: string;
}

export function AdmitCardView({ job, stateSlug }: Props) {
  const parentUrl = job.isCentral || !stateSlug || stateSlug === "central"
    ? `/jobs/${job.slug}`
    : `/state/${stateSlug}/jobs/${job.slug}`;

  const isReleased = job.status === "ADMIT_CARD_OUT" || Boolean(job.admitCardDate && job.admitCardDate.toLowerCase().includes("released"));
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
          <span className="text-[#1A1918] font-bold">Admit Card</span>
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
            Looking for complete eligibility, post-wise vacancies, or detailed exam syllabus?
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
      <ExaminationLifecycleBar job={job} activeStage="admit-card" stateSlug={stateSlug} />

      {/* Main Admit Card Header Banner */}
      <div className="bg-white rounded-xl border border-[#EAE2D2] border-t-4 border-t-[#1E3799] p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-[#EEF2FA] text-[#1E3799] font-bold text-xs flex items-center gap-1.5 border border-[#CCD8F0]">
              <Building2 className="w-3.5 h-3.5" />
              {job.orgShortCode}
            </span>
            <span className="text-xs font-mono text-[#68635B] px-2 py-0.5 rounded bg-[#FAF7EF] border border-[#EAE2D2]">
              {job.category}
            </span>
          </div>
          <span className={isReleased ? "px-2.5 py-1 rounded font-bold text-xs bg-[#EDF7F0] text-[#209948] border border-[#C6E7D0]" : "px-2.5 py-1 rounded font-bold text-xs bg-[#EEF2FA] text-[#1E3799] border border-[#CCD8F0]"}>
            {isReleased ? "● Admit Card Live / Released" : "● Hall Ticket Release Scheduled"}
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1918] leading-tight">
          {job.shortTitle} Admit Card 2026 - Hall Ticket & Exam City Slip
        </h1>
        <p className="text-sm text-[#68635B] mt-1 font-medium">
          Official Commission: <span className="text-[#1A1918] font-bold">{job.organization}</span>
        </p>

        {/* Timetable Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-[#F2ECE1]">
          <div className="p-3.5 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
            <span className="text-[10px] font-mono uppercase text-[#68635B] block font-bold">Admit Card Release</span>
            <span className="font-serif text-base font-bold text-[#1E3799] mt-0.5 block">
              {job.admitCardDate || "7-10 Days Prior to Exam"}
            </span>
          </div>
          <div className="p-3.5 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
            <span className="text-[10px] font-mono uppercase text-[#68635B] block font-bold">Scheduled Exam Date</span>
            <span className="font-serif text-base font-bold text-[#E96B15] mt-0.5 block">
              {job.examDate || "To be notified by board"}
            </span>
          </div>
          <div className="p-3.5 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
            <span className="text-[10px] font-mono uppercase text-[#68635B] block font-bold">Examination Shifts</span>
            <span className="font-bold text-xs text-[#1A1918] mt-0.5 block">
              Shift 1: 09:00 AM | Shift 2: 02:30 PM
            </span>
          </div>
        </div>

        {/* Direct Official Download Action */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={job.applyOnlineUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#1E3799] hover:bg-[#15286D] text-white font-bold text-sm shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Download e-Admit Card (Official Portal)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href={job.officialPdfUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-[#CCD8F0] hover:border-[#1E3799] bg-[#EEF2FA] text-[#1E3799] font-bold text-sm transition-colors"
          >
            <FileText className="w-4 h-4 text-[#1E3799]" />
            <span>Official Exam Schedule PDF</span>
          </a>
        </div>
      </div>

      {/* Login Credentials & Step-by-Step Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Credentials Required */}
        <div className="bg-white rounded-xl border border-[#EAE2D2] p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#F2ECE1] pb-3">
            <FileCheck2 className="w-5 h-5 text-[#1E3799]" />
            <div>
              <h3 className="font-serif text-base font-bold text-[#1A1918]">Required Login Credentials</h3>
              <p className="text-xs text-[#68635B]">Keep these details ready before opening the commission login portal</p>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-[#3E3C38]">
            <li className="flex items-start gap-2.5 p-3 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
              <span className="w-5 h-5 rounded-full bg-[#EEF2FA] text-[#1E3799] font-bold text-xs flex items-center justify-center shrink-0">1</span>
              <div>
                <strong className="text-[#1A1918] block">Registration ID / Roll Number:</strong>
                <span className="text-[#68635B]">Received on registered email and SMS during application submission.</span>
              </div>
            </li>
            <li className="flex items-start gap-2.5 p-3 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
              <span className="w-5 h-5 rounded-full bg-[#EEF2FA] text-[#1E3799] font-bold text-xs flex items-center justify-center shrink-0">2</span>
              <div>
                <strong className="text-[#1A1918] block">Date of Birth / Password:</strong>
                <span className="text-[#68635B]">Format DD/MM/YYYY exactly as recorded in high school matriculation certificate.</span>
              </div>
            </li>
            <li className="flex items-start gap-2.5 p-3 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
              <span className="w-5 h-5 rounded-full bg-[#EEF2FA] text-[#1E3799] font-bold text-xs flex items-center justify-center shrink-0">3</span>
              <div>
                <strong className="text-[#1A1918] block">Security Captcha Code:</strong>
                <span className="text-[#68635B]">Case-sensitive verification code displayed on the server login screen.</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Step-by-Step Download Process */}
        <div className="bg-white rounded-xl border border-[#EAE2D2] p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#F2ECE1] pb-3">
            <Ticket className="w-5 h-5 text-[#E96B15]" />
            <div>
              <h3 className="font-serif text-base font-bold text-[#1A1918]">How to Download Hall Ticket</h3>
              <p className="text-xs text-[#68635B]">Standard procedure to retrieve and print your exam entry pass</p>
            </div>
          </div>

          <ol className="space-y-2.5 text-xs text-[#3E3C38]">
            <li className="p-2.5 rounded bg-[#FAF7EF] border border-[#EAE2D2] flex items-start gap-2">
              <span className="font-mono font-bold text-[#E96B15]">Step 1:</span>
              <span>Visit the official website of {job.organization} or click the download link above.</span>
            </li>
            <li className="p-2.5 rounded bg-[#FAF7EF] border border-[#EAE2D2] flex items-start gap-2">
              <span className="font-mono font-bold text-[#E96B15]">Step 2:</span>
              <span>Locate the notification header &ldquo;Download Admit Card for {job.shortTitle}&rdquo;.</span>
            </li>
            <li className="p-2.5 rounded bg-[#FAF7EF] border border-[#EAE2D2] flex items-start gap-2">
              <span className="font-mono font-bold text-[#E96B15]">Step 3:</span>
              <span>Enter your Registration ID, Date of Birth, and security captcha code.</span>
            </li>
            <li className="p-2.5 rounded bg-[#FAF7EF] border border-[#EAE2D2] flex items-start gap-2">
              <span className="font-mono font-bold text-[#E96B15]">Step 4:</span>
              <span>Check your allocated Exam City, Test Center venue, Shift timings, and reporting deadline.</span>
            </li>
            <li className="p-2.5 rounded bg-[#FAF7EF] border border-[#EAE2D2] flex items-start gap-2">
              <span className="font-mono font-bold text-[#E96B15]">Step 5:</span>
              <span>Save the PDF to your device and print at least 2 clean copies on A4 paper.</span>
            </li>
          </ol>
        </div>
      </div>

      {/* Mandatory Exam Day Instructions & Documents Checklist */}
      <div className="bg-white rounded-xl border border-[#EAE2D2] p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#F2ECE1] pb-3">
          <ShieldCheck className="w-5 h-5 text-[#209948]" />
          <div>
            <h3 className="font-serif text-base font-bold text-[#1A1918]">Mandatory Documents for Exam Hall Entry</h3>
            <p className="text-xs text-[#68635B]">Candidates will be barred from entry if any of the following items are missing</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2] space-y-1">
            <span className="font-bold text-[#1A1918] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#209948]" />
              Printed e-Admit Card
            </span>
            <p className="text-[#524E48]">Legible printout with clear photograph and barcode. Self-declaration COVID/health clause must be duly signed.</p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2] space-y-1">
            <span className="font-bold text-[#1A1918] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#209948]" />
              Original Photo ID Proof
            </span>
            <p className="text-[#524E48]">Aadhaar Card, Voter ID, Passport, PAN Card, or Driving License. Photocopies or scanned mobile copies are strictly invalid.</p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2] space-y-1">
            <span className="font-bold text-[#1A1918] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#209948]" />
              Two Passport Size Color Photos
            </span>
            <p className="text-[#524E48]">Same photograph as uploaded in online application form, required for attendance sheet verification.</p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2] space-y-1">
            <span className="font-bold text-[#C41C1C] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#C41C1C]" />
              Strictly Prohibited Items
            </span>
            <p className="text-[#524E48]">Mobile phones, digital watches, Bluetooth earphones, metallic items, belts, and calculators are banned inside the testing center.</p>
          </div>
        </div>
      </div>

      {/* Cross-Link to Active Opportunities */}
      {activeJobs.length > 0 && (
        <div className="bg-[#FAF7EF] rounded-xl border border-[#EAE2D2] p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#EAE2D2] pb-2">
            <span className="font-serif font-bold text-sm text-[#1A1918]">Explore Other Active Government Recruitments</span>
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
