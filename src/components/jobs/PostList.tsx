"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface PostRow {
  postName: string;
  vacancies: string;
  qualification: string;
  ageLimit: string;
  payLevel: string;
}

/**
 * A value every post shares is shown once above the list; `null` means it differs by post (a column),
 * "" that the key facts above already give it (not repeated).
 */
export interface SharedValues {
  qualification: string | null;
  ageLimit: string | null;
  payLevel: string | null;
}

type Col = "qualification" | "payLevel";
type Row = PostRow & { where: string; code: string };
interface Group { post: string; rows: Row[]; total: number | null }

const LABEL: Record<Col, string> = { qualification: "Qualification", payLevel: "Pay" };
const FIRST = 6;

// Wide screens: every row on one grid (fold mark | post | vacancies | what differs by post), so groups,
// their departments and single posts line up under the same column names. Literal classes for Tailwind.
const GRID: Record<number, string> = {
  0: "md:grid-cols-[1rem_minmax(0,1fr)_5.5rem]",
  1: "md:grid-cols-[1rem_minmax(0,1.6fr)_5.5rem_minmax(0,1.6fr)]",
  2: "md:grid-cols-[1rem_minmax(0,1.6fr)_5.5rem_minmax(0,1.5fr)_minmax(0,1fr)]",
};

/** "Junior Engineer (Electrical) - Delhi Transco Limited (Post Code 809/26)" -> post, where, code. */
function split(name: string): { post: string; where: string; code: string } {
  const code = name.match(/\s*\(((?:post\s*code|advt\.?|cat\.?\s*no)[^)]*)\)\s*$/i);
  const rest = code ? name.slice(0, code.index).trim() : name.trim();
  const at = rest.search(/\s+[-–—]\s+/);
  return at > 3
    ? { post: rest.slice(0, at).trim(), where: rest.slice(at).replace(/^\s*[-–—]\s*/, "").trim(), code: code?.[1] || "" }
    : { post: rest, where: "", code: code?.[1] || "" };
}

/**
 * Posts that are one job in several departments (DSSSB: Junior Engineer in five bodies) become one line with
 * their total; the departments open beneath it. A post listed once stays a line of its own, with its full name.
 */
function groupRows(rows: PostRow[]): Group[] {
  const groups: Group[] = [];
  const byPost = new Map<string, Group>();
  for (const r of rows) {
    const s = split(r.postName);
    const key = s.where ? s.post.toLowerCase() : `#${groups.length}`;
    let g = byPost.get(key);
    if (!g) {
      g = { post: s.post, rows: [], total: 0 };
      byPost.set(key, g);
      groups.push(g);
    }
    g.rows.push({ ...r, where: s.where, code: s.code });
    const n = Number(r.vacancies.replace(/,/g, ""));
    g.total = g.total === null || !/\d/.test(r.vacancies) || Number.isNaN(n) ? null : g.total + n;
  }
  for (const g of groups) if (g.rows.length === 1 && g.rows[0].where) g.post = `${g.post} - ${g.rows[0].where}`;
  return groups;
}

// a count, or "Number in the notice" in plain text so it does not read like a heading
const countCls = (v: string) => (/\d/.test(v) ? "font-bold text-ink tabular-nums" : "font-normal text-muted text-xs");
const countText = (v: string) => (/\d/.test(v) ? v : "Number in the notice");

/** The one value every row of a group shares, else null. */
function same(rows: PostRow[], k: Col): string | null {
  const v = new Set(rows.map((r) => r[k]));
  return v.size === 1 ? [...v][0] : null;
}

const chev = "w-4 h-4 mt-0.5 shrink-0 text-muted transition-transform group-open:rotate-180";
const summary = "cursor-pointer list-none [&::-webkit-details-marker]:hidden";

function Values({ row, cols }: { row: PostRow; cols: Col[] }) {
  return (
    <>
      {cols.map((k) => (
        <p key={k} className="mt-1 md:mt-0 text-[13px] md:text-sm text-ink-2 md:leading-relaxed">
          <span className="font-semibold text-muted md:hidden">{LABEL[k]}: </span>{row[k]}
        </p>
      ))}
    </>
  );
}

