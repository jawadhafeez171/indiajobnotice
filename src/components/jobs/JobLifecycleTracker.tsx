import React from "react";
import { CheckCircle2, Clock, CircleDot } from "lucide-react";
import { JobNotification, StageKind, todayIST } from "@/data/jobs";
import { formatDate } from "@/lib/utils";

interface Props {
  job: JobNotification;
}

const KIND_LABEL: Record<StageKind, string> = {
  schedule: "Exam / interview schedule",
  admit_card: "Admit card",
  answer_key: "Answer key",
  result: "Result",
  final_result: "Final result",
};

interface Step {
  id: string;
  label: string;
  subtext: string;
  isDone: boolean;
  isCurrent: boolean;
}

// The recruitment's real steps: the notification, the application window (or walk-in date), then
// each official document the notice agent found. Nothing is assumed about stages not yet announced.
export function JobLifecycleTracker({ job }: Props) {
  const today = todayIST();
  const end = job.applicationEndDate;
  const open = Boolean(end) && end >= today;
  const steps: Step[] = [
    {
      id: "notification",
      label: "Notification",
      subtext: job.applicationStartDate ? formatDate(job.applicationStartDate) : "Published",
      isDone: true,
      isCurrent: false,
    },
    job.isWalkIn
      ? {
          id: "walk_in",
          label: "Walk-in interview",
          subtext: end ? formatDate(end) : "See notification",
          isDone: Boolean(end) && end < today,
          isCurrent: open,
        }
      : {
          id: "application",
          label: open ? "Applications open" : "Applications",
          subtext: end ? `${open ? "Till" : "Closed"} ${formatDate(end)}` : "See notification",
          isDone: Boolean(end) && !open,
          isCurrent: open,
        },
    ...(job.stages || []).map((s, i) => ({
      id: `stage-${i}`,
      label: KIND_LABEL[s.kind],
      subtext: s.date ? formatDate(s.date) : s.title,
      isDone: true,
      isCurrent: false,
    })),
  ];
  const finished = (job.stages || []).some((s) => s.kind === "final_result");
  if (!finished && !open) {
    steps.push({
      id: "next",
      label: "Next stage",
      subtext: job.currentStage || `To be announced by ${job.orgShortCode}`,
      isDone: false,
      isCurrent: true,
    });
  }

  return (
    <div className="bg-white rounded-xl border border-[#D5CAB5] p-5 shadow-2xs">
      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1E3799] mb-4 flex items-center gap-1.5">
        <CircleDot className="w-3.5 h-3.5 text-[#1E3799]" />
        Recruitment progress
      </h4>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {steps.map((step, idx) => (
          <div
            key={step.id}
            className={`p-3 rounded-lg border flex flex-col justify-between ${
              step.isCurrent
                ? "bg-[#EEF2FA] border-[#1E3799] ring-2 ring-[#1E3799]/20"
                : step.isDone
                ? "bg-[#EDF7F0] border-[#C6E7D0]"
                : "bg-[#FCFAF4] border-[#D5CAB5] opacity-65"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold text-[#4F4A43]">Step {idx + 1}</span>
              {step.isCurrent ? (
                <span className="w-2.5 h-2.5 rounded-full bg-[#1E3799]" />
              ) : step.isDone ? (
                <CheckCircle2 className="w-4 h-4 text-[#17803A]" />
              ) : (
                <Clock className="w-3.5 h-3.5 text-[#4F4A43]" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-[#1A1918] leading-snug">{step.label}</p>
              <p className="text-[12px] text-[#4F4A43] mt-0.5 line-clamp-2">{step.subtext}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
