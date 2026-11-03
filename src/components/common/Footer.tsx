import React from "react";
import Link from "next/link";
import { STATES_REGISTRY, STATE_ZONES, StateInfo } from "@/config/states";
import { getStateSubdomainUrl, getCentralPortalUrl } from "@/lib/subdomains";
import { ShieldCheck, MapPin, Landmark, ChevronDown } from "lucide-react";
import { TelegramLogo, WhatsAppLogo } from "./SocialIcons";
import { BrandLogo } from "./BrandLogo";

export function Footer() {
  return (
    <footer className="on-dark bg-navy-deep text-on-navy border-t-2 border-on-navy-2/25 mt-20 relative">
      {/* Top Tricolor Accent Line extending across the entire page */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-saffron-solid" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-green-solid" />
      </div>

      {/* Main Footer Links */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <a href={getCentralPortalUrl()} className="inline-block transition-transform hover:opacity-95" title="India Job Notice Home">
              <BrandLogo variant="light" height={34} />
            </a>

            <p className="text-xs text-on-navy leading-relaxed">
              Government job notifications from official websites, with last dates, eligibility, admit
              cards and results, and a link to each official notification.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://t.me/india_jobnotice"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-[#1A7DB0] text-white hover:bg-[#156C99] transition-colors shadow-xs"
                aria-label="Telegram Channel"
                title="Join Telegram Channel"
              >
                <TelegramLogo className="w-4 h-4" />
              </a>
              <a
                href="https://whatsapp.com/channel/0029Vb9GFwsGzzKXYJyKer1C"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-[#13853F] text-white hover:bg-[#0E7A3E] transition-colors shadow-xs"
                aria-label="WhatsApp Channel"
                title="Follow India Job Notice on WhatsApp"
              >
                <WhatsAppLogo className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Central Recruitment */}
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <span className="w-2 h-2 rounded-full bg-saffron-solid" />
              <h3 className="text-sm font-semibold text-white">
                Central Recruitment
              </h3>
            </div>
            <ul className="space-y-1.5 text-xs text-on-navy [&_a]:inline-block [&_a]:py-2 md:[&_a]:py-0">
              <li><Link href="/organisations/upsc" className="hover:text-saffron-light font-medium">UPSC</Link></li>
              <li><Link href="/organisations/ssc" className="hover:text-saffron-light font-medium">SSC</Link></li>
              <li><Link href="/railway-jobs" className="hover:text-saffron-light font-medium">Railways</Link></li>
              <li><Link href="/banking-jobs" className="hover:text-saffron-light font-medium">Banks</Link></li>
              <li><Link href="/police-defense-jobs" className="hover:text-saffron-light font-medium">Police and defence</Link></li>
              <li><Link href="/engineering-jobs" className="hover:text-saffron-light font-medium">Engineering</Link></li>
              <li><Link href="/teaching-jobs" className="hover:text-saffron-light font-medium">Teaching</Link></li>
            </ul>
          </div>

          {/* Recruitment Tools & Direct Portals */}
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <span className="w-2 h-2 rounded-full bg-green-solid" />
              <h3 className="text-sm font-semibold text-white">
                Tools
              </h3>
            </div>
            <ul className="space-y-1.5 text-xs text-on-navy [&_a]:inline-block [&_a]:py-2 md:[&_a]:py-0">
              <li>
                <Link href="/calculator" className="text-on-navy hover:text-saffron-light font-medium flex items-center gap-1">
                  <span>Age calculator</span>
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="text-on-navy hover:text-saffron-light font-medium flex items-center gap-1">
                  <span>Exam calendar</span>
                </Link>
              </li>
              <li>
                <Link href="/vacancies" className="text-on-navy hover:text-saffron-light font-medium flex items-center gap-1">
                  <span>Vacancies by qualification</span>
                </Link>
              </li>
              <li>
                <Link href="/directory" className="text-on-navy hover:text-saffron-light font-medium flex items-center gap-1">
                  <span>Commissions and boards</span>
                </Link>
              </li>
              <li>
                <Link href="/for-colleges-libraries" className="text-on-navy hover:text-saffron-light font-medium flex items-center gap-1">
                  <span>For colleges and libraries</span>
                </Link>
              </li>
              <li className="pt-2 border-t border-on-navy-2/25">
                <a href={getCentralPortalUrl()} className="text-on-navy hover:text-saffron-light font-medium flex items-center gap-1">
                  <span>All India (central jobs)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Jobs By Qualification */}
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <span className="w-2 h-2 rounded-full bg-navy-solid" />
              <h3 className="text-sm font-semibold text-white">
                By Qualification
              </h3>
            </div>
            <ul className="space-y-1.5 text-xs text-on-navy [&_a]:inline-block [&_a]:py-2 md:[&_a]:py-0">
              <li><Link href="/qualification/10th-pass" className="hover:text-saffron-light font-medium">10th Pass Govt Jobs</Link></li>
              <li><Link href="/qualification/12th-pass" className="hover:text-saffron-light font-medium">12th Pass Govt Jobs</Link></li>
              <li><Link href="/qualification/diploma" className="hover:text-saffron-light font-medium">Polytechnic & Diploma Jobs</Link></li>
              <li><Link href="/qualification/graduate" className="hover:text-saffron-light font-medium">Graduate Degree Jobs</Link></li>
              <li><Link href="/engineering-jobs" className="hover:text-saffron-light font-medium">Civil, Mech, Electrical Engineers</Link></li>
              <li className="pt-2 border-t border-on-navy-2/25 text-[12px] text-on-navy">
                <span>State + Qualification Hubs:</span>
                <div className="flex flex-wrap gap-1.5 pt-1 text-white">
                  <Link href="/government-jobs/karnataka/12th-pass" className="hover:text-saffron-light">KA 12th</Link>
                  <span>·</span>
                  <Link href="/government-jobs/karnataka/engineering" className="hover:text-saffron-light">KA Engg</Link>
                  <span>·</span>
                  <Link href="/government-jobs/up/12th-pass" className="hover:text-saffron-light">UP 12th</Link>
                  <span>·</span>
                  <Link href="/government-jobs/bihar/12th-pass" className="hover:text-saffron-light">BR 12th</Link>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Jobs by state (the home page's "All 36 states" link lands here) */}
        <div id="all-states" className="mt-12 pt-8 border-t border-on-navy-2/25 scroll-mt-28">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-saffron" />
              <h3 className="text-base font-semibold text-white">
                Jobs by state and union territory
              </h3>
            </div>
          </div>

          <p className="text-xs text-on-navy mb-6 max-w-4xl">
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
                  <a href={getStateSubdomainUrl(st.slug)} className="block py-2.5 text-on-navy hover:text-white">
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
        <div className="rounded-xl bg-navy-deep p-5 border border-on-navy-2/25 text-xs text-on-navy flex flex-col md:flex-row gap-4 items-start md:items-center">
          <ShieldCheck className="w-8 h-8 text-green shrink-0" />
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
        <div className="mt-8 pt-6 border-t border-on-navy-2/25 flex flex-col sm:flex-row items-center justify-between text-xs text-on-navy-2 gap-4">
          <p>© {new Date().getFullYear()} India Job Notice · indiajobnotice.com</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 sm:gap-6 text-on-navy [&_a]:inline-block [&_a]:py-2.5 md:[&_a]:py-0">
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
