"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { StateSelectorModal } from "./StateSelectorModal";
import { getStateBySlug } from "@/config/states";
import { getStateSubdomainUrl, getCentralPortalUrl } from "@/lib/subdomains";

interface Props {
  currentStateSlug?: string;
}

export function Navbar({ currentStateSlug }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentState = currentStateSlug && currentStateSlug !== "central"
    ? getStateBySlug(currentStateSlug)
    : null;

  return (
    <>
      {/* Header naturally anchored by the signature Royal Blue border from the logo */}
      <header className="sticky top-0 z-40 bg-[#FCFAF4]/95 backdrop-blur-sm border-b-[3px] border-[#1E3799] shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-18 sm:h-20 py-2">
            
            {/* Logo Brand Mark & Subdomain Switcher */}
            <div className="flex items-center gap-4 sm:gap-6">
              <a href={getCentralPortalUrl()} className="block group transition-transform hover:opacity-95" title="India Job Notice Home">
                <BrandLogo />
              </a>

              {/* State Switcher Pill */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#EEF2FA] hover:bg-[#E0E9F8] text-[#1E3799] text-xs font-bold border border-[#CCD8F0] transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#E96B15]" />
                <span>{currentState ? `${currentState.name} (${currentState.code})` : "All India / Central"}</span>
                <ChevronDown className="w-3 h-3 text-[#1E3799]/70" />
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 text-sm text-[#3E3C38] font-medium">
              <a
                href={currentState ? getStateSubdomainUrl(currentState.slug) : getCentralPortalUrl()}
                className="hover:text-[#1E3799] transition-colors font-semibold"
              >
                Gazette Notices
              </a>

              <Link
                href="/calculator"
                className="text-[#E96B15] hover:text-[#D4590A] transition-colors font-bold flex items-center gap-1"
              >
                <span>Age & Eligibility</span>
              </Link>

              <button
                onClick={() => setIsModalOpen(true)}
                className="hover:text-[#1E3799] transition-colors font-semibold flex items-center gap-1.5"
              >
                <span>State Portals</span>
                <span className="text-[10px] font-mono font-black px-1.5 py-0.2 rounded bg-[#EEF2FA] text-[#1E3799] border border-[#CCD8F0]">
                  36
                </span>
              </button>

              <a
                href="#admit-cards"
                className="hover:text-[#1E3799] transition-colors font-semibold"
              >
                Admit Cards
              </a>

              <a
                href="#results"
                className="hover:text-[#1E3799] transition-colors font-semibold"
              >
                Results
              </a>
            </nav>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-2.5 py-1.5 rounded-md bg-[#EEF2FA] text-xs font-bold text-[#1E3799] border border-[#CCD8F0]"
              >
                {currentState ? currentState.code : "States"}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-[#1E3799]"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
              <Link href="/calculator" onClick={() => setMobileMenuOpen(false)} className="py-1 text-[#E96B15] font-bold">
                Age & Eligibility Calculator
              </Link>
              <a href="#admit-cards" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-[#1E3799]">
                Admit Cards
              </a>
              <a href="#results" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-[#1E3799]">
                Results & Cutoffs
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
    </>
  );
}
