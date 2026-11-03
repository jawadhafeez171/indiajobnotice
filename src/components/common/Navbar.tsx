"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, Bookmark, Briefcase, CalendarDays, BarChart3, Calculator, Building2, MapPin, ChevronRight,
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

// the six most asked for first; the rest behind "More"
const BROWSE = [
  { href: "/qualification/10th-pass", label: "10th pass" },
  { href: "/qualification/12th-pass", label: "12th pass" },
  { href: "/qualification/graduate", label: "Graduate" },
  { href: "/railway-jobs", label: "Railways" },
  { href: "/banking-jobs", label: "Banks" },
  { href: "/police-defense-jobs", label: "Police & defence" },
  { href: "/qualification/diploma", label: "Diploma" },
  { href: "/engineering-jobs", label: "Engineering" },
  { href: "/teaching-jobs", label: "Teaching" },
  { href: "/organisations/ssc", label: "SSC" },
  { href: "/organisations/upsc", label: "UPSC" },
];

interface Props {
  currentStateSlug?: string;
  /** Job pages: no state bar on phones (it changes the site, not the notice; the menu still can). */
  compact?: boolean;
}

// the same names in the desktop bar and the phone menu
const PAGES = [
  { href: "/calendar", label: "Calendar", menuLabel: "Calendar of last dates and exams", icon: CalendarDays },
  { href: "/vacancies", label: "Vacancies", menuLabel: "Vacancies by qualification", icon: BarChart3 },
  { href: "/calculator", label: "Age calculator", menuLabel: "Age calculator", icon: Calculator },
  { href: "/directory", label: "Commissions & boards", menuLabel: "Commissions & boards", icon: Building2 },
];

