"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  JobNotification, 
  getCategoryColors, 
} from "@/data/jobs";
import { JobStatusBadge } from "./JobStatusBadge";
import { formatDate, getDaysRemaining, cn } from "@/lib/utils";
import { 
  Table, 
  LayoutTemplate, 
  LayoutGrid, 
  FileText, 
  ArrowRight, 
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  FileCheck
} from "lucide-react";

interface Props {
  jobs: JobNotification[];
  currentStateSlug?: string;
}

type ViewMode = "ledger" | "spotlight" | "bulletin";

export type StatusCategoryKey = 
  | "ALL"
  | "APPLY_OPEN"
  | "CLOSING_SOON"
  | "ADMIT_CARD"
  | "RESULT";

interface StatusCategoryConfig {
  key: StatusCategoryKey;
  label: string;
  shortLabel: string;
  badgeText: string;
  dotColor: string;
  activeColor: string;
  activeBg: string;
  activeBorder: string;
  icon: React.ElementType;
  description: string;
}

const STATUS_CATEGORIES: StatusCategoryConfig[] = [
  {
    key: "ALL",
    label: "All Recruitments",
    shortLabel: "All",
    badgeText: "Overview",
    dotColor: "bg-[#1E3799]",
    activeColor: "text-white",
    activeBg: "bg-[#1E3799]",
    activeBorder: "border-[#1E3799]",
    icon: Sparkles,
    description: "All verified national and state circulars across recruitment lifecycle stages.",
  },
  {
    key: "APPLY_OPEN",
    label: "Latest Notifications (Apply Open)",
    shortLabel: "Apply Open",
    badgeText: "Open Now",
    dotColor: "bg-[#1E3799]",
    activeColor: "text-white",
    activeBg: "bg-[#1E3799]",
    activeBorder: "border-[#1E3799]",
    icon: Sparkles,
    description: "Newly gazetted drives with active registration and online application windows.",
  },
  {
    key: "CLOSING_SOON",
    label: "Closing Soon (Last Chance)",
    shortLabel: "Closing Soon",
    badgeText: "Ending Soon",
    dotColor: "bg-[#E96B15]",
    activeColor: "text-white",
    activeBg: "bg-[#E96B15]",
    activeBorder: "border-[#E96B15]",
    icon: Clock,
    description: "Urgent application deadlines ending in the upcoming days. Submit forms before portal closure.",
  },
  {
    key: "ADMIT_CARD",
    label: "Admit Card Released",
    shortLabel: "Admit Cards",
    badgeText: "Hall Tickets",
    dotColor: "bg-[#1E3799]",
    activeColor: "text-white",
    activeBg: "bg-[#1E3799]",
    activeBorder: "border-[#1E3799]",
    icon: FileCheck,
    description: "Official exam city slips, CBT call letters, and physical test hall tickets available for download.",
  },
  {
    key: "RESULT",
    label: "Result Announced",
    shortLabel: "Results",
    badgeText: "Merit Lists",
    dotColor: "bg-[#209948]",
    activeColor: "text-white",
    activeBg: "bg-[#209948]",
    activeBorder: "border-[#209948]",
    icon: Award,
    description: "Final selection lists, cut-off marks, scorecards, and normalized answer keys.",
  },
];

