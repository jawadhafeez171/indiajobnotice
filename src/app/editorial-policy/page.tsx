import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { SITE_OG_IMAGES } from "@/lib/site-image";

// How notices are found and checked (21 Nov): what the software actually does, in plain words. Replaces a page
// that described a "5-stage pipeline", an "Editorial Standards Board" and editors that do not exist.

export const metadata: Metadata = {
  title: "How we check notices",
  description: "How India Job Notice finds government job notices on official websites, reads them, checks each fact against the notice, and corrects mistakes.",
  alternates: {
    canonical: "https://www.indiajobnotice.com/editorial-policy",
  },
  openGraph: {
    images: SITE_OG_IMAGES,
    title: "How India Job Notice checks notices",
    description: "Official sources only, each fact checked against the notice, and a link to the page it came from.",
    url: "https://www.indiajobnotice.com/editorial-policy",
    siteName: "India Job Notice",
    locale: "en_IN",
    type: "website",
  },
};

const STEPS: { title: string; text: React.ReactNode }[] = [
  {
    title: "Found on the official website",
    text: "Software checks the websites of central and state recruiting bodies several times a day for new notices. Only these official websites are used; other job sites are never copied.",
  },
  {
    title: "Read from the notice itself",
    text: "Each new notification is read for its dates, posts, age limits, fee, qualification and how to apply. Every fact keeps the words it was taken from and the page they are on.",
  },
  {
    title: "Each fact checked against the notice",
    text: "The words behind each fact are looked up in the notice's text. A date or number has to appear in its own words, and post totals have to add up. A notice that fails a check, or a scanned notice that cannot be checked this way, is held back and reviewed before it appears.",
  },
  {
    title: "Shown with its source",
    text: (
      <>
        A job page shows only what the notice states, with the page number of each fact linked to the notice. When the
        notice does not state something, the page says &ldquo;See notification&rdquo; instead of guessing. The official
        notification and the official website to apply on are always linked.
      </>
    ),
  },
  {
    title: "Kept up to date",
    text: "When a recruiting body publishes a corrigendum, such as a new last date, the job page is updated and says what changed. Admit cards, answer keys and results are added to the recruitment's page as they are published. Pages of closed recruitments say so.",
  },
];

export default function EditorialPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      <section className="border-b border-line bg-subtle py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-3">
          <Breadcrumbs items={[{ label: "How we check notices" }]} className="mb-3" />
          <h1 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">How we check notices</h1>
          <p className="text-base sm:text-lg text-ink-2 leading-relaxed max-w-prose">
            A wrong date can cost someone an application. This is how a notice gets from the recruiting body&apos;s
            website to a job page here.
          </p>
          <p className="text-sm text-muted">Updated 21 November 2026</p>
        </div>
      </section>

      <main id="main-content" className="max-w-3xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full space-y-10 text-base text-ink-2 leading-relaxed">
        <ol className="space-y-6">
          {STEPS.map((s, i) => (
            <li key={s.title} className="grid grid-cols-[2rem_1fr] gap-x-3">
              <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-navy-tint text-sm font-bold text-navy" aria-hidden>
                {i + 1}
              </span>
              <div>
                <h2 className="text-lg font-bold text-ink">{s.title}</h2>
                <p className="mt-1 max-w-prose">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <section aria-labelledby="fix-h" className="rounded-xl border border-line bg-surface p-5 space-y-2">
          <h2 id="fix-h" className="text-xl font-bold text-ink">When something is wrong</h2>
          <p className="max-w-prose">
            Checks catch most mistakes, not all. If a job page does not match the official notice,{" "}
            <Link href="/contact" className="font-semibold text-navy underline underline-offset-2 hover:text-saffron">tell us</Link>{" "}
            with the link to the page. We check it against the notice and correct the page.
          </p>
        </section>

        <section aria-labelledby="paid-h" className="space-y-2">
          <h2 id="paid-h" className="text-xl font-bold text-ink">Nothing is paid for</h2>
          <p className="max-w-prose">
            No one can pay to have a job listed, placed higher or described differently. Notices are listed because a
            recruiting body published them.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
