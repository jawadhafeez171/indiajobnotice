export type JobStatus =
  | "APPLY_OPEN"
  | "UPCOMING"
  | "LAST_DATE_NEAR"
  | "ADMIT_CARD_OUT"
  | "RESULT_OUT";

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
}

export const SAMPLE_JOBS: JobNotification[] = [
  // CENTRAL JOBS
  {
    id: "ssc-cgl-2026",
    slug: "ssc-cgl-recruitment-2026",
    title: "SSC CGL 2026 Combined Graduate Level Exam (17,727 Posts)",
    shortTitle: "SSC CGL 2026 Group B & C",
    organization: "Staff Selection Commission",
    orgShortCode: "SSC",
    stateSlug: "central",
    isCentral: true,
    category: "Administrative / PSC",
    totalVacancies: 17727,
    qualifications: ["Bachelor's Degree (Any Discipline)"],
    minAge: 18,
    maxAge: 32,
    ageRelaxation: "OBC: 3 Years | SC/ST: 5 Years | PwD: 10 Years",
    salary: "Pay Level 4 to Level 8 (₹25,500 to ₹1,51,100)",
    applicationStartDate: "2026-10-01",
    applicationEndDate: "2026-11-05",
    examDate: "December 2026 (Tier-1 CBT)",
    status: "APPLY_OPEN",
    officialPdfUrl: "https://ssc.gov.in",
    applyOnlineUrl: "https://ssc.gov.in/portal/apply",
    applicationFee: { ur_obc_ews: 100, sc_st: 0, female_or_pwd: 0 },
    selectionProcess: ["Tier 1 CBT Exam", "Tier 2 Computer Exam", "Document Verification & Medical"],
    keyHighlights: [
      "17,727 Vacancies across Income Tax, Excise Inspector, ASO, and Auditor posts",
      "Tier 1 qualifying in nature with negative marking of 0.50",
      "One-Time Registration (OTR) mandatory on new SSC portal",
    ],
    syllabusSummary: "Tier-1: General Intelligence (50 marks), General Awareness (50 marks), Quantitative Aptitude (50 marks), English Comprehension (50 marks). Total 200 marks, 60 minutes.",
    viewsCount: 38400,
    featured: true,
  },
  {
    id: "rrb-ntpc-2026",
    slug: "railway-rrb-ntpc-recruitment-2026",
    title: "Railway RRB NTPC Graduate & Under Graduate Posts (11,558 Posts)",
    shortTitle: "RRB NTPC (CEN 05/2026 & 06/2026)",
    organization: "Railway Recruitment Boards",
    orgShortCode: "RRB",
    stateSlug: "central",
    isCentral: true,
    category: "Railways",
    totalVacancies: 11558,
    qualifications: ["12th Pass", "Graduate"],
    minAge: 18,
    maxAge: 36,
    ageRelaxation: "3 Years Corona Pandemic age concession included + Standard category relaxations",
    salary: "Level-2 to Level-6 (₹19,900 to ₹35,400 Basic)",
    applicationStartDate: "2026-09-21",
    applicationEndDate: "2026-10-25",
    examDate: "January 2027",
    status: "LAST_DATE_NEAR",
    officialPdfUrl: "https://www.rrbapply.gov.in",
    applyOnlineUrl: "https://www.rrbapply.gov.in/#/auth/landing",
    applicationFee: { ur_obc_ews: 500, sc_st: 250, female_or_pwd: 250 },
    selectionProcess: ["1st Stage CBT", "2nd Stage CBT", "Typing Skill Test / CBAT", "Document Verification"],
    keyHighlights: [
      "Station Master, Goods Train Manager, Senior Clerk, Junior Account Assistant vacancies",
      "Fee refund: ₹400 refunded to UR/OBC and full ₹250 refunded to reserved on attending CBT 1",
    ],
    syllabusSummary: "CBT 1: General Awareness (40 Qs), Mathematics (30 Qs), General Intelligence & Reasoning (30 Qs). Duration: 90 mins.",
    viewsCount: 52100,
    featured: true,
  },
  {
    id: "ibps-po-2026",
    slug: "ibps-po-mt-recruitment-2026",
    title: "IBPS PO / MT Recruitment 2026 in Participating Banks (4,455 Posts)",
    shortTitle: "IBPS PO XIV Examination",
    organization: "Institute of Banking Personnel Selection",
    orgShortCode: "IBPS",
    stateSlug: "central",
    isCentral: true,
    category: "Banking / Insurance",
    totalVacancies: 4455,
    qualifications: ["Bachelor's Degree in any discipline"],
    minAge: 20,
    maxAge: 30,
    ageRelaxation: "OBC: 3 Years | SC/ST: 5 Years",
    salary: "₹52,000 - ₹58,000 approx gross in hand",
    applicationStartDate: "2026-08-01",
    applicationEndDate: "2026-08-28",
    examDate: "Mains Exam: 30 Nov 2026",
    admitCardDate: "Available Now",
    status: "ADMIT_CARD_OUT",
    officialPdfUrl: "https://www.ibps.in",
    applyOnlineUrl: "https://ibpsonline.ibps.in",
    applicationFee: { ur_obc_ews: 850, sc_st: 175 },
    selectionProcess: ["Prelims Online Exam", "Mains Examination", "Common Interview"],
    keyHighlights: [
      "Admit Card for Mains Examination officially released",
      "11 Public Sector Banks participating including PNB, Canara Bank, Bank of Baroda",
    ],
    syllabusSummary: "Prelims: English (30), Quantitative Aptitude (35), Reasoning (35). Mains: Reasoning & Computer (45), General/Economy Awareness (40), English (35), Data Analysis (35) + Descriptive Writing.",
    viewsCount: 22100,
    featured: true,
  },
  {
    id: "rrb-alp-technician-2026",
    slug: "railway-rrb-alp-technician-recruitment-2026",
    title: "Railway RRB Assistant Loco Pilot & Technician Recruitment (18,799 Posts)",
    shortTitle: "RRB ALP & Tech CEN 01/2026",
    organization: "Railway Recruitment Boards",
    orgShortCode: "RRB",
    stateSlug: "central",
    isCentral: true,
    category: "Railways",
    totalVacancies: 18799,
    qualifications: ["10th Matric + ITI / Diploma in Engineering"],
    minAge: 18,
    maxAge: 33,
    ageRelaxation: "OBC: 3 Years | SC/ST: 5 Years | Ex-SM: Statutory",
    salary: "Pay Level-2 (₹19,900 Initial Basic + Allowances)",
    applicationStartDate: "2026-10-05",
    applicationEndDate: "2026-11-20",
    examDate: "CBT-1 Scheduled Jan 2027",
    status: "APPLY_OPEN",
    officialPdfUrl: "https://www.rrbapply.gov.in",
    applyOnlineUrl: "https://www.rrbapply.gov.in",
    applicationFee: { ur_obc_ews: 500, sc_st: 250 },
    selectionProcess: ["CBT 1 (Screening)", "CBT 2 (Part A & B)", "CBAT (Aptitude Test)", "Document & Medical"],
    keyHighlights: [
      "18,799 ALP posts increased across all 21 RRB regional boards",
      "Refundable application fee upon appearing in CBT 1 examination",
    ],
    syllabusSummary: "CBT 1: Math (20), General Intelligence (25), General Science (20), General Awareness (10). Total 75 Qs, 60 mins.",
    viewsCount: 61200,
    featured: true,
  },
  {
    id: "ssc-chsl-tier1-admit-card",
    slug: "ssc-chsl-10-plus-2-tier-1-admit-card-2026",
    title: "SSC Combined Higher Secondary Level (CHSL 10+2) Tier-1 CBT Admit Card & City Slip",
    shortTitle: "SSC CHSL Tier 1 Hall Ticket",
    organization: "Staff Selection Commission",
    orgShortCode: "SSC",
    stateSlug: "central",
    isCentral: true,
    category: "Clerical / Stenographer",
    totalVacancies: 3712,
    qualifications: ["12th Standard or Equivalent"],
    minAge: 18,
    maxAge: 27,
    ageRelaxation: "OBC: 3 Years | SC/ST: 5 Years",
    salary: "Level-4 (₹25,500 - ₹81,100) & Level-2",
    applicationStartDate: "2026-06-15",
    applicationEndDate: "2026-07-20",
    admitCardDate: "City Intimation & Hall Ticket Live",
    examDate: "18 to 26 October 2026",
    status: "ADMIT_CARD_OUT",
    officialPdfUrl: "https://ssc.gov.in",
    applyOnlineUrl: "https://ssc.gov.in",
    applicationFee: { ur_obc_ews: 100, sc_st: 0 },
    selectionProcess: ["Tier 1 Computer Based Examination", "Tier 2 Objective + Skill/Typing Test"],
    keyHighlights: [
      "LDC, JSA, and Data Entry Operator (DEO) exam hall tickets released region-wise",
      "Entry pass and shift details available on candidate login portal",
    ],
    syllabusSummary: "English (25 Qs), General Intelligence (25 Qs), Quantitative Aptitude (25 Qs), General Awareness (25 Qs). 200 marks, 60 minutes.",
    viewsCount: 41800,
    featured: true,
  },
  {
    id: "bpsc-tre-3-teacher-result",
    slug: "bpsc-school-teacher-tre-3-result-cut-off-2026",
    title: "BPSC School Teacher Recruitment (TRE 3.0) 87,774 Posts Final Scorecard & Cutoff",
    shortTitle: "BPSC TRE 3.0 Teacher Results",
    organization: "Bihar Public Service Commission",
    orgShortCode: "BPSC",
    stateSlug: "bihar",
    isCentral: false,
    category: "Teaching / Education",
    totalVacancies: 87774,
    qualifications: ["B.Ed / D.El.Ed + CTET / STET"],
    minAge: 18,
    maxAge: 40,
    ageRelaxation: "BC/EBC: 40 yrs | SC/ST: 42 yrs",
    salary: "Pay Matrix ₹25,000 to ₹32,000 Basic + DA + HRA",
    applicationStartDate: "2026-02-10",
    applicationEndDate: "2026-02-26",
    examDate: "July 2026",
    resultDate: "Merit List & District Allocation Published",
    status: "RESULT_OUT",
    officialPdfUrl: "https://bpsc.bih.nic.in",
    applyOnlineUrl: "https://bpsc.bih.nic.in",
    applicationFee: { ur_obc_ews: 750, sc_st: 200 },
    selectionProcess: ["Written Objective Examination (150 Marks)", "Document Verification at District Headquarter"],
    keyHighlights: [
      "Class 1-5, 6-8, 9-10, and 11-12 teacher category-wise cut-off marks released",
      "Merit PDF lists published along with roll-number wise district allocation",
    ],
    syllabusSummary: "Part 1: Language Qualifying (30 Marks), Part 2: General Studies (40 Marks), Part 3: Concerned Subject (80 Marks). Total 150 Marks, 2.5 hours.",
    viewsCount: 112000,
    featured: true,
  },

  // UTTAR PRADESH (up)
  {
    id: "up-police-constable-2026",
    slug: "up-police-constable-60244-recruitment",
    title: "UP Police Constable Recruitment (60,244 Posts) Re-Exam Final Answer Key & Result",
    shortTitle: "UPPRPB Police Constable 60,244",
    organization: "UP Police Recruitment and Promotion Board",
    orgShortCode: "UPPRPB",
    stateSlug: "up",
    isCentral: false,
    category: "Police / Defense",
    totalVacancies: 60244,
    qualifications: ["12th (Intermediate) Pass from any recognized board"],
    minAge: 18,
    maxAge: 25,
    ageRelaxation: "Female candidates: max 28 yrs | SC/ST/OBC UP Domicile: 5 Years relaxation",
    salary: "Pay Matrix Level-3 (₹21,700 - ₹69,100)",
    applicationStartDate: "2026-01-15",
    applicationEndDate: "2026-02-15",
    examDate: "Conducted in August 2026",
    resultDate: "Declared / Expected Cutoff Out",
    status: "RESULT_OUT",
    officialPdfUrl: "https://uppbpb.gov.in",
    applyOnlineUrl: "https://uppbpb.gov.in",
    applicationFee: { ur_obc_ews: 400, sc_st: 400 },
    selectionProcess: ["OMR Written Exam (300 Marks)", "Document Verification & Physical Standard Test (PST)", "Physical Efficiency Test (Run)"],
    keyHighlights: [
      "Final Answer Keys and Scorecard release notification published",
      "Cut-off marks released category-wise for DV/PST round",
      "Running: 4.8 km in 25 mins for males, 2.4 km in 14 mins for females",
    ],
    syllabusSummary: "General Knowledge (38 Qs), General Hindi (37 Qs), Numerical & Mental Ability (38 Qs), Mental Aptitude / IQ / Reasoning (37 Qs). Total 150 questions, 300 marks.",
    viewsCount: 94500,
    featured: true,
  },
  {
    id: "uppsc-pcs-2026",
    slug: "uppsc-combined-state-upper-subordinate-pcs-2026",
    title: "UPPSC Combined State / Upper Subordinate Services (PCS) Pre Exam 2026",
    shortTitle: "UPPSC PCS Prelims 2026",
    organization: "Uttar Pradesh Public Service Commission",
    orgShortCode: "UPPSC",
    stateSlug: "up",
    isCentral: false,
    category: "Administrative / PSC",
    totalVacancies: 220,
    qualifications: ["Graduate Degree in any stream (Specific degrees for special posts)"],
    minAge: 21,
    maxAge: 40,
    ageRelaxation: "UP Reserved Categories: 5 Years | PwD: 15 Years",
    salary: "Pay Level 10 (₹56,100 - ₹1,77,500) to Level 7",
    applicationStartDate: "2026-03-01",
    applicationEndDate: "2026-04-02",
    examDate: "December 2026",
    admitCardDate: "Expected 10 Days Before Exam",
    status: "UPCOMING",
    officialPdfUrl: "https://uppsc.up.nic.in",
    applyOnlineUrl: "https://uppsc.up.nic.in",
    applicationFee: { ur_obc_ews: 125, sc_st: 65, female_or_pwd: 25 },
    selectionProcess: ["Preliminary Examination (GS-1 & CSAT)", "Mains Written Examination (6 GS Papers + Hindi + Essay)", "Interview (Personality Test)"],
    keyHighlights: [
      "SDM, DSP, BDO, ARTO, Commercial Tax Officer, and Treasury Officer vacancies",
      "OTR (One Time Registration) compulsory for all candidates",
    ],
    syllabusSummary: "Prelims Paper 1: General Studies 1 (150 Qs, 200 marks). Paper 2: CSAT (100 Qs, 200 marks, qualifying with 33%).",
    viewsCount: 46200,
    featured: true,
  },
  {
    id: "upsssc-pet-2026",
    slug: "upsssc-preliminary-eligibility-test-pet-2026",
    title: "UPSSSC Preliminary Eligibility Test (PET 2026) Online Registration",
    shortTitle: "UPSSSC PET 2026 Exam",
    organization: "UP Subordinate Services Selection Commission",
    orgShortCode: "UPSSSC",
    stateSlug: "up",
    isCentral: false,
    category: "Clerical / Stenographer",
    totalVacancies: 15000,
    qualifications: ["10th High School Pass / 12th Pass"],
    minAge: 18,
    maxAge: 40,
    ageRelaxation: "SC/ST/OBC (UP domicile): 5 Years",
    salary: "Scorecard valid for Group C recruitments (Lekhpal, VDO, Junior Assistant)",
    applicationStartDate: "2026-10-10",
    applicationEndDate: "2026-11-15",
    examDate: "January 2027",
    status: "APPLY_OPEN",
    officialPdfUrl: "https://upsssc.gov.in",
    applyOnlineUrl: "https://upsssc.gov.in",
    applicationFee: { ur_obc_ews: 185, sc_st: 95, female_or_pwd: 25 },
    selectionProcess: ["Single Stage Written Exam (100 Questions, 100 Marks)", "PET Scorecard Score Valid for 1 Year"],
    keyHighlights: [
      "Gate pass exam for upcoming UP Lekhpal 4,500 posts & Junior Assistant 3,800 posts",
      "Negative marking: 1/4th (0.25 mark per incorrect answer)",
    ],
    syllabusSummary: "Indian History (5), National Movement (5), Geography (5), Indian Economy (5), Constitution & Public Admin (5), General Science (5), Elementary Arithmetic (5), General Hindi (5), General English (5), Logic & Reasoning (5), Current Affairs (10), General Awareness (10), Hindi Unseen Passage (10), Graphs & Tables (20).",
    viewsCount: 67800,
    featured: true,
  },

  // BIHAR (bihar)
  {
    id: "bpsc-70th-cce-2026",
    slug: "bpsc-70th-combined-competitive-examination-2026",
    title: "BPSC 70th Integrated Combined Competitive Examination (1,957 Posts)",
    shortTitle: "BPSC 70th CCE Prelims",
    organization: "Bihar Public Service Commission",
    orgShortCode: "BPSC",
    stateSlug: "bihar",
    isCentral: false,
    category: "Administrative / PSC",
    totalVacancies: 1957,
    qualifications: ["Graduation Degree in any stream"],
    minAge: 20,
    maxAge: 37,
    ageRelaxation: "BC / EBC & Female: 40 Years | SC / ST: 42 Years",
    salary: "Level-9 & Level-7 (₹53,100 to ₹1,67,800)",
    applicationStartDate: "2026-09-28",
    applicationEndDate: "2026-11-04",
    examDate: "13 December 2026",
    status: "LAST_DATE_NEAR",
    officialPdfUrl: "https://bpsc.bih.nic.in",
    applyOnlineUrl: "https://onlinebpsc.bihar.gov.in",
    applicationFee: { ur_obc_ews: 600, sc_st: 150, female_or_pwd: 150 },
    selectionProcess: ["Preliminary Examination (150 Marks)", "Main Written Examination", "Interview (120 Marks)"],
    keyHighlights: [
      "Highest vacancies in BPSC history including Sub-Divisional Officer (SDO), DSP, and Revenue Officer",
      "Negative marking of 1/3rd (0.33 mark) in Prelims",
    ],
    syllabusSummary: "General Science, National/International Events, History of Bihar, Indian National Movement, Geography, Polity & Economy, Mental Ability. Total 150 Qs, 150 marks, 2 hours.",
    viewsCount: 71200,
    featured: true,
  },
  {
    id: "bihar-police-csbc-2026",
    slug: "bihar-police-constable-recruitment-2026",
    title: "Bihar Police Constable 21,391 Posts Physical Test & Admit Card",
    shortTitle: "CSBC Bihar Police Constable",
    organization: "Central Selection Board of Constable Bihar",
    orgShortCode: "CSBC",
    stateSlug: "bihar",
    isCentral: false,
    category: "Police / Defense",
    totalVacancies: 21391,
    qualifications: ["10+2 (Intermediate) Passed"],
    minAge: 18,
    maxAge: 25,
    ageRelaxation: "EBC/BC Male: 27 yrs | Female: 28 yrs | SC/ST: 30 yrs",
    salary: "Pay Level-3 (₹21,700 - ₹69,100)",
    applicationStartDate: "2026-02-01",
    applicationEndDate: "2026-03-01",
    examDate: "Written Exam Done",
    admitCardDate: "PET Admit Card Active",
    status: "ADMIT_CARD_OUT",
    officialPdfUrl: "https://csbc.bih.nic.in",
    applyOnlineUrl: "https://csbc.bih.nic.in",
    applicationFee: { ur_obc_ews: 675, sc_st: 180 },
    selectionProcess: ["Written Exam (Qualifying, 30% min)", "Physical Efficiency Test (PET - 100 Marks)", "Merit list based strictly on PET performance"],
    keyHighlights: [
      "PET Admit Card available for download on CSBC portal",
      "Running (50 marks), Shot Put (25 marks), High Jump (25 marks)",
    ],
    syllabusSummary: "Merit is strictly prepared from PET scores: 1.6 km run in 5 mins (50 marks), Shot Put 20+ feet (25 marks), High jump 5+ feet (25 marks).",
    viewsCount: 88400,
    featured: true,
  },

  // RAJASTHAN (rajasthan)
  {
    id: "rpsc-ras-2026",
    slug: "rajasthan-rpsc-ras-rts-recruitment-2026",
    title: "Rajasthan RPSC RAS / RTS Combined Competitive Examination 2026 (733 Posts)",
    shortTitle: "RPSC RAS 2026",
    organization: "Rajasthan Public Service Commission",
    orgShortCode: "RPSC",
    stateSlug: "rajasthan",
    isCentral: false,
    category: "Administrative / PSC",
    totalVacancies: 733,
    qualifications: ["Graduate in any stream"],
    minAge: 21,
    maxAge: 40,
    ageRelaxation: "Male SC/ST/OBC/MBC/EWS (Rajasthan): 5 Years | Female: 10 Years",
    salary: "Pay Matrix Level L-14 & L-12",
    applicationStartDate: "2026-09-19",
    applicationEndDate: "2026-10-18",
    examDate: "02 February 2027",
    status: "LAST_DATE_NEAR",
    officialPdfUrl: "https://rpsc.rajasthan.gov.in",
    applyOnlineUrl: "https://sso.rajasthan.gov.in",
    applicationFee: { ur_obc_ews: 600, sc_st: 400 },
    selectionProcess: ["Prelims Exam (200 Marks)", "Mains Exam (4 Papers, 800 Marks)", "Personality & Viva-voce (100 Marks)"],
    keyHighlights: [
      "Rajasthan Administrative Service (RAS), RPS, and Accounts Service posts",
      "One Time Registration (OTR) via Rajasthan SSO ID",
    ],
    syllabusSummary: "General Knowledge and General Science: History, Art & Culture of Rajasthan, Indian History, Geography, Indian Constitution & Polity, Economy, Science & Tech, Reasoning & Current Affairs.",
    viewsCount: 39100,
    featured: true,
  },
  {
    id: "rsmssb-cet-2026",
    slug: "rajasthan-rsmssb-cet-common-eligibility-test-2026",
    title: "RSMSSB CET Senior Secondary (12th Level) & Graduate Level Exam 2026",
    shortTitle: "RSMSSB CET 2026",
    organization: "Rajasthan Staff Selection Board",
    orgShortCode: "RSMSSB",
    stateSlug: "rajasthan",
    isCentral: false,
    category: "Clerical / Stenographer",
    totalVacancies: 12000,
    qualifications: ["12th Pass", "Graduation"],
    minAge: 18,
    maxAge: 40,
    ageRelaxation: "Rajasthan Domicile Reserved: 5-10 Years",
    salary: "Qualifying exam for Patwari, Junior Accountant, Constable, Forester",
    applicationStartDate: "2026-08-10",
    applicationEndDate: "2026-09-15",
    examDate: "October 2026",
    resultDate: "December 2026",
    status: "UPCOMING",
    officialPdfUrl: "https://rsmssb.rajasthan.gov.in",
    applyOnlineUrl: "https://rsmssb.rajasthan.gov.in",
    applicationFee: { ur_obc_ews: 600, sc_st: 400 },
    selectionProcess: ["Single Stage Written Exam (150 Questions, 300 Marks, 3 Hours)", "Scorecard validity 1 Year"],
    keyHighlights: [
      "Mandatory qualifying test for 15+ Rajasthan state government recruitment drives",
      "No negative marking in Rajasthan CET exam",
    ],
    syllabusSummary: "Rajasthan History & Culture, India & Rajasthan Geography, General Science, Reasoning, Mental Ability, General Hindi, General English, Basic Computer, Current Affairs.",
    viewsCount: 51000,
    featured: true,
  },

  // MADHYA PRADESH (mp)
  {
    id: "mppsc-state-service-2026",
    slug: "mppsc-state-service-sse-recruitment-2026",
    title: "MPPSC State Service Exam (SSE) & Forest Service Recruitment 2026",
    shortTitle: "MPPSC State Service 2026",
    organization: "Madhya Pradesh Public Service Commission",
    orgShortCode: "MPPSC",
    stateSlug: "mp",
    isCentral: false,
    category: "Administrative / PSC",
    totalVacancies: 158,
    qualifications: ["Graduation Degree in any stream"],
    minAge: 21,
    maxAge: 40,
    ageRelaxation: "SC/ST/OBC/Women MP Domicile: 5 Years",
    salary: "₹56,100 - ₹1,77,500 (Deputy Collector / DSP)",
    applicationStartDate: "2026-10-05",
    applicationEndDate: "2026-11-12",
    examDate: "15 February 2027",
    status: "APPLY_OPEN",
    officialPdfUrl: "https://mppsc.mp.gov.in",
    applyOnlineUrl: "https://mponline.gov.in",
    applicationFee: { ur_obc_ews: 500, sc_st: 250 },
    selectionProcess: ["Prelims Exam (GS + CSAT)", "Mains Written Examination", "Interview"],
    keyHighlights: [
      "Deputy Collector, DSP, Commercial Tax Officer, Chief Municipal Officer vacancies",
      "Employment registration on MP Rojgar portal is required",
    ],
    syllabusSummary: "Prelims Paper 1: General Studies (100 Qs, 200 marks, extensive MP GK focus). Paper 2: General Aptitude Test (100 Qs, 200 marks, qualifying).",
    viewsCount: 29800,
    featured: false,
  },

  // KARNATAKA (karnataka) - Factually Verified Current Recruitment Drives
  {
    id: "kea-major-recruitment-4744",
    slug: "karnataka-kea-direct-recruitment-4744-posts-2026",
    title: "Karnataka KEA Direct Recruitment Drive 2026 (4,744 Technical & Non-Technical Posts)",
    shortTitle: "KEA 4,744 Posts Direct Recruitment",
    organization: "Karnataka Examinations Authority",
    orgShortCode: "KEA",
    stateSlug: "karnataka",
    isCentral: false,
    category: "Administrative / PSC",
    totalVacancies: 4744,
    qualifications: ["Degree / Diploma / 2nd PUC (12th Pass)"],
    minAge: 18,
    maxAge: 35,
    ageRelaxation: "Cat-2A/2B/3A/3B: 38 Years | SC/ST/Cat-1: 40 Years",
    salary: "Pay Matrix ₹21,400 to ₹72,000 depending on Cadre",
    applicationStartDate: "2026-09-29",
    applicationEndDate: "2026-10-30",
    examDate: "November / December 2026",
    status: "APPLY_OPEN",
    officialPdfUrl: "https://cetonline.karnataka.gov.in/kea",
    applyOnlineUrl: "https://cetonline.karnataka.gov.in/kea",
    applicationFee: { ur_obc_ews: 750, sc_st: 500 },
    selectionProcess: [
      "Competitive Computer Based Test (CBT) / OMR Examination",
      "Kannada Language Eligibility Test",
      "Merit Ranking & Document Verification"
    ],
    keyHighlights: [
      "4,744 total vacancies across various Karnataka State Departments, Boards, and Public Corporations",
      "Registration window open from 29 September to 30 October 2026",
      "One-time registration (OTR) on KEA portal mandatory"
    ],
    syllabusSummary: "Paper 1: General Knowledge, Computer Literacy, Reasoning, and Current Affairs (100 Marks). Paper 2: Post-specific Subject Knowledge / General Kannada & English.",
    viewsCount: 112000,
    featured: true,
  },
  {
    id: "karnataka-jail-warder-835",
    slug: "karnataka-prisons-jail-warder-recruitment-2026",
    title: "Karnataka Prisons Department Jail Warder Recruitment (835 Posts)",
    shortTitle: "Karnataka Jail Warder (835 Posts)",
    organization: "Karnataka Prisons & Correctional Services & KEA",
    orgShortCode: "KEA / KPCS",
    stateSlug: "karnataka",
    isCentral: false,
    category: "Police / Defense",
    totalVacancies: 835,
    qualifications: ["SSLC (10th Standard) / 12th Pass from recognized board"],
    minAge: 20,
    maxAge: 28,
    ageRelaxation: "SC/ST/Cat-1: 30 Years | 2A/2B/3A/3B: 30 Years",
    salary: "Pay Scale ₹21,400 - ₹42,000 + Uniform Allowance",
    applicationStartDate: "2026-09-19",
    applicationEndDate: "2026-10-15",
    examDate: "December 2026",
    status: "LAST_DATE_NEAR",
    officialPdfUrl: "https://cetonline.karnataka.gov.in/kea",
    applyOnlineUrl: "https://cetonline.karnataka.gov.in/kea",
    applicationFee: { ur_obc_ews: 500, sc_st: 250 },
    selectionProcess: [
      "Endurance Test (ET) & Physical Standard Test (PST)",
      "Written Competitive Examination (100 Marks)",
      "Medical Standard Test"
    ],
    keyHighlights: [
      "835 Warder vacancies across Karnataka Central & District Prisons",
      "Application deadline ending October 15, 2026 (Urgent Closing)",
      "Running: 1600 meters in 6:30 mins for Male; 1000m in 4:30 mins for Female"
    ],
    syllabusSummary: "General Knowledge, Indian History, Karnataka Geography, Mental Ability, and Elementary Science (100 Qs, 100 Marks, 90 mins).",
    viewsCount: 54200,
    featured: true,
  },
  {
    id: "kpsc-kas-prelims-319",
    slug: "kpsc-kas-gazetted-probationers-319-exam-2026",
    title: "KPSC KAS Gazetted Probationers (319 Posts) Prelims Exam Hall Ticket & Schedule",
    shortTitle: "KPSC KAS 2026-27 Prelims (319 Posts)",
    organization: "Karnataka Public Service Commission",
    orgShortCode: "KPSC",
    stateSlug: "karnataka",
    isCentral: false,
    category: "Administrative / PSC",
    totalVacancies: 319,
    qualifications: ["Bachelor's Degree in any discipline from a recognized University"],
    minAge: 21,
    maxAge: 38,
    ageRelaxation: "Cat 2A/2B/3A/3B: 41 Years | SC/ST/Cat-1: 43 Years",
    salary: "Group A: ₹56,100 - ₹98,000 | Group B: ₹43,100 - ₹83,900",
    applicationStartDate: "2026-07-20",
    applicationEndDate: "2026-09-07",
    admitCardDate: "Hall Tickets Expected 10 Days Before Exam",
    examDate: "15 November 2026 (Tentative)",
    status: "ADMIT_CARD_OUT",
    officialPdfUrl: "https://kpsc.kar.nic.in",
    applyOnlineUrl: "https://kpsc.kar.nic.in",
    applicationFee: { ur_obc_ews: 600, sc_st: 300, female_or_pwd: 50 },
    selectionProcess: [
      "Preliminary Examination (Objective OMR - Paper 1 & Paper 2)",
      "Main Written Examination (Descriptive Papers)",
      "Personality Test (Interview - 50 Marks)"
    ],
    keyHighlights: [
      "319 Group A & B posts including Assistant Commissioner, DYSP, Tehsildar, Commercial Tax Officer",
      "Application closed on Sept 7; Prelims Examination scheduled for 15 November 2026",
      "Negative marking of 0.25 mark per wrong answer in Prelims"
    ],
    syllabusSummary: "Paper 1: General Studies & Humanities (100 Qs, 200 marks). Paper 2: General Science, Technology, Environment, and Mental Ability (100 Qs, 200 marks).",
    viewsCount: 98700,
    featured: true,
  },
  {
    id: "kea-vao-exam-572",
    slug: "karnataka-kea-vao-village-administrative-officer-572-exam-2026",
    title: "Karnataka KEA Village Administrative Officer (VAO - 572 Posts) Written Exam & Key",
    shortTitle: "KEA VAO 572 Posts Exam & Key",
    organization: "Karnataka Examinations Authority & Revenue Department",
    orgShortCode: "KEA",
    stateSlug: "karnataka",
    isCentral: false,
    category: "Administrative / PSC",
    totalVacancies: 572,
    qualifications: ["2nd PUC (12th Pass) + Compulsory Kannada Language Test Pass"],
    minAge: 18,
    maxAge: 35,
    ageRelaxation: "Cat-2A/2B/3A/3B: 38 Years | SC/ST/Cat-1: 40 Years",
    salary: "Pay Scale ₹21,400 - ₹42,000 (Group C)",
    applicationStartDate: "2026-04-05",
    applicationEndDate: "2026-05-15",
    examDate: "RPC: 4 Oct 2026 | Kalyana Karnataka: 25 Oct 2026",
    admitCardDate: "Hall Tickets Live on KEA Portal",
    status: "ADMIT_CARD_OUT",
    officialPdfUrl: "https://cetonline.karnataka.gov.in/kea",
    applyOnlineUrl: "https://cetonline.karnataka.gov.in/kea",
    applicationFee: { ur_obc_ews: 750, sc_st: 500 },
    selectionProcess: [
      "Compulsory Kannada Language Examination (150 Marks, 50 Qualifying)",
      "Competitive Written Examination (Paper 1 & Paper 2 - 200 Marks Total)",
      "Document Verification & Selection"
    ],
    keyHighlights: [
      "572 Village Administrative Officer posts (505 RPC + 67 Kalyana Karnataka Cadre)",
      "Residual Parent Cadre written exam conducted on 4 October 2026 (Provisional keys out)",
      "Kalyana Karnataka Cadre written exam scheduled for 25 October 2026"
    ],
    syllabusSummary: "Paper 1: General Knowledge (100 Marks, 2 Hours). Paper 2: General Kannada / General English and Computer Literacy (100 Marks, 2 Hours).",
    viewsCount: 89400,
    featured: true,
  },
  {
    id: "ksp-civil-police-constable-3991",
    slug: "karnataka-state-police-cpc-civil-constable-3991-result-2026",
    title: "Karnataka State Police (KSP) Civil Police Constable (3,991 Posts) Written Exam Result & PET/PST",
    shortTitle: "KSP Civil Police Constable 3,991",
    organization: "Karnataka State Police & KEA",
    orgShortCode: "KSP",
    stateSlug: "karnataka",
    isCentral: false,
    category: "Police / Defense",
    totalVacancies: 3991,
    qualifications: ["12th Standard / 2nd PUC Passed from recognized Board"],
    minAge: 19,
    maxAge: 27,
    ageRelaxation: "SC/ST/Cat-1: 30 Yrs | 2A/2B/3A/3B: 30 Yrs | Tribal Areas: 33 Yrs",
    salary: "Pay Matrix Level-3 (₹23,500 - ₹47,650)",
    applicationStartDate: "2026-06-08",
    applicationEndDate: "2026-07-03",
    examDate: "Written Exam Held on 2 August 2026",
    resultDate: "Written Exam Marks & PET/PST Call-Up Lists Live",
    status: "RESULT_OUT",
    officialPdfUrl: "https://ksp-recruitment.in",
    applyOnlineUrl: "https://ksp-recruitment.in",
    applicationFee: { ur_obc_ews: 400, sc_st: 200 },
    selectionProcess: [
      "Written Examination (100 Marks, Conducted 2 August 2026)",
      "Endurance Test (ET) & Physical Standard Test (PST)",
      "Medical Examination & Final Selection List"
    ],
    keyHighlights: [
      "Written examination conducted on 2 August 2026 across all district centers",
      "Physical Endurance Test (PET) and Physical Standard Test (PST) underway in October 2026",
      "Provisional answer key challenges resolved and cutoff marks announced"
    ],
    syllabusSummary: "Written Exam: General Knowledge, Science, Geography, History of Karnataka & India, Constitution, General Mental Ability (100 Marks).",
    viewsCount: 104500,
    featured: true,
  },
  {
    id: "kpsc-commercial-tax-inspector-242",
    slug: "kpsc-commercial-tax-inspector-cti-242-result-2026",
    title: "KPSC Commercial Tax Inspector (CTI 242 Posts) Provisional 1:2 Verification List & Cutoff",
    shortTitle: "KPSC CTI 242 Posts Merit List",
    organization: "Karnataka Public Service Commission",
    orgShortCode: "KPSC",
    stateSlug: "karnataka",
    isCentral: false,
    category: "Administrative / PSC",
    totalVacancies: 242,
    qualifications: ["Bachelor's Degree in Commerce, Arts, Science, Business Management, or Law"],
    minAge: 18,
    maxAge: 35,
    ageRelaxation: "2A/2B/3A/3B: 38 Years | SC/ST/Cat-1: 40 Years",
    salary: "Pay Matrix Level ₹33,450 - ₹62,600",
    applicationStartDate: "2026-03-10",
    applicationEndDate: "2026-04-12",
    examDate: "July 2026",
    resultDate: "Provisional 1:2 Merit List & Cut-off Published",
    status: "RESULT_OUT",
    officialPdfUrl: "https://kpsc.kar.nic.in",
    applyOnlineUrl: "https://kpsc.kar.nic.in",
    applicationFee: { ur_obc_ews: 600, sc_st: 300 },
    selectionProcess: [
      "Competitive Written Exam (Paper 1 & Paper 2)",
      "Document Verification at KPSC Udyoga Soudha, Bengaluru"
    ],
    keyHighlights: [
      "Commercial Taxes Department 242 CTI Inspector posts across Karnataka divisions",
      "Provisional 1:2 verification list and cut-off marks published on KPSC portal",
      "Verification scheduled at KPSC Central Office Bengaluru"
    ],
    syllabusSummary: "Paper 1: General Knowledge, Karnataka History, Constitution, Economy (100 marks). Paper 2: Communication & Computer Literacy (100 marks).",
    viewsCount: 71200,
    featured: true,
  },
  {
    id: "kpsc-group-b-121-posts",
    slug: "kpsc-group-b-gazetted-technical-recruitment-2026",
    title: "KPSC Group B Technical & Administrative Recruitment (121 Posts) in 13 Departments",
    shortTitle: "KPSC Group B 121 Posts",
    organization: "Karnataka Public Service Commission",
    orgShortCode: "KPSC",
    stateSlug: "karnataka",
    isCentral: false,
    category: "Engineering / Technical",
    totalVacancies: 121,
    qualifications: ["Degree in Engineering / Geology / Town Planning / Relevant Discipline"],
    minAge: 18,
    maxAge: 35,
    ageRelaxation: "Cat-2A/2B/3A/3B: 38 Years | SC/ST/Cat-1: 40 Years",
    salary: "Pay Matrix ₹43,100 - ₹83,900 (Group B)",
    applicationStartDate: "2026-10-08",
    applicationEndDate: "2026-11-20",
    examDate: "January 2027",
    status: "APPLY_OPEN",
    officialPdfUrl: "https://kpsc.kar.nic.in",
    applyOnlineUrl: "https://kpsc.kar.nic.in",
    applicationFee: { ur_obc_ews: 600, sc_st: 300 },
    selectionProcess: [
      "Kannada Language Compulsory Test",
      "Competitive Written Examination (Objective / Subject Paper)",
      "Document Verification"
    ],
    keyHighlights: [
      "121 Group B vacancies across 13 Karnataka State Departments (Town Planning, Mines & Geology, PWD)",
      "Notification released 8 October 2026 on KPSC official website",
      "Application window active"
    ],
    syllabusSummary: "Paper 1: General Studies (100 Marks). Paper 2: Specific Technical Subject Paper (100 Marks).",
    viewsCount: 39800,
    featured: false,
  },
];

export function getJobsByState(stateSlug: string, includeCentral = true): JobNotification[] {
  if (stateSlug === "central" || stateSlug === "all") {
    return SAMPLE_JOBS;
  }
  const stateJobs = SAMPLE_JOBS.filter(
    (job) => job.stateSlug.toLowerCase() === stateSlug.toLowerCase()
  );
  if (includeCentral) {
    const centralJobs = SAMPLE_JOBS.filter((job) => job.isCentral);
    return [...stateJobs, ...centralJobs];
  }
  return stateJobs;
}

export function getJobBySlug(slug: string): JobNotification | undefined {
  return SAMPLE_JOBS.find(
    (job) => job.slug.toLowerCase() === slug.toLowerCase()
  );
}

export function getRecentJobAlerts(limit = 6): JobNotification[] {
  return [...SAMPLE_JOBS]
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

