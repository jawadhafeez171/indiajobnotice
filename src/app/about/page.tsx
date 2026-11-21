import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { ArrowRight, Mail } from "lucide-react";
import { SITE_OG_IMAGES } from "@/lib/site-image";

// About (21 Nov): what the site is and how it works, said plainly. No team, desk, audience size or speed claims:
// none can be backed. Who runs it is not described (owner's choice).

export const metadata: Metadata = {
  title: "About",
  description: "India Job Notice lists central and state government job notices taken from the recruiting bodies' own websites, with the facts from each notice and a link to it.",
  alternates: {
    canonical: "https://www.indiajobnotice.com/about",
  },
  openGraph: {
    images: SITE_OG_IMAGES,
    title: "About India Job Notice",
    description: "Government job notices from official websites, with the facts from each notice and a link to it.",
    url: "https://www.indiajobnotice.com/about",
    siteName: "India Job Notice",
    locale: "en_IN",
    type: "website",
  },
};

const h2 = "text-xl font-bold text-ink";
const link = "font-semibold text-navy underline underline-offset-2 hover:text-saffron";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      <section className="border-b border-line bg-subtle py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-3">
          <Breadcrumbs items={[{ label: "About" }]} className="mb-3" />
          <h1 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">About India Job Notice</h1>
          <p className="text-base sm:text-lg text-ink-2 leading-relaxed max-w-prose">
            Government job notices from central and state recruiting bodies, in one place: what the posts are, who can
            apply, the fee and the last date, taken from each official notice, with a link to it.
          </p>
        </div>
      </section>

      <main id="main-content" className="max-w-3xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full space-y-10 text-base text-ink-2 leading-relaxed">
        <section aria-labelledby="where-h" className="space-y-2">
          <h2 id="where-h" className={h2}>Where the notices come from</h2>
          <p className="max-w-prose">
            Only from the recruiting bodies&apos; own websites: public service commissions, staff selection boards, railways,
            banks, police and other recruitment boards, public sector companies, courts and government departments, central
            and state. Several times a day, software checks these websites for new notices. Other job sites are never copied.
          </p>
        </section>

        <section aria-labelledby="page-h" className="space-y-2">
          <h2 id="page-h" className={h2}>What a job page shows</h2>
          <ul className="max-w-prose list-disc space-y-1.5 pl-6 marker:text-faint">
            <li>The facts the notice states: dates, posts, age limits, fee, qualification, how to apply.</li>
            <li>Where a fact came from: the page number in the notice, linked to it.</li>
            <li>&ldquo;See notification&rdquo; when the notice does not state something. Nothing is guessed.</li>
            <li>The official notification and the official website to apply on. Applications are always made there.</li>
          </ul>
          <p className="max-w-prose">
            How notices are read and checked before they appear:{" "}
            <Link href="/editorial-policy" className={link}>how we check notices</Link>.
          </p>
        </section>

        <section aria-labelledby="free-h" className="space-y-2">
          <h2 id="free-h" className={h2}>Free to use</h2>
          <p className="max-w-prose">
            No sign-up and no fees. Jobs you save stay on your own phone or computer. India Job Notice never asks for money
            or bank details.
          </p>
        </section>

        <section aria-labelledby="colleges-h" className="space-y-2">
          <h2 id="colleges-h" className={h2}>For colleges, libraries and coaching centres</h2>
          <p className="max-w-prose">
            Placement cells and libraries are welcome to print our list of open jobs for their notice boards. The{" "}
            <Link href="/vacancies" className={link}>vacancies page</Link> groups them by qualification and prints on one sheet.
          </p>
        </section>

        <section aria-labelledby="gov-h" className="rounded-xl border border-saffron-line bg-saffron-tint p-5 space-y-2">
          <h2 id="gov-h" className="text-lg font-bold text-ink">Not a government website</h2>
          <p className="max-w-prose">
            India Job Notice is not part of, or approved by, any government or recruiting body. Names such as UPSC, SSC or
            RRB are used only to say whose notice it is. Always check the official notification before you apply or pay a fee.
          </p>
        </section>

        <section className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">Found a mistake?</h2>
            <p className="text-sm">Tell us and we will check it against the official notice.</p>
          </div>
          <Link
            href="/contact"
            className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-lg bg-navy-solid px-5 text-sm font-bold text-white hover:bg-navy-strong"
          >
            <Mail className="h-4 w-4" aria-hidden />
            Contact
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
