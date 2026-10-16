"use client";

import React, { useState, useMemo } from "react";
import { STATES_REGISTRY, StateInfo, STATE_ZONES } from "@/config/states";
import { getStateSubdomainUrl, getCentralPortalUrl } from "@/lib/subdomains";
import { cn } from "@/lib/utils";
import { Search, X, Check, MapPin } from "lucide-react";
import { TricolorCapsule } from "./BrandLogo";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentStateSlug?: string;
}

export function StateSelectorModal({ isOpen, onClose, currentStateSlug }: Props) {
  const [search, setSearch] = useState("");
  const [selectedZone, setSelectedZone] = useState<string>("all");

  const filteredStates = useMemo(() => {
    let list = STATES_REGISTRY;

    if (selectedZone === "ut") {
      list = list.filter((s) => s.isUnionTerritory);
    } else if (selectedZone !== "all") {
      const zone = STATE_ZONES.find((z) => z.id === selectedZone);
      if (zone) {
        list = list.filter((s) => zone.slugs.includes(s.slug));
      }
    }

    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q) ||
        s.capital.toLowerCase().includes(q) ||
        s.majorExams.some((c: string) => c.toLowerCase().includes(q))
    );
  }, [search, selectedZone]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0B153D]/70 backdrop-blur-xs transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-4xl max-h-[88vh] sm:max-h-[85vh] bg-[#FCFAF4] rounded-t-2xl sm:rounded-lg shadow-2xl flex flex-col overflow-hidden border-t sm:border border-[#EAE2D2] animate-in slide-in-from-bottom duration-200"
      >
        {/* Mobile Pull Handle */}
        <div className="sm:hidden flex justify-center pt-2.5 pb-1 bg-white cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1.5 rounded-full bg-[#D4C8B5]" />
        </div>

        {/* Header */}
        <div className="px-4 py-3 sm:p-5 border-b border-[#EAE2D2] flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <TricolorCapsule className="w-10 sm:w-12 h-1.5" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1E3799] font-bold">
                Multi-Tenant Directory
              </span>
            </div>
            <h2 className="font-serif text-base sm:text-lg font-bold text-[#1A1918]">
              Select State or Union Territory Portal
            </h2>
            <p className="text-[11px] sm:text-xs text-[#68635B] hidden sm:block">
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
        <div className="p-3 bg-[#FCFAF4] border-b border-[#EAE2D2] flex flex-col gap-2.5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#68635B]" />
              <input
                type="text"
                placeholder="Search state, code (UP, BR, RJ, MH), capital, or commission..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 sm:py-1.5 rounded-lg border border-[#EAE2D2] bg-white text-[15px] sm:text-xs text-[#1A1918] focus:outline-none focus:border-[#1E3799] focus:ring-1 focus:ring-[#1E3799]/30 min-h-[44px] sm:min-h-0"
                autoFocus
              />
            </div>

            <a
              href={getCentralPortalUrl()}
              onClick={onClose}
              className="px-3.5 py-2.5 sm:py-1.5 rounded-lg bg-[#EEF2FA] hover:bg-[#E0E9F8] text-xs font-bold text-[#1E3799] border border-[#CCD8F0] shrink-0 text-center min-h-[44px] sm:min-h-0 flex items-center justify-center gap-1.5"
            >
              <span>🇮🇳</span>
              <span>All-India / Central Hub</span>
            </a>
          </div>

          {/* Regional Zone Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth pb-0.5 text-xs">
            <span className="text-[10px] font-mono uppercase text-[#68635B] font-bold shrink-0 mr-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#1E3799]" />
              Zone:
            </span>

            <button
              type="button"
              onClick={() => setSelectedZone("all")}
              className={cn(
                "px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors shrink-0 whitespace-nowrap min-h-[32px] sm:min-h-0",
                selectedZone === "all"
                  ? "bg-[#1E3799] text-white border-[#1E3799]"
                  : "bg-white text-[#3E3C38] border-[#EAE2D2] hover:border-[#1E3799]"
              )}
            >
              All (36)
            </button>

            {STATE_ZONES.map((zone) => (
              <button
                key={zone.id}
                type="button"
                onClick={() => setSelectedZone(zone.id)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors shrink-0 whitespace-nowrap min-h-[32px] sm:min-h-0",
                  selectedZone === zone.id
                    ? "bg-[#1E3799] text-white border-[#1E3799] font-bold"
                    : "bg-white text-[#3E3C38] border-[#EAE2D2] hover:border-[#1E3799]"
                )}
              >
                {zone.shortName} ({zone.slugs.length})
              </button>
            ))}

            <button
              type="button"
              onClick={() => setSelectedZone("ut")}
              className={cn(
                "px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors shrink-0 whitespace-nowrap min-h-[32px] sm:min-h-0",
                selectedZone === "ut"
                  ? "bg-[#1E3799] text-white border-[#1E3799] font-bold"
                  : "bg-white text-[#3E3C38] border-[#EAE2D2] hover:border-[#1E3799]"
              )}
            >
              UTs (8)
            </button>
          </div>
        </div>

        {/* List of States */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-2.5 text-xs overscroll-contain">
          {filteredStates.map((state: StateInfo) => {
            const isSelected = currentStateSlug === state.slug;
            const targetUrl = getStateSubdomainUrl(state.slug);

            return (
              <a
                key={state.slug}
                href={targetUrl}
                onClick={onClose}
                className={cn(
                  "p-2.5 sm:p-3 rounded-lg border transition-all flex flex-col justify-between shadow-2xs hover:shadow-xs min-h-[64px]",
                  isSelected
                    ? "bg-[#EEF2FA] border-[#1E3799] text-[#1E3799] ring-1 ring-[#1E3799]"
                    : "bg-white border-[#EAE2D2] hover:border-[#1E3799] hover:bg-[#EEF2FA]/30 text-[#1A1918]"
                )}
              >
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-serif font-bold text-xs sm:text-sm text-[#1A1918] leading-tight line-clamp-1">
                      {state.name}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#1E3799] bg-[#EEF2FA] px-1.5 py-0.2 rounded border border-[#CCD8F0] shrink-0">
                      {state.code}
                    </span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-[#68635B] mt-0.5 line-clamp-1">
                    {state.capital}
                  </div>
                </div>

                <div className="mt-2 pt-1.5 border-t border-[#F2ECE1] flex items-center justify-between text-[10px] sm:text-[11px] font-mono font-semibold">
                  <span className="text-[#1E3799]">/state/{state.slug}</span>
                  {isSelected && (
                    <span className="flex items-center gap-0.5 text-[9px] sm:text-[10px] text-[#209948] font-bold">
                      <Check className="w-3 h-3" />
                      Active
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
