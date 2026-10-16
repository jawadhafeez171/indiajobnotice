"use client";

import React, { useState, useMemo } from "react";
import { STATES_REGISTRY, StateInfo } from "@/config/states";
import { getStateSubdomainUrl, getCentralPortalUrl } from "@/lib/subdomains";
import { cn } from "@/lib/utils";
import { Search, X, Check } from "lucide-react";
import { TricolorCapsule } from "./BrandLogo";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentStateSlug?: string;
}

export function StateSelectorModal({ isOpen, onClose, currentStateSlug }: Props) {
  const [search, setSearch] = useState("");

  const filteredStates = useMemo(() => {
    if (!search.trim()) return STATES_REGISTRY;
    const q = search.toLowerCase();
    return STATES_REGISTRY.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q) ||
        s.majorExams.some((c: string) => c.toLowerCase().includes(q))
    );
  }, [search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B153D]/60 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#FCFAF4] rounded-lg shadow-2xl flex flex-col overflow-hidden border border-[#EAE2D2]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE2D2] flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TricolorCapsule className="w-12 h-1.5" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1E3799] font-bold">
                Multi-Tenant Directory
              </span>
            </div>
            <h2 className="font-serif text-lg font-bold text-[#1A1918]">
              Select State or Union Territory Portal
            </h2>
            <p className="text-xs text-[#68635B]">
              Each state operates on its dedicated directory (/state/[state]) with localized circulars and syllabus
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 sm:p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-[#68635B] hover:text-[#1A1918] hover:bg-[#EEF2FA] transition-colors"
            aria-label="Close state selector dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Central Action */}
        <div className="p-3 bg-[#FCFAF4] border-b border-[#EAE2D2] flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#68635B]" />
            <input
              type="text"
              placeholder="Search state, code (UP, BR, RJ, MH), or commission..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 sm:py-1.5 rounded-lg border border-[#EAE2D2] bg-white text-[15px] sm:text-xs text-[#1A1918] focus:outline-none focus:border-[#1E3799] focus:ring-1 focus:ring-[#1E3799]/30 min-h-[44px] sm:min-h-0"
              autoFocus
            />
          </div>

          <a
            href={getCentralPortalUrl()}
            onClick={onClose}
            className="px-3.5 py-2.5 sm:py-1.5 rounded-lg bg-[#EEF2FA] hover:bg-[#E0E9F8] text-xs font-bold text-[#1E3799] border border-[#CCD8F0] shrink-0 text-center min-h-[44px] sm:min-h-0 flex items-center justify-center"
          >
            All-India / Central Hub
          </a>
        </div>

        {/* List of States */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
          {filteredStates.map((state: StateInfo) => {
            const isSelected = currentStateSlug === state.slug;
            const targetUrl = getStateSubdomainUrl(state.slug);

            return (
              <a
                key={state.slug}
                href={targetUrl}
                onClick={onClose}
                className={cn(
                  "p-3 rounded border transition-all flex flex-col justify-between shadow-2xs hover:shadow-xs",
                  isSelected
                    ? "bg-[#EEF2FA] border-[#1E3799] text-[#1E3799] ring-1 ring-[#1E3799]"
                    : "bg-white border-[#EAE2D2] hover:border-[#1E3799] hover:bg-[#EEF2FA]/30 text-[#1A1918]"
                )}
              >
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-serif font-bold text-sm text-[#1A1918]">
                      {state.name}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#1E3799] bg-[#EEF2FA] px-1.5 py-0.2 rounded border border-[#CCD8F0]">
                      {state.code}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#68635B] mt-0.5">
                    {state.nativeName} · Capital: {state.capital}
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-[#F2ECE1] flex items-center justify-between text-[11px] font-mono font-semibold">
                  <span className="text-[#1E3799]">/state/{state.slug}</span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[10px] text-[#209948] font-bold">
                      <Check className="w-3 h-3" />
                      Current
                    </span>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