export function MajorRecruitmentsSection({ jobs, currentStateSlug }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>("ledger");
  const [activeCategory, setActiveCategory] = useState<StatusCategoryKey>("APPLY_OPEN");

  // Helper to test if a job matches a status category
  const matchesCategory = (job: JobNotification, cat: StatusCategoryKey): boolean => {
    switch (cat) {
      case "APPLY_OPEN":
        return job.status === "APPLY_OPEN" || job.status === "UPCOMING";
      case "CLOSING_SOON": {
        if (job.status === "LAST_DATE_NEAR") return true;
        const days = getDaysRemaining(job.applicationEndDate);
        return days > 0 && days <= 10;
      }
      case "ADMIT_CARD":
        return job.status === "ADMIT_CARD_OUT";
      case "RESULT":
        return job.status === "RESULT_OUT";
      case "ALL":
      default:
        return true;
    }
  };

  // Counts for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<StatusCategoryKey, number> = {
      ALL: jobs.length,
      APPLY_OPEN: 0,
      CLOSING_SOON: 0,
      ADMIT_CARD: 0,
      RESULT: 0,
    };

    jobs.forEach((j) => {
      if (matchesCategory(j, "APPLY_OPEN")) counts.APPLY_OPEN += 1;
      if (matchesCategory(j, "CLOSING_SOON")) counts.CLOSING_SOON += 1;
      if (matchesCategory(j, "ADMIT_CARD")) counts.ADMIT_CARD += 1;
      if (matchesCategory(j, "RESULT")) counts.RESULT += 1;
    });

    return counts;
  }, [jobs]);

  // Filtered jobs sorted by vacancy count
  const filteredJobs = useMemo(() => {
    const matched = jobs.filter((j) => matchesCategory(j, activeCategory));
    return matched.sort((a, b) => b.totalVacancies - a.totalVacancies);
  }, [jobs, activeCategory]);

  const currentCategoryConfig = useMemo(() => {
    return STATUS_CATEGORIES.find((c) => c.key === activeCategory) || STATUS_CATEGORIES[1];
  }, [activeCategory]);

  const heroJob = filteredJobs[0] || jobs[0];
  const sideJobs = filteredJobs.slice(1, 6);

  return (
    <section className="space-y-4">
      {/* Section Header with Live View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE2D2]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E3799]" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1918]">
              Major Recruitment Notifications
            </h2>
          </div>
          <p className="text-xs text-[#68635B] mt-0.5">
            Verified circulars categorized across the 4 key stages of public employment
          </p>
        </div>

        {/* View Mode Switcher Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-md bg-[#EEF2FA] border border-[#CCD8F0] self-start sm:self-auto text-xs">
          <span className="text-[10px] uppercase font-mono text-[#1E3799] font-bold px-2 hidden md:inline">
            Layout:
          </span>

          <button
            onClick={() => setViewMode("ledger")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded font-semibold transition-all",
              viewMode === "ledger"
                ? "bg-[#1E3799] text-white shadow-2xs"
                : "text-[#1E3799] hover:bg-white/60"
            )}
            title="Dense, print-editorial table layout"
          >
            <Table className="w-3.5 h-3.5" />
            <span>Ledger Table</span>
          </button>

          <button
            onClick={() => setViewMode("spotlight")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded font-semibold transition-all",
              viewMode === "spotlight"
                ? "bg-[#1E3799] text-white shadow-2xs"
                : "text-[#1E3799] hover:bg-white/60"
            )}
            title="Spotlight hero card + compact feed"
          >
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>Spotlight Split</span>
          </button>

          <button
            onClick={() => setViewMode("bulletin")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded font-semibold transition-all",
              viewMode === "bulletin"
                ? "bg-[#1E3799] text-white shadow-2xs"
                : "text-[#1E3799] hover:bg-white/60"
            )}
            title="Card grid layout"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Bulletin Cards</span>
          </button>
        </div>
      </div>

      {/* ================= 4 STATUS CATEGORY SELECTOR TABS ================= */}
      <div className="bg-white rounded-lg border border-[#EAE2D2] p-2 sm:p-2.5 shadow-2xs">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {STATUS_CATEGORIES.filter((c) => c.key !== "ALL").map((cat) => {
            const isSelected = activeCategory === cat.key;
            const count = categoryCounts[cat.key];
            const Icon = cat.icon;

            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={cn(
                  "p-2.5 sm:p-3 rounded-md text-left transition-all border flex flex-col justify-between group",
                  isSelected
                    ? `${cat.activeBg} ${cat.activeColor} ${cat.activeBorder} shadow-xs ring-1 ring-black/5`
                    : "bg-[#FCFAF4] hover:bg-[#EEF2FA]/50 border-[#EAE2D2] hover:border-[#1E3799]/40 text-[#1A1918]"
                )}
              >
                <div className="flex items-center justify-between gap-1.5 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full shrink-0",
                        isSelected ? "bg-white" : cat.dotColor
                      )}
                    />
                    <span
                      className={cn(
                        "text-[10px] font-mono font-bold uppercase tracking-wider",
                        isSelected ? "text-white/80" : "text-[#68635B]"
                      )}
                    >
                      {cat.badgeText}
                    </span>
                  </div>

                  <span
                    className={cn(
                      "text-[11px] font-mono font-bold px-1.5 py-0.2 rounded",
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-[#EEF2FA] text-[#1E3799] border border-[#CCD8F0]"
                    )}
                  >
                    {count}
                  </span>
                </div>

                <div className="font-serif font-bold text-xs sm:text-sm line-clamp-1">
                  {cat.shortLabel}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Category Description Banner */}
        <div className="mt-2.5 pt-2 border-t border-[#F2ECE1] px-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#68635B]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1A1918]">
              {currentCategoryConfig.label}:
            </span>
            <span>{currentCategoryConfig.description}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveCategory(activeCategory === "ALL" ? "APPLY_OPEN" : "ALL")}
              className={cn(
                "text-[11px] font-mono font-bold px-2 py-0.5 rounded transition-colors",
                activeCategory === "ALL"
                  ? "bg-[#1E3799] text-white"
                  : "text-[#1E3799] hover:underline"
              )}
            >
              {activeCategory === "ALL" ? "✓ Viewing All Stages" : "View All (Combined) →"}
            </button>
          </div>
        </div>
      </div>

      {/* ================= OPTION 1: THE GAZETTE LEDGER (TABLE) ================= */}
      {viewMode === "ledger" && (
        <div className="bg-white rounded-lg border border-[#EAE2D2] overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF7EC] border-b border-[#EAE2D2] text-[#68635B] font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 font-bold text-[#1E3799]">Vacancies</th>
                  <th className="py-3 px-4 font-bold text-[#1A1918]">Recruitment Circular</th>
                  <th className="py-3 px-4 font-semibold hidden md:table-cell">Sector</th>
                  <th className="py-3 px-4 font-semibold hidden lg:table-cell">Stage Status</th>
                  <th className="py-3 px-4 font-semibold">Important Date</th>
                  <th className="py-3 px-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE1]">
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-[#68635B]">
                      No circulars currently found in this category.
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => {
                    const daysLeft = getDaysRemaining(job.applicationEndDate);
                    const isEndingSoon = daysLeft > 0 && daysLeft <= 10;
                    const catColors = getCategoryColors(job.category);
                    const detailLink = job.isCentral
                      ? `/jobs/${job.slug}`
                      : `/state/${job.stateSlug}/jobs/${job.slug}`;

                    return (
                      <tr
                        key={job.id}
                        className="hover:bg-[#FCFAF4] transition-colors group"
                      >
                        {/* Vacancy Column */}
                        <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                          <span className="font-bold text-sm text-[#1E3799]">
                            {job.totalVacancies.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[10px] text-[#68635B] block">
                            posts
                          </span>
                        </td>

                        {/* Title & Board */}
                        <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-mono text-[10px] uppercase font-bold text-[#1E3799] bg-[#EEF2FA] px-1.5 py-0.2 rounded border border-[#CCD8F0]">
                              {job.orgShortCode}
                            </span>
                            <span className="text-[#D8CFBF]">·</span>
                            <span className="text-[10px] text-[#68635B] font-medium">
                              {job.isCentral ? "Central Govt" : `${job.stateSlug.toUpperCase()} State`}
                            </span>
                          </div>
                          <Link
                            href={detailLink}
                            className="font-serif font-bold text-sm text-[#1A1918] group-hover:text-[#1E3799] transition-colors leading-snug line-clamp-1"
                          >
                            {job.title}
                          </Link>
                          <p className="text-[11px] text-[#68635B] line-clamp-1 mt-0.5 font-medium">
                            {job.organization}
                          </p>
                        </td>

                        {/* Category Tag */}
                        <td className="py-3.5 px-4 hidden md:table-cell whitespace-nowrap">
                          <span
                            className={cn(
                              "inline-block px-2 py-0.5 rounded text-[10px] font-bold border",
                              catColors.bg,
                              catColors.text,
                              catColors.border
                            )}
                          >
                            {catColors.label}
                          </span>
                        </td>

                        {/* Stage Status */}
                        <td className="py-3.5 px-4 hidden lg:table-cell whitespace-nowrap">
                          <JobStatusBadge status={job.status} />
                        </td>

                        {/* Date Info */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {job.status === "ADMIT_CARD_OUT" ? (
                            <div>
                              <span className="text-[10px] font-mono text-[#1E3799] font-bold block">Exam Date</span>
                              <span className="font-bold text-xs text-[#1A1918]">{job.examDate || "Active"}</span>
                            </div>
                          ) : job.status === "RESULT_OUT" ? (
                            <div>
                              <span className="text-[10px] font-mono text-[#209948] font-bold block">Merit Out</span>
                              <span className="font-bold text-xs text-[#209948]">Scorecards Live</span>
                            </div>
                          ) : (
                            <div>
                              <div className={cn("font-medium", isEndingSoon ? "text-[#E96B15] font-bold" : "text-[#1A1918]")}>
                                {formatDate(job.applicationEndDate)}
                              </div>
                              {isEndingSoon && (
                                <span className="text-[10px] text-[#E96B15] font-bold">
                                  {daysLeft}d left
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <a
                              href={job.officialPdfUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded hover:bg-[#EEF2FA] text-[#68635B] hover:text-[#1E3799] transition-colors"
                              title="Download Official Notification PDF"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </a>

                            <Link
                              href={detailLink}
                              className="px-2.5 py-1 rounded bg-[#FDF3EB] border border-[#F9D9C3] text-[#E96B15] hover:bg-[#E96B15] hover:text-white font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                            >
                              <span>Details</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= OPTION 2: THE EDITORIAL SPOTLIGHT (SPLIT) ================= */}
      {viewMode === "spotlight" && heroJob && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Main Hero Spotlight (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-lg border border-[#EAE2D2] p-6 flex flex-col justify-between shadow-2xs relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#1E3799]" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#EEF2FA] text-[#1E3799] font-bold border border-[#CCD8F0]">
                    {currentCategoryConfig.badgeText}
                  </span>
                  <span className="text-xs text-[#68635B] font-mono font-medium">
                    {heroJob.orgShortCode} · {heroJob.isCentral ? "Central Govt" : `${heroJob.stateSlug.toUpperCase()} State`}
                  </span>
                </div>
                <JobStatusBadge status={heroJob.status} />
              </div>

              <Link
                href={heroJob.isCentral ? `/jobs/${heroJob.slug}` : `/state/${heroJob.stateSlug}/jobs/${heroJob.slug}`}
                className="group block"
              >
                <h3 className="font-serif text-2xl font-bold text-[#1A1918] group-hover:text-[#1E3799] transition-colors leading-snug">
                  {heroJob.title}
                </h3>
              </Link>

              <p className="text-xs text-[#68635B] mt-1.5 font-medium">
                Official Commission: {heroJob.organization}
              </p>

              {/* Big Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 my-5 p-3.5 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2] text-xs">
                <div>
                  <span className="text-[10px] text-[#68635B] uppercase font-mono block">Total Posts</span>
                  <span className="font-serif text-xl font-bold text-[#1E3799] mt-0.5 block">
                    {heroJob.totalVacancies.toLocaleString("en-IN")}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#68635B] uppercase font-mono block">Age Bracket</span>
                  <span className="font-bold text-sm text-[#1A1918] mt-1 block">
                    {heroJob.minAge}–{heroJob.maxAge} yrs
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#68635B] uppercase font-mono block">Status Date</span>
                  <span className="font-bold text-sm text-[#E96B15] mt-1 block">
                    {formatDate(heroJob.applicationEndDate)}
                  </span>
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-1.5 mb-5 text-xs text-[#524E48]">
                {heroJob.keyHighlights.slice(0, 2).map((hl, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#209948] shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 border-t border-[#F2ECE1] flex items-center gap-3">
              <Link
                href={heroJob.isCentral ? `/jobs/${heroJob.slug}` : `/state/${heroJob.stateSlug}/jobs/${heroJob.slug}`}
                className="flex-1 py-2.5 px-4 rounded-md bg-[#E96B15] hover:bg-[#D4590A] text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Read Full Circular & Syllabus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <a
                href={heroJob.officialPdfUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-4 rounded-md bg-[#EEF2FA] border border-[#CCD8F0] hover:bg-[#E0E9F8] text-[#1E3799] text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-[#1E3799]" />
                <span>Official PDF</span>
              </a>
            </div>
          </div>

          {/* Stacked Side Feed (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3">
            {sideJobs.map((job) => {
              const detailLink = job.isCentral
                ? `/jobs/${job.slug}`
                : `/state/${job.stateSlug}/jobs/${job.slug}`;

              return (
                <div
                  key={job.id}
                  className="bg-white rounded-lg border border-[#EAE2D2] p-3.5 hover:border-[#1E3799]/40 transition-colors flex items-start gap-3 shadow-2xs"
                >
                  {/* Vacancy Block */}
                  <div className="w-16 h-16 rounded bg-[#EEF2FA] border border-[#CCD8F0] flex flex-col items-center justify-center text-center shrink-0">
                    <span className="font-serif font-bold text-sm text-[#1E3799] leading-none">
                      {job.totalVacancies >= 1000
                        ? `${(job.totalVacancies / 1000).toFixed(1)}k`
                        : job.totalVacancies}
                    </span>
                    <span className="text-[9px] text-[#1E3799]/70 font-mono mt-0.5 uppercase font-semibold">
                      posts
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-mono text-[#68635B] font-bold">
                        {job.orgShortCode}
                      </span>
                      <span className="text-[#D8CFBF]">·</span>
                      <span className="text-[10px] text-[#68635B]">
                        {job.status === "ADMIT_CARD_OUT" ? "Admit Card Out" : job.status === "RESULT_OUT" ? "Result Live" : `Ends ${formatDate(job.applicationEndDate)}`}
                      </span>
                    </div>

                    <Link
                      href={detailLink}
                      className="font-serif font-bold text-xs text-[#1A1918] hover:text-[#1E3799] transition-colors line-clamp-1 block leading-snug"
                    >
                      {job.title}
                    </Link>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#F2ECE1] text-[11px]">
                      <span className="text-[#68635B] truncate">
                        {job.qualifications[0]}
                      </span>
                      <Link
                        href={detailLink}
                        className="text-[#E96B15] hover:text-[#D4590A] font-bold ml-2 shrink-0 inline-flex items-center gap-0.5"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= OPTION 3: BULLETIN CARDS ================= */}
      {viewMode === "bulletin" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.length === 0 ? (
            <div className="col-span-full py-8 text-center text-xs text-[#68635B] bg-white rounded-lg border border-[#EAE2D2]">
              No circulars currently found in this category.
            </div>
          ) : (
            filteredJobs.map((job) => {
              const catColors = getCategoryColors(job.category);
              const detailLink = job.isCentral
                ? `/jobs/${job.slug}`
                : `/state/${job.stateSlug}/jobs/${job.slug}`;

              return (
                <div
                  key={job.id}
                  className="bg-white rounded-lg border border-[#EAE2D2] hover:border-[#1E3799]/40 p-4 transition-all flex flex-col justify-between shadow-2xs relative overflow-hidden"
                >
                  <div className={cn("absolute left-0 top-0 bottom-0 w-1", catColors.stripe)} />
                  <div className="pl-1.5">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono font-bold text-[#1E3799] bg-[#EEF2FA] px-1.5 py-0.2 rounded border border-[#CCD8F0]">
                        {job.orgShortCode}
                      </span>
                      <JobStatusBadge status={job.status} />
                    </div>

                    <Link
                      href={detailLink}
                      className="font-serif font-bold text-sm text-[#1A1918] hover:text-[#1E3799] transition-colors line-clamp-2 leading-snug"
                    >
                      {job.title}
                    </Link>

                    <p className="text-[11px] text-[#68635B] mt-1 line-clamp-1">
                      {job.organization}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-[#F2ECE1] flex items-center justify-between text-xs font-mono">
                      <span className="text-[#1E3799] font-bold">
                        {job.totalVacancies.toLocaleString("en-IN")} Posts
                      </span>
                      <span className="text-[#68635B] text-[11px]">
                        {job.minAge}–{job.maxAge} yrs
                      </span>
                    </div>
                  </div>

                  <div className="pl-1.5 mt-3 pt-2.5 border-t border-[#F2ECE1] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#68635B]">
                      {job.status === "ADMIT_CARD_OUT" ? "Admit Card Out" : job.status === "RESULT_OUT" ? "Result Live" : `Ends: ${formatDate(job.applicationEndDate)}`}
                    </span>
                    <Link
                      href={detailLink}
                      className="text-[#E96B15] hover:text-[#D4590A] font-bold inline-flex items-center gap-0.5"
                    >
                      <span>Apply/View</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </section>
  );
}
