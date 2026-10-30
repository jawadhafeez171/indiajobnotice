import React from "react";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { ResultView } from "@/components/jobs/ResultView";
import { getJobBySlug, getJobCanonicalPath } from "@/data/jobs";
import { getAllJobs } from "@/lib/jobs-store";
import { stageMetadata } from "@/lib/stage-meta";

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
  if (!job) return { title: "Result Not Found" };

  const canonicalUrl = `https://www.indiajobnotice.com${getJobCanonicalPath(job)}/result`;
  return stageMetadata(job, "result", canonicalUrl);
}

export default async function StateJobResultPage({ params }: Props) {
  const resolvedParams = await params;
  const job = getJobBySlug(await getAllJobs(), resolvedParams.slug);

  if (!job) {
    notFound();
  }

  // Enforce strict canonical hierarchy:
  if (job.isCentral || !job.stateSlug || job.stateSlug.toLowerCase() === "central") {
    permanentRedirect(`/jobs/${job.slug}/result`);
  }

  if (job.stateSlug.toLowerCase() !== resolvedParams.state.toLowerCase()) {
    permanentRedirect(`/state/${job.stateSlug.toLowerCase()}/jobs/${job.slug}/result`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF4]">
      <Navbar currentStateSlug={resolvedParams.state} />
      <main className="flex-1">
        <ResultView job={job} stateSlug={resolvedParams.state} />
      </main>
      <Footer />
    </div>
  );
}
