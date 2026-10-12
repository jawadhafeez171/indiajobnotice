import React from "react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { JobDetailView } from "@/components/jobs/JobDetailView";
import { getJobBySlug } from "@/data/jobs";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const job = getJobBySlug(resolvedParams.slug);
  if (!job) return { title: "Job Notification Not Found" };

  return {
    title: `${job.title} - IndiaJobNotice.com`,
    description: `Official recruitment circular for ${job.organization}. Apply online, syllabus, age limit, and official PDF download.`,
  };
}

export default async function JobPage({ params }: Props) {
  const resolvedParams = await params;
  const job = getJobBySlug(resolvedParams.slug);

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar currentStateSlug={job.stateSlug} />
      <main className="flex-1">
        <JobDetailView job={job} stateSlug={job.stateSlug} />
      </main>
      <Footer />
    </div>
  );
}
