"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { JobNotification, formatAgeRange, isOpenOrOpening, getJobCanonicalPath } from "@/data/jobs";
import { STATUS_STYLE, qualificationLabel, rowTitle, placeLabel } from "@/components/jobs/JobListCard";
import { formatDateShort, getDaysRemaining, cn } from "@/lib/utils";
import { ArrowRight, Printer } from "lucide-react";

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

const SCREEN_ROWS = 25;
const isOpen = isOpenOrOpening;

/**
 * Vacancies by qualification: pick a level, see its recruitments (nearest last date first) and print
 * the list for a college or library notice board. The screen shows 25 rows; the printout has all.
 */
export function QualificationVacancyTracker({ jobs }: { jobs: JobNotification[] }) {
  const [selectedTierId, setSelectedTierId] = useState<string>("all");
  const [openOnly, setOpenOnly] = useState<boolean>(true);
  const [showAll, setShowAll] = useState(false);

  const currentTier = QUALIFICATION_TIERS.find((t) => t.id === selectedTierId) || QUALIFICATION_TIERS[0];

  const tierStats = useMemo(() => QUALIFICATION_TIERS.map((tier) => {
    const matching = jobs.filter((job) => (!openOnly || isOpen(job)) && tier.matcher(job));
    return { ...tier, jobCount: matching.length, posts: matching.reduce((n, j) => n + (j.totalVacancies || 0), 0) };
  }), [openOnly, jobs]);

  const rows = useMemo(() => jobs
    .filter((job) => (!openOnly || isOpen(job)) && currentTier.matcher(job))
    .sort((a, b) => (a.applicationEndDate || "9999").localeCompare(b.applicationEndDate || "9999")
      || b.totalVacancies - a.totalVacancies), [currentTier, openOnly, jobs]);
  const posts = rows.reduce((n, j) => n + (j.totalVacancies || 0), 0);

  return (
    <div className="space-y-5">
      {/* level picker: open jobs and posts per qualification */}
      <div role="group" aria-label="Qualification" className="flex flex-wrap gap-2 print:hidden">
        {tierStats.map((tier) => {
          const on = tier.id === selectedTierId;
          return (
            <button
              key={tier.id}
              aria-pressed={on}
              onClick={() => { setSelectedTierId(tier.id); setShowAll(false); }}
              className={cn(
                "px-3.5 min-h-[44px] rounded-full border text-[13px] font-semibold text-left transition-colors",
                on ? "bg-navy-solid text-white border-navy" : "bg-surface text-ink-2 border-control hover:border-navy"
              )}
            >
              {tier.shortLabel}
              <span className={cn("ml-1.5 font-normal tabular-nums", on ? "text-white/85" : "text-muted")}>
                {tier.jobCount} · {tier.posts.toLocaleString("en-IN")} posts
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-[13px]">
        <p className="text-ink-2" aria-live="polite">
          <b className="text-ink">{rows.length}</b> {openOnly ? "open" : ""} recruitments for{" "}
          <b className="text-ink">{currentTier.label}</b>
          {posts > 0 && <> · {posts.toLocaleString("en-IN")} posts</>} · nearest last date first
        </p>
        <div className="flex items-center gap-4 print:hidden">
          <label className="inline-flex items-center gap-2 min-h-[44px] cursor-pointer text-ink-2 font-medium">
            <input type="checkbox" checked={openOnly} onChange={(e) => setOpenOnly(e.target.checked)} className="w-4 h-4" />
            Open now only
          </label>
          <button
            onClick={() => { setShowAll(true); requestAnimationFrame(() => window.print()); }}
            className="inline-flex items-center gap-1.5 px-4 min-h-[44px] rounded-lg bg-navy-solid hover:bg-navy-strong text-white font-bold"
          >
            <Printer className="w-4 h-4" aria-hidden />
            Print notice-board list
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted bg-surface rounded-xl border border-line">
          Nothing open for this qualification right now.{" "}
          <Link href="/calendar" className="font-semibold text-navy underline underline-offset-2">See the calendar of last dates and exams</Link>
        </p>
      ) : (
        <div className="bg-surface rounded-xl border border-line overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-subtle border-b border-line text-[12px] font-semibold text-muted">
                <th className="py-2.5 pl-5 pr-4">Recruitment</th>
                <th className="py-2.5 px-4 text-right">Posts</th>
                <th className="py-2.5 px-4">Eligibility</th>
                <th className="py-2.5 px-4">Last date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {rows.map((job, i) => {
                const style = STATUS_STYLE[job.status] || STATUS_STYLE.UPCOMING;
                const days = getDaysRemaining(job.applicationEndDate);
                const qual = qualificationLabel(job);
                const age = job.ageKnown !== false && job.maxAge > 0 ? formatAgeRange(job) : null;
                return (
                  <tr key={job.id} className={cn("align-top", i >= SCREEN_ROWS && !showAll && "hidden print:table-row")}>
                    <td className="py-3 pl-5 pr-4">
                      <div className="flex items-center gap-1.5 text-[12px]">
                        <b className="text-navy">{job.orgShortCode}</b>
                        <span className="text-muted">{placeLabel(job)}</span>
                        {!isOpen(job) && <span className={cn("font-bold", style.text)}>· {style.label}</span>}
                      </div>
                      <Link href={getJobCanonicalPath(job)} className="mt-0.5 block font-semibold text-ink hover:text-navy leading-snug line-clamp-2 print:line-clamp-none">
                        {rowTitle(job)}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums whitespace-nowrap">
                      {job.totalVacancies ? <b className="text-ink">{job.totalVacancies.toLocaleString("en-IN")}</b> : <span className="text-[12px] text-faint">See notice</span>}
                    </td>
                    <td className="py-3 px-4 text-[13px] text-ink-2 whitespace-nowrap">
                      {[qual, age].filter(Boolean).join(" · ") || <span className="text-[12px] text-faint">See notice</span>}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {job.applicationEndDate ? (
                        <>
                          <b className="text-ink">{formatDateShort(job.applicationEndDate)}</b>
                          {isOpen(job) && job.status !== "UPCOMING" && days >= 0 && (
                            <span className={cn("block text-[12px] font-semibold", job.status === "LAST_DATE_NEAR" ? "text-saffron" : "text-green")}>
                              {days === 0 ? "Closes today" : `${days} day${days === 1 ? "" : "s"} left`}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-[12px] text-faint">See notice</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {rows.length > SCREEN_ROWS && !showAll && (
        <div className="text-center print:hidden">
          <button
            onClick={() => setShowAll(true)}
            className="px-4 min-h-[44px] rounded-lg border border-navy-line bg-surface text-sm font-bold text-navy hover:border-navy"
          >
            Show all {rows.length}
          </button>
        </div>
      )}

      {currentTier.id !== "all" && (
        <Link href={currentTier.hubUrl} className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-navy hover:underline print:hidden">
          All {currentTier.shortLabel} jobs, with exams and results <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}
