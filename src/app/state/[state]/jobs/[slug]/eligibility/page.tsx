import React from "react";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { EligibilityView } from "@/components/jobs/EligibilityView";
import { getJobBySlug, getJobAgeCutoffDate, getJobCanonicalPath } from "@/data/jobs";
import { getAllJobs } from "@/lib/jobs-store";
import { getCalculatorJobs, formatAgeRange } from "@/data/jobs";
import { getStateBySlug } from "@/config/states";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ state: string; slug: string }>;
}

export async function generateStaticParams() {
  return (await getAllJobs()).filter((j) => !j.isCentral && j.stateSlug).map((job) => ({
    state: job.stateSlug as string,
    slug: job.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const job = getJobBySlug(await getAllJobs(), resolvedParams.slug);
  const state = getStateBySlug(resolvedParams.state);
  if (!job) return { title: "Eligibility Details Not Found" };

  const stateName = state ? state.name : resolvedParams.state.toUpperCase();
  const canonicalUrl = `https://www.indiajobnotice.com${getJobCanonicalPath(job)}/eligibility`;
  const cutoffDate = getJobAgeCutoffDate(job);

  return {
    title: `${job.shortTitle} 2026 (${stateName}) Age Limit, Cut-off Date & Qualification`,
    description: `Official statutory eligibility criteria for ${job.shortTitle} (${stateName}). Age limit: ${formatAgeRange(job, "years")} on cut-off date (${formatDate(cutoffDate)}). Category relaxation (OBC, SC/ST, domicile) and educational degree requirements.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${job.shortTitle} (${stateName}) Age Limit & Qualification 2026`,
      description: `Official statutory eligibility, cut-off date, age relaxation, and educational qualifications for ${job.organization}.`,
      url: canonicalUrl,
      siteName: "India Job Notice",
      locale: "en_IN",
      type: "article",
    },
  };
}

export default async function StateJobEligibilityPage({ params }: Props) {
  const resolvedParams = await params;
  const job = getJobBySlug(await getAllJobs(), resolvedParams.slug);

  if (!job) {
    notFound();
  }

  // Enforce strict canonical hierarchy:
  if (job.isCentral || !job.stateSlug || job.stateSlug.toLowerCase() === "central") {
    permanentRedirect(`/jobs/${job.slug}/eligibility`);
  }

  if (job.stateSlug.toLowerCase() !== resolvedParams.state.toLowerCase()) {
    permanentRedirect(`/state/${job.stateSlug.toLowerCase()}/jobs/${job.slug}/eligibility`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F1ECE1]">
      <Navbar currentStateSlug={resolvedParams.state} />
      <main className="flex-1">
        <EligibilityView job={job} stateSlug={resolvedParams.state} calculatorJobs={getCalculatorJobs(await getAllJobs())} />
      </main>
      <Footer />
    </div>
  );
}
