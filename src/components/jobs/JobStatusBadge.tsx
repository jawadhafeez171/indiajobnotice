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
      bg: "bg-[#EDF7F0]",
      text: "text-[#209948]",
      border: "border-[#C9E7D2]",
    },
    LAST_DATE_NEAR: {
      label: "Closing Soon",
      bg: "bg-[#FDF3EB]",
      text: "text-[#E96B15]",
      border: "border-[#F9D7C0]",
    },
    UPCOMING: {
      label: "Announced",
      bg: "bg-[#EEF2FA]",
      text: "text-[#1E3799]",
      border: "border-[#CCD8F0]",
    },
    ADMIT_CARD_OUT: {
      label: "Admit Card Out",
      bg: "bg-[#EEF2FA]",
      text: "text-[#1E3799]",
      border: "border-[#CCD8F0]",
    },
    RESULT_OUT: {
      label: "Result Out",
      bg: "bg-[#EDF7F0]",
      text: "text-[#209948]",
      border: "border-[#C6E7D0]",
    },
    APPLICATIONS_CLOSED: {
      label: "Applications Closed",
      bg: "bg-[#F4F1EA]",
      text: "text-[#68635B]",
      border: "border-[#DDD5C7]",
    },
  };

  const current = configs[status] || configs.UPCOMING;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border",
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
