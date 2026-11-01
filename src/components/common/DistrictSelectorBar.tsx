"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { DistrictInfo, getDistrictsByState, getMajorDistricts } from "@/config/districts";
import { cn } from "@/lib/utils";
import { MapPin, Search, X, ChevronRight, Building2, ExternalLink } from "lucide-react";

interface DistrictSelectorBarProps {
  stateSlug: string;
  stateName: string;
  currentDistrictSlug?: string;
}

export function DistrictSelectorBar({
  stateSlug,
  stateName,
  currentDistrictSlug,
}: DistrictSelectorBarProps) {
  const allDistricts = useMemo(() => getDistrictsByState(stateSlug), [stateSlug]);
  const majorDistricts = useMemo(() => getMajorDistricts(stateSlug, 8), [stateSlug]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDistricts = useMemo(() => {
    if (!searchQuery.trim()) return allDistricts;
    const q = searchQuery.toLowerCase().trim();
    return allDistricts.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        (d.nativeName && d.nativeName.toLowerCase().includes(q)) ||
        (d.division && d.division.toLowerCase().includes(q)) ||
        d.hq.toLowerCase().includes(q)
    );
  }, [allDistricts, searchQuery]);

  if (allDistricts.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 pt-3.5 border-t border-line/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 text-xs text-muted font-mono">
          <MapPin className="w-3.5 h-3.5 text-saffron" />
          <span className="font-bold text-ink">Jobs by district:</span>
          <span className="text-faint">({allDistricts.length} Districts in {stateName})</span>
        </div>

        {allDistricts.length > 8 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="self-start sm:self-auto text-xs text-navy hover:text-navy hover:underline font-bold flex items-center gap-1"
          >
            <span>Browse All {allDistricts.length} Districts</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Quick District Chips */}
      <div className="flex flex-wrap items-center gap-1.5 mt-2">
        {majorDistricts.map((dist) => {
          const isSelected = currentDistrictSlug === dist.slug;
          return (
            <Link
              key={dist.slug}
              href={`/state/${stateSlug}/district/${dist.slug}`}
              className={cn(
                "px-2.5 py-1 rounded text-xs font-semibold border transition-all flex items-center gap-1 shadow-2xs",
                isSelected
                  ? "bg-navy-solid text-white border-navy font-bold"
                  : "bg-surface text-ink-2 border-line hover:border-navy hover:text-navy hover:bg-navy-tint/50"
              )}
            >
              <span>{dist.name}</span>
              {dist.nativeName && (
                <span className="text-[11px] opacity-70 font-normal">
                  ({dist.nativeName})
                </span>
              )}
            </Link>
          );
        })}

        {allDistricts.length > 8 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-2.5 py-1 rounded text-xs font-bold border border-dashed border-line bg-subtle text-saffron hover:border-saffron-bright hover:bg-saffron-tint transition-all"
          >
            +{allDistricts.length - majorDistricts.length} More Districts...
          </button>
        )}
      </div>

      {/* Searchable All Districts Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-deep/70 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-2xl max-h-[85vh] bg-subtle rounded-xl shadow-2xl flex flex-col overflow-hidden border border-line">
            {/* Modal Header */}
            <div className="p-4 border-b border-line bg-surface flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-saffron-solid" />
                  <h3 className="font-serif text-lg font-bold text-ink">
                    Select District in {stateName}
                  </h3>
                </div>
                <p className="text-xs text-muted mt-0.5">
                  Official NIC Collectorates, District Courts & local health society circulars
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-md text-muted hover:text-ink hover:bg-sunken"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input Bar */}
            <div className="p-3 bg-subtle border-b border-line">
              <div className="relative">
                <Search className="w-4 h-4 text-faint absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`Search ${allDistricts.length} districts in ${stateName}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface border border-line rounded-md focus:outline-hidden focus:ring-1 focus:ring-navy focus:border-navy"
                  autoFocus
                />
              </div>
            </div>

            {/* Districts Grid / List */}
            <div className="p-4 overflow-y-auto max-h-[55vh] divide-y divide-line/50">
              {filteredDistricts.length === 0 ? (
                <div className="py-8 text-center text-xs text-faint">
                  No districts match "{searchQuery}".
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {filteredDistricts.map((dist) => {
                    const isSelected = currentDistrictSlug === dist.slug;
                    return (
                      <Link
                        key={dist.slug}
                        href={`/state/${stateSlug}/district/${dist.slug}`}
                        onClick={() => setIsModalOpen(false)}
                        className={cn(
                          "p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between group",
                          isSelected
                            ? "bg-navy-solid text-white border-navy"
                            : "bg-surface border-line hover:border-navy hover:bg-navy-tint/40"
                        )}
                      >
                        <div>
                          <div className={cn("text-xs font-bold leading-snug", isSelected ? "text-white" : "text-ink group-hover:text-navy")}>
                            {dist.name}
                          </div>
                          {dist.nativeName && (
                            <div className={cn("text-[12px] font-serif", isSelected ? "text-white/80" : "text-muted")}>
                              {dist.nativeName}
                            </div>
                          )}
                        </div>

                        {dist.division && (
                          <div className={cn("text-[11px] font-mono mt-1 pt-1 border-t", isSelected ? "border-white/20 text-white/70" : "border-black/5 text-faint")}>
                            {dist.division}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-line bg-subtle flex items-center justify-between text-xs text-muted">
              <span className="font-mono text-[12px]">
                Showing {filteredDistricts.length} of {allDistricts.length} districts
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 bg-surface border border-line rounded text-xs font-semibold text-ink hover:bg-sunken"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
