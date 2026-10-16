import React from "react";
import Link from "next/link";
import { STATES_REGISTRY } from "@/config/states";
import { getStateSubdomainUrl, getCentralPortalUrl } from "@/lib/subdomains";
import { ShieldCheck } from "lucide-react";
import { TelegramLogo, WhatsAppLogo } from "./SocialIcons";
import { BrandLogo, TricolorCapsule } from "./BrandLogo";

export function Footer() {
  const topStates = STATES_REGISTRY.slice(0, 15);

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
              Dedicated multi-state government job notification network. Providing verified official gazette circulars, syllabus, admit cards, and scam-free direct links across all 36 Indian states & UTs.
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
                href="https://chat.whatsapp.com/demo"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-[#25D366] text-white hover:bg-[#20BA5A] transition-colors shadow-xs"
                aria-label="WhatsApp Group"
                title="Join WhatsApp Alerts"
              >
                <WhatsAppLogo className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: State Gazette Hubs */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3.5">
              <span className="w-2 h-2 rounded-full bg-[#E96B15]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                State Gazette Hubs
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              {topStates.map((state) => (
                <a
                  key={state.slug}
                  href={getStateSubdomainUrl(state.slug)}
                  className="hover:text-[#FFA666] transition-colors flex items-center gap-1.5 py-1 text-[#C4D0EC] font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E3799]" />
                  <span>{state.name} ({state.code})</span>
                </a>
              ))}
            </div>
          </div>

          {/* Col 3: Central Exams */}
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <span className="w-2 h-2 rounded-full bg-[#209948]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Central Recruitment
              </h3>
            </div>
            <ul className="space-y-1.5 text-xs text-[#C4D0EC]">
              <li><Link href="/organisations/upsc" className="hover:text-[#FFA666] font-medium">UPSC Civil Services & NDA</Link></li>
              <li><Link href="/organisations/ssc" className="hover:text-[#FFA666] font-medium">SSC CGL, CHSL, GD, MTS</Link></li>
              <li><Link href="/railway-jobs" className="hover:text-[#FFA666] font-medium">Railway RRB NTPC, ALP, Group D</Link></li>
              <li><Link href="/banking-jobs" className="hover:text-[#FFA666] font-medium">Banking: SBI, IBPS, RBI</Link></li>
              <li><Link href="/engineering-jobs" className="hover:text-[#FFA666] font-medium">Engineering (B.Tech & Diploma)</Link></li>
              <li className="pt-2 border-t border-[#1E3799]/60 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-[#A9B8DE]">
                <span className="font-bold text-white block w-full mb-0.5">By Qualification:</span>
                <Link href="/qualification/10th-pass" className="hover:text-[#FFA666]">10th Pass</Link>
                <span>·</span>
                <Link href="/qualification/12th-pass" className="hover:text-[#FFA666]">12th Pass</Link>
                <span>·</span>
                <Link href="/qualification/diploma" className="hover:text-[#FFA666]">Diploma</Link>
                <span>·</span>
                <Link href="/qualification/graduate" className="hover:text-[#FFA666]">Graduate</Link>
              </li>
              <li className="pt-1.5">
                <Link href="/calendar" className="text-[#A9B8DE] hover:text-[#FFA666] font-medium flex items-center gap-1">
                  <span>📅 Exam Calendar 2026</span>
                </Link>
              </li>
              <li>
                <Link href="/vacancies" className="text-[#A9B8DE] hover:text-[#FFA666] font-medium flex items-center gap-1">
                  <span>📊 Qualification Vacancy Tracker</span>
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-[#FFA666] hover:underline font-bold flex items-center gap-1">
                  <span>🧮 Cut-off Date Age Calculator</span>
                </Link>
              </li>
              <li>
                <Link href="/directory" className="text-[#A9B8DE] hover:text-[#FFA666] font-medium flex items-center gap-1">
                  <span>🏛️ State PSCs & Police Directory</span>
                </Link>
              </li>
              <li className="pt-2 border-t border-[#1E3799]/60">
                <Link href="/for-colleges-libraries" className="text-[#209948] hover:text-white font-bold flex items-center gap-1">
                  <span>🎓 For Colleges, TPOs & Libraries</span>
                </Link>
              </li>
            </ul>
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
              <span className="text-[10px] font-mono text-[#209948] bg-[#209948]/20 px-1.5 py-0.2 rounded">
                Non-Commercial
              </span>
            </p>
            <p>
              <strong>indiajobnotice.com</strong> is an independent educational portal built for competitive examination aspirants. We aggregate verified circulars directly from official government gazettes and ministry commission portals. We never ask for payments, passwords, or personal credentials. Always verify original notification PDFs before submitting applications.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-[#1E3799]/40 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A9BC7] gap-4">
          <p>© {new Date().getFullYear()} IndiaJobNotice.com • Satyameva Jayate.</p>
          <div className="flex items-center gap-6 text-[#A9B8DE]">
            <Link href="/" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-white transition-colors">Terms of Gazette Use</Link>
            <Link href="/seo-audit" className="hover:text-white text-[11px] font-mono transition-colors">GSC Audit Center</Link>
            <Link href="/" className="hover:text-white transition-colors">Student Helpdesk</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
