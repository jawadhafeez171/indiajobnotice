"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Building2,   
  Calendar,  
  FileText, 
  ExternalLink, 
  ArrowLeft, 
  CheckCircle2, 
  BookOpen,  
  ShieldCheck,  
  Bookmark,  
  Layers, 
  Activity, 
  Award, 
  Sparkles
} from "lucide-react";
import { JobNotification } from "@/data/jobs";
import { JobStatusBadge } from "./JobStatusBadge";
import { JobLifecycleTracker } from "./JobLifecycleTracker";
import { formatDate, cn } from "@/lib/utils";
import { WhatsAppLogo, TelegramLogo } from "@/components/common/SocialIcons";
import { TricolorCapsule } from "@/components/common/BrandLogo";
import { getStateBySlug } from "@/config/states";
import { ReservedAdSlot } from "@/components/ads/ReservedAdSlot";
import { useWatchlist } from "@/lib/watchlist";
import { generateGoogleCalendarUrl } from "@/lib/calendar";
import { 
  getJobExamStages, 
  getJobPhysicalStandards, 
  getJobCutoffs, 
  getJobDetailedSyllabus 
} from "@/lib/exam-details";
import { ExecutiveNotificationDigest } from "./ExecutiveNotificationDigest";
import { JobKeyFacts } from "./JobKeyFacts";
import { StageDocumentsPanel } from "./StageDocumentsPanel";
import { ExaminationLifecycleBar } from "./ExaminationLifecycleBar";
import { ClosedRecruitmentAlert } from "./ClosedRecruitmentAlert";
import { JobTaxonomyBar } from "./JobTaxonomyBar";
import { RelatedOpportunitiesSection } from "./RelatedOpportunitiesSection";
import { getJobTaxonomyLinks, RelatedOpportunity } from "@/lib/internal-links";
import { generateJobStructuredData, getJobFaqs } from "@/lib/structured-data";
import { isJobApplicationClosed, getJobVerificationMeta } from "@/data/jobs";

interface Props {
  job: JobNotification;
  stateSlug?: string;
  activeJobs: JobNotification[];
  related: RelatedOpportunity[];
}

type SyllabusTab = "pattern" | "topics" | "physical" | "cutoffs";

