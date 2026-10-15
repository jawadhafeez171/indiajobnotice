import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { ResultView } from "@/components/jobs/ResultView";
import { getJobBySlug, SAMPLE_JOBS } from "@/data/jobs";

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
  if (!job) return { title: "Result Not Found | IndiaJobNotice.com" };

  const canonicalUrl = `https://www.indiajobnotice.com/jobs/${job.slug}/result`;

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
  const job = getJobBySlug(resolvedParams.slug);

  if (!job) {
    notFound();
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
