import React from "react";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { EligibilityView } from "@/components/jobs/EligibilityView";
import { getJobBySlug, getJobAgeCutoffDate, getJobCanonicalPath } from "@/data/jobs";
import { getAllJobs } from "@/lib/jobs-store";
import { eligibilityTitle } from "@/lib/seo";
import { getCalculatorJobs, formatAgeRange } from "@/data/jobs";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

// Built on first visit, then cached (not at deploy: ~1,750 job and district pages made every
// deployment ~0.9 GB and filled Vercel's storage).
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const job = getJobBySlug(await getAllJobs(), resolvedParams.slug);
  if (!job) return { title: "Eligibility Details Not Found" };

  const canonicalUrl = `https://www.indiajobnotice.com${getJobCanonicalPath(job)}/eligibility`;
  const cutoffDate = getJobAgeCutoffDate(job);

  return {
    title: `${eligibilityTitle(job)}`,
    description: `${job.organization}: age limit ${formatAgeRange(job, "years")} as on ${formatDate(cutoffDate)}, educational qualification and category relaxation as stated in the official notification.`,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: job.ageKnown !== false && job.maxAge > 0 ? undefined : { index: false, follow: true },
    openGraph: {
      title: eligibilityTitle(job),
      description: `Official statutory eligibility, cut-off date, age relaxation, and educational qualifications for ${job.organization}.`,
      url: canonicalUrl,
      siteName: "India Job Notice",
      locale: "en_IN",
      type: "article",
    },
  };
}

export default async function CentralJobEligibilityPage({ params }: Props) {
  const resolvedParams = await params;
  const job = getJobBySlug(await getAllJobs(), resolvedParams.slug);

  if (!job) {
    notFound();
  }

  // Enforce strict canonical hierarchy: state jobs must live under /state/[state]/jobs/
  if (!job.isCentral && job.stateSlug && job.stateSlug.toLowerCase() !== "central") {
    permanentRedirect(`/state/${job.stateSlug.toLowerCase()}/jobs/${job.slug}/eligibility`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar currentStateSlug="central" />
      <main className="flex-1">
        <EligibilityView job={job} stateSlug="central" calculatorJobs={getCalculatorJobs(await getAllJobs())} />
      </main>
      <Footer />
    </div>
  );
}
