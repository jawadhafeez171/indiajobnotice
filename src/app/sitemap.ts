import { MetadataRoute } from "next";
import { STATES_REGISTRY } from "@/config/states";
import { SAMPLE_JOBS } from "@/data/jobs";
import { 
  QUALIFICATION_HUBS, 
  SECTOR_HUBS, 
  ORGANISATION_HUBS 
} from "@/data/permanent-categories";
import { VERIFIED_STATE_QUAL_HUBS } from "@/data/state-qualification-hubs";

export default function sitemap(): MetadataRoute.Sitemap {
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

  // Central and State Job detail pages
  const jobRoutes: MetadataRoute.Sitemap = SAMPLE_JOBS.map((job) => ({
    url: job.isCentral 
      ? `${baseUrl}/jobs/${job.slug}` 
      : `${baseUrl}/state/${job.stateSlug}/jobs/${job.slug}`,
    lastModified: new Date(job.applicationStartDate || now),
    changeFrequency: "weekly",
    priority: job.featured ? 0.9 : 0.75,
  }));

  // Distinct lifecycle & intent search routes (Eligibility, Admit Card, Answer Key, Result)
  const lifecycleRoutes: MetadataRoute.Sitemap = SAMPLE_JOBS.flatMap((job) => {
    const base = job.isCentral 
      ? `${baseUrl}/jobs/${job.slug}` 
      : `${baseUrl}/state/${job.stateSlug}/jobs/${job.slug}`;

    return [
      {
        url: `${base}/eligibility`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.78,
      },
      {
        url: `${base}/admit-card`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
      {
        url: `${base}/answer-key`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.65,
      },
      {
        url: `${base}/result`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
    ];
  });

  return [
    ...staticRoutes,
    ...sectorRoutes,
    ...qualificationRoutes,
    ...organisationRoutes,
    ...stateQualificationRoutes,
    ...stateRoutes,
    ...governmentJobsRoutes,
    ...jobRoutes,
    ...lifecycleRoutes,
  ];
}
