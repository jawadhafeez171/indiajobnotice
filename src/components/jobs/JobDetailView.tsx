"use client";

import { safeJson } from "@/lib/json-ld";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Calendar,
  Clock,
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
import { WhatsAppLogo } from "@/components/common/SocialIcons";
import { getStateBySlug } from "@/config/states";
import { ReservedAdSlot } from "@/components/ads/ReservedAdSlot";
import { useWatchlist } from "@/lib/watchlist";
import { generateGoogleCalendarUrl } from "@/lib/calendar";
import { ExecutiveNotificationDigest, SelectionProcess, hasPostsCard, hasSelection } from "./ExecutiveNotificationDigest";
import {
  DatesAndApply, FeeAndApply, WhoCanApply, datesHeading, glanceFacts, hasEligibility, hasFeeSection, opensLater,
} from "./JobFactSections";
import { ClosedRecruitmentAlert } from "./ClosedRecruitmentAlert";
import { NoticeTitle } from "./NoticeTitle";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
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
  const opens = opensLater(job);
  const stateInfo = job.stateSlug !== "central" ? getStateBySlug(job.stateSlug) : null;
  const taxonomy = getJobTaxonomyLinks(job);
  const verificationMeta = getJobVerificationMeta(job);
  const applyHost = hostOf(job.applyOnlineUrl);
  const daysLeft = job.applicationEndDate ? getDaysRemaining(job.applicationEndDate) : -1;
  const facts = glanceFacts(job);

  // Watchlist
  const { isSaved, toggleSave, isLoaded } = useWatchlist();
  const saved = isLoaded ? isSaved(job.id) : false;

  // On phones, the last date and Apply stay in reach whenever the panel's buttons are off screen
  const actionsRef = useRef<HTMLDivElement>(null);
  const [actionsGone, setActionsGone] = useState(false);
  useEffect(() => {
    const el = actionsRef.current;
    if (!el || isClosed || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setActionsGone(!e.isIntersecting && e.boundingClientRect.top < 0));
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
    { id: "dates", label: isClosed ? datesHeading(job) : "Dates" },
    ...(hasPostsCard(job) ? [{ id: "posts", label: "Posts" }] : []),
    ...(hasEligibility(job) ? [{ id: "eligibility", label: "Who can apply" }] : []),
    ...(hasFeeSection(job) ? [{ id: "fee", label: "Fee and how to apply" }] : []),
    ...(hasSelection(job) ? [{ id: "selection", label: "Selection" }] : []),
  ];
  const back = stateInfo
    ? { href: `/state/${stateInfo.slug}`, label: `${stateInfo.name} jobs` }
    : { href: "/", label: "All jobs" };
  const tertiary = "inline-flex items-center gap-1.5 min-h-[44px] px-1 text-sm font-semibold text-ink-2 hover:text-navy transition-colors";

  return (
    <div
      className={cn(
        "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-10 sm:pt-6 print:p-0 print:m-0 print:max-w-none",
        !isClosed && "pb-24 md:pb-10"
      )}
    >
      {/* Schema.org Structured Data Graph (JobPosting / WebPage + BreadcrumbList) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJson(structuredData) }}
      />

      {/* Breadcrumb (its Google data is in the page's structured data above) */}
      <Breadcrumbs
        items={taxonomy.breadcrumbTrail.slice(1).map((c, i, all) => (i === all.length - 1 ? { label: c.label } : c))}
        data={false}
        aside={
          <Link href={back.href} className="inline-flex text-navy hover:underline font-bold items-center gap-1 py-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{back.label}</span>
          </Link>
        }
      />

      {/* Wide screens: the title and the facts on the left, the glance panel beside the title from the top */}
      <div className="mt-4 sm:mt-6 lg:grid lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-x-12">
      {/* What it is and who publishes it */}
      <header className="lg:col-start-1 lg:row-start-1 min-w-0">
        <div className="flex items-center gap-2 mb-3">
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

        <NoticeTitle text={job.title} />
        {!job.title.startsWith(job.organization) && (
          <p className="mt-2 text-sm text-ink-2 font-semibold">{job.organization}</p>
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
      </header>

        {/* At a glance and the actions: first on phones, a column that stays in view on wide screens */}
        <aside className="mt-6 lg:mt-0 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-start lg:sticky lg:top-[125px] print:static">
          <div className="rounded-xl border border-line bg-surface p-5 shadow-2xs print:border-none print:shadow-none print:p-0">
            {facts.length > 0 && <h2 className="text-sm font-bold text-ink">At a glance</h2>}
            {facts.length > 0 && <dl className="mt-3 mb-5 grid grid-cols-2 gap-x-4 gap-y-3">
              {facts.map((f) => (
                <div key={f.label} className="min-w-0">
                  <dt className="text-xs text-muted">{f.label}</dt>
                  <dd className={cn("text-sm font-semibold text-ink leading-snug", f.strong && "text-[15px] font-bold")}>
                    {f.href ? <a href={f.href} className="hover:text-navy hover:underline underline-offset-2">{f.value}</a> : f.value}
                    {f.note && <span className={cn("block text-xs font-semibold", f.note === "Closed" ? "text-muted" : "text-green")}>{f.note}</span>}
                  </dd>
                </div>
              ))}
            </dl>}

            <div ref={actionsRef} className="space-y-2.5 print:hidden">
              {isClosed ? (
                <p className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-subtle border border-line text-muted font-bold text-sm text-center">
                  <Ban className="w-4 h-4 shrink-0" aria-hidden />
                  Applications closed{job.applicationEndDate ? ` on ${formatDate(job.applicationEndDate)}` : ""}
                </p>
              ) : opens ? (
                <p className="flex flex-col items-center justify-center px-4 py-2.5 rounded-lg bg-navy-tint border border-navy-line text-center">
                  <span className="inline-flex items-center gap-2 font-bold text-sm text-navy">
                    <Clock className="w-4 h-4" aria-hidden />
                    Applications open {formatDate(opens)}
                  </span>
                  {applyHost && <span className="text-[12px] font-medium text-ink-2">on {applyHost}</span>}
                </p>
              ) : (
                <a
                  href={job.applyOnlineUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center justify-center px-6 py-2.5 rounded-lg bg-saffron-solid hover:bg-saffron-strong text-white shadow-xs transition-colors"
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
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg border-2 border-navy bg-surface hover:bg-navy-tint text-navy font-bold text-sm transition-colors"
              >
                <FileText className="w-4 h-4" aria-hidden />
                Official notification
              </a>
              <div className="flex flex-wrap items-center justify-center gap-x-5">
                {!isClosed && job.applicationEndDate && (
                  <a href={deadlineCalendarUrl} target="_blank" rel="noreferrer" className={tertiary}>
                    <Calendar className="w-4 h-4 text-navy" aria-hidden />
                    Add to calendar
                  </a>
                )}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${job.title}: ${canonicalUrl}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className={tertiary}
                >
                  <WhatsAppLogo className="w-4 h-4 text-[#13853F]" />
                  Share
                </a>
              </div>
            </div>
          </div>
          <p className="mt-3 px-1 text-xs text-muted flex items-center gap-1.5 flex-wrap">
            <ShieldCheck className="w-3.5 h-3.5 text-green" aria-hidden />
            <span>From the official notification</span>
            {verificationMeta.lastVerifiedDate && <span>· Added {formatDate(verificationMeta.lastVerifiedDate)}</span>}
          </p>
        </aside>

        {/* The facts, in the order a candidate checks them */}
        <div className="lg:col-start-1 lg:row-start-2 min-w-0 mt-8 space-y-9">
          {isClosed && !job.inProgress && (
            <ClosedRecruitmentAlert job={job} stateSlug={stateSlug} activeJobs={activeJobs} />
          )}

          {sections.length > 1 && <nav aria-label="On this page" className="print:hidden -mb-2">
            <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
              {sections.map((x) => (
                <li key={x.id}>
                  <a href={`#${x.id}`} className="inline-flex items-center min-h-[40px] font-semibold text-navy underline-offset-4 hover:underline">
                    {x.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>}

          <DatesAndApply job={job} />
          <ExecutiveNotificationDigest job={job} />
          <WhoCanApply job={job} />
          <FeeAndApply job={job} />
          <SelectionProcess job={job} />
        </div>
      </div>

      <div className="mt-12 space-y-8">
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
      </div>

      {/* Phones: the last date and Apply (or when applications open), once the panel's buttons have scrolled away */}
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
              {opens ? (
                <>
                  <span className="block font-bold text-sm text-ink">Applications open {formatDate(opens)}</span>
                  {job.applicationEndDate && `Last date ${formatDate(job.applicationEndDate)}`}
                </>
              ) : job.applicationEndDate ? (
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
            {opens ? (
              <a
                href={job.officialPdfUrl}
                target="_blank"
                rel="noreferrer"
                tabIndex={actionsGone ? 0 : -1}
                className="shrink-0 inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-lg border-2 border-navy bg-surface text-navy font-bold text-sm"
              >
                <FileText className="w-4 h-4" aria-hidden />
                Notification
              </a>
            ) : (
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}
