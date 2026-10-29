import { STATES_REGISTRY, StateInfo, getStateBySlug } from "@/config/states";
import { JobNotification } from "@/data/jobs";

export interface StateQualificationHub {
  stateSlug: string;
  qualSlug: string; // "12th-pass", "graduate", "engineering", "diploma"
  qualLabel: string;
  badge: string;
  title: string;
  h1: string;
  subtitle: string;
  metaDescription: string;
  stateDomicileNote: string;
  filterPredicate: (job: JobNotification) => boolean;
}

export const VERIFIED_STATE_QUAL_HUBS: StateQualificationHub[] = [
  // KARNATAKA + 12TH PASS
  {
    stateSlug: "karnataka",
    qualSlug: "12th-pass",
    qualLabel: "12th Pass (10+2 / PUC)",
    badge: "Karnataka PUC / 12th Pass",
    title: "Karnataka Government Jobs for 12th Pass 2026 - KEA & KSP Vacancies | IndiaJobNotice.com",
    h1: "Karnataka Government Jobs for 12th Pass 2026",
    subtitle: "Verified Karnataka State Employment Circulars for PUC (10+2) & Intermediate Candidates",
    metaDescription: "Explore all Karnataka government jobs for 12th pass (PUC) in 2026. KSP Police Constable, KEA SDA, KPTCL junior assistants, domicile reservation rules, and application links.",
    stateDomicileNote: "Under Karnataka Civil Services rules, candidates must have studied Kannada as one of the languages up to SSLC/10th standard or qualify the mandatory KPSC Kannada Language examination. Reserved category quotas apply strictly to Karnataka residents holding valid Caste/Income certificates (Cat-1, 2A, 2B, 3A, 3B, SC, ST).",
    filterPredicate: (job) => {
      if (job.stateSlug !== "karnataka" && !job.isCentral) return false;
      const q = job.qualifications.join(" ").toLowerCase();
      const t = job.title.toLowerCase();
      return q.includes("12th") || q.includes("puc") || q.includes("intermediate") || t.includes("constable") || t.includes("sda");
    },
  },

  // KARNATAKA + ENGINEERING
  {
    stateSlug: "karnataka",
    qualSlug: "engineering",
    qualLabel: "Engineering (B.Tech / B.E. / Diploma)",
    badge: "Karnataka Engineering & Technical",
    title: "Karnataka Engineering Govt Jobs 2026 - KPSC & KEA AE/JE Posts | IndiaJobNotice.com",
    h1: "Karnataka Engineering Government Jobs 2026",
    subtitle: "Assistant Engineer (AE) & Junior Engineer (JE) Opportunities across Karnataka PWD, WRD & ESCOMs",
    metaDescription: "Apply for Karnataka Engineering Government Jobs 2026. KPSC Group B Technical, PWD, WRD, Bescom, and KPTCL AE/JE vacancies for B.Tech & Diploma engineers.",
    stateDomicileNote: "Karnataka PWD and Water Resources Department recruitments require an AICTE recognized B.E./B.Tech or 3-Year Polytechnic Diploma. Kannada language test is compulsory for candidates who did not complete 10th standard in Kannada medium.",
    filterPredicate: (job) => {
      if (job.stateSlug !== "karnataka" && !job.isCentral) return false;
      return (
        job.category === "Engineering / Technical" ||
        job.title.toLowerCase().includes("engineer") ||
        job.shortTitle.toLowerCase().includes("group b")
      );
    },
  },

  // UTTAR PRADESH + 12TH PASS
  {
    stateSlug: "up",
    qualSlug: "12th-pass",
    qualLabel: "12th Pass (Intermediate)",
    badge: "UP 12th Intermediate",
    title: "UP Government Jobs for 12th Pass 2026 - UP Police & UPSSSC Vacancies | IndiaJobNotice.com",
    h1: "UP Government Jobs for 12th Pass 2026",
    subtitle: "Verified Employment Gazette Circulars for 10+2 Candidates Across Uttar Pradesh",
    metaDescription: "Latest UP government jobs for 12th pass in 2026. UP Police Constable (60,244 Posts), UPSSSC Junior Assistant, Forest Guard, and clerical vacancies with syllabus and apply links.",
    stateDomicileNote: "UP state reservation benefits (OBC, SC, ST, EWS) require a valid UP Domicile (Niwas) Certificate and Caste Certificate issued on or before the crucial date. Candidates from other states are considered under the Open / Unreserved general merit quota.",
    filterPredicate: (job) => {
      if (job.stateSlug !== "up" && !job.isCentral) return false;
      const q = job.qualifications.join(" ").toLowerCase();
      const t = job.title.toLowerCase();
      return q.includes("12th") || q.includes("intermediate") || t.includes("constable") || t.includes("junior assistant");
    },
  },

  // UTTAR PRADESH + GRADUATE
  {
    stateSlug: "up",
    qualSlug: "graduate",
    qualLabel: "Graduate (Degree Holder)",
    badge: "UPPSC Graduate Cadre",
    title: "UP Govt Jobs for Graduates 2026 - UPPSC PCS & RO/ARO Vacancies | IndiaJobNotice.com",
    h1: "UP Government Jobs for Graduates 2026",
    subtitle: "Civil Services, Officer Appointments & Gazetted Posts under UPPSC & State Secretariats",
    metaDescription: "Explore UP government jobs for graduates 2026. UPPSC Combined State Upper Subordinate (PCS), Review Officer (RO/ARO), BEO, and Sub-Inspector recruitments.",
    stateDomicileNote: "Graduates in any discipline from UGC recognized universities qualify for UPPSC general executive posts. Age limit is 21 to 40 years for Unreserved, with 5 years relaxation for UP reserved categories.",
    filterPredicate: (job) => {
      if (job.stateSlug !== "up" && !job.isCentral) return false;
      const q = job.qualifications.join(" ").toLowerCase();
      const t = job.title.toLowerCase();
      return q.includes("graduate") || q.includes("degree") || t.includes("pcs") || t.includes("uppsc") || t.includes("ro/aro");
    },
  },

  // BIHAR + 12TH PASS
  {
    stateSlug: "bihar",
    qualSlug: "12th-pass",
    qualLabel: "12th Pass (Intermediate)",
    badge: "Bihar 10+2 Intermediate",
    title: "Bihar Government Jobs for 12th Pass 2026 - CSBC Police & BSSC Vacancies | IndiaJobNotice.com",
    h1: "Bihar Government Jobs for 12th Pass 2026",
    subtitle: "Verified Police Constable, BSSC Inter Level & Revenue Clerk Circulars in Bihar",
    metaDescription: "All Bihar government jobs for 12th pass in 2026. Central Selection Board of Constable (CSBC), BSSC Inter-Level clerical posts, physical criteria, and direct application links.",
    stateDomicileNote: "Bihar domicile certificates (Aawasiya Praman Patra) and EBC/BC non-creamy layer certificates are mandatory for claiming state quota concessions. Out-of-state candidates may apply in General category without age or fee concession.",
    filterPredicate: (job) => {
      if (job.stateSlug !== "bihar" && !job.isCentral) return false;
      const q = job.qualifications.join(" ").toLowerCase();
      const t = job.title.toLowerCase();
      return q.includes("12th") || q.includes("intermediate") || t.includes("constable") || t.includes("csbc") || t.includes("inter level");
    },
  },

  // BIHAR + GRADUATE
  {
    stateSlug: "bihar",
    qualSlug: "graduate",
    qualLabel: "Graduate (Degree Holder)",
    badge: "BPSC Graduate Cadre",
    title: "Bihar Govt Jobs for Graduates 2026 - BPSC CCE & Teacher Vacancies | IndiaJobNotice.com",
    h1: "Bihar Government Jobs for Graduates 2026",
    subtitle: "BPSC Combined Competitive Exams, Sub-Inspector (BPSSC) & Secondary Teacher Drives",
    metaDescription: "Explore Bihar government jobs for graduates 2026. BPSC Civil Services (CCE), BPSC School Teacher (TRE), BPSSC Police SI, and BSSC CGL with syllabus and eligibility.",
    stateDomicileNote: "Candidates must hold a Bachelor's Degree in any stream. For BPSC Teacher appointments, CTET/BTET Paper 2 qualification and B.Ed/D.El.Ed are additionally required.",
    filterPredicate: (job) => {
      if (job.stateSlug !== "bihar" && !job.isCentral) return false;
      const q = job.qualifications.join(" ").toLowerCase();
      const t = job.title.toLowerCase();
      return q.includes("graduate") || q.includes("degree") || t.includes("bpsc") || t.includes("tre") || t.includes("si");
    },
  },

  // RAJASTHAN + 12TH PASS
  {
    stateSlug: "rajasthan",
    qualSlug: "12th-pass",
    qualLabel: "12th Pass (Senior Secondary)",
    badge: "Rajasthan 12th Senior Secondary",
    title: "Rajasthan Government Jobs for 12th Pass 2026 - RSMSSB CET & Police | IndiaJobNotice.com",
    h1: "Rajasthan Government Jobs for 12th Pass 2026",
    subtitle: "RSMSSB Common Eligibility Test (Senior Secondary Level), Police Constable & Forester Circulars",
    metaDescription: "Apply for Rajasthan government jobs for 12th pass in 2026. RSMSSB CET Senior Secondary, Rajasthan Police Constable, Patwari, and Clerk Grade-II vacancies.",
    stateDomicileNote: "RSMSSB recruitments require One-Time Registration (OTR) on the Rajasthan SSO Portal (sso.rajasthan.gov.in). Qualifying the RSMSSB CET (12th Level) with minimum 40% marks is mandatory for most clerical and constable appointments.",
    filterPredicate: (job) => {
      if (job.stateSlug !== "rajasthan" && !job.isCentral) return false;
      const q = job.qualifications.join(" ").toLowerCase();
      const t = job.title.toLowerCase();
      return q.includes("12th") || q.includes("senior secondary") || t.includes("cet") || t.includes("constable") || t.includes("forester");
    },
  },

  // RAJASTHAN + GRADUATE
  {
    stateSlug: "rajasthan",
    qualSlug: "graduate",
    qualLabel: "Graduate (Degree Holder)",
    badge: "RPSC Graduate Cadre",
    title: "Rajasthan Govt Jobs for Graduates 2026 - RPSC RAS & Officer Posts | IndiaJobNotice.com",
    h1: "Rajasthan Government Jobs for Graduates 2026",
    subtitle: "Rajasthan Administrative Service (RAS), RPS & State Accounts Service Gazetted Notifications",
    metaDescription: "Verified Rajasthan government jobs for graduates 2026. RPSC RAS/RTS Combined Competitive Exam, Junior Accountant, and Sub-Inspector recruitments.",
    stateDomicileNote: "Graduation degree in any stream recognized by UGC. Rajasthan Bonafide Resident Certificate is mandatory for claiming SC, ST, OBC, MBC, or EWS age relaxation (5 to 10 years).",
    filterPredicate: (job) => {
      if (job.stateSlug !== "rajasthan" && !job.isCentral) return false;
      const q = job.qualifications.join(" ").toLowerCase();
      const t = job.title.toLowerCase();
      return q.includes("graduate") || q.includes("degree") || t.includes("ras") || t.includes("rpsc") || t.includes("accountant");
    },
  },
];

export function getStateQualHub(stateSlug: string, qualSlug: string): StateQualificationHub | undefined {
  return VERIFIED_STATE_QUAL_HUBS.find(
    (h) => h.stateSlug.toLowerCase() === stateSlug.toLowerCase() && h.qualSlug.toLowerCase() === qualSlug.toLowerCase()
  );
}

export function getJobsForStateQualHub(jobs: JobNotification[], hub: StateQualificationHub): JobNotification[] {
  return jobs.filter(hub.filterPredicate);
}
