"use client";

import React from "react";

/** "Find your state": a native list of every state and union territory; choosing one opens its page. */
export function StateJump({ states }: { states: { name: string; href: string }[] }) {
  return (
    <label className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-on-navy">
      <span className="font-semibold text-white">Find your state</span>
      <select
        defaultValue=""
        onChange={(e) => { if (e.target.value) window.location.href = e.target.value; }}
        className="min-h-[44px] w-full rounded-lg border border-on-navy-2/40 bg-navy-deep px-3 text-[14px] text-white sm:w-72"
      >
        <option value="" disabled>Choose a state or union territory</option>
        {states.map((s) => <option key={s.href} value={s.href}>{s.name}</option>)}
      </select>
    </label>
  );
}
