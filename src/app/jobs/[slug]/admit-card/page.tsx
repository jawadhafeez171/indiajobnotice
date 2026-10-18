import React from "react";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { AdmitCardView } from "@/components/jobs/AdmitCardView";
import { getJobBySlug, SAMPLE_JOBS, getJobCanonicalPath } from "@/data/jobs";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SAMPLE_JOBS.filter((j) => j.isCentral).map((job) => ({
    slug: job.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const job = getJobBySlug(resolvedParams.slug);
  if (!job) return { title: "Admit Card Not Found | IndiaJobNotice.com" };

  const canonicalUrl = `https://www.indiajobnotice.com${getJobCanonicalPath(job)}/admit-card`;

  return {
    title: `${job.shortTitle} Admit Card 2026 - Download Hall Ticket & Exam City Slip | IndiaJobNotice.com`,
    description: `Download official ${job.shortTitle} admit card, hall ticket and check exam city intimation slip. Direct login link, exam shift timings, and mandatory exam day document checklist.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${job.shortTitle} Admit Card 2026 Download`,
      description: `Official admit card & hall ticket link for ${job.organization}. Check exam dates & reporting timings.`,
      url: canonicalUrl,
      siteName: "India Job Notice",
      locale: "en_IN",
      type: "article",
    },
  };
}

export default async function CentralJobAdmitCardPage({ params }: Props) {
  const resolvedParams = await params;
  const job = getJobBySlug(resolvedParams.slug);

  if (!job) {
    notFound();
  }

  // Enforce strict canonical hierarchy: state jobs must live under /state/[state]/jobs/
  if (!job.isCentral && job.stateSlug && job.stateSlug.toLowerCase() !== "central") {
    permanentRedirect(`/state/${job.stateSlug.toLowerCase()}/jobs/${job.slug}/admit-card`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF4]">
      <Navbar currentStateSlug="central" />
      <main className="flex-1">
        <AdmitCardView job={job} stateSlug="central" />
      </main>
      <Footer />
    </div>
  );
}
