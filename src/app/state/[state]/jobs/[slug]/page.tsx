import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { JobDetailView } from "@/components/jobs/JobDetailView";
import { getJobBySlug, SAMPLE_JOBS, isJobApplicationClosed } from "@/data/jobs";
import { getStateBySlug } from "@/config/states";

interface Props {
  params: Promise<{ state: string; slug: string }>;
}

export async function generateStaticParams() {
  return SAMPLE_JOBS.filter((j) => !j.isCentral && j.stateSlug).map((job) => ({
    state: job.stateSlug as string,
    slug: job.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const job = getJobBySlug(resolvedParams.slug);
  const state = getStateBySlug(resolvedParams.state);
  if (!job) return { title: "Job Notification Not Found | IndiaJobNotice.com" };

  const stateName = state ? state.name : resolvedParams.state.toUpperCase();
  const canonicalUrl = `https://www.indiajobnotice.com/state/${resolvedParams.state}/jobs/${job.slug}`;

  return {
    title: `${job.shortTitle} 2026 (${stateName}): Notification PDF, ${job.totalVacancies.toLocaleString("en-IN")} Posts, Eligibility & Apply Link | IndiaJobNotice.com`,
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
      title: `${job.shortTitle} (${stateName}) Notification PDF | IndiaJobNotice.com`,
      description: `Official notification for ${job.organization}. Vacancies: ${job.totalVacancies.toLocaleString("en-IN")}.`,
    },
  };
}

export default async function StateJobPage({ params }: Props) {
  const resolvedParams = await params;
  const job = getJobBySlug(resolvedParams.slug);

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF4]">
      <Navbar currentStateSlug={resolvedParams.state} />
      <main className="flex-1">
        <JobDetailView job={job} stateSlug={resolvedParams.state} />
      </main>
      <Footer />
    </div>
  );
}
