"use client";

import React from "react";
import { getStateBySlug } from "@/config/states";
import { getStateSubdomainUrl, getCentralPortalUrl } from "@/lib/subdomains";
import { MapPin, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  currentStateSlug?: string;
  onOpenSelector?: () => void;
}

// the states we cover most thoroughly, by name; the rest are one click away in the picker
const POPULAR = ["karnataka", "tn", "kerala", "ap", "telangana", "maharashtra", "bihar", "wb", "up"];

export function StateQuickStrip({ currentStateSlug, onOpenSelector }: Props) {
  const isCentralActive = !currentStateSlug || currentStateSlug === "central";
  const currentState = currentStateSlug && currentStateSlug !== "central"
    ? getStateBySlug(currentStateSlug)
    : null;

  return (
    <nav
      aria-label="36 States and Union Territories Quick Access"
      className="bg-subtle border-b border-line text-xs select-none relative z-30 py-1 px-2 sm:px-3 lg:px-4 overflow-hidden"
    >
      {/* 1. Mobile View: Sleek 1-line bar that triggers the Bottom Sheet */}
      <div className="md:hidden max-w-7xl mx-auto flex items-center justify-between h-8 gap-2">
        <button
          type="button"
          onClick={onOpenSelector}
          className="flex items-center gap-1.5 text-ink text-left flex-1 min-w-0 cursor-pointer py-1"
          title="Tap to select your state portal"
        >
          <MapPin className="w-3.5 h-3.5 text-navy shrink-0" />
          <span className="text-[11px] font-mono uppercase font-bold text-muted shrink-0">
            State:
          </span>
          <span className="font-bold text-xs text-navy truncate">
            {currentState ? `${currentState.name} (${currentState.code})` : "🇮🇳 All-India Central"}
          </span>
        </button>

        <button
          type="button"
          onClick={onOpenSelector}
          className="flex items-center gap-1 px-3 py-1 rounded-full bg-navy-solid hover:bg-navy-strong text-white text-[12px] font-bold shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer min-h-[30px]"
          aria-label="Switch State or Union Territory"
        >
          <span>All 36 states</span>
          <ChevronDown className="w-3 h-3 text-white/80" />
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
            <a href={getCentralPortalUrl()} className="shrink-0 text-ink-2 hover:text-navy whitespace-nowrap">
              All India
            </a>
          )}
          {POPULAR.map((slug, i) => {
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
