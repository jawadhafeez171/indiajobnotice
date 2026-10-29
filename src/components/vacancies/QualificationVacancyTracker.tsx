"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { JobNotification, isJobApplicationClosed, formatAgeRange } from "@/data/jobs";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { formatDate, getDaysRemaining, cn } from "@/lib/utils";
import { TricolorCapsule } from "@/components/common/BrandLogo";
import { 
  GraduationCap, 
  Building2, 
  Users, 
  Briefcase, 
  ArrowRight, 
  Printer, 
  Download, 
  Share2, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  Layers, 
  Calendar,
  Code
} from "lucide-react";

export interface QualificationTier {
  id: string;
  label: string;
  shortLabel: string;
  badge: string;
  description: string;
  matcher: (job: JobNotification) => boolean;
  hubUrl: string;
}

export const QUALIFICATION_TIERS: QualificationTier[] = [
  {
    id: "all",
    label: "All Education Streams",
    shortLabel: "All Streams",
    badge: "Consolidated Tracker",
    description: "Complete cross-sector government recruitment vacancies across India",
    matcher: () => true,
    hubUrl: "/vacancies",
  },
  {
    id: "graduate",
    label: "Graduation (Bachelor's Degree in Any Discipline)",
    shortLabel: "Graduate (Any Stream)",
    badge: "Degree Cadre",
    description: "Premier officer appointments, civil service commissions, bank PO, and administrative cadres",
    matcher: (job) => {
      const q = job.qualifications.join(" ").toLowerCase();
      const t = job.title.toLowerCase();
      return q.includes("graduate") || q.includes("degree") || q.includes("bachelor") || t.includes("cgl") || t.includes("po");
    },
    hubUrl: "/qualification/graduate",
  },
  {
    id: "engineering",
    label: "B.Tech / B.E. / Engineering Degree",
    shortLabel: "Engineering (B.Tech)",
    badge: "Technical Cadre",
    description: "Assistant Engineer (AE), engineering executive, and central technical gazette posts",
    matcher: (job) => {
      const q = job.qualifications.join(" ").toLowerCase();
      const t = job.title.toLowerCase();
      return q.includes("engineering") || q.includes("b.tech") || q.includes("b.e.") || job.category === "Engineering / Technical";
    },
    hubUrl: "/engineering-jobs",
  },
  {
    id: "diploma",
    label: "Polytechnic / Diploma in Engineering",
    shortLabel: "Diploma / Polytechnic",
    badge: "Technical Diploma",
    description: "Junior Engineer (JE), technical supervisor, and state board engineering posts",
    matcher: (job) => {
      const q = job.qualifications.join(" ").toLowerCase();
      const t = job.title.toLowerCase();
      return q.includes("diploma") || q.includes("polytechnic") || t.includes("je") || t.includes("junior engineer");
    },
    hubUrl: "/qualification/diploma",
  },
  {
    id: "12th-pass",
    label: "12th Pass (10+2 / Intermediate)",
    shortLabel: "12th Pass (10+2)",
    badge: "Higher Secondary",
    description: "Clerical assistants, data entry operators, police constables, and stenographers",
    matcher: (job) => {
      const q = job.qualifications.join(" ").toLowerCase();
      const t = job.title.toLowerCase();
      return q.includes("12th") || q.includes("10+2") || q.includes("intermediate") || t.includes("chsl") || t.includes("constable");
    },
    hubUrl: "/qualification/12th-pass",
  },
  {
    id: "10th-pass",
    label: "10th Pass (Matriculation / High School)",
    shortLabel: "10th Matric",
    badge: "Matriculation",
    description: "Multi-Tasking Staff (MTS), railway Group D, armed police constables, and tradesmen",
    matcher: (job) => {
      const q = job.qualifications.join(" ").toLowerCase();
      const t = job.title.toLowerCase();
      return q.includes("10th") || q.includes("matric") || q.includes("high school") || t.includes("mts") || t.includes("group d");
    },
    hubUrl: "/qualification/10th-pass",
  },
];

