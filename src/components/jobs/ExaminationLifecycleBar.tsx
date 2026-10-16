import React from "react";
import Link from "next/link";
import { JobNotification } from "@/data/jobs";
import { FileText, Ticket, KeyRound, Award, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  job: JobNotification;
  activeStage: "notice" | "eligibility" | "admit-card" | "answer-key" | "result";
  stateSlug?: string;
}

export function ExaminationLifecycleBar({ job, activeStage, stateSlug }: Props) {
  const basePrefix = job.isCentral || !stateSlug || stateSlug === "central"
    ? `/jobs/${job.slug}`
    : `/state/${stateSlug}/jobs/${job.slug}`;

  const stages = [
    {
      id: "notice",
      label: "Official Notice",
      subLabel: "Vacancies & PDF",
      href: basePrefix,
      icon: FileText,
      badge: "Master Circular",
      badgeColor: "bg-[#EEF2FA] text-[#1E3799]",
    },
    {
      id: "eligibility",
      label: "Eligibility & Age",
      subLabel: "Cut-off & Relaxations",
      href: `${basePrefix}/eligibility`,
      icon: GraduationCap,
      badge: "Rule Guide",
      badgeColor: "bg-[#F3E8FF] text-[#6B21A8]",
    },
    {
      id: "admit-card",
      label: "Admit Card",
      subLabel: job.admitCardDate || "Hall Ticket & City",
      href: `${basePrefix}/admit-card`,
      icon: Ticket,
      badge: job.status === "ADMIT_CARD_OUT" ? "Out Now" : "Portal Link",
      badgeColor: job.status === "ADMIT_CARD_OUT" ? "bg-[#EDF7F0] text-[#209948]" : "bg-[#FAF7EF] text-[#68635B]",
    },
    {
      id: "answer-key",
      label: "Answer Key",
      subLabel: "Response & Keys",
      href: `${basePrefix}/answer-key`,
      icon: KeyRound,
      badge: "Objections",
      badgeColor: "bg-[#FAF7EF] text-[#68635B]",
    },
    {
      id: "result",
      label: "Result & Cut-Off",
      subLabel: job.resultDate || "Merit List PDF",
      href: `${basePrefix}/result`,
      icon: Award,
      badge: job.status === "RESULT_OUT" ? "Declared" : "Post-Exam",
      badgeColor: job.status === "RESULT_OUT" ? "bg-[#EDF7F0] text-[#209948]" : "bg-[#FAF7EF] text-[#68635B]",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#EAE2D2] p-2.5 shadow-2xs print:hidden">
      <div className="flex items-center justify-between mb-2 px-2 text-[10px] font-mono uppercase tracking-wider text-[#68635B] font-bold">
        <span>Recruitment Cycle Lifecycle Navigation</span>
        <span className="hidden sm:inline">Direct Intent Hubs</span>
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
                "p-2.5 rounded-lg border transition-all flex flex-col justify-between group",
                isActive
                  ? "bg-[#1E3799] border-[#1E3799] text-white shadow-xs ring-2 ring-[#1E3799]/20"
                  : "bg-[#FCFAF4] border-[#EAE2D2] text-[#1A1918] hover:border-[#1E3799] hover:bg-white"
              )}
            >
              <div className="flex items-start justify-between gap-1 mb-1.5">
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 mt-0.5",
                    isActive ? "text-[#E96B15]" : "text-[#1E3799] group-hover:text-[#E96B15]"
                  )}
                />
                <span
                  className={cn(
                    "text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded border shrink-0",
                    isActive
                      ? "bg-white/20 text-white border-white/30"
                      : `${st.badgeColor} border-[#EAE2D2]`
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
                    "text-[10px] block mt-0.5 truncate",
                    isActive ? "text-white/80" : "text-[#68635B]"
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
