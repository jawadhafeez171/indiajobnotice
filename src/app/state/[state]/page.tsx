import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { MajorRecruitmentsSection } from "@/components/jobs/MajorRecruitmentsSection";
import { ReservedAdSlot } from "@/components/ads/ReservedAdSlot";
import { getStateBySlug, STATES_REGISTRY } from "@/config/states";
import { getJobsByState, getListingJobs, getExamsInProgress, isOpenOrOpening, getJobCanonicalPath, JobNotification, nextExamDate } from "@/data/jobs";
import { formatDateShort, getDaysRemaining } from "@/lib/utils";
import { ExamsInProgressSection } from "@/components/jobs/ExamsInProgressSection";
import { getAllJobs } from "@/lib/jobs-store";

import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { SITE_OG_IMAGES } from "@/lib/site-image";
import { forList } from "@/lib/list-jobs";
import { OpenJobLinks } from "@/components/jobs/OpenJobLinks";
import { YEAR } from "@/lib/year";
import { stateHasListings } from "@/lib/index-rules";
import { stateHubFacts, stateHubDescription, bodiesPhrase } from "@/lib/state-hub";
import { noticeArea } from "@/lib/internal-links";
import { rowTitle } from "@/components/jobs/JobListCard";
import { safeJson } from "@/lib/json-ld";
import { StateBoardsSection, hasStateBoards, stateBoardCount } from "@/components/jobs/StateBoardsSection";

const SITE = "https://www.indiajobnotice.com";
// the stage tabs a state page shows (20 Nov critique: seven tabs repeated the sections below them)
const STATE_TABS = ["APPLY_OPEN", "CLOSING_SOON", "EXAM_DATES", "RESULT"] as const;

/** On its own state's page a body needs no state suffix: "KEA · KA" -> "KEA". */
function withoutStateCode(j: JobNotification): JobNotification {
  return j.isCentral ? j : { ...j, orgShortCode: (j.orgShortCode || "").split(" · ")[0] };
}

interface PageProps {
  params: Promise<{ state: string }>;
}

