"use client";

import React from "react";
import { STATES_REGISTRY, StateInfo, getStateBySlug } from "@/config/states";
import { getStateSubdomainUrl, getCentralPortalUrl } from "@/lib/subdomains";
import { MapPin, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  currentStateSlug?: string;
  onOpenSelector?: () => void;
}

export function StateQuickStrip({ currentStateSlug, onOpenSelector }: Props) {
  const isCentralActive = !currentStateSlug || currentStateSlug === "central";
  const currentState = currentStateSlug && currentStateSlug !== "central"
    ? getStateBySlug(currentStateSlug)
    : null;

  return (
    <nav
      aria-label="36 States and Union Territories Quick Access"
      className="bg-subtle border-b border-line text-xs select-none shadow-2xs relative z-30 py-1 px-2 sm:px-3 lg:px-4 overflow-hidden"
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
          <span>All 36 States</span>
          <ChevronDown className="w-3 h-3 text-white/80" />
        </button>
      </div>

      {/* 2. Desktop View: All 36 State Buttons in ONE Single Line with ZERO Horizontal/Vertical Scroll */}
      <div className="hidden md:flex max-w-7xl mx-auto flex-nowrap items-center justify-between gap-0.5 xl:gap-1 h-7 overflow-hidden w-full">
        
        {/* Label Badge */}
        <div className="flex items-center gap-1 shrink-0 text-ink pr-1.5 border-r border-line mr-0.5">
          <MapPin className="w-3 h-3 text-navy" />
          <span className="font-bold text-[11px] xl:text-[12px] uppercase tracking-wider font-mono whitespace-nowrap">
            States:
          </span>
        </div>

        {/* Central / All-India Button */}
        <a
          href={getCentralPortalUrl()}
          className={cn(
            "shrink-0 px-1.5 h-6 rounded text-[11px] xl:text-[12px] font-bold border transition-colors whitespace-nowrap flex items-center justify-center gap-0.5",
            isCentralActive
              ? "bg-navy-solid text-white border-navy shadow-xs"
              : "bg-surface text-ink-2 border-line hover:border-navy hover:text-navy hover:bg-navy-tint"
          )}
          title="All-India Central Government Notifications"
        >
          <span>🇮🇳</span>
          <span>All</span>
        </a>

        {/* All 36 States & UTs in ONE Line: flex-1 ensures responsive auto-fit without any scroll */}
        <div className="flex-1 flex items-center justify-between gap-0.5 xl:gap-1 min-w-0">
          {STATES_REGISTRY.map((state: StateInfo) => {
            const isActive = currentStateSlug === state.slug;
            return (
              <a
                key={state.slug}
                href={getStateSubdomainUrl(state.slug)}
                className={cn(
                  "flex-1 min-w-0 max-w-[32px] h-6 text-center rounded text-[11px] xl:text-[12px] font-mono font-bold border transition-all whitespace-nowrap flex items-center justify-center leading-none",
                  isActive
                    ? "bg-navy-solid text-white border-navy shadow-xs ring-1 ring-navy"
                    : "bg-surface text-ink-2 border-line hover:border-navy hover:text-navy hover:bg-navy-tint"
                )}
                title={`${state.name} (${state.code}) - Click to view ${state.name} ${state.isUnionTerritory ? "UT" : "State"} circulars`}
              >
                {state.code}
              </a>
            );
          })}
        </div>

        {/* Quick Modal Trigger */}
        {onOpenSelector && (
          <button
            type="button"
            onClick={onOpenSelector}
            className="shrink-0 ml-1 px-1.5 h-6 rounded bg-navy-tint hover:bg-navy-tint-2 border border-navy-line text-navy text-[11px] font-bold flex items-center gap-0.5 transition-colors whitespace-nowrap cursor-pointer"
            title="Search or filter states by region and commission"
          >
            <Search className="w-2.5 h-2.5" />
            <span className="hidden xl:inline">Directory</span>
          </button>
        )}
      </div>
    </nav>
  );
}
