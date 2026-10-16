import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { SearchConsoleAuditDashboard } from "@/components/seo/SearchConsoleAuditDashboard";
import { TricolorCapsule } from "@/components/common/BrandLogo";

export const metadata: Metadata = {
  title: "Search Console Weekly Diagnostic & Audit Center | IndiaJobNotice.com",
  description: "Weekly Google Search Console monitoring and improvement system: low CTR queries, striking distance positions 8-20, crawl access, intent cannibalization, and structured data validation.",
  alternates: {
    canonical: "https://www.indiajobnotice.com/seo-audit",
  },
  robots: {
    index: false, // Internal diagnostic center, noindex to keep index clean
    follow: true,
  },
};

export default function SeoAuditPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF4]">
      <Navbar currentStateSlug="central" />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        <SearchConsoleAuditDashboard />
      </main>

      <Footer />
    </div>
  );
}
