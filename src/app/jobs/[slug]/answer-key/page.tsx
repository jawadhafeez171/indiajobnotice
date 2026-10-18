import React from "react";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { AnswerKeyView } from "@/components/jobs/AnswerKeyView";
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
  if (!job) return { title: "Answer Key Not Found | IndiaJobNotice.com" };

  const canonicalUrl = `https://www.indiajobnotice.com${getJobCanonicalPath(job)}/answer-key`;

  return {
    title: `${job.shortTitle} Answer Key 2026 - Download Response Sheet & File Objections | IndiaJobNotice.com`,
    description: `Official ${job.shortTitle} provisional answer key and candidate response sheet download. Check official objection submission window, fee per challenge, and question paper PDF.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${job.shortTitle} Answer Key 2026 Download`,
      description: `Official provisional answer key & response sheet for ${job.organization}. Check challenge dates.`,
      url: canonicalUrl,
      siteName: "India Job Notice",
      locale: "en_IN",
      type: "article",
    },
  };
}

export default async function CentralJobAnswerKeyPage({ params }: Props) {
  const resolvedParams = await params;
  const job = getJobBySlug(resolvedParams.slug);

  if (!job) {
    notFound();
  }

  // Enforce strict canonical hierarchy: state jobs must live under /state/[state]/jobs/
  if (!job.isCentral && job.stateSlug && job.stateSlug.toLowerCase() !== "central") {
    permanentRedirect(`/state/${job.stateSlug.toLowerCase()}/jobs/${job.slug}/answer-key`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF4]">
      <Navbar currentStateSlug="central" />
      <main className="flex-1">
        <AnswerKeyView job={job} stateSlug="central" />
      </main>
      <Footer />
    </div>
  );
}
