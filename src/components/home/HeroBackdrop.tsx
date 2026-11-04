import React from "react";

/*
 * The home hero's decoration, drawn as inline SVG (no image request, nothing to shift the layout):
 * large translucent geometric layers over the navy gradient.
 */

/** Large, faint shapes behind everything: depth without clutter. */
function Geometry() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 360" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <polygon points="-40,360 520,0 820,0 260,360" fill="#2A5BB0" fillOpacity="0.07" />
      <polygon points="380,360 900,0 1060,0 540,360" fill="#3A6CC4" fillOpacity="0.05" />
      <path d="M1440 0 L1440 360 L980 360 C1120 250 1220 120 1290 0 Z" fill="#1D4C9E" fillOpacity="0.12" />
      <circle cx="1180" cy="40" r="260" fill="#4A7AD0" fillOpacity="0.06" />
    </svg>
  );
}

export function HeroBackdrop() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <Geometry />
    </div>
  );
}
