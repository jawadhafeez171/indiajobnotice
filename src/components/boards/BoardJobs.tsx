"use client";

import React, { useEffect, useState } from "react";
import { JobNotification } from "@/data/jobs";
import { JobRow, rowTitle } from "@/components/jobs/JobListCard";
import { noticeArea } from "@/lib/internal-links";
import { ExamsInProgressSection } from "@/components/jobs/ExamsInProgressSection";

/**
 * A board's notices, with a department filter when the board recruits for several (KEA holds exams for the
 * Fire and Emergency Services, Prisons, Water Supply...). Departments are the notices' own organisation names.
 */
/** The post first, then its cadre, as the state page's rows say it. */
function titleOf(j: JobNotification): string {
  const t = rowTitle(j);
  const area = noticeArea(j)?.code;
  return area ? `${t.replace(/\s*\((?:KK|RPC)\)/g, "").replace(/\s{2,}/g, " ").trim()} · ${area === "KK" ? "Kalyana Karnataka (KK)" : "Rest of Karnataka (RPC)"}` : t;
}

/** A department's name for its chip: the state's name before it is the page's own ("Karnataka State Police
 * Department" -> "State Police Department" on a Karnataka page); the full name stays in the title. */
function short(d: string, stateName: string): string {
  const t = d.replace(new RegExp(`^${stateName}\\s+`, "i"), "");
  return t.length >= 6 ? t.charAt(0).toUpperCase() + t.slice(1) : d;
}

