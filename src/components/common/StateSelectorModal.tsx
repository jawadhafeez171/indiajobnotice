"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { STATES_REGISTRY, StateInfo, POPULAR_STATES, getStateBySlug } from "@/config/states";
import { getStateSubdomainUrl, getCentralPortalUrl } from "@/lib/subdomains";
import { cn } from "@/lib/utils";
import { Search, X, Check, ChevronRight } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentStateSlug?: string;
}

// one A-Z list (no region step: people know their state's name, not which zone it is filed under),
// union territories after the states
const byName = (a: StateInfo, b: StateInfo) => a.name.localeCompare(b.name);
const STATES = STATES_REGISTRY.filter((s) => !s.isUnionTerritory).sort(byName);
const UTS = STATES_REGISTRY.filter((s) => s.isUnionTerritory).sort(byName);
const POPULAR = POPULAR_STATES.map((slug) => getStateBySlug(slug)).filter((s): s is StateInfo => !!s);

/** A state as one plain row: its name (wrapping, never cut off) and a tick when it is the one shown. */
function StateRow({ state, current, onClose }: { state: StateInfo; current: boolean; onClose: () => void }) {
  return (
    <a
      href={getStateSubdomainUrl(state.slug)}
      onClick={onClose}
      aria-current={current ? "page" : undefined}
      className={cn(
        "flex items-center justify-between gap-2 px-2.5 py-2.5 min-h-[44px] rounded-lg text-[15px] sm:text-sm leading-snug transition-colors",
        current ? "bg-navy-tint text-navy font-semibold" : "text-ink hover:bg-subtle active:bg-subtle"
      )}
    >
      <span>{state.name}</span>
      {current && <Check className="w-4 h-4 shrink-0 text-navy" aria-hidden />}
    </a>
  );
}

/** "All 36 states" picker: a bottom sheet on phones, a dialog on wider screens. */
export function StateSelectorModal({ isOpen, onClose, currentStateSlug }: Props) {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Esc closes; the page behind does not scroll; the search box is focused only where there is a
  // real keyboard (on a phone the on-screen keyboard would cover half the list); focus goes back
  // to where it was on close
  useEffect(() => {
    if (!isOpen) return;
    const before = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (window.matchMedia("(pointer: fine)").matches) inputRef.current?.focus();
    else sheetRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      setSearch("");
      before?.focus?.();
    };
  }, [isOpen, onClose]);

  const q = search.trim().toLowerCase();
  const matches = useMemo(
    () =>
      q
        ? STATES_REGISTRY.filter(
            (s) =>
              s.name.toLowerCase().includes(q) ||
              s.nativeName.includes(search.trim()) ||
              s.code.toLowerCase() === q ||
              s.capital.toLowerCase().includes(q) ||
              s.majorExams.some((c: string) => c.toLowerCase().includes(q))
          ).sort(byName)
        : [],
    [q, search]
  );

  if (!isOpen) return null;

  const isCentral = !currentStateSlug || currentStateSlug === "central";
  const current = (s: StateInfo) => currentStateSlug === s.slug;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-navy-deep/60"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="state-picker-title"
    >
      <div
        ref={sheetRef}
        tabIndex={-1}
        className="w-full sm:max-w-2xl h-[88dvh] sm:h-auto sm:max-h-[85vh] bg-surface rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden sm:border border-line focus:outline-none"
      >
        {/* title, close and search stay put while the list scrolls */}
        <div className="shrink-0 px-4 sm:px-5 pt-3 sm:pt-5 pb-3 border-b border-line">
          <div className="sm:hidden flex justify-center pb-2" aria-hidden>
            <span className="w-10 h-1.5 rounded-full bg-line" />
          </div>
          <div className="flex items-center justify-between gap-3">
            <h2 id="state-picker-title" className="text-lg sm:text-xl font-bold text-ink">
              Choose your state
            </h2>
            <button
              onClick={onClose}
              className="w-11 h-11 -mr-2 flex items-center justify-center rounded-lg text-muted hover:text-ink hover:bg-subtle"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="hidden sm:block -mt-1 mb-3 text-[13px] text-muted">
            Jobs from the state&apos;s commissions, boards, police and courts, plus all central jobs.
          </p>
          <form
            className="relative mt-1 sm:mt-0"
            onSubmit={(e) => {
              // Enter opens the first match
              e.preventDefault();
              if (matches[0]) window.location.href = getStateSubdomainUrl(matches[0].slug);
            }}
          >
            <Search className="w-[18px] h-[18px] absolute left-3 top-1/2 -translate-y-1/2 text-faint pointer-events-none" aria-hidden />
            <input
              ref={inputRef}
              type="search"
              enterKeyHint="go"
              placeholder="Type your state, e.g. Kerala"
              aria-label="Search a state"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 h-12 rounded-xl border border-control bg-surface text-[16px] sm:text-[15px] text-ink placeholder:text-faint focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/15"
            />
          </form>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-2.5 sm:px-3.5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {q ? (
            matches.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {matches.map((s) => (
                  <StateRow key={s.slug} state={s} current={current(s)} onClose={onClose} />
                ))}
              </div>
            ) : (
              <p className="px-2 py-10 text-center text-sm text-muted">
                No state or union territory matches &ldquo;{search.trim()}&rdquo;.
              </p>
            )
          ) : (
            <div className="space-y-5">
              {/* all of India: the default, central jobs included */}
              <a
                href={getCentralPortalUrl()}
                onClick={onClose}
                aria-current={isCentral ? "page" : undefined}
                className={cn(
                  "mx-2.5 flex items-center justify-between gap-3 px-3.5 py-3 min-h-[52px] rounded-xl border transition-colors",
                  isCentral ? "bg-navy-tint border-navy-line" : "bg-surface border-line hover:border-navy"
                )}
              >
                <span className="min-w-0">
                  <span className={cn("block text-[15px] font-semibold", isCentral ? "text-navy" : "text-ink")}>All India</span>
                  <span className="block text-[12px] text-muted">Central jobs, banks, railways and every state</span>
                </span>
                {isCentral ? <Check className="w-4 h-4 shrink-0 text-navy" aria-hidden /> : <ChevronRight className="w-4 h-4 shrink-0 text-faint" aria-hidden />}
              </a>

              {/* the states covered most thoroughly, one tap away */}
              <section aria-labelledby="popular-states" className="px-2.5">
                <h3 id="popular-states" className="mb-2 text-[12px] font-semibold text-muted">Popular</h3>
                <div className="flex flex-wrap gap-2">
                  {POPULAR.map((s) => (
                    <a
                      key={s.slug}
                      href={getStateSubdomainUrl(s.slug)}
                      onClick={onClose}
                      aria-current={current(s) ? "page" : undefined}
                      className={cn(
                        "inline-flex items-center px-3.5 min-h-[40px] rounded-full border text-[14px] font-medium transition-colors",
                        current(s) ? "bg-navy-solid border-navy-solid text-white" : "bg-surface border-line text-ink hover:border-navy"
                      )}
                    >
                      {s.name}
                    </a>
                  ))}
                </div>
              </section>

              {[
                { id: "all-states", title: `All states (${STATES.length})`, list: STATES },
                { id: "all-uts", title: `Union territories (${UTS.length})`, list: UTS },
              ].map((g) => (
                <section key={g.id} aria-labelledby={g.id}>
                  <h3 id={g.id} className="px-2.5 mb-1 text-[12px] font-semibold text-muted">{g.title}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-1">
                    {g.list.map((s) => (
                      <StateRow key={s.slug} state={s} current={current(s)} onClose={onClose} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
