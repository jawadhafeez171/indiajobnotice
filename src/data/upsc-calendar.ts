/**
 * UPSC's own programme of examinations ("Programme of Examinations / Recruitment Tests"), copied row by
 * row from its published calendars: 2026 (dated 15.05.2025) and 2027 (as on 20.05.2026). Planned
 * dates, "liable to alteration": always shown as planned; a published notification's dates replace
 * them. The "Reserved for UPSC RT / Examination" rows name no exam and are left out.
 */
export interface UpscPlan {
  exam: string;
  /** Planned notification date, last date for applications, start of the exam (YYYY-MM-DD). */
  notification?: string;
  lastDate?: string;
  examDate: string;
  duration: string;
  calendar: "2026" | "2027";
}

export const UPSC_CALENDAR_SOURCE = {
  "2026": "UPSC Programme of Examinations / Recruitment Tests 2026",
  "2027": "UPSC Programme of Examinations / Recruitment Tests 2027 (as on 20.05.2026)",
  url: "https://upsc.gov.in",
};

export const UPSC_PLAN: UpscPlan[] = [
  // 2026
  { calendar: "2026", exam: "Combined Geo-Scientist (Preliminary) Examination, 2026", notification: "2025-09-03", lastDate: "2025-09-23", examDate: "2026-02-08", duration: "1 day" },
  { calendar: "2026", exam: "Engineering Services (Preliminary) Examination, 2026", notification: "2025-09-17", lastDate: "2025-10-07", examDate: "2026-02-08", duration: "1 day" },
  { calendar: "2026", exam: "CBI (DSP) LDCE", notification: "2025-12-24", lastDate: "2026-01-13", examDate: "2026-02-28", duration: "2 days" },
  { calendar: "2026", exam: "CISF AC (EXE) LDCE-2026", notification: "2025-12-03", lastDate: "2025-12-23", examDate: "2026-03-08", duration: "1 day" },
  { calendar: "2026", exam: "N.D.A. & N.A. Examination (I), 2026", notification: "2025-12-10", lastDate: "2025-12-30", examDate: "2026-04-12", duration: "1 day" },
  { calendar: "2026", exam: "C.D.S. Examination (I), 2026", notification: "2025-12-10", lastDate: "2025-12-30", examDate: "2026-04-12", duration: "1 day" },
  { calendar: "2026", exam: "Civil Services (Preliminary) Examination, 2026", notification: "2026-01-14", lastDate: "2026-02-03", examDate: "2026-05-24", duration: "1 day" },
  { calendar: "2026", exam: "Indian Forest Service (Preliminary) Examination, 2026 through CS(P) Examination 2026", notification: "2026-01-14", lastDate: "2026-02-03", examDate: "2026-05-24", duration: "1 day" },
  { calendar: "2026", exam: "I.E.S./I.S.S. Examination, 2026", notification: "2026-02-11", lastDate: "2026-03-03", examDate: "2026-06-19", duration: "3 days" },
  { calendar: "2026", exam: "Combined Geo-Scientist (Main) Examination, 2026", examDate: "2026-06-20", duration: "2 days" },
  { calendar: "2026", exam: "Engineering Services (Main) Examination, 2026", examDate: "2026-06-21", duration: "1 day" },
  { calendar: "2026", exam: "Central Armed Police Forces (ACs) Examination, 2026", notification: "2026-02-18", lastDate: "2026-03-10", examDate: "2026-07-19", duration: "1 day" },
  { calendar: "2026", exam: "Combined Medical Services Examination, 2026", notification: "2026-03-11", lastDate: "2026-03-31", examDate: "2026-08-02", duration: "1 day" },
  { calendar: "2026", exam: "Civil Services (Main) Examination, 2026", examDate: "2026-08-21", duration: "5 days" },
  { calendar: "2026", exam: "N.D.A. & N.A. Examination (II), 2026", notification: "2026-05-20", lastDate: "2026-06-09", examDate: "2026-09-13", duration: "1 day" },
  { calendar: "2026", exam: "C.D.S. Examination (II), 2026", notification: "2026-05-20", lastDate: "2026-06-09", examDate: "2026-09-13", duration: "1 day" },
  { calendar: "2026", exam: "Indian Forest Service (Main) Examination, 2026", examDate: "2026-11-22", duration: "7 days" },
  { calendar: "2026", exam: "S.O./Steno (GD-B/GD-I) LDCE", notification: "2026-09-16", lastDate: "2026-10-06", examDate: "2026-12-12", duration: "2 days" },
  // 2027
  { calendar: "2027", exam: "Combined Geo-Scientist (Preliminary) Examination, 2027", notification: "2026-09-02", lastDate: "2026-09-22", examDate: "2027-01-10", duration: "1 day" },
  { calendar: "2027", exam: "Engineering Services (Preliminary) Examination, 2027", notification: "2026-09-16", lastDate: "2026-10-06", examDate: "2027-01-31", duration: "1 day" },
  { calendar: "2027", exam: "CBI (DSP) LDCE", notification: "2026-12-16", lastDate: "2027-01-05", examDate: "2027-02-27", duration: "2 days" },
  { calendar: "2027", exam: "CISF AC (EXE) LDCE-2027", notification: "2026-11-25", lastDate: "2026-12-15", examDate: "2027-03-14", duration: "1 day" },
  { calendar: "2027", exam: "N.D.A. & N.A. Examination (I), 2027", notification: "2026-12-02", lastDate: "2026-12-22", examDate: "2027-04-11", duration: "1 day" },
  { calendar: "2027", exam: "C.D.S. Examination (I), 2027", notification: "2026-12-02", lastDate: "2026-12-22", examDate: "2027-04-11", duration: "1 day" },
  { calendar: "2027", exam: "Civil Services (Preliminary) Examination, 2027", notification: "2027-01-13", lastDate: "2027-02-02", examDate: "2027-05-23", duration: "1 day" },
  { calendar: "2027", exam: "Indian Forest Service (Preliminary) Examination, 2027 through CS(P) Examination 2027", notification: "2027-01-13", lastDate: "2027-02-02", examDate: "2027-05-23", duration: "1 day" },
  { calendar: "2027", exam: "Engineering Services (Main) Examination, 2027", examDate: "2027-06-18", duration: "1 day" },
  { calendar: "2027", exam: "I.E.S./I.S.S. Examination, 2027", notification: "2027-02-10", lastDate: "2027-03-02", examDate: "2027-06-18", duration: "3 days" },
  { calendar: "2027", exam: "Combined Geo-Scientist (Main) Examination, 2027", examDate: "2027-06-19", duration: "2 days" },
  { calendar: "2027", exam: "Central Armed Police Forces (ACs) Examination, 2027", notification: "2027-02-17", lastDate: "2027-03-09", examDate: "2027-07-04", duration: "1 day" },
  { calendar: "2027", exam: "Combined Medical Services Examination, 2027", notification: "2027-03-03", lastDate: "2027-03-23", examDate: "2027-07-18", duration: "1 day" },
  { calendar: "2027", exam: "Civil Services (Main) Examination, 2027", examDate: "2027-08-20", duration: "5 days" },
  { calendar: "2027", exam: "N.D.A. & N.A. Examination (II), 2027", notification: "2027-05-12", lastDate: "2027-06-01", examDate: "2027-09-19", duration: "1 day" },
  { calendar: "2027", exam: "C.D.S. Examination (II), 2027", notification: "2027-05-12", lastDate: "2027-06-01", examDate: "2027-09-19", duration: "1 day" },
  { calendar: "2027", exam: "Indian Forest Service (Main) Examination, 2027", examDate: "2027-11-21", duration: "7 days" },
  { calendar: "2027", exam: "S.O./Steno (GD-B/GD-I) LDCE", notification: "2027-09-15", lastDate: "2027-10-05", examDate: "2027-12-18", duration: "2 days" },
];

export type UpscPlanEvent = { date: string; what: "notification" | "lastDate" | "exam"; plan: UpscPlan };

/** Planned UPSC dates on or after `from`, soonest first. */
export function upcomingUpscDates(from: string): UpscPlanEvent[] {
  const out: UpscPlanEvent[] = [];
  for (const plan of UPSC_PLAN) {
    if (plan.notification && plan.notification >= from) out.push({ date: plan.notification, what: "notification", plan });
    if (plan.lastDate && plan.lastDate >= from) out.push({ date: plan.lastDate, what: "lastDate", plan });
    if (plan.examDate >= from) out.push({ date: plan.examDate, what: "exam", plan });
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}
