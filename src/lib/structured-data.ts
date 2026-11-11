import { JobNotification, isJobApplicationClosed, getJobAgeCutoffDate, formatAgeRange, formatFee, ageText } from "@/data/jobs";
import { getStateBySlug } from "@/config/states";
import { getJobTaxonomyLinks } from "@/lib/internal-links";
import { formatDate } from "@/lib/utils";
import { salaryRange, jobSeoDescription } from "@/lib/seo";
import { termsLabel } from "@/components/jobs/JobListCard";

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

  // the short title without its "(2,070 Posts)": each question stays one or two lines on a phone
  const name = job.shortTitle.replace(/\s*\([\d,]+ Posts?\)$/, "").replace(/…$/, "");
  return [
    {
      question: `How many vacancies are there in ${name}?`,
      answer: `${job.organization} has announced ${job.totalVacancies ? `${job.totalVacancies.toLocaleString("en-IN")} vacancies` : "vacancies"} for ${job.title}.${job.reservation ? " The table of vacancies by category on this page is copied from the notification." : " Category-wise vacancies are given in the official notification."}`,
    },
    {
      question: `What is the age limit for ${name}?`,
      answer: job.ageLimitText?.trim()
        ? `As stated in the notification: ${job.ageLimitText.trim()}`
        : job.ageKnown === false || !job.maxAge
        ? `The age limit is given in the official notification of ${job.organization}.`
        : `Age limit: ${formatAgeRange(job, "years")} as on ${formatDate(cutoffDate)}.${job.ageRelaxation ? ` ${job.ageRelaxation}` : " Relaxation for reserved categories is as per the notification."}`,
    },
    {
      question: `What educational qualification is required for ${name}?`,
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
      question: `What is the application fee for ${name}?`,
      answer: formatFee(job) === "See notification"
        ? "The application fee, if any, is given in the official notification."
        : `Application fee: ${formatFee(job)}`,
    },
    {
      question: `What is the last date to apply for ${name}?`,
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
/** JobPosting description: Google wants the job described, not just named. Facts from the notice only. */
function jobPostingDescription(job: JobNotification): string {
  const lines = [`<p>${job.title}, notified by ${job.organization}.</p>`];
  const facts: string[] = [];
  if (job.totalVacancies) facts.push(`Vacancies: ${job.totalVacancies.toLocaleString("en-IN")}`);
  if (job.posts?.length) facts.push(`Posts: ${job.posts.slice(0, 12).map((p) => `${p.postName}${p.vacancies ? ` (${p.vacancies})` : ""}`).join("; ")}`);
  if (job.qualifications.length) facts.push(`Qualification: ${job.qualifications.join("; ")}`);
  if (job.ageLimitText?.trim() || (job.ageKnown !== false && job.maxAge)) facts.push(`Age limit: ${ageText(job)}`);
  if (job.salary) facts.push(`Pay: ${job.salary}`);
  if (formatFee(job) !== "See notification") facts.push(`Application fee: ${formatFee(job)}`);
  if (job.selectionProcess.length) facts.push(`Selection: ${job.selectionProcess.join(", ")}`);
  if (job.applicationEndDate) facts.push(`${job.isWalkIn ? "Walk-in date" : "Last date"}: ${formatDate(job.applicationEndDate)}`);
  if (facts.length) lines.push(`<ul>${facts.map((f) => `<li>${f}</li>`).join("")}</ul>`);
  lines.push("<p>Apply on the official website; see the official notification for full details.</p>");
  return lines.join("");
}

/**
 * The kind of employment, from the notice's own wording (11 Nov: every job said FULL_TIME, though about a third
 * of open ones are contract posts). Apprenticeships are INTERN, part-time posts PART_TIME, contract / fixed-term
 * / tenure posts TEMPORARY, deputation none (not an open hire), regular recruitment FULL_TIME.
 */
function employmentType(job: JobNotification): string | undefined {
  const t = `${job.title} ${job.shortTitle || ""}`;
  if (/apprentic|internship/i.test(t)) return "INTERN";
  if (/part[- ]?time/i.test(t)) return "PART_TIME";
  const terms = termsLabel(job);
  if (terms === "Deputation") return undefined;
  if (terms === "Contract") return "TEMPORARY";
  return "FULL_TIME";
}

export function generateJobStructuredData(job: JobNotification, canonicalUrl: string) {
  const isClosed = isJobApplicationClosed(job);
  const taxonomy = getJobTaxonomyLinks(job);
  const state = job.stateSlug !== "central" ? getStateBySlug(job.stateSlug) : null;
  // central jobs: the country only ("National / All-India" is not a region)
  const locationRegion = state ? state.name : undefined;
  const pay = salaryRange(job);

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

  // No FAQPage: the job page shows no questions, and FAQ markup must match what the page shows.
  // The JobPosting below carries the same facts.

  // 2. Primary Entity: JobPosting or WebPage
  const primaryEntity = !isClosed
    ? {
        "@type": "JobPosting",
        title: job.title,
        description: jobPostingDescription(job),
        // a fixed date: the notice's own start date, else the day the site added it
        datePosted: new Date(job.notificationDate || job.applicationStartDate || job.lastVerifiedDate || "2026-10-30").toISOString(),
        dateModified: new Date(job.lastVerifiedDate || "2026-10-23").toISOString(),
        validThrough: job.applicationEndDate ? new Date(`${job.applicationEndDate}T23:59:59Z`).toISOString() : undefined,
        ...(employmentType(job) ? { employmentType: employmentType(job) } : {}),
        // no sameAs: the apply or notice link is not the body's own website
        hiringOrganization: {
          "@type": "Organization",
          name: job.organization,
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressCountry: "IN",
            ...(locationRegion ? { addressRegion: locationRegion } : {}),
          },
        },
        // pay only when the notification states it (an empty amount is an error in Search Console)
        ...(pay ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "INR",
            value: { "@type": "QuantitativeValue", unitText: pay.unit, minValue: pay.min, ...(pay.max ? { maxValue: pay.max } : {}) },
          },
        } : {}),
        ...(job.advtNo ? { identifier: { "@type": "PropertyValue", name: job.organization, value: job.advtNo } } : {}),
        qualifications: job.qualifications.join(", "),
        // applications are made on the official website, not here
        directApply: false,
        url: canonicalUrl,
      }
    : {
        "@type": "WebPage",
        name: job.title,
        description: jobSeoDescription(job),
        url: canonicalUrl,
        dateModified: new Date(job.lastVerifiedDate || "2026-10-23").toISOString(),
      };

  return {
    "@context": "https://schema.org",
    "@graph": [
      primaryEntity,
      breadcrumbListSchema,
    ],
  };
}
