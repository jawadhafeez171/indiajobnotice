"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Building2, 
  MapPin, 
  Phone, 
  ExternalLink, 
  Search, 
  ShieldCheck, 
  ArrowRight, 
  Share2, 
  Code, 
  Check, 
  Copy,
  FileCheck2,
  Filter,
  CheckCircle2
} from "lucide-react";
import { STATE_DIRECTORY_DATA, StateDirectoryRecord } from "@/data/state-directory";
import { STATES_REGISTRY, getStateBadgeColor } from "@/config/states";
import { cn } from "@/lib/utils";

export function StateDirectoryView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");
  const [copiedLink, setCopiedLink] = useState(false);

  // Filter records
  const filteredRecords = useMemo(() => {
    return STATE_DIRECTORY_DATA.filter((rec) => {
      if (!rec.state) return false;
      const q = searchQuery.toLowerCase().trim();

      const matchesRegion = selectedRegion === "ALL" || rec.region === selectedRegion;
      if (!matchesRegion) return false;

      if (!q) return true;

      const stateName = rec.state.name.toLowerCase();
      const code = rec.state.code.toLowerCase();
      const pscName = rec.apexPSC.name.toLowerCase();
      const pscCode = rec.apexPSC.shortCode.toLowerCase();
      const subCode = rec.subordinateBoard?.shortCode.toLowerCase() || "";
      const polCode = rec.policeBoard?.shortCode.toLowerCase() || "";

      return (
        stateName.includes(q) ||
        code.includes(q) ||
        pscName.includes(q) ||
        pscCode.includes(q) ||
        subCode.includes(q) ||
        polCode.includes(q)
      );
    });
  }, [searchQuery, selectedRegion]);

  const handleCopyDirectoryLink = () => {
    navigator.clipboard.writeText("https://www.indiajobnotice.com/directory");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-xl border border-[#EAE2D2] p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2ECE1] pb-4">
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1A1918]">
              All-India State Public Service Commissions & Police Boards Directory
            </h2>
            <p className="text-xs text-[#68635B] mt-0.5">
              Verified official recruitment commission portals, physical headquarters, and candidate helpdesks across all 28 Indian States.
            </p>
          </div>

          <button
            onClick={handleCopyDirectoryLink}
            className="px-3.5 py-1.5 rounded-lg border border-[#CCD8F0] bg-[#EEF2FA] hover:bg-[#DDE7F7] text-[#1E3799] text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
            title="Copy clean directory link for reference"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? "Link Copied!" : "Copy Directory Link"}</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#A09B90] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by state, commission code (e.g. KPSC, UPPSC, BPSC, RSMSSB)..."
              className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#EAE2D2] bg-[#FCFAF4] text-xs font-medium text-[#1A1918] focus:outline-none focus:border-[#1E3799] focus:bg-white transition-all shadow-2xs"
            />
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 text-xs font-bold">
            {["ALL", "North", "South", "East", "West", "Central"].map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={cn(
                  "px-3 py-2 rounded-md transition-colors whitespace-nowrap",
                  selectedRegion === region
                    ? "bg-[#1E3799] text-white"
                    : "bg-[#FCFAF4] text-[#68635B] border border-[#EAE2D2] hover:bg-white"
                )}
              >
                {region === "ALL" ? "All Regions" : `${region} India`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredRecords.map((rec) => {
          const badgeStyle = getStateBadgeColor(rec.state.code);

          return (
            <div
              key={rec.state.slug}
              className="bg-white rounded-xl border border-[#EAE2D2] p-6 shadow-2xs flex flex-col justify-between hover:border-[#CCD8F0] transition-all"
            >
              <div>
                {/* State Card Header */}
                <div className="flex items-start justify-between gap-3 border-b border-[#F2ECE1] pb-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("px-2 py-0.5 rounded text-[10px] font-mono font-bold border", badgeStyle.bg, badgeStyle.text, badgeStyle.border)}>
                        {rec.state.code}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-[#68635B] uppercase">
                        {rec.region} India · Capital: {rec.state.capital}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#1A1918]">
                      {rec.state.name}
                    </h3>
                  </div>

                  <span className="text-xs font-serif italic text-[#68635B] shrink-0">
                    {rec.state.nativeName}
                  </span>
                </div>

                {/* Official Apex PSC */}
                <div className="p-3.5 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2] space-y-2 mb-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-mono font-bold text-[#1E3799] flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Apex Public Service Commission</span>
                    </span>
                    <a
                      href={rec.apexPSC.portalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-[#1E3799] hover:underline inline-flex items-center gap-1"
                    >
                      <span>{rec.apexPSC.shortCode} Official Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <span className="font-serif font-bold text-sm text-[#1A1918] block">
                    {rec.apexPSC.name}
                  </span>

                  <div className="text-[11px] text-[#524E48] space-y-0.5 pt-1 border-t border-[#EAE2D2]/60">
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-[#209948] shrink-0" />
                      <span>Helpline: {rec.apexPSC.helpline}</span>
                    </p>
                    <p className="flex items-start gap-1.5 text-[#68635B]">
                      <MapPin className="w-3 h-3 text-[#E96B15] shrink-0 mt-0.5" />
                      <span>{rec.apexPSC.headquarters}</span>
                    </p>
                  </div>
                </div>

                {/* Subordinate & Police Boards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-4">
                  {rec.subordinateBoard && (
                    <div className="p-2.5 rounded bg-white border border-[#EAE2D2]">
                      <span className="text-[10px] font-mono uppercase text-[#68635B] block font-bold">
                        Staff Selection Board
                      </span>
                      <a
                        href={rec.subordinateBoard.portalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-xs text-[#1E3799] hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <span className="truncate">{rec.subordinateBoard.shortCode}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </a>
                    </div>
                  )}

                  {rec.policeBoard && (
                    <div className="p-2.5 rounded bg-white border border-[#EAE2D2]">
                      <span className="text-[10px] font-mono uppercase text-[#68635B] block font-bold">
                        Police Recruitment Board
                      </span>
                      <a
                        href={rec.policeBoard.portalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-xs text-[#E96B15] hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <span className="truncate">{rec.policeBoard.shortCode}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Internal Bidirectional Cross-Links */}
              <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-between gap-3 text-xs">
                <Link
                  href={`/government-jobs/${rec.state.slug}`}
                  className="font-bold text-[#1E3799] hover:underline flex items-center gap-1"
                >
                  <span>{rec.state.name} government jobs</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                <Link
                  href={`/state/${rec.state.slug}`}
                  className="px-2.5 py-1 rounded bg-[#FAF7EF] border border-[#DDD5C7] text-[#524E48] hover:text-[#1A1918] font-medium"
                >
                  /state/{rec.state.slug}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Institutional Sharing Note (Placement Cells, Libraries, Coaching Desks) */}
      <div className="bg-white rounded-xl border border-[#EAE2D2] p-6 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#209948]" />
          <h3 className="font-serif text-base font-bold text-[#1A1918]">
            Resource Usage Notice for College Placement Cells & Libraries
          </h3>
        </div>
        <p className="text-xs text-[#524E48] leading-relaxed">
          This directory is curated as an open reference guide to prevent aspirants from falling victim to fake job websites and phishing domains. All official portals link directly to secure <code>.gov.in</code> and <code>.nic.in</code> government infrastructure. Universities, training & placement officers (TPOs), and coaching centres are encouraged to bookmark and link to this resource.
        </p>
      </div>
    </div>
  );
}
