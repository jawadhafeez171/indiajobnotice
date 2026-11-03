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

const FIRST = 6;
const th = "py-2.5 px-3.5 font-bold";

// The notice's posts: the first six, then all of them on request (one notice lists 40).
export function PostList({ rows, shared }: { rows: PostRow[]; shared: SharedValues }) {
  const [all, setAll] = useState(false);
  const shown = all ? rows : rows.slice(0, FIRST);
  const cols = (["qualification", "ageLimit", "payLevel"] as const).filter((k) => shared[k] === null);
  const label = { qualification: "Qualification", ageLimit: "Age limit", payLevel: "Pay" };
  const common = (["qualification", "ageLimit", "payLevel"] as const).filter((k) => Boolean(shared[k]));
  // a count, or "See notification" in plain text so it does not read like a heading
  const count = (v: string) => (/\d/.test(v) ? "font-bold text-ink" : "font-normal text-muted text-xs");
  // a missing count must not read as "none": say where the number is
  const shownCount = (v: string) => (/\d/.test(v) ? v : "Number in the notice");

  return (
    <div className="space-y-3">
      {common.length > 0 && (
        <dl className="text-sm text-ink-2 space-y-1">
          {common.map((k) => (
            <div key={k}>
              <dt className="inline font-bold text-ink">{label[k]}{rows.length > 1 ? ", all posts" : ""}: </dt>
              <dd className="inline">{shared[k]}</dd>
            </div>
          ))}
        </dl>
      )}

      {/* phones: one block per post */}
      <ul className="md:hidden divide-y divide-line-soft border border-line rounded-lg">
        {shown.map((post, idx) => (
          <li key={idx} className="px-3.5 py-3 text-sm">
            <p className="flex items-baseline justify-between gap-3">
              <span className="font-bold text-ink">{post.postName}</span>
              <span className={`shrink-0 tabular-nums ${count(post.vacancies)}`}>{shownCount(post.vacancies)}</span>
            </p>
            {cols.map((k) => (
              <p key={k} className="text-xs text-ink-2 mt-1">
                <span className="font-bold text-muted">{label[k]}: </span>{post[k]}
              </p>
            ))}
          </li>
        ))}
      </ul>

      {/* wider screens: a table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-line">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-subtle border-b border-line text-[12px] uppercase tracking-wide text-muted">
            <tr>
              <th scope="col" className={th}>Post</th>
              <th scope="col" className={`${th} text-right`}>Vacancies</th>
              {cols.map((k) => (
                <th key={k} scope="col" className={`${th} ${k === "qualification" ? "min-w-[220px]" : ""}`}>{label[k]}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft text-ink">
            {shown.map((post, idx) => (
              <tr key={idx} className="align-top">
                <th scope="row" className="py-2.5 px-3.5 font-semibold text-ink text-left">{post.postName}</th>
                <td className={`py-2.5 px-3.5 text-right tabular-nums ${count(post.vacancies)}`}>{shownCount(post.vacancies)}</td>
                {cols.map((k) => (
                  <td key={k} className="py-2.5 px-3.5 text-ink-2 leading-relaxed">{post[k]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length > FIRST && (
        <button
          type="button"
          onClick={() => setAll((v) => !v)}
          aria-expanded={all}
          className="inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-lg border border-line hover:border-navy text-sm font-bold text-navy"
        >
          {all ? "Show fewer posts" : `Show all ${rows.length} posts`}
          <ChevronDown className={`w-4 h-4 transition-transform ${all ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
}