export function QualificationVacancyTracker({ jobs }: { jobs: JobNotification[] }) {
  const [selectedTierId, setSelectedTierId] = useState<string>("all");
  const [activeOnly, setActiveOnly] = useState<boolean>(true);

  const currentTier = useMemo(() => {
    return QUALIFICATION_TIERS.find((t) => t.id === selectedTierId) || QUALIFICATION_TIERS[0];
  }, [selectedTierId]);

  // Aggregate metrics across all tiers
  const tierStats = useMemo(() => {
    return QUALIFICATION_TIERS.map((tier) => {
      const matching = jobs.filter((job) => {
        if (activeOnly && isJobApplicationClosed(job)) return false;
        return tier.matcher(job);
      });
      const totalVacancies = matching.reduce((sum, j) => sum + (j.totalVacancies || 0), 0);
      return {
        ...tier,
        jobCount: matching.length,
        totalVacancies,
      };
    });
  }, [activeOnly, jobs]);

  // Jobs matching selected tier
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (activeOnly && isJobApplicationClosed(job)) return false;
      return currentTier.matcher(job);
    }).sort((a, b) => b.totalVacancies - a.totalVacancies);
  }, [currentTier, activeOnly, jobs]);

  const totalFilteredVacancies = useMemo(() => {
    return filteredJobs.reduce((sum, j) => sum + (j.totalVacancies || 0), 0);
  }, [filteredJobs]);

  return (
    <div className="space-y-8">
      {/* Top Controls & Institutional Print Button */}
      <div className="bg-white rounded-xl border border-[#EAE2D2] p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F2ECE1] pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#1E3799] font-bold block mb-1">
              Real-Time Gazette Data
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1918]">
              Qualification-Wise Vacancy Breakdown
            </h2>
            <p className="text-xs text-[#68635B] mt-0.5">
              Filter government jobs by educational criteria. Used by college placement cells, coaching faculties, and public library desks.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-lg bg-[#1E3799] hover:bg-[#15286D] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Campus Notice Board Bulletin</span>
            </button>
          </div>
        </div>

        {/* Live Qualification Tier Metric Cards */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {tierStats.map((tier) => {
            const isSelected = tier.id === selectedTierId;
            return (
              <button
                key={tier.id}
                onClick={() => setSelectedTierId(tier.id)}
                className={cn(
                  "p-3 rounded-lg border text-left transition-all flex flex-col justify-between group",
                  isSelected
                    ? "bg-[#EEF2FA] border-[#1E3799] ring-2 ring-[#1E3799]/20 shadow-2xs"
                    : "bg-[#FCFAF4] border-[#EAE2D2] hover:bg-white hover:border-[#CCD8F0]"
                )}
              >
                <div>
                  <span className={cn(
                    "text-[10px] font-mono uppercase font-bold block mb-1 truncate",
                    isSelected ? "text-[#1E3799]" : "text-[#68635B]"
                  )}>
                    {tier.shortLabel}
                  </span>
                  <span className="font-serif font-bold text-lg text-[#1A1918] block leading-tight">
                    {tier.totalVacancies.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-[#68635B] block mt-0.5">
                    Vacancies
                  </span>
                </div>

                <div className="mt-2.5 pt-2 border-t border-[#EAE2D2]/60 flex items-center justify-between text-[10px] font-bold">
                  <span className={isSelected ? "text-[#1E3799]" : "text-[#524E48]"}>
                    {tier.jobCount} Gazettes
                  </span>
                  <ArrowRight className={cn(
                    "w-3 h-3 transition-transform",
                    isSelected ? "text-[#1E3799] translate-x-0.5" : "text-[#A09B90] group-hover:translate-x-0.5"
                  )} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Toggle & Summary Bar */}
        <div className="mt-4 pt-4 border-t border-[#F2ECE1] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1A1918]">Showing:</span>
            <span className="px-2.5 py-0.5 rounded bg-[#EEF2FA] text-[#1E3799] font-bold border border-[#CCD8F0]">
              {currentTier.label}
            </span>
            <span className="text-[#68635B]">
              ({totalFilteredVacancies.toLocaleString("en-IN")} Total Posts in {filteredJobs.length} Drives)
            </span>
          </div>

          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer text-[#423F3A]">
            <input
              type="checkbox"
              checked={activeOnly}
              onChange={(e) => setActiveOnly(e.target.checked)}
              className="rounded border-[#DDD5C7] text-[#1E3799] focus:ring-[#1E3799]"
            />
            <span>Active & Upcoming Openings Only</span>
          </label>
        </div>
      </div>

      {/* Vacancy Table / Printable Gazette Listing */}
      <div className="bg-white rounded-xl border border-[#EAE2D2] p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#EAE2D2] pb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#1E3799]" />
            <h3 className="font-serif text-base sm:text-lg font-bold text-[#1A1918]">
              {currentTier.label} — Live Recruitment Openings
            </h3>
          </div>

          {currentTier.id !== "all" && (
            <Link
              href={currentTier.hubUrl}
              className="text-xs font-bold text-[#1E3799] hover:underline flex items-center gap-1"
            >
              <span>Permanent {currentTier.shortLabel} Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-10 text-xs text-[#68635B] bg-[#FCFAF4] rounded-lg border border-[#EAE2D2]">
            No active positions currently open under this qualification tier. Check upcoming gazettes on the{" "}
            <Link href="/calendar" className="text-[#1E3799] font-bold hover:underline">
              Exam Calendar
            </Link>.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#EAE2D2] rounded-lg overflow-hidden bg-white">
              <thead>
                <tr className="bg-[#FAF7EC] border-b border-[#EAE2D2] font-mono text-[11px] text-[#68635B] uppercase">
                  <th className="py-3 px-4 font-bold text-[#1E3799]">Recruiting Commission & Post</th>
                  <th className="py-3 px-4 font-bold text-center">Vacancies</th>
                  <th className="py-3 px-4 font-semibold">Eligibility Details</th>
                  <th className="py-3 px-4 font-semibold">Pay Scale</th>
                  <th className="py-3 px-4 font-semibold">Deadline</th>
                  <th className="py-3 px-4 font-bold text-right print:hidden">Direct Gazette</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE1]">
                {filteredJobs.map((job) => {
                  const jobHref = job.isCentral
                    ? `/jobs/${job.slug}`
                    : `/state/${job.stateSlug}/jobs/${job.slug}`;

                  const daysLeft = getDaysRemaining(job.applicationEndDate);

                  return (
                    <tr key={job.id} className="hover:bg-[#FCFAF4] transition-colors">
                      {/* Commission & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EEF2FA] text-[#1E3799] border border-[#CCD8F0]">
                            {job.orgShortCode}
                          </span>
                          <JobStatusBadge status={job.status} />
                        </div>
                        <Link href={jobHref} className="font-serif font-bold text-xs text-[#1A1918] hover:text-[#1E3799] block leading-snug">
                          {job.title}
                        </Link>
                        <span className="text-[10px] text-[#68635B] block mt-0.5">
                          {job.isCentral ? "All-India Central" : `${job.stateSlug.toUpperCase()} State`} · {job.category}
                        </span>
                      </td>

                      {/* Vacancies */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono font-bold text-sm text-[#1A1918] block">
                          {job.totalVacancies.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] text-[#68635B]">Posts</span>
                      </td>

                      {/* Eligibility Details */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="space-y-1">
                          <span className="font-medium text-[#1A1918] block line-clamp-2">
                            {job.qualifications.join(", ")}
                          </span>
                          <span className="text-[10px] font-mono text-[#68635B] block">
                            Age: {formatAgeRange(job)}
                          </span>
                        </div>
                      </td>

                      {/* Pay Scale */}
                      <td className="py-3.5 px-4 font-mono font-bold text-xs text-[#209948]">
                        {job.salary ? job.salary.split("(")[0] : "See notification"}
                      </td>

                      {/* Deadline */}
                      <td className="py-3.5 px-4 font-mono text-xs">
                        <span className="text-[#1A1918] block font-semibold">{formatDate(job.applicationEndDate)}</span>
                        {daysLeft > 0 ? (
                          <span className="text-[10px] text-[#E96B15] font-bold block">
                            {daysLeft} days left
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#68635B] block">Closed</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right print:hidden">
                        <Link
                          href={jobHref}
                          className="px-3 py-1.5 rounded bg-[#FAF7EF] border border-[#DDD5C7] hover:border-[#1E3799] hover:text-[#1E3799] text-xs font-bold transition-all inline-flex items-center gap-1"
                        >
                          <span>Gazette</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Campus Notice Board Notice Box */}
      <div className="p-5 rounded-xl bg-[#FAF7EF] border border-[#EAE2D2] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div>
          <span className="font-bold text-sm text-[#1A1918] block">
            Placement Cell & Library Notice Board Kit
          </span>
          <span className="text-[#68635B] mt-0.5 block">
            Print this bulletin weekly or display on campus digital kiosks. Updates are verified directly against official Union and State gazettes.
          </span>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-md bg-[#1E3799] text-white font-bold hover:bg-[#15286D] transition-colors shrink-0 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Weekly Bulletin</span>
        </button>
      </div>
    </div>
  );
}
