"use client";

import React, { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { STATES_REGISTRY } from "@/config/states";
import { JOB_CATEGORIES, QUALIFICATIONS } from "@/components/jobs/MajorRecruitmentsSection";
import { cn } from "@/lib/utils";

const field =
  "w-full h-11 px-3 rounded-lg border border-control bg-surface text-[15px] sm:text-sm text-ink focus:border-navy";

/**
 * Search band under the home page hero: one search box, and "Advanced search" with every filter
 * of the job list (state, qualification, sector, central/state, age; the stage is the list's tabs). It sends the visitor to
 * /?q=..&state=.. where the list reads the filters and scrolls into view.
 */
export function HomeSearch({ extra }: { extra?: React.ReactNode }) {
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
    setOpen(false);
    // filter the list already on the page (no reload on slow connections); the address keeps the search
    window.history.pushState(null, "", qs ? `/?${qs}#major-recruitments` : "/#major-recruitments");
    window.dispatchEvent(new Event("ijn:query"));
  };

  return (
    <section aria-label="Search government jobs">
      <form onSubmit={submit} role="search">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-faint pointer-events-none" aria-hidden />
            <input
              type="search"
              name="q"
              placeholder="Search jobs, e.g. SSC, police"
              aria-label="Search jobs"
              className="w-full h-12 pl-11 pr-3 rounded-xl border-2 border-control bg-surface text-[15px] text-ink placeholder:text-faint focus:border-navy"
            />
          </div>
          <button
            type="submit"
            className="h-12 px-4 sm:px-6 rounded-xl bg-navy-solid hover:bg-navy-strong text-white text-sm font-bold"
          >
            Search
          </button>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-5">
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
        {extra}
        </div>

        <div id="advanced-search" hidden={!open} className="mt-3 p-4 rounded-xl border border-line bg-surface">
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
          <div className="mt-4 flex items-center justify-end gap-3">
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
