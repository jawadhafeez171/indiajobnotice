import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { CategoryHubView } from "@/components/category/CategoryHubView";
import { getSectorHubBySlug } from "@/data/permanent-categories";
import { SITE_OG_IMAGES } from "@/lib/site-image";

// From the hub's settings (11 Nov): the old text promised syllabus, exam patterns and post counts the page does not show
const HUB = getSectorHubBySlug("banking-jobs")!;
export const metadata: Metadata = {
  title: HUB.title,
  description: HUB.metaDescription,
  alternates: {
    canonical: `https://www.indiajobnotice.com${HUB.canonicalPath}`,
  },
  openGraph: {
    images: SITE_OG_IMAGES,
    title: HUB.h1,
    description: HUB.metaDescription,
    url: `https://www.indiajobnotice.com${HUB.canonicalPath}`,
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
