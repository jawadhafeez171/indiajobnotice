"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Calendar,
  FileText,
  ExternalLink,
  ArrowLeft,
  Ban,
  ShieldCheck,
  Bookmark,
} from "lucide-react";
import { JobNotification } from "@/data/jobs";
import { JobStatusBadge } from "./JobStatusBadge";
import { formatDate, cn, getDaysRemaining } from "@/lib/utils";
import { WhatsAppLogo, TelegramLogo } from "@/components/common/SocialIcons";
import { getStateBySlug } from "@/config/states";
import { ReservedAdSlot } from "@/components/ads/ReservedAdSlot";
import { useWatchlist } from "@/lib/watchlist";
import { generateGoogleCalendarUrl } from "@/lib/calendar";
import { ExecutiveNotificationDigest, hasPostsCard } from "./ExecutiveNotificationDigest";
import { DatesAndApply, WhoCanApply, datesHeading, hasEligibility } from "./JobFactSections";
import { ClosedRecruitmentAlert } from "./ClosedRecruitmentAlert";
import { JobTaxonomyBar } from "./JobTaxonomyBar";
import { RelatedOpportunitiesSection } from "./RelatedOpportunitiesSection";
import { getJobTaxonomyLinks, noticeArea, RelatedOpportunity } from "@/lib/internal-links";
import { generateJobStructuredData } from "@/lib/structured-data";
import { isJobApplicationClosed, getJobVerificationMeta, getJobCanonicalPath } from "@/data/jobs";

interface Props {
  job: JobNotification;
  stateSlug?: string;
  activeJobs: JobNotification[];
  related: RelatedOpportunity[];
  /** The other notice of the same round (Karnataka: KK and RPC), from getSiblingNotices. */
  siblings?: JobNotification[];
}

