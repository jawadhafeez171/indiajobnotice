import React from "react";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { JobDetailView } from "@/components/jobs/JobDetailView";
import { getJobBySlug, getJobCanonicalPath, getActiveOpportunities } from "@/data/jobs";
import { getAllJobs } from "@/lib/jobs-store";
import { getGenuinelyRelatedOpportunities } from "@/lib/internal-links";
import { getStateBySlug } from "@/config/states";

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
  if (!job) return { title: "Job Notification Not Found" };

  const stateName = state ? state.name : resolvedParams.state.toUpperCase();
  const canonicalUrl = `https://www.indiajobnotice.com${getJobCanonicalPath(job)}`;

  return {
    title: `${job.shortTitle} 2026 (${stateName}): Notification PDF, ${job.totalVacancies.toLocaleString("en-IN")} Posts, Eligibility & Apply Link`,
    description: `Official ${job.organization} ${job.shortTitle} recruitment notification for ${stateName} candidates. ${job.totalVacancies.toLocaleString("en-IN")} vacancies. Download official PDF circular, verify crucial cut-off date, age limit, syllabus, and apply online.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${job.shortTitle} 2026 (${stateName}) Notification PDF`,
      description: `Official ${job.organization} gazette circular. ${job.totalVacancies.toLocaleString("en-IN")} vacancies. Application deadline: ${job.applicationEndDate || "Check Gazette"}.`,
      url: canonicalUrl,
      siteName: "India Job Notice",
      locale: "en_IN",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${job.shortTitle} (${stateName}) Notification PDF`,
      description: `Official notification for ${job.organization}. Vacancies: ${job.totalVacancies.toLocaleString("en-IN")}.`,
    },
  };
}

export default async function StateJobPage({ params }: Props) {
  const resolvedParams = await params;
  const job = getJobBySlug(await getAllJobs(), resolvedParams.slug);

  if (!job) {
    notFound();
  }

  // Enforce strict canonical hierarchy:
  // 1. Central jobs must live under /jobs/[slug]
  if (job.isCentral || !job.stateSlug || job.stateSlug.toLowerCase() === "central") {
    permanentRedirect(`/jobs/${job.slug}`);
  }

  // 2. Mismatched state slug must redirect to the correct state slug
  if (job.stateSlug.toLowerCase() !== resolvedParams.state.toLowerCase()) {
    permanentRedirect(`/state/${job.stateSlug.toLowerCase()}/jobs/${job.slug}`);
  }

  const allJobs = await getAllJobs();

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF4]">
      <Navbar currentStateSlug={resolvedParams.state} />
      <main className="flex-1">
        <JobDetailView
          job={job}
          stateSlug={resolvedParams.state}
          activeJobs={getActiveOpportunities(allJobs, job.id, job.category, job.stateSlug, 3)}
          related={getGenuinelyRelatedOpportunities(allJobs, job, 4)}
        />
      </main>
      <Footer />
    </div>
  );
}
