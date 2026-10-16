import { JobNotification, isJobApplicationClosed, getJobAgeCutoffDate } from "@/data/jobs";
import { getStateBySlug } from "@/config/states";
import { getJobTaxonomyLinks } from "@/lib/internal-links";

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
      answer: `${job.organization} has officially announced ${job.totalVacancies.toLocaleString("en-IN")} vacancies for ${job.title}. Category-wise distribution and department rosters are detailed in the official gazette.`,
    },
    {
      question: `What is the age limit and cut-off date for ${job.shortTitle}?`,
      answer: `The candidate must be between ${job.minAge} and ${job.maxAge} years of age as of the crucial cut-off date (${cutoffDate}). Age relaxation applies as per government norms: OBC +3 years, SC/ST +5 years, and PwD +10 years.`,
    },
    {
      question: `What educational qualification is required to apply for ${job.shortTitle}?`,
      answer: `Applicants must hold: ${job.qualifications.join(" or ")} from a recognized Board or University recognized by UGC/AICTE.`,
    },
    {
      question: `What is the selection process and exam pattern?`,
      answer: `The selection procedure consists of: ${job.selectionProcess.join(" → ")}. Detailed stage-wise marks breakdown and negative marking rules are published in the official syllabus.`,
    },
    {
      question: `What is the application fee for ${job.shortTitle}?`,
      answer: `The application fee is ₹${job.applicationFee.ur_obc_ews} for UR / OBC / EWS candidates, and ₹${job.applicationFee.sc_st} for SC / ST candidates. Female/PwD fee concession is provided as per commission rules.`,
    },
    {
      question: `What is the last date to apply online for ${job.shortTitle}?`,
      answer: `The online application portal accepts submissions up to ${job.applicationEndDate}. Candidates are advised to submit well before the closing date to avoid server congestion.`,
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
