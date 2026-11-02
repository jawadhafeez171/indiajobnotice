"use client";

import React from "react";

/** A text button that opens the header's state picker (the Navbar listens for "ijn:open-states"). */
export function OpenStatePicker({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event("ijn:open-states"))}>
      {children}
    </button>
  );
}
