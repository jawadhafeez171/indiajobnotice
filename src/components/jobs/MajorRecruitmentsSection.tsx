"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { 
  JobNotification, 
  formatAgeRange,
  nextExamDate,
  getJobCanonicalPath,
} from "@/data/jobs";
import { JobStatusBadge } from "./JobStatusBadge";
import { JobListCard, JobRow, JobDeadline, STATUS_STYLE, qualificationLabel, cleanTitle, placeLabel } from "./JobListCard";
import { formatDate, getDaysRemaining, cn } from "@/lib/utils";
import { useWatchlist } from "@/lib/watchlist";
import { getStateBySlug } from "@/config/states";
import { 
  Table, 
  LayoutTemplate, 
  LayoutGrid, 
  FileText, 
  ArrowRight, 
  CheckCircle2,
  Search,
  SlidersHorizontal,
  X,
  Bookmark,
} from "lucide-react";

interface Props {
  jobs: JobNotification[];
  currentStateSlug?: string;
  /** The page has its own search with every filter (home page): no search box or filter row here. */
  hideSearch?: boolean;
}

type ViewMode = "ledger" | "spotlight" | "bulletin";

export type StatusCategoryKey = 
  | "ALL"
  | "APPLY_OPEN"
  | "CLOSING_SOON"
  | "ADMIT_CARD"
  | "EXAM_DATES"
  | "RESULT";

// one row of tabs; the active one takes its stage colour (same as the card stripes)
export const TAB_ORDER: StatusCategoryKey[] = ["APPLY_OPEN", "CLOSING_SOON", "EXAM_DATES", "ADMIT_CARD", "RESULT", "ALL"];
export const TABS: Record<StatusCategoryKey, { label: string; short: string; active: string; order?: string }> = {
  APPLY_OPEN: { label: "Open", short: "Open", active: "bg-green-solid", order: "closing soonest first" },
  CLOSING_SOON: { label: "Closing soon", short: "Closing", active: "bg-saffron-solid", order: "closing soonest first" },
  EXAM_DATES: { label: "Exam dates", short: "Exams", active: "bg-navy-solid", order: "soonest exam first" },
  ADMIT_CARD: { label: "Admit cards", short: "Admit card", active: "bg-navy-solid" },
  RESULT: { label: "Results", short: "Results", active: "bg-purple-solid" },
  ALL: { label: "All", short: "All", active: "bg-ink-2", order: "open jobs first" },
};

