"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

/** The address as a mail link, with a Copy button for phones without an email app (says "Copied" when done). */
export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<"" | "copied" | "failed">("");
  const copied = state === "copied";
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
      setTimeout(() => setState(""), 2500);
    } catch {
      // in-app browsers (Telegram, WhatsApp) often refuse the clipboard: say how to copy by hand
      setState("failed");
    }
  };
  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <a href={`mailto:${email}`} className="inline-flex min-h-[44px] items-center select-all font-semibold text-navy underline underline-offset-2 hover:text-saffron">
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-line bg-surface px-3 text-sm font-semibold text-ink hover:border-navy"
      >
        {copied ? <Check className="h-4 w-4 text-green" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
        {copied ? "Copied" : "Copy"}
        <span className="sr-only"> the email address</span>
      </button>
      <span aria-live="polite" className={state === "failed" ? "basis-full text-sm text-ink-2" : "sr-only"}>
        {copied ? "Email address copied" : state === "failed" ? "Couldn't copy here. Press and hold the address to copy it." : ""}
      </span>
    </span>
  );
}