export function BoardJobs({ open, underWay, earlier, dept, boardName, stateName, sitesHref, sitesCount }: {
  open: JobNotification[];
  underWay: JobNotification[];
  earlier: JobNotification[];
  /** job id -> department name ("" = the board itself) */
  dept: Record<string, string>;
  boardName: string;
  stateName: string;
  sitesHref: string;
  sitesCount: number;
}) {
  const [only, setOnlyState] = useState<string | null>(null);
  const [allChips, setAllChips] = useState(false);
  const [byPosts, setByPosts] = useState(false);
  // the chosen department is kept in the address (?dept=), so Back from a notice and a shared link keep it
  useEffect(() => {
    const d = new URLSearchParams(window.location.search).get("dept");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read once from the address on arrival
    if (d !== null) setOnlyState(d === "own" ? "" : d);
  }, []);
  const setOnly = (d: string | null) => {
    setOnlyState(d);
    const u = new URLSearchParams(window.location.search);
    if (d === null) u.delete("dept");
    else u.set("dept", d === "" ? "own" : d);
    const qs = u.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`);
  };
  const all = [...open, ...underWay, ...earlier];
  const counts = new Map<string, number>();
  for (const j of all) counts.set(dept[j.id] || "", (counts.get(dept[j.id] || "") || 0) + 1);
  const depts = [...counts.entries()].sort((a, b) => (a[0] === "" ? -1 : b[0] === "" ? 1 : b[1] - a[1] || a[0].localeCompare(b[0])));
  const keep = (j: JobNotification) => only === null || (dept[j.id] || "") === only;
  const o = open.filter(keep).sort((a, b) => (byPosts ? (b.totalVacancies || 0) - (a.totalVacancies || 0) : 0)), u = underWay.filter(keep), e = earlier.filter(keep);

  return (
    <div className="space-y-10">
      {depts.length > 1 && (() => {
        const chips = [[null, all.length] as const, ...depts.map(([d, n]) => [d, n] as const)];
        // four first; the chosen one stays in view when folded
        const shown = allChips || chips.length <= 6 ? chips : chips.filter((c, i) => i < 5 || c[0] === only);
        return (
          <div>
            <p className="text-sm font-semibold text-ink">Recruiting for</p>
            <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Show notices by department">
              {shown.map(([d, n]) => {
                const active = only === d;
                const label = d === null ? "All" : d === "" ? boardName : short(d, stateName);
                return (
                  <button key={d ?? "all"} type="button" aria-pressed={active} onClick={() => setOnly(d)} title={d || boardName}
                    className={`inline-flex min-h-[44px] max-w-full items-center gap-1.5 rounded-2xl border px-3.5 py-1.5 text-left text-[13px] font-semibold leading-snug ${active ? "border-transparent bg-navy-solid text-white" : "border-line bg-surface text-ink hover:border-navy"}`}>
                    <span className="line-clamp-2">{label}</span>
                    <span className={`shrink-0 tabular-nums ${active ? "text-white/80" : "text-muted"}`}>{n}</span>
                  </button>
                );
              })}
              {chips.length > 6 && (
                <button type="button" onClick={() => setAllChips(!allChips)} aria-expanded={allChips}
                  className="inline-flex min-h-[44px] items-center rounded-full px-3 text-[13px] font-bold text-navy hover:text-saffron">
                  {allChips ? "Show fewer" : `${chips.length - shown.length} more`}
                </button>
              )}
            </div>
            <p className="mt-2 text-[13px] text-ink-2" aria-live="polite">
              {only !== null && <>Showing {o.length + u.length + e.length} of {all.length} · {only || boardName}.{" "}
                <button type="button" onClick={() => setOnly(null)} className="inline-flex min-h-[44px] items-center font-semibold text-navy underline underline-offset-2">Show all</button></>}
            </p>
          </div>
        );
      })()}

      <section aria-labelledby="open-h">
        <h2 id="open-h" className="font-serif text-xl font-bold text-ink">
          Open now <span className="ml-1 font-sans text-base font-semibold text-muted tabular-nums">{only !== null && o.length !== open.length ? `${o.length} of ${open.length}` : o.length}</span>
        </h2>
        {o.length > 2 && (
          <div className="mt-2 flex items-center gap-1 text-[13px]" role="group" aria-label="Order">
            <span className="text-ink-2">Order:</span>
            {[[false, "Last date first"], [true, "Most posts first"]].map(([v, l]) => (
              <button key={String(v)} type="button" aria-pressed={byPosts === v} onClick={() => setByPosts(v as boolean)}
                className={`inline-flex min-h-[44px] items-center rounded-lg px-2.5 font-semibold ${byPosts === v ? "text-navy underline underline-offset-4" : "text-ink-2 hover:text-navy"}`}>
                {l as string}
              </button>
            ))}
          </div>
        )}
        {o.length ? (
          <ul className="mt-3 divide-y divide-line-soft rounded-xl border border-line bg-surface">
            {o.map((j) => (
              <li key={j.id}>
                <JobRow job={j} hidePlace title={titleOf(j)} />
                {dept[j.id] && only === null && <p className="-mt-1 pb-2 pl-8 text-[12px] text-muted">For {dept[j.id]}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-ink-2 max-w-prose">
            No notice {only !== null ? `for ${only || boardName} ` : ""}is open for applications right now. New ones appear here once the
            official site posts them.{" "}
            {only !== null && <button type="button" onClick={() => setOnly(null)} className="font-semibold text-navy underline underline-offset-2">Show all departments</button>}
            <span className="block mt-1">Get them as they come: <a href="https://t.me/india_jobnotice" target="_blank" rel="noreferrer" className="font-semibold text-navy underline underline-offset-2">Telegram</a> or{" "}
              <a href="https://whatsapp.com/channel/0029Vb9GFwsGzzKXYJyKer1C" target="_blank" rel="noreferrer" className="font-semibold text-navy underline underline-offset-2">WhatsApp</a>.</span>
            {only === null && (
              <span className="block mt-1">Other bodies may be hiring: <a href={sitesHref} className="font-semibold text-navy underline underline-offset-2">all {sitesCount} official sites we check for {stateName}</a>.</span>
            )}
          </p>
        )}
      </section>

      <ExamsInProgressSection jobs={u} limit={4} expandRest heading="Recruitments under way" helpOpen />
      {only !== null && !u.length && underWay.length > 0 && (
        <p className="text-sm text-ink-2">No recruitment of {only || boardName} is under way.</p>
      )}

      {e.length > 0 && (
        <section aria-labelledby="earlier-h" className="border-t border-line pt-6">
          <h2 id="earlier-h" className="font-serif text-xl font-bold text-ink">
            Earlier notices <span className="ml-1 font-sans text-base font-semibold text-muted tabular-nums">{e.length}</span>
          </h2>
          <p className="mt-1 text-sm text-ink-2">Applications closed. From the last 12 months.</p>
          <ul className="mt-3 divide-y divide-line-soft rounded-xl border border-line bg-surface">
            {e.slice(0, 12).map((j) => (
              <li key={j.id}><JobRow job={j} hidePlace title={titleOf(j)} /></li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
