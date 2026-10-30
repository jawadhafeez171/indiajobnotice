import React from "react";
import { ExternalLink, FileText } from "lucide-react";
import { JobNotification, StageKind } from "@/data/jobs";
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
    <section className="bg-white rounded-xl border border-[#EAE2D2] p-5 sm:p-6 shadow-2xs space-y-3">
      <div>
        <h2 className="font-serif text-lg font-bold text-[#1A1918]">Official documents after the notification</h2>
        {job.currentStage && <p className="text-sm font-bold text-[#E96B15] mt-0.5">{job.currentStage}</p>}
      </div>
      <ul className="divide-y divide-[#F2ECE1] border border-[#EAE2D2] rounded-lg">
        {docs.map((d) => (
          <li key={d.url + d.title} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[10px] font-mono font-bold uppercase text-[#68635B]">
                {LABEL[d.kind]}
                {d.date ? ` · ${formatDate(d.date)}` : ""}
              </span>
              <p className="text-sm font-bold text-[#1A1918] break-words">{d.title}</p>
              {d.examDates && d.examDates.length > 0 && (
                <p className="text-xs font-bold text-[#E96B15] mt-0.5">
                  Exam / test: {d.examDates.map((x) => formatDate(x)).join(", ")}
                </p>
              )}
            </div>
            <a
              href={d.url}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-[#CCD8F0] hover:border-[#1E3799] text-[#1E3799] text-xs font-bold"
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
