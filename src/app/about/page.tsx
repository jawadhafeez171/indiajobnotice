import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { SITE_OG_IMAGES } from "@/lib/site-image";

// About (21 Nov, critique round 1): what the site is and how it works, said plainly and shown once. No team, desk,
// audience size or speed claims: none can be backed. Who runs it is not described (owner's choice).

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
const BODIES = ["Staff Selection Commission (SSC)", "Railway Recruitment Boards", "IBPS and the banks", "State public service commissions",
  "KEA (Karnataka) and other exam authorities", "Police recruitment boards", "Public sector companies", "High courts and district courts"];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      <main id="main-content" className="flex-1 w-full">
        <section className="border-b border-line bg-subtle">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-3">
            <Breadcrumbs items={[{ label: "About" }]} className="mb-3" />
            <h1 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">About India Job Notice</h1>
            <p className="text-base sm:text-lg text-ink-2 leading-relaxed max-w-prose">
              Government job notices in one place. Each job page gives the facts from the official notice and a link to it.
            </p>
            {/* the first thing a careful reader asks: is this the government, and will it ask for money */}
            <p className="flex max-w-prose items-start gap-2 rounded-lg border border-saffron-line bg-saffron-tint px-3 py-2.5 text-sm text-ink">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-saffron" aria-hidden />
              <span><b>Not a government website.</b> Free to use, no sign-up; jobs you save stay on your own phone. We never ask for money or bank details.</span>
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full space-y-10 text-base text-ink-2 leading-relaxed [&_p]:max-w-[64ch]">
          <section aria-labelledby="where-h" className="space-y-3">
            <h2 id="where-h" className={h2}>Where the notices come from</h2>
            <p className="max-w-prose">
              Only from official websites. Three times a day, software checks more than 1,000 of them for new notices.
              Other job sites are never copied.
            </p>
            <ul className="flex flex-wrap gap-2" aria-label="Kinds of recruiting bodies">
              {BODIES.map((b) => (
                <li key={b} className="rounded-full border border-line bg-surface px-2.5 py-0.5 text-[13px] text-ink">{b}</li>
              ))}
            </ul>
            <p className="text-sm">
              Choose your state from the menu at the top: its page lists the official bodies watched there. The{" "}
              <Link href="/directory" className={link}>directory</Link> lists the commissions and boards of every state, and
              colleges and libraries can print the <Link href="/vacancies" className={link}>vacancies page</Link>.
            </p>
          </section>

          <section aria-labelledby="page-h" className="space-y-3">
            <h2 id="page-h" className={h2}>What a job page shows</h2>
            <p className="max-w-prose">
              The facts the notice states, in a table. Most facts show the page of the notice they came from. If the notice
              does not say something, the page says so. Nothing is guessed.
            </p>
            {/* an example row, drawn like the real table */}
            <figure className="max-w-xl" aria-label="Example of a job page row">
              <p className="mb-1.5 text-[12px] font-bold uppercase tracking-wide text-muted">Example</p>
              <div className="overflow-hidden rounded-xl border border-line">
                <table className="w-full table-fixed border-collapse bg-surface text-sm">
                  <colgroup><col className="w-[40%]" /><col /></colgroup>
                  <tbody className="[&>tr>*]:border-b [&>tr>*]:border-line [&>tr:last-child>*]:border-b-0">
                    <tr className="bg-saffron-tint">
                      <th scope="row" className="px-3 py-2.5 text-left font-bold text-ink">Last date to apply</th>
                      <td className="px-3 py-2.5 font-semibold text-ink">25 Nov 2026 <span className="font-medium text-muted">p. 3</span></td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-3 py-2.5 text-left font-normal text-ink-2">Application fee</th>
                      <td className="px-3 py-2.5 text-ink">See notification</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <figcaption className="mt-1.5 text-sm text-muted">
                On a real page, &ldquo;p. 3&rdquo; opens the notice at page 3. Applications are always made on the official website.
              </figcaption>
            </figure>
            <Link href="/editorial-policy" className={`inline-flex min-h-[44px] items-center gap-1.5 ${link}`}>
              Read how we check each notice <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </section>

          <section aria-labelledby="gov-h" className="space-y-2">
            <h2 id="gov-h" className={h2}>Check before you pay</h2>
            <p className="max-w-prose">
              India Job Notice is not approved by any government or recruiting body. Names such as SSC or RRB only say whose
              notice it is. Before you apply or pay a fee:
            </p>
            <ul className="max-w-prose list-disc space-y-1 pl-6 marker:text-faint">
              <li>read the official notification;</li>
              <li>check the website&apos;s address: official recruitment sites usually end in .gov.in or .nic.in, and banks use their own (such as sbi.co.in).</li>
            </ul>
          </section>

          <section aria-labelledby="next-h" className="rounded-xl border border-line bg-surface p-5 space-y-3">
            <h2 id="next-h" className={h2}>Found a mistake?</h2>
            <p className="max-w-prose text-sm">
              Send the link to the job page and what looks wrong, by email from the contact page. We will check it against the official notice.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-navy-solid px-5 text-sm font-bold text-white hover:bg-navy-strong"
              >
                Report a mistake <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/"
                className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-line bg-surface px-5 text-sm font-bold text-ink hover:border-navy"
              >
                See open jobs
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
