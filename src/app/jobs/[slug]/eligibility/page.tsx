import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { EligibilityView } from "@/components/jobs/EligibilityView";
import { getJobBySlug, SAMPLE_JOBS, getJobAgeCutoffDate } from "@/data/jobs";
import { formatDate } from "@/lib/utils";

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
  if (!job) return { title: "Eligibility Details Not Found | IndiaJobNotice.com" };

  const canonicalUrl = `https://www.indiajobnotice.com/jobs/${job.slug}/eligibility`;
  const cutoffDate = getJobAgeCutoffDate(job);

  return {
    title: `${job.shortTitle} 2026 Age Limit, Cut-off Date & Qualification | IndiaJobNotice.com`,
    description: `Complete eligibility criteria for ${job.shortTitle}. Age limit: ${job.minAge} to ${job.maxAge} years on crucial cut-off date (${formatDate(cutoffDate)}). Category relaxation (OBC +3y, SC/ST +5y) and educational degree requirements.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${job.shortTitle} Age Limit and Qualification 2026`,
      description: `Official statutory eligibility, cut-off date, age relaxation, and educational qualifications for ${job.organization}.`,
      url: canonicalUrl,
      siteName: "India Job Notice",
      locale: "en_IN",
      type: "article",
    },
  };
}

export default async function CentralJobEligibilityPage({ params }: Props) {
  const resolvedParams = await params;
  const job = getJobBySlug(resolvedParams.slug);

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF4]">
      <Navbar currentStateSlug="central" />
      <main className="flex-1">
        <EligibilityView job={job} stateSlug="central" />
      </main>
      <Footer />
    </div>
  );
}
