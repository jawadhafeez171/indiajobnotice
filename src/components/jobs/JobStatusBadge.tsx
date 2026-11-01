import React from "react";
import { JobStatus } from "@/data/jobs";
import { cn } from "@/lib/utils";

interface Props {
  status: JobStatus;
  className?: string;
}

export function JobStatusBadge({ status, className }: Props) {
  const configs: Record<
    JobStatus,
    { label: string; bg: string; text: string; border: string }
  > = {
    APPLY_OPEN: {
      label: "Applications Open",
      bg: "bg-green-solid",
      text: "text-white",
      border: "border-green",
    },
    LAST_DATE_NEAR: {
      label: "Closing Soon",
      bg: "bg-saffron-solid",
      text: "text-white",
      border: "border-saffron",
    },
    UPCOMING: {
      label: "Announced",
      bg: "bg-navy-tint",
      text: "text-navy",
      border: "border-navy-line",
    },
    ADMIT_CARD_OUT: {
      label: "Admit Card Out",
      bg: "bg-navy-solid",
      text: "text-white",
      border: "border-navy",
    },
    RESULT_OUT: {
      label: "Result Out",
      bg: "bg-purple-solid",
      text: "text-white",
      border: "border-purple",
    },
    APPLICATIONS_CLOSED: {
      label: "Applications Closed",
      bg: "bg-sunken",
      text: "text-ink-2",
      border: "border-line",
    },
  };

  const current = configs[status] || configs.UPCOMING;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[12px] font-bold border",
        current.bg,
        current.text,
        current.border,
        className
      )}
    >
      {current.label}
    </span>
  );
}
