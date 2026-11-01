"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { 
  JobNotification, 
  getCategoryColors,
  formatAgeRange,
} from "@/data/jobs";
import { JobStatusBadge } from "./JobStatusBadge";
import { JobListCard } from "./JobListCard";
import { formatDate, getDaysRemaining, cn } from "@/lib/utils";
import { useWatchlist } from "@/lib/watchlist";
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
  FileCheck,
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  Bookmark
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
    dotColor: "bg-navy-solid",
    activeColor: "text-white",
    activeBg: "bg-navy-solid",
    activeBorder: "border-navy",
    icon: Sparkles,
    description: "All verified national and state circulars across recruitment lifecycle stages.",
  },
  {
    key: "APPLY_OPEN",
    label: "Latest Notifications (Apply Open)",
    shortLabel: "Apply Open",
    badgeText: "Open Now",
    dotColor: "bg-navy-solid",
    activeColor: "text-white",
    activeBg: "bg-navy-solid",
    activeBorder: "border-navy",
    icon: Sparkles,
    description: "Newly gazetted drives with active registration and online application windows.",
  },
  {
    key: "CLOSING_SOON",
    label: "Closing Soon (Last Chance)",
    shortLabel: "Closing Soon",
    badgeText: "Ending Soon",
    dotColor: "bg-saffron-solid",
    activeColor: "text-white",
    activeBg: "bg-saffron-solid",
    activeBorder: "border-saffron-bright",
    icon: Clock,
    description: "Urgent application deadlines ending in the upcoming days. Submit forms before portal closure.",
  },
  {
    key: "ADMIT_CARD",
    label: "Admit Card Released",
    shortLabel: "Admit Cards",
    badgeText: "Hall Tickets",
    dotColor: "bg-navy-solid",
    activeColor: "text-white",
    activeBg: "bg-navy-solid",
    activeBorder: "border-navy",
    icon: FileCheck,
    description: "Official exam city slips, CBT call letters, and physical test hall tickets available for download.",
  },
  {
    key: "RESULT",
    label: "Result Announced",
    shortLabel: "Results",
    badgeText: "Merit Lists",
    dotColor: "bg-green-solid",
    activeColor: "text-white",
    activeBg: "bg-green-solid",
    activeBorder: "border-green",
    icon: Award,
    description: "Final selection lists, cut-off marks, scorecards, and normalized answer keys.",
  },
];

const JOB_CATEGORIES = [
  "ALL",
  "Police / Defense",
  "Administrative / PSC",
  "Teaching / Education",
  "Railways",
  "Banking / Insurance",
  "Engineering / Technical",
  "Clerical / Stenographer",
  "Medical & Nursing",
];

const QUALIFICATIONS = [
  { label: "All Qualifications", value: "ALL" },
  { label: "10th (Matric) Pass", value: "10th" },
  { label: "12th (Intermediate)", value: "12th" },
  { label: "Graduate (Any Stream)", value: "graduate" },
  { label: "Engineering / Diploma / ITI", value: "tech" },
  { label: "Teaching (B.Ed / CTET)", value: "teaching" },
];

