"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { 
  JobNotification, 
  getCategoryColors,
  formatAgeRange,
} from "@/data/jobs";
import { JobStatusBadge } from "./JobStatusBadge";
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE2D2]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E3799]" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1918]">
              Latest government jobs
            </h2>
          </div>
          <p className="text-xs text-[#68635B] mt-0.5">
            Open jobs closing soonest first, then admit cards and results
          </p>
        </div>

        {/* View Mode Switcher Toggle */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-md bg-[#EEF2FA] border border-[#CCD8F0] self-start sm:self-auto text-xs">
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
                ? "bg-[#1E3799] text-white shadow-2xs"
                : "text-[#1E3799] hover:bg-white/60"
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
                ? "bg-[#1E3799] text-white shadow-2xs"
                : "text-[#1E3799] hover:bg-white/60"
            )}
            title="Card grid layout"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
        </div>
      </div>

      {/* ================= UNIVERSAL LIVE SEARCH & MULTI-FACET FILTER BAR ================= */}
      <div className="bg-white rounded-lg border border-[#EAE2D2] p-3 sm:p-3.5 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5">
          {/* Instant Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8C8273] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by post, exam or organisation (e.g. SSC, KEA, BPSC)"
              className="w-full pl-9 pr-8 py-2.5 sm:py-2 text-[15px] sm:text-xs min-h-[44px] sm:min-h-0 bg-[#FCFAF4] border border-[#DDD5C7] rounded-lg focus:outline-none focus:border-[#1E3799] text-[#1A1918] placeholder-[#8C8273] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C8273] hover:text-[#1A1918] p-1"
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
              className="w-full lg:w-auto px-3 py-2.5 sm:py-2 text-[14px] sm:text-xs min-h-[44px] sm:min-h-0 bg-[#FCFAF4] border border-[#DDD5C7] rounded-lg text-[#1A1918] font-medium focus:outline-none focus:border-[#1E3799] transition-colors cursor-pointer"
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
              className="w-full lg:w-auto px-3 py-2.5 sm:py-2 text-[14px] sm:text-xs min-h-[44px] sm:min-h-0 bg-[#FCFAF4] border border-[#DDD5C7] rounded-lg text-[#1A1918] font-medium focus:outline-none focus:border-[#1E3799] transition-colors cursor-pointer"
            >
              {QUALIFICATIONS.map((q) => (
                <option key={q.value} value={q.value}>
                  {q.label}
                </option>
              ))}
            </select>

            {/* Scope (Central / State) Toggle */}
            <div className="col-span-full sm:col-span-2 lg:col-span-1 flex rounded-lg border border-[#DDD5C7] bg-[#FCFAF4] p-0.5 text-xs font-semibold min-h-[44px] sm:min-h-0">
              <button
                onClick={() => setSelectedScope("ALL")}
                className={cn(
                  "flex-1 px-3 py-1.5 sm:py-1 rounded-md text-xs sm:text-[11px] transition-colors flex items-center justify-center font-bold",
                  selectedScope === "ALL" ? "bg-[#1E3799] text-white" : "text-[#68635B] hover:text-[#1A1918]"
                )}
              >
                All
              </button>
              <button
                onClick={() => setSelectedScope("CENTRAL")}
                className={cn(
                  "flex-1 px-3 py-1.5 sm:py-1 rounded-md text-xs sm:text-[11px] transition-colors flex items-center justify-center font-bold",
                  selectedScope === "CENTRAL" ? "bg-[#1E3799] text-white" : "text-[#68635B] hover:text-[#1A1918]"
                )}
              >
                Central
              </button>
              <button
                onClick={() => setSelectedScope("STATE")}
                className={cn(
                  "flex-1 px-3 py-1.5 sm:py-1 rounded-md text-xs sm:text-[11px] transition-colors flex items-center justify-center font-bold",
                  selectedScope === "STATE" ? "bg-[#1E3799] text-white" : "text-[#68635B] hover:text-[#1A1918]"
                )}
              >
                State
              </button>
            </div>
          </div>
        </div>


        {/* Results Counter & Active Filter Pills */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F2ECE1] text-[#68635B]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[11px] font-bold text-[#1E3799]">
              Showing {filteredJobs.length} verified {filteredJobs.length === 1 ? "notice" : "notices"}
            </span>

            {hasActiveFilters && (
              <>
                <span className="text-[#D8CFBF]">·</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 bg-[#EEF2FA] text-[#1E3799] px-2 py-0.5 rounded text-[10px] font-bold border border-[#CCD8F0]">
                    &ldquo;{searchQuery}&rdquo;
                    <button onClick={() => setSearchQuery("")} className="hover:text-red-600"><X className="w-2.5 h-2.5" /></button>
                  </span>
                )}
                {selectedCategory !== "ALL" && (
                  <span className="inline-flex items-center gap-1 bg-[#EEF2FA] text-[#1E3799] px-2 py-0.5 rounded text-[10px] font-bold border border-[#CCD8F0]">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory("ALL")} className="hover:text-red-600"><X className="w-2.5 h-2.5" /></button>
                  </span>
                )}
                {selectedQualification !== "ALL" && (
                  <span className="inline-flex items-center gap-1 bg-[#EEF2FA] text-[#1E3799] px-2 py-0.5 rounded text-[10px] font-bold border border-[#CCD8F0]">
                    {QUALIFICATIONS.find((q) => q.value === selectedQualification)?.label}
                    <button onClick={() => setSelectedQualification("ALL")} className="hover:text-red-600"><X className="w-2.5 h-2.5" /></button>
                  </span>
                )}
                {selectedScope !== "ALL" && (
                  <span className="inline-flex items-center gap-1 bg-[#EEF2FA] text-[#1E3799] px-2 py-0.5 rounded text-[10px] font-bold border border-[#CCD8F0]">
                    Scope: {selectedScope}
                    <button onClick={() => setSelectedScope("ALL")} className="hover:text-red-600"><X className="w-2.5 h-2.5" /></button>
                  </span>
                )}
              </>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1 text-[#C41C1C] hover:underline font-bold text-[11px]"
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
                    ? "bg-white border-[#1E3799] ring-2 ring-[#1E3799]/15"
                    : "bg-white border-[#EAE2D2] hover:border-[#CCD8F0] hover:bg-[#FAF7EF]"
                )}
              >
                {/* Active Indicator Bar at Top */}
                {isActive && (
                  <div className={cn("absolute top-0 left-0 right-0 h-1 rounded-t-lg", cat.activeBg)} />
                )}

                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("w-2 h-2 rounded-full", cat.dotColor)} />
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#68635B]">
                      {cat.badgeText}
                    </span>
                  </div>
                  <Icon className={cn("w-3.5 h-3.5", isActive ? "text-[#1E3799]" : "text-[#8C8273]")} />
                </div>

                <div>
                  <div className="flex items-baseline justify-between gap-1">
                    <span className={cn("text-xs sm:text-sm font-bold font-serif leading-tight", isActive ? "text-[#1E3799]" : "text-[#1A1918]")}>
                      {cat.shortLabel}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-mono font-bold px-1.5 py-0.2 rounded border",
                        isActive
                          ? "bg-[#1E3799] text-white border-[#1E3799]"
                          : "bg-[#EEF2FA] text-[#1E3799] border-[#CCD8F0]"
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
        <div className="px-3.5 py-2 rounded-md bg-[#FAF7EF] border border-[#EAE2D2] flex items-center justify-between text-xs text-[#524E48]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#1E3799] shrink-0" />
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

      {/* ================= LIST VIEW: cards on phones, a table on wider screens ================= */}
      {viewMode === "ledger" && (
        <ul className="md:hidden space-y-2.5">
          {filteredJobs.length === 0 && (
            <li className="py-8 text-center text-sm text-[#68635B]">
              No jobs match these filters.{" "}
              <button onClick={resetAllFilters} className="font-bold text-[#1E3799] underline">Clear filters</button>
            </li>
          )}
          {filteredJobs.slice(0, visible).map((job) => {
            const daysLeft = getDaysRemaining(job.applicationEndDate);
            const open = job.status === "APPLY_OPEN" || job.status === "LAST_DATE_NEAR";
            const detailLink = job.isCentral ? `/jobs/${job.slug}` : `/state/${job.stateSlug}/jobs/${job.slug}`;
            return (
              <li key={job.id}>
                <Link href={detailLink} className="block p-3.5 rounded-lg bg-white border border-[#EAE2D2] active:border-[#1E3799]">
                  <span className="text-[11px] font-bold text-[#1E3799]">
                    {job.orgShortCode} · {job.isCentral ? "Central" : job.stateSlug.toUpperCase()}
                  </span>
                  <p className="mt-0.5 font-serif font-bold text-[15px] leading-snug text-[#1A1918] line-clamp-2">{job.shortTitle}</p>
                  <div className="mt-1.5 flex items-center justify-between gap-2 text-xs">
                    <span className="text-[#524E48]">
                      {job.totalVacancies ? `${job.totalVacancies.toLocaleString("en-IN")} posts` : "Posts: see notification"}
                    </span>
                    <span className={cn("font-bold", open && daysLeft <= 7 ? "text-[#E96B15]" : "text-[#1A1918]")}>
                      {job.status === "ADMIT_CARD_OUT" ? "Admit card out"
                        : job.status === "RESULT_OUT" ? "Result out"
                        : job.applicationEndDate
                          ? `${job.isWalkIn ? "Walk-in" : "Last date"} ${formatDate(job.applicationEndDate)}${open && daysLeft >= 0 ? ` · ${daysLeft}d left` : ""}`
                          : "See notification"}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      {viewMode === "ledger" && (
        <div className="hidden md:block bg-white rounded-lg border border-[#EAE2D2] overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF7EC] border-b border-[#EAE2D2] text-[#68635B] font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 font-bold text-[#1E3799]">Posts</th>
                  <th className="py-3 px-4 font-bold text-[#1A1918]">Recruitment</th>
                  <th className="py-3 px-4 font-semibold hidden md:table-cell">Sector</th>
                  <th className="py-3 px-4 font-semibold hidden lg:table-cell">Status</th>
                  <th className="py-3 px-4 font-semibold">Last date</th>
                  <th className="py-3 px-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE1]">
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-xs text-[#68635B]">
                      <div className="max-w-sm mx-auto space-y-2">
                        <p className="font-serif text-base font-bold text-[#1A1918]">
                          No jobs match these filters
                        </p>
                        <p className="text-xs text-[#68635B]">
                          Try adjusting your search keyword or resetting category/qualification filters.
                        </p>
                        <button
                          onClick={resetAllFilters}
                          className="mt-2 px-3 py-1.5 rounded bg-[#1E3799] text-white font-bold text-xs shadow-2xs hover:bg-[#162a75] transition-colors"
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
                        className="hover:bg-[#FCFAF4] transition-colors group"
                      >
                        {/* Vacancy Column */}
                        <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                          <span className="font-bold text-sm text-[#1E3799]">
                            {job.totalVacancies ? job.totalVacancies.toLocaleString("en-IN") : "—"}
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
                            className="font-serif font-bold text-sm text-[#1A1918] group-hover:text-[#1E3799] transition-colors leading-snug line-clamp-2"
                          >
                            {job.shortTitle}
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
                              <span className="font-bold text-xs text-[#209948]">Result out</span>
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
                          <div className="inline-flex items-center gap-1.5">
                            {/* Watchlist Pin Button */}
                            <button
                              onClick={() => toggleSave(job.id)}
                              className={cn(
                                "p-1.5 rounded transition-colors",
                                saved
                                  ? "text-[#E96B15] hover:text-[#D4590A] bg-[#FDF3EB]"
                                  : "text-[#8C8273] hover:text-[#1E3799] hover:bg-[#EEF2FA]"
                              )}
                              title={saved ? "Remove from saved jobs" : "Save this job"}
                              aria-label={saved ? "Remove from saved jobs" : "Save this job"}
                            >
                              <Bookmark className={cn("w-3.5 h-3.5", saved && "fill-[#E96B15]")} />
                            </button>

                            <a
                              href={job.officialPdfUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded hover:bg-[#EEF2FA] text-[#68635B] hover:text-[#1E3799] transition-colors"
                              title="Official notification"
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

      {viewMode === "ledger" && filteredJobs.length > visible && (
        <div className="text-center">
          <button
            onClick={() => setVisible((v) => v + 20)}
            className="px-4 py-2.5 rounded-lg border border-[#CCD8F0] bg-white text-sm font-bold text-[#1E3799] hover:border-[#1E3799]"
          >
            Show more ({filteredJobs.length - visible} more)
          </button>
        </div>
      )}

      {/* ================= OPTION 2: THE EDITORIAL SPOTLIGHT (SPLIT) ================= */}
      {viewMode === "spotlight" && (
        filteredJobs.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#68635B] bg-white rounded-lg border border-[#EAE2D2]">
            <p className="font-serif text-base font-bold text-[#1A1918]">No circulars found matching criteria</p>
            <button onClick={resetAllFilters} className="mt-2 px-3 py-1.5 rounded bg-[#1E3799] text-white font-bold text-xs">
              Reset Filters
            </button>
          </div>
        ) : (
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
                  <div className="flex items-center gap-1.5">
                    <JobStatusBadge status={heroJob.status} />
                    <button
                      onClick={() => toggleSave(heroJob.id)}
                      className="p-1 rounded text-[#8C8273] hover:text-[#E96B15] transition-colors"
                      title={isSaved(heroJob.id) ? "Unpin notice" : "Pin notice"}
                    >
                      <Bookmark className={cn("w-4 h-4", isSaved(heroJob.id) && "fill-[#E96B15] text-[#E96B15]")} />
                    </button>
                  </div>
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
                      {heroJob.totalVacancies ? heroJob.totalVacancies.toLocaleString("en-IN") : "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#68635B] uppercase font-mono block">Age Bracket</span>
                    <span className="font-bold text-sm text-[#1A1918] mt-1 block">
                      {formatAgeRange(heroJob)}
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
                  <span>Full details</span>
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
                    className="bg-white rounded-lg border border-[#EAE2D2] p-3.5 hover:border-[#1E3799]/40 transition-colors flex items-start gap-3 shadow-2xs relative"
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
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-[#68635B] font-bold">
                            {job.orgShortCode}
                          </span>
                          <span className="text-[#D8CFBF]">·</span>
                          <span className="text-[10px] text-[#68635B]">
                            {job.status === "ADMIT_CARD_OUT" ? "Admit Card Out" : job.status === "RESULT_OUT" ? "Result Live" : `Ends ${formatDate(job.applicationEndDate)}`}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleSave(job.id)}
                          className="text-[#8C8273] hover:text-[#E96B15] transition-colors p-0.5"
                          title={isSaved(job.id) ? "Unpin notice" : "Pin notice"}
                        >
                          <Bookmark className={cn("w-3 h-3", isSaved(job.id) && "fill-[#E96B15] text-[#E96B15]")} />
                        </button>
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
        )
      )}

      {/* ================= OPTION 3: BULLETIN CARDS ================= */}
      {viewMode === "bulletin" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs text-[#68635B] bg-white rounded-lg border border-[#EAE2D2]">
              <p className="font-serif text-base font-bold text-[#1A1918]">No circulars found matching criteria</p>
              <button onClick={resetAllFilters} className="mt-2 px-3 py-1.5 rounded bg-[#1E3799] text-white font-bold text-xs">
                Reset Filters
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const catColors = getCategoryColors(job.category);
              const detailLink = job.isCentral
                ? `/jobs/${job.slug}`
                : `/state/${job.stateSlug}/jobs/${job.slug}`;
              const saved = isSaved(job.id);

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
                      <div className="flex items-center gap-1.5">
                        <JobStatusBadge status={job.status} />
                        <button
                          onClick={() => toggleSave(job.id)}
                          className="p-1 rounded text-[#8C8273] hover:text-[#E96B15] transition-colors"
                          title={saved ? "Unpin notice" : "Pin notice"}
                        >
                          <Bookmark className={cn("w-3.5 h-3.5", saved && "fill-[#E96B15] text-[#E96B15]")} />
                        </button>
                      </div>
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
                        {job.totalVacancies ? `${job.totalVacancies.toLocaleString("en-IN")} Posts` : "Posts: see notice"}
                      </span>
                      <span className="text-[#68635B] text-[11px]">
                        {formatAgeRange(job)}
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
