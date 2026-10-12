import React from "react";
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
  ShieldCheck
} from "lucide-react";
import { JobNotification } from "@/data/jobs";
import { JobStatusBadge } from "./JobStatusBadge";
import { JobLifecycleTracker } from "./JobLifecycleTracker";
import { formatDate, getDaysRemaining } from "@/lib/utils";
import { WhatsAppLogo } from "@/components/common/SocialIcons";
import { TricolorCapsule } from "@/components/common/BrandLogo";
import { getStateBySlug } from "@/config/states";
import { getStateSubdomainUrl, getCentralPortalUrl } from "@/lib/subdomains";

interface Props {
  job: JobNotification;
  stateSlug?: string;
}

export function JobDetailView({ job, stateSlug }: Props) {
  const daysLeft = getDaysRemaining(job.applicationEndDate);
  const stateInfo = job.stateSlug !== "central" ? getStateBySlug(job.stateSlug) : null;

  // Google JobPosting JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": `${job.organization} has released notification for ${job.totalVacancies} vacancies. ${job.keyHighlights.join(". ")}`,
    "datePosted": job.applicationStartDate,
    "validThrough": `${job.applicationEndDate}T23:59:59Z`,
    "employmentType": "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.organization,
      "sameAs": job.officialPdfUrl,
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
        "addressRegion": stateInfo ? stateInfo.name : "India",
      },
    },
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": {
        "@type": "QuantitativeValue",
        "unitText": "MONTH",
      },
    },
    "qualifications": job.qualifications.join(", "),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Google Jobs Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#68635B]">
        <a href={getCentralPortalUrl()} className="hover:text-[#1E3799] font-medium transition-colors">Home</a>
        <span>/</span>
        {stateInfo ? (
          <>
            <a href={getStateSubdomainUrl(stateInfo.slug)} className="hover:text-[#1E3799] font-medium transition-colors">
              {stateInfo.name} Portal
            </a>
            <span>/</span>
          </>
        ) : (
          <>
            <a href={getCentralPortalUrl()} className="hover:text-[#1E3799] font-medium transition-colors">Central Jobs</a>
            <span>/</span>
          </>
        )}
        <span className="text-[#1A1918] font-bold line-clamp-1">{job.shortTitle}</span>
      </nav>

      {/* Main Job Banner Card */}
      <div className="bg-white rounded-xl border border-[#EAE2D2] border-t-4 border-t-[#1E3799] p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
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
          </div>
          <JobStatusBadge status={job.status} />
        </div>

        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#1A1918] leading-tight">
          {job.title}
        </h1>

        <p className="text-sm text-[#68635B] mt-2 font-medium">
          Official Commission / Board: <span className="text-[#1A1918] font-bold">{job.organization}</span>
        </p>

        {/* Action Buttons Bar */}
        <div className="mt-6 pt-6 border-t border-[#F2ECE1] flex flex-wrap items-center gap-3">
          <a
            href={job.applyOnlineUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#E96B15] hover:bg-[#D4590A] text-white font-bold text-sm shadow-xs transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Apply Online (Official Portal)</span>
          </a>

          <a
            href={job.officialPdfUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-[#CCD8F0] hover:border-[#1E3799] bg-[#EEF2FA] hover:bg-[#E0E9F8] text-[#1E3799] font-bold text-sm transition-colors"
          >
            <FileText className="w-4 h-4 text-[#1E3799]" />
            <span>Download Official Gazette PDF</span>
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
      <JobLifecycleTracker job={job} />

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Important Dates */}
        <div className="bg-white rounded-xl border border-[#EAE2D2] p-6 shadow-2xs">
          <h3 className="font-serif text-base font-bold text-[#1A1918] mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#1E3799]" />
            Official Dates Schedule
          </h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-[#F2ECE1]">
              <dt className="text-[#68635B]">Application Opening Date:</dt>
              <dd className="font-bold text-[#1A1918]">{formatDate(job.applicationStartDate)}</dd>
            </div>
            <div className="flex justify-between py-2 border-b border-[#F2ECE1]">
              <dt className="text-[#68635B]">Last Date to Apply:</dt>
              <dd className="font-bold text-[#E96B15]">{formatDate(job.applicationEndDate)}</dd>
            </div>
            {job.admitCardDate && (
              <div className="flex justify-between py-2 border-b border-[#F2ECE1]">
                <dt className="text-[#68635B]">Admit Card Release:</dt>
                <dd className="font-bold text-[#1E3799]">{job.admitCardDate}</dd>
              </div>
            )}
            <div className="flex justify-between py-2">
              <dt className="text-[#68635B]">Scheduled Exam Date:</dt>
              <dd className="font-bold text-[#1A1918]">{job.examDate || "Will be notified by commission"}</dd>
            </div>
          </dl>
        </div>

        {/* Application Fees */}
        <div className="bg-white rounded-xl border border-[#EAE2D2] p-6 shadow-2xs">
          <h3 className="font-serif text-base font-bold text-[#1A1918] mb-4 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-[#209948]" />
            Statutory Application Fees
          </h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-[#F2ECE1]">
              <dt className="text-[#68635B]">General / OBC / EWS:</dt>
              <dd className="font-bold text-[#1A1918]">₹{job.applicationFee.ur_obc_ews}</dd>
            </div>
            <div className="flex justify-between py-2 border-b border-[#F2ECE1]">
              <dt className="text-[#68635B]">SC / ST Candidates:</dt>
              <dd className="font-bold text-[#1A1918]">
                {job.applicationFee.sc_st === 0 ? "Exempted (₹0)" : `₹${job.applicationFee.sc_st}`}
              </dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-[#68635B]">Female / PwD Candidates:</dt>
              <dd className="font-bold text-[#1A1918]">
                {job.applicationFee.female_or_pwd === 0 ? "Exempted (₹0)" : `₹${job.applicationFee.female_or_pwd ?? 0}`}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Eligibility & Age Criteria */}
      <div className="bg-white rounded-xl border border-[#EAE2D2] p-6 sm:p-7 shadow-2xs">
        <h3 className="font-serif text-base sm:text-lg font-bold text-[#1A1918] mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-[#1E3799]" />
          Eligibility Criteria, Age Bracket & Pay Scale
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
            <span className="text-xs text-[#68635B] font-bold block uppercase font-mono">Total Posts</span>
            <span className="text-xl font-serif font-bold text-[#1E3799] mt-1 block">
              {job.totalVacancies.toLocaleString("en-IN")} Posts
            </span>
          </div>

          <div className="p-4 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
            <span className="text-xs text-[#68635B] font-bold block uppercase font-mono">Age Bracket</span>
            <span className="text-base font-bold text-[#1A1918] mt-1 block">
              {job.minAge} to {job.maxAge} Years
            </span>
            <span className="text-xs text-[#209948] font-semibold mt-0.5 block">{job.ageRelaxation}</span>
          </div>

          <div className="p-4 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
            <span className="text-xs text-[#68635B] font-bold block uppercase font-mono">Pay Scale Matrix</span>
            <span className="text-base font-bold text-[#209948] mt-1 block">
              {job.salary}
            </span>
          </div>
        </div>

        <div className="mt-5 p-4 rounded-lg bg-[#EEF2FA] border border-[#CCD8F0]">
          <h4 className="text-xs font-bold text-[#1E3799] uppercase tracking-wider font-mono">Educational Qualifications:</h4>
          <ul className="mt-1.5 list-disc list-inside text-sm text-[#1A1918] space-y-1">
            {job.qualifications.map((q, idx) => (
              <li key={idx} className="font-medium">{q}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Selection Process & Highlights */}
      <div className="bg-white rounded-xl border border-[#EAE2D2] p-6 sm:p-7 shadow-2xs">
        <h3 className="font-serif text-base sm:text-lg font-bold text-[#1A1918] mb-4 flex items-center gap-2">
          <Scale className="w-5 h-5 text-[#E96B15]" />
          Selection Stages & Examination Pattern
        </h3>

        <div className="space-y-2.5 mb-6">
          {job.selectionProcess.map((step, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3.5 rounded-lg bg-[#FCFAF4] text-sm font-semibold text-[#1A1918] border border-[#EAE2D2]">
              <span className="w-6 h-6 rounded-full bg-[#1E3799] text-white font-bold text-xs flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <span>{step}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-[#F2ECE1] pt-4">
          <h4 className="text-xs font-bold uppercase font-mono text-[#68635B] mb-2.5">Official Aspirants Guidance:</h4>
          <ul className="space-y-2 text-xs text-[#524E48]">
            {job.keyHighlights.map((hl, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#209948] shrink-0 mt-0.5" />
                <span>{hl}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Syllabus Overview */}
      <div className="bg-white rounded-xl border border-[#EAE2D2] p-6 sm:p-7 shadow-2xs">
        <h3 className="font-serif text-base sm:text-lg font-bold text-[#1A1918] mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#1E3799]" />
          Syllabus & Pattern Summary
        </h3>
        <p className="text-xs sm:text-sm text-[#1A1918] bg-[#FCFAF4] p-5 rounded-lg border border-[#EAE2D2] leading-relaxed font-medium">
          {job.syllabusSummary}
        </p>
      </div>
    </div>
  );
}
