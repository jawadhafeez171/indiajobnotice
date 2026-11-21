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
  /** A notification sent by hand without its official address: our stored copy, at /pdf/<copyName>. */
  copyName?: string;
  copyKey?: string;
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
  /** The date printed on the notice, when it gives no start date for applications. Not an opening date. */
  notificationDate?: string;
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
  /** The notice's own age wording (limits by category, relaxations), as printed. */
  ageLimitText?: string;
  /** The date on which age is reckoned, as the notice gives it (YYYY-MM-DD). */
  ageAsOn?: string;
  /** Upper (and lower) age limits as printed, per category and post ("" = all). */
  ageLimits?: { post: string; category: string; min: number; max: number }[];
  /** Last date for paying the fee, when the notice gives one apart from the last date. */
  feeLastDate?: string;
  /** How to apply, in the notice's words (English). */
  howToApply?: string;
  advtNo?: string;
  isWalkIn?: boolean;
  /** Corrigenda applied (date changes); found = the day the agent applied it (India time). */
  updates?: { date: string; text: string; url: string; found?: string }[];
  posts?: { postName: string; vacancies: number; qualification: string; ageLimit: string; pay: string }[];
  /** Later documents of this recruitment found on the official site (admit cards, answer keys,
   * results, exam schedules), oldest first; set by the notice agent. */
  stages?: JobStage[];
  /** One line on where the recruitment stands, e.g. "Answer key out · result awaited (14 Sep 2026)". */
  currentStage?: string;
  /** When the site published this notice (database time), set by the loader. */
  publishedAt?: string;
  /** The agent's source that found it (its board page groups notices by this), set by the loader. */
  source?: string;
  /** Its board's page here, worked out by the server for the job page (the board list stays out of the browser). */
  boardHref?: string;
  boardName?: string;
  /** Applications closed, exams or results under way: listed under "Exams in progress". */
  inProgress?: boolean;
  /** Exam dates the notification gives: a day or only a month, tentative or not (agent, 2 Nov). */
  exams?: { stage: string; date: string; precision: "day" | "month" | ""; tentative: boolean; text: string }[];
  /** Vacancies by category as printed; sent only when each post's categories add up. */
  reservation?: {
    categories: string[];
    rows: { post: string; counts: Record<string, number>; total: number }[];
    horizontal: { post: string; category: string; count: number }[];
  };
  /** The fuller read (agent details.py, 20 Nov): tables copied from the notice, each row with its page.
   * A section the agent's checks did not bear out is not sent. */
  details?: JobDetails;
}

/** A page of the official notice a row was copied from (0: not known). */
type Paged = { page: number };

