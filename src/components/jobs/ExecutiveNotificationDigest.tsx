import React from "react";
import Link from "next/link";
import { JobNotification, isJobApplicationClosed } from "@/data/jobs";
import { 
  getJobPostBreakdown, 
  getJobAgeReckoning, 
  getJobCategoryMatrix, 
  getJobCorrigendum, 
  getJobPayBreakdown,
  PostVacancyBreakdown,
  CategoryStatutoryMatrixItem 
} from "@/lib/exam-details";
import { formatDate, getDaysRemaining } from "@/lib/utils";
import { TricolorCapsule } from "@/components/common/BrandLogo";
import { 
  AlertCircle, 
  Calendar, 
  Clock, 
  GraduationCap, 
  IndianRupee, 
  FileText, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Briefcase, 
  BellRing,
  HelpCircle,
  FileCheck
} from "lucide-react";

interface Props {
  job: JobNotification;
}

export function ExecutiveNotificationDigest({ job }: Props) {
  const isClosed = isJobApplicationClosed(job);
  const postBreakdowns = getJobPostBreakdown(job);
  const ageReckoning = getJobAgeReckoning(job);
  const categoryMatrix = getJobCategoryMatrix(job);
  const corrigendum = getJobCorrigendum(job);
  const payBreakdown = getJobPayBreakdown(job);
  const daysLeft = getDaysRemaining(job.applicationEndDate);

  return (
    <section className="space-y-6" id="executive-summary">
      {/* 1. DATED CORRIGENDUM / EXTENSION NOTICE (HIGH-PRIORITY ALERT) */}
      {corrigendum && (
        <div className="rounded-xl bg-[#FDF3EB] border-2 border-[#E96B15]/40 p-4 sm:p-5 text-xs text-[#524E48] shadow-xs">
          <div className="flex items-start gap-3">
            <span className="p-1.5 rounded-md bg-[#E96B15] text-white shrink-0 mt-0.5">
              <BellRing className="w-4 h-4" />
            </span>
            <div className="space-y-1 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#E96B15] text-white">
                    {corrigendum.type} Notice
                  </span>
                  <span className="font-mono text-[11px] text-[#68635B] font-semibold">
                    Notified Date: {corrigendum.noticeDate}
                  </span>
                </div>
                {corrigendum.officialGazetteRef && (
                  <span className="font-mono text-[10px] text-[#1E3799] font-bold">
                    Ref: {corrigendum.officialGazetteRef}
                  </span>
                )}
              </div>
              <h4 className="font-serif text-sm sm:text-base font-bold text-[#1A1918]">
                {corrigendum.headline}
              </h4>
              <p className="text-xs text-[#524E48] leading-relaxed">
                {corrigendum.details}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. EXECUTIVE 4-TILE CRUCIAL DATA MATRIX */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Tile 1: Crucial Date for Age Calculation */}
        <div className="bg-white rounded-xl border border-[#EAE2D2] p-4 shadow-2xs border-l-4 border-l-[#1E3799]">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Calendar className="w-4 h-4 text-[#1E3799]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#68635B]">
              Age Reckoning Date
            </span>
          </div>
          <span className="font-serif text-base sm:text-lg font-bold text-[#1A1918] block">
            As on {ageReckoning.crucialDate}
          </span>
          <span className="text-[11px] text-[#209948] font-semibold mt-1 block">
            Base: {job.minAge} to {job.maxAge} Years
          </span>
          <span className="text-[10px] font-mono text-[#68635B] block mt-0.5 line-clamp-1" title={ageReckoning.bornBetween}>
            {ageReckoning.bornBetween}
          </span>
        </div>

        {/* Tile 2: Application Deadline & Live Timer */}
        <div className="bg-white rounded-xl border border-[#EAE2D2] p-4 shadow-2xs border-l-4 border-l-[#E96B15]">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#E96B15]" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#68635B]">
                {isClosed ? "Application Window" : "Application Deadline"}
              </span>
            </div>
            {isClosed ? (
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#FAF7EF] text-[#68635B] border border-[#DDD5C7]">
                Closed
              </span>
            ) : daysLeft > 0 ? (
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#FDF3EB] text-[#E96B15]">
                {daysLeft}d left
              </span>
            ) : null}
          </div>
          <span className="font-serif text-base sm:text-lg font-bold text-[#E96B15] block">
            {isClosed ? `Closed: ${formatDate(job.applicationEndDate)}` : formatDate(job.applicationEndDate)}
          </span>
          <span className="text-[11px] text-[#68635B] mt-1 block">
            Opened: {formatDate(job.applicationStartDate)}
          </span>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {!isClosed ? (
              <>
                <a
                  href={job.applyOnlineUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-[#1E3799] font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>Apply Online</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-[#DDD5C7] text-xs">|</span>
              </>
            ) : (
              <span className="text-[11px] font-mono text-[#68635B] font-semibold">
                Registrations Ended |
              </span>
            )}
            <a
              href={job.officialPdfUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-[#E96B15] font-bold hover:underline inline-flex items-center gap-1"
            >
              <FileText className="w-3 h-3" />
              <span>Official PDF</span>
            </a>
          </div>
        </div>

        {/* Tile 3: Total Vacancies & Scope */}
        <div className="bg-white rounded-xl border border-[#EAE2D2] p-4 shadow-2xs border-l-4 border-l-[#209948]">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Briefcase className="w-4 h-4 text-[#209948]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#68635B]">
              Total Vacancies
            </span>
          </div>
          <span className="font-serif text-base sm:text-lg font-bold text-[#1A1918] block">
            {job.totalVacancies.toLocaleString("en-IN")} Posts
          </span>
          <span className="text-[11px] text-[#1E3799] font-semibold mt-1 block">
            {postBreakdowns.length} Distinct Cadres
          </span>
          <span className="text-[10px] font-mono text-[#68635B] block mt-0.5">
            {job.isCentral ? "All-India Central Drive" : `${job.stateSlug.toUpperCase()} State Drive`}
          </span>
        </div>

        {/* Tile 4: Pay Scale & In-Hand Salary */}
        <div className="bg-white rounded-xl border border-[#EAE2D2] p-4 shadow-2xs border-l-4 border-l-[#1E3799]">
          <div className="flex items-center gap-1.5 mb-1.5">
            <IndianRupee className="w-4 h-4 text-[#1E3799]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#68635B]">
              Pay Scale & In-Hand
            </span>
          </div>
          <span className="font-serif text-sm sm:text-base font-bold text-[#1A1918] block truncate" title={job.salary}>
            {payBreakdown.basicPay}
          </span>
          <span className="text-[11px] text-[#209948] font-bold mt-1 block">
            {payBreakdown.inHandEstimated}
          </span>
          <span className="text-[10px] font-mono text-[#68635B] block mt-0.5">
            7th CPC 53% DA + HRA
          </span>
        </div>
      </div>

      {/* 2B. OFFICIAL DATES & EXAMINATION SCHEDULE BAR */}
      <div className="bg-[#FAF7EF] rounded-xl border border-[#EAE2D2] p-4 text-xs">
        <div className="flex items-center justify-between mb-3 border-b border-[#EAE2D2] pb-2">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#1E3799]" />
            <span className="font-serif font-bold text-sm text-[#1A1918]">Official Examination & Recruitment Schedule</span>
          </div>
          <span className="font-mono text-[10px] uppercase font-bold text-[#68635B] bg-white px-2 py-0.5 rounded border border-[#EAE2D2]">
            Gazette Verified
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-2.5 rounded border border-[#EAE2D2]">
            <span className="text-[10px] font-mono uppercase text-[#68635B] block font-bold">Applications Open</span>
            <span className="font-bold text-[#1A1918] mt-0.5 block">{formatDate(job.applicationStartDate)}</span>
          </div>
          <div className="bg-white p-2.5 rounded border border-[#EAE2D2]">
            <span className="text-[10px] font-mono uppercase text-[#E96B15] block font-bold">Last Date to Apply</span>
            <span className="font-bold text-[#E96B15] mt-0.5 block">{formatDate(job.applicationEndDate)}</span>
          </div>
          <div className="bg-white p-2.5 rounded border border-[#EAE2D2]">
            <span className="text-[10px] font-mono uppercase text-[#1E3799] block font-bold">Admit Card Release</span>
            <span className="font-bold text-[#1E3799] mt-0.5 block">{job.admitCardDate || "To be released on portal"}</span>
          </div>
          <div className="bg-white p-2.5 rounded border border-[#EAE2D2]">
            <span className="text-[10px] font-mono uppercase text-[#209948] block font-bold">Exam Date / Window</span>
            <span className="font-bold text-[#1A1918] mt-0.5 block">{job.examDate || "Will be notified by commission"}</span>
          </div>
        </div>
      </div>

      {/* 3. POST-WISE QUALIFICATION & VACANCY BREAKDOWN TABLE */}
      {/* Answers directly: "which qualifications qualify for which posts" */}
      <div className="bg-white rounded-xl border border-[#EAE2D2] p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#F2ECE1] pb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#1E3799]" />
            <div>
              <h2 className="font-serif text-lg font-bold text-[#1A1918]">
                Post-Wise Vacancy & Educational Qualification Breakdown
              </h2>
              <p className="text-xs text-[#68635B]">
                Official mapping of which degree, diploma, or certificate qualifies for which designated post
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-[#1E3799] bg-[#EEF2FA] px-2.5 py-1 rounded border border-[#CCD8F0] shrink-0 self-start sm:self-auto">
            {postBreakdowns.length} Distinct Cadres
          </span>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-lg border border-[#EAE2D2]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#FAF7EF] border-b border-[#EAE2D2] font-mono text-[11px] uppercase tracking-wider text-[#68635B]">
              <tr>
                <th className="py-3 px-3.5 font-bold">Designated Post Name</th>
                <th className="py-3 px-3.5 font-bold">Department / Cadre</th>
                <th className="py-3 px-3.5 font-bold min-w-[200px]">Eligible Qualification Requirements</th>
                <th className="py-3 px-3.5 font-bold text-center">Vacancies</th>
                <th className="py-3 px-3.5 font-bold">Age Bracket</th>
                <th className="py-3 px-3.5 font-bold">Pay Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE1] text-[#1A1918]">
              {postBreakdowns.map((post: PostVacancyBreakdown, idx: number) => (
                <tr key={idx} className="hover:bg-[#FCFAF4] transition-colors">
                  <td className="py-3 px-3.5 font-bold text-[#1E3799] align-top">
                    {post.postName}
                  </td>
                  <td className="py-3 px-3.5 text-[#524E48] align-top">
                    {post.department}
                  </td>
                  <td className="py-3 px-3.5 align-top">
                    <span className="font-medium text-[#1A1918] bg-[#EEF2FA]/70 px-2 py-0.5 rounded border border-[#CCD8F0]/60 inline-block leading-relaxed">
                      {post.qualification}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 font-mono font-bold text-center text-[#209948] align-top">
                    {typeof post.vacancies === "number" ? post.vacancies.toLocaleString("en-IN") : post.vacancies}
                  </td>
                  <td className="py-3 px-3.5 font-mono text-[#524E48] align-top whitespace-nowrap">
                    {post.ageLimit}
                  </td>
                  <td className="py-3 px-3.5 font-mono font-semibold text-[#1A1918] align-top whitespace-nowrap">
                    {post.payLevel}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. CATEGORY-WISE STATUTORY MATRIX (FEES, AGE RELAXATIONS & CUTOFF RULES) */}
      <div className="bg-white rounded-xl border border-[#EAE2D2] p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#F2ECE1] pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#209948]" />
            <div>
              <h2 className="font-serif text-lg font-bold text-[#1A1918]">
                Category-Wise Statutory Fees & Age Relaxation Matrix
              </h2>
              <p className="text-xs text-[#68635B]">
                Government prescribed fees, age concessions, and certificate verification requirements
              </p>
            </div>
          </div>
          <Link
            href="/calculator"
            className="text-xs font-bold text-[#E96B15] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Verify DOB on Age Calculator</span>
            <span>→</span>
          </Link>
        </div>

        {/* Matrix Grid / Table */}
        <div className="overflow-x-auto rounded-lg border border-[#EAE2D2]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#FAF7EF] border-b border-[#EAE2D2] font-mono text-[11px] uppercase tracking-wider text-[#68635B]">
              <tr>
                <th className="py-3 px-3.5 font-bold">Category</th>
                <th className="py-3 px-3.5 font-bold">Code</th>
                <th className="py-3 px-3.5 font-bold">Statutory Fee</th>
                <th className="py-3 px-3.5 font-bold">Upper Age Relaxation</th>
                <th className="py-3 px-3.5 font-bold">Maximum Age</th>
                <th className="py-3 px-3.5 font-bold">Statutory Concession Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE1] text-[#1A1918]">
              {categoryMatrix.map((item: CategoryStatutoryMatrixItem, idx: number) => (
                <tr key={idx} className="hover:bg-[#FCFAF4] transition-colors">
                  <td className="py-3 px-3.5 font-bold text-[#1A1918]">
                    {item.category}
                  </td>
                  <td className="py-3 px-3.5 font-mono text-[11px] font-bold text-[#1E3799]">
                    <span className="px-1.5 py-0.5 rounded bg-[#EEF2FA] border border-[#CCD8F0]">
                      {item.code}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 font-mono font-bold text-[#209948]">
                    {item.fee}
                  </td>
                  <td className="py-3 px-3.5 font-semibold text-[#E96B15]">
                    {item.ageRelaxation}
                  </td>
                  <td className="py-3 px-3.5 font-mono font-bold text-[#1A1918]">
                    {item.maxEligibleAge}
                  </td>
                  <td className="py-3 px-3.5 text-[#524E48] text-[11px]">
                    {item.exemptionNote}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. SELECTION PROCESS ROADMAP */}
      <div className="bg-white rounded-xl border border-[#EAE2D2] p-5 sm:p-6 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 border-b border-[#F2ECE1] pb-2.5">
          <Layers className="w-5 h-5 text-[#1E3799]" />
          <div>
            <h3 className="font-serif text-base font-bold text-[#1A1918]">
              Official Selection Process Stages
            </h3>
            <p className="text-xs text-[#68635B]">
              Sequential evaluation hurdles from initial screening to final gazette appointment
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          {job.selectionProcess.map((step, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2] flex flex-col justify-between"
            >
              <div>
                <span className="w-5 h-5 rounded-full bg-[#1E3799] text-white font-mono text-[11px] font-bold flex items-center justify-center mb-2">
                  {idx + 1}
                </span>
                <span className="font-semibold text-xs text-[#1A1918] block leading-snug">
                  {step}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#209948] font-bold mt-2 block">
                {idx === 0 ? "Mandatory Screening" : idx === job.selectionProcess.length - 1 ? "Final Merit Stage" : "Qualifying Stage"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
