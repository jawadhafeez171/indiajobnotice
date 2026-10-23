"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check initial position on mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top of page"
      title="Scroll to top"
      className={cn(
        "fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40",
        "flex items-center justify-center w-10 h-10 rounded-full",
        "bg-white/90 hover:bg-white text-[#1E3799] hover:text-[#0B153D]",
        "border border-[#D8CFBF] hover:border-[#1E3799]/40",
        "shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        "backdrop-blur-xs transition-all duration-200 ease-out",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3799]/40",
        isVisible
          ? "opacity-100 scale-100 pointer-events-auto"
          : "opacity-0 scale-90 pointer-events-none"
      )}
    >
      <ArrowUp className="w-4 h-4 stroke-[2.25]" />
    </button>
  );
}
