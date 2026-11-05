"use client";

import React, { useMemo, useSyncExternalStore } from "react";
import { ArrowRight } from "lucide-react";
import { CHECK_RUNS, JobNotification, TodayKind, todayCounts, updatesDay } from "@/data/jobs";

function nextCheck(): string {
  const now = new Date(Date.now() + 5.5 * 3600 * 1000);
  const mins = now.getUTCHours() * 60 + now.getUTCMinutes();
  const next = CHECK_RUNS.find(([h, m]) => h * 60 + m > mins);
  const [h, m] = next || CHECK_RUNS[0];
  const time = `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
  return next ? `today at ${time}` : `tomorrow at ${time}`;
}

const NOUN: Record<TodayKind, [string, string]> = {
  new: ["new notice", "new notices"],
  admit_card: ["admit card", "admit cards"],
  answer_key: ["answer key", "answer keys"],
  result: ["result", "results"],
  schedule: ["exam schedule", "exam schedules"],
  dates: ["date change", "date changes"],
};
const plural = (kind: TodayKind, n: number) => `${n} ${NOUN[kind][n === 1 ? 0 : 1]}`;

/**
 * One line under the search: what changed today, opening the Today list. "Today" runs from one
 * morning's first check to the next (updatesDay), so the line keeps the day's changes overnight
 * instead of emptying at midnight. The server draws it with the day the page was built (so a slow
 * phone, or one without script, never sees an empty band); the browser redraws it if its own day
 * differs (a page cached across the morning check).
 */
const noSubscribe = () => () => {};
const onServer = () => false;
const inBrowser = () => true;

export function TodaySummary({ jobs, serverToday }: { jobs: JobNotification[]; serverToday: string }) {
  const today = useSyncExternalStore(noSubscribe, updatesDay, () => serverToday);
  const hydrated = useSyncExternalStore(noSubscribe, inBrowser, onServer);
  const counts = useMemo(() => todayCounts(jobs, today), [jobs, today]);

  const total = counts.reduce((n, c) => n + c.count, 0);
  // the next check depends on the clock: only once in the browser
  const later = hydrated ? nextCheck() : null;
  return (
    <div className="border-b border-line bg-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {total ? (
          <a
            href="#today"
            className="group flex items-center gap-2 min-h-[52px] py-2 text-sm text-ink"
          >
            <span className="shrink-0 px-2 py-0.5 rounded bg-saffron-solid text-white text-[12px] font-bold">Today</span>
            <span className="min-w-0 flex-1">
              {counts.map((c, i) => (
                <span key={c.kind}>
                  {i > 0 && <span className="text-faint" aria-hidden> · </span>}
                  <b className="font-semibold">{plural(c.kind, c.count)}</b>
                </span>
              ))}
            </span>
            <ArrowRight className="w-4 h-4 shrink-0 text-navy transition-transform group-hover:translate-x-0.5" aria-hidden />
          </a>
        ) : (
          <p className="flex items-center gap-2 min-h-[52px] py-2 text-sm text-muted">
            <span className="shrink-0 px-2 py-0.5 rounded bg-subtle text-ink-2 text-[12px] font-bold">Today</span>
            {later ? <>No new updates yet. Next check {later}.</> : <>No new updates yet. Checked twice a day.</>}
          </p>
        )}
      </div>
    </div>
  );
}
