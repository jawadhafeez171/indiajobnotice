import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { TricolorCapsule } from "@/components/common/BrandLogo";
import { 
  ShieldCheck, 
  Target, 
  Users, 
  FileCheck, 
  Scale, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Building2,
  Mail
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | IndiaJobNotice.com - Independent Public Employment Gazette",
  description: "Learn about IndiaJobNotice.com, our mission to democratize public career intelligence for competitive exam aspirants across India, our editorial standards, and our verification methodology.",
  alternates: {
    canonical: "https://www.indiajobnotice.com/about",
  },
  openGraph: {
    title: "About IndiaJobNotice - Independent Public Career Intelligence",
    description: "Empowering 40M+ Indian youth with verified government job gazettes, exam dates, syllabus patterns, and district-level notices.",
    url: "https://www.indiajobnotice.com/about",
    siteName: "India Job Notice",
    locale: "en_IN",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF4]">
      <Navbar />

      {/* Editorial Header */}
      <section className="border-b border-[#EAE2D2] bg-[#FCFAF4] py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs text-[#68635B]">
            <Link href="/" className="hover:text-[#1E3799] font-medium transition-colors">
              All-India Gazettes
            </Link>
            <span>/</span>
            <span className="text-[#1A1918] font-bold">About Us</span>
          </div>

          <div className="flex items-center gap-2">
            <TricolorCapsule className="w-10 h-1.5" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#1E3799] font-bold">
              Public Career Intelligence & Transparency
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1A1918] tracking-tight">
            Democratizing Government Career Notices for Every Aspirant
          </h1>

          <p className="text-base sm:text-lg text-[#524E48] font-serif leading-relaxed max-w-3xl pt-2">
            IndiaJobNotice.com is an independent educational and public notice directory built to bridge the gap between complex official government gazettes and competitive examination aspirants across all 36 States &amp; Union Territories.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full space-y-12 text-sm text-[#423F3A] leading-relaxed">
        
        {/* Core Mission & The Problem We Solve */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#EAE2D2] pb-2">
            <Target className="w-5 h-5 text-[#1E3799]" />
            <h2 className="font-serif text-2xl font-bold text-[#1A1918]">Our Mission &amp; Purpose</h2>
          </div>
          <p>
            Every year, over <strong>40 million young Indians</strong> prepare for central civil services, defense forces, railways, banking, state public service commissions (PSCs), staff selection exams, and judicial recruitments. However, vital recruitment information is often buried in multi-page bureaucratic PDFs, dispersed across hundreds of sluggish departmental websites, or obfuscated by clickbait portals and scam advertisements.
          </p>
          <p>
            <strong>IndiaJobNotice.com was created to solve this challenge.</strong> We transform multi-page statutory gazettes into structured, accessible, mobile-first summaries containing verified qualification criteria, precise age-reckoning cut-off dates, syllabus outlines, district vacancy allocations, and direct links to official `.gov.in` and `.nic.in` application servers.
          </p>
        </section>

        {/* 4 Pillars of IndiaJobNotice */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#EAE2D2] pb-2">
            <ShieldCheck className="w-5 h-5 text-[#209948]" />
            <h2 className="font-serif text-2xl font-bold text-[#1A1918]">Our Four Operating Pillars</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Pillar 1 */}
            <div className="bg-white p-5 rounded-lg border border-[#EAE2D2] shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-[#1E3799] font-bold font-serif text-base">
                <FileCheck className="w-5 h-5" />
                <h3>1. Primary Source Purity</h3>
              </div>
              <p className="text-xs text-[#524E48] leading-relaxed">
                We never cite rumors, unverified social media forwards, or third-party blogs. Every single notice on IndiaJobNotice is corroborated directly against an official signed gazette notification issued by competent authorities.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-5 rounded-lg border border-[#EAE2D2] shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-[#209948] font-bold font-serif text-base">
                <CheckCircle2 className="w-5 h-5" />
                <h3>2. 100% Free &amp; Unrestricted Access</h3>
              </div>
              <p className="text-xs text-[#524E48] leading-relaxed">
                No candidate is ever asked to pay a fee, buy a subscription, or register personal credentials to read gazettes or download syllabi. Platform maintenance is sustained via non-intrusive display advertising.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-5 rounded-lg border border-[#EAE2D2] shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-[#E96B15] font-bold font-serif text-base">
                <MapPin className="w-5 h-5" />
                <h3>3. District-Level Granularity</h3>
              </div>
              <p className="text-xs text-[#524E48] leading-relaxed">
                Aspirants in rural areas and tier-2/3 cities deserve hyper-local notice tracking. We index District Courts, CMO Health Societies (NHM), Zilla Parishads, and Collectorate recruitment drives across 194+ districts.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white p-5 rounded-lg border border-[#EAE2D2] shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-[#68635B] font-bold font-serif text-base">
                <Sparkles className="w-5 h-5 text-[#1E3799]" />
                <h3>4. High-Performance Engineering</h3>
              </div>
              <p className="text-xs text-[#524E48] leading-relaxed">
                Built on Next.js with Static Site Generation (SSG), IndiaJobNotice loads in milliseconds even on 2G/3G mobile networks in rural India, with zero Cumulative Layout Shift (CLS) and clean responsive design.
              </p>
            </div>
          </div>
        </section>

        {/* Editorial Desk & Who We Are */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#EAE2D2] pb-2">
            <Users className="w-5 h-5 text-[#1E3799]" />
            <h2 className="font-serif text-2xl font-bold text-[#1A1918]">Our Editorial Desk &amp; Research Team</h2>
          </div>
          <p>
            IndiaJobNotice is managed by an independent team of educational researchers, civic-data technologists, and civil service examination mentors. Our editorial desk monitors daily publications from:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-[#524E48] pt-1">
            <li className="p-2.5 rounded bg-white border border-[#EAE2D2] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#1E3799]" />
              <span>Union Public Service Commission (UPSC)</span>
            </li>
            <li className="p-2.5 rounded bg-white border border-[#EAE2D2] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#1E3799]" />
              <span>Staff Selection Commission (SSC)</span>
            </li>
            <li className="p-2.5 rounded bg-white border border-[#EAE2D2] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#1E3799]" />
              <span>Railway Recruitment Boards (RRB)</span>
            </li>
            <li className="p-2.5 rounded bg-white border border-[#EAE2D2] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#1E3799]" />
              <span>State PSCs (UPPSC, BPSC, KPSC, RPSC, etc.)</span>
            </li>
          </ul>
          <p className="text-xs text-[#68635B] pt-2">
            Read our complete <Link href="/editorial-policy" className="text-[#1E3799] underline font-bold">Editorial &amp; Verification Policy</Link> to learn about our 5-step fact-checking and errata correction protocol.
          </p>
        </section>

        {/* Statutory Non-Affiliation Box */}
        <section className="bg-[#FFF9F2] rounded-lg border-2 border-[#E96B15] p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 font-serif font-bold text-[#943F00] text-base">
            <Scale className="w-5 h-5 text-[#E96B15] shrink-0" />
            <h2>Statutory Non-Affiliation &amp; Legal Transparency</h2>
          </div>
          <p className="text-xs text-[#524E48] leading-relaxed">
            <strong>IndiaJobNotice.com is NOT a government website and is NOT affiliated with, authorized by, or endorsed by the Government of India, any State Government, or any recruiting commission.</strong>
          </p>
          <p className="text-xs text-[#524E48] leading-relaxed">
            All government department names, agency acronyms (UPSC, SSC, RRB, PSC), emblems, and trademarks referenced on this platform belong to their respective statutory owners. Their presence on IndiaJobNotice is solely for identification, descriptive reference, and public educational information under fair use. Candidates are always instructed to download and verify the original signed gazette PDF before submitting application forms or fee payments.
          </p>
        </section>

        {/* Contact & Reach Out CTA */}
        <section className="bg-white rounded-lg border border-[#EAE2D2] p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-[#1A1918]">Have Questions or an Errata Correction?</h3>
            <p className="text-xs text-[#68635B]">
              Our editorial and compliance desk reviews inquiries within 24 to 48 hours.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1E3799] hover:bg-[#16276E] text-white text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <Mail className="w-4 h-4" />
            <span>Contact Editorial Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
