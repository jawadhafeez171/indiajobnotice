import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { CategoryHubView } from "@/components/category/CategoryHubView";
import { getSectorHubBySlug } from "@/data/permanent-categories";

export const metadata: Metadata = {
  title: "Bank Jobs 2026 - SBI, IBPS PO, Clerk & RBI Grade B Recruitment",
  description: "Apply for Bank Jobs 2026. SBI PO, SBI Clerk, IBPS PO, IBPS Clerk, RRB Office Assistant, and RBI Grade B notifications with vacancy tables, syllabus, and exam dates.",
  alternates: {
    canonical: "https://www.indiajobnotice.com/banking-jobs",
  },
  openGraph: {
    title: "Banking & Insurance Government Jobs 2026",
    description: "Verified Recruitment Circulars for State Bank of India, Public Sector Banks & RBI.",
    url: "https://www.indiajobnotice.com/banking-jobs",
    siteName: "India Job Notice",
    locale: "en_IN",
    type: "website",
  },
};

export default function BankingJobsPage() {
  const hub = getSectorHubBySlug("banking-jobs");

  if (!hub) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F1ECE1]">
      <Navbar currentStateSlug="central" />
      <main className="flex-1">
        <CategoryHubView hub={hub} parentCrumb={{ label: "Sectors", href: "/" }} />
      </main>
      <Footer />
    </div>
  );
}
