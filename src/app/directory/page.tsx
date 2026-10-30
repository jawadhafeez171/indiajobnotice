import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { StateDirectoryView } from "@/components/directory/StateDirectoryView";
import { TricolorCapsule } from "@/components/common/BrandLogo";
import { SocialAlertBar } from "@/components/common/SocialAlertBar";
import { ReservedAdSlot } from "@/components/ads/ReservedAdSlot";

export const metadata: Metadata = {
  title: "All-India State Public Service Commissions & Police Boards Directory 2026",
  description: "Verified master directory of official State Public Service Commissions (KPSC, UPPSC, BPSC, MPSC, TNPSC, GPSC), Staff Selection Boards, and State Police Recruitment portals across India.",
  alternates: {
    canonical: "https://www.indiajobnotice.com/directory",
  },
  openGraph: {
    title: "All-India State Recruitment Commissions Directory 2026",
    description: "Verified official portal URLs, physical headquarters, and candidate helpdesk numbers for all 28 State PSCs and Police Recruitment Boards.",
    url: "https://www.indiajobnotice.com/directory",
    siteName: "India Job Notice",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "State Recruitment Commissions & Police Boards Directory 2026",
    description: "Official portal directory for KPSC, UPPSC, BPSC, RPSC, MPSC and all state examination commissions.",
  },
};

export default function DirectoryPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "All-India State Recruitment Commissions Directory 2026",
    description: "Master directory of official State Public Service Commissions and Police Boards across India.",
    url: "https://www.indiajobnotice.com/directory",
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF4]">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar currentStateSlug="central" />

      {/* Editorial Header */}
      <section className="border-b border-[#EAE2D2] bg-[#FCFAF4] py-8 sm:py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <TricolorCapsule className="w-14 h-1.5" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#1E3799] font-bold">
              Authoritative Commission Register
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1918] tracking-tight">
            All-India State Recruitment Commissions Directory
          </h1>

          <p className="text-sm sm:text-base text-[#524E48] mt-2 max-w-3xl leading-relaxed">
            Direct access to official state public employment authorities, candidate helpdesks, and physical headquarters. Built to provide students, college placement cells, and career advisors with a spam-free index of verified government domains.
          </p>
        </div>
      </section>

      {/* Main Directory Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        <StateDirectoryView />

        {/* Reserved Ad Slot (0.00 CLS Protection) */}
        <ReservedAdSlot slotType="leaderboard" slotId="directory-page-bottom" className="print:hidden" />

        <SocialAlertBar />
      </main>

      <Footer />
    </div>
  );
}
