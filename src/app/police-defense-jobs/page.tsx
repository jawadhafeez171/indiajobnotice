import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { CategoryHubView } from "@/components/category/CategoryHubView";
import { getSectorHubBySlug } from "@/data/permanent-categories";

export const metadata: Metadata = {
  title: "Police & Defense Govt Jobs 2026 - Army, Navy, Air Force & Police Constables",
  description: "All Police and Defense jobs 2026. SSC GD Constable, NDA, CDS, CAPF AC, UP Police Constable, and Indian Coast Guard notifications with PET/PST criteria and physical standards.",
  alternates: {
    canonical: "https://www.indiajobnotice.com/police-defense-jobs",
  },
  openGraph: {
    title: "Police & Defense Govt Jobs 2026 - Army, Navy, Air Force & Police Constables",
    description: "Official Circulars for Central Armed Police Forces (CAPF), Defense Services & State Police.",
    url: "https://www.indiajobnotice.com/police-defense-jobs",
    siteName: "India Job Notice",
    locale: "en_IN",
    type: "website",
  },
};

export default function PoliceDefenseJobsPage() {
  const hub = getSectorHubBySlug("police-defense-jobs");

  if (!hub) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar currentStateSlug="central" />
      <main className="flex-1">
        <CategoryHubView hub={hub} parentCrumb={{ label: "Sectors", href: "/" }} />
      </main>
      <Footer />
    </div>
  );
}
