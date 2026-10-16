"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  Users, 
  GraduationCap, 
  Calendar, 
  IndianRupee, 
  FileText, 
  ExternalLink, 
  ArrowLeft, 
  CheckCircle2, 
  BookOpen, 
  Scale, 
  ShieldCheck, 
  Printer, 
  Bookmark, 
  Download, 
  Layers, 
  Activity, 
  Award, 
  HelpCircle,
  Clock,
  Sparkles
} from "lucide-react";
import { JobNotification } from "@/data/jobs";
import { JobStatusBadge } from "./JobStatusBadge";
import { JobLifecycleTracker } from "./JobLifecycleTracker";
import { formatDate, getDaysRemaining, cn } from "@/lib/utils";
import { WhatsAppLogo, TelegramLogo } from "@/components/common/SocialIcons";
import { TricolorCapsule } from "@/components/common/BrandLogo";
import { getStateBySlug } from "@/config/states";
import { getStateSubdomainUrl, getCentralPortalUrl } from "@/lib/subdomains";
import { ReservedAdSlot } from "@/components/ads/ReservedAdSlot";
import { useWatchlist } from "@/lib/watchlist";
import { generateGoogleCalendarUrl, downloadIcsFile } from "@/lib/calendar";
import { 
  getJobExamStages, 
  getJobPhysicalStandards, 
  getJobCutoffs, 
  getJobDetailedSyllabus 
} from "@/lib/exam-details";
import { ExecutiveNotificationDigest } from "./ExecutiveNotificationDigest";
import { ApplicationDeadlineSection } from "./ApplicationDeadlineSection";
import { ExaminationLifecycleBar } from "./ExaminationLifecycleBar";
import { ClosedRecruitmentAlert } from "./ClosedRecruitmentAlert";
import { JobTaxonomyBar } from "./JobTaxonomyBar";
import { RelatedOpportunitiesSection } from "./RelatedOpportunitiesSection";
import { getJobTaxonomyLinks } from "@/lib/internal-links";
import { generateJobStructuredData, getJobFaqs } from "@/lib/structured-data";
import { isJobApplicationClosed } from "@/data/jobs";

interface Props {
  job: JobNotification;
  stateSlug?: string;
}

type SyllabusTab = "pattern" | "topics" | "physical" | "cutoffs";

