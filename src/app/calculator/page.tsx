import React from "react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { EligibilityCalculator } from "@/components/eligibility/EligibilityCalculator";
import { SocialAlertBar } from "@/components/common/SocialAlertBar";
import { TricolorCapsule } from "@/components/common/BrandLogo";

export const metadata = {
  title: "Government Job Age & Eligibility Calculator 2026 - IndiaJobNotice.com",
  description: "Calculate your exact age and find all Central and State government jobs you are eligible for based on DOB, Category, and Qualification.",
};

export default function CalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF4]">
      <Navbar currentStateSlug="central" />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full space-y-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <TricolorCapsule className="w-14 h-1.5" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#1E3799] font-bold">
              Official Statutory Calculator
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1918] tracking-tight">
            Government Job Eligibility & Age Calculator
          </h1>
          <p className="text-sm sm:text-base text-[#524E48] mt-2 leading-relaxed">
            Never miss an exam because of confusing age limit clauses. Our calculator applies statutory category age relaxations (OBC +3y, SC/ST +5y) to filter positions you can legally apply for.
          </p>
        </div>

        <EligibilityCalculator currentStateSlug="central" />

        <SocialAlertBar />
      </main>
      <Footer />
    </div>
  );
}
