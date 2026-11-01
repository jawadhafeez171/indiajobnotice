"use client";

import React from "react";
import { JobNotification } from "@/data/jobs";
import { JobListCard } from "./JobListCard";
import { cn } from "@/lib/utils";
import { Bookmark } from "lucide-react";
import { useWatchlist } from "@/lib/watchlist";

interface Props {
  job: JobNotification;
  currentStateSlug?: string;
  currentDistrictSlug?: string;
}

export function JobCard({ job, currentDistrictSlug }: Props) {
  const { isSaved, toggleSave } = useWatchlist();
  const saved = isSaved(job.id);

  const districtQuota = currentDistrictSlug
    ? job.districtWiseVacancies?.find((v) => v.districtSlug.toLowerCase() === currentDistrictSlug.toLowerCase())
    : null;

  return (
    <JobListCard
      job={job}
      extra={
        <>
          {job.isDistrictSpecific && job.districtName && (
            <span className="px-2 py-0.5 rounded-full text-[12px] font-bold bg-saffron-tint text-saffron border border-saffron-line">
              {job.districtName} only
            </span>
          )}
          {districtQuota && (
            <span className="px-2 py-0.5 rounded-full text-[12px] font-bold bg-green-tint text-green border border-green-line">
              {districtQuota.vacancies.toLocaleString("en-IN")} posts in this district
            </span>
          )}
        </>
      }
      action={
        <button
          onClick={() => toggleSave(job.id)}
          className={cn("p-1 rounded transition-colors", saved ? "text-saffron" : "text-faint hover:text-navy")}
          title={saved ? "Remove from saved" : "Save this job"}
          aria-label={saved ? "Remove from saved" : "Save this job"}
        >
          <Bookmark className={cn("w-4 h-4", saved && "fill-saffron-bright")} />
        </button>
      }
    />
  );
}
