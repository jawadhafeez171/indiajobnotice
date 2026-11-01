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
      <div className="bg-surface rounded-xl border border-line p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line-soft pb-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-navy font-bold block mb-1">
              From official notifications
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink">
              Qualification-Wise Vacancy Breakdown
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Filter government jobs by educational criteria. Used by college placement cells, coaching faculties, and public library desks.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-lg bg-navy-solid hover:bg-navy-strong text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
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
                    ? "bg-navy-tint border-navy ring-2 ring-navy/20 shadow-2xs"
                    : "bg-subtle border-line hover:bg-surface hover:border-navy-line"
                )}
              >
                <div>
                  <span className={cn(
                    "text-[11px] font-mono uppercase font-bold block mb-1 truncate",
                    isSelected ? "text-navy" : "text-muted"
                  )}>
                    {tier.shortLabel}
                  </span>
                  <span className="font-serif font-bold text-lg text-ink block leading-tight">
                    {tier.totalVacancies.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[11px] text-muted block mt-0.5">
                    Vacancies
                  </span>
                </div>

                <div className="mt-2.5 pt-2 border-t border-line/60 flex items-center justify-between text-[11px] font-bold">
                  <span className={isSelected ? "text-navy" : "text-ink-2"}>
                    {tier.jobCount} jobs
                  </span>
                  <ArrowRight className={cn(
                    "w-3 h-3 transition-transform",
                    isSelected ? "text-navy translate-x-0.5" : "text-faint group-hover:translate-x-0.5"
                  )} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Toggle & Summary Bar */}
        <div className="mt-4 pt-4 border-t border-line-soft flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-ink">Showing:</span>
            <span className="px-2.5 py-0.5 rounded bg-navy-tint text-navy font-bold border border-navy-line">
              {currentTier.label}
            </span>
            <span className="text-muted">
              ({totalFilteredVacancies.toLocaleString("en-IN")} Total Posts in {filteredJobs.length} Drives)
            </span>
          </div>

          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer text-ink-2">
            <input
              type="checkbox"
              checked={activeOnly}
              onChange={(e) => setActiveOnly(e.target.checked)}
              className="rounded border-line text-navy focus:ring-navy"
            />
            <span>Active & Upcoming Openings Only</span>
          </label>
        </div>
      </div>

      {/* Vacancy Table / Printable Gazette Listing */}
      <div className="bg-surface rounded-xl border border-line p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-navy" />
            <h3 className="font-serif text-base sm:text-lg font-bold text-ink">
              {currentTier.label} — Live Recruitment Openings
            </h3>
          </div>

          {currentTier.id !== "all" && (
            <Link
              href={currentTier.hubUrl}
              className="text-xs font-bold text-navy hover:underline flex items-center gap-1"
            >
              <span>Permanent {currentTier.shortLabel} Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-10 text-xs text-muted bg-subtle rounded-lg border border-line">
            No active positions currently open under this qualification tier. Check upcoming gazettes on the{" "}
            <Link href="/calendar" className="text-navy font-bold hover:underline">
              Exam Calendar
            </Link>.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-line rounded-lg overflow-hidden bg-surface">
              <thead>
                <tr className="bg-subtle border-b border-line font-mono text-[12px] text-muted uppercase">
                  <th className="py-3 px-4 font-bold text-navy">Recruiting Commission & Post</th>
                  <th className="py-3 px-4 font-bold text-center">Vacancies</th>
                  <th className="py-3 px-4 font-semibold">Eligibility Details</th>
                  <th className="py-3 px-4 font-semibold">Pay Scale</th>
                  <th className="py-3 px-4 font-semibold">Deadline</th>
                  <th className="py-3 px-4 font-bold text-right print:hidden">Notification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {filteredJobs.map((job) => {
                  const jobHref = job.isCentral
                    ? `/jobs/${job.slug}`
                    : `/state/${job.stateSlug}/jobs/${job.slug}`;

                  const daysLeft = getDaysRemaining(job.applicationEndDate);

                  return (
                    <tr key={job.id} className="hover:bg-subtle transition-colors">
                      {/* Commission & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-navy-tint text-navy border border-navy-line">
                            {job.orgShortCode}
                          </span>
                          <JobStatusBadge status={job.status} />
                        </div>
                        <Link href={jobHref} className="font-serif font-bold text-xs text-ink hover:text-navy block leading-snug">
                          {job.title}
                        </Link>
                        <span className="text-[11px] text-muted block mt-0.5">
                          {job.isCentral ? "All-India Central" : `${job.stateSlug.toUpperCase()} State`} · {job.category}
                        </span>
                      </td>

                      {/* Vacancies */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono font-bold text-sm text-ink block">
                          {job.totalVacancies.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[11px] text-muted">Posts</span>
                      </td>

                      {/* Eligibility Details */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="space-y-1">
                          <span className="font-medium text-ink block line-clamp-2">
                            {job.qualifications.join(", ")}
                          </span>
                          <span className="text-[11px] font-mono text-muted block">
                            Age: {formatAgeRange(job)}
                          </span>
                        </div>
                      </td>

                      {/* Pay Scale */}
                      <td className="py-3.5 px-4 font-mono font-bold text-xs text-green">
                        {job.salary ? job.salary.split("(")[0] : "See notification"}
                      </td>

                      {/* Deadline */}
                      <td className="py-3.5 px-4 font-mono text-xs">
                        <span className="text-ink block font-semibold">{formatDate(job.applicationEndDate)}</span>
                        {daysLeft > 0 ? (
                          <span className="text-[11px] text-saffron font-bold block">
                            {daysLeft} days left
                          </span>
                        ) : (
                          <span className="text-[11px] text-muted block">Closed</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right print:hidden">
                        <Link
                          href={jobHref}
                          className="px-3 py-1.5 rounded bg-subtle border border-line hover:border-navy hover:text-navy text-xs font-bold transition-all inline-flex items-center gap-1"
                        >
                          <span>Notification</span>
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
      <div className="p-5 rounded-xl bg-subtle border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div>
          <span className="font-bold text-sm text-ink block">
            Placement Cell & Library Notice Board Kit
          </span>
          <span className="text-muted mt-0.5 block">
            Print this bulletin weekly or display on campus digital kiosks. Updates are verified directly against official Union and State gazettes.
          </span>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-md bg-navy-solid text-white font-bold hover:bg-navy-strong transition-colors shrink-0 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Weekly Bulletin</span>
        </button>
      </div>
    </div>
  );
}
