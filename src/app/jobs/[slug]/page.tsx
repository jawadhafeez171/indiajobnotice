import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { JobDetailView } from "@/components/jobs/JobDetailView";
import { getJobBySlug, SAMPLE_JOBS, isJobApplicationClosed } from "@/data/jobs";

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
  if (!job) return { title: "Job Notification Not Found | IndiaJobNotice.com" };

  const canonicalUrl = `https://www.indiajobnotice.com/jobs/${job.slug}`;

  return {
    title: `${job.title} 2026 Notification, Syllabus, Eligibility & Apply Online | IndiaJobNotice.com`,
    description: `Official ${job.organization} ${job.title} notification. ${job.totalVacancies ? `${job.totalVacancies.toLocaleString()} vacancies.` : ""} Check exam dates, syllabus pattern, eligibility, age limit, and official PDF download.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${job.title} - ${job.organization}`,
      description: `Official recruitment circular. Application deadline: ${job.applicationEndDate || "Check Gazette"}. Check eligibility & exam pattern.`,
      url: canonicalUrl,
      siteName: "India Job Notice",
      locale: "en_IN",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${job.title} Notification | IndiaJobNotice.com`,
      description: `Official ${job.organization} notification. Vacancies: ${job.totalVacancies ? job.totalVacancies.toLocaleString() : "Check PDF"}.`,
    },
  };
}

export default async function JobPage({ params }: Props) {
  const resolvedParams = await params;
  const job = getJobBySlug(resolvedParams.slug);

  if (!job) {
    notFound();
  }

  const isClosed = isJobApplicationClosed(job);

  // Google Search Structured Data (Complies with Expired JobPosting Guidelines)
  // When applications close, remove JobPosting markup so Google does not index expired listings in Jobs search.
  const jsonLd = !isClosed
    ? {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: job.title,
        description: job.syllabusSummary || `Official recruitment notification for ${job.title} by ${job.organization}.`,
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
            addressRegion: "National / India",
          },
        },
        directApply: true,
        url: `https://www.indiajobnotice.com/jobs/${job.slug}`,
      }
    : {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: `${job.title} (Archived Recruitment Notification)`,
        description: `Official archive for ${job.title} by ${job.organization}. Applications closed on ${job.applicationEndDate}. Master record of syllabus, exam pattern, eligibility and previous cut-offs.`,
        url: `https://www.indiajobnotice.com/jobs/${job.slug}`,
      };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF4]">
      {/* Schema.org JobPosting Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar currentStateSlug="central" />
      <main className="flex-1">
        <JobDetailView job={job} stateSlug="central" />
      </main>
      <Footer />
    </div>
  );
}
