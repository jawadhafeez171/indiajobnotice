"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { STATES_REGISTRY, StateInfo, STATE_ZONES } from "@/config/states";
import { getStateSubdomainUrl, getCentralPortalUrl } from "@/lib/subdomains";
import { cn } from "@/lib/utils";
import { Search, X, Check } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentStateSlug?: string;
}

const TABS = [
  { id: "all", label: "All" },
  ...STATE_ZONES.map((z) => ({ id: z.id, label: z.shortName })),
  { id: "ut", label: "Union territories" },
];

function byZone(id: string): StateInfo[] {
  if (id === "ut") return STATES_REGISTRY.filter((s) => s.isUnionTerritory);
  const zone = STATE_ZONES.find((z) => z.id === id);
  return zone ? STATES_REGISTRY.filter((s) => zone.slugs.includes(s.slug)) : STATES_REGISTRY;
}

function StateLink({ state, current, onClose }: { state: StateInfo; current: boolean; onClose: () => void }) {
  return (
    <a
      href={getStateSubdomainUrl(state.slug)}
      onClick={onClose}
      aria-current={current ? "page" : undefined}
      className={cn(
        "flex items-center justify-between gap-2 px-3 min-h-[44px] rounded-lg border text-sm transition-colors",
        current
          ? "bg-navy-tint border-navy text-navy font-bold"
          : "bg-surface border-line text-ink hover:border-navy hover:text-navy"
      )}
    >
      <span className="truncate">{state.name}</span>
      {current ? (
        <Check className="w-4 h-4 shrink-0 text-navy" />
      ) : (
        <span className="text-[11px] font-mono font-bold text-faint shrink-0">{state.code}</span>
      )}
    </a>
  );
}

/** "All 36 states" picker: a bottom sheet on phones, a dialog on wider screens. */
export function StateSelectorModal({ isOpen, onClose, currentStateSlug }: Props) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const inputRef = useRef<HTMLInputElement>(null);

  // Esc closes; the page behind does not scroll; the search box is focused only where there is a
  // real keyboard (on a phone the on-screen keyboard would cover half the list)
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (window.matchMedia("(pointer: fine)").matches) inputRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [isOpen, onClose]);

  const q = search.trim().toLowerCase();
  const matches = useMemo(
    () =>
      q
        ? STATES_REGISTRY.filter(
            (s) =>
              s.name.toLowerCase().includes(q) ||
              s.code.toLowerCase() === q ||
              s.capital.toLowerCase().includes(q) ||
              s.majorExams.some((c: string) => c.toLowerCase().includes(q))
          )
        : [],
    [q]
  );

  if (!isOpen) return null;

  const isCentral = !currentStateSlug || currentStateSlug === "central";
  // "All" without a search: grouped by region, so a state is easy to find by where it is
  const groups = q
    ? [{ id: "search", title: "", states: matches }]
    : tab === "all"
      ? STATE_ZONES.map((z) => ({ id: z.id, title: z.name, states: byZone(z.id) }))
      : [{ id: tab, title: "", states: byZone(tab) }];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-navy-deep/60 backdrop-blur-xs"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="state-picker-title"
    >
      <div className="w-full sm:max-w-3xl h-[85vh] sm:h-auto sm:max-h-[85vh] bg-surface rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border-t sm:border border-line">
        {/* phone pull handle */}
        <button type="button" onClick={onClose} className="sm:hidden flex justify-center pt-2.5 pb-1" aria-label="Close">
          <span className="w-10 h-1.5 rounded-full bg-line" />
        </button>

        <div className="px-4 sm:px-5 pt-2 sm:pt-5 pb-3 flex items-start justify-between gap-3">
          <div>
            <h2 id="state-picker-title" className="font-serif text-lg sm:text-xl font-bold text-ink">
              Choose your state
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Jobs from the state&apos;s commissions, boards, police and courts.
            </p>
          </div>
          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] -mr-2 -mt-1 flex items-center justify-center rounded-lg text-muted hover:text-ink hover:bg-subtle"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 sm:px-5 pb-3 space-y-3 border-b border-line">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
            <input
              ref={inputRef}
              type="search"
              placeholder="Search a state or its capital"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 min-h-[44px] rounded-lg border border-line bg-subtle text-[15px] sm:text-sm text-ink placeholder:text-faint focus:outline-none focus:border-navy focus:bg-surface"
            />
          </div>
          {!q && (
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "shrink-0 px-3 min-h-[36px] rounded-full text-[13px] font-semibold border whitespace-nowrap transition-colors",
                    tab === t.id
                      ? "bg-navy-solid text-white border-navy"
                      : "bg-surface text-ink-2 border-line hover:border-navy"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-5 py-4 space-y-5">
          {!q && (
            <a
              href={getCentralPortalUrl()}
              onClick={onClose}
              aria-current={isCentral ? "page" : undefined}
              className={cn(
                "flex items-center justify-between gap-2 px-3 min-h-[48px] rounded-lg border text-sm",
                isCentral
                  ? "bg-navy-tint border-navy text-navy font-bold"
                  : "bg-surface border-line text-ink hover:border-navy hover:text-navy"
              )}
            >
              <span>
                <b>All India</b>
                <span className="text-muted font-normal"> · central government, banks, railways, all states</span>
              </span>
              {isCentral && <Check className="w-4 h-4 shrink-0 text-navy" />}
            </a>
          )}

          {groups.map((g) => (
            <section key={g.id} aria-label={g.title || undefined}>
              {g.title && (
                <h3 className="text-[12px] font-bold uppercase tracking-wide text-muted mb-2">{g.title}</h3>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {g.states.map((s) => (
                  <StateLink key={s.slug} state={s} current={currentStateSlug === s.slug} onClose={onClose} />
                ))}
              </div>
            </section>
          ))}

          {q && matches.length === 0 && (
            <p className="py-8 text-center text-sm text-muted">No state or union territory matches “{search}”.</p>
          )}
        </div>
      </div>
    </div>
  );
}
