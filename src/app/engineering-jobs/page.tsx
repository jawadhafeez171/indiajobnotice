import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { CategoryHubView } from "@/components/category/CategoryHubView";
import { getSectorHubBySlug } from "@/data/permanent-categories";

export const metadata: Metadata = {
  title: "Government Engineering Jobs 2026 - B.Tech, B.E. & Diploma Vacancies",
  description: "Explore Government Engineering Jobs in 2026. Railway RRB JE, State PSC Assistant Engineers, PSUs (IOCL, NTPC, BHEL), Defense DRDO & ISRO notifications with branch eligibility and exam patterns.",
  alternates: {
    canonical: "https://www.indiajobnotice.com/engineering-jobs",
  },
  openGraph: {
    title: "Government Engineering Jobs 2026 - B.Tech, B.E. & Diploma Vacancies",
    description: "Explore Government Engineering Jobs in 2026. Railway RRB JE, State PSC Assistant Engineers, PSUs, Defense DRDO & ISRO notifications.",
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
    <div className="min-h-screen flex flex-col bg-[#FCFAF4]">
      <Navbar currentStateSlug="central" />
      <main className="flex-1">
        <CategoryHubView hub={hub} parentCrumb={{ label: "Sectors", href: "/" }} />
      </main>
      <Footer />
    </div>
  );
}
