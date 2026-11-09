import { CARD_SIZE, jobCardImage } from "@/lib/job-card-image";

// The job page's preview picture (see src/lib/job-card-image.tsx)
export const alt = "Government job notification on India Job Notice";
export const size = CARD_SIZE;
export const contentType = "image/png";
export const revalidate = 86400; // daily: hourly rebuilds counted as ISR writes (9 Nov)

// made on first request, then stored (like the job pages; none at build time)
export async function generateStaticParams() {
  return [];
}

export default async function Image({ params }: { params: Promise<{ state: string; slug: string }> }) {
  const { slug } = await params;
  return jobCardImage(slug);
}
