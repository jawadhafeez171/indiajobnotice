export type JobStatus =
  | "APPLY_OPEN"
  | "UPCOMING"
  | "LAST_DATE_NEAR"
  | "ADMIT_CARD_OUT"
  | "RESULT_OUT"
  | "APPLICATIONS_CLOSED";

export type JobCategory =
  | "Police / Defense"
  | "Administrative / PSC"
  | "Teaching / Education"
  | "Railways"
  | "Banking / Insurance"
  | "Engineering / Technical"
  | "Clerical / Stenographer"
  | "Medical & Nursing";

export interface JobNotification {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  organization: string;
  orgShortCode: string;
  stateSlug: string; // 'central' or state slug like 'up', 'bihar'
  isCentral: boolean;
  category: JobCategory;
  totalVacancies: number;
  qualifications: string[]; // e.g. ["12th Pass", "Graduate"]
  minAge: number;
  maxAge: number;
  ageRelaxation: string;
  ageCutoffDate?: string; // Official cutoff date for age determination, e.g., '2026-08-01'
  salary: string;
  applicationStartDate: string;
  applicationEndDate: string;
  admitCardDate?: string;
  examDate?: string;
  resultDate?: string;
  status: JobStatus;
  officialPdfUrl: string;
  applyOnlineUrl: string;
  applicationFee: {
    ur_obc_ews: number;
    sc_st: number;
    female_or_pwd?: number;
  };
  selectionProcess: string[];
  keyHighlights: string[];
  syllabusSummary: string;
  viewsCount: number;
  featured?: boolean;
  // District-wise Recruitment Extensions
  isDistrictSpecific?: boolean;
  districtSlug?: string;
  districtName?: string;
  districtWiseVacancies?: DistrictVacancyBreakout[];
  // Trust & Verification Metadata (Google E-E-A-T Compliance)
  lastVerifiedDate?: string;     // e.g. "October 18, 2026"
  verificationSource?: string;   // e.g. "Official UPSC Gazette Notification No. 05/2026-CSP"
  // Set by the notice agent (indiajobnotice-agent, stage 4). A value the notification does not
  // state is left out (ageKnown / feeKnown false): show "see notification", never a made-up 0.
  ageKnown?: boolean;
  feeKnown?: boolean;
  applicationFeeText?: string;
  advtNo?: string;
  isWalkIn?: boolean;
  updates?: { date: string; text: string; url: string }[];
  posts?: { postName: string; vacancies: number; qualification: string; ageLimit: string; pay: string }[];
  /** Later documents of this recruitment found on the official site (admit cards, answer keys,
   * results, exam schedules), oldest first; set by the notice agent. */
  stages?: JobStage[];
  /** One line on where the recruitment stands, e.g. "Answer key out · result awaited (14 Sep 2026)". */
  currentStage?: string;
  /** Applications closed, exams or results under way: listed under "Exams in progress". */
  inProgress?: boolean;
}

export interface DistrictVacancyBreakout {
  districtSlug: string;
  districtName: string;
  vacancies: number;
}

/**
 * Automatically computes and enforces the lifecycle status of a notification
 * based on current date, application windows, and published milestones.
 * Prevents expired jobs from ever showing as active or open.
 */
export function computeJobStatus(
  job: {
    status: JobStatus;
    applicationStartDate?: string;
    applicationEndDate?: string;
    admitCardDate?: string;
    examDate?: string;
    resultDate?: string;
    inProgress?: boolean;
  },
  referenceDateStr: string = todayIST()
): JobStatus {
  // A recruitment under way has no open application, whatever dates it carries
  if (job.inProgress) return "APPLICATIONS_CLOSED";
  // If result is officially declared, preserve RESULT_OUT
  if (job.status === "RESULT_OUT") return "RESULT_OUT";
  // If admit card / exam city slip is out, preserve ADMIT_CARD_OUT
  if (job.status === "ADMIT_CARD_OUT") return "ADMIT_CARD_OUT";

  const todayStr = referenceDateStr;

  if (job.applicationEndDate) {
    if (job.applicationEndDate < todayStr) {
      // The application deadline has passed. It cannot be open or upcoming.
      return "APPLICATIONS_CLOSED";
    }
  }

  if (job.applicationStartDate) {
    if (job.applicationStartDate > todayStr) {
      // Registration start date is in the future
      return "UPCOMING";
    }
  }

  // Application is currently active
  if (job.applicationEndDate) {
    const end = new Date(job.applicationEndDate + "T23:59:59Z").getTime();
    const ref = new Date(todayStr + "T00:00:00Z").getTime();
    const diffDays = Math.ceil((end - ref) / (1000 * 60 * 60 * 24));
    if (diffDays <= 7 && diffDays >= 0) {
      return "LAST_DATE_NEAR";
    }
    return "APPLY_OPEN";
  }

  return job.status;
}

