import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { WhatsAppLogo, TelegramLogo, InstagramLogo, YouTubeLogo, INSTAGRAM_URL, YOUTUBE_URL } from "@/components/common/SocialIcons";
import { ExternalLink, Mail } from "lucide-react";
import { SITE_OG_IMAGES } from "@/lib/site-image";

// Contact (21 Nov, critique 16/40): only what is true. One address; reporting a mistake first, with what to
// include and an email that opens with the subject and the questions filled in. No offices, desks, hours or
// promised reply times: none exist.

export const metadata: Metadata = {
  title: "Contact",
  description: "Email India Job Notice to report a mistake on a job page or ask a question. Our Telegram, WhatsApp, Instagram and YouTube channels.",
  alternates: {
    canonical: "https://www.indiajobnotice.com/contact",
  },
  openGraph: {
    images: SITE_OG_IMAGES,
    title: "Contact India Job Notice",
    description: "Report a mistake on a job page or ask a question.",
    url: "https://www.indiajobnotice.com/contact",
    siteName: "India Job Notice",
    locale: "en_IN",
    type: "website",
  },
};

const EMAIL = "indiajobnotice@gmail.com";
const correctionMail = `mailto:${EMAIL}?subject=${encodeURIComponent("Correction: ")}&body=${encodeURIComponent(
  "Job page link:\n\nWhat is wrong on the page:\n\nWhat the official notice says (page number if you know it):\n",
)}`;

const CHANNELS = [
  { href: "https://t.me/india_jobnotice", name: "Telegram", handle: "@india_jobnotice", text: "New job notices, admit cards and results", Logo: TelegramLogo, bg: "bg-[#1A7DB0]" },
  { href: "https://whatsapp.com/channel/0029Vb9GFwsGzzKXYJyKer1C", name: "WhatsApp", handle: "India Job Notice", text: "New notices on your phone", Logo: WhatsAppLogo, bg: "bg-[#13853F]" },
  { href: INSTAGRAM_URL, name: "Instagram", handle: "@indiajobnotice", text: "Short videos on big new vacancies", Logo: InstagramLogo, bg: "bg-instagram" },
  { href: YOUTUBE_URL, name: "YouTube", handle: "@indiajobnotice", text: "Shorts on big new vacancies", Logo: YouTubeLogo, bg: "bg-[#CC0000]" },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      <section className="border-b border-line bg-subtle py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-3">
          <Breadcrumbs items={[{ label: "Contact" }]} className="mb-3" />
          <h1 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">Contact</h1>
          <p className="text-base sm:text-lg text-ink-2 leading-relaxed max-w-prose">
            One email address for everything:
            <a href={`mailto:${EMAIL}`} className="mt-1 flex min-h-[44px] items-center font-semibold text-navy underline underline-offset-2 hover:text-saffron">{EMAIL}</a>
          </p>
        </div>
      </section>

      <main id="main-content" className="max-w-3xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full space-y-10 text-base text-ink-2 leading-relaxed">
        {/* the reason most people come here */}
        <section aria-labelledby="mistake-h" className="rounded-xl border border-line bg-surface p-5 sm:p-6">
          <h2 id="mistake-h" className="text-xl font-bold text-ink">Found a mistake on a job page?</h2>
          <p className="mt-2 max-w-prose">
            Every job page is taken from the official notice, and its facts link to the page of the notice they came from.
            If something does not match the notice, tell us and we will check it against the notice and correct the page.
          </p>
          <p className="mt-4 font-semibold text-ink">Please include:</p>
          <ol className="mt-1 list-decimal space-y-1 pl-6 marker:font-semibold marker:text-navy">
            <li>the link to the job page</li>
            <li>what is wrong on it</li>
            <li>what the official notice says, with its page number if you know it</li>
          </ol>
          <a
            href={correctionMail}
            className="mt-5 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-navy-solid px-5 py-3 text-base font-bold text-white hover:bg-navy-strong sm:inline-flex sm:w-auto"
          >
            <Mail className="h-5 w-5" aria-hidden />
            Email a correction
          </a>
          <p className="mt-2 text-sm text-muted">
            Opens your email app with these questions filled in. Or write to{" "}
            <span className="select-all break-all font-semibold text-ink">{EMAIL}</span>
          </p>
        </section>

        <section aria-labelledby="other-h">
          <h2 id="other-h" className="text-xl font-bold text-ink">Anything else</h2>
          <p className="mt-2 max-w-prose">
            Questions about the site, a notice we have missed, or a request from a college or coaching centre: write to the
            same address. Colleges and libraries can print our list of open jobs from the{" "}
            <Link href="/vacancies" className="font-semibold text-navy underline underline-offset-2 hover:text-saffron">vacancies page</Link>.
          </p>
        </section>

        <section aria-labelledby="channels-h">
          <h2 id="channels-h" className="text-xl font-bold text-ink">Get new notices</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {CHANNELS.map(({ href, name, handle, text, Logo, bg }) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-[72px] items-center gap-3 rounded-lg border border-line bg-surface p-4 transition-colors hover:border-navy"
                >
                  <span className={`shrink-0 rounded-full p-2.5 text-white ${bg}`}><Logo className="h-5 w-5" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-ink">{name} <span className="font-normal text-muted">{handle}</span></span>
                    <span className="block text-sm text-ink-2">{text}</span>
                  </span>
                  <ExternalLink className="h-4 w-4 shrink-0 text-muted" aria-hidden />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="money-h" className="rounded-xl border border-saffron-line bg-saffron-tint p-5">
          <h2 id="money-h" className="text-lg font-bold text-ink">We never ask for money</h2>
          <p className="mt-2 max-w-prose">
            India Job Notice does not take applications, interview anyone or issue appointment letters, and never asks for
            fees, UPI payments or bank details. Application fees are paid only on the recruiting body&apos;s own website.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
