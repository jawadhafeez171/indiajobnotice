import React from "react";
import { JobNotification } from "@/data/jobs";

/**
 * Vacancies by category (a part of the posts card), as the notification prints them (the agent sends a table only when each
 * post's categories add up to its vacancies). Horizontal reservations given post by post are columns of the table;
 * any others are listed below it.
 */
export function ReservationTable({ job }: { job: JobNotification }) {
  const t = job.reservation;
  if (!t || !t.rows.length) return null;
  const onePost = t.rows.length === 1 && !t.rows[0].post;

  const rowNames = new Set(t.rows.map((r) => r.post));
  const inColumns = t.horizontal.length > 0 && t.horizontal.every((h) => rowNames.has(h.post));
  const horizontalCols = inColumns ? [...new Set(t.horizontal.map((h) => h.category))] : [];
  const horizontalOf = (post: string, category: string) =>
    t.horizontal.find((h) => h.post === post && h.category === category)?.count;

  return (
    <div>
      <p className="text-[13px] text-muted">
        As given in the notification. Check it for the rules of each category.
        {inColumns && " Horizontal seats are the same seats counted another way, not extra ones."}
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className={`w-full border-collapse ${inColumns ? "text-[13px] [&_td]:px-1.5 [&_th]:px-1.5 [&_th:first-child]:pl-0" : "text-sm"}`}>
          <thead>
            {inColumns && (
              <tr className="text-[12px] font-bold text-ink-2">
                {!onePost && <td className="sticky left-0 z-10 bg-surface" />}
                <th scope="colgroup" colSpan={t.categories.length + 1} className="pt-1 px-3 text-center">Category</th>
                <th scope="colgroup" colSpan={horizontalCols.length} className="pt-1 px-3 text-center border-l border-line">Horizontal</th>
              </tr>
            )}
            <tr className="border-b border-line text-[12px] font-semibold text-muted">
              {!onePost && <th scope="col" className="sticky left-0 z-10 bg-surface py-2 pr-4 text-left">Post</th>}
              {t.categories.map((c) => (
                <th key={c} scope="col" className="py-2 px-3 text-right whitespace-nowrap">{c}</th>
              ))}
              <th scope="col" className="py-2 pl-3 pr-3 text-right">Total</th>
              {horizontalCols.map((c, i) => (
                <th key={c} scope="col" className={`py-2 px-3 text-right align-bottom${i === 0 ? " border-l border-line" : ""}`}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {t.rows.map((r) => (
              <tr key={r.post || "all"}>
                {!onePost && <th scope="row" className="sticky left-0 z-10 bg-surface py-2.5 pr-4 text-left font-medium text-ink-2 min-w-[8rem] sm:min-w-[12rem] shadow-[1px_0_0_rgb(var(--c-line))]">{r.post || "All posts"}</th>}
                {t.categories.map((c) => (
                  <td key={c} className="py-2.5 px-3 text-right tabular-nums text-ink">
                    {r.counts[c] ?? <span className="text-faint">–</span>}
                  </td>
                ))}
                <td className="py-2.5 pl-3 pr-3 text-right tabular-nums font-bold text-ink">{r.total.toLocaleString("en-IN")}</td>
                {horizontalCols.map((c, i) => (
                  <td key={c} className={`py-2.5 px-3 text-right tabular-nums text-ink${i === 0 ? " border-l border-line" : ""}`}>
                    {horizontalOf(r.post, c) ?? <span className="text-faint">–</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {t.horizontal.length > 0 && !inColumns && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-ink">Within these categories</h4>
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
    </div>
  );
}
