"use client";

import React from "react";
import { getStateBySlug } from "@/config/states";
import { MapPin, ChevronDown } from "lucide-react";

interface Props {
  currentStateSlug?: string;
  onOpenSelector?: () => void;
}

export function StateQuickStrip({ currentStateSlug, onOpenSelector }: Props) {
  const currentState = currentStateSlug && currentStateSlug !== "central"
    ? getStateBySlug(currentStateSlug)
    : null;

  return (
    <nav
      aria-label="Mobile State Quick Access"
      className="sm:hidden bg-[#F8F5EE] border-b border-[#EAE2D2] text-xs select-none shadow-2xs relative z-30 py-1 px-3"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-8 gap-2">
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
    </nav>
  );
}