export function getEffectiveJobStatus(job: JobNotification): JobStatus {
  return computeJobStatus(job);
}

/** Today's date in India (YYYY-MM-DD): application windows close by Indian dates. */
export type StageKind = "schedule" | "admit_card" | "answer_key" | "result" | "final_result";

export interface JobStage {
  kind: StageKind;
  /** The document's title as the official site lists it. */
  title: string;
  /** ISO date of the document or of the event it announces, when known. */
  date?: string;
  url: string;
  /** Exam / interview / test dates the document announces (ISO), when it was read. */
  examDates?: string[];
}

export interface UpcomingExam {
  job: JobNotification;
  stage: JobStage;
  /** The next exam date on or after today. */
  nextDate: string;
}

/** Admit cards and schedules out with an exam still ahead, soonest first. */
export function getUpcomingExams(jobs: JobNotification[], today = todayIST()): UpcomingExam[] {
  const out: UpcomingExam[] = [];
  for (const job of jobs) {
    const ahead = (job.stages || [])
      .filter((s) => (s.kind === "admit_card" || s.kind === "schedule") && s.examDates?.some((d) => d >= today))
      .map((s) => ({ stage: s, nextDate: s.examDates!.filter((d) => d >= today).sort()[0] }))
      .sort((a, b) => a.nextDate.localeCompare(b.nextDate));
    if (ahead.length) out.push({ job, ...ahead[0] });
  }
  return out.sort((a, b) => a.nextDate.localeCompare(b.nextDate));
}

/** Results (any stage) dated within the last `days` days, newest first. */
export function getLatestResults(jobs: JobNotification[], days = 45, today = todayIST()): { job: JobNotification; stage: JobStage }[] {
  const cutoff = new Date(Date.parse(today) - days * 86400 * 1000).toISOString().slice(0, 10);
  const out: { job: JobNotification; stage: JobStage }[] = [];
  for (const job of jobs) {
    const recent = (job.stages || [])
      .filter((s) => (s.kind === "result" || s.kind === "final_result") && s.date && s.date >= cutoff && s.date <= today)
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    if (recent.length) out.push({ job, stage: recent[0] });
  }
  return out.sort((a, b) => (b.stage.date || "").localeCompare(a.stage.date || ""));
}

/** Official documents of one kind for this job; a final result counts as a result. */
export function getStages(job: JobNotification, kind: StageKind): JobStage[] {
  return (job.stages || []).filter((s) => s.kind === kind || (kind === "result" && s.kind === "final_result"));
}

export function todayIST(): string {
  return new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
}

/** "18–35 yrs", "Up to 35 yrs", or "See notification" when the notice states no age limit. */
export function formatAgeRange(job: JobNotification, unit = "yrs"): string {
  if (job.ageKnown === false || !job.maxAge) return "See notification";
  return job.minAge ? `${job.minAge}–${job.maxAge} ${unit}` : `Up to ${job.maxAge} ${unit}`;
}

/** Application fee in words for listings and FAQs. */
export function formatFee(job: JobNotification): string {
  if (job.feeKnown === false) return job.applicationFeeText || "See notification";
  const { ur_obc_ews, sc_st } = job.applicationFee;
  if (!ur_obc_ews && !sc_st) return "No application fee";
  return `₹${ur_obc_ews} (UR/OBC/EWS), ₹${sc_st} (SC/ST)`;
}



// Jobs are published by the notice agent and loaded from the database (src/lib/jobs-store.ts,
// server only). Helpers below take that list as their first argument.

export function getJobsByState(jobs: JobNotification[], stateSlug: string, includeCentral = true): JobNotification[] {
  if (stateSlug === "central" || stateSlug === "all") {
    return jobs;
  }
  const stateJobs = jobs.filter(
    (job) => job.stateSlug.toLowerCase() === stateSlug.toLowerCase()
  );
  if (includeCentral) {
    const centralJobs = jobs.filter((job) => job.isCentral);
    return [...stateJobs, ...centralJobs];
  }
  return stateJobs;
}

export function getJobBySlug(jobs: JobNotification[], slug: string): JobNotification | undefined {
  return jobs.find(
    (job) => job.slug.toLowerCase() === slug.toLowerCase()
  );
}

