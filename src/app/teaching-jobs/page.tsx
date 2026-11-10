import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { CategoryHubView } from "@/components/category/CategoryHubView";
import { getSectorHubBySlug } from "@/data/permanent-categories";
import { SITE_OG_IMAGES } from "@/lib/site-image";

export const metadata: Metadata = {
  title: "Government Teaching Jobs 2026 - CTET, KVS, DSSSB & State TET Vacancies",
  description: "Find Government Teaching Jobs in 2026. Central Teacher Eligibility Test (CTET), Kendriya Vidyalaya (KVS), Navodaya (NVS), DSSSB, and State PSC Lecturer circulars.",
  alternates: {
    canonical: "https://www.indiajobnotice.com/teaching-jobs",
  },
  openGraph: {
    images: SITE_OG_IMAGES,
    title: "Government Teaching Jobs 2026 - PRT, TGT, PGT Vacancies",
    description: "Verified Vacancies for PRT, TGT, PGT Teachers, Lecturers & Central School Educators.",
    url: "https://www.indiajobnotice.com/teaching-jobs",
    siteName: "India Job Notice",
    locale: "en_IN",
    type: "website",
  },
};

export default function TeachingJobsPage() {
  const hub = getSectorHubBySlug("teaching-jobs");

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
