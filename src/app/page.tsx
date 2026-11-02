import React from "react";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { SocialAlertBar } from "@/components/common/SocialAlertBar";
import { MajorRecruitmentsSection } from "@/components/jobs/MajorRecruitmentsSection";
import { getListingJobs, getExamsInProgress, todayIST, getJobCanonicalPath } from "@/data/jobs";
import { rowTitle } from "@/components/jobs/JobListCard";
import type { JobNotification } from "@/data/jobs";
import { getAllJobs } from "@/lib/jobs-store";
import { HomeSearch } from "@/components/home/HomeSearch";
import { NewsTicker } from "@/components/home/NewsTicker";



// ticker text: the post (the body's code is shown in bold before it), cut short
function tickerTitle(j: JobNotification): string {
  const t = rowTitle(j);
  return t.length > 60 ? t.slice(0, 58).trimEnd() + "…" : t;
}

// what the list needs of a job: the page sends every listed job to the browser, so the long
// texts only the job page shows stay behind
function forList(j: JobNotification): JobNotification {
  return {
    ...j,
    salary: "", ageRelaxation: "", syllabusSummary: "", selectionProcess: [], updates: undefined,
    districtWiseVacancies: undefined, verificationSource: undefined,
    posts: j.posts?.map((p) => ({ postName: p.postName, vacancies: 0, qualification: p.qualification, ageLimit: "", pay: "" })),
    stages: j.stages?.map((s) => ({ ...s, title: s.summary && /[ऀ-෿]/.test(s.title) ? s.title.slice(0, 80) : s.title })),
  };
}

const EXAMPLE_AGE = 25;

