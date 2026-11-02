"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TickerItem {
  id: string;
  href: string;
  code: string;
  title: string;
  posts: number;
}

/**
 * The NEW strip under the hero (tablets and up): newest open notifications moving slowly. Stops on
 * hover, touch, keyboard focus inside it, or the Pause button; still for reduced motion.
 */
export function NewsTicker({ items }: { items: TickerItem[] }) {
  const [paused, setPaused] = useState(false);
  if (!items.length) return null;

  return (
    <div className="hidden sm:block border-b border-line bg-surface">
      <div className="max-w-6xl mx-auto flex items-center">
        <span className="shrink-0 z-10 flex items-center gap-1.5 pl-4 sm:pl-6 pr-3 py-2.5 bg-surface text-[12px] font-bold text-saffron">
          <span className="w-1.5 h-1.5 rounded-full bg-saffron-bright" aria-hidden />
          NEW
        </span>
        <div className="group relative flex-1 overflow-hidden motion-reduce:overflow-x-auto [mask-image:linear-gradient(to_right,black,black_calc(100%-24px),transparent)]">
          <ul
            className={cn(
              "flex w-max motion-safe:animate-marquee group-hover:[animation-play-state:paused] group-active:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]",
              paused && "[animation-play-state:paused]"
            )}
          >
            {[0, 1].map((copy) =>
              items.map((j) => (
                <li key={`${copy}-${j.id}`} aria-hidden={copy === 1 || undefined} className="shrink-0">
                  <Link
                    href={j.href}
                    tabIndex={-1}
                    className="flex items-center gap-2 px-4 py-2.5 text-[13px] text-ink-2 hover:text-navy whitespace-nowrap"
                  >
                    <b className="text-navy">{j.code}</b>
                    <span>{j.title}</span>
                    {j.posts > 0 && <span className="text-muted">· {j.posts.toLocaleString("en-IN")} posts</span>}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
        <button
          type="button"
          onClick={() => setPaused(!paused)}
          aria-pressed={paused}
          aria-label={paused ? "Play the list of new notices" : "Pause the list of new notices"}
          className="shrink-0 w-11 h-11 mr-2 flex items-center justify-center rounded-lg text-muted hover:text-navy motion-reduce:hidden"
        >
          {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
