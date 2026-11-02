import React from "react";
import { JobNotification } from "@/data/jobs";

/**
 * Vacancies by category, as the notification prints them (the agent sends a table only when each
 * post's categories add up to its vacancies). Horizontal reservations are listed below the table.
 */
export function ReservationTable({ job }: { job: JobNotification }) {
  const t = job.reservation;
  if (!t || !t.rows.length) return null;
  const onePost = t.rows.length === 1 && !t.rows[0].post;
  return (
    <section aria-labelledby="by-category" className="bg-surface rounded-xl border border-line p-5 sm:p-6 shadow-2xs">
      <h2 id="by-category" className="font-serif text-xl font-bold text-ink">Vacancies by category</h2>
      <p className="mt-1 text-[13px] text-muted">As given in the notification. Check it for the rules of each category.</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-line text-[12px] font-semibold text-muted">
              {!onePost && <th scope="col" className="py-2 pr-4 text-left">Post</th>}
              {t.categories.map((c) => (
                <th key={c} scope="col" className="py-2 px-3 text-right whitespace-nowrap">{c}</th>
              ))}
              <th scope="col" className="py-2 pl-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {t.rows.map((r) => (
              <tr key={r.post || "all"}>
                {!onePost && <th scope="row" className="py-2.5 pr-4 text-left font-medium text-ink-2 min-w-[8rem] sm:min-w-[12rem]">{r.post || "All posts"}</th>}
                {t.categories.map((c) => (
                  <td key={c} className="py-2.5 px-3 text-right tabular-nums text-ink">
                    {r.counts[c] ?? <span className="text-faint">–</span>}
                  </td>
                ))}
                <td className="py-2.5 pl-3 text-right tabular-nums font-bold text-ink">{r.total.toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {t.horizontal.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-ink">Within these categories</h3>
          <ul className="mt-1 text-sm text-ink-2 space-y-0.5">
            {t.horizontal.map((h, i) => (
              <li key={i}>
                {h.category}: <b className="text-ink tabular-nums">{h.count}</b>
                {h.post && t.rows.length > 1 && <span className="text-muted"> ({h.post})</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
