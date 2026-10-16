"use client";

import React from "react";
import Link from "next/link";
import { JobNotification, isJobApplicationClosed, getJobAgeCutoffDate } from "@/data/jobs";
import { formatDate } from "@/lib/utils";
import { getJobFaqs } from "@/lib/structured-data";
import { ExaminationLifecycleBar } from "./ExaminationLifecycleBar";
import { EligibilityCalculator } from "@/components/eligibility/EligibilityCalculator";
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  ArrowLeft, 
  ExternalLink, 
  Building2, 
  CheckCircle2, 
  FileText,
  HelpCircle,
  Award,
  Users
} from "lucide-react";
import { getJobCategoryMatrix } from "@/lib/exam-details";
import { getStateReservationRules } from "@/config/state-reservations";
import { TricolorCapsule } from "@/components/common/BrandLogo";

interface Props {
  job: JobNotification;
  stateSlug?: string;
}

export function EligibilityView({ job, stateSlug }: Props) {
  const basePrefix = job.isCentral || !stateSlug || stateSlug === "central"
    ? `/jobs/${job.slug}`
    : `/state/${stateSlug}/jobs/${job.slug}`;

  const cutoffDate = getJobAgeCutoffDate(job);
  const isClosed = isJobApplicationClosed(job);
  const faqs = getJobFaqs(job);
  const categoryMatrix = getJobCategoryMatrix(job);
  const stateRules = getStateReservationRules(job.isCentral ? "central" : (job.stateSlug || "central"));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center justify-between text-xs text-[#68635B]">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-[#1E3799] font-medium transition-colors">Home</Link>
          <span>/</span>
          <Link href={basePrefix} className="hover:text-[#1E3799] font-medium transition-colors">{job.shortTitle}</Link>
          <span>/</span>
          <span className="text-[#1A1918] font-bold">Age Limit & Qualification</span>
        </div>

        <Link
          href={basePrefix}
          className="text-[#1E3799] hover:underline font-bold flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Gazette Notice</span>
        </Link>
      </nav>

      {/* Prominent Back Link Banner to Master Notice */}
      <div className="bg-[#EEF2FA] border border-[#CCD8F0] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <FileText className="w-4 h-4 text-[#1E3799] shrink-0" />
          <span className="text-[#1E3799] font-medium">
            Viewing dedicated statutory eligibility & age criteria for {job.shortTitle}.
          </span>
        </div>
        <Link
          href={basePrefix}
          className="px-3 py-1.5 rounded-md bg-[#1E3799] text-white font-bold hover:bg-[#15286D] transition-colors shrink-0 self-start sm:self-auto text-center"
        >
          View Full Gazette & Syllabus →
        </Link>
      </div>

      {/* 5-Stage Lifecycle Navigation Bar */}
      <ExaminationLifecycleBar job={job} activeStage="eligibility" stateSlug={stateSlug} />

      {/* Main Eligibility Header Banner */}
      <div className="bg-white rounded-xl border border-[#EAE2D2] border-t-4 border-t-[#1E3799] p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded bg-[#EEF2FA] text-[#1E3799] font-bold text-xs flex items-center gap-1.5 border border-[#CCD8F0]">
              <Building2 className="w-3.5 h-3.5" />
              {job.orgShortCode}
            </span>
            <span className="text-xs font-mono text-[#68635B] px-2 py-0.5 rounded bg-[#FAF7EF] border border-[#EAE2D2]">
              {job.category}
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-[#E96B15] bg-[#FDF3EB] px-2.5 py-1 rounded border border-[#F9D9C3]">
            Crucial Cut-off Date: {formatDate(cutoffDate)}
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#1A1918] leading-tight">
          {job.shortTitle} 2026 Age Limit, Cut-off Date & Educational Qualification
        </h1>

        <p className="text-sm text-[#524E48] leading-relaxed">
          Official statutory eligibility criteria, minimum educational qualification, post-wise degree requirements, and category-wise age relaxations for {job.organization} ({job.totalVacancies.toLocaleString("en-IN")} Posts).
        </p>

        {/* Quick Statutory Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#F2ECE1] text-xs">
          <div className="p-3 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
            <span className="text-[10px] font-mono uppercase text-[#68635B] block font-semibold">Minimum Age</span>
            <span className="font-mono font-bold text-lg text-[#1A1918]">{job.minAge} Years</span>
          </div>

          <div className="p-3 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
            <span className="text-[10px] font-mono uppercase text-[#68635B] block font-semibold">Max Age (General / UR)</span>
            <span className="font-mono font-bold text-lg text-[#1A1918]">{job.maxAge} Years</span>
          </div>

          <div className="p-3 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
            <span className="text-[10px] font-mono uppercase text-[#68635B] block font-semibold">Crucial Cut-off Date</span>
            <span className="font-mono font-bold text-xs text-[#E96B15] block mt-1">{formatDate(cutoffDate)}</span>
          </div>

          <div className="p-3 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
            <span className="text-[10px] font-mono uppercase text-[#68635B] block font-semibold">Total Vacancies</span>
            <span className="font-mono font-bold text-lg text-[#209948]">{job.totalVacancies.toLocaleString("en-IN")} Posts</span>
          </div>
        </div>
      </div>

      {/* Category-Wise Age Relaxation Table (State-Specific & Central) */}
      <section className="bg-white rounded-xl border border-[#EAE2D2] p-6 shadow-2xs space-y-4">
        <div className="border-b border-[#F2ECE1] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#1A1918]">
              {stateRules.stateSlug === "central" 
                ? "Central Statutory Age Relaxation Matrix" 
                : `${stateRules.stateName} State Reservation & Age Relaxation Matrix`}
            </h2>
            <p className="text-xs text-[#68635B]">
              Calculated on the official cut-off date ({formatDate(cutoffDate)}) as mandated by the gazette
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#1E3799] font-bold px-2.5 py-1 rounded bg-[#EEF2FA] border border-[#CCD8F0] shrink-0 self-start sm:self-auto">
            {stateRules.stateSlug === "central" ? "Government of India Norms" : `${stateRules.stateName} Civil Services Rules`}
          </span>
        </div>

        {/* Out-of-State Domicile Notice for State Recruitments */}
        {stateRules.stateSlug !== "central" && (
          <div className="p-3.5 rounded-lg bg-[#FAF7EF] border border-[#DDD5C7] text-xs text-[#524E48] space-y-1">
            <span className="font-bold text-[#1A1918] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#1E3799]" />
              Official Domicile & Caste Reservation Policy:
            </span>
            <p className="leading-relaxed">
              {stateRules.domicileRule}
            </p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-[#EAE2D2] rounded-lg overflow-hidden bg-white">
            <thead>
              <tr className="bg-[#FAF7EC] border-b border-[#EAE2D2] font-mono text-[11px] text-[#68635B] uppercase">
                <th className="py-2.5 px-4 font-bold text-[#1E3799]">Social Category / Class</th>
                <th className="py-2.5 px-4 font-bold text-center">Permissible Age Relaxation</th>
                <th className="py-2.5 px-4 font-bold text-center">Effective Upper Age Limit</th>
                <th className="py-2.5 px-4 font-semibold">Statutory Rules & Exemption Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE1]">
              {categoryMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#FCFAF4] transition-colors">
                  <td className="py-3 px-4 font-bold text-[#1A1918]">
                    <span>{item.category}</span>
                    <span className="font-mono text-[10px] text-[#68635B] block font-normal">
                      Code: {item.code}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-[#209948]">
                    {item.ageRelaxation}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-[#1E3799]">
                    {item.maxEligibleAge}
                  </td>
                  <td className="py-3 px-4 text-[#68635B]">
                    {item.exemptionNote || "Standard verification requirements apply"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Special Quotas Badges */}
        {stateRules.specialQuotas.length > 0 && (
          <div className="pt-2 flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono font-bold text-[#68635B] uppercase">
              Special Quota Provisions:
            </span>
            {stateRules.specialQuotas.map((q) => (
              <span
                key={q.id}
                className="px-2.5 py-1 rounded bg-[#EEF2FA] border border-[#CCD8F0] text-[#1E3799] text-[11px] font-semibold"
                title={q.eligibilityCondition}
              >
                {q.name} {q.percentage ? `(${q.percentage}%)` : ""}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Post-Wise Educational Qualifications Section */}
      <section className="bg-white rounded-xl border border-[#EAE2D2] p-6 shadow-2xs space-y-4">
        <div className="border-b border-[#F2ECE1] pb-3">
          <h2 className="font-serif text-lg font-bold text-[#1A1918]">
            Educational Qualification & Branch Requirements
          </h2>
          <p className="text-xs text-[#68635B]">
            Mandatory degree recognition, final year student rules, and post-wise criteria
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#FCFAF4] border border-[#EAE2D2] space-y-2">
            <span className="font-bold text-[#1E3799] block font-mono uppercase text-[10px]">
              Minimum Prescribed Qualification
            </span>
            <ul className="space-y-1.5 text-[#3E3C38]">
              {job.qualifications.map((q, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#209948] shrink-0 mt-0.5" />
                  <span className="font-medium text-[#1A1918]">{q}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#FCFAF4] border border-[#EAE2D2] space-y-2">
            <span className="font-bold text-[#E96B15] block font-mono uppercase text-[10px]">
              Crucial Educational Verification Conditions
            </span>
            <ul className="space-y-1.5 text-[#524E48] leading-relaxed">
              <li>• The degree/diploma must be awarded by a recognized University / Board established by Central or State Act.</li>
              <li>• Final year candidates may apply only if the qualifying examination result is declared on or before the document verification date.</li>
              <li>• Equivalence certificates must be produced if the degree title differs from the gazetted discipline.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pre-Configured Interactive Eligibility Calculator */}
      <div>
        <EligibilityCalculator defaultJobId={job.id} />
      </div>

      {/* Aspirants Q&A FAQ Accordion */}
      <section className="bg-white rounded-xl border border-[#EAE2D2] p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="border-b border-[#F2ECE1] pb-3">
          <h3 className="font-serif text-lg font-bold text-[#1A1918]">
            Frequently Asked Questions on Eligibility — {job.shortTitle}
          </h3>
          <p className="text-xs text-[#68635B]">
            Official answers regarding age relaxation, cut-off date, and selection procedure
          </p>
        </div>

        <div className="space-y-2.5">
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
    </div>
  );
}
