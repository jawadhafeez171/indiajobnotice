"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, Bookmark, Calendar, Send } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { StateSelectorModal } from "./StateSelectorModal";
import { WatchlistDrawer } from "./WatchlistDrawer";
import { useWatchlist } from "@/lib/watchlist";
import { getStateBySlug } from "@/config/states";
import { getStateSubdomainUrl, getCentralPortalUrl } from "@/lib/subdomains";

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
                Gazettes
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

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setIsWatchlistOpen(true)}
                className="p-1.5 relative rounded-md bg-white border border-[#EAE2D2] text-[#1A1918]"
                aria-label="View Saved Circulars"
              >
                <Bookmark className={`w-4 h-4 ${savedCount > 0 ? "fill-[#E96B15] text-[#E96B15]" : "text-[#68635B]"}`} />
                {savedCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E96B15] text-white text-[9px] font-bold flex items-center justify-center font-mono">
                    {savedCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-2.5 py-1 rounded-md bg-[#EEF2FA] text-xs font-bold text-[#1E3799] border border-[#CCD8F0] whitespace-nowrap"
              >
                {currentState ? currentState.code : "States"}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-[#1E3799] hover:bg-[#EEF2FA] rounded-md transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#EAE2D2] bg-[#FCFAF4] px-4 py-4 space-y-3 text-sm">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsModalOpen(true);
              }}
              className="w-full text-left py-2.5 px-3 rounded-md bg-[#EEF2FA] font-bold text-[#1E3799] flex justify-between items-center border border-[#CCD8F0]"
            >
              <span>Current Portal: {currentState ? currentState.name : "All India"}</span>
              <span className="text-xs text-[#E96B15]">Switch State →</span>
            </button>
            <div className="flex flex-col space-y-2 pt-1 font-semibold text-[#3E3C38]">
              <a
                href={currentState ? getStateSubdomainUrl(currentState.slug) : getCentralPortalUrl()}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#1E3799]"
              >
                Latest Notifications
              </a>
              <Link
                href="/calendar"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#1E3799] flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#1E3799]" />
                <span>Exam Schedule Calendar 2026</span>
              </Link>
              <Link
                href="/vacancies"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#1E3799]"
              >
                Qualification Vacancy Tracker
              </Link>
              <Link href="/calculator" onClick={() => setMobileMenuOpen(false)} className="py-1 text-[#E96B15] font-bold">
                Cut-off Date Age Calculator
              </Link>
              <Link
                href="/directory"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#1E3799]"
              >
                State Commissions Directory
              </Link>
              <Link
                href="/for-colleges-libraries"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-[#209948] font-bold"
              >
                🎓 For Colleges & Libraries
              </Link>
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

      {/* Aspirant Watchlist Drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
      />
    </>
  );
}
