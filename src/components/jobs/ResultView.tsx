import React from "react";
import Link from "next/link";
import { JobNotification, getActiveOpportunities } from "@/data/jobs";
import { getJobCutoffs } from "@/lib/exam-details";
import { formatDate } from "@/lib/utils";
import { ExaminationLifecycleBar } from "./ExaminationLifecycleBar";
import { 
  Award, 
  ArrowLeft, 
  ExternalLink, 
  Calendar, 
  FileCheck2, 
  Download, 
  FileText,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Briefcase
} from "lucide-react";

interface Props {
  job: JobNotification;
  stateSlug?: string;
}

export function ResultView({ job, stateSlug }: Props) {
  const parentUrl = job.isCentral || !stateSlug || stateSlug === "central"
    ? `/jobs/${job.slug}`
    : `/state/${stateSlug}/jobs/${job.slug}`;

  const isDeclared = job.status === "RESULT_OUT" || Boolean(job.resultDate && job.resultDate.toLowerCase().includes("declared"));
  const cutoffs = getJobCutoffs(job);
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
          <span className="text-[#1A1918] font-bold">Result & Merit List</span>
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
      <ExaminationLifecycleBar job={job} activeStage="result" stateSlug={stateSlug} />

      {/* Main Result Header Banner */}
      <div className="bg-white rounded-xl border border-[#EAE2D2] border-t-4 border-t-[#209948] p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-[#EDF7F0] text-[#209948] font-bold text-xs flex items-center gap-1.5 border border-[#C6E7D0]">
              <Building2 className="w-3.5 h-3.5" />
              {job.orgShortCode}
            </span>
            <span className="text-xs font-mono text-[#68635B] px-2 py-0.5 rounded bg-[#FAF7EF] border border-[#EAE2D2]">
              {job.category}
            </span>
          </div>
          <span className={isDeclared ? "px-2.5 py-1 rounded font-bold text-xs bg-[#EDF7F0] text-[#209948] border border-[#C6E7D0]" : "px-2.5 py-1 rounded font-bold text-xs bg-[#EEF2FA] text-[#1E3799] border border-[#CCD8F0]"}>
            {isDeclared ? "● Official Result & Merit List Declared" : "● Result Under Evaluation"}
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1918] leading-tight">
          {job.shortTitle} Result 2026 - Selected Candidates Merit List PDF & Cut-Off Marks
        </h1>
        <p className="text-sm text-[#68635B] mt-1 font-medium">
          Conducting Authority: <span className="text-[#1A1918] font-bold">{job.organization}</span>
        </p>

        {/* Timetable Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-[#F2ECE1]">
          <div className="p-3.5 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
            <span className="text-[10px] font-mono uppercase text-[#68635B] block font-bold">Result Status</span>
            <span className="font-serif text-base font-bold text-[#209948] mt-0.5 block">
              {job.resultDate || (isDeclared ? "Declared Online" : "Post-Exam Compilation")}
            </span>
          </div>
          <div className="p-3.5 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
            <span className="text-[10px] font-mono uppercase text-[#68635B] block font-bold">Total Posts</span>
            <span className="font-serif text-base font-bold text-[#1E3799] mt-0.5 block">
              {job.totalVacancies.toLocaleString("en-IN")} Vacancies
            </span>
          </div>
          <div className="p-3.5 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2]">
            <span className="text-[10px] font-mono uppercase text-[#68635B] block font-bold">Selection Stages</span>
            <span className="font-bold text-xs text-[#1A1918] mt-0.5 block">
              {job.selectionProcess.join(" → ")}
            </span>
          </div>
        </div>

        {/* Direct Action */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={job.applyOnlineUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#209948] hover:bg-[#1B803C] text-white font-bold text-sm shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Download Selected Merit List PDF</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href={job.applyOnlineUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-[#CCD8F0] hover:border-[#1E3799] bg-[#EEF2FA] text-[#1E3799] font-bold text-sm transition-colors"
          >
            <Award className="w-4 h-4 text-[#1E3799]" />
            <span>Check Individual Scorecard Login</span>
          </a>
        </div>
      </div>

      {/* Official Qualifying Cut-off Marks Table */}
      <div className="bg-white rounded-xl border border-[#EAE2D2] p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#F2ECE1] pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#209948]" />
            <div>
              <h2 className="font-serif text-lg font-bold text-[#1A1918]">
                Category-Wise Official Qualifying Cut-Off Marks
              </h2>
              <p className="text-xs text-[#68635B]">
                Minimum normalized score required to qualify for the next stage / final appointment
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-[#209948] bg-[#EDF7F0] px-2.5 py-1 rounded border border-[#C6E7D0] shrink-0 self-start sm:self-auto">
            Standard Normalized Marks
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#EAE2D2]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#FAF7EF] border-b border-[#EAE2D2] font-mono text-[11px] uppercase tracking-wider text-[#68635B]">
              <tr>
                <th className="py-3 px-3.5 font-bold">Recruitment Cycle / Stage</th>
                <th className="py-3 px-3.5 font-bold">Social Category</th>
                <th className="py-3 px-3.5 font-bold text-center">Qualifying Cut-off Score</th>
                <th className="py-3 px-3.5 font-bold text-right">Maximum Marks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE1] text-[#1A1918]">
              {cutoffs.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#FCFAF4] transition-colors">
                  <td className="py-3 px-3.5 font-mono font-semibold text-[#1A1918]">
                    {item.year}
                  </td>
                  <td className="py-3 px-3.5 font-bold text-[#1E3799]">
                    {item.category}
                  </td>
                  <td className="py-3 px-3.5 font-mono font-bold text-center text-[#209948]">
                    {item.score}
                  </td>
                  <td className="py-3 px-3.5 font-mono text-right text-[#68635B]">
                    {item.maxMarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Next Stages & Document Verification Checklist */}
      <div className="bg-white rounded-xl border border-[#EAE2D2] p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#F2ECE1] pb-3">
          <ShieldCheck className="w-5 h-5 text-[#1E3799]" />
          <div>
            <h3 className="font-serif text-base font-bold text-[#1A1918]">Directives for Shortlisted Candidates (Document Verification)</h3>
            <p className="text-xs text-[#68635B]">Mandatory original certificates required during commission verification round</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2] space-y-1">
            <span className="font-bold text-[#1A1918] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#209948]" />
              Matriculation (10th) Certificate
            </span>
            <p className="text-[#524E48]">Mandatory proof for date of birth and candidate & father&apos;s name spelling matching application form.</p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2] space-y-1">
            <span className="font-bold text-[#1A1918] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#209948]" />
              Qualifying Degree / Diploma Marksheets
            </span>
            <p className="text-[#524E48]">All semester marksheets and provisional / original degree certificate issued before crucial date.</p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2] space-y-1">
            <span className="font-bold text-[#1A1918] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#209948]" />
              Caste / Category Certificate (OBC/SC/ST/EWS)
            </span>
            <p className="text-[#524E48]">Prescribed Central/State Government format. OBC-NCL and EWS certificates must be of the valid financial year.</p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2] space-y-1">
            <span className="font-bold text-[#1A1918] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#209948]" />
              No Objection Certificate (NOC)
            </span>
            <p className="text-[#524E48]">Mandatory for candidates already employed in Central / State Government departments or PSUs.</p>
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
