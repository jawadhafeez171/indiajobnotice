import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { BoardJobs } from "@/components/boards/BoardJobs";
import { getStateBySlug } from "@/config/states";
import { getJobCanonicalPath, JobNotification, todayIST } from "@/data/jobs";
import { getAllJobsDaily, getSourcesCheckedAt } from "@/lib/jobs-store";
import { Board, boardCode, boardHasListings, boardJobs, boardPath, getBoard, getBoardsOfState } from "@/lib/boards";
import { rowTitle } from "@/components/jobs/JobListCard";
import { forList } from "@/lib/list-jobs";
import { safeJson } from "@/lib/json-ld";
import { stateBoardCount } from "@/components/jobs/StateBoardsSection";
import { SITE_OG_IMAGES } from "@/lib/site-image";
import { YEAR } from "@/lib/year";
import { formatDate, formatDateShort } from "@/lib/utils";

// One official recruiting body (21 Nov, owner's plan): its open notices, recruitments under way and earlier ones,
// from the daily copy of the job list (rebuilt at most once a day: Vercel counts every rebuild).

const SITE = "https://www.indiajobnotice.com";

interface PageProps {
  params: Promise<{ state: string; board: string }>;
}

// built on first visit, then cached (as job and district pages)
export async function generateStaticParams() {
  return [];
}

