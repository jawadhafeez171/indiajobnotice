import React from "react";
import Link from "next/link";
import { POPULAR_STATES, STATES_REGISTRY, STATE_ZONES, StateInfo } from "@/config/states";
import { getLastCheckedAt } from "@/lib/jobs-store";
import { getStateSubdomainUrl, getCentralPortalUrl } from "@/lib/subdomains";
import { ShieldCheck, ChevronDown } from "lucide-react";
import { TelegramLogo, WhatsAppLogo, InstagramLogo, YouTubeLogo, INSTAGRAM_URL, YOUTUBE_URL } from "./SocialIcons";
import { BrandLogo } from "./BrandLogo";
import { StateJump } from "./StateJump";

type FooterLink = { href: string; label: string; external?: boolean; divider?: boolean };
type FooterGroup = { title: string; links: FooterLink[] };

const GROUPS: FooterGroup[] = [
  {
    title: "Jobs by category",
    links: [
      { href: "/organisations/upsc", label: "UPSC" },
      { href: "/organisations/ssc", label: "SSC" },
      { href: "/railway-jobs", label: "Railways" },
      { href: "/banking-jobs", label: "Banks" },
      { href: "/police-defense-jobs", label: "Police and defence" },
      { href: "/engineering-jobs", label: "Engineering" },
      { href: "/teaching-jobs", label: "Teaching" },
    ],
  },
  {
    title: "Tools and updates",
    links: [
      { href: "/?stage=exams#major-recruitments", label: "Admit cards and exam dates" },
      { href: "/?stage=results#major-recruitments", label: "Results" },
      { href: "/calculator", label: "Age calculator" },
      { href: "/calendar", label: "Exam calendar" },
      { href: "/vacancies", label: "Vacancies by qualification" },
      { href: "/directory", label: "Commissions and boards" },
      { href: getCentralPortalUrl(), label: "All India (central jobs)", external: true, divider: true },
    ],
  },
  {
    title: "By qualification",
    links: [
      { href: "/qualification/10th-pass", label: "10th Pass Govt Jobs" },
      { href: "/qualification/12th-pass", label: "12th Pass Govt Jobs" },
      { href: "/qualification/diploma", label: "Polytechnic & Diploma Jobs" },
      { href: "/qualification/graduate", label: "Graduate Degree Jobs" },
    ],
  },
];

function FooterAnchor({ link, className }: { link: FooterLink; className: string }) {
  return link.external ? (
    <a href={link.href} className={className}>{link.label}</a>
  ) : (
    <Link href={link.href} className={className}>{link.label}</Link>
  );
}

function SocialButtons() {
  // phones: labelled buttons a thumb can hit; desktop: the compact icons
  const base = "inline-flex items-center justify-center gap-2 rounded-lg text-white transition-colors shadow-xs min-h-[44px] px-4 text-sm font-semibold md:h-11 md:w-11 md:px-0";
  return (
    <div className="grid grid-cols-2 gap-2 pt-1 md:flex md:items-center">
      <a href="https://t.me/india_jobnotice" target="_blank" rel="noreferrer" aria-label="India Job Notice on Telegram (opens in a new tab)"
        title="Join Telegram Channel" className={`${base} bg-[#1A7DB0] hover:bg-[#156C99]`}>
        <TelegramLogo className="w-4 h-4" />
        <span className="md:sr-only">Telegram</span>
      </a>
      <a href="https://whatsapp.com/channel/0029Vb9GFwsGzzKXYJyKer1C" target="_blank" rel="noreferrer"
        aria-label="India Job Notice on WhatsApp (opens in a new tab)" title="Follow India Job Notice on WhatsApp" className={`${base} bg-[#13853F] hover:bg-[#0E7A3E]`}>
        <WhatsAppLogo className="w-4 h-4" />
        <span className="md:sr-only">WhatsApp</span>
      </a>
      <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="India Job Notice on Instagram (opens in a new tab)"
        title="Follow India Job Notice on Instagram" className={`${base} bg-instagram`}>
        <InstagramLogo className="w-4 h-4" />
        <span className="md:sr-only">Instagram</span>
      </a>
      <a href={YOUTUBE_URL} target="_blank" rel="noreferrer" aria-label="India Job Notice on YouTube (opens in a new tab)"
        title="India Job Notice on YouTube" className={`${base} bg-[#CC0000] hover:bg-[#B00000]`}>
        <YouTubeLogo className="w-4 h-4" />
        <span className="md:sr-only">YouTube</span>
      </a>
    </div>
  );
}

