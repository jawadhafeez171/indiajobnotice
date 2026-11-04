import React from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronRight, UserRound } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { TelegramLogo, WhatsAppLogo } from "@/components/common/SocialIcons";
import { MajorRecruitmentsSection } from "@/components/jobs/MajorRecruitmentsSection";
import { getListingJobs, getExamsInProgress, todayIST } from "@/data/jobs";
import type { JobNotification } from "@/data/jobs";
import { getAllJobs } from "@/lib/jobs-store";
import { HomeSearch } from "@/components/home/HomeSearch";
import { TodaySummary } from "@/components/home/TodaySummary";
import { HeroBackdrop } from "@/components/home/HeroBackdrop";


// what the list needs of a job: the page sends every listed job to the browser, so the long
// texts only the job page shows stay behind
function forList(j: JobNotification): JobNotification {
  return {
    ...j,
    salary: "", ageRelaxation: "", syllabusSummary: "", selectionProcess: [],
    // only the date changes' days (the Today tab), not their text
    updates: j.updates?.filter((u) => u.found).map((u) => ({ date: u.date, text: "", url: "", found: u.found })),
    districtWiseVacancies: undefined, verificationSource: undefined,
    posts: j.posts?.map((p) => ({ postName: p.postName, vacancies: 0, qualification: p.qualification, ageLimit: "", pay: "" })),
    stages: j.stages?.map((s) => ({ ...s, title: s.summary && /[ऀ-෿]/.test(s.title) ? s.title.slice(0, 80) : s.title })),
  };
}

const MONTHS3 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2 Nov, 18:52 IST" from a database timestamp. */
function istStamp(ts: string): string | null {
  const t = Date.parse(ts.replace(" ", "T").replace(/([+-]\d\d)$/, "$1:00"));
  if (Number.isNaN(t)) return null;
  const d = new Date(t + 5.5 * 3600 * 1000);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  // no line break inside the day or the time
  return `${d.getUTCDate()}\u00a0${MONTHS3[d.getUTCMonth()]}, ${hh}:${mm}\u00a0IST`;
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
    title: "India Job Notice: Verified Government Job Alerts",
    description: "Central and state government jobs with last dates, eligibility and the official notification link, read from each recruiting body's own notice.",
    url: "https://www.indiajobnotice.com",
    siteName: "India Job Notice",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "India Job Notice: Verified Government Job Alerts",
    description: "Central and state government jobs with last dates, eligibility and the official notification link, read from each recruiting body's own notice.",
  },
};

