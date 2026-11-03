import React from "react";
import { UPSC_PLAN, UPSC_CALENDAR_SOURCE, UpscPlan } from "@/data/upsc-calendar";
import { todayIST } from "@/data/jobs";
import { formatDate } from "@/lib/utils";

const cell = (d?: string) => (d ? formatDate(d) : <span className="text-faint">–</span>);

function Rows({ rows }: { rows: UpscPlan[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full text-sm border-collapse min-w-[640px]">
        <thead className="bg-subtle text-left text-[12px] font-semibold text-muted">
          <tr>
            <th scope="col" className="py-2.5 px-3">Examination</th>
            <th scope="col" className="py-2.5 px-3 whitespace-nowrap">Notification</th>
            <th scope="col" className="py-2.5 px-3 whitespace-nowrap">Last date to apply</th>
            <th scope="col" className="py-2.5 px-3 whitespace-nowrap">Exam starts</th>
            <th scope="col" className="py-2.5 px-3">Duration</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line-soft">
          {rows.map((r) => (
            <tr key={`${r.calendar}-${r.exam}`} className="align-top">
              <th scope="row" className="py-2.5 px-3 text-left font-semibold text-ink">{r.exam}</th>
              <td className="py-2.5 px-3 tabular-nums whitespace-nowrap text-ink-2">{cell(r.notification)}</td>
              <td className="py-2.5 px-3 tabular-nums whitespace-nowrap text-ink-2">{cell(r.lastDate)}</td>
              <td className="py-2.5 px-3 tabular-nums whitespace-nowrap font-semibold text-ink">{formatDate(r.examDate)}</td>
              <td className="py-2.5 px-3 whitespace-nowrap text-ink-2">{r.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** UPSC's own calendar of examinations: the exams still ahead, then the ones held this year. */
export function UpscCalendarTable() {
  const today = todayIST();
  const ahead = UPSC_PLAN.filter((r) => r.examDate >= today).sort((a, b) => a.examDate.localeCompare(b.examDate));
  const held = UPSC_PLAN.filter((r) => r.examDate < today).sort((a, b) => b.examDate.localeCompare(a.examDate));

  return (
    <section id="upsc-calendar" aria-labelledby="upsc-calendar-h" className="max-w-6xl mx-auto px-4 sm:px-6 pb-10 scroll-mt-32 space-y-3">
      <h2 id="upsc-calendar-h" className="font-serif text-xl font-bold text-ink">UPSC calendar of examinations</h2>
      <p className="text-sm text-muted max-w-[68ch]">
        Planned dates from UPSC&apos;s own programmes for 2026 and 2027 (the 2027 one as on 20 May 2026).
        UPSC says these dates may change; each notification, when it comes, gives the dates that count.{" "}
        <a href={UPSC_CALENDAR_SOURCE.url} target="_blank" rel="noreferrer" className="font-semibold text-navy underline underline-offset-2">
          upsc.gov.in
        </a>
      </p>
      <Rows rows={ahead} />
      {held.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer list-none inline-flex items-center min-h-[44px] text-sm font-semibold text-navy underline underline-offset-2 [&::-webkit-details-marker]:hidden">
            Exams already held ({held.length})
          </summary>
          <div className="mt-2">
            <Rows rows={held} />
          </div>
        </details>
      )}
    </section>
  );
}
