import React from "react";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { JobDetailView } from "@/components/jobs/JobDetailView";
import { getJobCanonicalPath, getActiveOpportunities } from "@/data/jobs";
import { getJobPage } from "@/lib/jobs-store";
import { jobSeoTitle, jobSeoDescription } from "@/lib/seo";
import { getGenuinelyRelatedOpportunities, getSiblingNotices } from "@/lib/internal-links";

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
  const job = (await getJobPage(resolvedParams.slug)).job ?? undefined;
  if (!job) return { title: "Job Notification Not Found" };

  const canonicalUrl = `https://www.indiajobnotice.com${getJobCanonicalPath(job)}`;

  return {
    title: jobSeoTitle(job),
    description: jobSeoDescription(job),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: jobSeoTitle(job),
      description: jobSeoDescription(job), // the same facts as the search snippet (11 Nov: raw ISO dates here)
      url: canonicalUrl,
      siteName: "India Job Notice",
      locale: "en_IN",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: jobSeoTitle(job),
      description: jobSeoDescription(job), // was "Vacancies: 0" for notices without a count
    },
  };
}

export default async function StateJobPage({ params }: Props) {
  const resolvedParams = await params;
  const job = (await getJobPage(resolvedParams.slug)).job ?? undefined;

  if (!job) {
    notFound();
  }

  // Enforce strict canonical hierarchy:
  // 1. Central jobs must live under /jobs/[slug]
  if (job.isCentral || !job.stateSlug || job.stateSlug.toLowerCase() === "central") {
    permanentRedirect(`/jobs/${job.slug}`);
  }

  // 2. Mismatched state slug must redirect to the correct state slug
  if (job.stateSlug.toLowerCase() !== resolvedParams.state.toLowerCase()) {
    permanentRedirect(`/state/${job.stateSlug.toLowerCase()}/jobs/${job.slug}`);
  }

  const allJobs = (await getJobPage(resolvedParams.slug)).allJobs;

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar currentStateSlug={resolvedParams.state} compact />
      <main id="main-content" className="flex-1">
        <JobDetailView
          job={job}
          stateSlug={resolvedParams.state}
          activeJobs={getActiveOpportunities(allJobs, job.id, job.category, job.stateSlug, 3)}
          related={getGenuinelyRelatedOpportunities(allJobs, job, 4)}
          siblings={getSiblingNotices(allJobs, job)}
        />
      </main>
      <Footer />
    </div>
  );
}
