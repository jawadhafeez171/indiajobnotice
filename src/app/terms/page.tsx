import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { TricolorCapsule } from "@/components/common/BrandLogo";
import { AlertTriangle, FileText, Scale, CheckCircle2, ShieldAlert, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service & Gazette Disclaimer",
  description: "Official Terms of Service for IndiaJobNotice.com. Non-affiliation disclaimer with government bodies, educational fair use, non-liability, and acceptable user conduct.",
  alternates: {
    canonical: "https://www.indiajobnotice.com/terms",
  },
  openGraph: {
    title: "Terms of Service - India Job Notice",
    description: "Terms and conditions of use for IndiaJobNotice.com.",
    url: "https://www.indiajobnotice.com/terms",
    siteName: "India Job Notice",
    locale: "en_IN",
    type: "website",
  },
};

export default function TermsPage() {
  const lastUpdated = "October 18, 2026";

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      {/* Editorial Header */}
      <section className="border-b border-line bg-subtle py-8 sm:py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-muted mb-3">
            <Link href="/" className="hover:text-navy font-medium transition-colors">
              All-India Gazettes
            </Link>
            <span>/</span>
            <span className="text-ink font-bold">Terms of Service</span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <TricolorCapsule className="w-10 h-1.5" />
            <span className="text-xs font-mono uppercase tracking-wider text-navy font-bold">
              Legal Terms & Gazette Disclaimer
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink tracking-tight">
            Terms of Service & Usage
          </h1>

          <p className="mt-2 text-xs text-muted font-mono">
            Effective Date & Last Updated: <strong>{lastUpdated}</strong>
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full space-y-8 text-sm text-ink-2 leading-relaxed">
        
        {/* Prominent Statutory Disclaimer */}
        <div className="bg-saffron-tint rounded-lg border-2 border-saffron-bright p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 font-serif font-bold text-saffron text-base">
            <AlertTriangle className="w-5 h-5 text-saffron shrink-0" />
            <h2>Important Statutory Disclaimer: Not a Government Entity</h2>
          </div>
          <p className="text-xs text-ink-2 leading-relaxed">
            <strong>IndiaJobNotice.com is an independent private educational and informational portal.</strong> We are NOT associated, affiliated, endorsed by, or in any way officially connected with the Government of India, any State Government, the Union Public Service Commission (UPSC), Staff Selection Commission (SSC), Railway Recruitment Boards (RRB), State Public Service Commissions, High Courts, or any official recruitment board.
          </p>
          <p className="text-xs text-ink-2 leading-relaxed">
            All recruitment circulars, examination schedules, eligibility summaries, and answer keys hosted on this platform are aggregated strictly from publicly accessible government gazettes, press releases, and official commission websites for public convenience and educational awareness.
          </p>
        </div>

        {/* 1. Acceptance of Terms */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-ink border-b border-line pb-2">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing, reading, or navigating <strong>IndiaJobNotice.com</strong> (referred to herein as &ldquo;the Portal&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service, along with our <Link href="/privacy-policy" className="text-navy underline font-medium">Privacy Policy</Link>. If you do not agree with any part of these terms, please discontinue use of this site immediately.
          </p>
        </section>

        {/* 2. Educational Fair Use & Verification Requirement */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-ink border-b border-line pb-2">
            2. Candidate Verification Obligation
          </h2>
          <p>
            While IndiaJobNotice exercises extreme diligence in transcribing, formatting, and presenting public employment notifications accurately:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-ink-2">
            <li>
              <strong>Mandatory PDF Verification:</strong> Every notification card on IndiaJobNotice includes direct links to the issuing body&apos;s official advertisement PDF or portal (ending in <code>.gov.in</code>, <code>.nic.in</code>, etc.). Candidates are <strong>strictly required</strong> to download and thoroughly review the original official notification before submitting any application or making payments.
            </li>
            <li>
              <strong>No Liability for Discrepancies:</strong> In the event of any inadvertent typographical error, discrepancy between our editorial summary and the official gazette, change in vacancies, or sudden examination date postponement by the commission, the official gazette issued by the competent authority shall prevail. IndiaJobNotice assumes no legal liability for candidate actions based on summary text.
            </li>
          </ul>
        </section>

        {/* 3. Platform Monetization & Transparency */}
        <section className="space-y-3 bg-surface p-5 rounded-lg border border-line">
          <div className="flex items-center gap-2 text-navy">
            <Scale className="w-5 h-5" />
            <h2 className="font-serif text-xl font-bold text-ink">
              3. Free Access & Advertising Transparency
            </h2>
          </div>
          <p>
            IndiaJobNotice is operated as a free public service for competitive examination aspirants across urban and rural India.
          </p>
          <div className="space-y-2 text-xs text-ink-2">
            <p>
              • <strong>Zero Candidate Fees:</strong> We never charge fees for accessing notifications, downloading syllabus PDFs, checking eligibility, or viewing admit card dates.
            </p>
            <p>
              • <strong>Display Advertising:</strong> To finance continuous server infrastructure, high-speed CDN delivery, and editorial verification without paywalls, the Portal displays non-intrusive, family-friendly display advertisements (including Google AdSense).
            </p>
            <p>
              • <strong>No Endorsement of Advertised Products:</strong> Advertisements appearing on the Portal are served by third-party ad networks. Appearance of an advertisement does not constitute an endorsement, guarantee, or recommendation by IndiaJobNotice.
            </p>
          </div>
        </section>

        {/* 4. Intellectual Property Rights */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-ink border-b border-line pb-2">
            4. Intellectual Property & Trademarks
          </h2>
          <p>
            Official names of commissions (e.g., UPSC, SSC, IBPS, NTA, BPSC, UPPSC), state emblems, and statutory titles mentioned on this site are registered trademarks or service marks of their respective government departments. Their fair use here is solely for identification, educational reporting, and public notification purposes under doctrine of fair use.
          </p>
          <p className="text-xs text-ink-2">
            The unique editorial syntheses, website design, layout tokens, database structure, and eligibility calculation algorithms developed by IndiaJobNotice are protected under copyright laws. Unauthorized bulk extraction, automated scraping, or replication without attribution is prohibited.
          </p>
        </section>

        {/* 5. Acceptable User Conduct */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-ink border-b border-line pb-2">
            5. Acceptable User Conduct
          </h2>
          <p>
            When utilizing IndiaJobNotice, you agree not to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-ink-2">
            <li>Deploy automated bots, spiders, or crawlers at rates that degrade server performance for other students.</li>
            <li>Attempt to breach security measures or probe platform vulnerabilities.</li>
            <li>Misrepresent your identity or falsely claim association with IndiaJobNotice.</li>
            <li>Engage in any activity that violates applicable local, state, national, or international laws.</li>
          </ul>
        </section>

        {/* 6. Limitation of Liability */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-ink border-b border-line pb-2">
            6. Limitation of Liability
          </h2>
          <p className="text-xs text-ink-2 leading-relaxed">
            In no event shall IndiaJobNotice, its creators, editors, or contributors be liable for any direct, indirect, incidental, consequential, or punitive damages arising from the use of, or inability to use, this website or the information contained herein. This includes, without limitation, missed application deadlines, examination cancellations, technical server downtimes on official government portals, or disqualification from recruitment processes.
          </p>
        </section>

        {/* 7. Contact & Corrections */}
        <section className="bg-surface rounded-lg border border-line p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-navy">
            <Mail className="w-5 h-5" />
            <h2 className="font-serif text-lg font-bold text-ink">
              7. Corrections & Editorial Contact
            </h2>
          </div>
          <p className="text-xs text-ink-2">
            We welcome corrections from candidates, educators, and departmental officials. If you spot a factual error in any published circular, please inform our editorial team:
          </p>
          <div className="text-xs font-mono space-y-1 bg-subtle p-3 rounded border border-line text-ink">
            <p><strong>Editorial Desk:</strong> <a href="mailto:contact@indiajobnotice.com" className="text-navy underline">contact@indiajobnotice.com</a></p>
            <p><strong>Corrections SLA:</strong> Verified corrections are updated within 24 to 48 hours.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