export const JOB_CATEGORIES = [
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

export const QUALIFICATIONS = [
  { label: "All Qualifications", value: "ALL" },
  { label: "10th (Matric) Pass", value: "10th" },
  { label: "12th (Intermediate)", value: "12th" },
  { label: "Graduate (Any Stream)", value: "graduate" },
  { label: "Engineering / Diploma / ITI", value: "tech" },
  { label: "Teaching (B.Ed / CTET)", value: "teaching" },
];

/** Stage names in links (/?stage=closing) <-> tab keys. */
export const STAGE_PARAM: Record<string, StatusCategoryKey> = {
  open: "APPLY_OPEN", closing: "CLOSING_SOON", exams: "EXAM_DATES", admit: "ADMIT_CARD", results: "RESULT", all: "ALL",
};

export function MajorRecruitmentsSection({ jobs, currentStateSlug, hideSearch = false }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>("ledger");
  const [activeCategory, setActiveCategory] = useState<StatusCategoryKey>("APPLY_OPEN");
  
  // Search & Multi-Faceted Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedQualification, setSelectedQualification] = useState("ALL");
  const [selectedScope, setSelectedScope] = useState<"ALL" | "CENTRAL" | "STATE">("ALL");
  const [selectedState, setSelectedState] = useState("ALL");
  const [myAge, setMyAge] = useState<number | null>(null);
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
      } else if (hash === "#exam-dates") {
        setActiveCategory("EXAM_DATES");
      } else if (hash === "#apply-open") {
        setActiveCategory("APPLY_OPEN");
      } else if (hash === "#all-recruitments" || hash === "#major-recruitments") {
        setActiveCategory("ALL");
      } else {
        return;
      }
      // these hashes are tabs, not elements: bring the list into view
      document.getElementById("major-recruitments")?.scrollIntoView({ behavior: "smooth" });
    };
    handleHash();
    // search from the home page hero: /?q=...
    const applyQuery = () => {
      const u = new URLSearchParams(window.location.search);
      const keys = ["q", "state", "qual", "sector", "scope", "stage", "age"];
      if (!keys.some((k) => u.get(k))) return;
      const q = u.get("q") || "";
      const stage = STAGE_PARAM[u.get("stage") || ""];
      const qual = u.get("qual") || "";
      const sector = u.get("sector") || "";
      const scope = (u.get("scope") || "").toUpperCase();
      const age = Number(u.get("age"));
      setSearchQuery(q);
      if (u.get("state")) setSelectedState(u.get("state") as string);
      if (QUALIFICATIONS.some((x) => x.value === qual)) setSelectedQualification(qual);
      if (JOB_CATEGORIES.includes(sector)) setSelectedCategory(sector);
      if (scope === "CENTRAL" || scope === "STATE") setSelectedScope(scope);
      if (age >= 14 && age <= 70) setMyAge(age);
      // a search looks at every stage unless one was chosen
      setActiveCategory(stage || (q ? "ALL" : "APPLY_OPEN"));
      document.getElementById("major-recruitments")?.scrollIntoView();
    };
    applyQuery();
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
      case "EXAM_DATES":
        return nextExamDate(job) !== null;
      case "ALL":
      default:
        return true;
    }
  };

  // Check if any filter is actively applied
  const hasActiveFilters = searchQuery.trim() !== "" || selectedCategory !== "ALL" || selectedQualification !== "ALL"
    || selectedScope !== "ALL" || selectedState !== "ALL" || myAge !== null;
  const facetCount = [selectedCategory !== "ALL", selectedQualification !== "ALL", selectedScope !== "ALL",
    selectedState !== "ALL", myAge !== null].filter(Boolean).length;

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("ALL");
    setSelectedQualification("ALL");
    setSelectedScope("ALL");
    setSelectedState("ALL");
    setMyAge(null);
    setActiveCategory("ALL");
  };

  // every filter except the stage tab: used for the list and for the tab counts
  const passesFacets = (j: JobNotification): boolean => {
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      const textToMatch = `${j.title} ${j.shortTitle} ${j.organization} ${j.orgShortCode} ${j.category} ${j.stateSlug} ${j.keyHighlights.join(" ")} ${j.qualifications.join(" ")}`.toLowerCase();
      if (!textToMatch.includes(q)) return false;
    }
    if (selectedCategory !== "ALL" && j.category !== selectedCategory) return false;
    if (selectedQualification !== "ALL") {
      const quals = `${j.qualifications.join(" ")} ${qualificationLabel(j) || ""}`.toLowerCase();
      if (selectedQualification === "10th" && !quals.includes("10th") && !quals.includes("matric")) return false;
      if (selectedQualification === "12th" && !quals.includes("12th") && !quals.includes("intermediate")) return false;
      if (selectedQualification === "graduate" && !quals.includes("graduate") && !quals.includes("bachelor") && !quals.includes("degree")) return false;
      if (selectedQualification === "tech" && !quals.includes("iti") && !quals.includes("diploma") && !quals.includes("engineering") && !quals.includes("tech")) return false;
      if (selectedQualification === "teaching" && !quals.includes("b.ed") && !quals.includes("d.el.ed") && !quals.includes("ctet") && !quals.includes("stet")) return false;
    }
    if (selectedScope === "CENTRAL" && !j.isCentral) return false;
    if (selectedScope === "STATE" && j.isCentral) return false;
    // a state shows its own jobs plus central ones (open to everyone)
    if (selectedState !== "ALL" && !j.isCentral && j.stateSlug !== selectedState) return false;
    // age: only jobs whose stated limits include it; a notice that states no limit stays in
    if (myAge !== null && j.ageKnown !== false && j.maxAge > 0) {
      if (myAge > j.maxAge || (j.minAge && myAge < j.minAge)) return false;
    }
    return true;
  };

  // Filtered jobs matching all criteria
  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => matchesStatus(j, activeCategory) && passesFacets(j)).sort((a, b) => {
      if (activeCategory === "EXAM_DATES") {
        return (nextExamDate(a)?.date || "9999").localeCompare(nextExamDate(b)?.date || "9999");
      }
      const rank = (j: JobNotification) =>
        j.status === "APPLY_OPEN" || j.status === "LAST_DATE_NEAR" ? 0
          : j.status === "ADMIT_CARD_OUT" || j.status === "RESULT_OUT" ? 1 : 2;
      return rank(a) - rank(b)
        || (a.applicationEndDate || "9999").localeCompare(b.applicationEndDate || "9999")
        || b.totalVacancies - a.totalVacancies;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs, activeCategory, searchQuery, selectedCategory, selectedQualification, selectedScope, selectedState, myAge]);

  // Counts for each status category (respecting text search and facet filters)
  const categoryCounts = useMemo(() => {
    const counts: Record<StatusCategoryKey, number> = {
      ALL: 0,
      APPLY_OPEN: 0,
      CLOSING_SOON: 0,
      ADMIT_CARD: 0,
      EXAM_DATES: 0,
      RESULT: 0,
    };

    jobs.forEach((j) => {
      if (!passesFacets(j)) return;

      counts.ALL += 1;
      if (matchesStatus(j, "APPLY_OPEN")) counts.APPLY_OPEN += 1;
      if (matchesStatus(j, "CLOSING_SOON")) counts.CLOSING_SOON += 1;
      if (matchesStatus(j, "ADMIT_CARD")) counts.ADMIT_CARD += 1;
      if (matchesStatus(j, "EXAM_DATES")) counts.EXAM_DATES += 1;
      if (matchesStatus(j, "RESULT")) counts.RESULT += 1;
    });

    return counts;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs, selectedCategory, selectedQualification, selectedScope, selectedState, myAge, searchQuery]);


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
            From official notifications, checked twice a day
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

      {/* ================= STAGE TABS: one row, kept in view under the header while scrolling ================= */}
      <div className="sticky top-[109px] z-20 -mx-4 px-4 sm:mx-0 sm:px-0 py-2 bg-canvas/95 backdrop-blur-sm">
        <div role="tablist" aria-label="Job stages" className="grid grid-cols-3 gap-1.5 md:flex md:gap-2">
          {TAB_ORDER.map((key) => {
            const isActive = activeCategory === key;
            const t = TABS[key];
            return (
              <button
                key={key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(key)}
                className={cn(
                  "flex items-center justify-between md:justify-start gap-1.5 pl-2.5 pr-1.5 md:pl-3 md:pr-2 min-h-[38px] rounded-lg md:rounded-full border text-[13px] font-semibold whitespace-nowrap transition-colors",
                  isActive ? cn(t.active, "text-white border-transparent") : "bg-surface border-line text-ink-2 hover:border-navy"
                )}
              >
                <span className="md:hidden">{t.short}</span>
                <span className="hidden md:inline">{t.label}</span>
                <span
                  className={cn(
                    "min-w-[22px] px-1.5 py-0.5 rounded-full text-[12px] font-bold leading-none tabular-nums",
                    isActive ? "bg-white/20 text-white" : "bg-subtle text-muted"
                  )}
                >
                  {categoryCounts[key]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= COUNT, FILTERS ================= */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-3 text-[13px]">
          <p className="text-ink-2 min-w-0">
            <b className="text-ink">{filteredJobs.length}</b> {filteredJobs.length === 1 ? "job" : "jobs"}
            {TABS[activeCategory].order && <span className="text-muted"> · {TABS[activeCategory].order}</span>}
            {selectedState !== "ALL" && (
              <span className="ml-2 inline-flex items-center gap-1 bg-navy-tint text-navy px-2 py-0.5 rounded-full text-[12px] font-bold border border-navy-line align-middle">
                {getStateBySlug(selectedState)?.name || selectedState} + central
                <button onClick={() => setSelectedState("ALL")} aria-label="Clear state" className="hover:text-danger">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {myAge !== null && (
              <span className="ml-2 inline-flex items-center gap-1 bg-navy-tint text-navy px-2 py-0.5 rounded-full text-[12px] font-bold border border-navy-line align-middle">
                Age {myAge}
                <button onClick={() => setMyAge(null)} aria-label="Clear age" className="hover:text-danger">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {[
              selectedCategory !== "ALL" && { label: selectedCategory, clear: () => setSelectedCategory("ALL") },
              selectedQualification !== "ALL" && {
                label: QUALIFICATIONS.find((q) => q.value === selectedQualification)?.label || selectedQualification,
                clear: () => setSelectedQualification("ALL"),
              },
              selectedScope !== "ALL" && {
                label: selectedScope === "CENTRAL" ? "Central government" : "State government",
                clear: () => setSelectedScope("ALL"),
              },
            ].filter(Boolean).map((c) => {
              const chip = c as { label: string; clear: () => void };
              return (
                <span key={chip.label} className="ml-2 inline-flex items-center gap-1 bg-navy-tint text-navy px-2 py-0.5 rounded-full text-[12px] font-bold border border-navy-line align-middle">
                  {chip.label}
                  <button onClick={chip.clear} aria-label={`Clear ${chip.label}`} className="hover:text-danger">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            {searchQuery && (
              <span className="ml-2 inline-flex items-center gap-1 bg-navy-tint text-navy px-2 py-0.5 rounded-full text-[12px] font-bold border border-navy-line align-middle">
                &ldquo;{searchQuery}&rdquo;
                <button onClick={() => setSearchQuery("")} aria-label="Clear search" className="hover:text-danger">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </p>
          <div className="flex items-center gap-3 shrink-0">
            {hasActiveFilters && (
              <button onClick={resetAllFilters} className="text-[13px] font-semibold text-danger hover:underline">
                Clear filters
              </button>
            )}
            {!hideSearch && (<button
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              className={cn(
                "md:hidden flex items-center gap-1.5 px-3 min-h-[36px] rounded-lg border text-[13px] font-semibold",
                facetCount ? "border-navy text-navy bg-navy-tint" : "border-line text-ink-2 bg-surface"
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters{facetCount ? ` · ${facetCount}` : ""}
            </button>)}
          </div>
        </div>

        {/* phones: behind the Filters button; wider screens: one slim row */}
        {!hideSearch && (<div className={cn(showFilters ? "grid" : "hidden", "grid-cols-1 gap-2 p-3 rounded-xl bg-surface border border-line md:flex md:items-center md:p-0 md:border-0 md:bg-transparent")}>
          {!hideSearch && (
            <div className="relative md:flex-1">
              <Search className="w-4 h-4 text-faint absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search a post, exam or organisation"
                className="w-full pl-9 pr-3 min-h-[44px] md:min-h-[38px] text-[15px] md:text-sm bg-surface border border-line rounded-lg focus:outline-none focus:border-navy text-ink placeholder:text-faint"
              />
            </div>
          )}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Sector"
            className="w-full md:w-auto px-3 min-h-[44px] md:min-h-[38px] text-[15px] md:text-sm bg-surface border border-line rounded-lg text-ink focus:outline-none focus:border-navy cursor-pointer"
          >
            <option value="ALL">All sectors</option>
            {JOB_CATEGORIES.filter((c) => c !== "ALL").map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={selectedQualification}
            onChange={(e) => setSelectedQualification(e.target.value)}
            aria-label="Qualification"
            className="w-full md:w-auto px-3 min-h-[44px] md:min-h-[38px] text-[15px] md:text-sm bg-surface border border-line rounded-lg text-ink focus:outline-none focus:border-navy cursor-pointer"
          >
            {QUALIFICATIONS.map((q) => (
              <option key={q.value} value={q.value}>{q.label}</option>
            ))}
          </select>
          <div className="flex rounded-lg border border-line bg-surface p-0.5 min-h-[44px] md:min-h-[38px]">
            {(["ALL", "CENTRAL", "STATE"] as const).map((sc) => (
              <button
                key={sc}
                onClick={() => setSelectedScope(sc)}
                className={cn(
                  "flex-1 md:flex-none px-3 rounded-md text-[13px] font-semibold transition-colors",
                  selectedScope === sc ? "bg-navy-solid text-white" : "text-muted hover:text-ink"
                )}
              >
                {sc === "ALL" ? "All" : sc === "CENTRAL" ? "Central" : "State"}
              </button>
            ))}
          </div>
        </div>)}
      </div>

      {/* ================= LIST VIEW: cards on phones, a table on wider screens ================= */}
      {viewMode === "ledger" && (
        <ul className={cn(
          "bg-surface rounded-xl border border-line divide-y divide-line-soft overflow-hidden",
          activeCategory === "EXAM_DATES" ? "" : "lg:hidden"
        )}>
          {filteredJobs.length === 0 && (
            <li className="col-span-full py-8 text-center text-sm text-muted">
              No jobs match these filters.{" "}
              <button onClick={resetAllFilters} className="font-bold text-navy underline">Clear filters</button>
            </li>
          )}
          {filteredJobs.slice(0, visible).map((job) => (
            <li key={job.id}>
              <JobRow
                job={job}
                exam={activeCategory === "EXAM_DATES" || job.status === "ADMIT_CARD_OUT" ? nextExamDate(job) : undefined}
                action={
                  <button
                    onClick={() => toggleSave(job.id)}
                    className={cn("p-1.5 -m-1 rounded", isSaved(job.id) ? "text-saffron" : "text-faint hover:text-navy")}
                    title={isSaved(job.id) ? "Remove from saved" : "Save this job"}
                    aria-label={isSaved(job.id) ? "Remove from saved" : "Save this job"}
                  >
                    <Bookmark className={cn("w-4 h-4", isSaved(job.id) && "fill-saffron-bright")} />
                  </button>
                }
              />
            </li>
          ))}
        </ul>
      )}
      {viewMode === "ledger" && activeCategory !== "EXAM_DATES" && (
        <div className="hidden lg:block bg-surface rounded-xl border border-line overflow-hidden shadow-2xs">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-subtle border-b border-line text-[12px] font-semibold text-muted">
                <th className="py-2.5 pl-6 pr-4">Recruitment</th>
                <th className="py-2.5 px-4 text-right">Posts</th>
                <th className="py-2.5 px-4">Eligibility</th>
                <th className="py-2.5 px-4">Last date / exam</th>
                <th className="py-2.5 pl-2 pr-4"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-muted">
                    No jobs match these filters.{" "}
                    <button onClick={resetAllFilters} className="font-bold text-navy underline">Clear filters</button>
                  </td>
                </tr>
              ) : (
                filteredJobs.slice(0, visible).map((job) => {
                  const style = STATUS_STYLE[job.status] || STATUS_STYLE.UPCOMING;
                  const detailLink = getJobCanonicalPath(job);
                  const saved = isSaved(job.id);
                  const qual = qualificationLabel(job);
                  const age = job.ageKnown !== false && job.maxAge > 0 ? formatAgeRange(job) : null;
                  return (
                    <tr key={job.id} className="group hover:bg-subtle transition-colors">
                      {/* recruitment, with the stage stripe on the left edge */}
                      <td className="relative py-3 pl-6 pr-4">
                        <span className={cn("absolute left-0 inset-y-0 w-1.5", style.stripe)} aria-hidden />
                        <div className="flex items-center gap-1.5 text-[12px]">
                          <span className="px-1.5 py-0.5 rounded bg-navy-tint text-navy font-bold leading-none border border-navy-line">
                            {job.orgShortCode}
                          </span>
                          <span className="text-muted">{placeLabel(job)}</span>
                          <span className="text-faint" aria-hidden>·</span>
                          <span className={cn("font-bold", style.text)}>{style.label}</span>
                        </div>
                        <Link
                          href={detailLink}
                          className="mt-1 block font-serif font-bold text-[15px] leading-snug text-ink group-hover:text-navy line-clamp-2"
                        >
                          {cleanTitle(job)}
                        </Link>
                        <p className="text-[12px] text-muted line-clamp-1 mt-0.5">{job.organization}</p>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap tabular-nums">
                        {job.totalVacancies ? (
                          <b className="text-ink">{job.totalVacancies.toLocaleString("en-IN")}</b>
                        ) : (
                          <span className="text-faint">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {[qual, age].filter(Boolean).map((c) => (
                            <span key={c} className="px-2 py-0.5 rounded-full bg-subtle border border-line-soft text-[12px] text-ink-2 whitespace-nowrap">
                              {c}
                            </span>
                          ))}
                          {!qual && !age && <span className="text-[12px] text-faint">See notification</span>}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-col items-start gap-1 text-[13px] whitespace-nowrap">
                          <JobDeadline job={job} exam={job.status === "ADMIT_CARD_OUT" ? nextExamDate(job) : undefined} />
                        </div>
                      </td>

                      <td className="py-3 pl-2 pr-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => toggleSave(job.id)}
                            className={cn(
                              "p-2 rounded-lg transition-colors",
                              saved ? "text-saffron bg-saffron-tint" : "text-faint hover:text-navy hover:bg-navy-tint"
                            )}
                            title={saved ? "Remove from saved jobs" : "Save this job"}
                            aria-label={saved ? "Remove from saved jobs" : "Save this job"}
                          >
                            <Bookmark className={cn("w-4 h-4", saved && "fill-saffron-bright")} />
                          </button>
                          <Link
                            href={detailLink}
                            className="px-3 py-1.5 rounded-lg border border-line text-navy font-semibold text-[13px] hover:border-navy hover:bg-navy-tint transition-colors inline-flex items-center gap-1"
                          >
                            Details <ArrowRight className="w-3.5 h-3.5" />
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
                      {TABS[activeCategory].label}
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
                  exam={activeCategory === "EXAM_DATES" ? nextExamDate(job) : undefined}
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
