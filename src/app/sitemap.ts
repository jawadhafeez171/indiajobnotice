import { MetadataRoute } from "next";
import { STATES_REGISTRY } from "@/config/states";
import { DISTRICTS_REGISTRY } from "@/config/districts";
import { getJobCanonicalPath, getStages, istDate, JobNotification, StageKind, todayIST } from "@/data/jobs";
import { getAllJobs } from "@/lib/jobs-store";

import { 
  QUALIFICATION_HUBS, 
  SECTOR_HUBS, 
  ORGANISATION_HUBS 
} from "@/data/permanent-categories";
import { VERIFIED_STATE_QUAL_HUBS } from "@/data/state-qualification-hubs";

// Route handlers are cached at build time; refresh hourly so newly published jobs are listed.
export const revalidate = 86400; // daily: hourly rebuilds counted as ISR writes (9 Nov)

/** The latest of these days (YYYY-MM-DD), never one still ahead; "" when none is known. */
function latestDay(days: (string | undefined)[], today: string): string {
  return days.reduce<string>((best, d) => {
    const day = d ? d.slice(0, 10) : "";
    return /^\d{4}-\d{2}-\d{2}$/.test(day) && day <= today && day > best ? day : best;
  }, "");
}

/** lastVerifiedDate is written out ("November 6, 2026"), which istDate does not read. */
function verifiedDay(text?: string): string {
  const t = Date.parse(text || "");
  return Number.isNaN(t) ? "" : new Date(t + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
}

/** Spread into a sitemap entry: lastmod only when the day is known. A date on every page, changing or
 * not, teaches Google to ignore them. */
const lastmod = (day: string) => (day ? { lastModified: day } : {});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await getAllJobs();
  const baseUrl = "https://www.indiajobnotice.com";
  const today = todayIST();

  // The day a job's page last really changed: published, corrected, or a new document added
  const jobDay = (job: JobNotification) =>
    latestDay(
      [
        istDate(job.publishedAt),
        verifiedDay(job.lastVerifiedDate),
        ...(job.stages || []).map((s) => s.date),
      ],
      today,
    );
  const siteDay = latestDay(jobs.map(jobDay), today);
  const stateDay = (slug: string) => latestDay(jobs.filter((j) => j.stateSlug === slug).map(jobDay), today);

  // Core static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      ...lastmod(siteDay),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/calendar`,
      ...lastmod(siteDay),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/exam-dates`,
      ...lastmod(siteDay),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/calculator`,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/vacancies`,
      ...lastmod(siteDay),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/directory`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/for-colleges-libraries`,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/editorial-policy`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Permanent Sector Hubs (/engineering-jobs, /police-defense-jobs, etc.)
  const sectorRoutes: MetadataRoute.Sitemap = SECTOR_HUBS.map((hub) => ({
    url: `${baseUrl}${hub.canonicalPath}`,
    changeFrequency: "daily",
    priority: 0.88,
  }));

  // Permanent Qualification Hubs (/qualification/12th-pass, /qualification/diploma, etc.)
  const qualificationRoutes: MetadataRoute.Sitemap = QUALIFICATION_HUBS.map((hub) => ({
    url: `${baseUrl}${hub.canonicalPath}`,
    changeFrequency: "daily",
    priority: 0.88,
  }));

  // Permanent Organisation Hubs (/organisations/ssc, /organisations/upsc, etc.)
  const organisationRoutes: MetadataRoute.Sitemap = ORGANISATION_HUBS.map((hub) => ({
    url: `${baseUrl}${hub.canonicalPath}`,
    changeFrequency: "daily",
    priority: 0.88,
  }));

  // Curated State + Qualification Hubs (/government-jobs/karnataka/12th-pass, etc.)
  const stateQualificationRoutes: MetadataRoute.Sitemap = VERIFIED_STATE_QUAL_HUBS.map((hub) => ({
    url: `${baseUrl}/government-jobs/${hub.stateSlug}/${hub.qualSlug}`,
    changeFrequency: "daily",
    priority: 0.86,
  }));

  // 36 State Directory Hubs (/state/[state])
  const stateRoutes: MetadataRoute.Sitemap = STATES_REGISTRY.map((state) => ({
    url: `${baseUrl}/state/${state.slug}`,
    ...lastmod(stateDay(state.slug)),
    changeFrequency: "daily",
    priority: 0.85,
  }));

  // 36 Permanent Government Jobs Hubs (/government-jobs/[state])
  const governmentJobsRoutes: MetadataRoute.Sitemap = STATES_REGISTRY.map((state) => ({
    url: `${baseUrl}/government-jobs/${state.slug}`,
    ...lastmod(stateDay(state.slug)),
    changeFrequency: "daily",
    priority: 0.85,
  }));

  // Dedicated District Hub Routes (/state/[state]/district/[district])
  const districtRoutes: MetadataRoute.Sitemap = DISTRICTS_REGISTRY.map((district) => ({
    url: `${baseUrl}/state/${district.stateSlug}/district/${district.slug}`,
    changeFrequency: "daily",
    priority: district.isMajorHub ? 0.82 : 0.75,
  }));

  // Central and State Job detail pages
  const jobRoutes: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${baseUrl}${getJobCanonicalPath(job)}`,
    ...lastmod(jobDay(job)),
    changeFrequency: "weekly",
    priority: job.featured ? 0.9 : 0.75,
  }));

  // Stage pages (admit card, answer key, result); eligibility is part of the job page itself
  const lifecycleRoutes: MetadataRoute.Sitemap = jobs.flatMap((job) => {
    const base = `${baseUrl}${getJobCanonicalPath(job)}`;

    return [
      // stage pages only once the official document is out (until then they are noindex)
      ...(["admit-card", "answer-key", "result"] as const)
        .filter((path) => getStages(job, path.replace("-", "_") as StageKind).length > 0)
        .map((path) => ({
          url: `${base}/${path}`,
          ...lastmod(latestDay([...getStages(job, path.replace("-", "_") as StageKind).map((s) => s.date), istDate(job.publishedAt)], today)),
          changeFrequency: "weekly" as const, priority: 0.7 })),
    ];
  });

  return [
    ...staticRoutes,
    ...sectorRoutes,
    ...qualificationRoutes,
    ...organisationRoutes,
    ...stateQualificationRoutes,
    ...stateRoutes,
    ...districtRoutes,
    ...governmentJobsRoutes,
    ...jobRoutes,
    ...lifecycleRoutes,
  ];
}
