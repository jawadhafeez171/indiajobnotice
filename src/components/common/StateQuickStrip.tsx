"use client";

import React from "react";
import { STATES_REGISTRY, StateInfo } from "@/config/states";
import { getStateSubdomainUrl, getCentralPortalUrl } from "@/lib/subdomains";
import { Search, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  currentStateSlug?: string;
  onOpenSelector?: () => void;
}

export function StateQuickStrip({ currentStateSlug, onOpenSelector }: Props) {
  const isCentralActive = !currentStateSlug || currentStateSlug === "central";

  return (
    <nav
      aria-label="36 States and Union Territories Quick Access"
      className="bg-[#F8F5EE] border-b border-[#EAE2D2] text-xs select-none shadow-2xs relative z-30 py-1.5 px-2 sm:px-4"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center sm:justify-start gap-1 sm:gap-1.5">
        
        {/* Label Badge */}
        <div className="flex items-center gap-1 shrink-0 text-[#1A1918] mr-0.5">
          <MapPin className="w-3 h-3 text-[#1E3799]" />
          <span className="font-bold text-[10px] sm:text-[11px] uppercase tracking-wider font-mono">
            States:
          </span>
        </div>

        {/* Central / All-India Option */}
        <a
          href={getCentralPortalUrl()}
          className={cn(
            "px-2 py-0.5 rounded text-[11px] font-bold border transition-colors whitespace-nowrap min-h-[26px] flex items-center gap-1",
            isCentralActive
              ? "bg-[#1E3799] text-white border-[#1E3799] shadow-xs"
              : "bg-white text-[#3E3C38] border-[#EAE2D2] hover:border-[#1E3799] hover:text-[#1E3799] hover:bg-[#EEF2FA]"
          )}
          title="All-India Central Government Notifications (UPSC, SSC, Railways, Banking)"
        >
          <span>🇮🇳</span>
          <span>All</span>
        </a>

        {/* All 36 States & UTs using short forms (Codes) */}
        {STATES_REGISTRY.map((state: StateInfo) => {
          const isActive = currentStateSlug === state.slug;
          return (
            <a
              key={state.slug}
              href={getStateSubdomainUrl(state.slug)}
              className={cn(
                "min-w-[26px] sm:min-w-[28px] text-center px-1.5 py-0.5 rounded text-[11px] font-mono font-bold border transition-all whitespace-nowrap min-h-[26px] flex items-center justify-center",
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

        {/* Directory / Search Modal Button */}
        {onOpenSelector && (
          <button
            onClick={onOpenSelector}
            className="px-2 py-0.5 rounded bg-[#EEF2FA] hover:bg-[#E0E9F8] border border-[#CCD8F0] text-[#1E3799] text-[10px] font-bold flex items-center gap-1 transition-colors whitespace-nowrap min-h-[26px]"
            title="Search or filter states by region and commission"
          >
            <Search className="w-2.5 h-2.5" />
            <span>Search</span>
          </button>
        )}
      </div>
    </nav>
  );
}