/** "kea.kar.nic.in": where the Apply button leads, said before the visitor leaves. */
function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function JobDetailView({ job, stateSlug, activeJobs, related, siblings = [] }: Props) {
  const area = noticeArea(job);
  const sibling = siblings[0];
  const siblingArea = sibling ? noticeArea(sibling) : null;
  const isClosed = isJobApplicationClosed(job);
  const stateInfo = job.stateSlug !== "central" ? getStateBySlug(job.stateSlug) : null;
  const taxonomy = getJobTaxonomyLinks(job);
  const verificationMeta = getJobVerificationMeta(job);
  const applyHost = hostOf(job.applyOnlineUrl);
  const daysLeft = job.applicationEndDate ? getDaysRemaining(job.applicationEndDate) : -1;

  // Watchlist
  const { isSaved, toggleSave, isLoaded } = useWatchlist();
  const saved = isLoaded ? isSaved(job.id) : false;

  // On phones, the last date and Apply stay in reach whenever the top card's Apply is off screen
  // (scrolled past, or not yet reached on a small phone)
  const actionsRef = useRef<HTMLDivElement>(null);
  const [actionsGone, setActionsGone] = useState(false);
  useEffect(() => {
    const el = actionsRef.current;
    if (!el || isClosed || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setActionsGone(!e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [isClosed]);
  // the back-to-top button moves up while the bar shows (ScrollToTop)
  useEffect(() => {
    document.body.dataset.applyBar = actionsGone ? "1" : "";
    return () => {
      delete document.body.dataset.applyBar;
    };
  }, [actionsGone]);

  // Google Calendar URL for application deadline
  const deadlineCalendarUrl = generateGoogleCalendarUrl({
    title: `Last date: ${job.shortTitle}`,
    description: `${job.organization}${job.totalVacancies ? ` (${job.totalVacancies} posts)` : ""}.\nApply on the official website: ${job.applyOnlineUrl}`,
    startDate: job.applicationEndDate,
    location: job.isCentral ? "All India" : stateInfo?.name || "",
    url: job.applyOnlineUrl,
  });

  const basePrefix = job.isCentral || !stateSlug || stateSlug === "central"
    ? `/jobs/${job.slug}`
    : `/state/${stateSlug}/jobs/${job.slug}`;

  const canonicalUrl = `https://www.indiajobnotice.com${basePrefix}`;
  const structuredData = generateJobStructuredData(job, canonicalUrl);
  const sections = [
    { id: "dates", label: datesHeading(job) },
    ...(hasEligibility(job) ? [{ id: "eligibility", label: "Who can apply" }] : []),
    ...(hasPostsCard(job) ? [{ id: "posts", label: "Posts" }] : []),
  ];
  // the section being read, highlighted in the jump links
  const [here, setHere] = useState("");
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const els = sections.map((x) => document.getElementById(x.id)).filter((el): el is HTMLElement => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (seen[0]) setHere(seen[0].target.id);
      },
      { rootMargin: "-140px 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // the section list only changes with the job
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job.id]);
  const back = stateInfo
    ? { href: `/state/${stateInfo.slug}`, label: `${stateInfo.name} jobs` }
    : { href: "/", label: "All jobs" };

  return (
    <div
      className={cn(
        "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8 sm:py-8 space-y-6 sm:space-y-7 print:p-0 print:m-0 print:max-w-none",
        !isClosed && "pb-24 md:pb-8"
      )}
    >
      {/* Schema.org Structured Data Graph (JobPosting / WebPage + BreadcrumbList + FAQPage) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Breadcrumb */}
      {/* !mt-0: the JSON-LD script above is the container's first child, so the spacing would apply */}
      <nav aria-label="Breadcrumb" className="!mt-0 flex items-start justify-between gap-2 text-xs text-muted print:hidden">
        <ol className="flex items-center flex-wrap gap-x-1.5 list-none p-0 m-0 min-w-0">
          {taxonomy.breadcrumbTrail.map((crumb, idx) => {
            const isLast = idx === taxonomy.breadcrumbTrail.length - 1;
            return (
              // phones keep Home, the state and this page: the middle crumbs would wrap to three lines
              <li key={idx} className={cn("items-center gap-1.5 min-w-0", idx > 1 && !isLast ? "hidden sm:flex" : "flex")}>
                {idx > 0 && <span aria-hidden className="text-faint">/</span>}
                {isLast ? (
                  <span className="text-ink font-bold truncate max-w-[60vw] sm:max-w-md" aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <Link href={crumb.href} className="inline-block py-1.5 hover:text-navy font-medium transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>

        <Link
          href={back.href}
          className="hidden sm:inline-flex text-navy hover:underline font-bold items-center gap-1 shrink-0 py-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{back.label}</span>
        </Link>
      </nav>

      {/* Header: what, who, and the actions */}
      <div className="bg-surface rounded-xl border border-line p-5 sm:p-8 shadow-2xs print:border-none print:shadow-none print:p-0">
        {/* one row: who, where, status, save */}
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <span className="px-2 py-1 rounded bg-navy-tint text-navy font-bold text-xs flex items-center gap-1.5 shrink-0">
            <Building2 className="w-3.5 h-3.5 text-navy" aria-hidden />
            {job.orgShortCode}
          </span>
          <span
            className={cn(
              // phones: the code (KEA · KA) and the breadcrumb already name the state
              "hidden sm:inline-block text-xs font-bold px-2 py-1 rounded truncate min-w-0",
              job.isCentral ? "bg-navy-tint text-navy" : "bg-saffron-tint text-saffron"
            )}
          >
            {job.isCentral ? "Central" : stateInfo?.name}
          </span>
          <JobStatusBadge
            className="shrink-0"
            status={isClosed && job.status !== "RESULT_OUT" && job.status !== "ADMIT_CARD_OUT" ? "APPLICATIONS_CLOSED" : job.status}
          />
          <button
            type="button"
            onClick={() => toggleSave(job.id)}
            aria-pressed={saved}
            aria-label={saved ? "Saved. Remove from saved jobs" : "Save this job on this device"}
            className={cn(
              "ml-auto shrink-0 w-10 h-10 sm:w-auto sm:px-3 rounded-lg border text-xs font-bold transition-colors flex items-center justify-center gap-1.5 print:hidden",
              saved
                ? "bg-saffron-tint text-saffron border-saffron-line"
                : "bg-surface text-muted border-line hover:border-navy hover:text-navy"
            )}
          >
            <Bookmark className={cn("w-4 h-4", saved && "fill-saffron-bright")} aria-hidden />
            <span className="hidden sm:inline">{saved ? "Saved" : "Save"}</span>
          </button>
        </div>

        <h1 className="font-serif text-[22px] sm:text-4xl font-bold text-ink leading-tight text-balance">
          {job.title}
        </h1>

        {!job.title.startsWith(job.organization) && (
          <p className="text-sm text-ink mt-2 font-semibold">{job.organization}</p>
        )}

        {/* The deadline at a glance, before any scrolling */}
        {(job.applicationEndDate || job.totalVacancies > 0) && (
          <p className="mt-2 text-sm text-ink">
            {job.applicationEndDate && (
              <strong className={isClosed ? "text-muted" : "text-saffron"}>
                {job.isWalkIn ? "Walk-in" : "Last date"} {formatDate(job.applicationEndDate)}
                {isClosed ? " (closed)" : ""}
              </strong>
            )}
            {job.applicationEndDate && job.totalVacancies > 0 && <span className="text-faint"> · </span>}
            {job.totalVacancies > 0 && <span>{job.totalVacancies.toLocaleString("en-IN")} posts</span>}
          </p>
        )}

        {/* Which of a round's two notices this is (Karnataka: KK and RPC), and where the other one is */}
        {area && sibling && siblingArea && (
          <p className="mt-2 text-sm text-ink-2 max-w-prose">
            This notice: posts in the {area.label}.{" "}
            <Link href={getJobCanonicalPath(sibling)} className="font-semibold text-navy underline underline-offset-2 hover:text-saffron">
              Posts in the {siblingArea.label}: separate notice
            </Link>
            {sibling.applicationEndDate && <span className="text-muted"> (last date {formatDate(sibling.applicationEndDate)})</span>}
          </p>
        )}

        {/* Where the facts come from */}
        <p className="mt-3 text-xs text-muted flex items-center gap-1.5 flex-wrap">
          <ShieldCheck className="w-3.5 h-3.5 text-green" />
          <span>From the official notification</span>
          {verificationMeta.lastVerifiedDate && <span>· Added {formatDate(verificationMeta.lastVerifiedDate)}</span>}
        </p>

        {/* Actions: apply and the notice first; calendar and sharing after */}
        <div ref={actionsRef} className="mt-6 pt-6 border-t border-line-soft space-y-3 print:hidden">
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
            {isClosed ? (
              <p className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-subtle border border-line text-muted font-bold text-sm">
                <Ban className="w-4 h-4" aria-hidden />
                Applications closed{job.applicationEndDate ? ` on ${formatDate(job.applicationEndDate)}` : ""}
              </p>
            ) : (
              <a
                href={job.applyOnlineUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial inline-flex flex-col items-center justify-center px-6 py-2.5 rounded-lg bg-saffron-solid hover:bg-saffron-strong text-white shadow-xs transition-colors"
              >
                <span className="inline-flex items-center gap-2 font-bold text-sm">
                  <ExternalLink className="w-4 h-4" aria-hidden />
                  Apply online
                </span>
                {applyHost && <span className="text-[12px] font-medium text-white">on {applyHost}</span>}
              </a>
            )}

            <a
              href={job.officialPdfUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border-2 border-navy bg-surface hover:bg-navy-tint text-navy font-bold text-sm transition-colors"
            >
              <FileText className="w-4 h-4 text-navy" aria-hidden />
              Official notification
            </a>
          </div>

          {!isClosed && job.applicationEndDate && (
            <a
              href={deadlineCalendarUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-lg border border-line hover:border-navy text-ink font-semibold text-xs transition-colors"
            >
              <Calendar className="w-4 h-4 text-navy" aria-hidden />
              Add last date to calendar
            </a>
          )}
        </div>
      </div>

      {isClosed && !job.inProgress && (
        <ClosedRecruitmentAlert job={job} stateSlug={stateSlug} activeJobs={activeJobs} />
      )}

      {/* Jump links: the sections a candidate looks for, in the order they come */}
      {/* stays under the site header while reading; the right edge fades so the row reads as scrollable */}
      <nav
        aria-label="On this page"
        className="print:hidden sticky top-[68px] md:top-[109px] z-20 -mx-4 sm:-mx-6 lg:-mx-8 bg-canvas/95 border-b border-line-soft"
      >
        <div className="overflow-x-auto [mask-image:linear-gradient(to_right,black_85%,transparent)] sm:[mask-image:none]">
          <ul className="flex gap-2 px-4 sm:px-6 lg:px-8 py-2 w-max sm:w-auto sm:flex-wrap">
            {sections.map((x) => (
              <li key={x.id}>
                <a
                  href={`#${x.id}`}
                  aria-current={here === x.id ? "location" : undefined}
                  className={cn(
                    "inline-flex items-center min-h-[40px] px-3.5 rounded-full border text-sm font-semibold whitespace-nowrap transition-colors",
                    here === x.id
                      ? "bg-navy-solid border-navy text-white"
                      : "bg-surface border-line text-ink hover:border-navy hover:text-navy"
                  )}
                >
                  {x.label}
                </a>
              </li>
            ))}
            <li aria-hidden className="w-6 sm:hidden" />
          </ul>
        </div>
      </nav>

      {/* three cards: the dates (with the documents since, the fee and how to apply), who can
          apply, and the posts (with pay, vacancies by category and the selection process) */}
      <DatesAndApply job={job} />
      <WhoCanApply job={job} />
      <ExecutiveNotificationDigest job={job} />

      {/* Sharing and alerts, after the facts rather than among the apply buttons */}
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${job.title}: ${canonicalUrl}`)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-lg bg-[#13853F] hover:bg-[#0E7A3E] text-white text-sm font-semibold transition-colors"
        >
          <WhatsAppLogo className="w-4 h-4" />
          Share on WhatsApp
        </a>
        <a
          href="https://t.me/india_jobnotice"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-lg bg-[#1A7DB0] hover:bg-[#156C99] text-white text-sm font-semibold transition-colors"
        >
          <TelegramLogo className="w-4 h-4" />
          New jobs on Telegram
        </a>
      </div>

      <ReservedAdSlot slotType="leaderboard" slotId={`job-detail-${job.slug}`} className="print:hidden" />

      {/* Similar jobs, then more jobs by state, qualification and organisation */}
      <RelatedOpportunitiesSection currentJob={job} related={related.filter((r) => !siblings.some((x) => x.id === r.job.id))} />
      <JobTaxonomyBar job={job} />

      <p className="text-xs text-muted flex items-start gap-2 max-w-prose">
        <ShieldCheck className="w-4 h-4 text-green shrink-0" aria-hidden />
        <span>
          IndiaJobNotice is not a government website. These details are taken from the official
          notification; check the notification itself before you apply.
        </span>
      </p>

      {/* Phones: the last date and Apply, once the header's buttons have scrolled away */}
      {!isClosed && (
        <div
          aria-hidden={!actionsGone}
          className={cn(
            "md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur-sm px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-[0_-4px_12px_rgba(0,0,0,0.08)] transition-transform duration-200 ease-out print:hidden",
            actionsGone ? "translate-y-0" : "translate-y-full"
          )}
        >
          <div className="flex items-center gap-3">
            <p className="flex-1 min-w-0 text-xs text-muted leading-tight">
              {job.applicationEndDate ? (
                <>
                  <span className="block font-bold text-sm text-ink">
                    {job.isWalkIn ? "Walk-in" : "Last date"} {formatDate(job.applicationEndDate)}
                  </span>
                  {daysLeft >= 0 && (daysLeft === 0 ? "Closes today" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`)}
                </>
              ) : (
                <span className="block font-bold text-sm text-ink truncate">{job.shortTitle}</span>
              )}
            </p>
            <a
              href={job.applyOnlineUrl}
              target="_blank"
              rel="noreferrer"
              tabIndex={actionsGone ? 0 : -1}
              className="shrink-0 inline-flex items-center gap-1.5 min-h-[44px] px-5 rounded-lg bg-saffron-solid hover:bg-saffron-strong text-white font-bold text-sm"
            >
              <ExternalLink className="w-4 h-4" aria-hidden />
              Apply online
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
