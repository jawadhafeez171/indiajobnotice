import { notFound, permanentRedirect } from "next/navigation";
import { getJobBySlug, getJobCanonicalPath } from "@/data/jobs";
import { getAllJobs } from "@/lib/jobs-store";

interface Props {
  params: Promise<{ state: string; slug: string }>;
}

export async function generateStaticParams() {
  return [];
}

// Age and eligibility are on the job page itself now ("Who can apply"): old links go there.
export default async function StateJobEligibilityPage({ params }: Props) {
  const { slug } = await params;
  const job = getJobBySlug(await getAllJobs(), slug);
  if (!job) notFound();
  permanentRedirect(`${getJobCanonicalPath(job)}#eligibility`);
}
