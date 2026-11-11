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
  title: `Government Engineering Jobs ${YEAR} - B.Tech, B.E. & Diploma Vacancies`,
  description: `Explore Government Engineering Jobs in ${YEAR}. Railway RRB JE, State PSC Assistant Engineers, PSUs (IOCL, NTPC, BHEL), Defense DRDO & ISRO notifications with branch eligibility and exam patterns.`,
  alternates: {
    canonical: "https://www.indiajobnotice.com/engineering-jobs",
  },
  openGraph: {
    images: SITE_OG_IMAGES,
    title: `Government Engineering Jobs ${YEAR} - B.Tech, B.E. & Diploma Vacancies`,
    description: `Explore Government Engineering Jobs in ${YEAR}. Railway RRB JE, State PSC Assistant Engineers, PSUs, Defense DRDO & ISRO notifications.`,
    url: "https://www.indiajobnotice.com/engineering-jobs",
    siteName: "India Job Notice",
    locale: "en_IN",
    type: "website",
  },
};

export default function EngineeringJobsPage() {
  const hub = getSectorHubBySlug("engineering-jobs");

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
