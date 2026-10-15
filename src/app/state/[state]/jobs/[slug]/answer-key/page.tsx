import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { AnswerKeyView } from "@/components/jobs/AnswerKeyView";
import { getJobBySlug, SAMPLE_JOBS } from "@/data/jobs";
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
  if (!job) return { title: "Answer Key Not Found | IndiaJobNotice.com" };

  const stateName = state ? state.name : resolvedParams.state.toUpperCase();
  const canonicalUrl = `https://www.indiajobnotice.com/state/${resolvedParams.state}/jobs/${job.slug}/answer-key`;

  return {
    title: `${job.shortTitle} Answer Key 2026 - ${stateName} Response Sheet & Objections | IndiaJobNotice.com`,
    description: `Official ${job.shortTitle} answer key and candidate response sheet for ${stateName}. Direct portal link, objection challenge fee, and marking scheme.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${job.shortTitle} Answer Key 2026 (${stateName})`,
      description: `Official provisional answer key link for ${job.organization} in ${stateName}. File objections.`,
      url: canonicalUrl,
      siteName: "India Job Notice",
      locale: "en_IN",
      type: "article",
    },
  };
}

export default async function StateJobAnswerKeyPage({ params }: Props) {
  const resolvedParams = await params;
  const job = getJobBySlug(resolvedParams.slug);

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF4]">
      <Navbar currentStateSlug={resolvedParams.state} />
      <main className="flex-1">
        <AnswerKeyView job={job} stateSlug={resolvedParams.state} />
      </main>
      <Footer />
    </div>
  );
}
