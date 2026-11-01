import React from "react";
import Link from "next/link";
import { JobNotification, getJobCanonicalPath, getStages } from "@/data/jobs";
import { FileText, Ticket, KeyRound, Award, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  job: JobNotification;
  activeStage: "notice" | "eligibility" | "admit-card" | "answer-key" | "result";
  stateSlug?: string;
}

export function ExaminationLifecycleBar({ job, activeStage }: Props) {
  const basePrefix = getJobCanonicalPath(job);
  // Released only when the agent found the official document; otherwise say so plainly.
  const tile = (kind: "admit_card" | "answer_key" | "result") => {
    const docs = getStages(job, kind);
    const last = docs[docs.length - 1];
    return docs.length
      ? { subLabel: last.date ? `Out ${last.date.split("-").reverse().join("/")}` : "Released",
          badge: "Out", badgeColor: "bg-[#EDF7F0] text-[#17803A]" }
      : { subLabel: "Not released yet", badge: "Awaited", badgeColor: "bg-[#FAF7EF] text-[#4F4A43]" };
  };

  const stages = [
    {
      id: "notice",
      label: "Official Notice",
      subLabel: "Vacancies & PDF",
      href: basePrefix,
      icon: FileText,
      badge: "Notice",
      badgeColor: "bg-[#EEF2FA] text-[#1E3799]",
    },
    {
      id: "eligibility",
      label: "Eligibility & Age",
      subLabel: "Age & qualifications",
      href: `${basePrefix}/eligibility`,
      icon: GraduationCap,
      badge: "Rule Guide",
      badgeColor: "bg-[#F3E8FF] text-[#6B21A8]",
    },
    {
      id: "admit-card",
      label: "Admit Card",
      href: `${basePrefix}/admit-card`,
      icon: Ticket,
      ...tile("admit_card"),
    },
    {
      id: "answer-key",
      label: "Answer Key",
      href: `${basePrefix}/answer-key`,
      icon: KeyRound,
      ...tile("answer_key"),
    },
    {
      id: "result",
      label: "Result",
      href: `${basePrefix}/result`,
      icon: Award,
      ...tile("result"),
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#D5CAB5] p-2.5 shadow-2xs print:hidden">
      <div className="flex items-center justify-between mb-2 px-2 text-[11px] font-mono uppercase tracking-wider text-[#4F4A43] font-bold">
        <span>This recruitment</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {stages.map((st) => {
          const Icon = st.icon;
          const isActive = activeStage === st.id;

          return (
            <Link
              key={st.id}
              href={st.href}
              className={cn(
                "p-2.5 rounded-lg border transition-all flex flex-col justify-between group min-h-[56px]",
                "[&:nth-child(5)]:col-span-2 sm:[&:nth-child(5)]:col-span-1",
                isActive
                  ? "bg-[#1E3799] border-[#1E3799] text-white shadow-xs ring-2 ring-[#1E3799]/20"
                  : "bg-[#FCFAF4] border-[#D5CAB5] text-[#1A1918] hover:border-[#1E3799] hover:bg-white"
              )}
            >
              <div className="flex items-start justify-between gap-1 mb-1.5">
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 mt-0.5",
                    isActive ? "text-[#B84D0A]" : "text-[#1E3799] group-hover:text-[#B84D0A]"
                  )}
                />
                <span
                  className={cn(
                    "text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded border shrink-0",
                    isActive
                      ? "bg-white/20 text-white border-white/30"
                      : `${st.badgeColor} border-[#D5CAB5]`
                  )}
                >
                  {st.badge}
                </span>
              </div>
              <div>
                <span
                  className={cn(
                    "text-xs font-bold block leading-tight",
                    isActive ? "text-white" : "text-[#1A1918]"
                  )}
                >
                  {st.label}
                </span>
                <span
                  className={cn(
                    "text-[11px] block mt-0.5 truncate",
                    isActive ? "text-white/80" : "text-[#4F4A43]"
                  )}
                >
                  {st.subLabel}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
