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
  title: `Police & Defense Govt Jobs ${YEAR} - Army, Navy, Air Force & Police Constables`,
  description: `All Police and Defense jobs ${YEAR}. SSC GD Constable, NDA, CDS, CAPF AC, UP Police Constable, and Indian Coast Guard notifications with PET/PST criteria and physical standards.`,
  alternates: {
    canonical: "https://www.indiajobnotice.com/police-defense-jobs",
  },
  openGraph: {
    images: SITE_OG_IMAGES,
    title: `Police & Defense Govt Jobs ${YEAR} - Army, Navy, Air Force & Police Constables`,
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
      <main id="main-content" className="flex-1">
        <CategoryHubView hub={hub} />
      </main>
      <Footer />
    </div>
  );
}
