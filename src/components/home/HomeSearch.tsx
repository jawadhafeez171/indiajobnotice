"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { STATES_REGISTRY } from "@/config/states";
import { JOB_CATEGORIES, QUALIFICATIONS } from "@/components/jobs/MajorRecruitmentsSection";
import { cn } from "@/lib/utils";

const field =
  "w-full h-11 px-3 rounded-lg border border-control bg-surface text-[15px] sm:text-sm text-ink focus:border-navy";

const LONG_HINT = "Search jobs, e.g. SSC, Police, Railway, Karnataka";
const FILTER_KEYS = ["state", "qual", "sector", "scope", "age"];
const SHORT_HINT = "Search jobs, e.g. SSC";

/**
 * Search band under the home page hero: one search box, and "Advanced search" with every filter
 * of the job list (state, qualification, sector, central/state, age; the stage is the list's tabs). It sends the visitor to
 * /?q=..&state=.. where the list reads the filters and scrolls into view.
 */
export function HomeSearch({ extra, onDark = false }: { extra?: React.ReactNode; onDark?: boolean }) {
  const [open, setOpen] = useState(false);
  // the clear button shows while the box has text; the list also fills the box (a search from the
  // address, Back), so look again after those
  const [hasText, setHasText] = useState(false);
  // filters in use (from the address): shown as a count on the Filters button
  const [active, setActive] = useState(0);
  // phones show State and Qualification; the other filters behind "More filters"
  const [more, setMore] = useState(false);
  const boxRef = useRef<HTMLInputElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const look = () =>
      setTimeout(() => {
        setHasText(!!boxRef.current?.value);
        const u = new URLSearchParams(window.location.search);
        setActive(FILTER_KEYS.filter((k) => u.get(k)).length);
      }, 0);
    look();
    window.addEventListener("ijn:query", look);
    window.addEventListener("popstate", look);
    return () => {
      window.removeEventListener("ijn:query", look);
      window.removeEventListener("popstate", look);
    };
  }, []);

  // phones: a placeholder short enough to show whole beside the two buttons (the default, so a slow
  // phone never shows the long one cut off before the script runs; wide screens switch to it)
  const [placeholder, setPlaceholder] = useState(SHORT_HINT);
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 640px)");
    const pick = () => setPlaceholder(wide.matches ? LONG_HINT : SHORT_HINT);
    pick();
    wide.addEventListener("change", pick);
    return () => wide.removeEventListener("change", pick);
  }, []);

  // ×: empty the box; when the list is filtered by it, show the whole list again
  const clear = () => {
    const box = boxRef.current;
    if (!box) return;
    box.value = "";
    setHasText(false);
    box.focus();
    if (new URLSearchParams(window.location.search).get("q")) box.form?.requestSubmit();
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    for (const [k, v] of data.entries()) {
      const val = String(v).trim();
      if (val && val !== "ALL") params.set(k, val);
    }
    const qs = params.toString();
    setOpen(false);
    setActive(FILTER_KEYS.filter((k) => params.get(k)).length);
    // filter the list already on the page (no reload on slow connections); the address keeps the search
    window.history.pushState(null, "", qs ? `/?${qs}#major-recruitments` : "/#major-recruitments");
    window.dispatchEvent(new Event("ijn:query"));
  };

  return (
    <section aria-label="Search government jobs">
      <form onSubmit={submit} role="search">
        {/* on the navy hero: one slim white pill, lifted by a shadow rather than outlined, with the
            filters button and Search inside it; 48px tall on wide screens, 44px tap targets on phones */}
        <div
          className={cn(
            "flex gap-2",
            onDark && "search-bar gap-0.5 p-1 rounded-full bg-surface dark:bg-[#1B2A57] shadow-[0_6px_20px_-6px_rgb(0_0_0/0.35)] dark:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.28),0_6px_20px_-6px_rgb(0_0_0/0.5)] transition-shadow",
            onDark && !open && "focus-within:ring-4 focus-within:ring-white/50"
          )}
        >
          <div className="relative flex-1 min-w-0">
            <Search
              className={cn(
                "absolute top-1/2 -translate-y-1/2 pointer-events-none",
                onDark ? "w-[18px] h-[18px] left-4 text-navy" : "w-[21px] h-[21px] left-3.5 text-faint"
              )}
              aria-hidden
            />
            <input
              ref={boxRef}
              type="search"
              name="q"
              placeholder={onDark ? placeholder : LONG_HINT}
              aria-label="Search jobs"
              onInput={(e) => setHasText(!!e.currentTarget.value)}
              className={cn(
                "w-full text-ink placeholder:text-faint [&::-webkit-search-cancel-button]:appearance-none",
                onDark
                  ? cn("h-11 sm:h-10 pl-11 rounded-full border-0 bg-transparent text-[15px] dark:placeholder:text-[#9AA6BF] focus:outline-none", hasText ? "pr-10" : "pr-2")
                  : "h-12 pl-11 pr-3 rounded-xl border-2 border-control bg-surface text-[15px] focus:border-navy"
              )}
            />
            {onDark && hasText && (
              <button
                type="button"
                onClick={clear}
                aria-label="Clear search"
                className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-11 sm:h-10 flex items-center justify-center rounded-full text-faint hover:text-ink"
              >
                <X className="w-4 h-4" aria-hidden />
              </button>
            )}
          </div>
          {onDark && (
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="advanced-search"
              title="Advanced search: state, qualification, type of job, age"
              className={cn(
                "relative shrink-0 h-11 sm:h-10 min-w-11 px-3 inline-flex items-center justify-center gap-1.5 rounded-full text-[13px] font-medium transition-colors",
                open ? "bg-navy-tint text-navy" : "text-ink-2 hover:bg-subtle hover:text-navy"
              )}
            >
              <SlidersHorizontal className="w-4 h-4" aria-hidden />
              <span className="sr-only sm:not-sr-only">Filters</span>
              {active > 0 && (
                <span className="absolute top-1 right-1 sm:static min-w-[18px] h-[18px] px-1 rounded-full bg-navy-solid text-white text-[11px] font-bold leading-[18px] tabular-nums">
                  {active}
                  <span className="sr-only"> in use</span>
                </span>
              )}
            </button>
          )}
          <button
            type="submit"
            aria-label="Search"
            className={cn(
              "shrink-0 bg-navy-solid hover:bg-navy-strong active:bg-masthead text-white transition-colors",
              onDark
                ? "h-11 w-11 sm:h-10 sm:w-auto sm:px-6 inline-flex items-center justify-center rounded-full text-[14px] font-semibold"
                : "h-12 px-4 sm:px-7 rounded-xl text-sm font-bold"
            )}
          >
            {onDark ? (
              <>
                <Search className="w-[18px] h-[18px] sm:hidden" aria-hidden />
                <span className="hidden sm:inline">Search</span>
              </>
            ) : (
              "Search"
            )}
          </button>
        </div>

        <div className={cn("mt-1 flex flex-wrap items-center gap-x-5", onDark && "mt-0.5 gap-x-6 md:mt-1.5 justify-center")}>
        {/* on the navy hero the filters button is inside the bar */}
        {!onDark && (
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="advanced-search"
            className="inline-flex items-center gap-1.5 min-h-[44px] text-[13px] font-semibold text-navy hover:underline"
          >
            <SlidersHorizontal className="w-4 h-4" aria-hidden />
            Advanced search
            <ChevronDown className={cn("w-4 h-4 transition-transform", open && "rotate-180")} aria-hidden />
          </button>
        )}
        {extra}
        </div>

        <div id="advanced-search" hidden={!open} className="mt-3 p-4 rounded-xl border border-line bg-surface text-left">
          <div className="-mt-1 mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-ink">Filters</span>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                toggleRef.current?.focus();
              }}
              aria-label="Close filters"
              className="w-11 h-11 -mr-3 flex items-center justify-center rounded-full text-muted hover:text-ink hover:bg-subtle"
            >
              <X className="w-[18px] h-[18px]" aria-hidden />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <label className="block">
              <span className="block text-[12px] font-semibold text-muted mb-1">State</span>
              <select name="state" defaultValue="ALL" className={field}>
                <option value="ALL">All states</option>
                {[...STATES_REGISTRY].sort((a, b) => a.name.localeCompare(b.name)).map((st) => (
                  <option key={st.slug} value={st.slug}>{st.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="block text-[12px] font-semibold text-muted mb-1">Qualification</span>
              <select name="qual" defaultValue="ALL" className={field}>
                {QUALIFICATIONS.map((q) => (
                  <option key={q.value} value={q.value}>{q.value === "ALL" ? "Any qualification" : q.label}</option>
                ))}
              </select>
            </label>
            <div className={more ? "contents" : "hidden sm:contents"}>
            <label className="block">
              <span className="block text-[12px] font-semibold text-muted mb-1">Type of job</span>
              <select name="sector" defaultValue="ALL" className={field}>
                <option value="ALL">All types</option>
                {JOB_CATEGORIES.filter((c) => c !== "ALL").map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="block text-[12px] font-semibold text-muted mb-1">Central or state government</span>
              <select name="scope" defaultValue="ALL" className={field}>
                <option value="ALL">Both</option>
                <option value="central">Central government</option>
                <option value="state">State government</option>
              </select>
            </label>
            <label className="block">
              <span className="block text-[12px] font-semibold text-muted mb-1">Your age (years)</span>
              <input
                type="number"
                name="age"
                min={14}
                max={70}
                inputMode="numeric"
                placeholder="e.g. 27"
                aria-describedby="age-hint"
                className={field}
              />
              <span id="age-hint" className="block text-[12px] text-muted mt-1">
                Shows jobs whose age limit includes your age. Jobs whose notice gives no age limit stay in.
              </span>
            </label>
            </div>
          </div>
          {!more && (
            <button
              type="button"
              onClick={() => setMore(true)}
              className="sm:hidden mt-1 min-h-[44px] text-[13px] font-semibold text-navy"
            >
              More filters: type of job, central or state, age
            </button>
          )}
          <div className="mt-3 sm:mt-4 flex items-center justify-end gap-3">
            <button type="reset" className="h-11 px-3 text-[13px] font-semibold text-muted hover:text-ink">
              Clear
            </button>
            <button type="submit" className="h-11 px-6 rounded-lg bg-navy-solid hover:bg-navy-strong text-white text-sm font-bold">
              Show matching jobs
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