export function isJobApplicationClosed(job: JobNotification): boolean {
  if (job.status === "APPLICATIONS_CLOSED" || job.status === "ADMIT_CARD_OUT" || job.status === "RESULT_OUT") {
    return true;
  }
  if (!job.applicationEndDate) return false;
  const deadline = new Date(`${job.applicationEndDate}T23:59:59Z`).getTime();
  return Date.now() > deadline;
}

export function getActiveOpportunities(
  jobs: JobNotification[],
  excludeJobId?: string,
  category?: JobCategory,
  stateSlug?: string,
  limit: number = 4
): JobNotification[] {
  return jobs
    .filter((j) => j.id !== excludeJobId && !isJobApplicationClosed(j))
    .sort((a, b) => {
      const aMatch = (category && a.category === category) || (stateSlug && a.stateSlug === stateSlug) ? 1 : 0;
      const bMatch = (category && b.category === category) || (stateSlug && b.stateSlug === stateSlug) ? 1 : 0;
      if (bMatch !== aMatch) return bMatch - aMatch;
      return b.viewsCount - a.viewsCount;
    })
    .slice(0, limit);
}

/** Jobs for listing pages: open ones plus those closed in the last 45 days (older pages stay reachable by URL). */
export function getListingJobs(jobs: JobNotification[]): JobNotification[] {
  const cutoff = new Date(Date.now() - 45 * 86400 * 1000).toISOString().slice(0, 10);
  return jobs.filter((j) => !j.inProgress && (!j.applicationEndDate || j.applicationEndDate >= cutoff));
}

/** Recruitments with exams or results under way, latest document first. One whose final result is
 * out stays 45 days, then drops off. */
export function getExamsInProgress(jobs: JobNotification[]): JobNotification[] {
  const cutoff = new Date(Date.now() - 45 * 86400 * 1000).toISOString().slice(0, 10);
  const lastDate = (j: JobNotification) => {
    const s = j.stages || [];
    return s.length ? s[s.length - 1].date || "" : "";
  };
  return jobs
    .filter((j) => j.inProgress)
    .filter((j) => {
      const fin = (j.stages || []).filter((s) => s.kind === "final_result");
      return !fin.length || (fin[fin.length - 1].date || "9999") >= cutoff;
    })
    .sort((a, b) => lastDate(b).localeCompare(lastDate(a)));
}

/** Open jobs with a stated age limit: the ones the eligibility calculator can check. */
export function getCalculatorJobs(jobs: JobNotification[]): JobNotification[] {
  return jobs.filter((j) => !isJobApplicationClosed(j) && j.ageKnown !== false && j.maxAge > 0);
}

export function getJobAgeCutoffDate(job: JobNotification): string {
  // the notification's own cut-off date when known, else its last date (the usual reference)
  return job.ageCutoffDate || job.applicationEndDate || todayIST();
}

export function calculateAgeAtDate(dob: string, targetDate: string): { years: number; months: number; days: number } {
  if (!dob || !targetDate) return { years: 0, months: 0, days: 0 };
  const birthDate = new Date(dob);
  const target = new Date(targetDate);

  let years = target.getFullYear() - birthDate.getFullYear();
  let months = target.getMonth() - birthDate.getMonth();
  let days = target.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthLastDay = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years: Math.max(0, years), months: Math.max(0, months), days: Math.max(0, days) };
}

export function getRecentJobAlerts(jobs: JobNotification[], limit = 6): JobNotification[] {
  return [...jobs]
    .sort((a, b) => b.viewsCount - a.viewsCount)
    .slice(0, limit);
}

export function getCategoryColors(category: JobCategory) {
  switch (category) {
    case "Police / Defense":
      return {
        bg: "bg-[#FDF3EB]",
        text: "text-[#E96B15]",
        border: "border-[#F9D9C3]",
        stripe: "bg-[#E96B15]",
        label: "Police & Defense",
      };
    case "Administrative / PSC":
      return {
        bg: "bg-[#EEF2FA]",
        text: "text-[#1E3799]",
        border: "border-[#CCD8F0]",
        stripe: "bg-[#1E3799]",
        label: "Civil Services & PSC",
      };
    case "Railways":
      return {
        bg: "bg-[#EEF2FA]",
        text: "text-[#1E3799]",
        border: "border-[#CCD8F0]",
        stripe: "bg-[#1E3799]",
        label: "Indian Railways",
      };
    case "Teaching / Education":
      return {
        bg: "bg-[#EDF7F0]",
        text: "text-[#209948]",
        border: "border-[#C6E7D0]",
        stripe: "bg-[#209948]",
        label: "Teaching & Faculty",
      };
    case "Banking / Insurance":
      return {
        bg: "bg-[#FAF4E6]",
        text: "text-[#9A6516]",
        border: "border-[#EFE0BC]",
        stripe: "bg-[#9A6516]",
        label: "Banking & Insurance",
      };
    case "Engineering / Technical":
      return {
        bg: "bg-[#E8F4F5]",
        text: "text-[#1A616A]",
        border: "border-[#CCE7EB]",
        stripe: "bg-[#1A616A]",
        label: "Engineering & Technical",
      };
    case "Clerical / Stenographer":
      return {
        bg: "bg-[#F3EFE9]",
        text: "text-[#5B5044]",
        border: "border-[#DDD4C7]",
        stripe: "bg-[#5B5044]",
        label: "Clerical & Staff",
      };
    case "Medical & Nursing":
      return {
        bg: "bg-[#FAECF0]",
        text: "text-[#952644]",
        border: "border-[#F2D1DC]",
        stripe: "bg-[#952644]",
        label: "Medical & Health",
      };
    default:
      return {
        bg: "bg-[#F2EDE4]",
        text: "text-[#4A4641]",
        border: "border-[#DDD5C7]",
        stripe: "bg-[#4A4641]",
        label: category,
      };
  }
}

