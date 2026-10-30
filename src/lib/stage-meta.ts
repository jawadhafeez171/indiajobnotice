import type { Metadata } from "next";
import { JobNotification, getStages } from "@/data/jobs";

const LABEL = { admit_card: "Admit Card", answer_key: "Answer Key", result: "Result" } as const;

/** Metadata of a job's admit card / answer key / result page. Until the official document is out the
 * page says so and is kept out of search results (noindex), since it has nothing of its own yet. */
export function stageMetadata(
  job: JobNotification,
  kind: keyof typeof LABEL,
  canonicalUrl: string,
): Metadata {
  const label = LABEL[kind];
  const released = getStages(job, kind).length > 0;
  const title = released
    ? `${job.shortTitle} ${label} Out – Official Link`
    : `${job.shortTitle} ${label}: Not Released Yet`;
  const description = released
    ? `${job.organization} has released the ${label.toLowerCase()} for ${job.shortTitle}. Direct link to the official document.`
    : `${job.organization} has not released the ${label.toLowerCase()} for ${job.shortTitle} yet. It will be listed here with the official link when it is out.`;
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    robots: released ? undefined : { index: false, follow: true },
    openGraph: { title, description, url: canonicalUrl, siteName: "India Job Notice", locale: "en_IN", type: "article" },
  };
}
