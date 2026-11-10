import { JobNotification } from "./jobs";
import { STATES_REGISTRY, StateInfo, getStateBySlug } from "@/config/states";

export interface CategoryHubInfo {
  slug: string;
  title: string;
  h1: string;
  subtitle: string;
  metaDescription: string;
  badge: string;
  canonicalPath: string;
  overview: string;
  filterPredicate: (job: JobNotification) => boolean;
}

// ==========================================
// 1. CURATED QUALIFICATION HUBS (STABLE EVERGREEN)
// ==========================================
export const QUALIFICATION_HUBS: CategoryHubInfo[] = [
  {
    slug: "12th-pass",
    title: "12th Pass Govt Jobs 2026 - Latest 10+2 Notifications & Vacancies",
    h1: "12th Pass Government Jobs 2026",
    subtitle: "Government jobs for 12th (10+2) pass candidates, from official notifications",
    metaDescription: "Government jobs for 12th pass (10+2, PUC, intermediate) candidates, central and state, with last dates, posts, eligibility and the official notification link, read from each notice.",
    badge: "10+2 Intermediate",
    canonicalPath: "/qualification/12th-pass",
    overview: "Recruitments whose notification asks for 12th (10+2, PUC or intermediate) pass: clerical, data entry, constable and similar posts, central and state.",
    filterPredicate: (job: JobNotification) => {
      const q = job.qualifications.join(" ").toLowerCase();
      const t = job.title.toLowerCase();
      return (
        q.includes("12th") ||
        q.includes("10+2") ||
        q.includes("intermediate") ||
        t.includes("chsl") ||
        t.includes("constable") ||
        t.includes("nda") ||
        t.includes("navik")
      );
    },
  },
  {
    slug: "diploma",
    title: "Diploma Govt Jobs 2026 - Polytechnic Engineering & Technical Vacancies",
    h1: "Diploma & Polytechnic Government Jobs 2026",
    subtitle: "Government jobs for diploma and polytechnic holders, from official notifications",
    metaDescription: "Government jobs for diploma and polytechnic holders, such as junior engineer and technician posts, with last dates, posts, eligibility and the official notification link, read from each notice.",
    badge: "Polytechnic / Diploma",
    canonicalPath: "/qualification/diploma",
    overview: "Recruitments whose notification asks for a diploma: junior engineer, technician and similar technical posts in central and state bodies, railways and public sector companies.",
    filterPredicate: (job: JobNotification) => {
      const q = job.qualifications.join(" ").toLowerCase();
      const t = job.title.toLowerCase();
      return (
        q.includes("diploma") ||
        q.includes("polytechnic") ||
        t.includes("junior engineer") ||
        t.includes("rrb je") ||
        t.includes("technician")
      );
    },
  },
  {
    slug: "10th-pass",
    title: "10th Pass Govt Jobs 2026 - Matriculation Jobs, SSC GD & Group D",
    h1: "10th Pass (Matriculation) Government Jobs 2026",
    subtitle: "Government jobs for 10th pass candidates, from official notifications",
    metaDescription: "Government jobs for 10th pass (matriculation, SSLC) candidates, central and state, with last dates, posts, eligibility and the official notification link, read from each notice.",
    badge: "10th High School",
    canonicalPath: "/qualification/10th-pass",
    overview: "Recruitments whose notification asks for 10th (matriculation or SSLC) pass: multi-tasking staff, Group D, constable, postal and similar posts.",
    filterPredicate: (job: JobNotification) => {
      const q = job.qualifications.join(" ").toLowerCase();
      const t = job.title.toLowerCase();
      return (
        q.includes("10th") ||
        q.includes("matric") ||
        q.includes("high school") ||
        t.includes("mts") ||
        t.includes("gd constable") ||
        t.includes("group d") ||
        t.includes("gds")
      );
    },
  },
  {
    slug: "graduate",
    title: "Graduate Govt Jobs 2026 - UPSC, SSC CGL, Bank PO & State PSC",
    h1: "Graduate (Degree) Government Jobs 2026",
    subtitle: "Government jobs for graduates, from official notifications",
    metaDescription: "Government jobs for graduates in any discipline, central and state, with last dates, posts, eligibility and the official notification link, read from each notice.",
    badge: "Bachelor's Degree",
    canonicalPath: "/qualification/graduate",
    overview: "Recruitments whose notification asks for a bachelor's degree: officer, assistant, inspector and similar posts with commissions, staff selection boards, banks and departments.",
    filterPredicate: (job: JobNotification) => {
      const q = job.qualifications.join(" ").toLowerCase();
      const t = job.title.toLowerCase();
      return (
        q.includes("graduate") ||
        q.includes("degree") ||
        q.includes("bachelor") ||
        t.includes("cgl") ||
        t.includes("upsc") ||
        t.includes("po") ||
        t.includes("officer")
      );
    },
  },
];

