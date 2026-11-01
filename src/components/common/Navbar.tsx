"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu, X, Bookmark, Briefcase, CalendarDays, CalendarClock, BarChart3, Calculator, Building2, MapPin, ChevronRight,
} from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { StateSelectorModal } from "./StateSelectorModal";
import { StateQuickStrip } from "./StateQuickStrip";
import { WatchlistDrawer } from "./WatchlistDrawer";
import { TelegramLogo, WhatsAppLogo } from "./SocialIcons";
import { useWatchlist } from "@/lib/watchlist";
import { getStateBySlug } from "@/config/states";
import { getStateSubdomainUrl, getCentralPortalUrl } from "@/lib/subdomains";

const TELEGRAM = "https://t.me/Indiajobnotice1";
const WHATSAPP = "https://whatsapp.com/channel/0029Vb9GFwsGzzKXYJyKer1C";

const BROWSE = [
  { href: "/qualification/10th-pass", label: "10th pass" },
  { href: "/qualification/12th-pass", label: "12th pass" },
  { href: "/qualification/diploma", label: "Diploma" },
  { href: "/qualification/graduate", label: "Graduate" },
  { href: "/engineering-jobs", label: "Engineering" },
  { href: "/railway-jobs", label: "Railways" },
  { href: "/banking-jobs", label: "Banks" },
  { href: "/police-defense-jobs", label: "Police & defence" },
  { href: "/teaching-jobs", label: "Teaching" },
  { href: "/organisations/ssc", label: "SSC" },
  { href: "/organisations/upsc", label: "UPSC" },
];

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
  const jobsHref = currentState ? getStateSubdomainUrl(currentState.slug) : getCentralPortalUrl();

  // menu open: Esc closes it and the page behind does not scroll
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileMenuOpen(false);
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [mobileMenuOpen]);

  const close = () => setMobileMenuOpen(false);
  const menuLinks = [
    { href: jobsHref, label: currentState ? `${currentState.name} jobs` : "All jobs", icon: Briefcase },
    { href: "/exam-dates", label: "Exam dates", icon: CalendarClock },
    { href: "/calendar", label: "Exam calendar", icon: CalendarDays },
    { href: "/vacancies", label: "Vacancies by qualification", icon: BarChart3 },
    { href: "/calculator", label: "Age calculator", icon: Calculator },
    { href: "/directory", label: "Commissions & boards", icon: Building2 },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-line shadow-xs">
        <div className="flex h-[3px]" aria-hidden>
          <span className="flex-1 bg-saffron-bright" />
          <span className="flex-1 bg-white" />
          <span className="flex-1 bg-green-solid" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3 h-16">
            {/* Logo */}
            <a href={getCentralPortalUrl()} className="block min-w-0 shrink group transition-transform hover:opacity-95" title="India Job Notice Home">
              <BrandLogo height={32} />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm text-ink-2 font-semibold">
              <a href={jobsHref} className="hover:text-navy transition-colors whitespace-nowrap">
                Jobs
              </a>
              <Link href="/calendar" className="hover:text-navy transition-colors whitespace-nowrap">
                Exam calendar
              </Link>
              <Link href="/exam-dates" className="hover:text-navy transition-colors whitespace-nowrap">
                Exam dates
              </Link>
              <Link href="/calculator" className="hover:text-navy transition-colors whitespace-nowrap">
                Age calculator
              </Link>
              <Link href="/directory" className="hover:text-navy transition-colors whitespace-nowrap">
                Directory
              </Link>
              <span className="flex items-center gap-2">
                <a
                  href={TELEGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#229ED9] hover:bg-[#1D88BC] text-white transition-colors whitespace-nowrap"
                  title="Free job alerts on Telegram"
                >
                  <TelegramLogo className="w-4 h-4" />
                  <span>Telegram</span>
                </a>
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
              </span>
            </nav>

            {/* Phone and tablet: Telegram, saved jobs, menu */}
            <div className="flex items-center gap-1.5 lg:hidden shrink-0">
              <a
                href={TELEGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-lg bg-[#229ED9] active:bg-[#1D88BC] text-white"
                aria-label="Free job alerts on Telegram"
              >
                <TelegramLogo className="w-5 h-5" />
              </a>
              <button
                onClick={() => setIsWatchlistOpen(true)}
                className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-lg border border-line text-ink active:bg-subtle"
                aria-label="Saved jobs"
              >
                <Bookmark className={`w-5 h-5 ${savedCount > 0 ? "fill-saffron-bright text-saffron" : "text-muted"}`} />
                {savedCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-saffron-solid text-white text-[10px] font-bold flex items-center justify-center">
                    {savedCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-lg border border-line text-navy active:bg-subtle"
                aria-label="Open menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="site-menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <StateQuickStrip
          currentStateSlug={currentStateSlug}
          onOpenSelector={() => setIsModalOpen(true)}
        />
      </header>

      {/* Menu: a panel that slides in from the right (outside the header, whose blur would clip it) */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-200 ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!mobileMenuOpen}
        inert={!mobileMenuOpen}
      >
        <div className="absolute inset-0 bg-navy-deep/60" onClick={close} />
        <nav
          id="site-menu"
          aria-label="Menu"
          className={`absolute right-0 inset-y-0 w-[86%] max-w-sm bg-surface shadow-2xl flex flex-col transition-transform duration-200 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-4 h-16 border-b border-line shrink-0">
            <span className="font-serif text-lg font-bold text-ink">Menu</span>
            <button
              onClick={close}
              className="w-11 h-11 -mr-2 flex items-center justify-center rounded-lg text-muted hover:text-ink hover:bg-subtle"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-6">
            {/* state */}
            <button
              onClick={() => {
                close();
                setIsModalOpen(true);
              }}
              className="w-full flex items-center justify-between gap-2 px-3 min-h-[52px] rounded-xl bg-navy-tint border border-navy-line text-left"
            >
              <span className="flex items-center gap-2 min-w-0">
                <MapPin className="w-4 h-4 text-navy shrink-0" />
                <span className="min-w-0">
                  <span className="block text-[11px] text-muted">Your state</span>
                  <span className="block font-bold text-navy truncate">{currentState ? currentState.name : "All India"}</span>
                </span>
              </span>
              <span className="text-sm font-semibold text-navy shrink-0">Change</span>
            </button>

            {/* main pages */}
            <ul className="-mx-1">
              {menuLinks.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={close}
                    className="flex items-center gap-3 px-1 min-h-[48px] rounded-lg text-[15px] font-semibold text-ink hover:bg-subtle active:bg-subtle"
                  >
                    <Icon className="w-5 h-5 text-navy shrink-0" />
                    <span className="flex-1">{label}</span>
                    <ChevronRight className="w-4 h-4 text-faint" />
                  </a>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    close();
                    setIsWatchlistOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-1 min-h-[48px] rounded-lg text-[15px] font-semibold text-ink hover:bg-subtle active:bg-subtle text-left"
                >
                  <Bookmark className="w-5 h-5 text-navy shrink-0" />
                  <span className="flex-1">Saved jobs</span>
                  {savedCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[12px] font-bold bg-saffron-solid text-white">{savedCount}</span>
                  )}
                  <ChevronRight className="w-4 h-4 text-faint" />
                </button>
              </li>
            </ul>

            {/* browse */}
            <div>
              <h3 className="text-[12px] font-bold uppercase tracking-wide text-muted mb-2">Browse jobs by</h3>
              <div className="flex flex-wrap gap-2">
                {BROWSE.map((b) => (
                  <Link
                    key={b.href}
                    href={b.href}
                    onClick={close}
                    className="px-3 min-h-[38px] flex items-center rounded-full border border-line bg-subtle text-[13px] font-semibold text-ink-2 hover:border-navy hover:text-navy"
                  >
                    {b.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* alerts */}
            <div>
              <h3 className="text-[12px] font-bold uppercase tracking-wide text-muted mb-2">Free job alerts</h3>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={TELEGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className="flex items-center justify-center gap-2 min-h-[46px] rounded-xl bg-[#229ED9] active:bg-[#1D88BC] text-white font-bold text-sm"
                >
                  <TelegramLogo className="w-4 h-4" />
                  Telegram
                </a>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className="flex items-center justify-center gap-2 min-h-[46px] rounded-xl bg-[#25D366] active:bg-[#20BA5A] text-white font-bold text-sm"
                >
                  <WhatsAppLogo className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-line px-4 py-3 flex items-center justify-center gap-5 text-[13px] text-muted">
            <Link href="/about" onClick={close} className="hover:text-navy">About</Link>
            <Link href="/editorial-policy" onClick={close} className="hover:text-navy">How we verify</Link>
            <Link href="/contact" onClick={close} className="hover:text-navy">Contact</Link>
          </div>
        </nav>
      </div>

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
