import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { CategoryHubView } from "@/components/category/CategoryHubView";
import { getSectorHubBySlug } from "@/data/permanent-categories";
import { SITE_OG_IMAGES } from "@/lib/site-image";
import { YEAR } from "@/lib/year";

export const metadata: Metadata = {
  title: `Bank Jobs ${YEAR} - SBI, IBPS PO, Clerk & RBI Grade B Recruitment`,
  description: `Apply for Bank Jobs ${YEAR}. SBI PO, SBI Clerk, IBPS PO, IBPS Clerk, RRB Office Assistant, and RBI Grade B notifications with vacancy tables, syllabus, and exam dates.`,
  alternates: {
    canonical: "https://www.indiajobnotice.com/banking-jobs",
  },
  openGraph: {
    images: SITE_OG_IMAGES,
    title: `Banking & Insurance Government Jobs ${YEAR}`,
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
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar currentStateSlug="central" />
      <main id="main-content" className="flex-1">
        <CategoryHubView hub={hub} />
      </main>
      <Footer />
    </div>
  );
}
