import React from "react";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { AdmitCardView } from "@/components/jobs/AdmitCardView";
import { getJobBySlug, getJobCanonicalPath } from "@/data/jobs";
import { getAllJobs } from "@/lib/jobs-store";
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
  if (!job) return { title: "Admit Card Not Found | IndiaJobNotice.com" };

  const stateName = state ? state.name : resolvedParams.state.toUpperCase();
  const canonicalUrl = `https://www.indiajobnotice.com${getJobCanonicalPath(job)}/admit-card`;

  return {
    title: `${job.shortTitle} Admit Card 2026 - ${stateName} Hall Ticket Download | IndiaJobNotice.com`,
    description: `Download official ${job.shortTitle} admit card and hall ticket for ${stateName} government recruitment. Direct link, exam dates, shift timings, and reporting guidelines.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${job.shortTitle} Admit Card 2026 (${stateName})`,
      description: `Official admit card link for ${job.organization} in ${stateName}. Download hall ticket.`,
      url: canonicalUrl,
      siteName: "India Job Notice",
      locale: "en_IN",
      type: "article",
    },
  };
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
    <div className="min-h-screen flex flex-col bg-[#FCFAF4]">
      <Navbar currentStateSlug={resolvedParams.state} />
      <main className="flex-1">
        <AdmitCardView job={job} stateSlug={resolvedParams.state} />
      </main>
      <Footer />
    </div>
  );
}
