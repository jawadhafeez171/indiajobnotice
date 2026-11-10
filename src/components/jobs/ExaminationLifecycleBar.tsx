import React from "react";
import Link from "next/link";
import { JobNotification, getJobCanonicalPath, getStages } from "@/data/jobs";
import { cn } from "@/lib/utils";

interface Props {
  job: JobNotification;
  activeStage: "notice" | "eligibility" | "admit-card" | "answer-key" | "result";
  stateSlug?: string;
}

/**
 * The pages of one recruitment as a plain row of links: the notification, and each stage whose official
 * document has been found. A stage not released yet has no link (11 Nov: the old five tiles said
 * "Not released yet" twice on most pages).
 */
export function ExaminationLifecycleBar({ job, activeStage }: Props) {
  const base = getJobCanonicalPath(job);
  const links = [
    { id: "notice", label: "Notification", href: base, show: true },
    { id: "admit-card", label: "Admit card", href: `${base}/admit-card`, show: getStages(job, "admit_card").length > 0 },
    { id: "answer-key", label: "Answer key", href: `${base}/answer-key`, show: getStages(job, "answer_key").length > 0 },
    { id: "result", label: "Result", href: `${base}/result`, show: getStages(job, "result").length > 0 },
  ].filter((l) => l.show || l.id === activeStage);

  return (
    <nav aria-label="Pages of this recruitment" className="print:hidden">
      <ul className="flex flex-wrap gap-x-5 gap-y-1 border-b border-line text-sm">
        {links.map((l) => {
          const here = l.id === activeStage;
          return (
            <li key={l.id}>
              <Link
                href={l.href}
                aria-current={here ? "page" : undefined}
                className={cn(
                  "inline-flex items-center min-h-[44px] -mb-px border-b-2 font-semibold transition-colors",
                  here ? "border-saffron text-ink" : "border-transparent text-navy hover:text-saffron"
                )}
              >
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
