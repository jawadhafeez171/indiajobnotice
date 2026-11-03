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
          badge: "Out", badgeColor: "bg-green-tint text-green" }
      : { subLabel: "Not released yet", badge: "", badgeColor: "" };
  };

  const stages = [
    {
      id: "notice",
      label: "Notification",
      subLabel: "Dates, posts, fee",
      href: basePrefix,
      icon: FileText,
      badge: "",
      badgeColor: "",
    },
    {
      id: "eligibility",
      label: "Eligibility",
      subLabel: "Age and qualifications",
      href: `${basePrefix}#eligibility`,
      icon: GraduationCap,
      badge: "",
      badgeColor: "",
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
    <nav aria-label="Pages of this recruitment" className="bg-surface rounded-xl border border-line p-2.5 shadow-2xs print:hidden">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {stages.map((st) => {
          const Icon = st.icon;
          const isActive = activeStage === st.id;

          return (
            <Link
              key={st.id}
              href={st.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "p-2.5 rounded-lg border transition-all flex flex-col justify-between group min-h-[56px]",
                "[&:nth-child(5)]:col-span-2 sm:[&:nth-child(5)]:col-span-1",
                isActive
                  ? "bg-navy-solid border-navy text-white shadow-xs ring-2 ring-navy/20"
                  : "bg-subtle border-line text-ink hover:border-navy hover:bg-surface"
              )}
            >
              <div className="flex items-start justify-between gap-1 mb-1.5">
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 mt-0.5",
                    isActive ? "text-saffron" : "text-navy group-hover:text-saffron"
                  )}
                />
                {st.badge && (
                  <span
                    className={cn(
                      "text-[12px] font-bold px-1.5 py-0.5 rounded shrink-0 leading-none",
                      isActive ? "bg-white/20 text-white" : st.badgeColor
                    )}
                  >
                    {st.badge}
                  </span>
                )}
              </div>
              <div>
                <span
                  className={cn(
                    "text-xs font-bold block leading-tight",
                    isActive ? "text-white" : "text-ink"
                  )}
                >
                  {st.label}
                </span>
                <span
                  className={cn(
                    "text-[11px] block mt-0.5 truncate",
                    isActive ? "text-white/80" : "text-muted"
                  )}
                >
                  {st.subLabel}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
