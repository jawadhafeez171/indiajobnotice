import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { CategoryHubView } from "@/components/category/CategoryHubView";
import { getSectorHubBySlug } from "@/data/permanent-categories";

export const metadata: Metadata = {
  title: "Government Teaching Jobs 2026 - CTET, KVS, DSSSB & State TET Vacancies",
  description: "Find Government Teaching Jobs in 2026. Central Teacher Eligibility Test (CTET), Kendriya Vidyalaya (KVS), Navodaya (NVS), DSSSB, and State PSC Lecturer circulars.",
  alternates: {
    canonical: "https://www.indiajobnotice.com/teaching-jobs",
  },
  openGraph: {
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
    <div className="min-h-screen flex flex-col bg-[#F1ECE1]">
      <Navbar currentStateSlug="central" />
      <main className="flex-1">
        <CategoryHubView hub={hub} parentCrumb={{ label: "Sectors", href: "/" }} />
      </main>
      <Footer />
    </div>
  );
}