export async function Footer({ openStates = false }: { openStates?: boolean } = {}) {
  // when the agent last checked the official sites (its own records); nothing said when unknown
  const checked = await getLastCheckedAt();
  const checkedText = checked
    ? new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(checked))
    : null;
  // the states asked for most first, then the rest in order
  const states = [
    ...POPULAR_STATES.map((slug) => STATES_REGISTRY.find((x) => x.slug === slug)).filter((x): x is StateInfo => Boolean(x)),
    ...[...STATES_REGISTRY].filter((x) => !POPULAR_STATES.includes(x.slug)).sort((x, y) => x.name.localeCompare(y.name)),
  ];
  return (
    <footer className="on-dark bg-navy-deep text-on-navy mt-12 md:mt-20 relative">
      {/* Top Tricolor Accent Line extending across the entire page */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-saffron-solid" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-green-solid" />
      </div>

      {/* Main Footer Links */}
      <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <a href={getCentralPortalUrl()} className="inline-block transition-transform hover:opacity-95" title="India Job Notice Home">
              <BrandLogo variant="light" height={25} />
              <span className="block mt-1 text-[12px] leading-none font-semibold tracking-wide text-on-navy">Verified government job alerts</span>
            </a>

            <p className="text-xs text-on-navy leading-relaxed">
              Government job notifications from official websites, with last dates, eligibility, admit
              cards and results, and a link to each official notification.
            </p>
            {checkedText && (
              <p className="text-xs text-on-navy">
                We check the official sites three times a day. Last check: <time dateTime={checked || undefined} className="whitespace-nowrap font-semibold text-white">{checkedText} IST</time>.{" "}
                <Link href="/editorial-policy" className="inline-flex min-h-[44px] items-center font-semibold text-saffron-light underline underline-offset-2 hover:text-white md:min-h-0">How we check notices</Link>
              </p>
            )}

            <SocialButtons />
          </div>

          {/* phones: each group folds behind a tap (the three lists stacked were over a screen) */}
          <div className="md:hidden rounded-lg border border-on-navy-2/25 divide-y divide-on-navy-2/25">
            {GROUPS.map((g) => (
              <details key={g.title} className="group">
                <summary className="flex items-center justify-between px-4 min-h-[48px] cursor-pointer list-none text-sm font-semibold text-white">
                  <span>{g.title}</span>
                  <ChevronDown aria-hidden className="w-4 h-4 text-saffron-light transition-transform group-open:rotate-180" />
                </summary>
                <nav aria-label={g.title}>
                  <ul className="grid grid-cols-2 gap-x-3 px-4 pb-3 text-[13px]">
                    {g.links.map((l) => (
                      <li key={l.href + l.label} className={l.divider ? "col-span-2 border-t border-on-navy-2/25" : undefined}>
                        <FooterAnchor link={l} className="flex items-center min-h-[44px] text-on-navy hover:text-white font-medium" />
                      </li>
                    ))}
                  </ul>
                </nav>
              </details>
            ))}
          </div>

          {/* desktop: the three columns */}
          {GROUPS.map((g) => (
            <nav key={g.title} aria-label={g.title} className="hidden md:block">
              <h3 className="mb-2 text-sm font-semibold text-white">{g.title}</h3>
              <ul className="text-[13px] text-on-navy">
                {g.links.map((l) => (
                  <li key={l.href + l.label} className={l.divider ? "mt-1 pt-1 border-t border-on-navy-2/25" : undefined}>
                    <FooterAnchor link={l} className="inline-flex min-h-[28px] items-center text-on-navy hover:text-saffron-light font-medium" />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Jobs by state (the home page's "All 36 states" link lands here) */}
        <nav id="all-states" aria-label="Jobs by state and union territory" className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-on-navy-2/25 scroll-mt-28">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2">
            <h3 className="text-base font-semibold text-white">Jobs by state and union territory</h3>
          </div>

          <p className="text-xs text-on-navy mb-4 max-w-[62ch]">
            Each state page lists recruitments from that state&apos;s public service commission, staff selection
            and police boards, courts and departments, with the official link for each.
          </p>
          {/* phones on a state page already have the full list open: one way to reach a state there */}
          <div className={`mb-4 md:mb-6 md:flex md:items-center md:gap-6 ${openStates ? "hidden md:flex" : ""}`}>
            <StateJump states={states.map((st) => ({ name: st.name, href: getStateSubdomainUrl(st.slug) }))} />
            <p className="hidden md:block text-[12px] text-on-navy">Most visited states are in <b className="font-semibold text-white">bold</b>.</p>
          </div>

          {/* phones: one list behind a tap (the region cards stacked were ~4 screens) */}
          <details open={openStates} className="md:hidden group rounded-lg border border-on-navy-2/25 bg-navy-deep/60">
            <summary className="flex items-center justify-between px-4 min-h-[48px] cursor-pointer list-none text-sm font-semibold text-white">
              All 36 states and union territories
              <ChevronDown aria-hidden className="w-4 h-4 text-saffron-light transition-transform group-open:rotate-180" />
            </summary>
            {[["Most visited", states.slice(0, POPULAR_STATES.length)], ["All others", states.slice(POPULAR_STATES.length)]].map(([label, list]) => (
              <div key={label as string} className="px-4 pb-3">
                <p className="pt-1 text-[12px] font-semibold uppercase tracking-wide text-on-navy-2">{label as string}</p>
                <ul className="grid grid-cols-2 gap-x-3 text-[13px]">
                  {(list as StateInfo[]).map((st) => (
                    <li key={st.slug}>
                      <a href={getStateSubdomainUrl(st.slug)} className="flex items-center min-h-[44px] text-on-navy hover:text-white">{st.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </details>

          <div className="hidden md:grid md:grid-cols-3 xl:grid-cols-5 gap-x-6 gap-y-6 items-start text-xs">
            {STATE_ZONES.map((zone) => {
              const zoneStates = zone.slugs
                .map((slug) => STATES_REGISTRY.find((s) => s.slug === slug))
                .filter((s): s is StateInfo => Boolean(s));

              return (
                <div key={zone.id} className="space-y-1">
                  <div className="flex items-center justify-between pb-1.5 border-b border-on-navy-2/25">
                    <span className="font-semibold text-white text-[13px] flex items-center gap-1">
                      {zone.name}
                    </span>
                    <span className="text-[12px] text-on-navy-2 tabular-nums">{zoneStates.length}</span>
                  </div>

                  <ul className="pt-0.5">
                    {zoneStates.map((st) => (
                      <li key={st.slug}>
                        <a href={getStateSubdomainUrl(st.slug)}
                          className={`inline-flex min-h-[28px] items-center text-[13px] hover:text-saffron-light ${POPULAR_STATES.includes(st.slug) ? "font-semibold text-white" : "font-medium text-on-navy"}`}>
                          {st.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </nav>
      </div>

      {/* About this site */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-2xl mx-auto rounded-xl bg-navy-deep p-4 md:p-5 border border-on-navy-2/25 text-xs text-on-navy flex flex-row gap-3 md:gap-4 items-start md:items-center">
          <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-green shrink-0" />
          <div className="space-y-1 text-[13px] leading-relaxed max-w-[62ch]">
            <p className="font-bold text-white">Apply only on the official site.</p>
            <p>
              <strong>India Job Notice</strong> is not a government website. We list recruitments from the official websites of commissions, boards and departments, with a link to each official notification. The site is free to use. We never ask for money, bank details or passwords. Always check the official notification before you apply.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-on-navy-2/25 flex flex-col-reverse sm:flex-row items-center justify-between text-xs text-on-navy-2 gap-3 sm:gap-4">
          <p className="pt-1 sm:pt-0">© {new Date().getFullYear()} India Job Notice · indiajobnotice.com</p>
          <nav aria-label="About this site" className="flex w-full flex-wrap items-center justify-center gap-x-5 sm:w-auto sm:gap-x-6 text-on-navy [&_a]:inline-flex [&_a]:items-center [&_a]:min-h-[44px] sm:[&_a]:min-h-[28px]">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of use</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
