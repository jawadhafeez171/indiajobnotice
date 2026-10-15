import React from "react";
import { cn } from "@/lib/utils";

interface ReservedAdSlotProps {
  slotType?: "leaderboard" | "in-feed" | "sidebar";
  slotId?: string;
  className?: string;
}

/**
 * ReservedAdSlot Component (Google Search Central CLS Optimization)
 *
 * Pre-allocates fixed dimensional space in the initial server-rendered HTML.
 * Prevents Cumulative Layout Shift (CLS) penalties when programmatic ads,
 * Google AdSense, or sponsor circulars load asynchronously.
 */
export function ReservedAdSlot({
  slotType = "leaderboard",
  slotId,
  className = "",
}: ReservedAdSlotProps) {
  // Height reservations tailored for standard Google Publisher / IAB ad sizes
  const config = {
    leaderboard: {
      // Mobile: 320x50 or 320x100; Desktop: 728x90 or 970x90
      wrapperClass: "min-h-[105px] sm:min-h-[115px] max-w-5xl mx-auto w-full my-6",
      innerClass: "h-[90px] sm:h-[90px] w-full max-w-[728px]",
      label: "Advertisement · Sponsored Gazette Notice",
    },
    "in-feed": {
      // 300x250 or 336x280 Inline Rectangle
      wrapperClass: "min-h-[295px] max-w-md mx-auto w-full my-8",
      innerClass: "h-[250px] sm:h-[280px] w-full max-w-[336px]",
      label: "Sponsored Circular",
    },
    sidebar: {
      // 300x250 or 300x600 Half-page
      wrapperClass: "min-h-[270px] w-full my-4",
      innerClass: "h-[250px] w-full",
      label: "Sponsored Notice",
    },
  }[slotType];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center relative overflow-hidden rounded-md bg-[#FAF7F0]/60 border border-dashed border-[#EAE2D2] p-1.5 transition-colors",
        config.wrapperClass,
        className
      )}
      data-ad-reserved="true"
      data-ad-slot={slotId || slotType}
    >
      {/* Required Publisher Disclosure */}
      <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A847A] mb-1 font-semibold select-none">
        {config.label}
      </span>

      {/* Reserved Canvas Area with Locked Aspect Ratio */}
      <div
        className={cn(
          "flex items-center justify-center text-center rounded bg-white/70 border border-[#F2ECE1]",
          config.innerClass
        )}
      >
        <span className="text-xs font-mono text-[#A8A196]">
          Ad Space Reserved (CLS Protected)
        </span>
      </div>
    </div>
  );
}