export function JobDetailView({ job, stateSlug, activeJobs, related }: Props) {
  const isClosed = isJobApplicationClosed(job);
  const stateInfo = job.stateSlug !== "central" ? getStateBySlug(job.stateSlug) : null;
  const taxonomy = getJobTaxonomyLinks(job);
  const verificationMeta = getJobVerificationMeta(job);
  
  // Watchlist
  const { isSaved, toggleSave, isLoaded } = useWatchlist();
  const saved = isLoaded ? isSaved(job.id) : false;

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

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center justify-between text-xs text-[#4F4A43] print:hidden">
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

        {/* Back to the job list */}
        <Link
          href="/"
          className="text-[#1E3799] hover:underline font-bold flex items-center gap-1 shrink-0 ml-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All jobs</span>
        </Link>
      </nav>

      {/* Header: what, who, and the actions */}
      <div className="bg-white rounded-xl border border-[#D5CAB5] border-t-4 border-t-[#1E3799] p-6 sm:p-8 shadow-2xs print:border-none print:shadow-none print:p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded bg-[#EEF2FA] text-[#1E3799] font-bold text-xs flex items-center gap-1.5 border border-[#CCD8F0]">
              <Building2 className="w-3.5 h-3.5 text-[#1E3799]" />
              {job.orgShortCode}
            </span>
            {job.isCentral ? (
              <span className="text-xs bg-[#EEF2FA] text-[#1E3799] font-bold px-2.5 py-1 rounded border border-[#CCD8F0]">
                Central government
              </span>
            ) : (
              <span className="text-xs bg-[#FDF3EB] text-[#B84D0A] font-bold px-2.5 py-1 rounded border border-[#F9D9C3]">
                {stateInfo?.name}
              </span>
            )}
            <span className="text-xs font-mono text-[#4F4A43] px-2 py-0.5 rounded bg-[#FAF7EF] border border-[#D5CAB5]">
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
                  ? "bg-[#FDF3EB] text-[#B84D0A] border-[#F9D7C0] ring-1 ring-[#E96B15]/20"
                  : "bg-white text-[#4F4A43] border-[#DDD5C7] hover:border-[#1E3799] hover:text-[#1E3799]"
              )}
              title={saved ? "Remove from saved jobs" : "Save this job"}
            >
              <Bookmark className={cn("w-3.5 h-3.5", saved && "fill-[#E96B15]")} />
              <span>{saved ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>

        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#1A1918] leading-tight">
          {job.title}
        </h1>

        <p className="text-sm text-[#1A1918] mt-2 font-semibold">{job.organization}</p>

        {/* The deadline at a glance, before any scrolling */}
        {(job.applicationEndDate || job.totalVacancies > 0) && (
          <p className="mt-2 text-sm text-[#1A1918]">
            {job.applicationEndDate && (
              <strong className={isClosed ? "text-[#4F4A43]" : "text-[#B84D0A]"}>
                {job.isWalkIn ? "Walk-in" : "Last date"} {formatDate(job.applicationEndDate)}
                {isClosed ? " (closed)" : ""}
              </strong>
            )}
            {job.applicationEndDate && job.totalVacancies > 0 && <span className="text-[#A09B90]"> · </span>}
            {job.totalVacancies > 0 && <span>{job.totalVacancies.toLocaleString("en-IN")} posts</span>}
          </p>
        )}

        {/* Where the facts come from */}
        <p className="mt-3 text-xs text-[#4F4A43] flex items-center gap-1.5 flex-wrap">
          <ShieldCheck className="w-3.5 h-3.5 text-[#17803A]" />
          <span>From the official notification</span>
          {verificationMeta.lastVerifiedDate && <span>· Added {verificationMeta.lastVerifiedDate}</span>}
        </p>

        {/* Actions */}
        <div className="mt-6 pt-6 border-t border-[#E2D8C6] flex flex-wrap items-center gap-3 print:hidden">
          {isClosed ? (
            <div className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#FAF7EF] border border-[#DDD5C7] text-[#4F4A43] font-bold text-sm">
              <span>
                🚫 Applications closed{job.applicationEndDate ? ` on ${formatDate(job.applicationEndDate)}` : ""}
              </span>
            </div>
          ) : (
            <a
              href={job.applyOnlineUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#C2510A] hover:bg-[#A9460A] text-white font-bold text-sm shadow-xs transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Apply online</span>
            </a>
          )}

          <a
            href={job.officialPdfUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border-2 border-[#1E3799] bg-white hover:bg-[#EEF2FA] text-[#1E3799] font-bold text-sm transition-colors"
          >
            <FileText className="w-4 h-4 text-[#1E3799]" />
            <span>Official notification</span>
          </a>

          {!isClosed && job.applicationEndDate && (
            <a
              href={deadlineCalendarUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-lg border border-[#D5CAB5] hover:border-[#1E3799] bg-[#FAF7EF] hover:bg-[#EEF2FA] text-[#1A1918] font-semibold text-xs transition-colors"
              title="Add the last date to Google Calendar"
            >
              <Calendar className="w-4 h-4 text-[#1E3799]" />
              <span>Add last date to calendar</span>
            </a>
          )}

          <a
            href="https://t.me/Indiajobnotice1"
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-lg bg-[#24A1DE] text-white hover:bg-[#1D8FCA] transition-colors shadow-xs ml-auto"
            title="Get new jobs on our Telegram channel"
          >
            <TelegramLogo className="w-5 h-5" />
          </a>

          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check ${job.title} on IndiaJobNotice.com: ${job.applyOnlineUrl}`)}`}
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-lg bg-[#25D366] text-white hover:bg-[#20BA5A] transition-colors shadow-xs"
            title="Share on WhatsApp"
          >
            <WhatsAppLogo className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Last date, posts, eligibility, fee */}
      <JobKeyFacts job={job} />

      {/* Where the recruitment stands, and its official documents */}
      <div className="print:hidden">
        <JobLifecycleTracker job={job} />
      </div>
      <StageDocumentsPanel job={job} />
      <ExaminationLifecycleBar job={job} activeStage="notice" stateSlug={stateSlug} />

      {/* Closed Recruitment Notice & Active Opportunities Banner (not for exams under way) */}
      {isClosed && !job.inProgress && (
        <ClosedRecruitmentAlert job={job} stateSlug={stateSlug} activeJobs={activeJobs} />
      )}

      {/* Posts, category-wise fees and relaxations, selection process (when the notice gives them) */}
      <ExecutiveNotificationDigest job={job} />

      {/* Reserved Ad Space in Job Details (CLS Protected) */}
      <ReservedAdSlot slotType="leaderboard" slotId={`job-detail-${job.slug}`} className="print:hidden" />

      {/* ================= COMPREHENSIVE EXAM PATTERN & SYLLABUS SECTION ================= */}
      {examStages.length > 0 || detailedSyllabus.length > 0 ? (
        <section className="bg-white rounded-xl border border-[#D5CAB5] p-6 sm:p-7 shadow-2xs space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TricolorCapsule className="w-12 h-1.5" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#1E3799] font-bold">
                Official Scheme of Examination
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1918]">
              Detailed Exam Pattern, Syllabus & Standards
            </h2>
            <p className="text-xs text-[#4F4A43] mt-1">
              Stage-wise marks breakdown, negative marking rules, topic list, physical efficiency criteria, and historical cut-offs.
            </p>
          </div>
  
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-[#D5CAB5] overflow-x-auto pb-px text-xs font-bold print:hidden">
            <button
              onClick={() => setActiveTab("pattern")}
              className={cn(
                "py-2.5 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === "pattern"
                  ? "border-[#1E3799] text-[#1E3799] bg-[#EEF2FA]/50 rounded-t"
                  : "border-transparent text-[#4F4A43] hover:text-[#1A1918]"
              )}
            >
              <Layers className="w-4 h-4" />
              <span>Stage-wise Exam Pattern</span>
              <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-[#EEF2FA] text-[#1E3799]">
                {examStages.length}
              </span>
            </button>
  
            <button
              onClick={() => setActiveTab("topics")}
              className={cn(
                "py-2.5 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === "topics"
                  ? "border-[#1E3799] text-[#1E3799] bg-[#EEF2FA]/50 rounded-t"
                  : "border-transparent text-[#4F4A43] hover:text-[#1A1918]"
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
                    ? "border-[#E96B15] text-[#B84D0A] bg-[#FDF3EB]/50 rounded-t"
                    : "border-transparent text-[#4F4A43] hover:text-[#1A1918]"
                )}
              >
                <Activity className="w-4 h-4 text-[#B84D0A]" />
                <span>Physical Standards (PET/PST)</span>
              </button>
            )}
  
            <button
              onClick={() => setActiveTab("cutoffs")}
              className={cn(
                "py-2.5 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === "cutoffs"
                  ? "border-[#209948] text-[#17803A] bg-[#EDF7F0]/50 rounded-t"
                  : "border-transparent text-[#4F4A43] hover:text-[#1A1918]"
              )}
            >
              <Award className="w-4 h-4 text-[#17803A]" />
              <span>Previous Year Cut-offs</span>
            </button>
          </div>
  
          {/* Tab Content 1: Stage-wise Exam Pattern Tables */}
          {(activeTab === "pattern" || typeof window === "undefined") && (
            <div className="space-y-6">
              {examStages.map((stage, idx) => (
                <div
                  key={idx}
                  className="bg-[#FCFAF4] rounded-lg border border-[#D5CAB5] p-5 shadow-2xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D5CAB5] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#1E3799] text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#1A1918]">
                        {stage.stageName}
                      </h3>
                    </div>
  
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[12px] font-mono font-bold px-2 py-0.5 rounded bg-[#EEF2FA] text-[#1E3799] border border-[#CCD8F0]">
                        Mode: {stage.mode}
                      </span>
                      <span className="text-[12px] font-mono font-bold px-2 py-0.5 rounded bg-[#FAF7EF] text-[#4F4A43] border border-[#DDD5C7]">
                        Duration: {stage.duration}
                      </span>
                    </div>
                  </div>
  
                  {/* Rules Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-3 rounded-md border border-[#D5CAB5]">
                    {stage.negativeMarking && (
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-[#C41C1C]">Negative Marking:</span>
                        <span className="text-[#3F3B35]">{stage.negativeMarking}</span>
                      </div>
                    )}
                    {stage.qualifyingCriteria && (
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-[#1E3799]">Criteria:</span>
                        <span className="text-[#3F3B35]">{stage.qualifyingCriteria}</span>
                      </div>
                    )}
                  </div>
  
                  {/* Subject Breakdown Table */}
                  {stage.subjects.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border border-[#D5CAB5] rounded-md overflow-hidden bg-white">
                        <thead>
                          <tr className="bg-[#FAF7EC] border-b border-[#D5CAB5] font-mono text-[12px] text-[#4F4A43] uppercase">
                            <th className="py-2.5 px-3 font-bold text-[#1E3799]">Subject / Section</th>
                            <th className="py-2.5 px-3 font-semibold text-center">Questions</th>
                            <th className="py-2.5 px-3 font-semibold text-center">Maximum Marks</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Timing</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2D8C6]">
                          {stage.subjects.map((sub, sIdx) => (
                            <tr key={sIdx} className="hover:bg-[#FCFAF4] transition-colors">
                              <td className="py-2.5 px-3 font-medium text-[#1A1918]">{sub.name}</td>
                              <td className="py-2.5 px-3 font-mono text-center text-[#3F3B35]">{sub.questions > 0 ? sub.questions : "—"}</td>
                              <td className="py-2.5 px-3 font-mono font-bold text-center text-[#1E3799]">{sub.marks > 0 ? sub.marks : "Qualifying"}</td>
                              <td className="py-2.5 px-3 font-mono text-right text-[#4F4A43]">{sub.durationMinutes ? `${sub.durationMinutes} mins` : "Composite"}</td>
                            </tr>
                          ))}
                        </tbody>
                        {stage.totalMarks > 0 && (
                          <tfoot>
                            <tr className="bg-[#FAF7EC] font-bold border-t border-[#D5CAB5] font-mono text-xs">
                              <td className="py-2.5 px-3 text-[#1A1918]">Total Scheme</td>
                              <td className="py-2.5 px-3 text-center text-[#1A1918]">{stage.totalQuestions > 0 ? stage.totalQuestions : "—"} Qs</td>
                              <td className="py-2.5 px-3 text-center text-[#1E3799]">{stage.totalMarks} Marks</td>
                              <td className="py-2.5 px-3 text-right text-[#4F4A43]">{stage.duration}</td>
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
                    className="bg-[#FCFAF4] rounded-lg border border-[#D5CAB5] p-4 shadow-2xs space-y-2.5"
                  >
                    <h4 className="font-serif font-bold text-sm text-[#1E3799] border-b border-[#D5CAB5] pb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#1E3799]" />
                      <span>{sec.subject}</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-[#3E3C38]">
                      {sec.topics.map((t, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C2510A] mt-1.5 shrink-0" />
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
              <div className="p-3.5 bg-[#FDF3EB] rounded-md border border-[#F9D7C0] text-xs text-[#B84D0A] flex items-center gap-2">
                <Activity className="w-4 h-4 shrink-0" />
                <span>Mandatory Physical Standard Test (PST) and Physical Efficiency Test (PET) qualifying benchmarks.</span>
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {physicalStandards.heightMale && (
                  <div className="p-4 bg-white rounded-lg border border-[#D5CAB5] shadow-2xs">
                    <span className="text-[11px] uppercase font-mono text-[#4F4A43] font-bold block">Height Requirement (Male)</span>
                    <span className="font-bold text-base text-[#1A1918] mt-1 block">{physicalStandards.heightMale}</span>
                  </div>
                )}
  
                {physicalStandards.heightFemale && (
                  <div className="p-4 bg-white rounded-lg border border-[#D5CAB5] shadow-2xs">
                    <span className="text-[11px] uppercase font-mono text-[#4F4A43] font-bold block">Height Requirement (Female)</span>
                    <span className="font-bold text-base text-[#1A1918] mt-1 block">{physicalStandards.heightFemale}</span>
                  </div>
                )}
  
                {physicalStandards.chestMale && (
                  <div className="p-4 bg-white rounded-lg border border-[#D5CAB5] shadow-2xs">
                    <span className="text-[11px] uppercase font-mono text-[#4F4A43] font-bold block">Chest Measurement (Male Candidates)</span>
                    <span className="font-bold text-base text-[#1A1918] mt-1 block">{physicalStandards.chestMale}</span>
                  </div>
                )}
  
                {physicalStandards.runningMale && (
                  <div className="p-4 bg-white rounded-lg border border-[#D5CAB5] shadow-2xs">
                    <span className="text-[11px] uppercase font-mono text-[#4F4A43] font-bold block">Running Endurance Test (Male)</span>
                    <span className="font-bold text-base text-[#17803A] mt-1 block">{physicalStandards.runningMale}</span>
                  </div>
                )}
  
                {physicalStandards.runningFemale && (
                  <div className="p-4 bg-white rounded-lg border border-[#D5CAB5] shadow-2xs">
                    <span className="text-[11px] uppercase font-mono text-[#4F4A43] font-bold block">Running Endurance Test (Female)</span>
                    <span className="font-bold text-base text-[#17803A] mt-1 block">{physicalStandards.runningFemale}</span>
                  </div>
                )}
  
                {physicalStandards.otherCriteria && (
                  <div className="p-4 bg-white rounded-lg border border-[#D5CAB5] shadow-2xs col-span-full">
                    <span className="text-[11px] uppercase font-mono text-[#4F4A43] font-bold block">Medical & Physical Fitness Notes</span>
                    <p className="text-xs text-[#3F3B35] mt-1">{physicalStandards.otherCriteria}</p>
                  </div>
                )}
              </div>
            </div>
          )}
  
          {/* Tab Content 4: Previous Cut-off Benchmarks Archive */}
          {activeTab === "cutoffs" && (
            <div className="space-y-4">
              <div className="p-3.5 bg-[#EDF7F0] rounded-md border border-[#C6E7D0] text-xs text-[#17803A] flex items-center gap-2">
                <Award className="w-4 h-4 shrink-0" />
                <span>Historical benchmark scores to help estimate target score requirements across categories.</span>
              </div>
  
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-[#D5CAB5] rounded-md overflow-hidden bg-white">
                  <thead>
                    <tr className="bg-[#FAF7EC] border-b border-[#D5CAB5] font-mono text-[12px] text-[#4F4A43] uppercase">
                      <th className="py-2.5 px-4 font-bold text-[#1E3799]">Recruitment Cycle / Year</th>
                      <th className="py-2.5 px-4 font-semibold">Social Category</th>
                      <th className="py-2.5 px-4 font-bold text-center">Cut-off Benchmark</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Max Marks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2D8C6]">
                    {cutoffs.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#FCFAF4] transition-colors">
                        <td className="py-3 px-4 font-mono font-semibold text-[#1A1918]">{item.year}</td>
                        <td className="py-3 px-4 font-semibold text-[#1A1918]">{item.category}</td>
                        <td className="py-3 px-4 font-mono font-bold text-center text-[#17803A]">{item.score}</td>
                        <td className="py-3 px-4 font-mono text-right text-[#4F4A43]">{item.maxMarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      ) : null}

      {/* Key points from the notification */}
      {job.keyHighlights.length > 0 && (
      <div className="bg-white rounded-xl border border-[#D5CAB5] p-6 sm:p-7 shadow-2xs">
        <h3 className="font-serif text-base sm:text-lg font-bold text-[#1A1918] mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#17803A]" />
          Key points from the notification
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {job.keyHighlights.map((hl, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-3.5 rounded-lg bg-[#FCFAF4] border border-[#D5CAB5] text-xs leading-relaxed text-[#3E3C38]">
              <span className="w-5 h-5 rounded-full bg-[#EDF7F0] text-[#17803A] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-[#C6E7D0]">
                ✓
              </span>
              <span className="font-medium text-[#1A1918]">{hl}</span>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Common questions (also given to search engines as FAQ data) */}
      <section className="bg-white rounded-xl border border-[#D5CAB5] p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="border-b border-[#E2D8C6] pb-3">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1A1918]">
            Questions about {job.shortTitle}
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group p-3.5 rounded-lg bg-[#FCFAF4] border border-[#D5CAB5] text-xs transition-colors hover:border-[#1E3799]"
            >
              <summary className="font-serif font-bold text-[#1A1918] cursor-pointer flex items-center justify-between gap-3 select-none">
                <span>{faq.question}</span>
                <span className="text-sm font-mono text-[#1E3799] group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-2.5 pt-2.5 border-t border-[#D5CAB5]/60 text-[#423F3A] leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Similar jobs, then more jobs by state, qualification and organisation */}
      <RelatedOpportunitiesSection currentJob={job} related={related} />
      <JobTaxonomyBar job={job} />

      <p className="p-4 rounded-lg bg-[#FAF7EF] border border-[#D5CAB5] text-xs text-[#4F4A43] flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-[#17803A] shrink-0" />
        <span>
          IndiaJobNotice is not a government website. These details are taken from the official
          notification; check the notification itself before you apply.
        </span>
      </p>
    </div>
  );
}
