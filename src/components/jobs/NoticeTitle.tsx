"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * A notice's own title, in full (official titles run to seven lines): three lines on phones and two on
 * wider screens, with the rest a tap away. The whole title stays in the page for search and print.
 * `prefix` names the page ("Result: …") in the same heading.
 */
export function NoticeTitle({ text, prefix }: { text: string; prefix?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [open, setOpen] = useState(false);
  const [cut, setCut] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setCut(el.scrollHeight > el.clientHeight + 2);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [text, open]);
  return (
    <>
      <h1
        ref={ref}
        className={cn(
          "font-serif text-[21px] leading-snug sm:text-[28px] sm:leading-tight font-bold text-ink text-balance print:line-clamp-none",
          !open && "line-clamp-3 sm:line-clamp-2"
        )}
      >
        {prefix && <span className="text-saffron">{prefix}: </span>}
        {text}
      </h1>
      {(cut || open) && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-1 min-h-[36px] text-sm font-semibold text-navy underline underline-offset-2 hover:text-saffron print:hidden"
        >
          {open ? "Show less" : "Show full title"}
        </button>
      )}
    </>
  );
}
