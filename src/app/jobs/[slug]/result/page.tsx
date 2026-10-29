import React from "react";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { ResultView } from "@/components/jobs/ResultView";
import { getJobBySlug, getJobCanonicalPath } from "@/data/jobs";
import { getAllJobs } from "@/lib/jobs-store";

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
  if (!job) return { title: "Result Not Found | IndiaJobNotice.com" };

  const canonicalUrl = `https://www.indiajobnotice.com${getJobCanonicalPath(job)}/result`;

  return {
    title: `${job.shortTitle} Result 2026 - Download Merit List PDF & Category Cut-Off | IndiaJobNotice.com`,
    description: `Official ${job.shortTitle} exam result declared. Download selected candidates merit list PDF, check category-wise cut-off marks (UR, OBC, EWS, SC, ST), and scorecard login link.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${job.shortTitle} Result 2026 Declared`,
      description: `Official merit list PDF & category cut-off marks for ${job.organization}. Download selection list.`,
      url: canonicalUrl,
      siteName: "India Job Notice",
      locale: "en_IN",
      type: "article",
    },
  };
}

export default async function CentralJobResultPage({ params }: Props) {
  const resolvedParams = await params;
  const job = getJobBySlug(await getAllJobs(), resolvedParams.slug);

  if (!job) {
    notFound();
  }

  // Enforce strict canonical hierarchy: state jobs must live under /state/[state]/jobs/
  if (!job.isCentral && job.stateSlug && job.stateSlug.toLowerCase() !== "central") {
    permanentRedirect(`/state/${job.stateSlug.toLowerCase()}/jobs/${job.slug}/result`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF4]">
      <Navbar currentStateSlug="central" />
      <main className="flex-1">
        <ResultView job={job} stateSlug="central" />
      </main>
      <Footer />
    </div>
  );
}
