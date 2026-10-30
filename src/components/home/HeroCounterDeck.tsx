"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  Briefcase, 
  Clock, 
  FileCheck, 
  Award, 
  MapPin, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Sparkles
} from "lucide-react";

interface HeroCounterDeckProps {
  totalVacancies: number;
  openApplicationsCount: number;
  closingSoonCount: number;
  admitCardsCount: number;
  resultsCount: number;
  statesCount?: number;
}

export function HeroCounterDeck({
  totalVacancies,
  openApplicationsCount,
  closingSoonCount,
  admitCardsCount,
  resultsCount,
  statesCount = 36,
}: HeroCounterDeckProps) {
  const stats = [
    {
      id: "vacancies",
      href: "#major-recruitments",
      badge: "National Total",
      value: totalVacancies.toLocaleString("en-IN") + "+",
      label: "Active Vacancies",
      subtext: "Central, Railways, PSC & Defense",
      icon: Briefcase,
      color: "text-[#1E3799]",
      bg: "bg-[#EEF2FA]/70 hover:bg-[#EEF2FA]",
      border: "border-[#CCD8F0] hover:border-[#1E3799]/60",
      accentDot: "bg-[#1E3799]",
      pillBg: "bg-[#1E3799]/10 text-[#1E3799]",
    },
    {
      id: "open-apps",
      href: "#apply-open",
      badge: "Apply Window Active",
      value: `${openApplicationsCount} Drives`,
      label: "Open Registrations",
      subtext: `${closingSoonCount} Closing Soon this week`,
      icon: Clock,
      color: "text-[#E96B15]",
      bg: "bg-[#FDF3EB]/70 hover:bg-[#FDF3EB]",
      border: "border-[#F9D9C3] hover:border-[#E96B15]/60",
      accentDot: "bg-[#E96B15]",
      pillBg: "bg-[#E96B15]/10 text-[#E96B15]",
    },
    {
      id: "admit-cards",
      href: "#admit-cards",
      badge: "Live Hall Tickets",
      value: `${admitCardsCount} Released`,
      label: "Admit Cards Out",
      subtext: "Exam date still ahead",
      icon: FileCheck,
      color: "text-[#209948]",
      bg: "bg-[#EDF7F0]/70 hover:bg-[#EDF7F0]",
      border: "border-[#C6E7D0] hover:border-[#209948]/60",
      accentDot: "bg-[#209948]",
      pillBg: "bg-[#209948]/10 text-[#209948]",
    },
    {
      id: "results",
      href: "#results",
      badge: "Merit Declared",
      value: `${resultsCount} Published`,
      label: "Results & Scorecards",
      subtext: "Published in the last 45 days",
      icon: Award,
      color: "text-[#6C3EB8]",
      bg: "bg-[#F4F1F9]/70 hover:bg-[#F4F1F9]",
      border: "border-[#D9CEEE] hover:border-[#6C3EB8]/60",
      accentDot: "bg-[#6C3EB8]",
      pillBg: "bg-[#6C3EB8]/10 text-[#6C3EB8]",
    },
    {
      id: "states",
      href: "#all-states",
      badge: "Pan-India Hub",
      value: `${statesCount} States & UTs`,
      label: "Official State Portals",
      subtext: "Direct State Gazettes linked",
      icon: MapPin,
      color: "text-[#8A5F19]",
      bg: "bg-[#FAF5EC]/70 hover:bg-[#FAF5EC]",
      border: "border-[#EBDBC1] hover:border-[#8A5F19]/60",
      accentDot: "bg-[#8A5F19]",
      pillBg: "bg-[#8A5F19]/10 text-[#8A5F19]",
    },
  ];

  return (
    <div className="mt-5 pt-4 border-t border-[#EAE2D2]/80">
      {/* Mini Trust Header */}
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div className="flex items-center gap-2 text-[11px] font-mono text-[#68635B]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#209948] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#209948]" />
          </span>
          <span className="font-bold text-[#1A1918] uppercase tracking-wider">
            Live Recruitment Counter
          </span>
          <span className="text-[#D8CFBF]">·</span>
          <span>Verified Gazette Data Across India</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#209948] font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#209948]" />
          <span className="hidden sm:inline">100% Official Notifications Only</span>
        </div>
      </div>

      {/* Counter Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <a
              key={stat.id}
              href={stat.href}
              className={cn(
                "group relative rounded-lg p-3 sm:p-3.5 border transition-all duration-200 flex flex-col justify-between shadow-2xs hover:shadow-sm hover:-translate-y-0.5",
                stat.bg,
                stat.border
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span
                    className={cn(
                      "text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                      stat.pillBg
                    )}
                  >
                    {stat.badge}
                  </span>
                  <Icon className={cn("w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity", stat.color)} />
                </div>

                <div className={cn("font-serif text-lg sm:text-xl font-bold tracking-tight", stat.color)}>
                  {stat.value}
                </div>

                <div className="text-xs font-semibold text-[#1A1918] mt-0.5 line-clamp-1">
                  {stat.label}
                </div>
              </div>

              <div className="mt-2 pt-1.5 border-t border-black/5 flex items-center justify-between text-[11px] text-[#68635B]">
                <span className="text-[10px] sm:text-[11px] truncate">{stat.subtext}</span>
                <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0 ml-1 text-[#1A1918]" />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
