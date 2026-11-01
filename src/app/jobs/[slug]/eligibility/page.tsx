import React from "react";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { EligibilityView } from "@/components/jobs/EligibilityView";
import { getJobBySlug, getJobAgeCutoffDate, getJobCanonicalPath } from "@/data/jobs";
import { getAllJobs } from "@/lib/jobs-store";
import { getCalculatorJobs, formatAgeRange } from "@/data/jobs";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return (await getAllJobs()).filter((j) => j.isCentral).map((job) => ({
    slug: job.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const job = getJobBySlug(await getAllJobs(), resolvedParams.slug);
  if (!job) return { title: "Eligibility Details Not Found" };

  const canonicalUrl = `https://www.indiajobnotice.com${getJobCanonicalPath(job)}/eligibility`;
  const cutoffDate = getJobAgeCutoffDate(job);

  return {
    title: `${job.shortTitle} 2026 Age Limit, Cut-off Date & Qualification`,
    description: `Complete eligibility criteria for ${job.shortTitle}. Age limit: ${formatAgeRange(job, "years")} on crucial cut-off date (${formatDate(cutoffDate)}). Category relaxation (OBC +3y, SC/ST +5y) and educational degree requirements.`,
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
  const job = getJobBySlug(await getAllJobs(), resolvedParams.slug);

  if (!job) {
    notFound();
  }

  // Enforce strict canonical hierarchy: state jobs must live under /state/[state]/jobs/
  if (!job.isCentral && job.stateSlug && job.stateSlug.toLowerCase() !== "central") {
    permanentRedirect(`/state/${job.stateSlug.toLowerCase()}/jobs/${job.slug}/eligibility`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar currentStateSlug="central" />
      <main className="flex-1">
        <EligibilityView job={job} stateSlug="central" calculatorJobs={getCalculatorJobs(await getAllJobs())} />
      </main>
      <Footer />
    </div>
  );
}
