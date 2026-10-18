import React from "react";
import Link from "next/link";
import { STATES_REGISTRY, STATE_ZONES, StateInfo } from "@/config/states";
import { getStateSubdomainUrl, getCentralPortalUrl } from "@/lib/subdomains";
import { ShieldCheck, MapPin, Landmark } from "lucide-react";
import { TelegramLogo, WhatsAppLogo } from "./SocialIcons";
import { BrandLogo } from "./BrandLogo";

export function Footer() {
  return (
    <footer className="bg-[#0B153D] text-[#E0E6F5] border-t-2 border-[#1E3799] mt-20 relative">
      {/* Top Tricolor Accent Line extending across the entire page */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-[#E96B15]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#209948]" />
      </div>

      {/* Main Footer Links */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <a href={getCentralPortalUrl()} className="inline-block transition-transform hover:opacity-95" title="India Job Notice Home">
              <BrandLogo variant="light" height={34} />
            </a>
            
            <p className="text-xs text-[#A9B8DE] leading-relaxed">
              India&apos;s dedicated multi-state government job notification network. Providing verified official gazette circulars, syllabus, admit cards, and scam-free direct links across all 36 Indian states & UTs.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://t.me/Indiajobnotice1"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-[#24A1DE] text-white hover:bg-[#1D8FCA] transition-colors shadow-xs"
                aria-label="Telegram Channel"
                title="Join Telegram Channel"
              >
                <TelegramLogo className="w-4 h-4" />
              </a>
              <a
                href="https://whatsapp.com/channel/0029Vb9GFwsGzzKXYJyKer1C"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-[#25D366] text-white hover:bg-[#20BA5A] transition-colors shadow-xs"
                aria-label="WhatsApp Channel"
                title="Follow IndiaJobNotice on WhatsApp Channel"
              >
                <WhatsAppLogo className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Central Recruitment */}
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <span className="w-2 h-2 rounded-full bg-[#E96B15]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Central Recruitment
              </h3>
            </div>
            <ul className="space-y-1.5 text-xs text-[#C4D0EC]">
              <li><Link href="/organisations/upsc" className="hover:text-[#FFA666] font-medium">UPSC Civil Services & NDA</Link></li>
              <li><Link href="/organisations/ssc" className="hover:text-[#FFA666] font-medium">SSC CGL, CHSL, GD, MTS</Link></li>
              <li><Link href="/railway-jobs" className="hover:text-[#FFA666] font-medium">Railway RRB NTPC, ALP, Group D</Link></li>
              <li><Link href="/banking-jobs" className="hover:text-[#FFA666] font-medium">Banking: SBI, IBPS, RBI</Link></li>
              <li><Link href="/police-defense-jobs" className="hover:text-[#FFA666] font-medium">Police & Defence (Agniveer)</Link></li>
              <li><Link href="/engineering-jobs" className="hover:text-[#FFA666] font-medium">Engineering (B.Tech & Diploma)</Link></li>
              <li><Link href="/teaching-jobs" className="hover:text-[#FFA666] font-medium">Teaching (CTET, KVS, NVS)</Link></li>
            </ul>
          </div>

          {/* Recruitment Tools & Direct Portals */}
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <span className="w-2 h-2 rounded-full bg-[#209948]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Candidate Resources
              </h3>
            </div>
            <ul className="space-y-1.5 text-xs text-[#C4D0EC]">
              <li>
                <Link href="/calculator" className="text-[#FFA666] hover:underline font-bold flex items-center gap-1">
                  <span>🧮 Crucial Date Age Calculator</span>
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="text-[#A9B8DE] hover:text-[#FFA666] font-medium flex items-center gap-1">
                  <span>📅 Exam & Deadline Calendar 2026</span>
                </Link>
              </li>
              <li>
                <Link href="/vacancies" className="text-[#A9B8DE] hover:text-[#FFA666] font-medium flex items-center gap-1">
                  <span>📊 Qualification Vacancy Tracker</span>
                </Link>
              </li>
              <li>
                <Link href="/directory" className="text-[#A9B8DE] hover:text-[#FFA666] font-medium flex items-center gap-1">
                  <span>🏛️ State PSCs & Police Directory</span>
                </Link>
              </li>
              <li>
                <Link href="/for-colleges-libraries" className="text-[#4EE278] hover:text-white font-bold flex items-center gap-1">
                  <span>🎓 For Colleges, TPOs & Libraries</span>
                </Link>
              </li>
              <li className="pt-2 border-t border-[#1E3799]/60">
                <a href={getCentralPortalUrl()} className="text-white hover:text-[#FFA666] font-bold flex items-center gap-1">
                  <span>🇮🇳 All-India Central Portal</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Jobs By Qualification */}
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <span className="w-2 h-2 rounded-full bg-[#1E3799]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                By Qualification
              </h3>
            </div>
            <ul className="space-y-1.5 text-xs text-[#C4D0EC]">
              <li><Link href="/qualification/10th-pass" className="hover:text-[#FFA666] font-medium">10th Pass Govt Jobs</Link></li>
              <li><Link href="/qualification/12th-pass" className="hover:text-[#FFA666] font-medium">12th Pass Govt Jobs</Link></li>
              <li><Link href="/qualification/diploma" className="hover:text-[#FFA666] font-medium">Polytechnic & Diploma Jobs</Link></li>
              <li><Link href="/qualification/graduate" className="hover:text-[#FFA666] font-medium">Graduate Degree Jobs</Link></li>
              <li><Link href="/engineering-jobs" className="hover:text-[#FFA666] font-medium">Civil, Mech, Electrical Engineers</Link></li>
              <li className="pt-2 border-t border-[#1E3799]/60 text-[11px] text-[#A9B8DE]">
                <span>State + Qualification Hubs:</span>
                <div className="flex flex-wrap gap-1.5 pt-1 text-white">
                  <Link href="/government-jobs/karnataka/12th-pass" className="hover:text-[#FFA666]">KA 12th</Link>
                  <span>·</span>
                  <Link href="/government-jobs/karnataka/engineering" className="hover:text-[#FFA666]">KA Engg</Link>
                  <span>·</span>
                  <Link href="/government-jobs/up/12th-pass" className="hover:text-[#FFA666]">UP 12th</Link>
                  <span>·</span>
                  <Link href="/government-jobs/bihar/12th-pass" className="hover:text-[#FFA666]">BR 12th</Link>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Complete 36 States & Union Territories Regional Gazette Links Matrix */}
        <div className="mt-12 pt-8 border-t border-[#1E3799]/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[#E96B15]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Official Employment Gazettes for All 36 States & Union Territories
              </h3>
            </div>
            <span className="text-xs font-mono text-[#4EE278] font-bold bg-[#122055] px-2.5 py-1 rounded border border-[#1E3799]">
              36 Regional Hubs Active
            </span>
          </div>

          <p className="text-xs text-[#A9B8DE] mb-6 max-w-4xl">
            Direct access to dedicated state gazettes covering Public Service Commissions (PSCs), Staff Selection Boards, Police Recruitment Boards, High Courts, and Departmental vacancies with state-specific reservations and cutoff dates.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 text-xs">
            {STATE_ZONES.map((zone) => {
              const zoneStates = zone.slugs
                .map((slug) => STATES_REGISTRY.find((s) => s.slug === slug))
                .filter((s): s is StateInfo => Boolean(s));

              return (
                <div key={zone.id} className="bg-[#122055]/60 rounded-lg p-3.5 border border-[#1E3799]/70 space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#1E3799]">
                    <span className="font-mono font-bold text-white text-[11px] uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#E96B15]" />
                      {zone.name}
                    </span>
                    <span className="text-[10px] font-mono text-[#FFA666]">({zoneStates.length})</span>
                  </div>

                  <ul className="space-y-1.5 pt-1">
                    {zoneStates.map((st) => (
                      <li key={st.slug}>
                        <a
                          href={getStateSubdomainUrl(st.slug)}
                          className="hover:text-[#FFA666] transition-colors flex items-center justify-between py-0.5 text-[#C4D0EC] group font-medium"
                          title={`${st.name} Govt Jobs Gazette (/state/${st.slug})`}
                        >
                          <span className="group-hover:translate-x-0.5 transition-transform">
                            {st.name}
                          </span>
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#0B153D] text-[#A9B8DE] border border-[#1E3799] group-hover:text-white group-hover:border-[#FFA666]">
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

      {/* Aspirants Reassurance Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="rounded-xl bg-[#122055] p-5 border border-[#1E3799] text-xs text-[#A9B8DE] flex flex-col md:flex-row gap-4 items-start md:items-center">
          <ShieldCheck className="w-8 h-8 text-[#209948] shrink-0" />
          <div className="space-y-1 text-[11px] leading-relaxed">
            <p className="font-bold text-white flex items-center gap-2">
              <span>Authenticity Notice & Aspirants Reassurance</span>
              <span className="text-[10px] font-mono text-[#209948] bg-[#209948]/20 px-1.5 py-0.2 rounded font-bold">
                100% Free Public Access
              </span>
            </p>
            <p>
              <strong>indiajobnotice.com</strong> is an independent educational notification portal built for competitive examination aspirants across India. We aggregate verified public employment notices directly from official government gazettes, state PSCs, and recruitment boards without subscription fees or paywalls. To sustain server infrastructure and continuous editorial updates, family-friendly display advertisements are hosted. We never ask for payments, banking details, or credentials. Always verify original notification PDFs before submitting applications.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-[#1E3799]/40 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A9BC7] gap-4">
          <p>© {new Date().getFullYear()} IndiaJobNotice.com • Satyameva Jayate.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[#A9B8DE]">
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="/editorial-policy" className="hover:text-white transition-colors">Editorial Policy</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact Desk</Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/directory" className="hover:text-white transition-colors">State PSC Directory</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