export function JobDetailView({ job, stateSlug }: Props) {
  const isClosed = isJobApplicationClosed(job);
  const daysLeft = getDaysRemaining(job.applicationEndDate);
  const stateInfo = job.stateSlug !== "central" ? getStateBySlug(job.stateSlug) : null;
  const taxonomy = getJobTaxonomyLinks(job);
  
  // Watchlist
  const { isSaved, toggleSave } = useWatchlist();
  const saved = isSaved(job.id);

  // Exam Details Data
  const examStages = getJobExamStages(job);
  const physicalStandards = getJobPhysicalStandards(job);
  const cutoffs = getJobCutoffs(job);
  const detailedSyllabus = getJobDetailedSyllabus(job);

  // Active Tab
  const [activeTab, setActiveTab] = useState<SyllabusTab>("pattern");

  // Google Calendar URL for application deadline
  const deadlineCalendarUrl = generateGoogleCalendarUrl({
    title: `LAST DATE: ${job.shortTitle} Application Closes`,
    description: `Official IndiaJobNotice alert for ${job.organization} (${job.totalVacancies} Posts).\nApply online: ${job.applyOnlineUrl}`,
    startDate: job.applicationEndDate,
    location: job.isCentral ? "All India / Central" : `${job.stateSlug.toUpperCase()} State`,
    url: job.applyOnlineUrl,
  });

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const basePrefix = job.isCentral || !stateSlug || stateSlug === "central"
    ? `/jobs/${job.slug}`
    : `/state/${stateSlug}/jobs/${job.slug}`;

  const canonicalUrl = `https://www.indiajobnotice.com${basePrefix}`;
  const structuredData = generateJobStructuredData(job, canonicalUrl);
  const faqs = getJobFaqs(job);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7 print:p-0 print:m-0 print:max-w-none">
      {/* Schema.org Structured Data Graph (JobPosting / WebPage + BreadcrumbList + FAQPage) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Deliberate Hierarchical Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center justify-between text-xs text-[#68635B] print:hidden">
        <ol className="flex items-center flex-wrap gap-1.5 list-none p-0 m-0">
          {taxonomy.breadcrumbTrail.map((crumb, idx) => {
            const isLast = idx === taxonomy.breadcrumbTrail.length - 1;
            return (
              <li key={idx} className="flex items-center gap-1.5">
                {idx > 0 && <span className="text-[#A09B90]">/</span>}
                {isLast ? (
                  <span className="text-[#1A1918] font-bold line-clamp-1" aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="hover:text-[#1E3799] font-medium transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>

        {/* Quick Back to Gazette Directory */}
        <Link
          href="/"
          className="text-[#1E3799] hover:underline font-bold flex items-center gap-1 shrink-0 ml-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Gazettes</span>
        </Link>
      </nav>

      {/* Examination Lifecycle Navigation Bar (Notification, Admit Card, Answer Key, Result) */}
      <ExaminationLifecycleBar job={job} activeStage="notice" stateSlug={stateSlug} />

      {/* Deliberate Category & Authority Hub Pathways (State, Qualification, Organisation, Sector) */}
      <JobTaxonomyBar job={job} />

      {/* Main Job Banner Card */}
      <div className="bg-white rounded-xl border border-[#EAE2D2] border-t-4 border-t-[#1E3799] p-6 sm:p-8 shadow-2xs print:border-none print:shadow-none print:p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded bg-[#EEF2FA] text-[#1E3799] font-bold text-xs flex items-center gap-1.5 border border-[#CCD8F0]">
              <Building2 className="w-3.5 h-3.5 text-[#1E3799]" />
              {job.orgShortCode}
            </span>
            {job.isCentral ? (
              <span className="text-xs bg-[#EEF2FA] text-[#1E3799] font-bold px-2.5 py-1 rounded border border-[#CCD8F0]">
                All-India Central Circular
              </span>
            ) : (
              <span className="text-xs bg-[#FDF3EB] text-[#E96B15] font-bold px-2.5 py-1 rounded border border-[#F9D9C3]">
                {stateInfo?.name} State Circular
              </span>
            )}
            <span className="text-xs font-mono text-[#68635B] px-2 py-0.5 rounded bg-[#FAF7EF] border border-[#EAE2D2]">
              {job.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <JobStatusBadge 
              status={isClosed && job.status !== "RESULT_OUT" && job.status !== "ADMIT_CARD_OUT" ? "APPLICATIONS_CLOSED" : job.status} 
            />

            {/* Pin to Watchlist Action */}
            <button
              onClick={() => toggleSave(job.id)}
              className={cn(
                "px-3 py-1.5 rounded-md border text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs print:hidden",
                saved
                  ? "bg-[#FDF3EB] text-[#E96B15] border-[#F9D7C0] ring-1 ring-[#E96B15]/20"
                  : "bg-white text-[#68635B] border-[#DDD5C7] hover:border-[#1E3799] hover:text-[#1E3799]"
              )}
              title={saved ? "Remove from Pinned Watchlist" : "Pin notice to Watchlist"}
            >
              <Bookmark className={cn("w-3.5 h-3.5", saved && "fill-[#E96B15]")} />
              <span>{saved ? "Pinned to Watchlist" : "Pin Notice"}</span>
            </button>
          </div>
        </div>

        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#1A1918] leading-tight">
          {job.title}
        </h1>

        <p className="text-sm text-[#68635B] mt-2 font-medium">
          Official Commission / Board: <span className="text-[#1A1918] font-bold">{job.organization}</span>
        </p>

        {/* Action Buttons Bar - hidden on print */}
        <div className="mt-6 pt-6 border-t border-[#F2ECE1] flex flex-wrap items-center gap-3 print:hidden">
          {isClosed ? (
            <div className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#FAF7EF] border border-[#DDD5C7] text-[#68635B] font-bold text-sm">
              <span>🚫 Applications Closed on {formatDate(job.applicationEndDate)}</span>
            </div>
          ) : (
            <a
              href={job.applyOnlineUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#E96B15] hover:bg-[#D4590A] text-white font-bold text-sm shadow-xs transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Apply Online (Official Portal)</span>
            </a>
          )}

          <a
            href={job.officialPdfUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-[#CCD8F0] hover:border-[#1E3799] bg-[#EEF2FA] hover:bg-[#E0E9F8] text-[#1E3799] font-bold text-sm transition-colors"
          >
            <FileText className="w-4 h-4 text-[#1E3799]" />
            <span>Download Official PDF</span>
          </a>

          {/* Add to Calendar Button */}
          <a
            href={deadlineCalendarUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-lg border border-[#EAE2D2] hover:border-[#1E3799] bg-[#FAF7EF] hover:bg-[#EEF2FA] text-[#1A1918] font-semibold text-xs transition-colors"
            title="Set reminder for application deadline in Google Calendar"
          >
            <Calendar className="w-4 h-4 text-[#1E3799]" />
            <span>Remind Me</span>
          </a>

          {/* Print Gazette Digest */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-lg border border-[#EAE2D2] hover:border-[#1E3799] bg-[#FAF7EF] hover:bg-[#EEF2FA] text-[#1A1918] font-semibold text-xs transition-colors"
            title="Print a clean 1-page gazette digest or save as PDF"
          >
            <Printer className="w-4 h-4 text-[#68635B]" />
            <span>Print Digest</span>
          </button>

          <a
            href="https://t.me/Indiajobnotice1"
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-lg bg-[#24A1DE] text-white hover:bg-[#1D8FCA] transition-colors shadow-xs ml-auto"
            title="Join Official Telegram Channel for Instant Alerts"
          >
            <TelegramLogo className="w-5 h-5" />
          </a>

          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check ${job.title} on IndiaJobNotice.com: ${job.applyOnlineUrl}`)}`}
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-lg bg-[#25D366] text-white hover:bg-[#20BA5A] transition-colors shadow-xs"
            title="Share with Aspirants on WhatsApp"
          >
            <WhatsAppLogo className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Exam Progression Tracker */}
      <div className="print:hidden">
        <JobLifecycleTracker job={job} />
      </div>

      {/* Closed Recruitment Notice & Active Opportunities Banner */}
      {isClosed && (
        <ClosedRecruitmentAlert job={job} stateSlug={stateSlug} />
      )}

      {/* Executive Candidate Notification Digest (Primary Facts Near Top) */}
      <ExecutiveNotificationDigest job={job} />

      {/* Application Deadline & Critical Timeline Section (Search Intent: [Recruitment] last date to apply) */}
      <ApplicationDeadlineSection job={job} stateSlug={stateSlug} />

      {/* Reserved Ad Space in Job Details (CLS Protected) */}
      <ReservedAdSlot slotType="leaderboard" slotId={`job-detail-${job.slug}`} className="print:hidden" />

      {/* ================= COMPREHENSIVE EXAM PATTERN & SYLLABUS SECTION ================= */}
      <section className="bg-white rounded-xl border border-[#EAE2D2] p-6 sm:p-7 shadow-2xs space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TricolorCapsule className="w-12 h-1.5" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#1E3799] font-bold">
              Official Scheme of Examination
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1918]">
            Detailed Exam Pattern, Syllabus & Standards
          </h2>
          <p className="text-xs text-[#68635B] mt-1">
            Stage-wise marks breakdown, negative marking rules, topic list, physical efficiency criteria, and historical cut-offs.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#EAE2D2] overflow-x-auto pb-px text-xs font-bold print:hidden">
          <button
            onClick={() => setActiveTab("pattern")}
            className={cn(
              "py-2.5 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap",
              activeTab === "pattern"
                ? "border-[#1E3799] text-[#1E3799] bg-[#EEF2FA]/50 rounded-t"
                : "border-transparent text-[#68635B] hover:text-[#1A1918]"
            )}
          >
            <Layers className="w-4 h-4" />
            <span>Stage-wise Exam Pattern</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#EEF2FA] text-[#1E3799]">
              {examStages.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("topics")}
            className={cn(
              "py-2.5 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap",
              activeTab === "topics"
                ? "border-[#1E3799] text-[#1E3799] bg-[#EEF2FA]/50 rounded-t"
                : "border-transparent text-[#68635B] hover:text-[#1A1918]"
            )}
          >
            <BookOpen className="w-4 h-4" />
            <span>Subject-wise Syllabus</span>
          </button>

          {physicalStandards && (
            <button
              onClick={() => setActiveTab("physical")}
              className={cn(
                "py-2.5 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === "physical"
                  ? "border-[#E96B15] text-[#E96B15] bg-[#FDF3EB]/50 rounded-t"
                  : "border-transparent text-[#68635B] hover:text-[#1A1918]"
              )}
            >
              <Activity className="w-4 h-4 text-[#E96B15]" />
              <span>Physical Standards (PET/PST)</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab("cutoffs")}
            className={cn(
              "py-2.5 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap",
              activeTab === "cutoffs"
                ? "border-[#209948] text-[#209948] bg-[#EDF7F0]/50 rounded-t"
                : "border-transparent text-[#68635B] hover:text-[#1A1918]"
            )}
          >
            <Award className="w-4 h-4 text-[#209948]" />
            <span>Previous Year Cut-offs</span>
          </button>
        </div>

        {/* Tab Content 1: Stage-wise Exam Pattern Tables */}
        {(activeTab === "pattern" || typeof window === "undefined") && (
          <div className="space-y-6">
            {examStages.map((stage, idx) => (
              <div
                key={idx}
                className="bg-[#FCFAF4] rounded-lg border border-[#EAE2D2] p-5 shadow-2xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAE2D2] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#1E3799] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#1A1918]">
                      {stage.stageName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#EEF2FA] text-[#1E3799] border border-[#CCD8F0]">
                      Mode: {stage.mode}
                    </span>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#FAF7EF] text-[#68635B] border border-[#DDD5C7]">
                      Duration: {stage.duration}
                    </span>
                  </div>
                </div>

                {/* Rules Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-3 rounded-md border border-[#EAE2D2]">
                  {stage.negativeMarking && (
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-[#C41C1C]">Negative Marking:</span>
                      <span className="text-[#524E48]">{stage.negativeMarking}</span>
                    </div>
                  )}
                  {stage.qualifyingCriteria && (
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-[#1E3799]">Criteria:</span>
                      <span className="text-[#524E48]">{stage.qualifyingCriteria}</span>
                    </div>
                  )}
                </div>

                {/* Subject Breakdown Table */}
                {stage.subjects.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-[#EAE2D2] rounded-md overflow-hidden bg-white">
                      <thead>
                        <tr className="bg-[#FAF7EC] border-b border-[#EAE2D2] font-mono text-[11px] text-[#68635B] uppercase">
                          <th className="py-2.5 px-3 font-bold text-[#1E3799]">Subject / Section</th>
                          <th className="py-2.5 px-3 font-semibold text-center">Questions</th>
                          <th className="py-2.5 px-3 font-semibold text-center">Maximum Marks</th>
                          <th className="py-2.5 px-3 font-semibold text-right">Timing</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F2ECE1]">
                        {stage.subjects.map((sub, sIdx) => (
                          <tr key={sIdx} className="hover:bg-[#FCFAF4] transition-colors">
                            <td className="py-2.5 px-3 font-medium text-[#1A1918]">{sub.name}</td>
                            <td className="py-2.5 px-3 font-mono text-center text-[#524E48]">{sub.questions > 0 ? sub.questions : "—"}</td>
                            <td className="py-2.5 px-3 font-mono font-bold text-center text-[#1E3799]">{sub.marks > 0 ? sub.marks : "Qualifying"}</td>
                            <td className="py-2.5 px-3 font-mono text-right text-[#68635B]">{sub.durationMinutes ? `${sub.durationMinutes} mins` : "Composite"}</td>
                          </tr>
                        ))}
                      </tbody>
                      {stage.totalMarks > 0 && (
                        <tfoot>
                          <tr className="bg-[#FAF7EC] font-bold border-t border-[#EAE2D2] font-mono text-xs">
                            <td className="py-2.5 px-3 text-[#1A1918]">Total Scheme</td>
                            <td className="py-2.5 px-3 text-center text-[#1A1918]">{stage.totalQuestions > 0 ? stage.totalQuestions : "—"} Qs</td>
                            <td className="py-2.5 px-3 text-center text-[#1E3799]">{stage.totalMarks} Marks</td>
                            <td className="py-2.5 px-3 text-right text-[#68635B]">{stage.duration}</td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab Content 2: Topic-wise Syllabus Breakdown */}
        {activeTab === "topics" && (
          <div className="space-y-4">
            <div className="p-3 bg-[#EEF2FA] rounded-md border border-[#CCD8F0] text-xs text-[#1E3799] flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Official topics prescribed in the employment circular notification. Focus on core high-weightage topics.</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {detailedSyllabus.map((sec, idx) => (
                <div
                  key={idx}
                  className="bg-[#FCFAF4] rounded-lg border border-[#EAE2D2] p-4 shadow-2xs space-y-2.5"
                >
                  <h4 className="font-serif font-bold text-sm text-[#1E3799] border-b border-[#EAE2D2] pb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#1E3799]" />
                    <span>{sec.subject}</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#3E3C38]">
                    {sec.topics.map((t, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E96B15] mt-1.5 shrink-0" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 3: Physical Standards (PET/PST) */}
        {activeTab === "physical" && physicalStandards && (
          <div className="space-y-4">
            <div className="p-3.5 bg-[#FDF3EB] rounded-md border border-[#F9D7C0] text-xs text-[#E96B15] flex items-center gap-2">
              <Activity className="w-4 h-4 shrink-0" />
              <span>Mandatory Physical Standard Test (PST) and Physical Efficiency Test (PET) qualifying benchmarks.</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {physicalStandards.heightMale && (
                <div className="p-4 bg-white rounded-lg border border-[#EAE2D2] shadow-2xs">
                  <span className="text-[10px] uppercase font-mono text-[#68635B] font-bold block">Height Requirement (Male)</span>
                  <span className="font-bold text-base text-[#1A1918] mt-1 block">{physicalStandards.heightMale}</span>
                </div>
              )}

              {physicalStandards.heightFemale && (
                <div className="p-4 bg-white rounded-lg border border-[#EAE2D2] shadow-2xs">
                  <span className="text-[10px] uppercase font-mono text-[#68635B] font-bold block">Height Requirement (Female)</span>
                  <span className="font-bold text-base text-[#1A1918] mt-1 block">{physicalStandards.heightFemale}</span>
                </div>
              )}

              {physicalStandards.chestMale && (
                <div className="p-4 bg-white rounded-lg border border-[#EAE2D2] shadow-2xs">
                  <span className="text-[10px] uppercase font-mono text-[#68635B] font-bold block">Chest Measurement (Male Candidates)</span>
                  <span className="font-bold text-base text-[#1A1918] mt-1 block">{physicalStandards.chestMale}</span>
                </div>
              )}

              {physicalStandards.runningMale && (
                <div className="p-4 bg-white rounded-lg border border-[#EAE2D2] shadow-2xs">
                  <span className="text-[10px] uppercase font-mono text-[#68635B] font-bold block">Running Endurance Test (Male)</span>
                  <span className="font-bold text-base text-[#209948] mt-1 block">{physicalStandards.runningMale}</span>
                </div>
              )}

              {physicalStandards.runningFemale && (
                <div className="p-4 bg-white rounded-lg border border-[#EAE2D2] shadow-2xs">
                  <span className="text-[10px] uppercase font-mono text-[#68635B] font-bold block">Running Endurance Test (Female)</span>
                  <span className="font-bold text-base text-[#209948] mt-1 block">{physicalStandards.runningFemale}</span>
                </div>
              )}

              {physicalStandards.otherCriteria && (
                <div className="p-4 bg-white rounded-lg border border-[#EAE2D2] shadow-2xs col-span-full">
                  <span className="text-[10px] uppercase font-mono text-[#68635B] font-bold block">Medical & Physical Fitness Notes</span>
                  <p className="text-xs text-[#524E48] mt-1">{physicalStandards.otherCriteria}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Content 4: Previous Cut-off Benchmarks Archive */}
        {activeTab === "cutoffs" && (
          <div className="space-y-4">
            <div className="p-3.5 bg-[#EDF7F0] rounded-md border border-[#C6E7D0] text-xs text-[#209948] flex items-center gap-2">
              <Award className="w-4 h-4 shrink-0" />
              <span>Historical benchmark scores to help estimate target score requirements across categories.</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[#EAE2D2] rounded-md overflow-hidden bg-white">
                <thead>
                  <tr className="bg-[#FAF7EC] border-b border-[#EAE2D2] font-mono text-[11px] text-[#68635B] uppercase">
                    <th className="py-2.5 px-4 font-bold text-[#1E3799]">Recruitment Cycle / Year</th>
                    <th className="py-2.5 px-4 font-semibold">Social Category</th>
                    <th className="py-2.5 px-4 font-bold text-center">Cut-off Benchmark</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Max Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE1]">
                  {cutoffs.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#FCFAF4] transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-[#1A1918]">{item.year}</td>
                      <td className="py-3 px-4 font-semibold text-[#1A1918]">{item.category}</td>
                      <td className="py-3 px-4 font-mono font-bold text-center text-[#209948]">{item.score}</td>
                      <td className="py-3 px-4 font-mono text-right text-[#68635B]">{item.maxMarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Key Official Directives & Aspirants Guidance */}
      <div className="bg-white rounded-xl border border-[#EAE2D2] p-6 sm:p-7 shadow-2xs">
        <h3 className="font-serif text-base sm:text-lg font-bold text-[#1A1918] mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#209948]" />
          Official Commission Directives & Candidate Instructions
        </h3>
        <p className="text-xs text-[#68635B] mb-4">
          Crucial conditions, verification rules, and examination hall mandates published in the official circular:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {job.keyHighlights.map((hl, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-3.5 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2] text-xs leading-relaxed text-[#3E3C38]">
              <span className="w-5 h-5 rounded-full bg-[#EDF7F0] text-[#209948] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-[#C6E7D0]">
                ✓
              </span>
              <span className="font-medium text-[#1A1918]">{hl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions (Targets Striking Distance Queries & Rich Snippets) */}
      <section className="bg-white rounded-xl border border-[#EAE2D2] p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="border-b border-[#F2ECE1] pb-3">
          <div className="flex items-center gap-2 mb-1">
            <TricolorCapsule className="w-10 h-1.5" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#1E3799] font-bold">
              Official Aspirants Q&A
            </span>
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1A1918]">
            Frequently Asked Questions — {job.shortTitle}
          </h3>
          <p className="text-xs text-[#68635B]">
            Official answers regarding eligibility, age relaxation, cut-off date, and selection procedure
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group p-3.5 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2] text-xs transition-colors hover:border-[#1E3799]"
            >
              <summary className="font-serif font-bold text-[#1A1918] cursor-pointer flex items-center justify-between gap-3 select-none">
                <span>{faq.question}</span>
                <span className="text-sm font-mono text-[#1E3799] group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-2.5 pt-2.5 border-t border-[#EAE2D2]/60 text-[#423F3A] leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Genuinely Related Opportunities & Alternate Drives (Internal Cross-Linking) */}
      <RelatedOpportunitiesSection currentJob={job} />

      {/* Official PDF Warning & Verification Badge */}
      <div className="p-4 rounded-lg bg-[#FAF7EF] border border-[#EAE2D2] text-xs text-[#68635B] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#209948]" />
          <span>IndiaJobNotice is an independent editorial gazette archive. Please verify circulars against official commission gazettes.</span>
        </div>
        <span className="font-mono text-[10px] text-[#1E3799] font-bold">100% Direct Links</span>
      </div>
    </div>
  );
}
