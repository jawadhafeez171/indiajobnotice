"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

/**
 * "Check jobs for your age" in the hero: goes to the "Am I eligible?" box. The browser's own smooth
 * scroll to #age-check stops part-way on phones (it ends where the list's tab row pins), so this
 * jumps there itself, moves focus into the box and marks it briefly. The jump is a history step, so
 * Back returns to where the visitor was. Without script it is a plain anchor link.
 */
export function AgeCheckLink({ className }: { className?: string }) {
  const go = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const box = document.getElementById("age-check");
    if (!box) return;
    e.preventDefault();
    // the step first, so the entry Back returns to keeps the hero's scroll position
    window.history.pushState(null, "", "#age-check");
    box.scrollIntoView({ block: "start", behavior: "instant" });
    box.focus({ preventScroll: true });
    box.setAttribute("data-flash", "");
    window.setTimeout(() => box.removeAttribute("data-flash"), 1600);
  };

  return (
    <a href="#age-check" onClick={go} className={className}>
      Check jobs for your age <ArrowRight className="w-3.5 h-3.5" aria-hidden />
    </a>
  );
}
