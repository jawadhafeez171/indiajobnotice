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
      bg: "bg-[#17803A]",
      text: "text-white",
      border: "border-[#17803A]",
    },
    LAST_DATE_NEAR: {
      label: "Closing Soon",
      bg: "bg-[#C2510A]",
      text: "text-white",
      border: "border-[#C2510A]",
    },
    UPCOMING: {
      label: "Announced",
      bg: "bg-[#EEF2FA]",
      text: "text-[#1E3799]",
      border: "border-[#CCD8F0]",
    },
    ADMIT_CARD_OUT: {
      label: "Admit Card Out",
      bg: "bg-[#1E3799]",
      text: "text-white",
      border: "border-[#1E3799]",
    },
    RESULT_OUT: {
      label: "Result Out",
      bg: "bg-[#6B2FA3]",
      text: "text-white",
      border: "border-[#6B2FA3]",
    },
    APPLICATIONS_CLOSED: {
      label: "Applications Closed",
      bg: "bg-[#E6DFD1]",
      text: "text-[#3F3B35]",
      border: "border-[#CFC4AE]",
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
