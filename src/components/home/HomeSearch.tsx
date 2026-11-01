"use client";

import React, { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { STATES_REGISTRY } from "@/config/states";
import { JOB_CATEGORIES, QUALIFICATIONS, TABS, TAB_ORDER, STAGE_PARAM } from "@/components/jobs/MajorRecruitmentsSection";
import { cn } from "@/lib/utils";

const STAGES = TAB_ORDER.map((key) => ({
  value: Object.keys(STAGE_PARAM).find((k) => STAGE_PARAM[k] === key) as string,
  label: TABS[key].label,
}));

const field =
  "w-full h-11 px-3 rounded-lg border border-line bg-surface text-[15px] sm:text-sm text-ink focus:outline-none focus:border-navy";

/**
 * Search band under the home page hero: one search box, and "Advanced search" with every filter
 * of the job list (state, qualification, sector, stage, central/state, age). It sends the visitor to
 * /?q=..&state=.. where the list reads the filters and scrolls into view.
 */
export function HomeSearch() {
  const [open, setOpen] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    for (const [k, v] of data.entries()) {
      const val = String(v).trim();
      if (val && val !== "ALL") params.set(k, val);
    }
    const qs = params.toString();
    window.location.assign(qs ? `/?${qs}#major-recruitments` : "/#major-recruitments");
  };

  return (
    <section aria-label="Search government jobs" className="border-b border-line bg-surface">
      <form onSubmit={submit} className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-5" role="search">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
            <input
              type="search"
              name="q"
              placeholder="Search a post, exam or organisation"
              aria-label="Search jobs"
              className="w-full h-12 pl-11 pr-3 rounded-xl border-2 border-line bg-subtle text-[15px] text-ink placeholder:text-faint focus:outline-none focus:border-navy focus:bg-surface"
            />
          </div>
          <button
            type="submit"
            className="h-12 px-4 sm:px-6 rounded-xl bg-navy-solid hover:bg-navy-strong text-white text-sm font-bold"
          >
            Search
          </button>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="advanced-search"
          className="mt-2.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-navy hover:underline"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Advanced search
          <ChevronDown className={cn("w-4 h-4 transition-transform", open && "rotate-180")} />
        </button>

        <div id="advanced-search" hidden={!open} className="mt-3 pt-4 border-t border-line-soft">
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
            <label className="block">
              <span className="block text-[12px] font-semibold text-muted mb-1">Sector</span>
              <select name="sector" defaultValue="ALL" className={field}>
                <option value="ALL">All sectors</option>
                {JOB_CATEGORIES.filter((c) => c !== "ALL").map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="block text-[12px] font-semibold text-muted mb-1">Stage</span>
              <select name="stage" defaultValue="ALL" className={field}>
                <option value="ALL">Any stage</option>
                {STAGES.filter((s) => s.value !== "all").map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="block text-[12px] font-semibold text-muted mb-1">Central or state</span>
              <select name="scope" defaultValue="ALL" className={field}>
                <option value="ALL">Both</option>
                <option value="central">Central government</option>
                <option value="state">State government</option>
              </select>
            </label>
            <label className="block">
              <span className="block text-[12px] font-semibold text-muted mb-1">Your age (years)</span>
              <input type="number" name="age" min={14} max={70} inputMode="numeric" placeholder="e.g. 27" className={field} />
            </label>
          </div>
          <div className="mt-4 flex items-center justify-end gap-3">
            <button type="reset" className="text-[13px] font-semibold text-muted hover:text-ink">
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
