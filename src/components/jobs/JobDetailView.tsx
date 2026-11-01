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
      <nav aria-label="Breadcrumb" className="flex items-center justify-between text-xs text-muted print:hidden">
        <ol className="flex items-center flex-wrap gap-1.5 list-none p-0 m-0">
          {taxonomy.breadcrumbTrail.map((crumb, idx) => {
            const isLast = idx === taxonomy.breadcrumbTrail.length - 1;
            return (
              <li key={idx} className="flex items-center gap-1.5">
                {idx > 0 && <span className="text-faint">/</span>}
                {isLast ? (
                  <span className="text-ink font-bold line-clamp-1" aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="hover:text-navy font-medium transition-colors"
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
          className="text-navy hover:underline font-bold flex items-center gap-1 shrink-0 ml-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All jobs</span>
        </Link>
      </nav>

      {/* Header: what, who, and the actions */}
      <div className="bg-surface rounded-xl border border-line border-t-4 border-t-navy p-6 sm:p-8 shadow-2xs print:border-none print:shadow-none print:p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded bg-navy-tint text-navy font-bold text-xs flex items-center gap-1.5 border border-navy-line">
              <Building2 className="w-3.5 h-3.5 text-navy" />
              {job.orgShortCode}
            </span>
            {job.isCentral ? (
              <span className="text-xs bg-navy-tint text-navy font-bold px-2.5 py-1 rounded border border-navy-line">
                Central government
              </span>
            ) : (
              <span className="text-xs bg-saffron-tint text-saffron font-bold px-2.5 py-1 rounded border border-saffron-line">
                {stateInfo?.name}
              </span>
            )}
            <span className="text-xs font-mono text-muted px-2 py-0.5 rounded bg-subtle border border-line">
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
                  ? "bg-saffron-tint text-saffron border-saffron-line ring-1 ring-saffron-bright/20"
                  : "bg-surface text-muted border-line hover:border-navy hover:text-navy"
              )}
              title={saved ? "Remove from saved jobs" : "Save this job"}
            >
              <Bookmark className={cn("w-3.5 h-3.5", saved && "fill-saffron-bright")} />
              <span>{saved ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>

        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-ink leading-tight">
          {job.title}
        </h1>

        <p className="text-sm text-ink mt-2 font-semibold">{job.organization}</p>

        {/* The deadline at a glance, before any scrolling */}
        {(job.applicationEndDate || job.totalVacancies > 0) && (
          <p className="mt-2 text-sm text-ink">
            {job.applicationEndDate && (
              <strong className={isClosed ? "text-muted" : "text-saffron"}>
                {job.isWalkIn ? "Walk-in" : "Last date"} {formatDate(job.applicationEndDate)}
                {isClosed ? " (closed)" : ""}
              </strong>
            )}
            {job.applicationEndDate && job.totalVacancies > 0 && <span className="text-faint"> · </span>}
            {job.totalVacancies > 0 && <span>{job.totalVacancies.toLocaleString("en-IN")} posts</span>}
          </p>
        )}

        {/* Where the facts come from */}
        <p className="mt-3 text-xs text-muted flex items-center gap-1.5 flex-wrap">
          <ShieldCheck className="w-3.5 h-3.5 text-green" />
          <span>From the official notification</span>
          {verificationMeta.lastVerifiedDate && <span>· Added {verificationMeta.lastVerifiedDate}</span>}
        </p>

        {/* Actions */}
        <div className="mt-6 pt-6 border-t border-line-soft flex flex-wrap items-center gap-3 print:hidden">
          {isClosed ? (
            <div className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-subtle border border-line text-muted font-bold text-sm">
              <span>
                🚫 Applications closed{job.applicationEndDate ? ` on ${formatDate(job.applicationEndDate)}` : ""}
              </span>
            </div>
          ) : (
            <a
              href={job.applyOnlineUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-saffron-solid hover:bg-saffron-strong text-white font-bold text-sm shadow-xs transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Apply online</span>
            </a>
          )}

          <a
            href={job.officialPdfUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border-2 border-navy bg-surface hover:bg-navy-tint text-navy font-bold text-sm transition-colors"
          >
            <FileText className="w-4 h-4 text-navy" />
            <span>Official notification</span>
          </a>

          {!isClosed && job.applicationEndDate && (
            <a
              href={deadlineCalendarUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-lg border border-line hover:border-navy bg-subtle hover:bg-navy-tint text-ink font-semibold text-xs transition-colors"
              title="Add the last date to Google Calendar"
            >
              <Calendar className="w-4 h-4 text-navy" />
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
        <section className="bg-surface rounded-xl border border-line p-6 sm:p-7 shadow-2xs space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TricolorCapsule className="w-12 h-1.5" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-navy font-bold">
                Official Scheme of Examination
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink">
              Detailed Exam Pattern, Syllabus & Standards
            </h2>
            <p className="text-xs text-muted mt-1">
              Stage-wise marks breakdown, negative marking rules, topic list, physical efficiency criteria, and historical cut-offs.
            </p>
          </div>
  
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-line overflow-x-auto pb-px text-xs font-bold print:hidden">
            <button
              onClick={() => setActiveTab("pattern")}
              className={cn(
                "py-2.5 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === "pattern"
                  ? "border-navy text-navy bg-navy-tint/50 rounded-t"
                  : "border-transparent text-muted hover:text-ink"
              )}
            >
              <Layers className="w-4 h-4" />
              <span>Stage-wise Exam Pattern</span>
              <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-navy-tint text-navy">
                {examStages.length}
              </span>
            </button>
  
            <button
              onClick={() => setActiveTab("topics")}
              className={cn(
                "py-2.5 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === "topics"
                  ? "border-navy text-navy bg-navy-tint/50 rounded-t"
                  : "border-transparent text-muted hover:text-ink"
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
                    ? "border-saffron-bright text-saffron bg-saffron-tint/50 rounded-t"
                    : "border-transparent text-muted hover:text-ink"
                )}
              >
                <Activity className="w-4 h-4 text-saffron" />
                <span>Physical Standards (PET/PST)</span>
              </button>
            )}
  
            <button
              onClick={() => setActiveTab("cutoffs")}
              className={cn(
                "py-2.5 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === "cutoffs"
                  ? "border-green text-green bg-green-tint/50 rounded-t"
                  : "border-transparent text-muted hover:text-ink"
              )}
            >
              <Award className="w-4 h-4 text-green" />
              <span>Previous Year Cut-offs</span>
            </button>
          </div>
  
          {/* Tab Content 1: Stage-wise Exam Pattern Tables */}
          {(activeTab === "pattern" || typeof window === "undefined") && (
            <div className="space-y-6">
              {examStages.map((stage, idx) => (
                <div
                  key={idx}
                  className="bg-subtle rounded-lg border border-line p-5 shadow-2xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-navy-solid text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-ink">
                        {stage.stageName}
                      </h3>
                    </div>
  
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[12px] font-mono font-bold px-2 py-0.5 rounded bg-navy-tint text-navy border border-navy-line">
                        Mode: {stage.mode}
                      </span>
                      <span className="text-[12px] font-mono font-bold px-2 py-0.5 rounded bg-subtle text-muted border border-line">
                        Duration: {stage.duration}
                      </span>
                    </div>
                  </div>
  
                  {/* Rules Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-surface p-3 rounded-md border border-line">
                    {stage.negativeMarking && (
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-danger">Negative Marking:</span>
                        <span className="text-ink-2">{stage.negativeMarking}</span>
                      </div>
                    )}
                    {stage.qualifyingCriteria && (
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-navy">Criteria:</span>
                        <span className="text-ink-2">{stage.qualifyingCriteria}</span>
                      </div>
                    )}
                  </div>
  
                  {/* Subject Breakdown Table */}
                  {stage.subjects.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border border-line rounded-md overflow-hidden bg-surface">
                        <thead>
                          <tr className="bg-subtle border-b border-line font-mono text-[12px] text-muted uppercase">
                            <th className="py-2.5 px-3 font-bold text-navy">Subject / Section</th>
                            <th className="py-2.5 px-3 font-semibold text-center">Questions</th>
                            <th className="py-2.5 px-3 font-semibold text-center">Maximum Marks</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Timing</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-line-soft">
                          {stage.subjects.map((sub, sIdx) => (
                            <tr key={sIdx} className="hover:bg-subtle transition-colors">
                              <td className="py-2.5 px-3 font-medium text-ink">{sub.name}</td>
                              <td className="py-2.5 px-3 font-mono text-center text-ink-2">{sub.questions > 0 ? sub.questions : "—"}</td>
                              <td className="py-2.5 px-3 font-mono font-bold text-center text-navy">{sub.marks > 0 ? sub.marks : "Qualifying"}</td>
                              <td className="py-2.5 px-3 font-mono text-right text-muted">{sub.durationMinutes ? `${sub.durationMinutes} mins` : "Composite"}</td>
                            </tr>
                          ))}
                        </tbody>
                        {stage.totalMarks > 0 && (
                          <tfoot>
                            <tr className="bg-subtle font-bold border-t border-line font-mono text-xs">
                              <td className="py-2.5 px-3 text-ink">Total Scheme</td>
                              <td className="py-2.5 px-3 text-center text-ink">{stage.totalQuestions > 0 ? stage.totalQuestions : "—"} Qs</td>
                              <td className="py-2.5 px-3 text-center text-navy">{stage.totalMarks} Marks</td>
                              <td className="py-2.5 px-3 text-right text-muted">{stage.duration}</td>
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
              <div className="p-3 bg-navy-tint rounded-md border border-navy-line text-xs text-navy flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Official topics prescribed in the employment circular notification. Focus on core high-weightage topics.</span>
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {detailedSyllabus.map((sec, idx) => (
                  <div
                    key={idx}
                    className="bg-subtle rounded-lg border border-line p-4 shadow-2xs space-y-2.5"
                  >
                    <h4 className="font-serif font-bold text-sm text-navy border-b border-line pb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-navy" />
                      <span>{sec.subject}</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-ink-2">
                      {sec.topics.map((t, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-saffron-solid mt-1.5 shrink-0" />
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
              <div className="p-3.5 bg-saffron-tint rounded-md border border-saffron-line text-xs text-saffron flex items-center gap-2">
                <Activity className="w-4 h-4 shrink-0" />
                <span>Mandatory Physical Standard Test (PST) and Physical Efficiency Test (PET) qualifying benchmarks.</span>
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {physicalStandards.heightMale && (
                  <div className="p-4 bg-surface rounded-lg border border-line shadow-2xs">
                    <span className="text-[11px] uppercase font-mono text-muted font-bold block">Height Requirement (Male)</span>
                    <span className="font-bold text-base text-ink mt-1 block">{physicalStandards.heightMale}</span>
                  </div>
                )}
  
                {physicalStandards.heightFemale && (
                  <div className="p-4 bg-surface rounded-lg border border-line shadow-2xs">
                    <span className="text-[11px] uppercase font-mono text-muted font-bold block">Height Requirement (Female)</span>
                    <span className="font-bold text-base text-ink mt-1 block">{physicalStandards.heightFemale}</span>
                  </div>
                )}
  
                {physicalStandards.chestMale && (
                  <div className="p-4 bg-surface rounded-lg border border-line shadow-2xs">
                    <span className="text-[11px] uppercase font-mono text-muted font-bold block">Chest Measurement (Male Candidates)</span>
                    <span className="font-bold text-base text-ink mt-1 block">{physicalStandards.chestMale}</span>
                  </div>
                )}
  
                {physicalStandards.runningMale && (
                  <div className="p-4 bg-surface rounded-lg border border-line shadow-2xs">
                    <span className="text-[11px] uppercase font-mono text-muted font-bold block">Running Endurance Test (Male)</span>
                    <span className="font-bold text-base text-green mt-1 block">{physicalStandards.runningMale}</span>
                  </div>
                )}
  
                {physicalStandards.runningFemale && (
                  <div className="p-4 bg-surface rounded-lg border border-line shadow-2xs">
                    <span className="text-[11px] uppercase font-mono text-muted font-bold block">Running Endurance Test (Female)</span>
                    <span className="font-bold text-base text-green mt-1 block">{physicalStandards.runningFemale}</span>
                  </div>
                )}
  
                {physicalStandards.otherCriteria && (
                  <div className="p-4 bg-surface rounded-lg border border-line shadow-2xs col-span-full">
                    <span className="text-[11px] uppercase font-mono text-muted font-bold block">Medical & Physical Fitness Notes</span>
                    <p className="text-xs text-ink-2 mt-1">{physicalStandards.otherCriteria}</p>
                  </div>
                )}
              </div>
            </div>
          )}
  
          {/* Tab Content 4: Previous Cut-off Benchmarks Archive */}
          {activeTab === "cutoffs" && (
            <div className="space-y-4">
              <div className="p-3.5 bg-green-tint rounded-md border border-green-line text-xs text-green flex items-center gap-2">
                <Award className="w-4 h-4 shrink-0" />
                <span>Historical benchmark scores to help estimate target score requirements across categories.</span>
              </div>
  
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-line rounded-md overflow-hidden bg-surface">
                  <thead>
                    <tr className="bg-subtle border-b border-line font-mono text-[12px] text-muted uppercase">
                      <th className="py-2.5 px-4 font-bold text-navy">Recruitment Cycle / Year</th>
                      <th className="py-2.5 px-4 font-semibold">Social Category</th>
                      <th className="py-2.5 px-4 font-bold text-center">Cut-off Benchmark</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Max Marks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line-soft">
                    {cutoffs.map((item, idx) => (
                      <tr key={idx} className="hover:bg-subtle transition-colors">
                        <td className="py-3 px-4 font-mono font-semibold text-ink">{item.year}</td>
                        <td className="py-3 px-4 font-semibold text-ink">{item.category}</td>
                        <td className="py-3 px-4 font-mono font-bold text-center text-green">{item.score}</td>
                        <td className="py-3 px-4 font-mono text-right text-muted">{item.maxMarks}</td>
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
      <div className="bg-surface rounded-xl border border-line p-6 sm:p-7 shadow-2xs">
        <h3 className="font-serif text-base sm:text-lg font-bold text-ink mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green" />
          Key points from the notification
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {job.keyHighlights.map((hl, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-3.5 rounded-lg bg-subtle border border-line text-xs leading-relaxed text-ink-2">
              <span className="w-5 h-5 rounded-full bg-green-tint text-green font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-green-line">
                ✓
              </span>
              <span className="font-medium text-ink">{hl}</span>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Common questions (also given to search engines as FAQ data) */}
      <section className="bg-surface rounded-xl border border-line p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="border-b border-line-soft pb-3">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-ink">
            Questions about {job.shortTitle}
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group p-3.5 rounded-lg bg-subtle border border-line text-xs transition-colors hover:border-navy"
            >
              <summary className="font-serif font-bold text-ink cursor-pointer flex items-center justify-between gap-3 select-none">
                <span>{faq.question}</span>
                <span className="text-sm font-mono text-navy group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-2.5 pt-2.5 border-t border-line/60 text-ink-2 leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Similar jobs, then more jobs by state, qualification and organisation */}
      <RelatedOpportunitiesSection currentJob={job} related={related} />
      <JobTaxonomyBar job={job} />

      <p className="p-4 rounded-lg bg-subtle border border-line text-xs text-muted flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-green shrink-0" />
        <span>
          IndiaJobNotice is not a government website. These details are taken from the official
          notification; check the notification itself before you apply.
        </span>
      </p>
    </div>
  );
}
