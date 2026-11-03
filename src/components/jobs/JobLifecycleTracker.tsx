import React from "react";
import Link from "next/link";
import { CheckCircle2, Circle, CircleDot } from "lucide-react";
import { JobNotification, StageKind, getJobCanonicalPath, todayIST } from "@/data/jobs";
import { formatDate } from "@/lib/utils";

interface Props {
  job: JobNotification;
}

const KIND_LABEL: Record<StageKind, string> = {
  schedule: "Exam schedule",
  admit_card: "Admit card",
  answer_key: "Answer key",
  result: "Result",
  final_result: "Final result",
};

// the page of each released stage (admit card, answer key, result)
const KIND_PAGE: Partial<Record<StageKind, string>> = {
  admit_card: "admit-card",
  answer_key: "answer-key",
  result: "result",
  final_result: "result",
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
  "October", "November", "December"];

interface Step {
  id: string;
  label: string;
  subtext: string;
  state: "done" | "current" | "next";
  href?: string;
}

// The recruitment's real steps: the notification, the application window (or walk-in date), then
// each official document the notice agent found, each linking to its page. Nothing is assumed about
// stages not yet announced.
export function JobLifecycleTracker({ job }: Props) {
  const today = todayIST();
  const end = job.applicationEndDate;
  const open = Boolean(end) && end >= today;
  const base = getJobCanonicalPath(job);
  const steps: Step[] = [
    { id: "notification", label: "Notification", subtext: "Published", state: "done" },
    job.isWalkIn
      ? {
          id: "walk_in",
          label: "Walk-in interview",
          subtext: end ? formatDate(end) : "See notification",
          state: end && end < today ? "done" : "current",
        }
      : {
          id: "application",
          label: open ? "Applications open" : "Applications",
          subtext: end
            ? job.applicationStartDate && job.applicationStartDate < end
              ? `${formatDate(job.applicationStartDate)} to ${formatDate(end)}`
              : `${open ? "Until" : "Closed"} ${formatDate(end)}`
            : "See notification",
          state: open ? "current" : end ? "done" : "current",
        },
    ...(job.stages || []).map((s, i): Step => ({
      id: `stage-${i}`,
      label: s.shortlist ? "Shortlist" : KIND_LABEL[s.kind],
      subtext: s.date ? formatDate(s.date) : "Released",
      state: "done",
      href: KIND_PAGE[s.kind] ? `${base}/${KIND_PAGE[s.kind]}` : undefined,
    })),
  ];
  const finished = (job.stages || []).some((s) => s.kind === "final_result");
  // the exam dates the notice gives, still ahead, as the next steps (papers on one day together)
  const month = today.slice(0, 7);
  const ahead = new Map<string, string[]>();
  for (const e of job.exams || []) {
    const due = e.precision === "day" ? e.date >= today : e.precision === "month" ? e.date >= month : false;
    if (!due) continue;
    ahead.set(e.date, [...(ahead.get(e.date) || []), e.stage || "Exam"]);
  }
  const examSteps = [...ahead.entries()].sort(([a], [b]) => a.localeCompare(b)).slice(0, 3);
  if (!finished && examSteps.length && !(job.stages || []).length) {
    for (const [date, stages] of examSteps) {
      const precise = date.length === 10;
      const tentative = (job.exams || []).some((e) => e.date === date && e.tentative);
      steps.push({
        id: `exam-${date}`,
        label: stages.join(" and "),
        subtext: `${precise ? formatDate(date) : `${MONTHS[Number(date.slice(5, 7)) - 1]} ${date.slice(0, 4)}`}${tentative ? " (tentative)" : ""}`,
        state: "next",
      });
    }
  } else if (!finished) {
    steps.push({
      id: "next",
      label: open ? "Admit card and exam" : "Next stage",
      subtext: open ? "After applications close" : job.currentStage || `To be announced by ${job.orgShortCode}`,
      state: "next",
    });
  }

  return (
    <section aria-labelledby="progress" className="bg-surface rounded-xl border border-line p-5 sm:p-6 shadow-2xs">
      <h2 id="progress" className="font-serif text-lg font-bold text-ink mb-4">Recruitment progress</h2>
      <ol className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-3">
        {steps.map((step) => {
          const Icon = step.state === "done" ? CheckCircle2 : step.state === "current" ? CircleDot : Circle;
          const body = (
            <>
              <Icon
                aria-hidden
                className={`w-5 h-5 shrink-0 mt-0.5 ${
                  step.state === "done" ? "text-green" : step.state === "current" ? "text-navy" : "text-faint"
                }`}
              />
              <span className="min-w-0">
                <span className={`block text-sm font-bold leading-snug ${step.state === "next" ? "text-muted" : "text-ink"}`}>
                  {step.label}
                  <span className="sr-only">
                    {step.state === "done" ? " (done)" : step.state === "current" ? " (now)" : " (to come)"}
                  </span>
                </span>
                <span className="block text-xs text-muted mt-0.5 line-clamp-2">{step.subtext}</span>
                {step.href && <span className="block text-xs font-semibold text-navy underline underline-offset-2 mt-0.5">Open</span>}
              </span>
            </>
          );
          const cls = `flex items-start gap-2.5 rounded-lg px-2.5 py-2 ${step.state === "current" ? "bg-navy-tint" : ""}`;
          return (
            <li key={step.id}>
              {step.href ? (
                <Link href={step.href} className={`${cls} hover:bg-subtle`}>{body}</Link>
              ) : (
                <div className={cls} aria-current={step.state === "current" ? "step" : undefined}>{body}</div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