export interface JobDetails {
  dates?: ({ event: string; date: string; text: string } & Paged)[];
  /** amount in rupees; 0 = no fee; null = not a plain amount */
  fees?: ({ category: string; amount: number | null; text: string } & Paged)[];
  ageRelaxations?: ({ category: string; years: number } & Paged)[];
  postDetails?: ({ post: string; pay: string; experience: string; other: string } & Paged)[];
  physical?: ({ test: string; men: string; women: string; note: string } & Paged)[];
  examPattern?: ({ stage: string; paper: string; questions: string; marks: string; time: string } & Paged)[];
  selectionStages?: ({ stage: string } & Paged)[];
  applySteps?: ({ step: string } & Paged)[];
  documents?: ({ document: string } & Paged)[];
  regionVacancies?: ({ post: string; region: string; count: number } & Paged)[];
  facts?: Partial<Record<
    "employmentType" | "contractPeriod" | "probation" | "bond" | "postingPlace" | "nationality" | "domicile"
    | "language" | "feePaymentMode" | "negativeMarking" | "helplinePhone" | "helplineEmail",
    { value: string } & Paged>>;
  syllabus?: { stage: string; paper: string; pageFrom: number; pageTo: number; topics: { text: string; sub: boolean }[] }[];
  syllabusNote?: string;
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
    stages?: JobStage[];
  },
  referenceDateStr: string = todayIST()
): JobStatus {
  // Applications closed and the official documents show where it stands: an admit card or schedule
  // with the exam still ahead, or a result in the last 45 days
  if (!(job.applicationEndDate && job.applicationEndDate >= referenceDateStr)) {
    const fromStages = stageStatus(job.stages || [], referenceDateStr);
    if (fromStages) return fromStages;
  }
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
/** ADMIT_CARD_OUT while an announced exam is ahead, RESULT_OUT for 45 days after a result. */
export function stageStatus(stages: JobStage[], today: string): JobStatus | null {
  if (stages.some((s) => (s.kind === "admit_card" || s.kind === "schedule") && s.examDates?.some((d) => d >= today))) {
    return "ADMIT_CARD_OUT";
  }
  const cutoff = new Date(Date.parse(today) - 45 * 86400 * 1000).toISOString().slice(0, 10);
  // the newest result decides: a shortlist after an earlier result means the next round is on
  const recent = stages
    .filter((s) => (s.kind === "result" || s.kind === "final_result") && s.date && s.date >= cutoff && s.date <= today)
    .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  if (recent.length && isResult(recent[recent.length - 1])) {
    return "RESULT_OUT";
  }
  return null;
}

export type StageKind = "schedule" | "admit_card" | "answer_key" | "result" | "final_result";

/** "Eligibility list" / "Rejected list": lists published as results that only check who goes on, else "". */
export function stageList(s: JobStage): string {
  if (s.kind !== "result") return "";
  if (/disqualif|rejected|not eligible|ineligible/i.test(s.title)) return "Rejected list";
  if (/eligib|provisional list|scrutiny/i.test(s.title)) return "Eligibility list";
  return "";
}

/** A result candidates wait for; a shortlist for the next stage (interview, mains) or an eligibility list is not one. */
function isResult(s: JobStage): boolean {
  return (s.kind === "result" || s.kind === "final_result") && !s.shortlist && !stageList(s);
}

export interface JobStage {
  kind: StageKind;
  /** The document's title as the official site lists it. */
  title: string;
  /** ISO date of the document or of the event it announces, when known. */
  date?: string;
  url: string;
  /** Exam / interview / test dates the document announces (ISO), when it was read. */
  examDates?: string[];
  /** One English sentence on what the document is (the agent read it); titles are often not English. */
  summary?: string;
  /** A result that only lists who goes on to the next stage (shortlist for interview, qualified for mains). */
  shortlist?: boolean;
  /** The day the official site's document was found (India time, YYYY-MM-DD). */
  found?: string;
  /** Sent by hand without its official address: our stored copy, at /pdf/<copyName> (src/app/pdf). */
  copyName?: string;
  copyKey?: string;
  /** What the dates are for when it is not a written exam, as the document names it ("Interview"). */
  event?: string;
  /** examDates are the first and last day of one period ("interviews from 07.12.2026 to 12.02.2027"). */
  dateSpan?: boolean;
}

const INTERVIEW = /\b(interview|personality test|viva)/i;

/** "Interview" for a schedule or call letter of interviews, else "" (a written exam). */
export function stageEvent(s: JobStage): string {
  if (s.event) return s.event;
  if (s.kind !== "schedule" && s.kind !== "admit_card") return "";
  return INTERVIEW.test(`${s.title} ${s.summary || ""}`) ? "Interview" : "";
}

/** The dates a document announces, in words: "07 Dec 2026 – 12 Feb 2027" for a period, else a list. */
export function stageDatesText(s: JobStage, fmt: (iso: string) => string): string {
  const d = [...(s.examDates || [])].sort();
  if (s.dateSpan && d.length >= 2) return `${fmt(d[0])} – ${fmt(d[d.length - 1])}`;
  return d.map(fmt).join(", ");
}

/** The text to show for a stage document: its English summary when the title is in another script. */
export function stageText(s: JobStage): { main: string; original?: string } {
  // Devanagari to Sinhala: Hindi, Bengali, Gurmukhi, Gujarati, Odia, Tamil, Telugu, Kannada, Malayalam
  const notEnglish = /[ऀ-෿]/.test(s.title);
  return notEnglish && s.summary ? { main: s.summary, original: s.title } : { main: s.title };
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

export interface ExamDateEntry {
  job: JobNotification;
  /** ISO date of the exam / test / interview. */
  date: string;
  /** The admit card or schedule that gives the date; absent when it comes from the notification. */
  stage?: JobStage;
  /** Only the notification gives this date (no admit card or schedule confirms it yet). */
  tentative: boolean;
  /** The last day when the document gives a period (interviews over several weeks). */
  until?: string;
}

/**
 * Every exam date still ahead, soonest first: from admit cards and exam schedules the agent read,
 * plus the exam date printed in the notification (tentative until a document confirms it).
 * One entry per recruitment and date (a schedule and its corrigendum often repeat a date).
 */
export function getExamDates(jobs: JobNotification[], today = todayIST()): ExamDateEntry[] {
  const out: ExamDateEntry[] = [];
  const rank = (s: JobStage) => (s.kind === "admit_card" ? 0 : 1);
  for (const job of jobs) {
    const seen = new Set<string>();
    const docs = (job.stages || [])
      .filter((s) => s.kind === "admit_card" || s.kind === "schedule")
      .sort((a, b) => rank(a) - rank(b) || (b.date || "").localeCompare(a.date || ""));
    for (const s of docs) {
      const span = s.dateSpan && (s.examDates || []).length >= 2 ? [...s.examDates!].sort() : null;
      if (span) {
        // one entry for the whole period: its first day while ahead, else its last
        const [first, last] = [span[0], span[span.length - 1]];
        if (last >= today && !seen.has(first)) {
          span.forEach((d) => seen.add(d));
          out.push({ job, date: first >= today ? first : last, stage: s, tentative: false, until: first >= today ? last : undefined });
        }
        continue;
      }
      for (const d of s.examDates || []) {
        if (d >= today && !seen.has(d)) {
          seen.add(d);
          out.push({ job, date: d, stage: s, tentative: false });
        }
      }
    }
    const own = (job.examDate || "").slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(own) && own >= today && !seen.size) {
      out.push({ job, date: own, tentative: true });
    }
  }
  return out.sort((a, b) => a.date.localeCompare(b.date) || a.job.organization.localeCompare(b.job.organization));
}

/** The next exam date of one recruitment, or null. */
export function nextExamDate(job: JobNotification, today = todayIST()): ExamDateEntry | null {
  return getExamDates([job], today)[0] || null;
}

/** Days from today (IST) to an ISO date: 0 today, 1 tomorrow. */
export function daysUntil(date: string, today = todayIST()): number {
  return Math.round((Date.parse(date) - Date.parse(today)) / 86400000);
}

const STAGE_LABEL: Record<StageKind, string> = {
  schedule: "Exam dates announced",
  admit_card: "Admit card out",
  answer_key: "Answer key out",
  result: "Result out",
  final_result: "Final result out",
};

/**
 * Where a recruitment stands, from its latest official document: "Answer key out · result awaited",
 * "Admit card out · exam 06 Nov". The document's own date is shown only when it is not in the
 * future (a future date there is the exam the document announces, so it is shown as the exam).
 */
export function stageSummary(job: JobNotification, today = todayIST()): string | null {
  const stages = job.stages || [];
  if (!stages.length) return job.currentStage || null;
  const last = stages[stages.length - 1];
  const exam = nextExamDate(job, today);
  // an admit card or schedule whose exam has passed: say so, not "Admit card out"
  if (!exam && (last.kind === "admit_card" || last.kind === "schedule")) {
    const held = (last.examDates || []).filter((d) => d < today).sort().pop();
    if (held) return `${stageEvent(last) ? `${stageEvent(last)}s` : "Exam"} held ${shortDay(held, today)} · result awaited`;
    if (last.date && last.date <= today) {
      return `${last.kind === "admit_card" ? "Admit card issued" : "Exam dates announced"} ${shortDay(last.date, today)}`;
    }
  }
  const event = stageEvent(last);
  const parts = [last.shortlist ? "Shortlist out" : stageList(last) ? "Eligibility list out" : event && last.kind === "schedule" ? `${event} schedule out` : STAGE_LABEL[last.kind] || "Update"];
  if (last.kind === "answer_key") parts.push("result awaited");
  if (last.shortlist && !exam) parts.push("next round to come");
  const examEvent = exam?.stage ? stageEvent(exam.stage).toLowerCase() : "";
  if (exam && examEvent && exam.until) parts.push(`${examEvent}s from ${shortDay(exam.date, today)}`);
  else if (exam && examEvent && exam.stage?.dateSpan) parts.push(`${examEvent}s till ${shortDay(exam.date, today)}`);
  else if (exam) parts.push(`${examEvent || "exam"} ${shortDay(exam.date, today)}`);
  else if (last.date && last.date <= today) parts.push(shortDay(last.date, today));
  return parts.join(" · ");
}

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function shortDay(iso: string, today: string): string {
  const d = `${iso.slice(8, 10)} ${MON[Number(iso.slice(5, 7)) - 1]}`;
  return iso.slice(0, 4) === today.slice(0, 4) ? d : `${d} ${iso.slice(0, 4)}`;
}

/** Results (any stage) dated within the last `days` days, newest first. */
export function getLatestResults(jobs: JobNotification[], days = 45, today = todayIST()): { job: JobNotification; stage: JobStage }[] {
  const cutoff = new Date(Date.parse(today) - days * 86400 * 1000).toISOString().slice(0, 10);
  const out: { job: JobNotification; stage: JobStage }[] = [];
  for (const job of jobs) {
    const recent = (job.stages || [])
      .filter((s) => isResult(s) && s.date && s.date >= cutoff && s.date <= today)
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    if (recent.length) out.push({ job, stage: recent[0] });
  }
  return out.sort((a, b) => (b.stage.date || "").localeCompare(a.stage.date || ""));
}

/**
 * Could this document be a stage of the recruitment, going by its dates? An admit card, answer key or
 * result cannot come before applications open, nor while they are still open (a previous year's
 * paper with its answer key was once linked to a notice still taking applications). Schedules may.
 */
export function ofThisRecruitment(
  s: JobStage,
  job: Pick<JobNotification, "applicationStartDate" | "applicationEndDate" | "notificationDate">,
  today = todayIST(),
): boolean {
  if (s.kind === "schedule") return true;
  const start = job.applicationStartDate || job.notificationDate || "";
  const end = job.applicationEndDate || "";
  if (s.date && start && s.date < start) return false;
  return !(end && end >= today && (!s.date || s.date < end));
}

export type TodayKind = "new" | "admit_card" | "answer_key" | "result" | "schedule" | "dates";
export const TODAY_LABEL: Record<TodayKind, string> = {
  new: "New notice",
  admit_card: "Admit card",
  answer_key: "Answer key",
  result: "Result",
  schedule: "Exam schedule",
  dates: "Dates changed",
};
/** The order the Today list shows them in: new notices first. */
export const TODAY_ORDER: TodayKind[] = ["new", "dates", "admit_card", "result", "answer_key", "schedule"];

/** India date (YYYY-MM-DD) of a database timestamp ("2026-11-03 04:47:12.1+00"). */
export function istDate(ts?: string): string {
  if (!ts) return "";
  const t = Date.parse(ts.replace(" ", "T").replace(/([+-]\d\d)$/, "$1:00"));
  return Number.isNaN(t) ? "" : new Date(t + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
}

/** The agent checks the official sites at these India times (the server's cron). */
export const CHECK_RUNS = [[10, 17], [18, 47]] as const;

/**
 * The day the Today list and line show (YYYY-MM-DD, India time): the date from the day's first
 * check on; before it, the day before, so the list does not empty at midnight while nothing new can
 * have been found yet.
 */
export function updatesDay(now = Date.now()): string {
  const ist = new Date(now + 5.5 * 3600 * 1000);
  const [h, m] = CHECK_RUNS[0];
  if (ist.getUTCHours() * 60 + ist.getUTCMinutes() < h * 60 + m) ist.setUTCDate(ist.getUTCDate() - 1);
  return ist.toISOString().slice(0, 10);
}

/**
 * What changed on this recruitment on the updates day (see updatesDay), the most important first:
 * published, a corrigendum applied, or an official document found that day. Null when nothing did.
 */
export function todayChange(job: JobNotification, today = updatesDay()): { kind: TodayKind; label: string } | null {
  // a recruitment under way approved today is not a new notice: only its documents found today count
  if (!job.inProgress && istDate(job.publishedAt) === today) return { kind: "new", label: TODAY_LABEL.new };
  if ((job.updates || []).some((u) => u.found === today)) return { kind: "dates", label: TODAY_LABEL.dates };
  const found = (job.stages || []).filter((s) => s.found === today);
  if (!found.length) return null;
  const s = found[found.length - 1];
  const kind: TodayKind = s.kind === "final_result" ? "result" : s.kind;
  return { kind, label: s.shortlist ? "Shortlist" : TODAY_LABEL[kind] };
}

/** Today's changes by kind, for the home page's one-line summary. */
export function todayCounts(jobs: JobNotification[], today = updatesDay()): { kind: TodayKind; count: number }[] {
  const n = new Map<TodayKind, number>();
  for (const j of jobs) {
    const c = todayChange(j, today);
    if (c) n.set(c.kind, (n.get(c.kind) || 0) + 1);
  }
  return TODAY_ORDER.filter((k) => n.get(k)).map((k) => ({ kind: k, count: n.get(k)! }));
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
  if (job.minAge && job.minAge === job.maxAge) return `${job.maxAge} ${unit}`;
  return job.minAge ? `${job.minAge}–${job.maxAge} ${unit}` : `Up to ${job.maxAge} ${unit}`;
}

/**
 * Pay as printed, with the rupee sign and Indian digit grouping: "34100-67600" reads "₹34,100-67,600",
 * "Rs (102300-2980/4-114220)" reads "₹(1,02,300-2,980/4-1,14,220)". Nothing else is changed.
 */
export function payText(pay: string): string {
  return pay
    .replace(/\bRs\.?\s*/gi, "₹")
    .replace(/^(\d)/, "₹$1")
    .replace(/\d{4,}/g, (n) => Number(n).toLocaleString("en-IN"));
}

/** The age limit as the notice words it (categories and relaxations included), else the range. */
export function ageText(job: JobNotification): string {
  return job.ageLimitText?.trim() || formatAgeRange(job, "years");
}

/**
 * Application fee in words, as the notice gives it: a state notice's categories (GM, 2A, Cat-1…)
 * are not UR/OBC, so the notice's own wording comes first and the two-band summary is a fallback.
 */
export function formatFee(job: JobNotification): string {
  if (job.applicationFeeText?.trim()) return job.applicationFeeText.trim();
  if (job.feeKnown === false) return "See notification";
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

/** Taking applications, or will from a stated date: a job people can still apply to. */
export function isOpenOrOpening(job: Pick<JobNotification, "status">): boolean {
  return job.status === "APPLY_OPEN" || job.status === "LAST_DATE_NEAR" || job.status === "UPCOMING";
}

/** The end of the last day in India: 23:59:59 IST (19 Nov: "T23:59:59Z" was 05:29 IST the next morning). */
export function lastDayEnd(isoDate: string): string {
  return `${isoDate.slice(0, 10)}T23:59:59+05:30`;
}

/** Days a notice without a last date counts as open after it was issued (the agent's NO_LAST_DATE_DAYS). */
export const NO_LAST_DATE_DAYS = 21;

/**
 * Does the job page carry JobPosting data (Google for Jobs)? Only while applications are open: a closed job is a
 * plain WebPage, and a notice without a last date only for NO_LAST_DATE_DAYS after it was issued (else it would
 * stay a live posting for ever). Same rule as the agent's indexing.has_job_posting.
 */
export function hasJobPosting(job: JobNotification, now = Date.now()): boolean {
  if (isJobApplicationClosed(job, now)) return false;
  if (job.applicationEndDate) return true;
  const issued = (job.notificationDate || job.publishedAt || "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(issued)) return false;
  return now <= Date.parse(lastDayEnd(issued)) + NO_LAST_DATE_DAYS * 86400000;
}

export function isJobApplicationClosed(job: JobNotification, now = Date.now()): boolean {
  if (job.status === "APPLICATIONS_CLOSED" || job.status === "ADMIT_CARD_OUT" || job.status === "RESULT_OUT") {
    return true;
  }
  if (!job.applicationEndDate) return false;
  return now > Date.parse(lastDayEnd(job.applicationEndDate));
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
  // recruitments under way join the main list while an admit card or a recent result is out, or
  // an exam date is still ahead (the "Exam dates" tab)
  return jobs.filter((j) =>
    j.inProgress
      ? j.status === "ADMIT_CARD_OUT" || j.status === "RESULT_OUT" || nextExamDate(j) !== null
      : !j.applicationEndDate || j.applicationEndDate >= cutoff);
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
        bg: "bg-saffron-tint",
        text: "text-saffron",
        border: "border-saffron-line",
        stripe: "bg-saffron-solid",
        label: "Police & Defense",
      };
    case "Administrative / PSC":
      return {
        bg: "bg-navy-tint",
        text: "text-navy",
        border: "border-navy-line",
        stripe: "bg-navy-solid",
        label: "Civil Services & PSC",
      };
    case "Railways":
      return {
        bg: "bg-navy-tint",
        text: "text-navy",
        border: "border-navy-line",
        stripe: "bg-navy-solid",
        label: "Indian Railways",
      };
    case "Teaching / Education":
      return {
        bg: "bg-green-tint",
        text: "text-green",
        border: "border-green-line",
        stripe: "bg-green-solid",
        label: "Teaching & Faculty",
      };
    case "Banking / Insurance":
      return {
        bg: "bg-amber-tint",
        text: "text-amber",
        border: "border-amber-line",
        stripe: "bg-amber-solid",
        label: "Banking & Insurance",
      };
    case "Engineering / Technical":
      return {
        bg: "bg-teal-tint",
        text: "text-teal",
        border: "border-teal-line",
        stripe: "bg-teal-solid",
        label: "Engineering & Technical",
      };
    case "Clerical / Stenographer":
      return {
        bg: "bg-sunken",
        text: "text-ink-2",
        border: "border-line",
        stripe: "bg-ink-2",
        label: "Clerical & Staff",
      };
    case "Medical & Nursing":
      return {
        bg: "bg-danger-tint",
        text: "text-danger",
        border: "border-danger-line",
        stripe: "bg-danger-solid",
        label: "Medical & Health",
      };
    default:
      return {
        bg: "bg-sunken",
        text: "text-ink-2",
        border: "border-line",
        stripe: "bg-ink-2",
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


