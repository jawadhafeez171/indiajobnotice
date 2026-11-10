import React from "react";
import Link from "next/link";
import { STATES_REGISTRY, STATE_ZONES, StateInfo } from "@/config/states";
import { getStateSubdomainUrl, getCentralPortalUrl } from "@/lib/subdomains";
import { ShieldCheck, MapPin, Landmark, ChevronDown } from "lucide-react";
import { TelegramLogo, WhatsAppLogo, InstagramLogo, YouTubeLogo, INSTAGRAM_URL, YOUTUBE_URL } from "./SocialIcons";
import { BrandLogo } from "./BrandLogo";

type FooterLink = { href: string; label: string; external?: boolean; divider?: boolean };
type FooterGroup = { title: string; dot: string; links: FooterLink[] };

const GROUPS: FooterGroup[] = [
  {
    title: "Central Recruitment",
    dot: "bg-saffron-solid",
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
    title: "Tools",
    dot: "bg-green-solid",
    links: [
      { href: "/calculator", label: "Age calculator" },
      { href: "/calendar", label: "Exam calendar" },
      { href: "/vacancies", label: "Vacancies by qualification" },
      { href: "/directory", label: "Commissions and boards" },
      { href: getCentralPortalUrl(), label: "All India (central jobs)", external: true, divider: true },
    ],
  },
  {
    title: "By Qualification",
    dot: "bg-navy-solid",
    links: [
      { href: "/qualification/10th-pass", label: "10th Pass Govt Jobs" },
      { href: "/qualification/12th-pass", label: "12th Pass Govt Jobs" },
      { href: "/qualification/diploma", label: "Polytechnic & Diploma Jobs" },
      { href: "/qualification/graduate", label: "Graduate Degree Jobs" },
      { href: "/engineering-jobs", label: "Civil, Mech, Electrical Engineers" },
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
  const base = "inline-flex items-center justify-center gap-2 rounded-lg text-white transition-colors shadow-xs min-h-[44px] px-4 text-sm font-semibold md:min-h-0 md:p-2";
  return (
    <div className="grid grid-cols-2 gap-2 pt-1 md:flex md:items-center">
      <a href="https://t.me/india_jobnotice" target="_blank" rel="noreferrer" aria-label="Telegram Channel"
        title="Join Telegram Channel" className={`${base} bg-[#1A7DB0] hover:bg-[#156C99]`}>
        <TelegramLogo className="w-4 h-4" />
        <span className="md:sr-only">Telegram</span>
      </a>
      <a href="https://whatsapp.com/channel/0029Vb9GFwsGzzKXYJyKer1C" target="_blank" rel="noreferrer"
        aria-label="WhatsApp Channel" title="Follow India Job Notice on WhatsApp" className={`${base} bg-[#13853F] hover:bg-[#0E7A3E]`}>
        <WhatsAppLogo className="w-4 h-4" />
        <span className="md:sr-only">WhatsApp</span>
      </a>
      <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram"
        title="Follow India Job Notice on Instagram" className={`${base} bg-[#C13584] hover:bg-[#A72D72]`}>
        <InstagramLogo className="w-4 h-4" />
        <span className="md:sr-only">Instagram</span>
      </a>
      <a href={YOUTUBE_URL} target="_blank" rel="noreferrer" aria-label="YouTube"
        title="India Job Notice on YouTube" className={`${base} bg-[#CC0000] hover:bg-[#B00000]`}>
        <YouTubeLogo className="w-4 h-4" />
        <span className="md:sr-only">YouTube</span>
      </a>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="on-dark bg-navy-deep text-on-navy border-t-2 border-on-navy-2/25 mt-12 md:mt-20 relative">
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

            <SocialButtons />
          </div>

          {/* phones: each group folds behind a tap (the three lists stacked were over a screen) */}
          <div className="md:hidden rounded-lg border border-on-navy-2/25 divide-y divide-on-navy-2/25">
            {GROUPS.map((g) => (
              <details key={g.title} className="group">
                <summary className="flex items-center justify-between px-4 min-h-[48px] cursor-pointer list-none text-sm font-semibold text-white">
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${g.dot}`} />
                    {g.title}
                  </span>
                  <ChevronDown aria-hidden className="w-4 h-4 text-saffron-light transition-transform group-open:rotate-180" />
                </summary>
                <ul className="grid grid-cols-2 gap-x-3 px-4 pb-3 text-[13px]">
                  {g.links.map((l) => (
                    <li key={l.href + l.label}>
                      <FooterAnchor link={l} className="flex items-center min-h-[44px] text-on-navy hover:text-white font-medium" />
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>

          {/* desktop: the three columns */}
          {GROUPS.map((g) => (
            <div key={g.title} className="hidden md:block">
              <div className="flex items-center gap-2 mb-3.5">
                <span className={`w-2 h-2 rounded-full ${g.dot}`} />
                <h3 className="text-sm font-semibold text-white">{g.title}</h3>
              </div>
              <ul className="space-y-1.5 text-xs text-on-navy">
                {g.links.map((l) => (
                  <li key={l.href + l.label} className={l.divider ? "pt-2 border-t border-on-navy-2/25" : undefined}>
                    <FooterAnchor link={l} className="text-on-navy hover:text-saffron-light font-medium" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Jobs by state (the home page's "All 36 states" link lands here) */}
        <div id="all-states" className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-on-navy-2/25 scroll-mt-28">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-saffron" />
              <h3 className="text-base font-semibold text-white">
                Jobs by state and union territory
              </h3>
            </div>
          </div>

          <p className="text-xs text-on-navy mb-4 md:mb-6 max-w-4xl">
            Each state page lists recruitments from that state&apos;s public service commission, staff selection
            and police boards, courts and departments, with the official link for each.
          </p>

          {/* phones: one list behind a tap (the region cards stacked were ~4 screens) */}
          <details className="md:hidden group rounded-lg border border-on-navy-2/25 bg-navy-deep/60">
            <summary className="flex items-center justify-between px-4 min-h-[48px] cursor-pointer list-none text-sm font-semibold text-white">
              Show all 36 states and union territories
              <ChevronDown aria-hidden className="w-4 h-4 text-saffron-light transition-transform group-open:rotate-180" />
            </summary>
            <ul className="grid grid-cols-2 gap-x-3 px-4 pb-4 text-[13px]">
              {[...STATES_REGISTRY].sort((x, y) => x.name.localeCompare(y.name)).map((st) => (
                <li key={st.slug}>
                  <a href={getStateSubdomainUrl(st.slug)} className="flex items-center min-h-[44px] text-on-navy hover:text-white">
                    {st.name}
                  </a>
                </li>
              ))}
            </ul>
          </details>

          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 text-xs">
            {STATE_ZONES.map((zone) => {
              const zoneStates = zone.slugs
                .map((slug) => STATES_REGISTRY.find((s) => s.slug === slug))
                .filter((s): s is StateInfo => Boolean(s));

              return (
                <div key={zone.id} className="bg-navy-deep/60 rounded-lg p-3.5 border border-on-navy-2/25 space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-on-navy-2/25">
                    <span className="font-semibold text-white text-[13px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-saffron" />
                      {zone.name}
                    </span>
                    <span className="text-[12px] text-on-navy-2 tabular-nums">{zoneStates.length}</span>
                  </div>

                  <ul className="space-y-1.5 pt-1">
                    {zoneStates.map((st) => (
                      <li key={st.slug}>
                        <a
                          href={getStateSubdomainUrl(st.slug)}
                          className="hover:text-saffron-light transition-colors flex items-center justify-between py-0.5 text-on-navy group font-medium"
                          title={`${st.name} government jobs`}
                        >
                          <span className="group-hover:translate-x-0.5 transition-transform">
                            {st.name}
                          </span>
                          <span className="text-[11px] font-mono px-1 py-0.2 rounded bg-navy-deep text-on-navy border border-on-navy-2/25 group-hover:text-white group-hover:border-saffron-light">
                            {st.code}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* About this site */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="rounded-xl bg-navy-deep p-4 md:p-5 border border-on-navy-2/25 text-xs text-on-navy flex flex-row gap-3 md:gap-4 items-start md:items-center">
          <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-green shrink-0" />
          <div className="space-y-1 text-[13px] leading-relaxed max-w-[68ch]">
            <p className="font-bold text-white flex items-center gap-2">
              <span>About India Job Notice</span>
              <span className="text-[11px] text-green-pop border border-green-pop/40 px-1.5 py-0.2 rounded font-semibold">
                Free
              </span>
            </p>
            <p>
              <strong>India Job Notice</strong> is not a government website. We list recruitments from the official websites of commissions, boards and departments, with a link to each official notification. The site is free to use. We never ask for money, bank details or passwords. Always check the official notification before you apply.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-on-navy-2/25 flex flex-col-reverse sm:flex-row items-center justify-between text-xs text-on-navy-2 gap-3 sm:gap-4">
          <p className="pt-1 sm:pt-0">© {new Date().getFullYear()} India Job Notice · indiajobnotice.com</p>
          <div className="grid grid-cols-3 w-full text-center sm:w-auto sm:flex sm:flex-wrap sm:items-center sm:gap-6 text-on-navy [&_a]:flex [&_a]:items-center [&_a]:justify-center [&_a]:min-h-[44px] sm:[&_a]:min-h-0 sm:[&_a]:inline-block">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/editorial-policy" className="hover:text-white transition-colors">How we verify</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
