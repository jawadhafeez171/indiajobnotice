import { MetadataRoute } from "next";
import { STATES_REGISTRY } from "@/config/states";
import { DISTRICTS_REGISTRY } from "@/config/districts";
import { getJobCanonicalPath, getStages, StageKind } from "@/data/jobs";
import { getAllJobs } from "@/lib/jobs-store";

import { 
  QUALIFICATION_HUBS, 
  SECTOR_HUBS, 
  ORGANISATION_HUBS 
} from "@/data/permanent-categories";
import { VERIFIED_STATE_QUAL_HUBS } from "@/data/state-qualification-hubs";

// Route handlers are cached at build time; refresh hourly so newly published jobs are listed.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await getAllJobs();
  const baseUrl = "https://www.indiajobnotice.com";
  const now = new Date();

  // Core static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/calendar`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/exam-dates`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/calculator`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/vacancies`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/directory`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/for-colleges-libraries`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/editorial-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Permanent Sector Hubs (/engineering-jobs, /police-defense-jobs, etc.)
  const sectorRoutes: MetadataRoute.Sitemap = SECTOR_HUBS.map((hub) => ({
    url: `${baseUrl}${hub.canonicalPath}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.88,
  }));

  // Permanent Qualification Hubs (/qualification/12th-pass, /qualification/diploma, etc.)
  const qualificationRoutes: MetadataRoute.Sitemap = QUALIFICATION_HUBS.map((hub) => ({
    url: `${baseUrl}${hub.canonicalPath}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.88,
  }));

  // Permanent Organisation Hubs (/organisations/ssc, /organisations/upsc, etc.)
  const organisationRoutes: MetadataRoute.Sitemap = ORGANISATION_HUBS.map((hub) => ({
    url: `${baseUrl}${hub.canonicalPath}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.88,
  }));

  // Curated State + Qualification Hubs (/government-jobs/karnataka/12th-pass, etc.)
  const stateQualificationRoutes: MetadataRoute.Sitemap = VERIFIED_STATE_QUAL_HUBS.map((hub) => ({
    url: `${baseUrl}/government-jobs/${hub.stateSlug}/${hub.qualSlug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.86,
  }));

  // 36 State Directory Hubs (/state/[state])
  const stateRoutes: MetadataRoute.Sitemap = STATES_REGISTRY.map((state) => ({
    url: `${baseUrl}/state/${state.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  // 36 Permanent Government Jobs Hubs (/government-jobs/[state])
  const governmentJobsRoutes: MetadataRoute.Sitemap = STATES_REGISTRY.map((state) => ({
    url: `${baseUrl}/government-jobs/${state.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  // Dedicated District Hub Routes (/state/[state]/district/[district])
  const districtRoutes: MetadataRoute.Sitemap = DISTRICTS_REGISTRY.map((district) => ({
    url: `${baseUrl}/state/${district.stateSlug}/district/${district.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: district.isMajorHub ? 0.82 : 0.75,
  }));

  // Central and State Job detail pages
  const jobRoutes: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${baseUrl}${getJobCanonicalPath(job)}`,
    lastModified: new Date(job.applicationStartDate || now),
    changeFrequency: "weekly",
    priority: job.featured ? 0.9 : 0.75,
  }));

  // Distinct lifecycle & intent search routes (Eligibility, Admit Card, Answer Key, Result)
  const lifecycleRoutes: MetadataRoute.Sitemap = jobs.flatMap((job) => {
    const base = `${baseUrl}${getJobCanonicalPath(job)}`;

    return [
      {
        url: `${base}/eligibility`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.78,
      },
      // stage pages only once the official document is out (until then they are noindex)
      ...(["admit-card", "answer-key", "result"] as const)
        .filter((path) => getStages(job, path.replace("-", "_") as StageKind).length > 0)
        .map((path) => ({ url: `${base}/${path}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 })),
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
