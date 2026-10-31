"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, Bookmark, Calendar, Send, MapPin } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { StateSelectorModal } from "./StateSelectorModal";
import { StateQuickStrip } from "./StateQuickStrip";
import { WatchlistDrawer } from "./WatchlistDrawer";
import { useWatchlist } from "@/lib/watchlist";
import { getStateBySlug, STATES_REGISTRY } from "@/config/states";
import { getStateSubdomainUrl, getCentralPortalUrl } from "@/lib/subdomains";
import { cn } from "@/lib/utils";

interface Props {
  currentStateSlug?: string;
}

export function Navbar({ currentStateSlug }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { savedCount } = useWatchlist();

  const currentState = currentStateSlug && currentStateSlug !== "central"
    ? getStateBySlug(currentStateSlug)
    : null;

  return (
    <>
      {/* Fixed Clean Header with Stable 64px Height */}
      <header className="sticky top-0 z-40 bg-[#FCFAF4]/95 backdrop-blur-md border-b border-[#EAE2D2] shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Brand Mark & State Switcher */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <a href={getCentralPortalUrl()} className="block group transition-transform hover:opacity-95" title="India Job Notice Home">
                <BrandLogo height={32} />
              </a>

              {/* State Switcher Pill */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EEF2FA] hover:bg-[#E0E9F8] text-[#1E3799] text-xs font-semibold border border-[#CCD8F0] transition-colors whitespace-nowrap"
                title="Switch State Portal"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#E96B15]" />
                <span>{currentState ? `${currentState.name} (${currentState.code})` : "All India"}</span>
                <span className="text-[10px] font-mono font-bold px-1 py-0.5 rounded bg-white text-[#1E3799] border border-[#CCD8F0] leading-none">
                  36 States
                </span>
                <ChevronDown className="w-3 h-3 text-[#1E3799]/70" />
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-5 text-xs xl:text-sm text-[#3E3C38] font-medium shrink-0">
              <a
                href={currentState ? getStateSubdomainUrl(currentState.slug) : getCentralPortalUrl()}
                className="hover:text-[#1E3799] transition-colors font-semibold whitespace-nowrap"
              >
                Jobs
              </a>

              <Link
                href="/calendar"
                className="hover:text-[#1E3799] transition-colors font-semibold flex items-center gap-1.5 whitespace-nowrap"
              >
                <Calendar className="w-3.5 h-3.5 text-[#1E3799]" />
                <span>Calendar</span>
              </Link>

              <Link
                href="/vacancies"
                className="hover:text-[#1E3799] transition-colors font-semibold whitespace-nowrap"
              >
                <span>Vacancy Tracker</span>
              </Link>

              <Link
                href="/calculator"
                className="text-[#E96B15] hover:text-[#D4590A] transition-colors font-bold whitespace-nowrap"
              >
                <span>Age Calculator</span>
              </Link>

              <Link
                href="/directory"
                className="hover:text-[#1E3799] transition-colors font-semibold whitespace-nowrap"
              >
                <span>Directory</span>
              </Link>

              <Link
                href="/about"
                className="hover:text-[#1E3799] transition-colors font-semibold whitespace-nowrap"
              >
                <span>About</span>
              </Link>

              {/* Telegram Channel Quick Action */}
              <a
                href="https://t.me/Indiajobnotice1"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#229ED9] hover:bg-[#1D88BC] text-white text-xs font-bold transition-colors whitespace-nowrap shadow-xs"
                title="Join official Telegram channel for instant alerts"
              >
                <Send className="w-3 h-3" />
                <span>Telegram</span>
              </a>

              {/* Watchlist Bookmark Trigger */}
              <button
                onClick={() => setIsWatchlistOpen(true)}
                className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[#EAE2D2] hover:border-[#1E3799] text-[#1A1918] hover:text-[#1E3799] text-xs font-bold transition-all shadow-xs whitespace-nowrap"
                title="View your saved and pinned notifications"
              >
                <Bookmark className={`w-3.5 h-3.5 ${savedCount > 0 ? "fill-[#E96B15] text-[#E96B15]" : "text-[#68635B]"}`} />
                <span>Pinned</span>
                {savedCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-[#E96B15] text-white leading-none">
                    {savedCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Mobile Actions (Optimized 44px Touch Targets) */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
              <button
                onClick={() => setIsWatchlistOpen(true)}
                className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center relative rounded-lg bg-white border border-[#EAE2D2] text-[#1A1918] active:bg-[#FCFAF4] transition-colors"
                aria-label="View saved jobs"
              >
                <Bookmark className={`w-4 h-4 ${savedCount > 0 ? "fill-[#E96B15] text-[#E96B15]" : "text-[#68635B]"}`} />
                {savedCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E96B15] text-white text-[9px] font-bold flex items-center justify-center font-mono">
                    {savedCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1E3799] bg-white border border-[#EAE2D2] hover:bg-[#EEF2FA] rounded-lg active:scale-95 transition-all"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-[#E96B15]" /> : <Menu className="w-5 h-5 text-[#1E3799]" />}
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Quick-Scroll Pill Strip for all 36 States & UTs */}
        <StateQuickStrip
          currentStateSlug={currentStateSlug}
          onOpenSelector={() => setIsModalOpen(true)}
        />

        {/* Mobile Dropdown Drawer (Touch-Optimized for all phone screens) */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#EAE2D2] bg-[#FCFAF4] max-h-[calc(100vh-104px)] overflow-y-auto px-4 py-4 space-y-4 text-sm shadow-xl overscroll-contain">
            {/* Active Portal Banner */}
            <div className="p-3 rounded-xl bg-white border border-[#EAE2D2] shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono uppercase font-bold text-[#68635B] tracking-wider">
                  Active Regional Portal
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#EDF7F0] text-[#209948] font-bold text-[10px] font-mono">
                  Live
                </span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsModalOpen(true);
                }}
                className="w-full text-left py-2.5 px-3 rounded-lg bg-[#EEF2FA] hover:bg-[#E0E9F8] font-bold text-[#1E3799] flex justify-between items-center border border-[#CCD8F0] min-h-[44px] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E96B15]" />
                  <span>{currentState ? currentState.name : "All-India / Central"}</span>
                </div>
                <span className="text-xs text-[#E96B15] font-semibold">Change State →</span>
              </button>
            </div>

            {/* Core Tools & Editorial Hubs */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#68635B] font-bold px-1 block">
                Recruitment Tools & Portals
              </span>
              <div className="grid grid-cols-1 gap-1 pt-1 font-medium text-[#1A1918]">
                <a
                  href={currentState ? getStateSubdomainUrl(currentState.slug) : getCentralPortalUrl()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white border border-[#EAE2D2] hover:border-[#1E3799] min-h-[44px] transition-colors"
                >
                  <span className="font-bold text-[#1E3799]">All job notifications</span>
                  <span className="text-xs text-[#68635B]">Explore →</span>
                </a>

                <Link
                  href="/calendar"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white border border-[#EAE2D2] hover:border-[#1E3799] min-h-[44px] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-[#1E3799]" />
                    <span>Recruitment Calendar 2026</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#EEF2FA] text-[#1E3799]">
                    Updated
                  </span>
                </Link>

                <Link
                  href="/calculator"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#FDF3EB] border border-[#F9D9C3] hover:border-[#E96B15] min-h-[44px] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#E96B15] font-bold">⚡</span>
                    <span className="font-bold text-[#E96B15]">Crucial Cut-off Age Calculator</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#E96B15] text-white">
                    Tool
                  </span>
                </Link>

                <Link
                  href="/vacancies"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white border border-[#EAE2D2] hover:border-[#1E3799] min-h-[44px] transition-colors"
                >
                  <span>Qualification Vacancy Tracker</span>
                  <span className="text-xs text-[#68635B]">→</span>
                </Link>

                <Link
                  href="/directory"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white border border-[#EAE2D2] hover:border-[#1E3799] min-h-[44px] transition-colors"
                >
                  <span>Public Service Commissions Directory</span>
                  <span className="text-xs text-[#68635B]">→</span>
                </Link>
              </div>
            </div>

            {/* Quick Qualification & Sector Hubs */}
            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#68635B] font-bold px-1 block">
                Qualification Direct Hubs
              </span>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <Link
                  href="/qualification/12th-pass"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-white border border-[#EAE2D2] hover:border-[#1E3799] text-xs font-semibold text-[#1A1918] min-h-[44px] flex items-center justify-center text-center transition-colors"
                >
                  12th Pass Jobs
                </Link>
                <Link
                  href="/qualification/diploma"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-white border border-[#EAE2D2] hover:border-[#1E3799] text-xs font-semibold text-[#1A1918] min-h-[44px] flex items-center justify-center text-center transition-colors"
                >
                  Diploma & Poly
                </Link>
                <Link
                  href="/engineering-jobs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-white border border-[#EAE2D2] hover:border-[#1E3799] text-xs font-semibold text-[#1A1918] min-h-[44px] flex items-center justify-center text-center transition-colors"
                >
                  Engineering (AE/JE)
                </Link>
                <Link
                  href="/qualification/graduate"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-white border border-[#EAE2D2] hover:border-[#1E3799] text-xs font-semibold text-[#1A1918] min-h-[44px] flex items-center justify-center text-center transition-colors"
                >
                  Graduate Degree
                </Link>
                <Link
                  href="/organisations/ssc"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-[#EEF2FA] border border-[#CCD8F0] text-xs font-bold text-[#1E3799] min-h-[44px] flex items-center justify-center text-center transition-colors"
                >
                  SSC Recruitment
                </Link>
                <Link
                  href="/railway-jobs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2] text-xs font-semibold text-[#1A1918] min-h-[44px] flex items-center justify-center text-center transition-colors"
                >
                  Railway RRB
                </Link>
              </div>
            </div>

            {/* Trust & Editorial Policy */}
            <div className="space-y-1 pt-1 border-t border-[#EAE2D2]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#68635B] font-bold px-1 block">
                Editorial Desk & Trust
              </span>
              <div className="grid grid-cols-3 gap-1.5 pt-1 text-center text-xs">
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-white border border-[#EAE2D2] hover:border-[#1E3799] font-medium text-[#1A1918] flex items-center justify-center min-h-[44px]"
                >
                  About Us
                </Link>
                <Link
                  href="/editorial-policy"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-white border border-[#EAE2D2] hover:border-[#1E3799] font-medium text-[#1A1918] flex items-center justify-center min-h-[44px]"
                >
                  Verification
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-white border border-[#EAE2D2] hover:border-[#1E3799] font-medium text-[#1A1918] flex items-center justify-center min-h-[44px]"
                >
                  Contact Desk
                </Link>
              </div>
            </div>

            {/* Telegram Instant Alert CTA */}
            <div className="pt-2">
              <a
                href="https://t.me/Indiajobnotice1"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#229ED9] hover:bg-[#1D88BC] text-white font-bold text-xs shadow-xs min-h-[44px] transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Join Official Telegram Channel for Free Alerts</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* State Selector Dialog */}
      <StateSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentStateSlug={currentStateSlug}
      />

      {/* Saved jobs drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
      />
    </>
  );
}
