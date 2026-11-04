"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  JobNotification,
  formatAgeRange,
  nextExamDate,
  getJobCanonicalPath,
  daysUntil,
  stageText,
  todayIST,
  todayChange,
  TODAY_ORDER,
  type JobStage,
} from "@/data/jobs";
import { JobStatusBadge } from "./JobStatusBadge";
import { noticeArea } from "@/lib/internal-links";
import { JobListCard, JobRow, JobDeadline, STATUS_STYLE, qualificationLabel, rowTitle, placeLabel, sourceHost } from "./JobListCard";
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
  ExternalLink,
  Send,
  MapPin,
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
  /** List / Featured / Cards switch (desktop); off on the home page. */
  showLayoutSwitch?: boolean;
  /** The list shares its row with a side column (home page): short tab names that scroll sideways. */
  narrow?: boolean;
}

type ViewMode = "ledger" | "spotlight" | "bulletin";

export type StatusCategoryKey =
  | "TODAY"
  | "ALL"
  | "APPLY_OPEN"
  | "CLOSING_SOON"
  | "ADMIT_CARD"
  | "EXAM_DATES"
  | "RESULT"
  | "UNDER_WAY";

// one row of tabs; the active one takes its stage colour (same as the card stripes)
// "Today" leads, and only shows on a day something changed
export const TAB_ORDER: StatusCategoryKey[] = ["TODAY", "APPLY_OPEN", "CLOSING_SOON", "EXAM_DATES", "RESULT", "UNDER_WAY", "ALL"];
export const TABS: Record<StatusCategoryKey, { label: string; short: string; active: string; order?: string }> = {
  TODAY: { label: "Today", short: "Today", active: "bg-saffron-solid", order: "found on the official sites today · new notices first" },
  APPLY_OPEN: { label: "Open", short: "Open", active: "bg-green-solid", order: "by last date, biggest first" },
  CLOSING_SOON: { label: "Closing this week", short: "Closing", active: "bg-saffron-solid", order: "part of Open · by last date, biggest first" },
  EXAM_DATES: { label: "Exams & admit cards", short: "Exams", active: "bg-navy-solid", order: "soonest exam first" },
  ADMIT_CARD: { label: "Admit cards", short: "Admit card", active: "bg-navy-solid" },
  RESULT: { label: "Results", short: "Results", active: "bg-purple-solid", order: "latest result first" },
  UNDER_WAY: { label: "Under way", short: "Under way", active: "bg-teal-solid", order: "applications closed, exams or results to come · latest document first" },
  ALL: { label: "All", short: "All", active: "bg-navy-strong", order: "open jobs first" },
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

// Open and Closing tabs: grouped by how soon applications close; inside a group, bigger recruitments
// first, so a 6,574-post recruitment is not buried under 1-post contract jobs closing a day earlier.
const BUCKETS = ["Closing today", "Closing tomorrow", "Closes in 2–6 days", "Closes in 1–2 weeks", "Closes later", "Last date not stated"];
function bucketOf(job: JobNotification): number {
  if (!job.applicationEndDate) return 5;
  const d = daysUntil(job.applicationEndDate);
  return d <= 0 ? 0 : d === 1 ? 1 : d < 7 ? 2 : d < 14 ? 3 : 4;
}
// a body with this many jobs in one group shows its biggest and folds the rest behind one row
const FOLD_AT = 3;
const MAJOR_POSTS = 100;

/** One body however it is written ("X Court" / "X Court (Principal District and Sessions Court)"). */
function orgKey(j: JobNotification): string {
  return j.organization.split("(")[0].replace(/[,.]+$/, "").trim().toLowerCase();
}

/** Search words, each matched at the start of a word ("police" does not match "policy" inside a word). */
function searchWords(q: string): RegExp[] {
  return q.trim().split(/\s+/).filter(Boolean)
    .map((w) => new RegExp(`(^|[^\\p{L}\\p{N}])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "iu"));
}

// search looks at the body, its code, the title, sector and place first; highlights and
// qualifications only when nothing matches there (so "UPSC" never lands on a UKPSC notice's text)
function primaryText(j: JobNotification): string {
  return `${j.title} ${j.shortTitle} ${j.organization} ${j.orgShortCode} ${j.category} ${placeLabel(j)}`;
}
function secondaryText(j: JobNotification): string {
  return `${j.keyHighlights.join(" ")} ${j.qualifications.join(" ")}`;
}

/** The newest official document of a recruitment (results and documents views). */
function latestDoc(job: JobNotification): JobStage | null {
  const s = [...(job.stages || [])].sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  return s.length ? s[s.length - 1] : null;
}
const latestDate = (j: JobNotification) => (j.stages || []).map((x) => x.date || "").sort().pop() || "";

const TELEGRAM = "https://t.me/india_jobnotice";

// bodies the agent cannot read automatically: say so when a search names them
const KNOWN_GAPS: { test: RegExp; text: string; href: string; site: string }[] = [
  {
    test: /\b(upsc|union public service)/i,
    text: "UPSC's website blocks automated readers, so its notices are checked by hand and may appear late.",
    href: "https://upsc.gov.in",
    site: "upsc.gov.in",
  },
];

type ListItem =
  | { kind: "head"; key: string; label: string; count: number }
  | { kind: "job"; key: string; job: JobNotification }
  | { kind: "more"; key: string; org: string; count: number; posts: number; firstId: string };

/** Stage names in links (/?stage=closing) <-> tab keys. */
export const STAGE_PARAM: Record<string, StatusCategoryKey> = {
  today: "TODAY", open: "APPLY_OPEN", closing: "CLOSING_SOON", exams: "EXAM_DATES", admit: "EXAM_DATES", results: "RESULT",
  underway: "UNDER_WAY", all: "ALL",
};

export function MajorRecruitmentsSection({ jobs, currentStateSlug, hideSearch = false, showLayoutSwitch = true, narrow = false }: Props) {
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
  const [majorOnly, setMajorOnly] = useState(false);
  const [unfolded, setUnfolded] = useState<Set<string>>(new Set());

  // Watchlist hook
  const { isSaved, toggleSave } = useWatchlist();

  // phones: the tab strip scrolls sideways; keep the active tab in view (a search switches to All)
  const tabsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const c = tabsRef.current;
    const b = c?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!c || !b || c.scrollWidth <= c.clientWidth) return;
    const cr = c.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    c.scrollTo({ left: c.scrollLeft + br.left - cr.left - (cr.width - br.width) / 2, behavior: "smooth" });
  }, [activeCategory]);

  // Listen to hash changes (e.g., from hero counter clicks)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#today") {
        setActiveCategory("TODAY");
      } else if (hash === "#admit-cards" || hash === "#admit-card") {
        setActiveCategory("EXAM_DATES");
      } else if (hash === "#under-way" || hash === "#recruitments-under-way") {
        setActiveCategory("UNDER_WAY");
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
    const applyQuery = (fromSearch = false, focus = false) => {
      const u = new URLSearchParams(window.location.search);
      const keys = ["q", "state", "qual", "sector", "scope", "stage", "age"];
      if (!fromSearch && !keys.some((k) => u.get(k))) return;
      const q = u.get("q") || "";
      const stage = STAGE_PARAM[u.get("stage") || ""];
      const qual = u.get("qual") || "";
      const sector = u.get("sector") || "";
      const scope = (u.get("scope") || "").toUpperCase();
      const age = Number(u.get("age"));
      setSearchQuery(q);
      setSelectedState(u.get("state") || "ALL");
      setSelectedQualification(QUALIFICATIONS.some((x) => x.value === qual) ? qual : "ALL");
      setSelectedCategory(JOB_CATEGORIES.includes(sector) ? sector : "ALL");
      setSelectedScope(scope === "CENTRAL" || scope === "STATE" ? scope : "ALL");
      setMyAge(age >= 14 && age <= 70 ? age : null);
      // a search looks at every stage unless one was chosen
      setActiveCategory(stage || (q ? "ALL" : "APPLY_OPEN"));
      // two frames: the new list is drawn and the search panel above has closed, then scroll to the
      // count line (its scroll margin clears the pinned header and tabs)
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const count = document.getElementById("results-count");
        count?.scrollIntoView({ block: "start" });
        if (focus) count?.focus({ preventScroll: true });
      }));
    };
    applyQuery();
    const onSearch = () => applyQuery(true, true);
    const onBack = () => applyQuery(true);
    window.addEventListener("ijn:query", onSearch);
    window.addEventListener("popstate", onBack);
    window.addEventListener("hashchange", handleHash);
    return () => {
      window.removeEventListener("ijn:query", onSearch);
      window.removeEventListener("popstate", onBack);
      window.removeEventListener("hashchange", handleHash);
    };
  }, []);

  // Helper to test if a job matches a status category
  const matchesStatus = (job: JobNotification, cat: StatusCategoryKey): boolean => {
    switch (cat) {
      case "TODAY":
        return todayChange(job) !== null;
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
        return job.status === "ADMIT_CARD_OUT" || nextExamDate(job) !== null;
      case "UNDER_WAY":
        return !!job.inProgress;
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

  useEffect(() => {
    const reset = () => {
      setUnfolded(new Set());
      setVisible(20);
    };
    reset();
  }, [activeCategory, majorOnly]);

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("ALL");
    setSelectedQualification("ALL");
    setSelectedScope("ALL");
    setSelectedState("ALL");
    setMyAge(null);
    setActiveCategory("ALL");
  };

  const words = useMemo(() => searchWords(searchQuery), [searchQuery]);
  const gap = KNOWN_GAPS.find((g) => searchQuery && g.test.test(searchQuery));
  // wider text only when no body, code or title matches, and never for a body we know we miss
  const broad = useMemo(
    () => words.length > 0 && !gap && !jobs.some((j) => words.every((w) => w.test(primaryText(j)))),
    [words, gap, jobs]
  );
  const openTab = activeCategory === "APPLY_OPEN" || activeCategory === "CLOSING_SOON";
  const majorOn = majorOnly && openTab;

  // every filter except the stage tab: used for the list and for the tab counts
  const passesFacets = (j: JobNotification): boolean => {
    if (words.length) {
      const text = broad ? `${primaryText(j)} ${secondaryText(j)}` : primaryText(j);
      if (!words.every((w) => w.test(text))) return false;
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
    return jobs.filter((j) => matchesStatus(j, activeCategory) && passesFacets(j)
      && (!majorOn || j.totalVacancies >= MAJOR_POSTS)).sort((a, b) => {
      if (activeCategory === "APPLY_OPEN" || activeCategory === "CLOSING_SOON") {
        return bucketOf(a) - bucketOf(b)
          || b.totalVacancies - a.totalVacancies
          || (a.applicationEndDate || "9999").localeCompare(b.applicationEndDate || "9999");
      }
      if (activeCategory === "UNDER_WAY" || activeCategory === "RESULT") {
        return latestDate(b).localeCompare(latestDate(a));
      }
      if (activeCategory === "EXAM_DATES") {
        return (nextExamDate(a)?.date || "9999").localeCompare(nextExamDate(b)?.date || "9999");
      }
      if (activeCategory === "TODAY") {
        const rank = (j: JobNotification) => TODAY_ORDER.indexOf(todayChange(j)?.kind || "schedule");
        return rank(a) - rank(b) || b.totalVacancies - a.totalVacancies;
      }
      const rank = (j: JobNotification) =>
        j.status === "APPLY_OPEN" || j.status === "LAST_DATE_NEAR" ? 0
          : j.status === "ADMIT_CARD_OUT" || j.status === "RESULT_OUT" ? 1 : 2;
      return rank(a) - rank(b)
        || (a.applicationEndDate || "9999").localeCompare(b.applicationEndDate || "9999")
        || b.totalVacancies - a.totalVacancies;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs, activeCategory, words, broad, selectedCategory, selectedQualification, selectedScope, selectedState, myAge, majorOn]);

  // what the list draws: day headings, jobs, and "N more from <body>" rows (Open / Closing tabs)
  const grouped = viewMode === "ledger" && (activeCategory === "APPLY_OPEN" || activeCategory === "CLOSING_SOON");
  const listItems = useMemo((): ListItem[] => {
    if (!grouped) return filteredJobs.map((job) => ({ kind: "job", key: job.id, job }));
    const items: ListItem[] = [];
    const byBucket = new Map<number, JobNotification[]>();
    for (const j of filteredJobs) {
      const b = bucketOf(j);
      if (!byBucket.has(b)) byBucket.set(b, []);
      byBucket.get(b)!.push(j);
    }
    for (const [b, group] of [...byBucket.entries()].sort((x, y) => x[0] - y[0])) {
      items.push({ kind: "head", key: `h${b}`, label: BUCKETS[b], count: group.length });
      // fold by the full organisation name: generic codes ("District Court") cover unrelated bodies
      const perOrg = new Map<string, JobNotification[]>();
      for (const j of group) {
        const o = orgKey(j);
        if (!perOrg.has(o)) perOrg.set(o, []);
        perOrg.get(o)!.push(j);
      }
      const shownOrgs = new Set<string>();
      for (const j of group) {
        const same = perOrg.get(orgKey(j))!;
        const key = `${b}:${orgKey(j)}`;
        const fold = same.length >= FOLD_AT && !unfolded.has(key);
        if (!fold) {
          items.push({ kind: "job", key: j.id, job: j });
          continue;
        }
        if (shownOrgs.has(orgKey(j))) continue;
        shownOrgs.add(orgKey(j));
        items.push({ kind: "job", key: j.id, job: j });
        const rest = same.slice(1);
        items.push({
          kind: "more", key, org: j.orgShortCode, count: rest.length, firstId: rest[0].id,
          posts: rest.reduce((n, r) => n + (r.totalVacancies || 0), 0),
        });
      }
    }
    return items;
  }, [grouped, filteredJobs, unfolded]);

  // two rows of one body that read the same: the advert number (or year) goes in front
  const titleOf = useMemo(() => {
    const key = (j: JobNotification) => `${orgKey(j)}|${rowTitle(j).slice(0, 60)}`;
    const seen = new Map<string, number>();
    for (const j of filteredJobs) seen.set(key(j), (seen.get(key(j)) || 0) + 1);
    return (j: JobNotification): string => {
      const t = rowTitle(j);
      if ((seen.get(key(j)) || 0) < 2) return t;
      // a round's KK / RPC notices differ by that alone; else the advert number (or year)
      const area = noticeArea(j)?.code;
      const tag = area || (j.advtNo ? `Advt ${j.advtNo}` : (j.applicationEndDate || j.publishedAt || "").slice(0, 4));
      if (area) return `${area} · ${t.replace(new RegExp(`\\s*\\(${area}\\)\\s*$`), "")}`;
      return tag && !t.includes(j.advtNo || tag) ? `${tag} · ${t}` : t;
    };
  }, [filteredJobs]);

  // "Show more" counts jobs, not headings
  const shownItems = useMemo(() => {
    const out: ListItem[] = [];
    let jobsShown = 0;
    for (const it of listItems) {
      if (it.kind === "job") {
        if (jobsShown >= visible) break;
        jobsShown += 1;
      }
      out.push(it);
    }
    while (out.length && out[out.length - 1].kind === "head") out.pop();
    return out;
  }, [listItems, visible]);
  const jobsInList = listItems.filter((i) => i.kind === "job").length;
  // jobs not on screen yet (a folded body's jobs are on screen behind its "Show N more" row)
  const jobsLeft = filteredJobs.length
    - shownItems.reduce((n, it) => n + (it.kind === "job" ? 1 : it.kind === "more" ? it.count : 0), 0);
  // open a fold, then put keyboard focus on the first job it revealed
  const unfold = (key: string, firstId?: string) => {
    setUnfolded((prev) => new Set(prev).add(key));
    if (firstId) {
      requestAnimationFrame(() => {
        const row = document.querySelector<HTMLElement>(`[data-job="${firstId}"]:not([hidden]) a, [data-job="${firstId}"] a`);
        const visibleRow = [...document.querySelectorAll<HTMLElement>(`[data-job="${firstId}"] a`)].find((a) => a.offsetParent !== null);
        (visibleRow || row)?.focus();
      });
    }
  };


  // Counts for each status category (respecting text search and facet filters)
  const categoryCounts = useMemo(() => {
    const counts: Record<StatusCategoryKey, number> = {
      TODAY: 0,
      ALL: 0,
      APPLY_OPEN: 0,
      CLOSING_SOON: 0,
      ADMIT_CARD: 0,
      EXAM_DATES: 0,
      RESULT: 0,
      UNDER_WAY: 0,
    };

    jobs.forEach((j) => {
      if (!passesFacets(j)) return;
      // "100+ posts" narrows the open tabs only
      const big = !majorOn || j.totalVacancies >= MAJOR_POSTS;

      counts.ALL += 1;
      if (matchesStatus(j, "TODAY")) counts.TODAY += 1;
      if (matchesStatus(j, "APPLY_OPEN") && big) counts.APPLY_OPEN += 1;
      if (matchesStatus(j, "CLOSING_SOON") && big) counts.CLOSING_SOON += 1;
      if (matchesStatus(j, "ADMIT_CARD")) counts.ADMIT_CARD += 1;
      if (matchesStatus(j, "EXAM_DATES")) counts.EXAM_DATES += 1;
      if (matchesStatus(j, "RESULT")) counts.RESULT += 1;
      if (matchesStatus(j, "UNDER_WAY")) counts.UNDER_WAY += 1;
    });

    return counts;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs, selectedCategory, selectedQualification, selectedScope, selectedState, myAge, words, broad, majorOn]);

  // the home page's own search box shows what the list is filtered by (cleared chip, Back button)
  useEffect(() => {
    if (!hideSearch) return;
    const box = document.querySelector<HTMLInputElement>('form[role="search"] input[name="q"]');
    if (box && box.value !== searchQuery) box.value = searchQuery;
  }, [searchQuery, hideSearch]);

  // no results: say what was searched and offer the next step
  const emptyHelp = (
    <div className="space-y-3">
      {gap && (
        <p className="text-[14px] text-ink max-w-md mx-auto px-4 py-3 rounded-lg bg-saffron-tint text-left">
          {gap.text}{" "}
          <a href={gap.href} target="_blank" rel="noreferrer" className="font-semibold text-navy underline underline-offset-2">
            See {gap.site}
          </a>
        </p>
      )}
      <p className="text-ink-2">
        {activeCategory === "ALL" ? "Nothing" : <>Nothing in <b>{TABS[activeCategory].label}</b></>} matches
        {searchQuery ? <> &ldquo;{searchQuery}&rdquo;</> : " these filters"}.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {activeCategory !== "ALL" && categoryCounts.ALL > 0 && (
          <button onClick={() => setActiveCategory("ALL")} className="px-4 min-h-[44px] rounded-lg bg-navy-solid text-white font-semibold">
            See {categoryCounts.ALL} in all stages
          </button>
        )}
        {majorOn && (
          <button onClick={() => setMajorOnly(false)} className="px-4 min-h-[44px] rounded-lg border border-control text-navy font-semibold">
            Include smaller recruitments
          </button>
        )}
        {hasActiveFilters && (
          <button onClick={resetAllFilters} className="px-4 min-h-[44px] rounded-lg border border-control text-navy font-semibold">
            Clear search and filters
          </button>
        )}
      </div>
      {searchQuery && !gap && (
        <p className="text-[13px] text-muted">
          Try{" "}
          {["SSC", "police", "teacher", "railway"].map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => {
                window.history.pushState(null, "", `${window.location.pathname}?q=${encodeURIComponent(q)}#major-recruitments`);
                window.dispatchEvent(new Event("ijn:query"));
              }}
              className="mx-0.5 px-3 min-h-[36px] rounded-full border border-control text-navy font-semibold hover:border-navy"
            >
              {q}
            </button>
          ))}
        </p>
      )}
      <p className="text-[13px] text-muted">
        Not listed yet?{" "}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event("ijn:open-states"))}
          className="inline-flex items-center gap-1 font-semibold text-navy underline underline-offset-2 py-2"
        >
          <MapPin className="w-3.5 h-3.5" aria-hidden />Pick your state
        </button>{" "}
        or{" "}
        <a href={TELEGRAM} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-navy underline underline-offset-2 py-2">
          <Send className="w-3.5 h-3.5" aria-hidden />get new notices on Telegram
        </a>
      </p>
    </div>
  );
  // results and recruitments under way: the newest official document instead of posts and eligibility
  // exams: the admit card or schedule that gives the date
  const docMode = activeCategory === "UNDER_WAY" || activeCategory === "RESULT" || activeCategory === "EXAM_DATES";
  const cols = docMode ? 4 : 5;


  const heroJob = filteredJobs[0] || jobs[0];
  const sideJobs = filteredJobs.slice(1, 6);

  return (
    <section id="major-recruitments" className="space-y-4 scroll-mt-20">
      {/* Section Header with Live View Switcher */}
      <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-3", showLayoutSwitch ? "pb-3 border-b border-line" : "sr-only")}>
        <div>
          <div className="flex items-center gap-2">
            {showLayoutSwitch && <span className="w-2.5 h-2.5 rounded-full bg-navy-solid" />}
            <h2 className={cn("font-serif font-bold text-ink", showLayoutSwitch ? "text-xl sm:text-2xl" : "text-lg sm:text-xl")}>
              Latest government jobs
            </h2>
          </div>
        </div>

        {/* View Mode Switcher Toggle */}
        <div className={cn("hidden items-center gap-1 p-1 rounded-md bg-navy-tint border border-navy-line self-start sm:self-auto text-xs", showLayoutSwitch && "md:flex")}>
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
      <div className="sticky top-[68px] md:top-[109px] z-20 -mx-4 px-4 sm:mx-0 sm:px-0 py-2 bg-canvas/95 backdrop-blur-sm">
        <div
          ref={tabsRef}
          role="group"
          aria-label="Show jobs by stage"
          className={cn(
            "relative flex gap-1.5 pr-10 overflow-x-auto [scrollbar-width:none] [mask-image:linear-gradient(to_right,black_86%,transparent)]",
            narrow ? "md:gap-2 lg:gap-1.5 lg:pr-0 lg:overflow-visible lg:flex-wrap lg:[mask-image:none]" : "md:pr-0 md:overflow-visible md:gap-2 md:[mask-image:none]"
          )}
        >
          {TAB_ORDER.map((key) => {
            const isActive = activeCategory === key;
            // no Today tab on a day with nothing new
            if (key === "TODAY" && !categoryCounts.TODAY && !isActive) return null;
            const t = TABS[key];
            return (
              <button
                key={key}
                aria-pressed={isActive}
                title={key === "UNDER_WAY" ? "Applications closed, exams or results still to come" : undefined}
                onClick={() => setActiveCategory(key)}
                className={cn(
                  narrow ? "px-3 gap-1.5" : "px-3.5 gap-2",
                  "shrink-0 flex items-center min-h-[44px] md:min-h-0 md:py-[9px] rounded-full border text-[13px] font-semibold whitespace-nowrap transition-colors motion-reduce:transition-none",
                  isActive ? cn(t.active, "text-white border-transparent") : "bg-surface border-[#C8D3E3] dark:border-control text-ink hover:border-navy"
                )}
              >
                <span className={narrow ? undefined : "md:hidden"}>{t.short}</span>
                {!narrow && <span className="hidden md:inline">{t.label}</span>}
                <span
                  className={cn(
                    "min-w-[22px] px-1.5 py-[3px] rounded-full text-[12px] font-semibold leading-none tabular-nums",
                    isActive ? "bg-black/20 text-white" : "bg-[#F1F4F9] dark:bg-subtle text-ink-2"
                  )}
                >
                  {categoryCounts[key]}
                </span>
                <span className="sr-only"> jobs</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= COUNT, FILTERS ================= */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-3 text-[13px]">
          <p id="results-count" tabIndex={-1} className="scroll-mt-[140px] md:scroll-mt-[176px] text-ink-2 min-w-0 focus:outline-none" aria-live="polite">
            <b className="text-ink">{filteredJobs.length}</b> {filteredJobs.length === 1 ? "job" : "jobs"}
            {filteredJobs.length > 0 && TABS[activeCategory].order && <span className="text-muted"> · {TABS[activeCategory].order}</span>}
            {selectedState !== "ALL" && (
              <span className="ml-2 inline-flex items-center gap-1 bg-navy-tint text-navy px-2 py-0.5 rounded-full text-[12px] font-bold border border-navy-line align-middle">
                {getStateBySlug(selectedState)?.name || selectedState} + central
                <button onClick={() => setSelectedState("ALL")} aria-label="Clear state" className="p-2 -m-2 hover:text-danger">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {myAge !== null && (
              <span className="ml-2 inline-flex items-center gap-1 bg-navy-tint text-navy px-2 py-0.5 rounded-full text-[12px] font-bold border border-navy-line align-middle">
                Age {myAge}
                <button onClick={() => setMyAge(null)} aria-label="Clear age" className="p-2 -m-2 hover:text-danger">
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
                  <button onClick={chip.clear} aria-label={`Clear ${chip.label}`} className="p-2 -m-2 hover:text-danger">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            {searchQuery && (
              <span className="ml-2 inline-flex items-center gap-1 bg-navy-tint text-navy px-2 py-0.5 rounded-full text-[12px] font-bold border border-navy-line align-middle">
                &ldquo;{searchQuery}&rdquo;
                <button onClick={() => setSearchQuery("")} aria-label="Clear search" className="p-2 -m-2 hover:text-danger">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </p>
          <div className="flex items-center gap-3 shrink-0">
            {openTab && (
              <button
                role="switch"
                onClick={() => setMajorOnly(!majorOnly)}
                aria-checked={majorOnly}
                title={`Show only recruitments with ${MAJOR_POSTS} or more posts`}
                className="group flex items-center gap-2 pl-3 pr-1.5 min-h-[44px] md:min-h-[36px] rounded-full border border-line bg-surface text-[13px] font-semibold text-ink-2 whitespace-nowrap hover:border-navy"
              >
                {MAJOR_POSTS}+ posts only
                <span
                  className={cn(
                    "relative w-9 h-5 rounded-full transition-colors",
                    majorOnly ? "bg-navy-solid" : "bg-line"
                  )}
                  aria-hidden
                >
                  <span
                    className={cn(
                      "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
                      majorOnly && "translate-x-4"
                    )}
                  />
                </span>
              </button>
            )}
            {hasActiveFilters && (
              <button onClick={resetAllFilters} className="text-[13px] font-semibold text-navy hover:underline py-3 -my-3">
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
        {filteredJobs.length > 0 && gap && (
          <p className="text-[13px] text-ink-2 px-3 py-2 rounded-lg bg-saffron-tint">
            {gap.text}{" "}
            <a href={gap.href} target="_blank" rel="noreferrer" className="font-semibold text-navy underline underline-offset-2">
              See {gap.site}
            </a>
          </p>
        )}

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
        <ul className="lg:hidden bg-surface rounded-xl border border-line divide-y divide-line-soft overflow-hidden">
          {filteredJobs.length === 0 && (
            <li className="col-span-full px-4 py-8 text-center text-sm text-muted">
              {emptyHelp}
            </li>
          )}
          {shownItems.map((it) => it.kind === "head" ? (
            <li key={it.key} className={it.label === BUCKETS[0] ? "bg-danger-tint" : "bg-subtle"}>
              <h3 className="px-3 pt-3 pb-1.5 text-[12px] font-bold text-ink-2 flex justify-between">
                <span>{it.label}</span>
                <span className="font-semibold text-muted tabular-nums">{it.count}</span>
              </h3>
            </li>
          ) : it.kind === "more" ? (
            <li key={it.key}>
              <button
                onClick={() => unfold(it.key, it.firstId)}
                className="w-full min-h-[44px] px-3 pl-8 text-left text-[13px] font-semibold text-navy hover:bg-subtle"
              >
                Show {it.count} more from {it.org}
                {it.posts > 0 && <span className="font-normal text-muted"> · {it.posts.toLocaleString("en-IN")} posts</span>}
              </button>
            </li>
          ) : (() => { const job = it.job; return (
            <li key={job.id} data-job={job.id}>
              <JobRow
                job={job}
                title={titleOf(job)}
                exam={activeCategory === "EXAM_DATES" || job.status === "ADMIT_CARD_OUT" ? nextExamDate(job) : undefined}
                showStage={!grouped && activeCategory !== "TODAY"}
                note={activeCategory === "TODAY" ? todayChange(job)?.label : undefined}
                action={
                  <button
                    onClick={() => toggleSave(job.id)}
                    className={cn("w-11 h-11 -m-3 flex items-center justify-center rounded-lg", isSaved(job.id) ? "text-saffron" : "text-faint hover:text-navy")}
                    title={isSaved(job.id) ? "Remove from saved" : "Save this job"}
                    aria-label={`Save: ${rowTitle(job)}`}
                    aria-pressed={isSaved(job.id)}
                  >
                    <Bookmark className={cn("w-4 h-4", isSaved(job.id) && "fill-saffron-bright")} />
                  </button>
                }
              />
            </li>
          ); })())}
        </ul>
      )}
      {viewMode === "ledger" && (
        <div className="hidden lg:block bg-surface rounded-xl border border-line overflow-clip shadow-2xs">
          <table className="w-full table-fixed text-left border-collapse text-sm">
            <thead className={filteredJobs.length === 0 ? "hidden" : undefined}>
              <tr className="bg-subtle border-b border-line text-[12px] font-semibold text-muted [&>th]:sticky [&>th]:top-[162px] [&>th]:z-20 [&>th]:bg-subtle">
                <th className="py-2.5 pl-6 pr-4">Recruitment</th>
                {docMode ? (
                  <th className="py-2.5 px-4">{activeCategory === "EXAM_DATES" ? "Admit card or exam notice" : "Latest official document"}</th>
                ) : (
                  <>
                    <th className="w-[5.5rem] py-2.5 px-4 text-right">Posts</th>
                    <th className="w-[7.5rem] py-2.5 px-4">Eligibility</th>
                  </>
                )}
                <th className="w-[10.5rem] py-2.5 px-4 text-right">{activeCategory === "EXAM_DATES" ? "Exam" : docMode ? "Where it stands" : "Last date / exam"}</th>
                <th className="w-14 py-2.5 pl-2 pr-4"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={cols} className="px-4 py-12 text-center text-sm text-muted">
                    {emptyHelp}
                  </td>
                </tr>
              ) : (
                shownItems.map((it) => {
                  if (it.kind === "head") {
                    return (
                      <tr key={it.key} className={it.label === BUCKETS[0] ? "bg-danger-tint" : "bg-subtle"}>
                        <th colSpan={cols} scope="colgroup" className="py-2 pl-6 pr-4 text-left text-[12px] font-bold text-ink-2">
                          {it.label} <span className="font-semibold text-muted tabular-nums">· {it.count}</span>
                        </th>
                      </tr>
                    );
                  }
                  if (it.kind === "more") {
                    return (
                      <tr key={it.key}>
                        <td colSpan={cols} className="p-0">
                          <button
                            onClick={() => unfold(it.key, it.firstId)}
                            className="w-full py-2.5 pl-6 pr-4 text-left text-[13px] font-semibold text-navy hover:bg-subtle"
                          >
                            Show {it.count} more from {it.org}
                            {it.posts > 0 && <span className="font-normal text-muted"> · {it.posts.toLocaleString("en-IN")} posts</span>}
                          </button>
                        </td>
                      </tr>
                    );
                  }
                  const job = it.job;
                  const style = STATUS_STYLE[job.status] || STATUS_STYLE.UPCOMING;
                  const detailLink = getJobCanonicalPath(job);
                  const saved = isSaved(job.id);
                  const qual = qualificationLabel(job);
                  const age = job.ageKnown !== false && job.maxAge > 0 ? formatAgeRange(job) : null;
                  const host = sourceHost(job);
                  const doc = !docMode ? null : activeCategory === "EXAM_DATES" ? nextExamDate(job)?.stage || null : latestDoc(job);
                  const exam = activeCategory === "EXAM_DATES" || job.status === "ADMIT_CARD_OUT" ? nextExamDate(job) : undefined;
                  return (
                    <tr key={job.id} data-job={job.id} className="group hover:bg-[#F8FAFD] dark:hover:bg-subtle transition-colors">
                      {/* recruitment, with the stage stripe on the left edge */}
                      <td className="relative py-4 pl-6 pr-4">
                        <span className={cn("absolute left-0 inset-y-0 w-1", style.stripe)} aria-hidden />
                        <div className="flex items-center gap-1.5 text-[12px]">
                          <abbr title={job.organization} className="no-underline px-1.5 py-0.5 rounded bg-navy-tint text-navy font-bold leading-none border border-navy-line">
                            {job.orgShortCode}
                          </abbr>
                          <span className="text-muted">{placeLabel(job)}</span>
                          {/* inside Open / Closing the tab already says it; the days-left pill carries urgency */}
                          {!grouped && (
                            <>
                              <span className="text-faint" aria-hidden>·</span>
                              {activeCategory === "TODAY" ? (
                                <span className="font-bold text-saffron">{todayChange(job)?.label}</span>
                              ) : (
                                <span className={cn("font-bold", style.text)}>{style.label}</span>
                              )}
                            </>
                          )}
                        </div>
                        <Link
                          href={detailLink}
                          className="mt-1 block font-bold text-base leading-[1.35] text-ink group-hover:text-navy line-clamp-2"
                        >
                          {titleOf(job)}
                        </Link>
                        <p className="text-[12px] text-muted truncate mt-1">
                          {job.organization}
                          {host && <span className="text-faint"> · {host}</span>}
                        </p>
                      </td>

                      {docMode ? (
                        <td className="py-4 px-4 max-w-[22rem]">
                          {doc ? (
                            <a href={doc.url} target="_blank" rel="noreferrer" className="text-[13px] text-ink-2 hover:text-navy">
                              <span className="line-clamp-2">{stageText(doc).main}</span>
                              <span className="mt-0.5 inline-flex items-center gap-1 text-[12px] text-muted">
                                {doc.date ? (doc.date > todayIST() ? `dated ${formatDate(doc.date)}` : formatDate(doc.date)) : "Official PDF"} <ExternalLink className="w-3 h-3" aria-hidden />
                              </span>
                            </a>
                          ) : (
                            <span className="text-[12px] text-faint">See notice</span>
                          )}
                        </td>
                      ) : (
                      <>
                      <td className="py-4 px-4 text-right whitespace-nowrap tabular-nums text-[15px]">
                        {job.totalVacancies ? (
                          <b className="text-ink">{job.totalVacancies.toLocaleString("en-IN")}</b>
                        ) : (
                          <span className="text-[12px] text-faint">See notice</span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {[qual, age].filter(Boolean).map((c) => (
                            <span key={c} className="px-2 py-0.5 rounded-full bg-surface border border-line text-[12px] font-medium text-ink-2 whitespace-nowrap">
                              {c}
                            </span>
                          ))}
                          {!qual && !age && <span className="text-[12px] text-faint">See notice</span>}
                        </div>
                      </td>
                      </>
                      )}

                      <td className="py-4 px-4">
                        <div className="flex flex-col items-end text-right gap-1 text-[13px] text-balance">
                          <JobDeadline job={job} exam={exam} />
                        </div>
                      </td>

                      <td className="py-4 pl-2 pr-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => toggleSave(job.id)}
                            className={cn(
                              "p-2 rounded-lg transition-colors",
                              saved ? "text-saffron bg-saffron-tint" : "text-faint hover:text-navy hover:bg-navy-tint"
                            )}
                            title={saved ? "Remove from saved jobs" : "Save this job"}
                            aria-label={`Save: ${rowTitle(job)}`}
                            aria-pressed={saved}
                          >
                            <Bookmark className={cn("w-4 h-4", saved && "fill-saffron-bright")} />
                          </button>
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

      {viewMode === "ledger" && jobsInList > visible && (
        <div className="text-center">
          <button
            onClick={() => setVisible((v) => v + 20)}
            className="px-4 py-2.5 rounded-lg border border-navy-line bg-surface text-sm font-bold text-navy hover:border-navy"
          >
            Show more · {jobsLeft} {jobsLeft === 1 ? "job" : "jobs"} left
          </button>
        </div>
      )}

      {/* ================= OPTION 2: THE EDITORIAL SPOTLIGHT (SPLIT) ================= */}
      {viewMode === "spotlight" && (
        filteredJobs.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted bg-surface rounded-lg border border-line">{emptyHelp}</div>
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
            <div className="col-span-full py-10 text-center text-sm text-muted bg-surface rounded-lg border border-line">{emptyHelp}</div>
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
