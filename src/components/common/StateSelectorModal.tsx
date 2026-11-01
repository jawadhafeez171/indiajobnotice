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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-navy-deep/70 backdrop-blur-xs transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-4xl max-h-[88vh] sm:max-h-[85vh] bg-subtle rounded-t-2xl sm:rounded-lg shadow-2xl flex flex-col overflow-hidden border-t sm:border border-line animate-in slide-in-from-bottom duration-200"
      >
        {/* Mobile Pull Handle */}
        <div className="sm:hidden flex justify-center pt-2.5 pb-1 bg-surface cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1.5 rounded-full bg-line" />
        </div>

        {/* Header */}
        <div className="px-4 py-3 sm:p-5 border-b border-line flex items-center justify-between bg-surface">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <TricolorCapsule className="w-10 sm:w-12 h-1.5" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-navy font-bold">
                Multi-Tenant Directory
              </span>
            </div>
            <h2 className="font-serif text-base sm:text-lg font-bold text-ink">
              Select State or Union Territory Portal
            </h2>
            <p className="text-[12px] sm:text-xs text-muted hidden sm:block">
              Each state operates on its dedicated directory (/state/[state]) with localized circulars and syllabus
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 sm:p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-muted hover:text-ink hover:bg-navy-tint transition-colors"
            aria-label="Close state selector dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Central Action */}
        <div className="p-3 bg-subtle border-b border-line flex flex-col gap-2.5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search state, code (UP, BR, RJ, MH), capital, or commission..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 sm:py-1.5 rounded-lg border border-line bg-surface text-[15px] sm:text-xs text-ink focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy/30 min-h-[44px] sm:min-h-0"
                autoFocus
              />
            </div>

            <a
              href={getCentralPortalUrl()}
              onClick={onClose}
              className="px-3.5 py-2.5 sm:py-1.5 rounded-lg bg-navy-tint hover:bg-navy-tint-2 text-xs font-bold text-navy border border-navy-line shrink-0 text-center min-h-[44px] sm:min-h-0 flex items-center justify-center gap-1.5"
            >
              <span>🇮🇳</span>
              <span>All-India / Central Hub</span>
            </a>
          </div>

          {/* Regional Zone Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth pb-0.5 text-xs">
            <span className="text-[11px] font-mono uppercase text-muted font-bold shrink-0 mr-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-navy" />
              Zone:
            </span>

            <button
              type="button"
              onClick={() => setSelectedZone("all")}
              className={cn(
                "px-2.5 py-1 rounded-full text-[12px] font-bold border transition-colors shrink-0 whitespace-nowrap min-h-[32px] sm:min-h-0",
                selectedZone === "all"
                  ? "bg-navy-solid text-white border-navy"
                  : "bg-surface text-ink-2 border-line hover:border-navy"
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
                  "px-2.5 py-1 rounded-full text-[12px] font-medium border transition-colors shrink-0 whitespace-nowrap min-h-[32px] sm:min-h-0",
                  selectedZone === zone.id
                    ? "bg-navy-solid text-white border-navy font-bold"
                    : "bg-surface text-ink-2 border-line hover:border-navy"
                )}
              >
                {zone.shortName} ({zone.slugs.length})
              </button>
            ))}

            <button
              type="button"
              onClick={() => setSelectedZone("ut")}
              className={cn(
                "px-2.5 py-1 rounded-full text-[12px] font-medium border transition-colors shrink-0 whitespace-nowrap min-h-[32px] sm:min-h-0",
                selectedZone === "ut"
                  ? "bg-navy-solid text-white border-navy font-bold"
                  : "bg-surface text-ink-2 border-line hover:border-navy"
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
                    ? "bg-navy-tint border-navy text-navy ring-1 ring-navy"
                    : "bg-surface border-line hover:border-navy hover:bg-navy-tint/30 text-ink"
                )}
              >
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-serif font-bold text-xs sm:text-sm text-ink leading-tight line-clamp-1">
                      {state.name}
                    </span>
                    <span className="text-[9px] sm:text-[11px] font-mono font-bold text-navy bg-navy-tint px-1.5 py-0.2 rounded border border-navy-line shrink-0">
                      {state.code}
                    </span>
                  </div>
                  <div className="text-[11px] sm:text-[12px] text-muted mt-0.5 line-clamp-1">
                    {state.capital}
                  </div>
                </div>

                <div className="mt-2 pt-1.5 border-t border-line-soft flex items-center justify-between text-[11px] sm:text-[12px] font-mono font-semibold">
                  <span className="text-navy">/state/{state.slug}</span>
                  {isSelected && (
                    <span className="flex items-center gap-0.5 text-[9px] sm:text-[11px] text-green font-bold">
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
