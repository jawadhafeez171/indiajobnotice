"use client";

import React from "react";
import { getStateBySlug, POPULAR_STATES } from "@/config/states";
import { getStateSubdomainUrl, getCentralPortalUrl } from "@/lib/subdomains";
import { MapPin, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  currentStateSlug?: string;
  onOpenSelector?: () => void;
}

// the states we cover most thoroughly, by name; the rest are one click away in the picker

export function StateQuickStrip({ currentStateSlug, onOpenSelector }: Props) {
  const isCentralActive = !currentStateSlug || currentStateSlug === "central";
  const currentState = currentStateSlug && currentStateSlug !== "central"
    ? getStateBySlug(currentStateSlug)
    : null;

  return (
    <nav
      aria-label="States"
      className="bg-subtle md:bg-surface border-b border-line text-xs select-none relative z-30 px-4 md:py-1 md:px-3 lg:px-4 overflow-hidden"
    >
      {/* 1. Phones: one row, one target: the state you are on, and Change */}
      <div className="md:hidden max-w-7xl mx-auto">
        <button
          type="button"
          onClick={onOpenSelector}
          className="w-full flex items-center gap-1.5 min-h-[44px] text-left cursor-pointer"
          aria-label={`Your state: ${currentState ? currentState.name : "All India"}. Change state`}
        >
          <MapPin className="w-4 h-4 text-navy shrink-0" aria-hidden />
          <span className="font-bold text-sm text-navy truncate">
            {currentState ? currentState.name : "All India"}
          </span>
          <span className="ml-auto inline-flex items-center gap-0.5 text-sm font-semibold text-navy shrink-0">
            Change
            <ChevronDown className="w-4 h-4" aria-hidden />
          </span>
        </button>
      </div>

      {/* 2. Desktop: the state you are on, the states we cover most, and the full picker */}
      <div className="hidden md:flex max-w-6xl mx-auto items-center gap-5 h-8 px-2 sm:px-3">
        <span className="flex items-center gap-1.5 shrink-0 text-muted">
          <MapPin className="w-3.5 h-3.5 text-navy" />
          <span className="font-bold text-navy text-[13px]">
            {currentState ? currentState.name : "All India"}
          </span>
        </span>
        <span className="h-4 w-px bg-line shrink-0" aria-hidden />
        <div className="flex-1 min-w-0 flex items-center gap-4 overflow-hidden text-[13px]">
          {!isCentralActive && (
            <a href={getCentralPortalUrl()} className="shrink-0 py-1.5 text-ink-2 hover:text-navy whitespace-nowrap">
              All India
            </a>
          )}
          {POPULAR_STATES.map((slug, i) => {
            const st = getStateBySlug(slug);
            if (!st || slug === currentStateSlug) return null;
            return (
              <a
                key={slug}
                href={getStateSubdomainUrl(slug)}
                className={cn(
                  "shrink-0 text-ink-2 hover:text-navy whitespace-nowrap",
                  i >= 6 && "hidden xl:inline"
                )}
              >
                {st.name}
              </a>
            );
          })}
        </div>
        {onOpenSelector && (
          <button
            type="button"
            onClick={onOpenSelector}
            className="shrink-0 flex items-center gap-1 px-3 py-1 rounded-full bg-navy-solid hover:bg-navy-strong text-white text-[12px] font-bold transition-colors cursor-pointer"
            title="Choose any state or union territory"
          >
            <span>All 36 states</span>
            <ChevronDown className="w-3 h-3 text-white/80" />
          </button>
        )}
      </div>
    </nav>
  );
}
