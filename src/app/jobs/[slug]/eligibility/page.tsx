import { notFound, permanentRedirect } from "next/navigation";
import { getJobCanonicalPath } from "@/data/jobs";
import { getJobPage } from "@/lib/jobs-store";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [];
}

// Age and eligibility are on the job page itself now ("Who can apply"): old links go there.
export default async function JobEligibilityPage({ params }: Props) {
  const { slug } = await params;
  const job = (await getJobPage(slug)).job ?? undefined;
  if (!job) notFound();
  permanentRedirect(`${getJobCanonicalPath(job)}#eligibility`);
}
