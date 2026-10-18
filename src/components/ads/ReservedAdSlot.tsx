import React from "react";
import { cn } from "@/lib/utils";

interface ReservedAdSlotProps {
  slotType?: "leaderboard" | "in-feed" | "sidebar";
  slotId?: string;
  className?: string;
}

/**
 * ReservedAdSlot Component (Google Search Central CLS Optimization & AdSense Unit)
 *
 * Pre-allocates dimensional space in the initial server-rendered HTML.
 * Prevents Cumulative Layout Shift (CLS) penalties when Google AdSense or
 * programmatic display ads load asynchronously.
 */
export function ReservedAdSlot({
  slotType = "leaderboard",
  slotId,
  className = "",
}: ReservedAdSlotProps) {
  // Height reservations tailored for standard Google Publisher / IAB ad sizes
  const config = {
    leaderboard: {
      wrapperClass: "min-h-[100px] max-w-5xl mx-auto w-full my-6",
      innerClass: "min-h-[90px] w-full max-w-[728px]",
    },
    "in-feed": {
      wrapperClass: "min-h-[260px] max-w-md mx-auto w-full my-8",
      innerClass: "min-h-[250px] w-full max-w-[336px]",
    },
    sidebar: {
      wrapperClass: "min-h-[260px] w-full my-4",
      innerClass: "min-h-[250px] w-full",
    },
  }[slotType];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center relative overflow-hidden my-4 text-center",
        config.wrapperClass,
        className
      )}
      data-ad-reserved="true"
      data-ad-slot={slotId || slotType}
    >
      {/* Google AdSense Compliant Publisher Label */}
      <span className="text-[10px] font-mono uppercase tracking-widest text-[#A8A196] mb-1 font-medium select-none">
        Advertisement
      </span>

      {/* AdSense Unit Wrapper (Pre-allocated for Zero CLS) */}
      <div
        className={cn(
          "w-full flex items-center justify-center rounded bg-[#FAF7F0]/40 border border-[#EAE2D2]/50 overflow-hidden",
          config.innerClass
        )}
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", height: "100%" }}
          data-ad-client="ca-pub-pending"
          data-ad-slot={slotId || "auto"}
          data-ad-format="auto"
          data-full-width-responsive="true"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
