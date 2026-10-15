import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { JobDetailView } from "@/components/jobs/JobDetailView";
import { getJobBySlug, SAMPLE_JOBS, isJobApplicationClosed } from "@/data/jobs";
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
  if (!job) return { title: "Job Notification Not Found | IndiaJobNotice.com" };

  const stateName = state ? state.name : resolvedParams.state.toUpperCase();
  const canonicalUrl = `https://www.indiajobnotice.com/state/${resolvedParams.state}/jobs/${job.slug}`;

  return {
    title: `${job.title} 2026 Notification - ${stateName} Govt Jobs | IndiaJobNotice.com`,
    description: `Official ${job.organization} ${job.title} recruitment notification for ${stateName}. ${job.totalVacancies ? `${job.totalVacancies.toLocaleString()} vacancies.` : ""} Check syllabus, eligibility, age limit, and official PDF link.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${job.title} - ${stateName} Govt Recruitment`,
      description: `Official ${job.organization} gazette circular. Application deadline: ${job.applicationEndDate || "Check Gazette"}.`,
      url: canonicalUrl,
      siteName: "India Job Notice",
      locale: "en_IN",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${job.title} (${stateName}) | IndiaJobNotice.com`,
      description: `Official notification for ${job.organization}. Check eligibility & exam pattern.`,
    },
  };
}

export default async function StateJobPage({ params }: Props) {
  const resolvedParams = await params;
  const job = getJobBySlug(resolvedParams.slug);
  const state = getStateBySlug(resolvedParams.state);

  if (!job) {
    notFound();
  }

  const stateName = state ? state.name : "State";

  const isClosed = isJobApplicationClosed(job);

  // Google Search Structured Data (Complies with Expired JobPosting Guidelines)
  // When applications close, remove JobPosting markup so Google does not index expired listings in Jobs search.
  const jsonLd = !isClosed
    ? {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: job.title,
        description: job.syllabusSummary || `Official recruitment notification for ${job.title} by ${job.organization} in ${stateName}.`,
        datePosted: job.applicationStartDate ? new Date(job.applicationStartDate).toISOString() : new Date().toISOString(),
        validThrough: job.applicationEndDate ? new Date(job.applicationEndDate).toISOString() : undefined,
        employmentType: "FULL_TIME",
        hiringOrganization: {
          "@type": "Organization",
          name: job.organization,
          sameAs: job.applyOnlineUrl || job.officialPdfUrl,
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressCountry: "IN",
            addressRegion: stateName,
          },
        },
        directApply: true,
        url: `https://www.indiajobnotice.com/state/${resolvedParams.state}/jobs/${job.slug}`,
      }
    : {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: `${job.title} (Archived ${stateName} Recruitment)`,
        description: `Official archive for ${job.title} by ${job.organization} in ${stateName}. Applications closed on ${job.applicationEndDate}. Master record of syllabus, exam pattern, eligibility and previous cut-offs.`,
        url: `https://www.indiajobnotice.com/state/${resolvedParams.state}/jobs/${job.slug}`,
      };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF4]">
      {/* Schema.org JobPosting Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar currentStateSlug={resolvedParams.state} />
      <main className="flex-1">
        <JobDetailView job={job} stateSlug={resolvedParams.state} />
      </main>
      <Footer />
    </div>
  );
}
