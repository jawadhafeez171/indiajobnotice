import React from "react";
import { ExternalLink, FileText } from "lucide-react";
import { JobNotification, StageKind, stageText } from "@/data/jobs";
import { formatDate } from "@/lib/utils";

const LABEL: Record<StageKind, string> = {
  schedule: "Schedule",
  admit_card: "Admit card",
  answer_key: "Answer key",
  result: "Result",
  final_result: "Final result",
};

// Every official document of the recruitment after its advertisement, newest first.
export function StageDocumentsPanel({ job }: { job: JobNotification }) {
  const docs = [...(job.stages || [])].reverse();
  if (!docs.length) return null;
  return (
    <section className="bg-surface rounded-xl border border-line p-5 sm:p-6 shadow-2xs space-y-3">
      <div>
        <h2 className="font-serif text-lg font-bold text-ink">Official documents after the notification</h2>
        {job.currentStage && <p className="text-sm font-bold text-saffron mt-0.5">{job.currentStage}</p>}
      </div>
      <ul className="divide-y divide-line-soft border border-line rounded-lg">
        {docs.map((d) => (
          <li key={d.url + d.title} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[11px] font-mono font-bold uppercase text-muted">
                {LABEL[d.kind]}
                {d.date ? ` · ${formatDate(d.date)}` : ""}
              </span>
              <p className="text-sm font-bold text-ink break-words">{stageText(d).main}</p>
              {stageText(d).original && (
                <p className="text-xs text-muted break-words mt-0.5">{stageText(d).original}</p>
              )}
              {d.examDates && d.examDates.length > 0 && (
                <p className="text-xs font-bold text-saffron mt-0.5">
                  Exam / test: {d.examDates.map((x) => formatDate(x)).join(", ")}
                </p>
              )}
            </div>
            <a
              href={d.url}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-navy-line hover:border-navy text-navy text-xs font-bold"
            >
              <FileText className="w-3.5 h-3.5" />
              Official document
              <ExternalLink className="w-3 h-3" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
