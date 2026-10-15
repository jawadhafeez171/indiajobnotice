import { MetadataRoute } from "next";
import { STATES_REGISTRY } from "@/config/states";
import { SAMPLE_JOBS } from "@/data/jobs";

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
      priority: 0.8,
    },
  ];

  // 36 State gazette hubs
  const stateRoutes: MetadataRoute.Sitemap = STATES_REGISTRY.map((state) => ({
    url: `${baseUrl}/state/${state.slug}`,
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

  return [...staticRoutes, ...stateRoutes, ...jobRoutes];
}
