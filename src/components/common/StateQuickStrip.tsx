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
      className="bg-[#F8F5EE] border-b border-[#EAE2D2] text-xs select-none shadow-2xs relative z-30 py-1 px-2 sm:px-3 lg:px-4 overflow-hidden"
    >
      {/* 1. Mobile View: Sleek 1-line bar that triggers the Bottom Sheet */}
      <div className="md:hidden max-w-7xl mx-auto flex items-center justify-between h-8 gap-2">
        <button
          type="button"
          onClick={onOpenSelector}
          className="flex items-center gap-1.5 text-[#1A1918] text-left flex-1 min-w-0 cursor-pointer py-1"
          title="Tap to select your state portal"
        >
          <MapPin className="w-3.5 h-3.5 text-[#1E3799] shrink-0" />
          <span className="text-[10px] font-mono uppercase font-bold text-[#68635B] shrink-0">
            State:
          </span>
          <span className="font-bold text-xs text-[#1E3799] truncate">
            {currentState ? `${currentState.name} (${currentState.code})` : "🇮🇳 All-India Central"}
          </span>
        </button>

        <button
          type="button"
          onClick={onOpenSelector}
          className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#1E3799] hover:bg-[#152B7A] text-white text-[11px] font-bold shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer min-h-[30px]"
          aria-label="Switch State or Union Territory"
        >
          <span>All 36 States</span>
          <ChevronDown className="w-3 h-3 text-white/80" />
        </button>
      </div>

      {/* 2. Desktop View: All 36 State Buttons in ONE Single Line with ZERO Horizontal/Vertical Scroll */}
      <div className="hidden md:flex max-w-7xl mx-auto flex-nowrap items-center justify-between gap-0.5 xl:gap-1 h-7 overflow-hidden w-full">
        
        {/* Label Badge */}
        <div className="flex items-center gap-1 shrink-0 text-[#1A1918] pr-1.5 border-r border-[#E2D8C3] mr-0.5">
          <MapPin className="w-3 h-3 text-[#1E3799]" />
          <span className="font-bold text-[10px] xl:text-[11px] uppercase tracking-wider font-mono whitespace-nowrap">
            States:
          </span>
        </div>

        {/* Central / All-India Button */}
        <a
          href={getCentralPortalUrl()}
          className={cn(
            "shrink-0 px-1.5 h-6 rounded text-[10px] xl:text-[11px] font-bold border transition-colors whitespace-nowrap flex items-center justify-center gap-0.5",
            isCentralActive
              ? "bg-[#1E3799] text-white border-[#1E3799] shadow-xs"
              : "bg-white text-[#3E3C38] border-[#EAE2D2] hover:border-[#1E3799] hover:text-[#1E3799] hover:bg-[#EEF2FA]"
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
                  "flex-1 min-w-0 max-w-[32px] h-6 text-center rounded text-[10px] xl:text-[11px] font-mono font-bold border transition-all whitespace-nowrap flex items-center justify-center leading-none",
                  isActive
                    ? "bg-[#1E3799] text-white border-[#1E3799] shadow-xs ring-1 ring-[#1E3799]"
                    : "bg-white text-[#3E3C38] border-[#EAE2D2] hover:border-[#1E3799] hover:text-[#1E3799] hover:bg-[#EEF2FA]"
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
            className="shrink-0 ml-1 px-1.5 h-6 rounded bg-[#EEF2FA] hover:bg-[#E0E9F8] border border-[#CCD8F0] text-[#1E3799] text-[10px] font-bold flex items-center gap-0.5 transition-colors whitespace-nowrap cursor-pointer"
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
