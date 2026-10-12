import React from "react";
import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  variant?: "default" | "light";
  showDomain?: boolean;
  height?: number;
}

/**
 * Official Brand Logo Component for India Job Notice
 * Seamlessly incorporates the official logo mark with responsive scaling,
 * high-DPI retina sharpness, and dark/light surface variants.
 */
export function BrandLogo({
  className = "",
  variant = "default",
  showDomain = true,
  height = 36,
}: BrandLogoProps) {
  const isLight = variant === "light";
  const logoSrc = isLight ? "/logo-white.png" : "/logo-transparent.png";
  
  // Aspect ratio of the tight transparent logo: 926 / 135 ≈ 6.86
  const width = Math.round(height * 6.86);

  return (
    <div className={`inline-flex items-center gap-1.5 select-none ${className}`}>
      {/* Official Authentic Logo Graphic */}
      <Image
        src={logoSrc}
        alt="India Job Notice"
        width={width}
        height={height}
        priority
        className="h-7 sm:h-9 w-auto object-contain transition-opacity group-hover:opacity-95"
      />

      {/* Domain Suffix Badge */}
      {showDomain && (
        <span
          className={`text-[10px] sm:text-[11px] font-mono font-bold tracking-tight px-1.5 py-0.5 rounded ${
            isLight
              ? "bg-white/10 text-white/90 border border-white/20"
              : "bg-[#EEF2FA] text-[#1E3799] border border-[#CCD8F0]"
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
      <div className="h-full flex-1 bg-[#E96B15]" />
      <div className="h-full flex-1 bg-[#FAF7EE]" />
      <div className="h-full flex-1 bg-[#209948]" />
    </div>
  );
}
