"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  JobNotification, 
  getJobAgeCutoffDate, 
  calculateAgeAtDate 
} from "@/data/jobs";
import { JobCard } from "@/components/jobs/JobCard";
import { TricolorCapsule } from "@/components/common/BrandLogo";
import { formatDate, cn } from "@/lib/utils";
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Building2, 
  Share2, 
  Code, 
  Printer, 
  Copy, 
  Check, 
  GraduationCap,
  Sparkles,
  ExternalLink
} from "lucide-react";

import { getStateReservationRules, StateReservationCategory } from "@/config/state-reservations";

interface Props {
  currentStateSlug?: string;
  defaultJobId?: string;
  jobs: JobNotification[];   // open jobs with a stated age limit (getCalculatorJobs)
}

export function EligibilityCalculator(props: Props) {
  if (props.jobs.length === 0) {
    return (
      <div className="p-5 rounded-xl border border-line bg-subtle text-sm text-ink-2">
        The eligibility calculator lists open recruitments that state an age limit. None are listed right now.
      </div>
    );
  }
  return <EligibilityCalculatorInner {...props} />;
}

function EligibilityCalculatorInner({ currentStateSlug, defaultJobId, jobs }: Props) {
  const [calculationMode, setCalculationMode] = useState<"specific" | "scanner">(
    defaultJobId ? "specific" : "specific"
  );
  const [selectedJobId, setSelectedJobId] = useState<string>(
    (defaultJobId && jobs.some((j) => j.id === defaultJobId) ? defaultJobId : jobs[0].id)
  );
  const [dob, setDob] = useState("2000-05-15");
  const [category, setCategory] = useState<string>("UR");
  const [isStateDomicile, setIsStateDomicile] = useState(true);
  const [qualification, setQualification] = useState<string>("Graduate");
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Selected single job
  const selectedJob = useMemo(() => {
    return jobs.find((j) => j.id === selectedJobId) || jobs[0];
  }, [selectedJobId, jobs]);

  // Active state reservation ruleset (Central vs specific State)
  const activeStateSlug = useMemo(() => {
    if (calculationMode === "specific") {
      return selectedJob.isCentral ? "central" : (selectedJob.stateSlug || "central");
    }
    return currentStateSlug || "central";
  }, [calculationMode, selectedJob, currentStateSlug]);

  const activeRuleset = useMemo(() => {
    return getStateReservationRules(activeStateSlug);
  }, [activeStateSlug]);

  // Active category object from the state ruleset
  const currentCategoryObj = useMemo(() => {
    return (
      activeRuleset.categories.find((c) => c.code === category) ||
      activeRuleset.categories[0]
    );
  }, [activeRuleset, category]);

  // Effective relaxation bonus (0 if out-of-state candidate on state recruitment)
  const relaxationBonus = useMemo(() => {
    if (activeRuleset.stateSlug === "central") {
      return currentCategoryObj.defaultAgeRelaxationYears;
    }
    if (!isStateDomicile) {
      return 0; // Out-of-state candidates must compete under General/UR without concession
    }
    return currentCategoryObj.defaultAgeRelaxationYears;
  }, [activeRuleset, currentCategoryObj, isStateDomicile]);

  // Effective upper age limit (accounts for state overrides such as Bihar 37/40/42 or Karnataka 35/38/40)
  const effectiveMaxAllowedAge = useMemo(() => {
    if (activeRuleset.stateSlug === "central" || !isStateDomicile) {
      return selectedJob.maxAge + relaxationBonus;
    }
    if (currentCategoryObj.maxAgeOverride) {
      return currentCategoryObj.maxAgeOverride;
    }
    return selectedJob.maxAge + relaxationBonus;
  }, [activeRuleset, isStateDomicile, currentCategoryObj, selectedJob.maxAge, relaxationBonus]);

  // Cut-off date calculation for selected specific job
  const specificJobCutoffDate = useMemo(() => {
    return getJobAgeCutoffDate(selectedJob);
  }, [selectedJob]);

  const specificJobAge = useMemo(() => {
    return calculateAgeAtDate(dob, specificJobCutoffDate);
  }, [dob, specificJobCutoffDate]);

  const specificEligibilityResult = useMemo(() => {
    if (!specificJobAge) return { isEligible: false, reason: "Invalid Date of Birth" };

    const effectiveMaxAge = effectiveMaxAllowedAge;
    const years = specificJobAge.years;

    if (years < selectedJob.minAge) {
      return {
        isEligible: false,
        status: "UNDERAGE",
        reason: `Underage: Requires minimum ${selectedJob.minAge} years on cut-off date (${formatDate(specificJobCutoffDate)}). You are ${years}y ${specificJobAge.months}m ${specificJobAge.days}d.`,
      };
    }

    if (years > effectiveMaxAge) {
      return {
        isEligible: false,
        status: "OVERAGE",
        reason: `Overage: Maximum allowed age for ${currentCategoryObj.shortLabel} ${!isStateDomicile && activeRuleset.stateSlug !== "central" ? "(Evaluated as Out-of-State General)" : ""} is ${effectiveMaxAge} years. You are ${years}y ${specificJobAge.months}m ${specificJobAge.days}d on ${formatDate(specificJobCutoffDate)}.`,
      };
    }

    return {
      isEligible: true,
      status: "ELIGIBLE",
      reason: `Eligible: Your age is ${years}y ${specificJobAge.months}m ${specificJobAge.days}d as of the official cut-off date (${formatDate(specificJobCutoffDate)}). Maximum allowed age ceiling: ${effectiveMaxAge} yrs for ${currentCategoryObj.shortLabel}${!isStateDomicile && activeRuleset.stateSlug !== "central" ? " (General merit rules apply due to out-of-state domicile)" : relaxationBonus > 0 ? ` (+${relaxationBonus}y relaxation)` : ""}.`,
    };
  }, [specificJobAge, selectedJob, effectiveMaxAllowedAge, currentCategoryObj, isStateDomicile, activeRuleset, relaxationBonus, specificJobCutoffDate]);

  // All-India Scanner: calculates eligibility for each job against ITS OWN individual cutoff date
  const scannerEligibleJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (currentStateSlug && currentStateSlug !== "central") {
        if (!job.isCentral && job.stateSlug !== currentStateSlug) {
          return false;
        }
      }

      // Check age against this job's actual official cutoff date
      const cutoff = getJobAgeCutoffDate(job);
      const ageAtCutoff = calculateAgeAtDate(dob, cutoff);
      const maxAllowed = job.maxAge + relaxationBonus;

      const isAgeOk = ageAtCutoff.years >= job.minAge && ageAtCutoff.years <= maxAllowed;

      let isQualOk = true;
      if (qualification === "10th Pass") {
        isQualOk = job.qualifications.some((q) => q.toLowerCase().includes("10th"));
      } else if (qualification === "12th Pass") {
        isQualOk = job.qualifications.some(
          (q) => q.toLowerCase().includes("10th") || q.toLowerCase().includes("12th")
        );
      } else if (qualification === "Diploma") {
        isQualOk = job.qualifications.some(
          (q) => q.toLowerCase().includes("diploma") || q.toLowerCase().includes("polytechnic") || q.toLowerCase().includes("12th")
        );
      }

      return isAgeOk && isQualOk;
    });
  }, [dob, relaxationBonus, qualification, currentStateSlug]);

  const handleCopySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const embedCode = `<iframe src="https://www.indiajobnotice.com/calculator" width="100%" height="700" frameborder="0" title="Government Job Age & Cutoff Date Calculator"></iframe>`;
  const markdownBadge = `[![Govt Job Age Calculator](https://img.shields.io/badge/Govt_Job-Eligibility_Calculator-1E3799?style=for-the-badge&logo=gov)](https://www.indiajobnotice.com/calculator)`;

  return (
    <div className="bg-surface rounded-xl border border-line border-t-4 border-t-saffron-bright p-6 sm:p-7 shadow-2xs space-y-6">
      {/* Header & Tool Bar */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-line-soft pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <TricolorCapsule className="w-12 h-1.5" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-saffron font-bold">
              Age eligibility check
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink">
            Government Job Age & Notification Cutoff Calculator
          </h2>
          <p className="text-xs text-muted mt-1 max-w-2xl leading-relaxed">
            Calculates candidate age strictly against each commission’s statutory cut-off date (e.g. 1st August for UPSC/SSC or 1st July for State Police), applying official category age relaxations (OBC +3y, SC/ST +5y, PwD +10y).
          </p>
        </div>

        {/* Action Buttons for Institutional / College Placement Desks */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowEmbedModal(true)}
            className="px-3 py-1.5 rounded-md border border-navy-line bg-navy-tint hover:bg-navy-tint-2 text-navy text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Embed tool on College Placement or Library Portal"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Embed on College Portal</span>
          </button>
          <button
            onClick={() => window.print()}
            className="p-1.5 rounded-md border border-line hover:bg-subtle text-muted transition-colors"
            title="Print Eligibility Assessment"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-3 border-b border-line pb-px text-xs font-bold">
        <button
          onClick={() => setCalculationMode("specific")}
          className={cn(
            "pb-3 px-2 border-b-2 transition-all flex items-center gap-1.5",
            calculationMode === "specific"
              ? "border-saffron-bright text-saffron"
              : "border-transparent text-muted hover:text-ink"
          )}
        >
          <Clock className="w-4 h-4" />
          <span>Notification Cut-off Date Calculator</span>
          <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-saffron-tint text-saffron">
            Precise
          </span>
        </button>

        <button
          onClick={() => setCalculationMode("scanner")}
          className={cn(
            "pb-3 px-2 border-b-2 transition-all flex items-center gap-1.5",
            calculationMode === "scanner"
              ? "border-navy text-navy"
              : "border-transparent text-muted hover:text-ink"
          )}
        >
          <Sparkles className="w-4 h-4" />
          <span>All-India Verified Scanner</span>
          <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-navy-tint text-navy">
            {scannerEligibleJobs.length} Matches
          </span>
        </button>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-subtle p-4 rounded-xl border border-line">
        {/* Date of Birth */}
        <div>
          <label className="block text-xs font-bold text-ink-2 mb-1">
            Candidate Date of Birth (DOB)
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full px-3 py-2.5 sm:py-2 rounded-lg border border-line bg-surface text-[15px] sm:text-xs min-h-[44px] font-medium text-ink focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy/30 transition-all shadow-2xs"
          />
          <p className="text-[12px] text-muted mt-1 font-mono">
            As stated on 10th Class Certificate
          </p>
        </div>

        {/* Social Reservation Category */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-ink-2">
              Reservation Category
            </label>
            <span className="text-[11px] font-mono text-navy font-bold">
              {activeRuleset.stateName}
            </span>
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2.5 sm:py-2 rounded-lg border border-line bg-surface text-[15px] sm:text-xs min-h-[44px] font-medium text-ink focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy/30 transition-all shadow-2xs cursor-pointer"
          >
            {activeRuleset.categories.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
          <p className="text-[12px] text-green mt-1 font-semibold">
            {relaxationBonus > 0
              ? `+${relaxationBonus} years relaxation (${effectiveMaxAllowedAge} yrs ceiling)`
              : `Upper Age Ceiling: ${effectiveMaxAllowedAge} Years`}
          </p>
        </div>

        {/* Highest Completed Qualification */}
        <div>
          <label className="block text-xs font-bold text-ink-2 mb-1">
            Highest Completed Qualification
          </label>
          <select
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            className="w-full px-3 py-2.5 sm:py-2 rounded-lg border border-line bg-surface text-[15px] sm:text-xs min-h-[44px] font-medium text-ink focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy/30 transition-all shadow-2xs cursor-pointer"
          >
            <option value="Graduate">Graduation Degree (BA, BSc, BTech, BCom, etc.)</option>
            <option value="Diploma">Diploma / Polytechnic</option>
            <option value="12th Pass">12th Intermediate / Higher Secondary</option>
            <option value="10th Pass">10th Matriculation / High School</option>
          </select>
          <p className="text-[12px] text-muted mt-1">
            Valid recognition by UGC / AICTE / State Boards
          </p>
        </div>
      </div>

      {/* State Statutory Domicile Notice & Permanent Resident Toggle */}
      {activeRuleset.stateSlug !== "central" && (
        <div className="p-3.5 rounded-lg bg-subtle border border-line space-y-2.5 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-bold text-ink block">
                {activeRuleset.stateName} State Domicile Status
              </span>
              <p className="text-[12px] text-muted">
                Do you hold a valid domicile / permanent resident certificate of {activeRuleset.stateName}?
              </p>
            </div>

            <div className="inline-flex rounded-md border border-line bg-surface p-0.5 self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setIsStateDomicile(true)}
                className={cn(
                  "px-3 py-1.5 rounded text-xs font-bold transition-colors",
                  isStateDomicile
                    ? "bg-navy-solid text-white"
                    : "text-muted hover:text-ink"
                )}
              >
                Yes ({activeRuleset.stateName} Resident)
              </button>
              <button
                type="button"
                onClick={() => setIsStateDomicile(false)}
                className={cn(
                  "px-3 py-1.5 rounded text-xs font-bold transition-colors",
                  !isStateDomicile
                    ? "bg-saffron-solid text-white"
                    : "text-muted hover:text-ink"
                )}
              >
                No (Out-of-State Candidate)
              </button>
            </div>
          </div>

          {/* Domicile Rule Warning if Out-of-State */}
          {!isStateDomicile && (
            <div className="p-2.5 rounded bg-saffron-tint border border-saffron-line text-[12px] text-ink-2 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
              <span>
                <strong>Candidates from other states:</strong> {activeRuleset.domicileRule}
              </span>
            </div>
          )}

          {/* State Special Quotas Badges */}
          {activeRuleset.specialQuotas.length > 0 && isStateDomicile && (
            <div className="pt-2 border-t border-line flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono font-bold text-muted uppercase">
                Active Special State Quotas:
              </span>
              {activeRuleset.specialQuotas.map((q) => (
                <span
                  key={q.id}
                  className="px-2 py-0.5 rounded bg-surface border border-navy-line text-navy text-[11px] font-bold"
                  title={q.eligibilityCondition}
                >
                  {q.name} {q.percentage ? `(${q.percentage}%)` : ""}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODE 1: SPECIFIC NOTIFICATION CUT-OFF DATE VERDICT */}
      {calculationMode === "specific" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-ink mb-1.5">
              Choose a recruitment to check:
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full px-3.5 py-3 sm:py-2.5 rounded-lg border border-navy-line bg-navy-tint/50 text-[14px] sm:text-xs min-h-[44px] font-bold text-navy focus:outline-none focus:border-navy shadow-2xs cursor-pointer"
            >
              {jobs.map((job) => {
                const cutoff = getJobAgeCutoffDate(job);
                return (
                  <option key={job.id} value={job.id}>
                    {job.orgShortCode} — {job.shortTitle} (Official Cutoff Date: {formatDate(cutoff)})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Detailed Statutory Age Assessment Card */}
          <div
            className={cn(
              "p-5 rounded-xl border transition-all",
              specificEligibilityResult.isEligible
                ? "bg-green-tint border-green-line"
                : "bg-saffron-tint border-saffron-line"
            )}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {specificEligibilityResult.isEligible ? (
                    <span className="px-3 py-1 rounded bg-green-solid text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ELIGIBLE TO APPLY</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded bg-saffron-solid text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                      <XCircle className="w-4 h-4" />
                      <span>{specificEligibilityResult.status}</span>
                    </span>
                  )}
                  <span className="font-mono text-xs text-ink font-bold">
                    Crucial Date: {formatDate(specificJobCutoffDate)}
                  </span>
                </div>

                <p className="text-xs text-ink-2 leading-relaxed pt-1">
                  {specificEligibilityResult.reason}
                </p>
              </div>

              {/* Age breakdown chips */}
              <div className="grid grid-cols-3 gap-2 shrink-0 bg-surface p-3 rounded-lg border border-line text-center">
                <div>
                  <span className="text-[11px] font-mono uppercase text-muted block font-semibold">Years</span>
                  <span className="font-mono font-bold text-base text-navy">{specificJobAge.years}</span>
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase text-muted block font-semibold">Months</span>
                  <span className="font-mono font-bold text-base text-navy">{specificJobAge.months}</span>
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase text-muted block font-semibold">Days</span>
                  <span className="font-mono font-bold text-base text-navy">{specificJobAge.days}</span>
                </div>
              </div>
            </div>

            {/* Quick Link to selected job */}
            <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-xs">
              <span className="text-muted">
                Notification: <strong className="text-ink">{selectedJob.title}</strong>
              </span>
              <Link
                href={selectedJob.isCentral ? `/jobs/${selectedJob.slug}` : `/state/${selectedJob.stateSlug}/jobs/${selectedJob.slug}`}
                className="font-bold text-navy hover:underline flex items-center gap-1"
              >
                <span>View job and apply</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: ALL-INDIA SCANNER RESULT */}
      {calculationMode === "scanner" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-2 text-xs">
            <span className="font-bold text-ink">
              Verified Positions matching your DOB & Educational Stream ({scannerEligibleJobs.length})
            </span>
            <span className="font-mono text-muted">
              Calculated using each gazette’s respective cutoff date
            </span>
          </div>

          {scannerEligibleJobs.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted bg-subtle rounded-lg border border-line">
              No active circulars match this specific age on cutoff dates. Try selecting a different reservation category or qualification tier.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scannerEligibleJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  currentStateSlug={job.isCentral ? "central" : job.stateSlug}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* EMBED CODE MODAL FOR COLLEGE PLACEMENT CELLS & LIBRARIES */}
      {showEmbedModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-xl max-w-lg w-full p-6 border border-line shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-navy" />
                <h3 className="font-serif font-bold text-base text-ink">
                  Embed on College Placement Portal or Library Desk
                </h3>
              </div>
              <button
                onClick={() => setShowEmbedModal(false)}
                className="text-muted hover:text-ink font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-ink-2 leading-relaxed">
              College career advisory centres, training & placement cells (TPO), coaching institutes, and district central libraries are welcome to freely integrate this statutory cut-off calculator for students.
            </p>

            <div>
              <label className="block text-[12px] font-mono uppercase font-bold text-muted mb-1">
                Responsive HTML iFrame Embed Code
              </label>
              <div className="relative">
                <textarea
                  readOnly
                  rows={3}
                  value={embedCode}
                  className="w-full p-2.5 rounded bg-subtle border border-line text-xs font-mono text-ink focus:outline-none"
                />
                <button
                  onClick={() => handleCopySnippet(embedCode)}
                  className="absolute right-2 bottom-3 px-2.5 py-1 rounded bg-navy-solid text-white text-[12px] font-bold flex items-center gap-1 shadow-2xs hover:bg-navy-strong"
                >
                  {copiedSnippet ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSnippet ? "Copied" : "Copy iFrame"}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-mono uppercase font-bold text-muted mb-1">
                Markdown Link for College Placement Repositories & Blogs
              </label>
              <div className="relative">
                <textarea
                  readOnly
                  rows={2}
                  value={markdownBadge}
                  className="w-full p-2.5 rounded bg-subtle border border-line text-xs font-mono text-ink focus:outline-none"
                />
                <button
                  onClick={() => handleCopySnippet(markdownBadge)}
                  className="absolute right-2 bottom-3 px-2.5 py-1 rounded bg-saffron-solid text-white text-[12px] font-bold flex items-center gap-1 shadow-2xs hover:bg-saffron-strong"
                >
                  {copiedSnippet ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSnippet ? "Copied" : "Copy Markdown"}</span>
                </button>
              </div>
            </div>

            <div className="pt-2 text-[12px] text-muted bg-green-tint p-3 rounded-lg border border-green-line flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green shrink-0" />
              <span>100% Free, zero advertisements in iframe, compliant with educational public-interest use.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
