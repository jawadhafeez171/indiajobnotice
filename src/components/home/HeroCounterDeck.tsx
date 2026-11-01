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
      color: "text-navy",
      bg: "bg-navy-tint/70 hover:bg-navy-tint",
      border: "border-navy-line hover:border-navy/60",
      accentDot: "bg-navy-solid",
      pillBg: "bg-navy-solid/10 text-navy",
    },
    {
      id: "open-apps",
      href: "#apply-open",
      badge: "Apply Window Active",
      value: `${openApplicationsCount} Drives`,
      label: "Open Registrations",
      subtext: `${closingSoonCount} Closing Soon this week`,
      icon: Clock,
      color: "text-saffron",
      bg: "bg-saffron-tint/70 hover:bg-saffron-tint",
      border: "border-saffron-line hover:border-saffron-bright/60",
      accentDot: "bg-saffron-solid",
      pillBg: "bg-saffron-solid/10 text-saffron",
    },
    {
      id: "admit-cards",
      href: "#admit-cards",
      badge: "Live Hall Tickets",
      value: `${admitCardsCount} Released`,
      label: "Admit Cards Out",
      subtext: "Exam date still ahead",
      icon: FileCheck,
      color: "text-green",
      bg: "bg-green-tint/70 hover:bg-green-tint",
      border: "border-green-line hover:border-green/60",
      accentDot: "bg-green-solid",
      pillBg: "bg-green-solid/10 text-green",
    },
    {
      id: "results",
      href: "#results",
      badge: "Merit Declared",
      value: `${resultsCount} Published`,
      label: "Results & Scorecards",
      subtext: "Published in the last 45 days",
      icon: Award,
      color: "text-purple",
      bg: "bg-purple-tint/70 hover:bg-purple-tint",
      border: "border-purple-line hover:border-purple/60",
      accentDot: "bg-purple-solid",
      pillBg: "bg-purple-solid/10 text-purple",
    },
    {
      id: "states",
      href: "#all-states",
      badge: "Pan-India Hub",
      value: `${statesCount} States & UTs`,
      label: "Official State Portals",
      subtext: "Official websites linked",
      icon: MapPin,
      color: "text-amber",
      bg: "bg-subtle/70 hover:bg-subtle",
      border: "border-amber-line hover:border-amber/60",
      accentDot: "bg-amber-solid",
      pillBg: "bg-amber-solid/10 text-amber",
    },
  ];

  return (
    <div className="mt-5 pt-4 border-t border-line/80">
      {/* Mini Trust Header */}
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div className="flex items-center gap-2 text-[12px] font-mono text-muted">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-solid opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-solid" />
          </span>
          <span className="font-bold text-ink uppercase tracking-wider">
            Live Recruitment Counter
          </span>
          <span className="text-faint">·</span>
          <span>From official notifications across India</span>
        </div>

        <div className="flex items-center gap-1.5 text-[12px] font-mono text-green font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-green" />
          <span className="hidden sm:inline">Official notifications only</span>
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
                      "text-[9px] sm:text-[11px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
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

                <div className="text-xs font-semibold text-ink mt-0.5 line-clamp-1">
                  {stat.label}
                </div>
              </div>

              <div className="mt-2 pt-1.5 border-t border-black/5 flex items-center justify-between text-[12px] text-muted">
                <span className="text-[11px] sm:text-[12px] truncate">{stat.subtext}</span>
                <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0 ml-1 text-ink" />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
