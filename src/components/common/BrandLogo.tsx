import React from "react";
import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  variant?: "default" | "light";
  showDomain?: boolean;
  height?: number;
  /** Height classes for the wordmark image (the header's is smaller than the footer's). */
  sizeClass?: string;
}

/**
 * Official Brand Logo Component for India Job Notice
 * Seamlessly incorporates the official logo mark with responsive scaling,
 * high-DPI retina sharpness, and dark/light surface variants.
 */
export function BrandLogo({
  className = "",
  variant = "default",
  showDomain = false,
  height = 34,
  sizeClass = "h-5 sm:h-[25px]",
}: BrandLogoProps) {
  const isLight = variant === "light";
  const logoSrc = isLight ? "/logo-white.png" : "/logo-transparent.png";
  
  // Aspect ratio of the wordmark (no colour strip above it since 5 Nov): 926 / 95 ≈ 9.75
  const width = Math.round((height * 926) / 95);

  return (
    <div className={`inline-flex items-center gap-1.5 select-none ${className}`}>
      {/* Official Authentic Logo Graphic */}
      <Image
        src={logoSrc}
        alt="India Job Notice"
        width={width}
        height={height}
        priority
        style={{ width: "auto" }}
        className={`${sizeClass} w-auto object-contain transition-opacity group-hover:opacity-95 ${isLight ? "" : "dark:hidden"}`}
      />
      {!isLight && (
        <Image
          src="/logo-white.png"
          alt=""
          aria-hidden
          width={width}
          height={height}
          style={{ width: "auto" }}
          className={`hidden dark:block ${sizeClass} w-auto object-contain`}
        />
      )}

      {/* Domain Suffix Badge */}
      {showDomain && (
        <span
          className={`text-[11px] sm:text-[12px] font-mono font-bold tracking-tight px-1.5 py-0.5 rounded ${
            isLight
              ? "bg-white/10 text-white/90 border border-white/20"
              : "bg-navy-tint text-navy border border-navy-line"
          }`}
        >
          .com
        </span>
      )}
    </div>
  );
}

/**
 * Signature Indian Tricolor Capsule Pill
 * Motif extracted directly from the official logo mark
 */
export function TricolorCapsule({ className = "w-24 h-1.5" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center rounded-full overflow-hidden shadow-2xs ${className}`}>
      <div className="h-full flex-1 bg-saffron-solid" />
      <div className="h-full flex-1 bg-white shadow-[inset_0_0_0_1px_rgb(var(--c-line))]" />
      <div className="h-full flex-1 bg-green-solid" />
    </div>
  );
}
