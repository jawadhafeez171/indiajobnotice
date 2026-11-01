import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { TricolorCapsule } from "@/components/common/BrandLogo";
import { WhatsAppLogo, TelegramLogo } from "@/components/common/SocialIcons";
import { 
  Mail, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  FileCheck, 
  MessageSquare,
  AlertTriangle,
  Building2,
  ExternalLink
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Grievance Redressal",
  description: "Official contact details for IndiaJobNotice.com. Reach our editorial desk, grievance officer, report notification errata, or connect with our verified career alert channels.",
  alternates: {
    canonical: "https://www.indiajobnotice.com/contact",
  },
  openGraph: {
    title: "Contact India Job Notice",
    description: "Official contact emails, grievance officer details, and errata correction procedures for IndiaJobNotice.com.",
    url: "https://www.indiajobnotice.com/contact",
    siteName: "India Job Notice",
    locale: "en_IN",
    type: "website",
  },
};

export default function ContactPage() {
  const whatsappChannel = "https://whatsapp.com/channel/0029Vb9GFwsGzzKXYJyKer1C";
  const telegramChannel = "https://t.me/Indiajobnotice1";

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      {/* Editorial Header */}
      <section className="border-b border-line bg-subtle py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Link href="/" className="hover:text-navy font-medium transition-colors">
              All-India Gazettes
            </Link>
            <span>/</span>
            <span className="text-ink font-bold">Contact &amp; Grievance</span>
          </div>

          <div className="flex items-center gap-2">
            <TricolorCapsule className="w-10 h-1.5" />
            <span className="text-xs font-mono uppercase tracking-wider text-navy font-bold">
              Accountability &amp; Support
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ink tracking-tight">
            Contact Editorial Desk &amp; Grievance Officer
          </h1>

          <p className="text-base sm:text-lg text-ink-2 font-serif leading-relaxed max-w-3xl pt-2">
            We value accuracy, candidate transparency, and ethical publishing. Reach out to our editorial desk for corrections, legal inquiries, institutional partnerships, or platform feedback.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full space-y-10 text-sm text-ink-2 leading-relaxed">
        
        {/* Contact Department Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Editorial & Errata */}
          <div className="bg-surface p-5 rounded-lg border border-line shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-navy font-serif font-bold text-base">
                <FileCheck className="w-5 h-5 text-navy" />
                <h2>Editorial &amp; Errata</h2>
              </div>
              <p className="text-xs text-ink-2 leading-relaxed">
                Found a typo, changed exam date, or discrepancy in a gazette summary? Report it directly to our fact-checking desk.
              </p>
            </div>
            <div className="pt-2 border-t border-line-soft space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted block">Primary Email</span>
              <a href="mailto:contact@indiajobnotice.com" className="text-xs font-bold text-navy hover:underline block break-all">
                contact@indiajobnotice.com
              </a>
              <span className="text-[12px] text-green font-medium block">Turnaround: 24-48 Hours</span>
            </div>
          </div>

          {/* Card 2: Grievance Officer */}
          <div className="bg-surface p-5 rounded-lg border border-line shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-saffron font-serif font-bold text-base">
                <ShieldAlert className="w-5 h-5 text-saffron" />
                <h2>Grievance Redressal</h2>
              </div>
              <p className="text-xs text-ink-2 leading-relaxed">
                Designated Grievance Officer in compliance with India&apos;s Information Technology (Intermediary Guidelines) Rules, 2021 &amp; DPDP Act.
              </p>
            </div>
            <div className="pt-2 border-t border-line-soft space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted block">Grievance Desk</span>
              <a href="mailto:grievance@indiajobnotice.com" className="text-xs font-bold text-saffron hover:underline block break-all">
                grievance@indiajobnotice.com
              </a>
              <span className="text-[12px] text-ink-2 font-medium block">Subject: [Grievance] Notice ID</span>
            </div>
          </div>

          {/* Card 3: Institutions & Colleges */}
          <div className="bg-surface p-5 rounded-lg border border-line shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green font-serif font-bold text-base">
                <Building2 className="w-5 h-5 text-green" />
                <h2>College Notice Boards</h2>
              </div>
              <p className="text-xs text-ink-2 leading-relaxed">
                For educational libraries, universities, and coaching institutes seeking to embed our free exam calendar widgets.
              </p>
            </div>
            <div className="pt-2 border-t border-line-soft space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted block">Institutional Desk</span>
              <a href="mailto:institutions@indiajobnotice.com" className="text-xs font-bold text-green hover:underline block break-all">
                institutions@indiajobnotice.com
              </a>
              <span className="text-[12px] text-ink-2 font-medium block">Free Digital Notice Boards</span>
            </div>
          </div>
        </div>

        {/* Official Channels & Community Broadcasts */}
        <section className="bg-surface rounded-lg border border-line p-6 shadow-2xs space-y-4">
          <div className="border-b border-line-soft pb-3">
            <h2 className="font-serif text-xl font-bold text-ink">
              Official Real-Time Alert Broadcasts
            </h2>
            <p className="text-xs text-muted mt-1">
              Subscribe directly to our verified, scam-free channels for instant alerts when new gazettes are released:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* WhatsApp */}
            <a
              href={whatsappChannel}
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-lg border border-[#25D366]/40 bg-green-tint hover:bg-green-tint transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-full bg-[#25D366] text-white">
                  <WhatsAppLogo className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-ink text-sm group-hover:text-green">
                    Official WhatsApp Channel
                  </h3>
                  <p className="text-xs text-ink-2">Daily gazettes &amp; urgent circulars</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#25D366]" />
            </a>

            {/* Telegram */}
            <a
              href={telegramChannel}
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-lg border border-[#24A1DE]/40 bg-sky-tint hover:bg-sky-tint transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-full bg-[#24A1DE] text-white">
                  <TelegramLogo className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-ink text-sm group-hover:text-[#187CB0]">
                    Official Telegram Channel
                  </h3>
                  <p className="text-xs text-ink-2">PDF circulars &amp; syllabus sheets</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#24A1DE]" />
            </a>
          </div>
        </section>

        {/* Physical / Registered Location Details */}
        <section className="bg-surface rounded-lg border border-line p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-line-soft pb-3">
            <MapPin className="w-5 h-5 text-navy" />
            <h2 className="font-serif text-lg font-bold text-ink">
              Publisher Information &amp; Postal Correspondence
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-ink-2">
            <div className="space-y-1.5 font-mono bg-subtle p-4 rounded border border-line">
              <p className="font-bold text-ink">IndiaJobNotice Editorial Desk</p>
              <p>Independent Educational Publishing &amp; Civic Career Intelligence</p>
              <p>New Delhi &amp; Bengaluru, India</p>
              <p className="pt-2 text-[12px] text-muted">
                Working Hours: Monday – Saturday (9:30 AM to 6:30 PM IST)
              </p>
            </div>
            <div className="space-y-2 p-4 rounded bg-subtle border border-line">
              <div className="flex items-center gap-1.5 font-bold text-ink">
                <Clock className="w-4 h-4 text-saffron" />
                <span>Editorial Processing Standard</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Factual correction requests received through <code>contact@indiajobnotice.com</code> are logged in our editorial registry and verified within 24 to 48 hours. Urgent exam date revisions are updated same-day.
              </p>
            </div>
          </div>
        </section>

        {/* Candidate Anti-Scam Security Notice */}
        <section className="bg-saffron-tint rounded-lg border-2 border-saffron-bright p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 font-serif font-bold text-saffron text-base">
            <AlertTriangle className="w-5 h-5 text-saffron shrink-0" />
            <h2>Important Candidate Reassurance: Zero Financial Transactions</h2>
          </div>
          <p className="text-xs text-ink-2 leading-relaxed">
            <strong>IndiaJobNotice never conducts job interviews, never issues appointment letters, and NEVER requests money, registration fees, UPI transfers, or bank account details from aspirants.</strong>
          </p>
          <p className="text-xs text-ink-2 leading-relaxed">
            All legitimate government examination application fees must only be paid through the official commission payment gateways hosted on official government portals (such as <code>upsc.gov.in</code>, <code>ssc.gov.in</code>, or state commission sites). Beware of fraudulent individuals posing as portal representatives on social media or messaging platforms.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
