import type { JobNotification, JobStage } from "@/data/jobs";

// Indic scripts (Devanagari to Sinhala): a stage's English summary is shown only for such titles (stageText)
const NOT_ENGLISH = /[ऀ-෿]/;

function stageForList(s: JobStage): JobStage {
  const title = s.title.length > 160 ? `${s.title.slice(0, 157)}…` : s.title;
  return {
    kind: s.kind, title, date: s.date, url: s.url, examDates: s.examDates, shortlist: s.shortlist, found: s.found,
    summary: s.summary && NOT_ENGLISH.test(s.title) ? s.summary.slice(0, 200) : undefined,
    copyName: s.copyName,
  };
}

/**
 * What a job list needs of a job. List pages send every listed job to the browser and the page is
 * stored whole on each refresh (Vercel counts ISR writes by size, 9 Nov: 419K of 200K free), so the
 * long texts only the job page shows stay behind: wording, tables, stage summaries, pay, syllabus.
 */
export function forList(j: JobNotification): JobNotification {
  return {
    ...j,
    salary: "", ageRelaxation: "", syllabusSummary: "", selectionProcess: [],
    howToApply: undefined, ageLimitText: undefined, applicationFeeText: undefined, reservation: undefined,
    ageLimits: undefined, feeLastDate: undefined, ageAsOn: undefined, lastVerifiedDate: undefined,
    // only the date changes' days (the Today tab), not their text
    updates: j.updates?.filter((u) => u.found).map((u) => ({ date: u.date, text: "", url: "", found: u.found })),
    districtWiseVacancies: undefined, verificationSource: undefined,
    posts: j.posts?.map((p) => ({ postName: p.postName, vacancies: 0, qualification: p.qualification, ageLimit: "", pay: "" })),
    copyKey: undefined,
    stages: j.stages?.map(stageForList),
  };
}
