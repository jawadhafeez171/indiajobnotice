import React from "react";
import { CheckCircle2, Clock, CircleDot } from "lucide-react";
import { JobNotification } from "@/data/jobs";

interface Props {
  job: JobNotification;
}

export function JobLifecycleTracker({ job }: Props) {
  const stages = [
    {
      id: "notification",
      label: "Official Notification",
      subtext: "Gazetted & Published",
      isDone: true,
      isCurrent: false,
    },
    {
      id: "application",
      label: "Online Application",
      subtext: `Till ${job.applicationEndDate}`,
      isDone: job.status !== "UPCOMING",
      isCurrent: job.status === "APPLY_OPEN" || job.status === "LAST_DATE_NEAR",
    },
    {
      id: "admit_card",
      label: "Admit Card",
      subtext: job.admitCardDate || "Announcing Soon",
      isDone: job.status === "ADMIT_CARD_OUT" || job.status === "RESULT_OUT",
      isCurrent: job.status === "ADMIT_CARD_OUT",
    },
    {
      id: "exam",
      label: "Written Exam",
      subtext: job.examDate || "Commission Schedule",
      isDone: job.status === "RESULT_OUT",
      isCurrent: false,
    },
    {
      id: "result",
      label: "Final Result & Cutoff",
      subtext: job.resultDate || "Post-Exam Verification",
      isDone: job.status === "RESULT_OUT",
      isCurrent: job.status === "RESULT_OUT",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#EAE2D2] p-5 shadow-2xs">
      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1E3799] mb-4 flex items-center gap-1.5">
        <CircleDot className="w-3.5 h-3.5 text-[#1E3799]" />
        Recruitment Lifecycle Progress
      </h4>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {stages.map((stage, idx) => {
          return (
            <div
              key={stage.id}
              className={`p-3 rounded-lg border flex flex-col justify-between transition-all ${
                stage.isCurrent
                  ? "bg-[#EEF2FA] border-[#1E3799] ring-2 ring-[#1E3799]/20"
                  : stage.isDone
                  ? "bg-[#EDF7F0] border-[#C6E7D0]"
                  : "bg-[#FCFAF4] border-[#EAE2D2] opacity-65"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-[#68635B]">
                  Stage 0{idx + 1}
                </span>
                {stage.isCurrent ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1E3799] animate-pulse" />
                ) : stage.isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-[#209948]" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-[#68635B]" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-[#1A1918] leading-snug">
                  {stage.label}
                </p>
                <p className="text-[11px] text-[#68635B] mt-0.5 line-clamp-1">
                  {stage.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