export default async function HomePage() {
  const allJobs = await getAllJobs();
  const listedJobs = getListingJobs(allJobs);
  const openNow = listedJobs.filter((j) => j.status === "APPLY_OPEN" || j.status === "LAST_DATE_NEAR").length;

  // when the newest notice was published (IST), for the proof line
  const newest = allJobs.map((j) => j.publishedAt || "").sort().pop();
  const latestAdded = newest ? istStamp(newest) : null;

  // one list: listed jobs plus recruitments under way, each once
  const listedIds = new Set(listedJobs.map((j) => j.id));
  const listJobs = [...listedJobs, ...getExamsInProgress(allJobs).filter((j) => !listedIds.has(j.id))].map(forList);
  // the same numbers as the Open and Under way tabs
  const underWay = listJobs.filter((j) => j.inProgress).length;

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
      {/* Hero: heading, proof line and search on the navy band */}
      <section className="on-dark relative overflow-hidden px-4 sm:px-6 pt-7 pb-6 sm:pt-8 sm:pb-8 bg-[linear-gradient(115deg,#061438_0%,#0B2862_58%,#103B83_100%)]">
        <HeroBackdrop />
        {/* text and search above the decoration */}
        <div className="relative max-w-6xl mx-auto">
          <h1 className="font-display text-[28px] sm:text-[34px] lg:text-[44px] font-bold text-white tracking-tight leading-[1.12] text-balance">
            Government jobs, read from the <span className="text-[#FF841C]">official notice</span>
          </h1>
          <p className="mt-3 text-sm sm:text-[15px] leading-normal text-[#E1E8F5] max-w-2xl">
            <b className="text-white">{openNow} open now</b> · {underWay} more with exams or results to come, each read from its official notice.{" "}
            <span className="text-[#C0D0E8] sm:block sm:mt-0.5">
              {latestAdded && <>Latest added {latestAdded}. </>}
              <Link href="/editorial-policy" className="py-2.5 font-semibold text-white underline underline-offset-2">
                How we verify
              </Link>
            </span>
          </p>

          {/* search sits in the hero: the first job is one screen closer */}
          <div className="mt-4 max-w-2xl">
            <HomeSearch
              onDark
              extra={
                <a
                  href="#age-check"
                  className="inline-flex items-center gap-1.5 min-h-[44px] text-[14px] font-semibold text-white hover:underline"
                >
                  <UserRound className="w-4 h-4" aria-hidden />
                  Check jobs for your age <ArrowRight className="w-4 h-4" aria-hidden />
                </a>
              }
            />
          </div>
        </div>
      </section>

      {/* What changed today: one line, opening the Today tab of the list */}
      <TodaySummary jobs={listJobs} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-8 flex-1 w-full xl:grid xl:grid-cols-[minmax(0,1fr)_21rem] xl:gap-6 xl:items-start">
        {/* Jobs: the stage tabs, the count and the list */}
        <MajorRecruitmentsSection jobs={listJobs} currentStateSlug="central" hideSearch showLayoutSwitch={false} narrow />

        {/* Side column on wide screens; under the list on phones */}
        <aside className="mt-10 xl:mt-[3.25rem] space-y-4" aria-label="Age check and alerts">
          {/* Age check: date of birth -> the open jobs whose age limit includes it */}
          <section
            id="age-check"
            aria-labelledby="age-check-title"
            className="scroll-mt-24 rounded-2xl border border-line bg-surface p-5 shadow-sm"
          >
            <h2 id="age-check-title" className="flex items-center gap-2.5 font-display text-[22px] font-bold tracking-tight text-ink">
              <CalendarDays className="w-6 h-6 text-navy" aria-hidden />
              Am I eligible?
            </h2>
            <p className="mt-1.5 text-sm text-ink-2">
              Enter your date of birth to see the open jobs whose age limit includes you.
            </p>
            <form action="/calculator" method="get" className="mt-4 space-y-3">
              <input
                type="date"
                name="dob"
                required
                max={todayIST()}
                aria-label="Your date of birth"
                className="w-full h-12 px-3 rounded-lg border border-control bg-surface text-[15px] text-ink focus:border-navy"
              />
              <button
                type="submit"
                className="w-full h-12 rounded-lg bg-navy-solid hover:bg-navy-strong text-white font-bold text-[15px]"
              >
                Check jobs for my age
              </button>
            </form>
          </section>

          {/* Alerts: both channels, each in its own brand colour */}
          <section aria-label="Job alerts" className="space-y-2.5">
            <a
              href="https://t.me/india_jobnotice"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-[#1A7DB0] hover:bg-[#156C99] text-white transition-colors"
            >
              <TelegramLogo className="w-7 h-7 shrink-0" />
              <span className="flex-1 min-w-0">
                <span className="block font-bold text-[15px] leading-tight">Join our Telegram Channel</span>
                <span className="block text-[12px] text-white/85 mt-0.5">Get job alerts and updates</span>
              </span>
              <ChevronRight className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </a>
            <a
              href="https://whatsapp.com/channel/0029Vb9GFwsGzzKXYJyKer1C"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-[#13853F] hover:bg-[#0E7A3E] text-white transition-colors"
            >
              <WhatsAppLogo className="w-7 h-7 shrink-0" />
              <span className="flex-1 min-w-0">
                <span className="block font-bold text-[15px] leading-tight">Join our WhatsApp Channel</span>
                <span className="block text-[12px] text-white/85 mt-0.5">Get new notifications on WhatsApp</span>
              </span>
              <ChevronRight className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </a>
          </section>
        </aside>
      </div>
      </main>

      <Footer />
    </div>
  );
}
