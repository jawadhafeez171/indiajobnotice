import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { WhatsAppLogo, TelegramLogo, InstagramLogo, YouTubeLogo, INSTAGRAM_URL, YOUTUBE_URL } from "@/components/common/SocialIcons";
import { ExternalLink, Mail } from "lucide-react";
import { SITE_OG_IMAGES } from "@/lib/site-image";
import { CopyEmail } from "@/components/common/CopyEmail";

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
  "Job page link (copy it from your browser's address bar):\n\nWhat is wrong on the page:\n\nWhat the official notice says (page number if you know it):\n",
)}`;

const CHANNELS = [
  { href: "https://t.me/india_jobnotice", name: "Telegram", handle: "@india_jobnotice", text: "New job notices, admit cards and results", Logo: TelegramLogo, bg: "bg-[#1A7DB0]" },
  { href: "https://whatsapp.com/channel/0029Vb9GFwsGzzKXYJyKer1C", name: "WhatsApp", handle: "India Job Notice", text: "New notices on your phone", Logo: WhatsAppLogo, bg: "bg-[#13853F]" },
  { href: INSTAGRAM_URL, name: "Instagram", handle: "@indiajobnotice1", text: "Short videos on big new vacancies", Logo: InstagramLogo, bg: "bg-instagram" },
  { href: YOUTUBE_URL, name: "YouTube", handle: "@indiajobnotice", text: "Shorts on big new vacancies", Logo: YouTubeLogo, bg: "bg-[#CC0000]" },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      <main id="main-content" className="flex-1 w-full">
      <section className="border-b border-line bg-subtle py-6 sm:py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-3">
          <Breadcrumbs items={[{ label: "Contact" }]} className="mb-3" />
          <h1 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">Contact</h1>
          {/* phones: the address is under the button, so the button stays on the first screen */}
          <p className="hidden sm:block text-lg text-ink-2 leading-relaxed max-w-prose">
            One email address for everything: <span className="font-semibold text-ink">{EMAIL}</span>
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full space-y-10 text-base text-ink-2 leading-relaxed">
        {/* the reason most people come here */}
        <section aria-labelledby="mistake-h" className="rounded-xl border border-line bg-surface p-5 sm:p-6">
          <h2 id="mistake-h" className="text-xl font-bold text-ink">Found a mistake on a job page?</h2>
          <p className="mt-2 max-w-[60ch]">
            Job pages are taken from official notices. If a page does not match its notice, tell us and we will check it and
            correct the page.
          </p>
          <p className="mt-4 font-semibold text-ink">Please include:</p>
          <ol className="mt-1 list-decimal space-y-1 pl-6 marker:font-semibold marker:text-navy">
            <li>the link to the job page</li>
            <li>what is wrong on it</li>
            <li>what the official notice says, with its page number if you know it</li>
          </ol>
          <p className="mt-3 text-sm text-ink-2">
            On the job page itself? Its &ldquo;Email a correction&rdquo; link fills in the page link for you.
          </p>
          <a
            href={correctionMail}
            className="mt-5 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-navy-solid px-5 py-3 text-base font-bold text-white hover:bg-navy-strong sm:inline-flex sm:w-auto"
          >
            <Mail className="h-5 w-5" aria-hidden />
            Email a correction
          </a>
          <p className="mt-2 text-sm text-muted">
            Opens your email app with the questions filled in. Any language is fine, and you can attach a photo of the notice.
            No email app? Copy the address:
          </p>
          <CopyEmail email={EMAIL} />
        </section>

        <section aria-labelledby="other-h" className="space-y-2">
          <h2 id="other-h" className="text-xl font-bold text-ink">Anything else</h2>
          <p className="max-w-[60ch]">
            Questions, a notice we have missed, or a request from a college or coaching centre: write to the same address.
          </p>
          <p className="max-w-[60ch]">
            Printing for a notice board? Use the{" "}
            <Link href="/vacancies" className="font-semibold text-navy underline underline-offset-2 hover:text-saffron">vacancies page</Link>.
          </p>
          <p>
            <Link href="/editorial-policy" className="inline-flex min-h-[44px] items-center font-semibold text-navy underline underline-offset-2 hover:text-saffron">How we check notices</Link>
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
          <p className="mt-2 max-w-[60ch]">
            India Job Notice does not take applications, interview anyone or issue appointment letters, and never asks for
            fees, UPI payments or bank details. Application fees are paid only on the recruiting body&apos;s own website.
          </p>
        </section>
      </div>
      </main>

      <Footer />
    </div>
  );
}