export function MajorRecruitmentsSection({ jobs, currentStateSlug }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>("ledger");
  const [activeCategory, setActiveCategory] = useState<StatusCategoryKey>("APPLY_OPEN");
  
  // Search & Multi-Faceted Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedQualification, setSelectedQualification] = useState("ALL");
  const [selectedScope, setSelectedScope] = useState<"ALL" | "CENTRAL" | "STATE">("ALL");
  const [showFilters, setShowFilters] = useState(false);
  // a page of jobs at a time: the full list made the home page 40 phone screens long
  const [visible, setVisible] = useState(20);

  // Watchlist hook
  const { isSaved, toggleSave } = useWatchlist();

  // Listen to hash changes (e.g., from hero counter clicks)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#admit-cards" || hash === "#admit-card") {
        setActiveCategory("ADMIT_CARD");
      } else if (hash === "#results" || hash === "#result") {
        setActiveCategory("RESULT");
      } else if (hash === "#closing-soon") {
        setActiveCategory("CLOSING_SOON");
      } else if (hash === "#apply-open") {
        setActiveCategory("APPLY_OPEN");
      } else if (hash === "#all-recruitments" || hash === "#major-recruitments") {
        setActiveCategory("ALL");
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Helper to test if a job matches a status category
  const matchesStatus = (job: JobNotification, cat: StatusCategoryKey): boolean => {
    switch (cat) {
      case "APPLY_OPEN":
        return job.status === "APPLY_OPEN" || job.status === "LAST_DATE_NEAR";
      case "CLOSING_SOON": {
        if (job.status === "LAST_DATE_NEAR") return true;
        const days = getDaysRemaining(job.applicationEndDate);
        return days > 0 && days <= 7;
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

  // Check if any filter is actively applied
  const hasActiveFilters = searchQuery.trim() !== "" || selectedCategory !== "ALL" || selectedQualification !== "ALL" || selectedScope !== "ALL";

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("ALL");
    setSelectedQualification("ALL");
    setSelectedScope("ALL");
    setActiveCategory("ALL");
  };

  // Filtered jobs matching all criteria
  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      // 1. Status Filter
      if (!matchesStatus(j, activeCategory)) return false;

      // 2. Text Search
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const textToMatch = `${j.title} ${j.shortTitle} ${j.organization} ${j.orgShortCode} ${j.category} ${j.keyHighlights.join(" ")} ${j.qualifications.join(" ")}`.toLowerCase();
        if (!textToMatch.includes(q)) return false;
      }

      // 3. Category Filter
      if (selectedCategory !== "ALL" && j.category !== selectedCategory) {
        return false;
      }

      // 4. Qualification Filter
      if (selectedQualification !== "ALL") {
        const quals = j.qualifications.join(" ").toLowerCase();
        if (selectedQualification === "10th" && !quals.includes("10th") && !quals.includes("matric")) return false;
        if (selectedQualification === "12th" && !quals.includes("12th") && !quals.includes("intermediate")) return false;
        if (selectedQualification === "graduate" && !quals.includes("graduate") && !quals.includes("bachelor") && !quals.includes("degree")) return false;
        if (selectedQualification === "tech" && !quals.includes("iti") && !quals.includes("diploma") && !quals.includes("engineering") && !quals.includes("tech")) return false;
        if (selectedQualification === "teaching" && !quals.includes("b.ed") && !quals.includes("d.el.ed") && !quals.includes("ctet") && !quals.includes("stet")) return false;
      }

      // 5. Scope Filter (Central vs State)
      if (selectedScope === "CENTRAL" && !j.isCentral) return false;
      if (selectedScope === "STATE" && j.isCentral) return false;

      return true;
    }).sort((a, b) => {
      const rank = (j: JobNotification) =>
        j.status === "APPLY_OPEN" || j.status === "LAST_DATE_NEAR" ? 0
          : j.status === "ADMIT_CARD_OUT" || j.status === "RESULT_OUT" ? 1 : 2;
      return rank(a) - rank(b)
        || (a.applicationEndDate || "9999").localeCompare(b.applicationEndDate || "9999")
        || b.totalVacancies - a.totalVacancies;
    });
  }, [jobs, activeCategory, searchQuery, selectedCategory, selectedQualification, selectedScope]);

  // Counts for each status category (respecting text search and facet filters)
  const categoryCounts = useMemo(() => {
    const counts: Record<StatusCategoryKey, number> = {
      ALL: 0,
      APPLY_OPEN: 0,
      CLOSING_SOON: 0,
      ADMIT_CARD: 0,
      RESULT: 0,
    };

    jobs.forEach((j) => {
      // Check facets first
      if (selectedCategory !== "ALL" && j.category !== selectedCategory) return;
      if (selectedScope === "CENTRAL" && !j.isCentral) return;
      if (selectedScope === "STATE" && j.isCentral) return;
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const textToMatch = `${j.title} ${j.shortTitle} ${j.organization} ${j.orgShortCode} ${j.category}`.toLowerCase();
        if (!textToMatch.includes(q)) return;
      }

      counts.ALL += 1;
      if (matchesStatus(j, "APPLY_OPEN")) counts.APPLY_OPEN += 1;
      if (matchesStatus(j, "CLOSING_SOON")) counts.CLOSING_SOON += 1;
      if (matchesStatus(j, "ADMIT_CARD")) counts.ADMIT_CARD += 1;
      if (matchesStatus(j, "RESULT")) counts.RESULT += 1;
    });

    return counts;
  }, [jobs, selectedCategory, selectedScope, searchQuery]);

  const currentCategoryConfig = useMemo(() => {
    return STATUS_CATEGORIES.find((c) => c.key === activeCategory) || STATUS_CATEGORIES[0];
  }, [activeCategory]);

  const heroJob = filteredJobs[0] || jobs[0];
  const sideJobs = filteredJobs.slice(1, 6);

  return (
    <section id="major-recruitments" className="space-y-4 scroll-mt-20">
      {/* Section Header with Live View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-navy-solid" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink">
              Latest government jobs
            </h2>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Open jobs closing soonest first, then admit cards and results
          </p>
        </div>

        {/* View Mode Switcher Toggle */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-md bg-navy-tint border border-navy-line self-start sm:self-auto text-xs">
          <span className="text-[11px] uppercase font-mono text-navy font-bold px-2 hidden md:inline">
            Layout:
          </span>

          <button
            onClick={() => setViewMode("ledger")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded font-semibold transition-all",
              viewMode === "ledger"
                ? "bg-navy-solid text-white shadow-2xs"
                : "text-navy hover:bg-surface/60"
            )}
            title="Compact list"
          >
            <Table className="w-3.5 h-3.5" />
            <span>List</span>
          </button>

          <button
            onClick={() => setViewMode("spotlight")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded font-semibold transition-all",
              viewMode === "spotlight"
                ? "bg-navy-solid text-white shadow-2xs"
                : "text-navy hover:bg-surface/60"
            )}
            title="One featured job and a short list"
          >
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>Featured</span>
          </button>

          <button
            onClick={() => setViewMode("bulletin")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded font-semibold transition-all",
              viewMode === "bulletin"
                ? "bg-navy-solid text-white shadow-2xs"
                : "text-navy hover:bg-surface/60"
            )}
            title="Card grid layout"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
        </div>
      </div>

      {/* ================= UNIVERSAL LIVE SEARCH & MULTI-FACET FILTER BAR ================= */}
      <div className="bg-surface rounded-lg border border-line p-3 sm:p-3.5 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5">
          {/* Instant Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-faint absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by post, exam or organisation (e.g. SSC, KEA, BPSC)"
              className="w-full pl-9 pr-8 py-2.5 sm:py-2 text-[15px] sm:text-xs min-h-[44px] sm:min-h-0 bg-subtle border border-line rounded-lg focus:outline-none focus:border-navy text-ink placeholder-faint transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-faint hover:text-ink p-1"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Toggles / Selects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex items-center gap-2">
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full lg:w-auto px-3 py-2.5 sm:py-2 text-[14px] sm:text-xs min-h-[44px] sm:min-h-0 bg-subtle border border-line rounded-lg text-ink font-medium focus:outline-none focus:border-navy transition-colors cursor-pointer"
            >
              <option value="ALL">All Categories / Sectors</option>
              {JOB_CATEGORIES.filter((c) => c !== "ALL").map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Qualification Dropdown */}
            <select
              value={selectedQualification}
              onChange={(e) => setSelectedQualification(e.target.value)}
              className="w-full lg:w-auto px-3 py-2.5 sm:py-2 text-[14px] sm:text-xs min-h-[44px] sm:min-h-0 bg-subtle border border-line rounded-lg text-ink font-medium focus:outline-none focus:border-navy transition-colors cursor-pointer"
            >
              {QUALIFICATIONS.map((q) => (
                <option key={q.value} value={q.value}>
                  {q.label}
                </option>
              ))}
            </select>

            {/* Scope (Central / State) Toggle */}
            <div className="col-span-full sm:col-span-2 lg:col-span-1 flex rounded-lg border border-line bg-subtle p-0.5 text-xs font-semibold min-h-[44px] sm:min-h-0">
              <button
                onClick={() => setSelectedScope("ALL")}
                className={cn(
                  "flex-1 px-3 py-1.5 sm:py-1 rounded-md text-xs sm:text-[12px] transition-colors flex items-center justify-center font-bold",
                  selectedScope === "ALL" ? "bg-navy-solid text-white" : "text-muted hover:text-ink"
                )}
              >
                All
              </button>
              <button
                onClick={() => setSelectedScope("CENTRAL")}
                className={cn(
                  "flex-1 px-3 py-1.5 sm:py-1 rounded-md text-xs sm:text-[12px] transition-colors flex items-center justify-center font-bold",
                  selectedScope === "CENTRAL" ? "bg-navy-solid text-white" : "text-muted hover:text-ink"
                )}
              >
                Central
              </button>
              <button
                onClick={() => setSelectedScope("STATE")}
                className={cn(
                  "flex-1 px-3 py-1.5 sm:py-1 rounded-md text-xs sm:text-[12px] transition-colors flex items-center justify-center font-bold",
                  selectedScope === "STATE" ? "bg-navy-solid text-white" : "text-muted hover:text-ink"
                )}
              >
                State
              </button>
            </div>
          </div>
        </div>


        {/* Results Counter & Active Filter Pills */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-line-soft text-muted">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[12px] font-bold text-navy">
              Showing {filteredJobs.length} verified {filteredJobs.length === 1 ? "notice" : "notices"}
            </span>

            {hasActiveFilters && (
              <>
                <span className="text-faint">·</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 bg-navy-tint text-navy px-2 py-0.5 rounded text-[11px] font-bold border border-navy-line">
                    &ldquo;{searchQuery}&rdquo;
                    <button onClick={() => setSearchQuery("")} className="hover:text-danger"><X className="w-2.5 h-2.5" /></button>
                  </span>
                )}
                {selectedCategory !== "ALL" && (
                  <span className="inline-flex items-center gap-1 bg-navy-tint text-navy px-2 py-0.5 rounded text-[11px] font-bold border border-navy-line">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory("ALL")} className="hover:text-danger"><X className="w-2.5 h-2.5" /></button>
                  </span>
                )}
                {selectedQualification !== "ALL" && (
                  <span className="inline-flex items-center gap-1 bg-navy-tint text-navy px-2 py-0.5 rounded text-[11px] font-bold border border-navy-line">
                    {QUALIFICATIONS.find((q) => q.value === selectedQualification)?.label}
                    <button onClick={() => setSelectedQualification("ALL")} className="hover:text-danger"><X className="w-2.5 h-2.5" /></button>
                  </span>
                )}
                {selectedScope !== "ALL" && (
                  <span className="inline-flex items-center gap-1 bg-navy-tint text-navy px-2 py-0.5 rounded text-[11px] font-bold border border-navy-line">
                    Scope: {selectedScope}
                    <button onClick={() => setSelectedScope("ALL")} className="hover:text-danger"><X className="w-2.5 h-2.5" /></button>
                  </span>
                )}
              </>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1 text-danger hover:underline font-bold text-[12px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= 4-CATEGORY STATUTORY LIFECYCLE TABS ================= */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {STATUS_CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.key];
            const isActive = activeCategory === cat.key;
            const Icon = cat.icon;

            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={cn(
                  "p-3 rounded-lg border text-left transition-all relative flex flex-col justify-between group shadow-2xs hover:shadow-xs",
                  isActive
                    ? "bg-surface border-navy ring-2 ring-navy/15"
                    : "bg-surface border-line hover:border-navy-line hover:bg-subtle"
                )}
              >
                {/* Active Indicator Bar at Top */}
                {isActive && (
                  <div className={cn("absolute top-0 left-0 right-0 h-1 rounded-t-lg", cat.activeBg)} />
                )}

                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("w-2 h-2 rounded-full", cat.dotColor)} />
                    <span className="text-[11px] uppercase font-mono font-bold tracking-wider text-muted">
                      {cat.badgeText}
                    </span>
                  </div>
                  <Icon className={cn("w-3.5 h-3.5", isActive ? "text-navy" : "text-faint")} />
                </div>

                <div>
                  <div className="flex items-baseline justify-between gap-1">
                    <span className={cn("text-xs sm:text-sm font-bold font-serif leading-tight", isActive ? "text-navy" : "text-ink")}>
                      {cat.shortLabel}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-mono font-bold px-1.5 py-0.2 rounded border",
                        isActive
                          ? "bg-navy-solid text-white border-navy"
                          : "bg-navy-tint text-navy border-navy-line"
                      )}
                    >
                      {count}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Category Description Banner */}
        <div className="px-3.5 py-2 rounded-md bg-subtle border border-line flex items-center justify-between text-xs text-ink-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-navy shrink-0" />
            <span>{currentCategoryConfig.description}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveCategory(activeCategory === "ALL" ? "APPLY_OPEN" : "ALL")}
              className={cn(
                "text-[12px] font-mono font-bold px-2 py-0.5 rounded transition-colors",
                activeCategory === "ALL"
                  ? "bg-navy-solid text-white"
                  : "text-navy hover:underline"
              )}
            >
              {activeCategory === "ALL" ? "✓ Viewing All Stages" : "View All (Combined) →"}
            </button>
          </div>
        </div>
      </div>

      {/* ================= LIST VIEW: cards on phones, a table on wider screens ================= */}
      {viewMode === "ledger" && (
        <ul className="md:hidden space-y-2.5">
          {filteredJobs.length === 0 && (
            <li className="py-8 text-center text-sm text-muted">
              No jobs match these filters.{" "}
              <button onClick={resetAllFilters} className="font-bold text-navy underline">Clear filters</button>
            </li>
          )}
          {filteredJobs.slice(0, visible).map((job) => (
            <li key={job.id}>
              <JobListCard job={job} />
            </li>
          ))}
        </ul>
      )}
      {viewMode === "ledger" && (
        <div className="hidden md:block bg-surface rounded-lg border border-line overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-subtle border-b border-line text-muted font-mono text-[12px] uppercase tracking-wider">
                  <th className="py-3 px-4 font-bold text-navy">Posts</th>
                  <th className="py-3 px-4 font-bold text-ink">Recruitment</th>
                  <th className="py-3 px-4 font-semibold hidden md:table-cell">Sector</th>
                  <th className="py-3 px-4 font-semibold hidden lg:table-cell">Status</th>
                  <th className="py-3 px-4 font-semibold">Last date</th>
                  <th className="py-3 px-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-xs text-muted">
                      <div className="max-w-sm mx-auto space-y-2">
                        <p className="font-serif text-base font-bold text-ink">
                          No jobs match these filters
                        </p>
                        <p className="text-xs text-muted">
                          Try adjusting your search keyword or resetting category/qualification filters.
                        </p>
                        <button
                          onClick={resetAllFilters}
                          className="mt-2 px-3 py-1.5 rounded bg-navy-solid text-white font-bold text-xs shadow-2xs hover:bg-navy-strong transition-colors"
                        >
                          Clear filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredJobs.slice(0, visible).map((job) => {
                    const daysLeft = getDaysRemaining(job.applicationEndDate);
                    const isEndingSoon = daysLeft > 0 && daysLeft <= 10;
                    const catColors = getCategoryColors(job.category);
                    const detailLink = job.isCentral
                      ? `/jobs/${job.slug}`
                      : `/state/${job.stateSlug}/jobs/${job.slug}`;
                    const saved = isSaved(job.id);

                    return (
                      <tr
                        key={job.id}
                        className="hover:bg-subtle transition-colors group"
                      >
                        {/* Vacancy Column */}
                        <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                          <span className="font-bold text-sm text-navy">
                            {job.totalVacancies ? job.totalVacancies.toLocaleString("en-IN") : "—"}
                          </span>
                          <span className="text-[11px] text-muted block">
                            posts
                          </span>
                        </td>

                        {/* Title & Board */}
                        <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-mono text-[11px] uppercase font-bold text-navy bg-navy-tint px-1.5 py-0.2 rounded border border-navy-line">
                              {job.orgShortCode}
                            </span>
                            <span className="text-faint">·</span>
                            <span className="text-[11px] text-muted font-medium">
                              {job.isCentral ? "Central Govt" : `${job.stateSlug.toUpperCase()} State`}
                            </span>
                          </div>
                          <Link
                            href={detailLink}
                            className="font-serif font-bold text-sm text-ink group-hover:text-navy transition-colors leading-snug line-clamp-2"
                          >
                            {job.shortTitle}
                          </Link>
                          <p className="text-[12px] text-muted line-clamp-1 mt-0.5 font-medium">
                            {job.organization}
                          </p>
                        </td>

                        {/* Category Tag */}
                        <td className="py-3.5 px-4 hidden md:table-cell whitespace-nowrap">
                          <span
                            className={cn(
                              "inline-block px-2 py-0.5 rounded text-[11px] font-bold border",
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
                              <span className="text-[11px] font-mono text-navy font-bold block">Exam Date</span>
                              <span className="font-bold text-xs text-ink">{job.examDate || "Active"}</span>
                            </div>
                          ) : job.status === "RESULT_OUT" ? (
                            <div>
                              <span className="font-bold text-xs text-green">Result out</span>
                            </div>
                          ) : (
                            <div>
                              <div className={cn("font-medium", isEndingSoon ? "text-saffron font-bold" : "text-ink")}>
                                {formatDate(job.applicationEndDate)}
                              </div>
                              {isEndingSoon && (
                                <span className="text-[11px] text-saffron font-bold">
                                  {daysLeft}d left
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            {/* Watchlist Pin Button */}
                            <button
                              onClick={() => toggleSave(job.id)}
                              className={cn(
                                "p-1.5 rounded transition-colors",
                                saved
                                  ? "text-saffron hover:text-saffron bg-saffron-tint"
                                  : "text-faint hover:text-navy hover:bg-navy-tint"
                              )}
                              title={saved ? "Remove from saved jobs" : "Save this job"}
                              aria-label={saved ? "Remove from saved jobs" : "Save this job"}
                            >
                              <Bookmark className={cn("w-3.5 h-3.5", saved && "fill-saffron-bright")} />
                            </button>

                            <a
                              href={job.officialPdfUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded hover:bg-navy-tint text-muted hover:text-navy transition-colors"
                              title="Official notification"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </a>

                            <Link
                              href={detailLink}
                              className="px-2.5 py-1 rounded bg-saffron-tint border border-saffron-line text-saffron hover:bg-saffron-solid hover:text-white font-bold text-[12px] transition-colors inline-flex items-center gap-1"
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

      {viewMode === "ledger" && filteredJobs.length > visible && (
        <div className="text-center">
          <button
            onClick={() => setVisible((v) => v + 20)}
            className="px-4 py-2.5 rounded-lg border border-navy-line bg-surface text-sm font-bold text-navy hover:border-navy"
          >
            Show more ({filteredJobs.length - visible} more)
          </button>
        </div>
      )}

      {/* ================= OPTION 2: THE EDITORIAL SPOTLIGHT (SPLIT) ================= */}
      {viewMode === "spotlight" && (
        filteredJobs.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted bg-surface rounded-lg border border-line">
            <p className="font-serif text-base font-bold text-ink">No circulars found matching criteria</p>
            <button onClick={resetAllFilters} className="mt-2 px-3 py-1.5 rounded bg-navy-solid text-white font-bold text-xs">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Main Hero Spotlight (7 Cols) */}
            <div className="lg:col-span-7 bg-surface rounded-lg border border-line p-6 flex flex-col justify-between shadow-2xs relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-navy-solid" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-navy-tint text-navy font-bold border border-navy-line">
                      {currentCategoryConfig.badgeText}
                    </span>
                    <span className="text-xs text-muted font-mono font-medium">
                      {heroJob.orgShortCode} · {heroJob.isCentral ? "Central Govt" : `${heroJob.stateSlug.toUpperCase()} State`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <JobStatusBadge status={heroJob.status} />
                    <button
                      onClick={() => toggleSave(heroJob.id)}
                      className="p-1 rounded text-faint hover:text-saffron transition-colors"
                      title={isSaved(heroJob.id) ? "Unpin notice" : "Pin notice"}
                    >
                      <Bookmark className={cn("w-4 h-4", isSaved(heroJob.id) && "fill-saffron-bright text-saffron")} />
                    </button>
                  </div>
                </div>

                <Link
                  href={heroJob.isCentral ? `/jobs/${heroJob.slug}` : `/state/${heroJob.stateSlug}/jobs/${heroJob.slug}`}
                  className="group block"
                >
                  <h3 className="font-serif text-2xl font-bold text-ink group-hover:text-navy transition-colors leading-snug">
                    {heroJob.title}
                  </h3>
                </Link>

                <p className="text-xs text-muted mt-1.5 font-medium">
                  Official Commission: {heroJob.organization}
                </p>

                {/* Big Metrics Grid */}
                <div className="grid grid-cols-3 gap-3 my-5 p-3.5 rounded-lg bg-subtle border border-line text-xs">
                  <div>
                    <span className="text-[11px] text-muted uppercase font-mono block">Total Posts</span>
                    <span className="font-serif text-xl font-bold text-navy mt-0.5 block">
                      {heroJob.totalVacancies ? heroJob.totalVacancies.toLocaleString("en-IN") : "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted uppercase font-mono block">Age Bracket</span>
                    <span className="font-bold text-sm text-ink mt-1 block">
                      {formatAgeRange(heroJob)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted uppercase font-mono block">Status Date</span>
                    <span className="font-bold text-sm text-saffron mt-1 block">
                      {formatDate(heroJob.applicationEndDate)}
                    </span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-1.5 mb-5 text-xs text-ink-2">
                  {heroJob.keyHighlights.slice(0, 2).map((hl, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-4 border-t border-line-soft flex items-center gap-3">
                <Link
                  href={heroJob.isCentral ? `/jobs/${heroJob.slug}` : `/state/${heroJob.stateSlug}/jobs/${heroJob.slug}`}
                  className="flex-1 py-2.5 px-4 rounded-md bg-saffron-solid hover:bg-saffron-strong text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Full details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href={heroJob.officialPdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-4 rounded-md bg-navy-tint border border-navy-line hover:bg-navy-tint-2 text-navy text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-navy" />
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
                    className="bg-surface rounded-lg border border-line p-3.5 hover:border-navy/40 transition-colors flex items-start gap-3 shadow-2xs relative"
                  >
                    {/* Vacancy Block */}
                    <div className="w-16 h-16 rounded bg-navy-tint border border-navy-line flex flex-col items-center justify-center text-center shrink-0">
                      <span className="font-serif font-bold text-sm text-navy leading-none">
                        {job.totalVacancies >= 1000
                          ? `${(job.totalVacancies / 1000).toFixed(1)}k`
                          : job.totalVacancies}
                      </span>
                      <span className="text-[9px] text-navy/70 font-mono mt-0.5 uppercase font-semibold">
                        posts
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-mono text-muted font-bold">
                            {job.orgShortCode}
                          </span>
                          <span className="text-faint">·</span>
                          <span className="text-[11px] text-muted">
                            {job.status === "ADMIT_CARD_OUT" ? "Admit Card Out" : job.status === "RESULT_OUT" ? "Result Live" : `Ends ${formatDate(job.applicationEndDate)}`}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleSave(job.id)}
                          className="text-faint hover:text-saffron transition-colors p-0.5"
                          title={isSaved(job.id) ? "Unpin notice" : "Pin notice"}
                        >
                          <Bookmark className={cn("w-3 h-3", isSaved(job.id) && "fill-saffron-bright text-saffron")} />
                        </button>
                      </div>

                      <Link
                        href={detailLink}
                        className="font-serif font-bold text-xs text-ink hover:text-navy transition-colors line-clamp-1 block leading-snug"
                      >
                        {job.title}
                      </Link>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-line-soft text-[12px]">
                        <span className="text-muted truncate">
                          {job.qualifications[0]}
                        </span>
                        <Link
                          href={detailLink}
                          className="text-saffron hover:text-saffron font-bold ml-2 shrink-0 inline-flex items-center gap-0.5"
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
        )
      )}

      {/* ================= OPTION 3: BULLETIN CARDS ================= */}
      {viewMode === "bulletin" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs text-muted bg-surface rounded-lg border border-line">
              <p className="font-serif text-base font-bold text-ink">No circulars found matching criteria</p>
              <button onClick={resetAllFilters} className="mt-2 px-3 py-1.5 rounded bg-navy-solid text-white font-bold text-xs">
                Reset Filters
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const saved = isSaved(job.id);
              return (
                <JobListCard
                  key={job.id}
                  job={job}
                  action={
                    <button
                      onClick={() => toggleSave(job.id)}
                      className={cn("p-1 rounded", saved ? "text-saffron" : "text-faint hover:text-navy")}
                      title={saved ? "Remove from saved" : "Save this job"}
                      aria-label={saved ? "Remove from saved" : "Save this job"}
                    >
                      <Bookmark className={cn("w-4 h-4", saved && "fill-saffron-bright")} />
                    </button>
                  }
                />
              );
            })
          )}
        </div>
      )}
    </section>
  );
}