/**
 * Helper to retrieve jobs for a specific district within a state.
 * Returns district-specific jobs, statewide recruitments with quotas for this district,
 * and general opportunities applicable to residents of this district.
 */
export function getJobsByDistrict(
  jobs: JobNotification[],
  stateSlug: string,
  districtSlug: string,
  includeStatewide: boolean = true
): JobNotification[] {
  const normState = stateSlug.toLowerCase();
  const normDistrict = districtSlug.toLowerCase();

  // 1. Direct district-exclusive jobs (e.g., District Court, NHM District Society)
  const directDistrictJobs = jobs.filter(
    (job) =>
      job.stateSlug.toLowerCase() === normState &&
      job.districtSlug &&
      job.districtSlug.toLowerCase() === normDistrict
  );

  // 2. Statewide jobs with defined vacancy quota for this district
  const quotaJobs = jobs.filter(
    (job) =>
      job.stateSlug.toLowerCase() === normState &&
      !job.isDistrictSpecific &&
      job.districtWiseVacancies?.some(
        (dv) => dv.districtSlug.toLowerCase() === normDistrict
      )
  );

  const primaryJobs = [...directDistrictJobs, ...quotaJobs];

  if (!includeStatewide) {
    return primaryJobs;
  }

  // 3. Statewide recruitments for the state (open to candidates residing in this district)
  const statewideJobs = jobs.filter(
    (job) =>
      job.stateSlug.toLowerCase() === normState &&
      !job.isDistrictSpecific &&
      !job.districtWiseVacancies?.some(
        (dv) => dv.districtSlug.toLowerCase() === normDistrict
      )
  );

  // 4. Central government jobs (open pan-India)
  const centralJobs = jobs.filter((job) => job.isCentral && job.featured);

  return [...primaryJobs, ...statewideJobs, ...centralJobs];
}

/**
 * Canonical URL path resolver for all recruitment notices across IndiaJobNotice.
 * Guarantees a single, uniform URL architecture to prevent duplicate content & split rankings:
 * - Central Jobs (UPSC, SSC, RRB, IBPS, Defence, etc.): `/jobs/[slug]`
 * - State Jobs (UP Police, BPSC, BSSC, KEA, KPSC, etc.): `/state/[state]/jobs/[slug]`
 */
export function getJobCanonicalPath(job: { isCentral: boolean; stateSlug?: string; slug: string }): string {
  if (job.isCentral || !job.stateSlug || job.stateSlug.toLowerCase() === "central") {
    return `/jobs/${job.slug}`;
  }
  return `/state/${job.stateSlug.toLowerCase()}/jobs/${job.slug}`;
}

/**
 * Canonical lifecycle path resolver for examination stages (eligibility, admit card, answer key, result)
 */
export function getJobLifecyclePath(
  job: { isCentral: boolean; stateSlug?: string; slug: string },
  stage: "notice" | "eligibility" | "admit-card" | "answer-key" | "result"
): string {
  const base = getJobCanonicalPath(job);
  if (stage === "notice") return base;
  return `${base}/${stage}`;
}

/**
 * Helper: Retrieve editorial verification metadata for a notice.
 * Implements Google E-E-A-T and career authority compliance.
 */
export function getJobVerificationMeta(job: JobNotification) {
  return {
    lastVerifiedDate: job.lastVerifiedDate || "",
    verificationSource: job.verificationSource || `${job.organization} Official Gazette & Portal Notification`,
    verificationStatus: "From the official notification",
  };
}


