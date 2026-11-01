import React from "react";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { AdmitCardView } from "@/components/jobs/AdmitCardView";
import { getJobBySlug, getJobCanonicalPath } from "@/data/jobs";
import { getAllJobs } from "@/lib/jobs-store";
import { stageMetadata } from "@/lib/stage-meta";

interface Props {
  params: Promise<{ state: string; slug: string }>;
}

// Built on first visit, then cached (not at deploy: ~1,750 job and district pages made every
// deployment ~0.9 GB and filled Vercel's storage).
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const job = getJobBySlug(await getAllJobs(), resolvedParams.slug);
  if (!job) return { title: "Admit Card Not Found" };

  const canonicalUrl = `https://www.indiajobnotice.com${getJobCanonicalPath(job)}/admit-card`;
  return stageMetadata(job, "admit_card", canonicalUrl);
}

export default async function StateJobAdmitCardPage({ params }: Props) {
  const resolvedParams = await params;
  const job = getJobBySlug(await getAllJobs(), resolvedParams.slug);

  if (!job) {
    notFound();
  }

  // Enforce strict canonical hierarchy:
  if (job.isCentral || !job.stateSlug || job.stateSlug.toLowerCase() === "central") {
    permanentRedirect(`/jobs/${job.slug}/admit-card`);
  }

  if (job.stateSlug.toLowerCase() !== resolvedParams.state.toLowerCase()) {
    permanentRedirect(`/state/${job.stateSlug.toLowerCase()}/jobs/${job.slug}/admit-card`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar currentStateSlug={resolvedParams.state} />
      <main className="flex-1">
        <AdmitCardView job={job} stateSlug={resolvedParams.state} />
      </main>
      <Footer />
    </div>
  );
}