export async function generateStaticParams() {
  return STATES_REGISTRY.map((s) => ({
    state: s.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { state: stateSlug } = await params;
  const state = getStateBySlug(stateSlug);
  if (!state) return { title: "State Not Found" };

  const canonicalUrl = `https://www.indiajobnotice.com/state/${state.slug}`;
  const all = await getAllJobs();
  const listed = stateHasListings(all, state.slug);
  // the words people search ("karnataka government jobs 2026") and the live count (20 Nov: Google showed one
  // KEA job page for that search, not this page)
  const facts = stateHubFacts(getJobsByState(all, state.slug, false));
  const count = facts.open.length;

  return {
    title: count
      ? `${state.name} Govt Jobs ${YEAR}: ${count} Open Notification${count === 1 ? "" : "s"}`
      : `${state.name} Govt Jobs ${YEAR}: Notifications, Admit Cards & Results`,
    description: stateHubDescription(state.name, facts),
    alternates: {
      canonical: canonicalUrl,
    },
    // nothing of its own open or under way: out of search until there is, links still followed (11 Nov)
    robots: listed ? undefined : { index: false, follow: true },
    openGraph: {
      images: SITE_OG_IMAGES,
      title: `${state.name} Government Jobs ${YEAR} - India Job Notice`,
      description: stateHubDescription(state.name, facts),
      url: canonicalUrl,
      siteName: "India Job Notice",
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${state.name} Government Jobs ${YEAR}`,
      description: stateHubDescription(state.name, facts),
    },
  };
}

export default async function StateHomePage({ params }: PageProps) {
  const { state: stateSlug } = await params;
  const state = getStateBySlug(stateSlug);

  if (!state) {
    notFound();
  }

  const allJobs = await getAllJobs();
  const jobs = getJobsByState(getListingJobs(allJobs), state.slug);
  const ownOpen = jobs.some((j) => !j.isCentral && isOpenOrOpening(j));
  const own = getJobsByState(allJobs, state.slug, false);
  const facts = stateHubFacts(own);
  // with jobs of its own the page carries only those; central ones are a link away (20 Nov: 47 central jobs made
  // the page ~0.9 MB and about something else)
  const listJobs = (ownOpen ? jobs.filter((j) => !j.isCentral) : jobs).map(withoutStateCode);
  const underWay = getJobsByState(getExamsInProgress(allJobs), state.slug, false).map(withoutStateCode);
  const centralOpen = jobs.filter((j) => j.isCentral && isOpenOrOpening(j)).length;
  const sites = stateBoardCount(state.slug);
  const sitesLink = sites > 0 && (
    <a href="#official-sites" className="font-semibold text-navy underline underline-offset-2 hover:text-saffron">{sites} official sites we check</a>
  );
  // what the tabs already list (an exam ahead, an admit card, a result) is not listed again under "under way"
  const inTabs = (j: JobNotification) => j.status === "ADMIT_CARD_OUT" || j.status === "RESULT_OUT" || nextExamDate(j) !== null;
  const underWayRest = underWay.filter((j) => !inTabs(j));
  // a state with nothing of its own open: the ten biggest All-India jobs, not the whole central list (21 Nov)
  const allIndia = jobs.filter((j) => j.isCentral && isOpenOrOpening(j))
    .sort((a, b) => (b.totalVacancies || 0) - (a.totalVacancies || 0)).slice(0, 10);
  const pageUrl = `${SITE}/state/${state.slug}`;
  const structured = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${state.name} Government Jobs ${YEAR}`,
    url: pageUrl,
    about: { "@type": "AdministrativeArea", name: state.name },
    mainEntity: {
      "@type": "ItemList",
      name: `Open ${state.name} government job notifications`,
      numberOfItems: facts.open.length,
      itemListElement: facts.open.slice(0, 50).map((j, i) => ({
        "@type": "ListItem", position: i + 1, name: j.title, url: `${SITE}${getJobCanonicalPath(j)}`,
      })),
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar currentStateSlug={state.slug} />
      {facts.open.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(structured) }} />
      )}

      {/* Editorial State Header with Regional Tint Accent */}
      <section className="border-b border-line bg-subtle py-5 sm:py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs items={[{ label: state.name }]} className="mb-3" />

          {/* the state's name and what the page holds; 11 Nov: the code badge, capital and "State Hub" address pill went */}
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink tracking-tight">
              {state.name} Government Jobs {YEAR}
            </h1>
            <span className="text-sm sm:text-base font-semibold text-muted">
              {state.nativeName}
            </span>
          </div>
          {/* on phones the counted line below says more in less room, so the jobs start higher (20 Nov critique) */}
          <p className="hidden sm:block mt-2 text-sm text-ink-2 max-w-2xl leading-relaxed">
            Recruitments from {state.name}&apos;s commissions, boards, courts and departments, each with its last date
            and the link to the official notification.
          </p>
          {/* nothing of its own open: said plainly, and the list below is labelled central (20 Nov critique) */}
          {!ownOpen && (
            <p className="mt-3 text-sm text-ink max-w-prose leading-relaxed">
              <b>No {state.name} notification is open for applications right now.</b>
              {" "}Below: the {sitesLink || "official sites we check"}
              {centralOpen > 0 && <>, <a href="#all-india" className="font-semibold text-navy underline underline-offset-2 hover:text-saffron">All-India jobs</a> open to candidates from every state</>}
              {underWay.length > 0 && <>, and <a href="#recruitments-under-way" className="font-semibold text-navy underline underline-offset-2 hover:text-saffron">{underWay.length} {state.name} recruitment{underWay.length === 1 ? "" : "s"} under way</a> (admit cards, results)</>}.
            </p>
          )}
          {/* at a glance: counted from the notices themselves, never written by hand */}
          {facts.open.length > 0 && (
            <p className="sm:hidden mt-2 text-sm text-ink">
              <b>{facts.open.length.toLocaleString("en-IN")}</b> open
              {facts.posts > 0 && <> · <b>{facts.posts.toLocaleString("en-IN")}</b> posts</>}
              {facts.closingSoon.length > 0 && <> · <a href="#closing-soon" className="font-semibold text-navy underline underline-offset-2">{facts.closingSoon.length} close{facts.closingSoon.length === 1 ? "s" : ""} this week</a></>}
              {sitesLink && <> · {sitesLink}</>}
            </p>
          )}
          {facts.open.length > 0 && (
            <p className="hidden sm:block mt-3 text-sm text-ink max-w-3xl leading-relaxed">
              <b>{facts.open.length.toLocaleString("en-IN")}</b> {state.name} notification{facts.open.length === 1 ? " is" : "s are"} open
              {facts.posts > 0 && <> for <b>{facts.posts.toLocaleString("en-IN")}</b> posts</>}
              {facts.bodies.length > 0 && <>, from {bodiesPhrase(facts.bodies)}</>}.
              {facts.closingSoon.length > 0 && <> <a href="#closing-soon" className="font-semibold text-navy underline underline-offset-2 hover:text-saffron">{facts.closingSoon.length} close{facts.closingSoon.length === 1 ? "s" : ""} this week</a>.</>}
              {facts.biggest && (facts.biggest.totalVacancies || 0) > 1 && (
                <> Biggest: <Link href={getJobCanonicalPath(facts.biggest)} className="font-semibold text-navy underline underline-offset-2 hover:text-saffron">
                  {facts.biggest.orgShortCode.split(" · ")[0]} {rowTitle(facts.biggest).replace(/\s*\((?:KK|RPC)\)/g, "")}</Link>, {facts.biggest.totalVacancies.toLocaleString("en-IN")} posts.</>
              )}
              {sitesLink && <> See the {sitesLink}.</>}
            </p>
          )}

          {/* District buttons come back when notices record their district (11 Nov: every district page
              repeated the state's list, so they now lead here) */}
        </div>
      </section>

      {/* Main Content Area */}
      <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-8 flex-1 w-full space-y-10 [&>section:first-child]:border-t-0 [&>section:first-child]:pt-0">
        {ownOpen ? (
          <>
            {/* Karnataka's notices come in two cadres; the key comes before the rows that use it (21 Nov critique) */}
            {listJobs.some((j) => noticeArea(j)) && (
              <p className="-mb-6 text-[13px] text-ink-2 max-w-prose leading-relaxed">
                <b className="text-ink">Kalyana Karnataka (KK)</b> posts are in the region&apos;s local cadre (Article 371-J);{" "}
                <b className="text-ink">Rest of Karnataka</b> posts are in the residual parent cadre (RPC). Each notification
                says who may apply to which.
              </p>
            )}
            <MajorRecruitmentsSection
              jobs={listJobs.map(forList)}
              currentStateSlug={state.slug}
              defaultScope="STATE"
              heading={`Latest ${state.name} government jobs`}
              centralLink={centralOpen > 0 ? { href: "/?scope=central#major-recruitments", count: centralOpen } : undefined}
              tabs={[...STATE_TABS]}
              layoutSwitch={false}
              headingOnPhone={false}
            />
            <OpenJobLinks jobs={listJobs} heading={`All open ${state.name} government job notifications`} />
            {/* exams and results are the list's tabs; here only what they do not hold (answer keys, lists...) */}
            <ExamsInProgressSection jobs={underWayRest} limit={4} expandRest place={state.name}
              heading={`More ${state.name} recruitments under way`}
              note={<>Exam dates, admit cards and results are in the <a href="#exam-dates" className="font-semibold text-navy underline underline-offset-2">Exams</a> and{" "}
                <a href="#results" className="font-semibold text-navy underline underline-offset-2">Results</a> tabs above.</>} />
          </>
        ) : (
          <>
            {/* nothing of its own open: the state's own recruitments under way, the sites we check, then All-India jobs */}
            <StateBoardsSection stateSlug={state.slug} stateName={state.name} compact />
            {allIndia.length > 0 && (
              <section aria-labelledby="all-india-h" id="all-india" className="scroll-mt-28 border-t border-line pt-6">
                <h2 id="all-india-h" className="font-serif text-xl font-bold text-ink">
                  All-India jobs open to {state.name} candidates{" "}
                  <span className="ml-1 font-sans text-base font-semibold text-muted tabular-nums">{centralOpen}</span>
                </h2>
                <p className="mt-1 text-sm text-ink-2 max-w-prose">
                  Central government recruitments any state&apos;s candidates may apply to, biggest first. Some are for posts in one city: the notice says where.
                </p>
                <ul className="mt-2 divide-y divide-line-soft">
                  {allIndia.map((j) => (
                    <li key={j.id}>
                      <Link href={getJobCanonicalPath(j)} className="group block py-3">
                        <span className="block text-sm font-semibold text-ink group-hover:text-navy leading-snug">
                          <span className="font-bold text-navy">{j.orgShortCode}</span> {rowTitle(j)}
                        </span>
                        <span className="mt-0.5 block text-[13px] text-ink-2 tabular-nums">
                          {j.totalVacancies ? `${j.totalVacancies.toLocaleString("en-IN")} post${j.totalVacancies === 1 ? "" : "s"}` : "Posts: see notification"}
                          {j.applicationEndDate && <> · last date <b className="text-ink">{formatDateShort(j.applicationEndDate)}</b>
                            {(() => {
                              const d = getDaysRemaining(j.applicationEndDate);
                              return d >= 0 && d <= 7 ? <b className="text-saffron"> · {d === 0 ? "closes today" : `${d} day${d === 1 ? "" : "s"} left`}</b> : null;
                            })()}</>}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {centralOpen > allIndia.length && (
                  <Link href="/?scope=central#major-recruitments" className="mt-1 inline-flex min-h-[44px] items-center text-sm font-bold text-navy hover:text-saffron">
                    See all {centralOpen} central government jobs →
                  </Link>
                )}
              </section>
            )}
            <ExamsInProgressSection jobs={underWay} limit={4} expandRest place={state.name} />
          </>
        )}

        {/* Reserved Ad Space (0.00 CLS Protected) */}
        <ReservedAdSlot slotType="leaderboard" slotId={`state-${state.slug}-leaderboard`} />

        {/* The bodies that recruit here, and more ways in; the age check has its own page */}
        <section aria-labelledby="bodies-h" className="border-t border-line pt-6 space-y-4">
          <h2 id="bodies-h" className="font-serif text-xl font-bold text-ink">{facts.bodies.length ? `Who is hiring in ${state.name}` : "More ways to find jobs"}</h2>
          {facts.bodies.length > 0 && (
            <ul className="flex flex-wrap gap-2 text-sm">
              {facts.bodies.slice(0, 16).map((b) => (
                <li key={b.name}>
                  <Link href={b.href} title={b.name}
                    className="inline-flex min-h-[44px] flex-wrap items-center gap-x-2 rounded-lg border border-line bg-surface px-3.5 py-2 font-semibold leading-snug text-ink hover:border-navy hover:text-navy">
                    {b.code && b.code.length <= 10 ? b.code : b.name}
                    <span className="font-normal text-muted tabular-nums">{b.open} open{b.posts > 0 ? ` · ${b.posts.toLocaleString("en-IN")} posts` : ""}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {(() => {
            // a listed exam whose first word is a body already hiring ("KEA Exams" when KEA is above) is left out
            const hiring = facts.bodies.map((b) => `${b.code} ${b.name}`.toLowerCase());
            const others = state.majorExams.filter((e) => {
              const first = e.split(/[\s/]/)[0].toLowerCase();
              return !hiring.some((h) => h.includes(e.toLowerCase()) || h.split(" ").includes(first));
            });
            // the full list of official sites below replaces this line where the agent watches the state
            return others.length > 0 && !hasStateBoards(state.slug) && (
              <p className="text-sm text-ink-2">
                {facts.bodies.length > 0 ? "Also recruits here: " : "Recruiting bodies: "}{others.join(", ")}
              </p>
            );
          })()}
          <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm font-semibold">
            {[
              { href: "/calculator", label: "Check which jobs your age fits" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex items-center min-h-[44px] text-navy hover:text-saffron underline-offset-4 hover:underline">
                  {l.label} →
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {ownOpen && <StateBoardsSection stateSlug={state.slug} stateName={state.name} compact />}
      </main>

      <Footer />
    </div>
  );
}
