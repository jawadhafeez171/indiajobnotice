import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { TricolorCapsule } from "@/components/common/BrandLogo";
import { 
  FileCheck, 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  AlertCircle, 
  RefreshCw, 
  Scale, 
  FileText,
  Mail,
  ArrowRight
} from "lucide-react";

export const metadata: Metadata = {
  title: "Editorial & Verification Policy",
  description: "Our comprehensive 5-stage fact-checking methodology, gazette verification standards, crucial date reckoning algorithms, and errata correction protocol.",
  alternates: {
    canonical: "https://www.indiajobnotice.com/editorial-policy",
  },
  openGraph: {
    title: "Editorial & Verification Standards - IndiaJobNotice",
    description: "How IndiaJobNotice verifies government employment notifications, calculates age criteria, and upholds primary source integrity.",
    url: "https://www.indiajobnotice.com/editorial-policy",
    siteName: "India Job Notice",
    locale: "en_IN",
    type: "website",
  },
};

export default function EditorialPolicyPage() {
  const lastUpdated = "October 18, 2026";

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
            <span className="text-ink font-bold">Editorial Standards</span>
          </div>

          <div className="flex items-center gap-2">
            <TricolorCapsule className="w-10 h-1.5" />
            <span className="text-xs font-mono uppercase tracking-wider text-navy font-bold">
              Fact-Checking &amp; Verification Protocol
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ink tracking-tight">
            Editorial &amp; Gazette Verification Policy
          </h1>

          <p className="text-base sm:text-lg text-ink-2 font-serif leading-relaxed max-w-3xl pt-2">
            In competitive government examinations, a single inaccurate date or miscalculated age cut-off can disqualify a student. Our rigorous 5-stage verification methodology ensures every notification published on IndiaJobNotice is authentic, verified, and backed by primary public records.
          </p>

          <p className="text-xs text-muted font-mono pt-1">
            Policy Effective: <strong>{lastUpdated}</strong> • Governed by Editorial Standards Board
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full space-y-12 text-sm text-ink-2 leading-relaxed">
        
        {/* The 5-Stage Verification Pipeline */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-line pb-2">
            <ShieldCheck className="w-5 h-5 text-green" />
            <h2 className="font-serif text-2xl font-bold text-ink">
              The 5-Stage Gazette Verification Pipeline
            </h2>
          </div>

          <p>
            Before any recruitment notice, admit card link, answer key, or result summary is published to our production feeds, it must pass through five mandatory editorial quality gates:
          </p>

          <div className="space-y-4 pt-2">
            {/* Stage 1 */}
            <div className="bg-surface p-5 rounded-lg border border-line shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-navy font-serif font-bold text-base">
                <span className="w-6 h-6 rounded-full bg-navy-tint text-navy font-mono text-xs flex items-center justify-center border border-navy-line">
                  1
                </span>
                <h3>Primary Source Authentication Only</h3>
              </div>
              <p className="text-xs text-ink-2 leading-relaxed">
                We accept only primary government sources: the Gazette of India, State Extraordinary Gazettes, High Court registries, and authenticated commission domains ending in <code>.gov.in</code>, <code>.nic.in</code>, <code>.ac.in</code>, or <code>.org.in</code>. We have a strict zero-tolerance policy against republishing social media rumors, unverified coaching leaks, or unofficial mock notices.
              </p>
            </div>

            {/* Stage 2 */}
            <div className="bg-surface p-5 rounded-lg border border-line shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-navy font-serif font-bold text-base">
                <span className="w-6 h-6 rounded-full bg-navy-tint text-navy font-mono text-xs flex items-center justify-center border border-navy-line">
                  2
                </span>
                <h3>Vacancy Matrix &amp; Category Roster Verification</h3>
              </div>
              <p className="text-xs text-ink-2 leading-relaxed">
                Total advertised vacancies are cross-verified against statutory reservation rosters (Unreserved, OBC-NCL, EWS, SC, ST, PwBD, Ex-Servicemen, and State Domicile Horizontal Quotas). If a notice states 12,199 vacancies (e.g. Bihar BSSC Inter-Level), our desk confirms the exact breakdown by department and gender allocation before tagging.
              </p>
            </div>

            {/* Stage 3 */}
            <div className="bg-surface p-5 rounded-lg border border-line shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-navy font-serif font-bold text-base">
                <span className="w-6 h-6 rounded-full bg-navy-tint text-navy font-mono text-xs flex items-center justify-center border border-navy-line">
                  3
                </span>
                <h3>Crucial Date &amp; Age-Reckoning Algorithm Validation</h3>
              </div>
              <p className="text-xs text-ink-2 leading-relaxed">
                Many aspirants face disqualification due to confusing cut-off reckoning dates. Our editorial desk extracts the exact date specified in Paragraph 3/4 of the official PDF (e.g. UPSC reckons age on August 1; SSC on January 1 or August 1; UPPRPB on July 1). We encode these dates into our <Link href="/calculator" className="text-navy underline font-bold">Eligibility Calculator</Link> to eliminate candidate uncertainty.
              </p>
            </div>

            {/* Stage 4 */}
            <div className="bg-surface p-5 rounded-lg border border-line shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-navy font-serif font-bold text-base">
                <span className="w-6 h-6 rounded-full bg-navy-tint text-navy font-mono text-xs flex items-center justify-center border border-navy-line">
                  4
                </span>
                <h3>Direct Official PDF Preservation</h3>
              </div>
              <p className="text-xs text-ink-2 leading-relaxed">
                We believe candidates must always have unfettered access to original legal text. Every job detail card hosts a direct, verified link to the issuing commission&apos;s signed PDF notice. We never place intermediate download shorteners, paywalls, or forced ad-gates on official circulars.
              </p>
            </div>

            {/* Stage 5 */}
            <div className="bg-surface p-5 rounded-lg border border-line shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-navy font-serif font-bold text-base">
                <span className="w-6 h-6 rounded-full bg-navy-tint text-navy font-mono text-xs flex items-center justify-center border border-navy-line">
                  5
                </span>
                <h3>Continuous Corrigendum &amp; Postponement Tracking</h3>
              </div>
              <p className="text-xs text-ink-2 leading-relaxed">
                Recruitments frequently experience deadline extensions, vacancy revisions, or exam schedule shifts (corrigenda). Our editors monitor commission notice boards daily. When a corrigendum is published, the master notice is updated with an editorial badge and a revised &ldquo;Last Verified On&rdquo; timestamp.
              </p>
            </div>
          </div>
        </section>

        {/* Errata & Rapid Correction Protocol */}
        <section className="bg-surface rounded-lg border border-line p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-line-soft pb-3">
            <RefreshCw className="w-5 h-5 text-saffron" />
            <h2 className="font-serif text-xl font-bold text-ink">
              Transparent Errata &amp; Correction Protocol
            </h2>
          </div>
          <p className="text-xs text-ink-2 leading-relaxed">
            Despite our rigorous multi-stage checks, typographical or administrative revisions can occur. When an error is identified:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-ink-2">
            <li><strong>Immediate Correction:</strong> Corrections are prioritized and reflected in the live static database within 2 to 24 hours of confirmation.</li>
            <li><strong>Editorial Timestamp Update:</strong> The &ldquo;Last Verified On&rdquo; date on the notice is immediately refreshed.</li>
            <li><strong>Audit Logging:</strong> All changes are committed to our version-controlled git registry for transparent public auditability.</li>
          </ul>
          <p className="text-xs text-muted pt-1">
            If you notice any inaccuracy in any circular, please notify our team at <a href="mailto:contact@indiajobnotice.com" className="text-navy font-bold underline">contact@indiajobnotice.com</a> with the subject line <em>&ldquo;[Errata] Job Title&rdquo;</em>.
          </p>
        </section>

        {/* Editorial Independence & Advertising Ethics */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-line pb-2">
            <Scale className="w-5 h-5 text-navy" />
            <h2 className="font-serif text-2xl font-bold text-ink">
              Editorial Independence &amp; Advertising Separation
            </h2>
          </div>
          <p>
            To preserve reader trust and adhere strictly to Google Publisher Policies:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-ink-2">
            <div className="p-4 rounded-lg bg-surface border border-line space-y-1.5">
              <h4 className="font-bold text-ink">Clear Ad Labeling</h4>
              <p>
                Display advertisements are clearly separated from editorial content and labeled as &ldquo;Advertisement&rdquo;.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-surface border border-line space-y-1.5">
              <h4 className="font-bold text-ink">Zero Sponsored Rankings</h4>
              <p>
                No commercial advertiser or private coaching institute can pay to alter, elevate, or promote a job ranking on IndiaJobNotice.
              </p>
            </div>
          </div>
        </section>

        {/* CTA to About & Contact */}
        <section className="bg-subtle p-5 rounded-lg border border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-serif font-bold text-ink text-base">Learn More About Our Platform</h4>
            <p className="text-xs text-muted">Explore our mission, founding principles, and public accountability.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/about"
              className="px-3.5 py-2 rounded bg-surface border border-line hover:border-navy text-xs font-bold text-ink transition-colors"
            >
              About IndiaJobNotice
            </Link>
            <Link
              href="/contact"
              className="px-3.5 py-2 rounded bg-navy-solid text-white hover:bg-navy-strong text-xs font-bold transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