export function Navbar({ currentStateSlug, compact = false }: Props) {
  const pathname = usePathname() || "/";
  const [allBrowse, setAllBrowse] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { savedCount } = useWatchlist();

  const currentState = currentStateSlug && currentStateSlug !== "central"
    ? getStateBySlug(currentStateSlug)
    : null;
  const jobsHref = currentState ? getStateSubdomainUrl(currentState.slug) : getCentralPortalUrl();

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuCloseRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // menu open: focus goes into it and stays there, Esc closes it, the page behind does not scroll
  // and cannot be reached; on close focus returns to the menu button
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const trigger = menuButtonRef.current;
    menuCloseRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setMobileMenuOpen(false);
      if (e.key !== "Tab" || !menuRef.current) return;
      const items = [...menuRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const behind = [document.querySelector("header"), document.getElementById("main-content"), document.querySelector("footer")];
    behind.forEach((el) => el?.setAttribute("inert", ""));
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      behind.forEach((el) => el?.removeAttribute("inert"));
      trigger?.focus();
    };
  }, [mobileMenuOpen]);

  // other parts of the page can open the state picker ("Choose your state")
  useEffect(() => {
    const open = () => setIsModalOpen(true);
    window.addEventListener("ijn:open-states", open);
    return () => window.removeEventListener("ijn:open-states", open);
  }, []);

  const close = () => setMobileMenuOpen(false);
  const menuLinks = [
    { href: jobsHref, label: currentState ? `${currentState.name} jobs` : "All jobs", icon: Briefcase },
    ...PAGES.map((pg) => ({ href: pg.href, label: pg.menuLabel, icon: pg.icon })),
  ];
  const isHere = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-3 focus:rounded-lg focus:bg-navy-solid focus:text-white focus:font-bold"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-40 bg-surface border-b border-line shadow-xs">
        <div className="flex h-[3px]" aria-hidden>
          <span className="flex-1 bg-saffron-bright" />
          <span className="flex-1 bg-white shadow-[inset_0_-1px_0_rgb(var(--c-line))]" />
          <span className="flex-1 bg-green-solid" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3 h-16">
            {/* Logo */}
            <a href={getCentralPortalUrl()} className="flex flex-col justify-center min-h-[48px] min-w-0 shrink group hover:opacity-95" title="India Job Notice home">
              <BrandLogo height={30} className="!h-6 sm:!h-8 [&_img]:!h-6 sm:[&_img]:!h-8" />
              <span className="mt-0.5 text-[11px] sm:text-[12px] leading-none font-semibold tracking-wide text-muted whitespace-nowrap">
                Verified government job alerts
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm text-ink-2 font-semibold">
              <a href={jobsHref} className="hover:text-navy transition-colors whitespace-nowrap py-3 -my-3 px-1">
                Jobs
              </a>
              {PAGES.map((pg) => (
                <Link
                  key={pg.href}
                  href={pg.href}
                  aria-current={isHere(pg.href) ? "page" : undefined}
                  className={`whitespace-nowrap py-3 -my-3 transition-colors hover:text-navy ${
                    isHere(pg.href) ? "text-navy underline decoration-2 underline-offset-[6px]" : ""
                  }`}
                >
                  {pg.label}
                </Link>
              ))}
              <span className="flex items-center gap-2">
                <a
                  href={TELEGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 min-h-[40px] rounded-lg border border-control text-ink-2 hover:border-navy hover:text-navy transition-colors whitespace-nowrap [&>svg]:text-[#1A7DB0]"
                  title="Free job alerts on Telegram"
                >
                  <TelegramLogo className="w-4 h-4" />
                  <span>Telegram</span>
                </a>
                <button
                  onClick={() => setIsWatchlistOpen(true)}
                  className="relative flex items-center gap-1.5 px-3 min-h-[40px] rounded-lg border border-line hover:border-navy text-ink hover:text-navy transition-colors whitespace-nowrap"
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
                className="w-11 h-11 flex items-center justify-center rounded-lg border border-line text-[#1A7DB0] active:bg-subtle"
                aria-label="Free job alerts on Telegram"
              >
                <TelegramLogo className="w-5 h-5" />
              </a>
              <button
                onClick={() => setIsWatchlistOpen(true)}
                className="relative w-11 h-11 flex items-center justify-center rounded-lg border border-line text-ink active:bg-subtle"
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
                ref={menuButtonRef}
                onClick={() => setMobileMenuOpen(true)}
                className="w-11 h-11 flex items-center justify-center rounded-lg border border-line text-navy active:bg-subtle"
                aria-label="Open menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="site-menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* desktop: the state bar is part of the pinned header */}
        <div className="hidden md:block">
          <StateQuickStrip currentStateSlug={currentStateSlug} onOpenSelector={() => setIsModalOpen(true)} />
        </div>
      </header>
      {/* phones: the state bar scrolls away (only the top row stays pinned); none on job pages */}
      {!compact && (
        <div className="md:hidden">
          <StateQuickStrip currentStateSlug={currentStateSlug} onOpenSelector={() => setIsModalOpen(true)} />
        </div>
      )}

      {/* Menu: a panel that slides in from the right (outside the header, whose blur would clip it) */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-200 ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!mobileMenuOpen}
        inert={!mobileMenuOpen}
      >
        <div className="absolute inset-0 bg-navy-deep/60" onClick={close} />
        <div
          ref={menuRef}
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={`absolute right-0 inset-y-0 w-[86%] max-w-sm bg-surface shadow-2xl flex flex-col transition-transform duration-200 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-4 h-16 border-b border-line shrink-0">
            <span className="font-serif text-lg font-bold text-ink">Menu</span>
            <button
              ref={menuCloseRef}
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
                    aria-current={isHere(href) ? "page" : undefined}
                    className={`flex items-center gap-3 px-1 min-h-[48px] rounded-lg text-[15px] font-semibold hover:bg-subtle active:bg-subtle ${isHere(href) ? "text-navy" : "text-ink"}`}
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
              <h3 className="text-sm font-bold text-ink mb-2">Browse jobs by</h3>
              <div className="flex flex-wrap gap-2">
                {(allBrowse ? BROWSE : BROWSE.slice(0, 6)).map((b) => (
                  <Link
                    key={b.href}
                    href={b.href}
                    onClick={close}
                    className="px-3.5 min-h-[44px] flex items-center rounded-full border border-line bg-subtle text-sm font-semibold text-ink-2 hover:border-navy hover:text-navy"
                  >
                    {b.label}
                  </Link>
                ))}
                {!allBrowse && (
                  <button
                    type="button"
                    onClick={() => setAllBrowse(true)}
                    className="px-3.5 min-h-[44px] flex items-center rounded-full text-sm font-semibold text-navy underline underline-offset-2"
                  >
                    More
                  </button>
                )}
              </div>
            </div>

            {/* alerts */}
            <div>
              <h3 className="text-sm font-bold text-ink mb-2">Free job alerts</h3>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={TELEGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className="flex items-center justify-center gap-2 min-h-[46px] rounded-xl bg-[#1A7DB0] active:bg-[#156C99] text-white font-bold text-sm"
                >
                  <TelegramLogo className="w-4 h-4" />
                  Telegram
                </a>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className="flex items-center justify-center gap-2 min-h-[46px] rounded-xl bg-[#13853F] active:bg-[#0E7A3E] text-white font-bold text-sm"
                >
                  <WhatsAppLogo className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-line px-4 py-1 flex items-center justify-center gap-5 text-[13px] text-muted">
            <Link href="/about" onClick={close} className="inline-flex items-center min-h-[44px] hover:text-navy">About</Link>
            <Link href="/editorial-policy" onClick={close} className="inline-flex items-center min-h-[44px] hover:text-navy">How we verify</Link>
            <Link href="/contact" onClick={close} className="inline-flex items-center min-h-[44px] hover:text-navy">Contact</Link>
          </div>
        </div>
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
