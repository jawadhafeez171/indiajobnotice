import React from "react";
import type { Metadata } from "next";
import DirectoryPage from "@/app/directory/page";

export const metadata: Metadata = {
  title: "State Recruitment Directory 2026 - PSC & Police Boards | IndiaJobNotice.com",
  description: "Comprehensive directory of all 28 State Public Service Commissions and Subordinate Boards.",
  alternates: {
    canonical: "https://www.indiajobnotice.com/directory",
  },
};

export default function StateRecruitmentDirectoryPage() {
  return <DirectoryPage />;
}
