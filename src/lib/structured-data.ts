import { JobNotification, isJobApplicationClosed, getJobAgeCutoffDate, formatAgeRange, formatFee } from "@/data/jobs";
import { getStateBySlug } from "@/config/states";
import { getJobTaxonomyLinks } from "@/lib/internal-links";
import { formatDate } from "@/lib/utils";

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Generates official FAQs for a recruitment notification.
 * These directly address search intent for pages ranking around positions 8-20.
 */
export function getJobFaqs(job: JobNotification): FAQItem[] {
  const cutoffDate = getJobAgeCutoffDate(job);
  const state = job.stateSlug !== "central" ? getStateBySlug(job.stateSlug) : null;
  const stateLabel = state ? state.name : "Central Government";

  return [
    {
      question: `What is the total vacancy and post name in ${job.shortTitle}?`,
      answer: `${job.organization} has announced ${job.totalVacancies ? `${job.totalVacancies.toLocaleString("en-IN")} vacancies` : "vacancies"} for ${job.title}. Category-wise vacancies are given in the official notification.`,
    },
    {
      question: `What is the age limit and cut-off date for ${job.shortTitle}?`,
      answer: job.ageKnown === false || !job.maxAge
        ? `The age limit is given in the official notification of ${job.organization}.`
        : `Age limit: ${formatAgeRange(job, "years")} as on ${formatDate(cutoffDate)}.${job.ageRelaxation ? ` ${job.ageRelaxation}` : " Relaxation for reserved categories is as per the notification."}`,
    },
    {
      question: `What educational qualification is required to apply for ${job.shortTitle}?`,
      answer: job.qualifications.length
        ? `As stated in the notification: ${job.qualifications.join("; ")}.`
        : "The educational qualification is given in the official notification.",
    },
    {
      question: `What is the selection process and exam pattern?`,
      answer: job.selectionProcess.length
        ? `As stated in the notification: ${job.selectionProcess.join(" → ")}.`
        : "The selection process is given in the official notification.",
    },
    {
      question: `What is the application fee for ${job.shortTitle}?`,
      answer: job.feeKnown === false
        ? job.applicationFeeText || "The application fee, if any, is given in the official notification."
        : `Application fee: ${formatFee(job)}.`,
    },
    {
      question: `What is the last date to apply online for ${job.shortTitle}?`,
      answer: !job.applicationEndDate
        ? "The last date is given in the official notification."
        : job.isWalkIn
        ? `This is a walk-in interview on ${formatDate(job.applicationEndDate)}; see the notification for the time and venue.`
        : `The last date to apply is ${formatDate(job.applicationEndDate)}.`,
    },
  ];
}

/**
 * Builds clean, single-instance JSON-LD structured data graph for Google Search Console.
 * Validates against Google JobPosting guidelines:
 * - Active listings: Google JobPosting + BreadcrumbList + FAQPage
 * - Closed listings: WebPage (Expired Job compliant) + BreadcrumbList + FAQPage
 */
export function generateJobStructuredData(job: JobNotification, canonicalUrl: string) {
  const isClosed = isJobApplicationClosed(job);
  const taxonomy = getJobTaxonomyLinks(job);
  const faqs = getJobFaqs(job);
  const state = job.stateSlug !== "central" ? getStateBySlug(job.stateSlug) : null;
  const locationRegion = state ? state.name : "National / All-India";

  // 1. BreadcrumbList Schema
  const breadcrumbListSchema = {
    "@type": "BreadcrumbList",
    itemListElement: taxonomy.breadcrumbTrail.map((crumb, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: crumb.label,
      item: crumb.href.startsWith("http") ? crumb.href : `https://www.indiajobnotice.com${crumb.href}`,
    })),
  };

  // 2. FAQPage Schema (Targets striking distance positions 8-20 with accordion rich snippets)
  const faqPageSchema = {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  // 3. Primary Entity: JobPosting or WebPage
  const primaryEntity = !isClosed
    ? {
        "@type": "JobPosting",
        title: job.title,
        description: `${job.title} officially announced by ${job.organization}. Total Vacancies: ${job.totalVacancies.toLocaleString("en-IN")}. ${job.syllabusSummary}`,
        datePosted: job.applicationStartDate ? new Date(job.applicationStartDate).toISOString() : new Date().toISOString(),
        dateModified: new Date(job.lastVerifiedDate || "2026-10-23").toISOString(),
        validThrough: job.applicationEndDate ? new Date(`${job.applicationEndDate}T23:59:59Z`).toISOString() : undefined,
        employmentType: "FULL_TIME",
        hiringOrganization: {
          "@type": "Organization",
          name: job.organization,
          sameAs: job.applyOnlineUrl || job.officialPdfUrl,
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressCountry: "IN",
            addressRegion: locationRegion,
          },
        },
        baseSalary: {
          "@type": "MonetaryAmount",
          currency: "INR",
          value: {
            "@type": "QuantitativeValue",
            unitText: "MONTH",
          },
        },
        qualifications: job.qualifications.join(", "),
        directApply: true,
        url: canonicalUrl,
      }
    : {
        "@type": "WebPage",
        name: `${job.title} (Archived Official Gazette)`,
        description: `Official archive for ${job.title} by ${job.organization}. Applications closed on ${job.applicationEndDate}. Master record of syllabus, exam pattern, eligibility and previous cut-offs.`,
        url: canonicalUrl,
        dateModified: new Date().toISOString(),
      };

  return {
    "@context": "https://schema.org",
    "@graph": [
      primaryEntity,
      breadcrumbListSchema,
      faqPageSchema,
    ],
  };
}
