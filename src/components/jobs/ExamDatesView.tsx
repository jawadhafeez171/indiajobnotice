"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Search } from "lucide-react";
import { ExamDateEntry, getJobCanonicalPath, stageText, daysUntil } from "@/data/jobs";
import { getStateBySlug } from "@/config/states";
import { examWhen } from "./JobListCard";
import { cn } from "@/lib/utils";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
  "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function group(date: string): string {
  const d = daysUntil(date);
  if (d <= 0) return "Today";
  if (d === 1) return "Tomorrow";
  if (d < 7) return "This week";
  const [y, m] = date.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

function dayLabel(date: string): { dow: string; day: string; mon: string } {
  const [y, m, d] = date.split("-").map(Number);
  return { dow: DAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()], day: String(d).padStart(2, "0"), mon: MONTHS[m - 1].slice(0, 3) };
}

/** What the document says happens that day, in English. */
function what(e: ExamDateEntry): string {
  if (!e.stage) return "Exam date given in the notification";
  return stageText(e.stage).main;
}

export function ExamDatesView({ entries }: { entries: ExamDateEntry[] }) {
  const [region, setRegion] = useState("all");
  const [query, setQuery] = useState("");

  const regions = useMemo(() => {
    const slugs = new Set(entries.filter((e) => !e.job.isCentral).map((e) => e.job.stateSlug));
    return [...slugs]
      .map((s) => ({ slug: s, name: getStateBySlug(s)?.name || s.toUpperCase() }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [entries]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      if (region === "central" && !e.job.isCentral) return false;
      if (region !== "all" && region !== "central" && e.job.stateSlug !== region) return false;
      if (q) {
        const text = `${e.job.title} ${e.job.shortTitle} ${e.job.organization} ${e.job.orgShortCode}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [entries, region, query]);

  const groups: { title: string; items: ExamDateEntry[] }[] = [];
  for (const e of shown) {
    const t = group(e.date);
    if (!groups.length || groups[groups.length - 1].title !== t) groups.push({ title: t, items: [] });
    groups[groups.length - 1].items.push(e);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search an exam or organisation"
            className="w-full pl-9 pr-3 min-h-[44px] rounded-lg border border-line bg-surface text-[15px] sm:text-sm text-ink placeholder:text-faint focus:outline-none focus:border-navy"
          />
        </div>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="min-h-[44px] px-3 rounded-lg border border-line bg-surface text-[15px] sm:text-sm text-ink focus:outline-none focus:border-navy"
          aria-label="State"
        >
          <option value="all">All India</option>
          <option value="central">Central government</option>
          {regions.map((r) => (
            <option key={r.slug} value={r.slug}>{r.name}</option>
          ))}
        </select>
      </div>

      {groups.length === 0 && (
        <p className="py-10 text-center text-sm text-muted">No exam dates match. Try All India or a shorter search.</p>
      )}

      {groups.map((g) => (
        <section key={g.title} aria-label={g.title}>
          <h2 className="font-serif text-lg font-bold text-ink mb-3 flex items-center gap-2">
            {g.title}
            <span className="text-xs font-sans font-semibold text-muted">{g.items.length}</span>
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {g.items.map((e) => {
              const d = dayLabel(e.date);
              const docUrl = e.stage?.url || e.job.officialPdfUrl;
              return (
                <li
                  key={`${e.job.id}-${e.date}`}
                  className="relative flex gap-3 rounded-xl bg-surface border border-line shadow-2xs overflow-hidden pl-4 pr-4 py-3.5"
                >
                  <span
                    aria-hidden
                    className={cn("absolute left-0 inset-y-0 w-1.5", e.tentative ? "bg-navy-line" : "bg-navy-solid")}
                  />
                  {/* date block */}
                  <div className="shrink-0 w-14 text-center rounded-lg bg-navy-tint border border-navy-line py-1.5 h-fit">
                    <div className="text-[11px] font-bold uppercase text-navy">{d.mon}</div>
                    <div className="text-xl font-bold leading-none text-navy">{d.day}</div>
                    <div className="text-[11px] text-muted mt-0.5">{d.dow}</div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 min-w-0">
                        <span className="shrink-0 px-1.5 py-0.5 rounded bg-navy-tint text-navy font-bold text-[12px] leading-none border border-navy-line">
                          {e.job.orgShortCode}
                        </span>
                        <span className="text-[12px] text-muted truncate">
                          {e.job.isCentral ? "Central" : getStateBySlug(e.job.stateSlug)?.name || e.job.stateSlug.toUpperCase()}
                        </span>
                      </span>
                      <span className="shrink-0 text-[12px] font-bold text-navy">{examWhen(e.date)}</span>
                    </div>
                    <Link
                      href={getJobCanonicalPath(e.job)}
                      className="mt-1 block font-serif font-bold text-[15px] leading-snug text-ink hover:text-navy line-clamp-2"
                    >
                      {(e.job.shortTitle || e.job.title).replace(/\s*\(\s*[\d,]+\s+posts?\s*\)\s*$/i, "")}
                    </Link>
                    <p className="mt-1 text-[13px] text-ink-2 line-clamp-2">
                      {what(e)}
                      {e.tentative && <span className="text-muted"> · tentative, check for the admit card</span>}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] font-bold">
                      <a href={docUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-navy hover:underline">
                        {e.stage?.kind === "admit_card" ? "Admit card notice" : e.stage ? "Exam schedule" : "Notification"}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <Link href={getJobCanonicalPath(e.job)} className="text-saffron hover:underline">
                        Job details →
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