const MONTHS3 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2 Nov, 18:52 IST" from a database timestamp. */
function istStamp(ts: string): string | null {
  const t = Date.parse(ts.replace(" ", "T").replace(/([+-]\d\d)$/, "$1:00"));
  if (Number.isNaN(t)) return null;
  const d = new Date(t + 5.5 * 3600 * 1000);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${d.getUTCDate()} ${MONTHS3[d.getUTCMonth()]}, ${hh}:${mm} IST`;
}


// the year in the title follows the calendar (set when the page is built)
const YEAR = new Date().getFullYear();

export const metadata = {
  title: `Latest Government Jobs ${YEAR}, Sarkari Naukri Notifications | India Job Notice`,
  description: "Government job notifications from official sources across India: last dates, eligibility, admit cards and results for central and state recruitments.",
  alternates: {
    canonical: "https://www.indiajobnotice.com",
  },
  openGraph: {
    title: "India Job Notice - Central & State Government Jobs",
    description: "Official notifications, admit cards and results from official websites, central and state.",
    url: "https://www.indiajobnotice.com",
    siteName: "India Job Notice",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "India Job Notice - Government Job Notifications",
    description: "Official notifications, admit cards, exam schedules and results.",
  },
};

export default async function HomePage() {
  const allJobs = await getAllJobs();
  const listedJobs = getListingJobs(allJobs);
  // recruitments whose applications opened in the last 7 days (the date the site added a notice
  // says little: everything already open was added when the site started publishing)

  // age box example: open jobs that state an age limit, and how many take a 25-year-old
  const openWithAge = listedJobs.filter((j) => (j.status === "APPLY_OPEN" || j.status === "LAST_DATE_NEAR")
    && j.ageKnown !== false && j.maxAge > 0);
  const openCount = openWithAge.length;
  const openNow = listedJobs.filter((j) => j.status === "APPLY_OPEN" || j.status === "LAST_DATE_NEAR").length;
  const exampleCount = openWithAge.filter((j) => EXAMPLE_AGE <= j.maxAge && (!j.minAge || EXAMPLE_AGE >= j.minAge)).length;

  // when the newest notice was published (IST), for the proof line
  const newest = allJobs.map((j) => j.publishedAt || "").sort().pop();
  const latestAdded = newest ? istStamp(newest) : null;

  // one list: listed jobs plus recruitments under way, each once
  const listedIds = new Set(listedJobs.map((j) => j.id));
  const listJobs = [...listedJobs, ...getExamsInProgress(allJobs).filter((j) => !listedIds.has(j.id))].map(forList);
  // the same numbers as the Open and Under way tabs
  const underWay = listJobs.filter((j) => j.inProgress).length;

  // ticker: newest open notifications first
  const latest = listedJobs
    .filter((j) => (j.status === "APPLY_OPEN" || j.status === "LAST_DATE_NEAR") && j.applicationStartDate)
    .sort((a, b) => b.applicationStartDate.localeCompare(a.applicationStartDate))
    .slice(0, 12);

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <a
        href="#results-count"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-3 focus:rounded-lg focus:bg-navy-solid focus:text-white focus:font-bold"
      >
        Skip to the job list
      </a>
      <Navbar currentStateSlug="central" />

      <main id="main-content" className="flex-1 w-full flex flex-col">
      {/* Hero: heading, proof line and search; the age check has its own section above the footer */}
      <section className="border-b border-line bg-subtle py-5 sm:py-7 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex-1 min-w-0">
            <h1 className="font-serif text-[22px] sm:text-4xl lg:text-[40px] font-bold text-ink tracking-tight leading-tight text-balance">
              Government jobs, read from the official notice
            </h1>
            <p className="mt-2 text-sm text-ink-2 max-w-2xl">
              <b className="text-ink">{openNow} open now</b> · {underWay} more with exams or results to come, each read from its official notice.{" "}
              {latestAdded && <>Latest added {latestAdded}. </>}
              <Link href="/editorial-policy" className="font-semibold text-navy underline underline-offset-2">
                How we verify
              </Link>
            </p>

            {/* search sits in the hero: the first job is one screen closer */}
            <div className="mt-4 max-w-2xl">
              <HomeSearch
                extra={
                  <a
                    href="#age-check"
                    className="inline-flex items-center gap-1.5 min-h-[44px] text-[13px] font-semibold text-navy hover:underline"
                  >
                    Check jobs for your age <ArrowDown className="w-4 h-4" aria-hidden />
                  </a>
                }
              />
            </div>
          </div>

        </div>
      </section>

      {/* Latest notices ticker (tablets and up): stops on hover, focus, touch or the Pause button */}
      <NewsTicker
        items={latest.map((j) => ({
          id: j.id,
          href: getJobCanonicalPath(j),
          code: j.orgShortCode,
          title: tickerTitle(j),
          posts: j.totalVacancies || 0,
        }))}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-6 flex-1 w-full space-y-12">
        {/* Jobs: search, filters and the list come first */}
        <MajorRecruitmentsSection jobs={listJobs} currentStateSlug="central" hideSearch showLayoutSwitch={false} />

        {/* Alerts */}
        <SocialAlertBar />

        {/* Age check: date of birth -> the open jobs whose age limit includes it */}
        <section
          id="age-check"
          aria-labelledby="age-check-title"
          className="scroll-mt-24 rounded-2xl border border-line bg-surface p-5 sm:p-6 grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
        >
          <div>
            <h2 id="age-check-title" className="font-serif text-xl sm:text-2xl font-bold text-ink">Am I eligible?</h2>
            <p className="mt-1.5 text-sm text-ink-2 max-w-[60ch]">
              Enter your date of birth to see the open jobs whose age limit includes you.
              {exampleCount > 0 && (
                <> For example, a {EXAMPLE_AGE}-year-old is within the age limit of <b className="text-ink">{exampleCount}</b> of
                the {openCount} open jobs that give one.</>
              )}
            </p>
          </div>
          <form action="/calculator" method="get" className="flex flex-col sm:flex-row gap-2 sm:items-start">
            <label className="block">
              <span className="block text-[12px] font-semibold text-muted mb-1">Your date of birth</span>
              <input
                type="date"
                name="dob"
                required
                max={todayIST()}
                aria-describedby="dob-hint"
                className="w-full sm:w-52 h-11 px-3 rounded-lg border border-control bg-surface text-[15px] text-ink focus:border-navy"
              />
              <span id="dob-hint" className="block text-[12px] text-muted mt-1">Day, month, year, e.g. 15-08-2000</span>
            </label>
            <button
              type="submit"
              className="h-11 px-5 sm:mt-[22px] rounded-lg bg-navy-solid hover:bg-navy-strong text-white font-bold text-sm whitespace-nowrap"
            >
              Check jobs for my age
            </button>
          </form>
        </section>
      </div>
      </main>

      <Footer />
    </div>
  );
}