// ==========================================
// 2. CURATED SECTOR & DOMAIN HUBS (STABLE EVERGREEN)
// ==========================================
export const SECTOR_HUBS: CategoryHubInfo[] = [
  {
    slug: "engineering-jobs",
    title: "Government Engineering Jobs 2026 - B.Tech, B.E. & Diploma Vacancies",
    h1: "Government Engineering Jobs 2026",
    subtitle: "Engineering jobs in government bodies, from official notifications",
    metaDescription: "Government engineering jobs, such as assistant and junior engineer posts in departments, railways and public sector companies, with last dates, posts, eligibility and the official notification link, read from each notice.",
    badge: "Engineering & Technical",
    canonicalPath: "/engineering-jobs",
    overview: "Recruitments for engineers: assistant engineer, junior engineer and other technical posts in central and state departments, railways, power companies and public sector undertakings.",
    filterPredicate: (job: JobNotification) => {
      return (
        job.category === "Engineering / Technical" ||
        job.title.toLowerCase().includes("engineer") ||
        job.shortTitle.toLowerCase().includes("je")
      );
    },
  },
  {
    slug: "police-defense-jobs",
    title: "Police & Defense Govt Jobs 2026 - Army, Navy, Air Force & Police Constables",
    h1: "Police & Defense Government Jobs 2026",
    subtitle: "Police and defence jobs, from official notifications",
    metaDescription: "Police and defence jobs, such as constable, sub-inspector and armed forces entries, with last dates, posts, eligibility and the official notification link, read from each notice.",
    badge: "Uniformed Services",
    canonicalPath: "/police-defense-jobs",
    overview: "Recruitments for police and defence posts: state police constables and sub-inspectors, central armed police forces, the armed forces and related services.",
    filterPredicate: (job: JobNotification) => {
      return (
        job.category === "Police / Defense" ||
        job.title.toLowerCase().includes("police") ||
        job.title.toLowerCase().includes("constable") ||
        job.title.toLowerCase().includes("nda") ||
        job.title.toLowerCase().includes("cds") ||
        job.title.toLowerCase().includes("capf")
      );
    },
  },
  {
    slug: "railway-jobs",
    title: "Railway Recruitment 2026 - RRB NTPC, Group D, ALP & JE Notifications",
    h1: "Railway Government Jobs 2026 (RRB & RRC)",
    subtitle: "Railway jobs, from official notifications",
    metaDescription: "Railway jobs from the Railway Recruitment Boards and Railway Recruitment Cells, with last dates, posts, eligibility and the official notification link, read from each notice.",
    badge: "Indian Railways",
    canonicalPath: "/railway-jobs",
    overview: "Recruitments in Indian Railways from the Railway Recruitment Boards (RRBs) and Railway Recruitment Cells: technical, non-technical and Level-1 posts.",
    filterPredicate: (job: JobNotification) => {
      return (
        job.category === "Railways" ||
        job.organization.toLowerCase().includes("railway") ||
        job.orgShortCode.toLowerCase() === "rrb"
      );
    },
  },
  {
    slug: "banking-jobs",
    title: "Bank Jobs 2026 - SBI, IBPS PO, Clerk & RBI Grade B Recruitment",
    h1: "Banking & Insurance Government Jobs 2026",
    subtitle: "Bank jobs, from official notifications",
    metaDescription: "Bank jobs from SBI, IBPS, public sector banks and the RBI, with last dates, posts, eligibility and the official notification link, read from each notice.",
    badge: "Banking & Finance",
    canonicalPath: "/banking-jobs",
    overview: "Recruitments in public sector banking: the State Bank of India, IBPS for the banks it recruits for, other public sector banks and the Reserve Bank of India.",
    filterPredicate: (job: JobNotification) => {
      return (
        job.category === "Banking / Insurance" ||
        job.organization.toLowerCase().includes("bank") ||
        job.orgShortCode.toLowerCase() === "sbi" ||
        job.orgShortCode.toLowerCase() === "ibps" ||
        job.orgShortCode.toLowerCase() === "rbi"
      );
    },
  },
  {
    slug: "teaching-jobs",
    title: "Government Teaching Jobs 2026 - CTET, KVS, DSSSB & State TET Vacancies",
    h1: "Government Teaching Jobs 2026",
    subtitle: "Teaching jobs, from official notifications",
    metaDescription: "Government teaching jobs, such as primary, graduate and post-graduate teachers and lecturers, with last dates, posts, eligibility and the official notification link, read from each notice.",
    badge: "Education & Teaching",
    canonicalPath: "/teaching-jobs",
    overview: "Recruitments for teachers and lecturers in government schools and colleges: primary (PRT), trained graduate (TGT) and post-graduate (PGT) teachers, lecturers and related posts.",
    filterPredicate: (job: JobNotification) => {
      return (
        job.category === "Teaching / Education" ||
        job.title.toLowerCase().includes("teacher") ||
        job.title.toLowerCase().includes("ctet") ||
        job.title.toLowerCase().includes("kvs") ||
        job.organization.toLowerCase().includes("education")
      );
    },
  },
];

