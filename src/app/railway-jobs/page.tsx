import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { CategoryHubView } from "@/components/category/CategoryHubView";
import { getSectorHubBySlug } from "@/data/permanent-categories";

export const metadata: Metadata = {
  title: "Railway Recruitment 2026 - RRB NTPC, Group D, ALP & JE Notifications | IndiaJobNotice.com",
  description: "Check all Railway RRB jobs in 2026. RRB NTPC (11,558 posts), Group D (1,03,769 posts), Assistant Loco Pilot (ALP 18,799 posts), and Junior Engineer with syllabus and application dates.",
  alternates: {
    canonical: "https://www.indiajobnotice.com/railway-jobs",
  },
  openGraph: {
    title: "Railway Government Jobs 2026 (RRB & RRC)",
    description: "Official Notifications & Exam Schedules Across 21 Railway Recruitment Boards.",
    url: "https://www.indiajobnotice.com/railway-jobs",
    siteName: "India Job Notice",
    locale: "en_IN",
    type: "website",
  },
};

export default function RailwayJobsPage() {
  const hub = getSectorHubBySlug("railway-jobs");

  if (!hub) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF4]">
      <Navbar currentStateSlug="central" />
      <main className="flex-1">
        <CategoryHubView hub={hub} parentCrumb={{ label: "Sectors", href: "/" }} />
      </main>
      <Footer />
    </div>
  );
}
