"use client";

import React, { useMemo, useSyncExternalStore } from "react";
import { ArrowRight } from "lucide-react";
import { JobNotification, TodayKind, todayCounts, todayIST } from "@/data/jobs";

// the agent checks the official sites at 10:17 and 18:47 India time
const RUNS = [[10, 17], [18, 47]] as const;

function nextCheck(): string {
  const now = new Date(Date.now() + 5.5 * 3600 * 1000);
  const mins = now.getUTCHours() * 60 + now.getUTCMinutes();
  const next = RUNS.find(([h, m]) => h * 60 + m > mins);
  const [h, m] = next || RUNS[0];
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
 * One line under the search: what changed today, opening the Today list. Worked out in the browser,
 * so a cached page still knows what "today" is.
 */
const noSubscribe = () => () => {};

export function TodaySummary({ jobs }: { jobs: JobNotification[] }) {
  // the browser's date (null while rendering on the server: the line is drawn in the browser)
  const today = useSyncExternalStore(noSubscribe, todayIST, () => null);
  const counts = useMemo(() => (today ? todayCounts(jobs, today) : null), [jobs, today]);
  if (!counts) return <div className="h-[52px] border-b border-line bg-surface" aria-hidden />;

  const total = counts.reduce((n, c) => n + c.count, 0);
  const later = nextCheck();
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
            No new updates yet. Next check {later}.
          </p>
        )}
      </div>
    </div>
  );
}
