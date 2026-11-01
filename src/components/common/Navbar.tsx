"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Bookmark, Calendar, Send } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { StateSelectorModal } from "./StateSelectorModal";
import { StateQuickStrip } from "./StateQuickStrip";
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
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-line shadow-xs">
        <div className="flex h-[3px]" aria-hidden>
          <span className="flex-1 bg-saffron-bright" />
          <span className="flex-1 bg-white" />
          <span className="flex-1 bg-green-solid" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <a href={getCentralPortalUrl()} className="block shrink-0 group transition-transform hover:opacity-95" title="India Job Notice Home">
              <BrandLogo height={32} />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-7 xl:gap-8 text-sm text-ink-2 font-semibold">
              <a
                href={currentState ? getStateSubdomainUrl(currentState.slug) : getCentralPortalUrl()}
                className="hover:text-navy transition-colors whitespace-nowrap"
              >
                Jobs
              </a>
              <Link href="/calendar" className="hover:text-navy transition-colors whitespace-nowrap">
                Exam calendar
              </Link>
              <Link href="/vacancies" className="hover:text-navy transition-colors whitespace-nowrap">
                Vacancies
              </Link>
              <Link href="/calculator" className="hover:text-navy transition-colors whitespace-nowrap">
                Age calculator
              </Link>
              <Link href="/directory" className="hover:text-navy transition-colors whitespace-nowrap">
                Directory
              </Link>
              <button
                onClick={() => setIsWatchlistOpen(true)}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line hover:border-navy text-ink hover:text-navy transition-colors whitespace-nowrap"
                title="Jobs you saved"
              >
                <Bookmark className={`w-4 h-4 ${savedCount > 0 ? "fill-saffron-bright text-saffron" : "text-muted"}`} />
                <span>Saved</span>
                {savedCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[11px] font-bold bg-saffron-solid text-white leading-none">
                    {savedCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Mobile Actions (Optimized 44px Touch Targets) */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
              <button
                onClick={() => setIsWatchlistOpen(true)}
                className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center relative rounded-lg bg-surface border border-line text-ink active:bg-subtle transition-colors"
                aria-label="View saved jobs"
              >
                <Bookmark className={`w-4 h-4 ${savedCount > 0 ? "fill-saffron-bright text-saffron" : "text-muted"}`} />
                {savedCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-saffron-solid text-white text-[9px] font-bold flex items-center justify-center font-mono">
                    {savedCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-navy bg-surface border border-line hover:bg-navy-tint rounded-lg active:scale-95 transition-all"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-saffron" /> : <Menu className="w-5 h-5 text-navy" />}
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
          <div className="lg:hidden border-t border-line bg-subtle max-h-[calc(100vh-104px)] overflow-y-auto px-4 py-4 space-y-4 text-sm shadow-xl overscroll-contain">
            {/* Active Portal Banner */}
            <div className="p-3 rounded-xl bg-surface border border-line shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono uppercase font-bold text-muted tracking-wider">
                  Active Regional Portal
                </span>
                <span className="px-2 py-0.5 rounded-full bg-green-tint text-green font-bold text-[11px] font-mono">
                  Live
                </span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsModalOpen(true);
                }}
                className="w-full text-left py-2.5 px-3 rounded-lg bg-navy-tint hover:bg-navy-tint-2 font-bold text-navy flex justify-between items-center border border-navy-line min-h-[44px] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-saffron-solid" />
                  <span>{currentState ? currentState.name : "All-India / Central"}</span>
                </div>
                <span className="text-xs text-saffron font-semibold">Change State →</span>
              </button>
            </div>

            {/* Core Tools & Editorial Hubs */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted font-bold px-1 block">
                Recruitment Tools & Portals
              </span>
              <div className="grid grid-cols-1 gap-1 pt-1 font-medium text-ink">
                <a
                  href={currentState ? getStateSubdomainUrl(currentState.slug) : getCentralPortalUrl()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-surface border border-line hover:border-navy min-h-[44px] transition-colors"
                >
                  <span className="font-bold text-navy">All job notifications</span>
                  <span className="text-xs text-muted">Explore →</span>
                </a>

                <Link
                  href="/calendar"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-surface border border-line hover:border-navy min-h-[44px] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-navy" />
                    <span>Recruitment Calendar 2026</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-navy-tint text-navy">
                    Updated
                  </span>
                </Link>

                <Link
                  href="/calculator"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-saffron-tint border border-saffron-line hover:border-saffron-bright min-h-[44px] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-saffron font-bold">⚡</span>
                    <span className="font-bold text-saffron">Crucial Cut-off Age Calculator</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-saffron-solid text-white">
                    Tool
                  </span>
                </Link>

                <Link
                  href="/vacancies"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-surface border border-line hover:border-navy min-h-[44px] transition-colors"
                >
                  <span>Qualification Vacancy Tracker</span>
                  <span className="text-xs text-muted">→</span>
                </Link>

                <Link
                  href="/directory"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-surface border border-line hover:border-navy min-h-[44px] transition-colors"
                >
                  <span>Public Service Commissions Directory</span>
                  <span className="text-xs text-muted">→</span>
                </Link>
              </div>
            </div>

            {/* Quick Qualification & Sector Hubs */}
            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted font-bold px-1 block">
                Qualification Direct Hubs
              </span>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <Link
                  href="/qualification/12th-pass"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-surface border border-line hover:border-navy text-xs font-semibold text-ink min-h-[44px] flex items-center justify-center text-center transition-colors"
                >
                  12th Pass Jobs
                </Link>
                <Link
                  href="/qualification/diploma"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-surface border border-line hover:border-navy text-xs font-semibold text-ink min-h-[44px] flex items-center justify-center text-center transition-colors"
                >
                  Diploma & Poly
                </Link>
                <Link
                  href="/engineering-jobs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-surface border border-line hover:border-navy text-xs font-semibold text-ink min-h-[44px] flex items-center justify-center text-center transition-colors"
                >
                  Engineering (AE/JE)
                </Link>
                <Link
                  href="/qualification/graduate"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-surface border border-line hover:border-navy text-xs font-semibold text-ink min-h-[44px] flex items-center justify-center text-center transition-colors"
                >
                  Graduate Degree
                </Link>
                <Link
                  href="/organisations/ssc"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-navy-tint border border-navy-line text-xs font-bold text-navy min-h-[44px] flex items-center justify-center text-center transition-colors"
                >
                  SSC Recruitment
                </Link>
                <Link
                  href="/railway-jobs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-subtle border border-line text-xs font-semibold text-ink min-h-[44px] flex items-center justify-center text-center transition-colors"
                >
                  Railway RRB
                </Link>
              </div>
            </div>

            {/* Trust & Editorial Policy */}
            <div className="space-y-1 pt-1 border-t border-line">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted font-bold px-1 block">
                Editorial Desk & Trust
              </span>
              <div className="grid grid-cols-3 gap-1.5 pt-1 text-center text-xs">
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-surface border border-line hover:border-navy font-medium text-ink flex items-center justify-center min-h-[44px]"
                >
                  About Us
                </Link>
                <Link
                  href="/editorial-policy"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-surface border border-line hover:border-navy font-medium text-ink flex items-center justify-center min-h-[44px]"
                >
                  Verification
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-surface border border-line hover:border-navy font-medium text-ink flex items-center justify-center min-h-[44px]"
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
