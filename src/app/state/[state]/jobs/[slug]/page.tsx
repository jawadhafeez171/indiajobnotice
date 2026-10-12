import React from "react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { JobDetailView } from "@/components/jobs/JobDetailView";
import { getJobBySlug } from "@/data/jobs";
import { getStateBySlug } from "@/config/states";

interface Props {
  params: Promise<{ state: string; slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const job = getJobBySlug(resolvedParams.slug);
  const state = getStateBySlug(resolvedParams.state);
  if (!job) return { title: "Job Notification Not Found" };

  return {
    title: `${job.title} - ${state ? `${state.name} ` : ""}Govt Jobs`,
    description: `Official ${job.organization} notification on ${resolvedParams.state}.indiajobnotice.com. Eligibility, dates, syllabus, and application link.`,
  };
}

export default async function StateJobPage({ params }: Props) {
  const resolvedParams = await params;
  const job = getJobBySlug(resolvedParams.slug);

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar currentStateSlug={resolvedParams.state} />
      <main className="flex-1">
        <JobDetailView job={job} stateSlug={resolvedParams.state} />
      </main>
      <Footer />
    </div>
  );
}
