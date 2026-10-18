import React from "react";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { JobDetailView } from "@/components/jobs/JobDetailView";
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
  if (!job) return { title: "Job Notification Not Found | IndiaJobNotice.com" };

  const canonicalUrl = `https://www.indiajobnotice.com${getJobCanonicalPath(job)}`;

  return {
    title: `${job.shortTitle} 2026 Notification PDF: ${job.totalVacancies.toLocaleString("en-IN")} Vacancies, Eligibility, Last Date & Apply Link | IndiaJobNotice.com`,
    description: `Official ${job.organization} ${job.shortTitle} recruitment notification. ${job.totalVacancies.toLocaleString("en-IN")} vacancies announced. Check official PDF circular, crucial cut-off date, age limit, syllabus, and online application portal.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${job.shortTitle} 2026 Notification PDF - ${job.organization}`,
      description: `Official recruitment circular. ${job.totalVacancies.toLocaleString("en-IN")} vacancies. Application deadline: ${job.applicationEndDate || "Check Gazette"}.`,
      url: canonicalUrl,
      siteName: "India Job Notice",
      locale: "en_IN",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${job.shortTitle} 2026 Notification PDF | IndiaJobNotice.com`,
      description: `Official ${job.organization} notification. Vacancies: ${job.totalVacancies.toLocaleString("en-IN")}.`,
    },
  };
}

export default async function JobPage({ params }: Props) {
  const resolvedParams = await params;
  const job = getJobBySlug(resolvedParams.slug);

  if (!job) {
    notFound();
  }

  // Enforce strict canonical hierarchy: state jobs must live under /state/[state]/jobs/
  if (!job.isCentral && job.stateSlug && job.stateSlug.toLowerCase() !== "central") {
    permanentRedirect(`/state/${job.stateSlug.toLowerCase()}/jobs/${job.slug}`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF4]">
      <Navbar currentStateSlug="central" />
      <main className="flex-1">
        <JobDetailView job={job} stateSlug="central" />
      </main>
      <Footer />
    </div>
  );
}
