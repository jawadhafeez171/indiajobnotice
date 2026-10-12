"use client";

import React, { useState, useMemo } from "react";
import { SAMPLE_JOBS } from "@/data/jobs";
import { JobCard } from "@/components/jobs/JobCard";
import { TricolorCapsule } from "@/components/common/BrandLogo";

interface Props {
  currentStateSlug?: string;
}

export function EligibilityCalculator({ currentStateSlug }: Props) {
  const [dob, setDob] = useState("2000-01-15");
  const [category, setCategory] = useState<"UR" | "OBC" | "SC" | "ST" | "EWS">("UR");
  const [qualification, setQualification] = useState<string>("Graduate");

  // Calculate age as of today
  const ageDetails = useMemo(() => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return { years, months, days };
  }, [dob]);

  // Category relaxation
  const relaxationBonus = useMemo(() => {
    switch (category) {
      case "OBC":
        return 3;
      case "SC":
      case "ST":
        return 5;
      default:
        return 0;
    }
  }, [category]);

  // Filter eligible jobs
  const matchingJobs = useMemo(() => {
    if (!ageDetails) return [];
    const effectiveAge = ageDetails.years;

    return SAMPLE_JOBS.filter((job) => {
      if (currentStateSlug && currentStateSlug !== "central") {
        if (!job.isCentral && job.stateSlug !== currentStateSlug) {
          return false;
        }
      }

      const maxAllowedAge = job.maxAge + relaxationBonus;
      const isAgeEligible = effectiveAge >= job.minAge && effectiveAge <= maxAllowedAge;

      let isQualEligible = true;
      if (qualification === "10th Pass") {
        isQualEligible = job.qualifications.some((q) => q.toLowerCase().includes("10th"));
      } else if (qualification === "12th Pass") {
        isQualEligible = job.qualifications.some(
          (q) => q.toLowerCase().includes("10th") || q.toLowerCase().includes("12th")
        );
      } else if (qualification === "Graduate") {
        isQualEligible = true;
      }

      return isAgeEligible && isQualEligible;
    });
  }, [ageDetails, relaxationBonus, qualification, currentStateSlug]);

  return (
    <div className="bg-white rounded-lg border border-[#EAE2D2] border-t-4 border-t-[#E96B15] p-6 shadow-2xs">
      {/* Editorial Header */}
      <div className="border-b border-[#F2ECE1] pb-4 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <TricolorCapsule className="w-12 h-1.5" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#E96B15] font-bold">
            Interactive Eligibility Tool
          </span>
        </div>
        <h3 className="font-serif text-lg font-bold text-[#1A1918]">
          Age & Educational Eligibility Checker
        </h3>
        <p className="text-xs text-[#68635B] mt-0.5">
          Calculates your age as of today and automatically applies official category relaxations (OBC +3y, SC/ST +5y) to filter verified matching circulars.
        </p>
      </div>

      {/* Form Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-[#423F3A] mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-[#EAE2D2] bg-[#FCFAF4] text-xs font-medium text-[#1A1918] focus:outline-none focus:border-[#1E3799] focus:ring-1 focus:ring-[#1E3799]/30 transition-all"
          />
          {ageDetails && (
            <p className="text-[11px] text-[#1E3799] mt-1.5 font-mono font-bold">
              Current Age: {ageDetails.years}y {ageDetails.months}m {ageDetails.days}d
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-[#423F3A] mb-1">
            Reservation Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="w-full px-3 py-2 rounded-md border border-[#EAE2D2] bg-[#FCFAF4] text-xs font-medium text-[#1A1918] focus:outline-none focus:border-[#1E3799] focus:ring-1 focus:ring-[#1E3799]/30 transition-all"
          >
            <option value="UR">UR / General (No relaxation)</option>
            <option value="EWS">EWS (Standard limit)</option>
            <option value="OBC">OBC (+3 Years Relaxation)</option>
            <option value="SC">SC (+5 Years Relaxation)</option>
            <option value="ST">ST (+5 Years Relaxation)</option>
          </select>
          <p className="text-[11px] text-[#68635B] mt-1.5">
            {relaxationBonus > 0 ? (
              <span className="text-[#209948] font-bold">+{relaxationBonus} years relaxation applied</span>
            ) : (
              "General standard upper age limit"
            )}
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#423F3A] mb-1">
            Highest Completed Education
          </label>
          <select
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-[#EAE2D2] bg-[#FCFAF4] text-xs font-medium text-[#1A1918] focus:outline-none focus:border-[#1E3799] focus:ring-1 focus:ring-[#1E3799]/30 transition-all"
          >
            <option value="Graduate">Graduation Degree (BA, BSc, BTech, BCom, etc.)</option>
            <option value="12th Pass">12th Intermediate / Higher Secondary</option>
            <option value="10th Pass">10th Matriculation / High School</option>
          </select>
          <p className="text-[11px] text-[#68635B] mt-1.5">
            Includes all UGC/AICTE equivalent streams
          </p>
        </div>
      </div>

      {/* Results Section */}
      <div className="pt-4 border-t border-[#F2ECE1]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#209948]" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#1E3799] font-bold">
              Eligible Gazettes ({matchingJobs.length})
            </span>
          </div>
          <span className="text-xs text-[#68635B] font-mono">
            {ageDetails?.years} yrs · {category} · {qualification}
          </span>
        </div>

        {matchingJobs.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#68635B] bg-[#FCFAF4] rounded-md border border-[#EAE2D2]">
            No active positions match this exact criteria. Try adjusting category or education level.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchingJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                currentStateSlug={currentStateSlug}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
