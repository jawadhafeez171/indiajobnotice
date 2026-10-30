import React from "react";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { AnswerKeyView } from "@/components/jobs/AnswerKeyView";
import { getJobBySlug, getJobCanonicalPath } from "@/data/jobs";
import { getAllJobs } from "@/lib/jobs-store";
import { stageMetadata } from "@/lib/stage-meta";

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
  if (!job) return { title: "Answer Key Not Found" };

  const canonicalUrl = `https://www.indiajobnotice.com${getJobCanonicalPath(job)}/answer-key`;
  return stageMetadata(job, "answer_key", canonicalUrl);
}

export default async function CentralJobAnswerKeyPage({ params }: Props) {
  const resolvedParams = await params;
  const job = getJobBySlug(await getAllJobs(), resolvedParams.slug);

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
