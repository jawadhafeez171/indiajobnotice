"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

/** The address as a mail link, with a Copy button for phones without an email app (says "Copied" when done). */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* no clipboard access: the address stays visible and selectable */
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
      <span aria-live="polite" className="sr-only">{copied ? "Email address copied" : ""}</span>
    </span>
  );
}