export function PostList({ rows, shared }: { rows: PostRow[]; shared: SharedValues }) {
  const [all, setAll] = useState(false);
  const cols = (["qualification", "payLevel"] as const).filter((k) => shared[k] === null);
  const common = (["qualification", "payLevel"] as const).filter((k) => Boolean(shared[k]));
  const groups = groupRows(rows);
  const shown = all ? groups : groups.slice(0, FIRST);
  const grid = `md:grid ${GRID[cols.length]} md:gap-x-4`;

  return (
    <div>
      {common.length > 0 && (
        <dl className="mb-3 text-sm text-ink-2 space-y-1">
          {common.map((k) => (
            <div key={k}>
              <dt className="inline font-bold text-ink">{LABEL[k]}{rows.length > 1 ? ", all posts" : ""}: </dt>
              <dd className="inline">{shared[k]}</dd>
            </div>
          ))}
        </dl>
      )}

      {/* column names, wide screens only */}
      <div className={`hidden ${grid} pb-2 border-b border-line text-[12px] font-bold uppercase tracking-wide text-muted`}>
        <span />
        <span>Post</span>
        <span className="text-right">Vacancies</span>
        {cols.map((k) => <span key={k}>{LABEL[k]}</span>)}
      </div>

      <ul className="divide-y divide-line-soft border-y border-line-soft md:border-t-0">
        {shown.map((grp, idx) => {
          if (grp.rows.length === 1) {
            const r = grp.rows[0];
            const name = (
              <span className="min-w-0">
                <span className="font-semibold text-ink">{grp.post}</span>
                {r.code && <span className="block text-xs text-muted">{r.code}</span>}
              </span>
            );
            const count = <span className={`text-right ${countCls(r.vacancies)}`}>{countText(r.vacancies)}</span>;
            return (
              <li key={idx} className="text-sm">
                {cols.length > 0 && (
                  // phones: what differs by post opens on a tap
                  <details className="group md:hidden">
                    <summary className={`grid grid-cols-[1rem_minmax(0,1fr)_auto] gap-x-2 py-3 ${summary}`}>
                      <ChevronDown className={chev} aria-hidden />
                      {name}
                      {count}
                    </summary>
                    <div className="pb-3 pl-6"><Values row={r} cols={cols} /></div>
                  </details>
                )}
                <div className={`${cols.length ? "hidden" : "grid grid-cols-[minmax(0,1fr)_auto] gap-x-3"} ${grid} py-3`}>
                  <span className="hidden md:block" />
                  {name}
                  {count}
                  {cols.length > 0 && <Values row={r} cols={cols} />}
                </div>
              </li>
            );
          }

          // one post in several departments: the total, then each department on a tap
          const total = grp.total === null ? null : grp.total.toLocaleString("en-IN");
          const groupValue = (k: Col) => same(grp.rows, k);
          return (
            <li key={idx} className="text-sm">
              <details className="group">
                <summary className={`grid grid-cols-[1rem_minmax(0,1fr)_auto] gap-x-2 ${GRID[cols.length]} md:gap-x-4 py-3 ${summary}`}>
                  <ChevronDown className={chev} aria-hidden />
                  <span className="min-w-0">
                    <span className="font-semibold text-ink">{grp.post}</span>
                    <span className="block text-xs font-semibold text-navy">{grp.rows.length} departments</span>
                  </span>
                  <span className="text-right font-bold text-ink tabular-nums">{total ?? <span className="text-xs font-normal text-muted">Numbers in the notice</span>}</span>
                  {cols.map((k) => (
                    <span key={k} className="hidden md:block text-ink-2 leading-relaxed">
                      {groupValue(k) ?? <span className="text-muted">Differs by department</span>}
                    </span>
                  ))}
                </summary>
                <ul className="pb-2">
                  {grp.rows.map((r, i) => (
                    <li key={i} className={`grid grid-cols-[1rem_minmax(0,1fr)_auto] gap-x-2 ${grid} py-2`}>
                      <span />
                      <span className="min-w-0 border-l-2 border-line-soft pl-3 text-ink-2">
                        {r.where}
                        {r.code && <span className="block text-xs text-muted">{r.code}</span>}
                        {/* phones: the values that differ, under the department */}
                        <span className="block md:hidden">
                          <Values row={r} cols={cols.filter((k) => !groupValue(k) || i === 0)} />
                        </span>
                      </span>
                      <span className={`text-right ${countCls(r.vacancies)}`}>{countText(r.vacancies)}</span>
                      {cols.map((k) => (
                        <span key={k} className="hidden md:block text-ink-2 leading-relaxed">{groupValue(k) ? "" : r[k]}</span>
                      ))}
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          );
        })}
      </ul>

      {groups.length > FIRST && (
        <button
          type="button"
          onClick={() => setAll((v) => !v)}
          aria-expanded={all}
          className="mt-2 inline-flex items-center gap-1.5 min-h-[44px] text-sm font-bold text-navy hover:text-saffron"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${all ? "rotate-180" : ""}`} aria-hidden />
          {all ? "Show fewer posts" : `Show all ${groups.length} posts`}
        </button>
      )}
    </div>
  );
}