/** The group's name for one body: "Power, transport and state companies" -> "State company". */
const KIND: Record<string, string> = {
  "Public service commissions": "Public service commission",
  "Recruitment and selection boards": "Recruitment and selection board",
  "Police, forest and uniformed services": "Police, forest or uniformed service",
  "Health and medical": "Health and medical",
  "Education and universities": "Education or university",
  "Power, transport and state companies": "State company",
  "Banks": "Bank",
  "State government": "State government",
  "Courts": "Court",
};

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** The department a notice recruits for, from its own organisation name; "" when it is the board itself. */
function department(job: JobNotification, board: Board): string {
  const o = job.organization.trim();
  const forWhom = o.match(/\(for (?:the )?([^)]+)\)/i);
  if (forWhom) return forWhom[1].trim();
  if (o.toLowerCase().startsWith(board.name.toLowerCase())) {
    const rest = o.slice(board.name.length).replace(/\([^)]*\)/g, "").replace(/^[\s,–-]+/, "").trim();
    return rest && !/^(government|karnataka government)/i.test(rest) ? rest : "";
  }
  const inBrackets = o.match(/\(([^)]*department)\)\s*$/i);
  if (inBrackets) return inBrackets[1].trim();
  return o.replace(/\s*\([^)]*\)\s*$/, "").replace(/,\s*[A-Z][a-z]+$/, "").trim();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state: stateSlug, board: boardSlug } = await params;
  const state = getStateBySlug(stateSlug);
  const board = state && getBoard(state.slug, boardSlug);
  if (!state || !board) return { title: "Not found" };
  const all = await getAllJobsDaily();
  const { open, underWay } = boardJobs(board, all);
  const code = boardCode(board, all);
  const name = board.members ? `${state.name} ${board.slug === "district-courts" ? "District Court" : "District Recruitment Bureau"}` : board.name;
  const url = `${SITE}${boardPath(board)}`;
  const posts = open.reduce((n, j) => n + (j.totalVacancies || 0), 0);
  const lead = `${code || name} Recruitment ${YEAR}`;
  const counted = open.length ? `${lead}: ${open.length} Notification${open.length === 1 ? "" : "s"} Open` : lead;
  const title = counted.length <= 60 ? counted : lead.length <= 60 ? lead : `${name} Recruitment`;
  const plainT = (j: JobNotification) => {
    const area = rowTitle(j).match(/\((KK|RPC)\)/)?.[1];
    const t = rowTitle(j).replace(/\s*\((?:KK|RPC)\)/g, "").trim();
    return area ? `${t}, ${area === "KK" ? "Kalyana Karnataka" : "Rest of Karnataka"}` : t;
  };
  const first = open.slice(0, 2).map((j) => `${plainT(j)}${j.totalVacancies ? ` (${j.totalVacancies.toLocaleString("en-IN")} posts` : " ("}${j.applicationEndDate ? `${j.totalVacancies ? ", " : ""}last date ${formatDateShort(j.applicationEndDate)})` : j.totalVacancies ? ")" : ""}`.replace(/ \($/, ""));
  const who = code && !name.includes(`(${code})`) ? `${name} (${code})` : name;
  const description = (open.length
    ? `${who}: ${open.length} notification${open.length === 1 ? "" : "s"} open${posts ? ` for ${posts.toLocaleString("en-IN")} posts` : ""}. ${first.join("; ")}.${underWay.length ? ` ${underWay.length} more under way.` : ""} Official links.`
    : `${who} recruitment ${YEAR}: ${underWay.length ? `${underWay.length} recruitment${underWay.length === 1 ? "" : "s"} under way (admit cards, answer keys, results), ` : ""}earlier notices and the official links.`).slice(0, 300);
  return {
    title,
    description,
    alternates: { canonical: url },
    // nothing open or under way: out of search until there is (same rule as state pages)
    robots: open.length + underWay.length ? undefined : { index: false, follow: true },
    openGraph: { images: SITE_OG_IMAGES, title, description, url, siteName: "India Job Notice", locale: "en_IN", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BoardPage({ params }: PageProps) {
  const { state: stateSlug, board: boardSlug } = await params;
  const state = getStateBySlug(stateSlug);
  const board = state && getBoard(state.slug, boardSlug);
  if (!state || !board) notFound();

  const all = await getAllJobsDaily();
  const local = (j: JobNotification): JobNotification => ({ ...j, orgShortCode: (j.orgShortCode || "").split(" · ")[0] });
  const { open: open0, underWay: underWay0, earlier: earlier0 } = boardJobs(board, all);
  const [open, underWay, earlier] = [open0.map(local), underWay0.map(local), earlier0.map(local)];
  const checkedAt = await getSourcesCheckedAt(board.sources);
  const checkedText = checkedAt
    ? new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(checkedAt))
    : null;
  const posts = open.reduce((n, j) => n + (j.totalVacancies || 0), 0);
  const week = new Date(Date.parse(todayIST()) + 7 * 86400000).toISOString().slice(0, 10);
  const closingSoon = open.filter((j) => j.applicationEndDate && j.applicationEndDate <= week).length;
  const dept = Object.fromEntries([...open, ...underWay, ...earlier].map((j) => [j.id, board.members
    ? j.organization.replace(/\s*\([^)]*\)/g, "").replace(/,\s*$/, "").trim() : department(j, board)]));
  const title = board.members ? `${board.name} in ${state.name}` : board.name;
  const code = boardCode(board, all);
  const shownCode = code && !board.name.includes(`(${code})`) ? code : "";
  const biggest = [...open].sort((a, b) => (b.totalVacancies || 0) - (a.totalVacancies || 0))[0];
  const depts = [...new Set(Object.values(dept).filter(Boolean))];
  // the post's name as the lists say it, its cadre in words: "Second Division Assistant, 2026 (Rest of Karnataka)"
  const plain = (j: JobNotification) => {
    const area = rowTitle(j).match(/\((KK|RPC)\)/)?.[1];
    const t = rowTitle(j).replace(/\s*\((?:KK|RPC)\)/g, "").trim();
    return area ? `${t} (${area === "KK" ? "Kalyana Karnataka" : "Rest of Karnataka"})` : t;
  };
  const who = shownCode || title;
  const many = Boolean(board.members);
  const factsLine = (
    <>
      {open.length > 0 ? (
        <>
          {who} {many ? "have" : "has"} {open.length} recruitment notification{open.length === 1 ? "" : "s"} open
          {posts > 0 && <> for {posts.toLocaleString("en-IN")} posts</>}.
          {biggest && (biggest.totalVacancies || 0) > 1 && open.length > 1 && <> Biggest: {plain(biggest)}, {biggest.totalVacancies.toLocaleString("en-IN")} posts
            {biggest.applicationEndDate && <>, last date {formatDate(biggest.applicationEndDate)}</>}.</>}
        </>
      ) : <>No notification from {who} is open for applications right now.</>}
      {underWay.length > 0 && <> {underWay.length} recruitment{underWay.length === 1 ? " is" : "s are"} under way, with admit cards, answer keys or results.</>}
      {depts.length > 0 && !many && <> {who} also posts notices for {depts.slice(0, 3).join(", ")}{depts.length > 3 ? ` and ${depts.length - 3} more` : ""}.</>}
    </>
  );
  // other bodies of the state with notices open now: where a reader (and a crawler) goes next
  const others = getBoardsOfState(state.slug).filter((b) => b.slug !== board.slug && boardHasListings(b, all))
    .map((b) => ({ b, n: boardJobs(b, all).open.length })).sort((x, y) => y.n - x.n).slice(0, 12);

  const structured = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${title} recruitment`,
    url: `${SITE}${boardPath(board)}`,
    description: `Recruitment notices of ${title}, from its official website.`,
    about: board.members ? undefined : {
      "@type": "GovernmentOrganization", name: board.name, ...(shownCode ? { alternateName: shownCode } : {}),
      url: board.url, areaServed: { "@type": "AdministrativeArea", name: state.name },
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: open.length + underWay.length,
      itemListElement: [...open, ...underWay].slice(0, 50).map((j, i) => ({ "@type": "ListItem", position: i + 1, name: j.title, url: `${SITE}${getJobCanonicalPath(j)}` })),
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar currentStateSlug={state.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(structured) }} />

      <section className="border-b border-line bg-subtle py-5 sm:py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs items={[{ label: state.name, href: `/state/${state.slug}` }, { label: title }]} className="mb-3" />
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink tracking-tight text-balance">
            {board.members ? `${state.name} ${board.slug === "district-courts" ? "District Court" : "District Recruitment Bureau"}` : title}
            {shownCode && <> ({shownCode})</>}{" "}
            <span className="mt-1 block font-sans text-lg sm:text-xl font-semibold text-ink-2">Recruitment {YEAR}</span>
          </h1>
          <p className="mt-1 text-[13px] font-semibold text-ink-2">{KIND[board.group] || board.group} · {state.name}</p>
          <p className="mt-2 text-sm text-ink">
            {open.length > 0 ? (
              <>
                <b>{open.length}</b> open{posts > 0 && <> · <b>{posts.toLocaleString("en-IN")}</b> posts</>}
                {closingSoon > 0 && <> · {closingSoon} close{closingSoon === 1 ? "s" : ""} this week</>}
              </>
            ) : (
              <>Nothing open right now{underWay.length > 0 && <> · {underWay.length} recruitment{underWay.length === 1 ? "" : "s"} under way</>}</>
            )}
          </p>
          {!board.members && (
            <a href={board.url} target="_blank" rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-[44px] max-w-full items-center gap-2 rounded-lg border border-navy-line bg-surface px-4 py-2 text-sm font-bold text-navy hover:border-navy">
              <span className="min-w-0 break-words">Official site: <span className="font-semibold">{hostOf(board.url)}</span></span>
              <ExternalLink className="h-4 w-4" aria-hidden /><span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
          {/* what the page holds, in a sentence of its own facts */}
          {checkedText && (
            <p className="mt-2 text-[13px] text-muted">
              We last checked {board.members ? "these sites" : "this site"} <time dateTime={checkedAt || undefined}>{checkedText}</time> IST.
              Applications are made on the official site.
            </p>
          )}
        </div>
      </section>

      <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full space-y-10">
        <BoardJobs open={open.map(forList)} underWay={underWay.map(forList)} earlier={earlier.map(forList)} dept={dept} boardName={board.name} stateName={state.name}
          sitesHref={`/state/${state.slug}#official-sites`} sitesCount={stateBoardCount(state.slug)} />

        {(open.length > 0 || underWay.length > 0) && (
          <section aria-labelledby="about-h" className="border-t border-line pt-6">
            <h2 id="about-h" className="font-serif text-xl font-bold text-ink">About these notices</h2>
            <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-ink-2">{factsLine}</p>
          </section>
        )}

        {board.members && (
          <section aria-labelledby="courts-h" className="border-t border-line pt-6">
            <h2 id="courts-h" className="font-serif text-xl font-bold text-ink">
              {board.name} we check <span className="ml-1 font-sans text-base font-semibold text-muted tabular-nums">{board.members.length}</span>
            </h2>
            <p className="mt-1 text-sm text-ink-2 max-w-[60ch]">Each link opens that court&apos;s official recruitment page in a new tab.</p>
            <ul className="mt-3 sm:columns-2 gap-x-8">
              {board.members.map((m) => (
                <li key={m.url} className="break-inside-avoid border-b border-line-soft">
                  <a href={m.url} target="_blank" rel="noopener noreferrer"
                    className="flex min-h-[44px] items-center justify-between gap-3 py-2 text-sm font-semibold text-ink hover:text-navy">
                    {m.name}<ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {others.length > 0 && (
          <section aria-labelledby="others-h" className="border-t border-line pt-6">
            <h2 id="others-h" className="font-serif text-xl font-bold text-ink">Other {state.name} bodies with notices</h2>
            <ul className="mt-3 flex flex-wrap gap-2 text-sm">
              {others.map(({ b, n }) => (
                <li key={b.slug}>
                  <Link href={boardPath(b)} className="inline-flex min-h-[44px] flex-wrap items-center gap-x-2 rounded-lg border border-line bg-surface px-3.5 py-2 font-semibold leading-snug text-ink hover:border-navy hover:text-navy">
                    {b.members ? `${b.name} in ${state.name}` : b.name}
                    <span className="font-normal text-muted tabular-nums">{n ? `${n} open` : "under way"}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* an empty board already links to the list in its message */}
        {open.length > 0 && <p className="border-t border-line pt-6 text-sm">
          <Link href={`/state/${state.slug}#official-sites`} className="inline-flex min-h-[44px] items-center font-semibold text-navy underline underline-offset-2 hover:text-saffron">
            All {stateBoardCount(state.slug)} official sites we check for {state.name} →
          </Link>
        </p>}
      </main>

      <Footer openStates />
    </div>
  );
}