// ==========================================
// 3. CURATED ORGANISATION HUBS (STABLE EVERGREEN)
// ==========================================
export const ORGANISATION_HUBS: CategoryHubInfo[] = [
  {
    slug: "ssc",
    title: "SSC Recruitment 2026 - CGL, CHSL, GD Constable & MTS Exam Notices",
    h1: "Staff Selection Commission (SSC) Recruitment 2026",
    subtitle: "Staff Selection Commission (SSC) notifications",
    metaDescription: "Staff Selection Commission (SSC) notices: notifications, admit cards, answer keys and results, with last dates, posts, eligibility and the official notification link, read from each notice.",
    badge: "Staff Selection Commission",
    canonicalPath: "/organisations/ssc",
    overview: "Notices of the Staff Selection Commission (SSC), which recruits for Group B and Group C posts in central government ministries and departments.",
    filterPredicate: (job: JobNotification) => {
      return (
        job.orgShortCode.toUpperCase() === "SSC" ||
        job.organization.toLowerCase().includes("staff selection")
      );
    },
  },
  {
    slug: "upsc",
    title: "UPSC Recruitment 2026 - Civil Services, NDA, CDS & Central Gazettes",
    h1: "Union Public Service Commission (UPSC) Exams 2026",
    subtitle: "Union Public Service Commission (UPSC) notifications and calendar",
    metaDescription: "UPSC notices and UPSC's own calendar of examinations, with the official notification link for each.",
    badge: "Union Public Service Commission",
    canonicalPath: "/organisations/upsc",
    overview: "Notices of the Union Public Service Commission (UPSC), which recruits for the all-India services and central Group A and B posts.",
    filterPredicate: (job: JobNotification) => {
      return (
        job.orgShortCode.toUpperCase() === "UPSC" ||
        job.organization.toLowerCase().includes("union public service")
      );
    },
  },
  // railways-rrb went 11 Nov: it picked the same jobs as /railway-jobs, which its address now leads to
  {
    slug: "banking-ibps",
    title: "IBPS Recruitment 2026 - Bank PO, Clerk, Specialist Officer & RRBs",
    h1: "Institute of Banking Personnel Selection (IBPS) 2026",
    subtitle: "IBPS notifications",
    metaDescription: "IBPS notices: PO, clerk, specialist officer and regional rural bank recruitments, with last dates, posts, eligibility and the official notification link, read from each notice.",
    badge: "IBPS Banking",
    canonicalPath: "/organisations/banking-ibps",
    overview: "Notices of the Institute of Banking Personnel Selection (IBPS), which runs common recruitments for public sector banks and regional rural banks.",
    filterPredicate: (job: JobNotification) => {
      return (
        job.orgShortCode.toUpperCase() === "IBPS" ||
        job.organization.toLowerCase().includes("institute of banking")
      );
    },
  },
  {
    slug: "sbi",
    title: "SBI Recruitment 2026 - Probationary Officer (PO) & Clerk (Junior Associate)",
    h1: "State Bank of India (SBI) Recruitment 2026",
    subtitle: "State Bank of India (SBI) notifications",
    metaDescription: "State Bank of India (SBI) notices: PO, junior associate and specialist officer recruitments, with last dates, posts, eligibility and the official notification link, read from each notice.",
    badge: "State Bank of India",
    canonicalPath: "/organisations/sbi",
    overview: "Notices of the State Bank of India (SBI), which runs its own recruitments for probationary officers, junior associates and specialist officers.",
    filterPredicate: (job: JobNotification) => {
      return (
        job.orgShortCode.toUpperCase() === "SBI" ||
        job.organization.toLowerCase().includes("state bank of india")
      );
    },
  },
];

// Helper functions
export function getQualificationHubBySlug(slug: string): CategoryHubInfo | undefined {
  return QUALIFICATION_HUBS.find((h) => h.slug === slug);
}

export function getSectorHubBySlug(slug: string): CategoryHubInfo | undefined {
  return SECTOR_HUBS.find((h) => h.slug === slug);
}

export function getOrganisationHubBySlug(slug: string): CategoryHubInfo | undefined {
  return ORGANISATION_HUBS.find((h) => h.slug === slug);
}

export function getJobsForHub(jobs: JobNotification[], hub: CategoryHubInfo): JobNotification[] {
  return jobs.filter(hub.filterPredicate);
}
