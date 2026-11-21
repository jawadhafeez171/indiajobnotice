import React from "react";
import { ExternalLink } from "lucide-react";
import { STATE_BOARDS, StateBoard } from "@/data/state-boards";

/** Whether the agent watches any official body in this state (src/data/state-boards.ts). */
/** How many official sites the agent checks for a state. */
export function stateBoardCount(stateSlug: string): number {
  return (STATE_BOARDS[stateSlug] || []).reduce((n, g) => n + g.bodies.length, 0);
}

export function hasStateBoards(stateSlug: string): boolean {
  return (STATE_BOARDS[stateSlug] || []).length > 0;
}

const DISTRICT = /district court|district recruitment bureau/i;

function BoardLink({ b }: { b: StateBoard }) {
  return (
    <li className="border-b border-line-soft">
      <a href={b.url} target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-between gap-3 min-h-[44px] py-2 text-sm font-semibold text-ink hover:text-navy group">
        <span>{b.name}</span>
        <ExternalLink className="w-3.5 h-3.5 shrink-0 text-muted group-hover:text-navy" aria-hidden />
      </a>
    </li>
  );
}

/**
 * Every official recruiting body of the state the agent watches, grouped by kind, each linked to its own
 * recruitment page (20 Nov, owner's choice). District courts are many (28 in Karnataka) and fold away.
 */
export function StateBoardsSection({ stateSlug, stateName, compact = false }: { stateSlug: string; stateName: string; compact?: boolean }) {
  const groups = STATE_BOARDS[stateSlug] || [];
  const total = groups.reduce((n, g) => n + g.bodies.length, 0);
  if (!total) return null;
  return (
    <section aria-labelledby="boards-h" id="official-sites" className="scroll-mt-28 border-t border-line pt-6">
      <h2 id="boards-h" className="font-serif text-xl font-bold text-ink">
        Official recruitment sites we check for {stateName}{" "}
        <span className="ml-2 font-sans text-base font-semibold text-muted tabular-nums">{total}</span>
      </h2>
      <p className="mt-1 text-sm text-ink-2 max-w-prose">
        We check these sites for new notices; the recruitments we find are listed on this page with their official
        link. Applications are made on the official site. Each link opens the official site in a new tab.
      </p>
      {(() => {
        const block = (list: typeof groups) => (
      <div className="mt-4 sm:columns-2 gap-x-8">
        {list.map((g) => {
          // many alike bodies fold into one line: district courts, district recruitment bureaus (28 in Tamil Nadu)
          const district = g.bodies.filter((b) => DISTRICT.test(b.name));
          const main = g.bodies.filter((b) => !DISTRICT.test(b.name));
          const foldLabel = /recruitment bureau/i.test(district[0]?.name || "") ? "District recruitment bureaus" : "District courts";
          return (
            <div key={g.label} className="break-inside-avoid mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted">{g.label}</h3>
              <ul className="mt-1">
                {main.map((b) => <BoardLink key={b.url} b={b} />)}
              </ul>
              {district.length > 0 && (
                <details className="group/d">
                  <summary className="flex items-center min-h-[44px] cursor-pointer text-sm font-semibold text-navy hover:text-saffron">
                    {foldLabel} ({district.length})
                  </summary>
                  <ul>{district.map((b) => <BoardLink key={b.url} b={b} />)}</ul>
                </details>
              )}
            </div>
          );
        })}
      </div>
        );
        if (!compact || groups.length < 2) return block(groups);
        const rest = groups.slice(1).reduce((n, g) => n + g.bodies.length, 0);
        return (
          <>
            {block(groups.slice(0, 1))}
            <details className="group -mt-2">
              <summary className="inline-flex min-h-[44px] cursor-pointer list-none items-center gap-1.5 text-sm font-bold text-navy hover:text-saffron [&::-webkit-details-marker]:hidden">
                Show the other {rest} site{rest === 1 ? "" : "s"}
              </summary>
              {block(groups.slice(1))}
            </details>
          </>
        );
      })()}
    </section>
  );
}
