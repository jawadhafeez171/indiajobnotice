import { JobNotification, SAMPLE_JOBS } from "./jobs";
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
  eligibilityGuidance: {
    minimumQualification: string;
    typicalAgeLimit: string;
    ageRelaxations: string;
    keyDocumentsRequired: string[];
    selectionRounds: string[];
    expertTips: string[];
  };
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
    subtitle: "Verified Central & State Government Recruitment Notifications for 10+2 Intermediate Candidates",
    metaDescription: "Find all government jobs for 12th pass candidates in 2026. SSC CHSL, Railway NTPC, Police Constable, Defense, Coast Guard & Postal vacancies with age limits, syllabus and application links.",
    badge: "10+2 Intermediate",
    canonicalPath: "/qualification/12th-pass",
    overview: "Passing 10+2 (Higher Secondary) unlocks premier career opportunities across Central Armed Police Forces (SSC GD, BSF, CISF), Indian Army & Air Force (NDA), Indian Railways (NTPC Under-Graduate), Staff Selection Commission (CHSL Lower Division Clerk & Data Entry Operator), and state police departments.",
    eligibilityGuidance: {
      minimumQualification: "Senior Secondary (10+2) certificate from an AICTE / COBSE recognized State or Central Board (CBSE / ICSE / NIOS).",
      typicalAgeLimit: "18 to 25 / 27 Years (Relaxable for reserved categories). Defense entries (NDA) range from 16.5 to 19.5 years.",
      ageRelaxations: "OBC: +3 Years | SC/ST: +5 Years | Ex-Servicemen: Military service duration + 3 years.",
      keyDocumentsRequired: [
        "10th Marksheet (as primary proof of Date of Birth)",
        "12th Pass Certificate & Marksheet",
        "Valid Category Certificate (OBC-NCL / SC / ST / EWS) in Government of India format",
        "Aadhaar Card or Government Issued Photo ID",
        "Basic Computer Knowledge or Typing Certificate (for LDC/DEO positions)",
      ],
      selectionRounds: [
        "Tier-1 Computer Based Objective Test (General Intelligence, Math, English, General Awareness)",
        "Physical Standard Test (PST) & Physical Endurance Test (PET) for Defense/Police drives",
        "Typing Speed Test (35 wpm English / 30 wpm Hindi) for Clerical / Postal positions",
        "Document Verification & Detailed Medical Examination (DME)",
      ],
      expertTips: [
        "Ensure your name and father's name exactly match between your 10th marksheet and Aadhaar card.",
        "For police and defense vacancies, start physical conditioning (5 km run for males, 1.6 km for females) well in advance of CBT results.",
      ],
    },
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
    subtitle: "Verified Technical & Engineering Circulars for 3-Year Polytechnic Diploma Holders",
    metaDescription: "Apply for Diploma Govt Jobs 2026. RRB Junior Engineer (JE), State PSC Assistant / Junior Engineers, DRDO, ISRO, and PSU recruitment with branch-wise eligibility and syllabus.",
    badge: "Polytechnic / Diploma",
    canonicalPath: "/qualification/diploma",
    overview: "3-Year Engineering Diplomas (Civil, Mechanical, Electrical, Electronics, Computer Science) from recognized State Technical Education Boards qualify aspirants for Junior Engineer (JE) Group B & C technical cadres in Indian Railways, CPWD, MES, and State Public Works Departments.",
    eligibilityGuidance: {
      minimumQualification: "Full-time 3-Year Diploma in Engineering in relevant branch approved by AICTE or State Board of Technical Education (BTE).",
      typicalAgeLimit: "18 to 33 / 36 Years (including standard government age allowances).",
      ageRelaxations: "OBC: +3 Years | SC/ST: +5 Years | PwBD: +10 Years.",
      keyDocumentsRequired: [
        "Diploma Passing Certificate & All Semester Marksheets",
        "High School Board Certificate (DOB proof)",
        "Caste / Income Asset Certificate (if claiming reservation)",
        "Apprenticeship Certificate (NACC / NAC) if specified for technician positions",
      ],
      selectionRounds: [
        "Stage 1 CBT: General Science, Math, Reasoning, and General Awareness",
        "Stage 2 CBT: Specialized Technical Engineering Core Subject Test (100-150 marks)",
        "Medical Fitness Examination (specifically A3 / B1 eye standards for Railway safety posts)",
      ],
      expertTips: [
        "Distance education diplomas in core engineering (Civil, Electrical, Mech) are typically not recognized for public service commission JE posts.",
        "Revise fundamental engineering formulas and State technical board textbooks alongside standard general awareness.",
      ],
    },
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
    subtitle: "Verified High School & Matric Recruitment Notifications Across Central & State Departments",
    metaDescription: "Latest 10th pass government jobs in 2026. SSC GD Constable, Railway Group D, SSC MTS, Havaldar, and India Post GDS circulars with minimum age, salary, and direct application links.",
    badge: "10th High School",
    canonicalPath: "/qualification/10th-pass",
    overview: "High School (10th Standard / Matriculation) is the gateway qualification for India's largest recruitment drives, including SSC GD Constable (39,000+ posts), Railway Group D Level-1 (1,00,000+ posts), SSC MTS Non-Technical, and India Post Gramin Dak Sevaks (GDS).",
    eligibilityGuidance: {
      minimumQualification: "10th Standard / SSLC / Matriculation pass from any recognized Central (CBSE / ICSE) or State Education Board.",
      typicalAgeLimit: "18 to 23 Years for GD Constable; 18 to 27 / 33 Years for MTS, Group D, and Postal GDS.",
      ageRelaxations: "OBC: +3 Years | SC/ST: +5 Years | PwBD: +10 Years | Ex-Servicemen: Statutory military deduction.",
      keyDocumentsRequired: [
        "Original 10th Board Certificate showing Marks and Date of Birth",
        "Active Mobile Number and Email ID for OTR registration",
        "Recent Passport Photograph with white background",
        "Caste Certificate issued by designated Tehsildar / Sub-Divisional Officer",
      ],
      selectionRounds: [
        "Single-tier Computer Based Test (CBT) covering Math, Reasoning, Hindi/English & GK",
        "Physical Fitness / Endurance Run for Uniformed services",
        "Merit list formulation (India Post GDS is purely 10th marks merit-based without written exam)",
      ],
      expertTips: [
        "Ensure your 10th certificate roll number and board name are entered error-free during One-Time Registration (OTR).",
        "For Railway Level-1 and SSC MTS, practicing previous years' bilingual question papers yields high accuracy.",
      ],
    },
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
    subtitle: "Verified Gazette Circulars for B.A., B.Sc., B.Com., B.E./B.Tech & Degree Holders",
    metaDescription: "Apply for Graduate Government Jobs 2026. UPSC Civil Services (IAS/IPS), SSC CGL, SBI & IBPS Probationary Officers (PO), Railway RRB NTPC Graduate, and State Public Service Commissions.",
    badge: "Bachelor's Degree",
    canonicalPath: "/qualification/graduate",
    overview: "A Bachelor's Degree in any discipline from a recognized University qualifies candidates for India's most prestigious Grade A and Grade B administrative posts, including IAS, IPS, Income Tax Inspector, Assistant Section Officer, Bank PO, and Railway Station Master.",
    eligibilityGuidance: {
      minimumQualification: "Bachelor's Degree (Graduation) in any stream from a UGC recognized University. Final year students are eligible for UPSC CSE / IBPS subject to producing degree before interview.",
      typicalAgeLimit: "21 to 32 Years for UPSC CSE; 18/20 to 30/32 Years for SSC CGL; 20 to 30 Years for Bank PO.",
      ageRelaxations: "OBC: +3 Years | SC/ST: +5 Years | PwBD: +10 Years.",
      keyDocumentsRequired: [
        "Degree Convocation Certificate or Provisional Degree Certificate",
        "Consolidated Final Year Marksheet",
        "Valid Category Certificate (OBC-NCL / EWS / SC / ST)",
        "Signature and Photo scans as per exact pixel guidelines",
      ],
      selectionRounds: [
        "Preliminary Screening Exam (Objective Multiple Choice)",
        "Mains Examination (Subjective / Descriptive or Advanced Objective CBT)",
        "Interview / Personality Test (for UPSC, State PSCs & Bank PO)",
      ],
      expertTips: [
        "Focus on building deep conceptual clarity in General Studies and Quantitative Aptitude.",
        "Check cutoff marks from previous years to understand target qualifying percentiles.",
      ],
    },
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
    subtitle: "Verified Technical, Assistant Engineer (AE) & Junior Engineer (JE) Gazette Notices",
    metaDescription: "Explore Government Engineering Jobs in 2026. Railway RRB JE, State PSC Assistant Engineers, PSUs (IOCL, NTPC, BHEL), Defense DRDO & ISRO notifications with branch eligibility and exam patterns.",
    badge: "Engineering & Technical",
    canonicalPath: "/engineering-jobs",
    overview: "Engineering recruitments represent premier technical opportunities across Indian Railways, CPWD, Military Engineer Services (MES), Border Roads Organisation (BRO), and State Electricity Boards. Positions range from Junior Engineer (Pay Level 6) to Executive Engineer (Pay Level 10/11).",
    eligibilityGuidance: {
      minimumQualification: "B.Tech / B.E. or 3-Year Polytechnic Diploma in Civil, Electrical, Mechanical, Electronics, or Computer Engineering from an AICTE recognized institution.",
      typicalAgeLimit: "18 to 33 / 36 Years.",
      ageRelaxations: "OBC: 3 Years | SC/ST: 5 Years | PwD: 10 Years.",
      keyDocumentsRequired: [
        "Degree / Diploma Certificate and Grade Cards",
        "GATE Scorecard (where recruitment is GATE-based for PSUs)",
        "Category and EWS Certificates",
      ],
      selectionRounds: [
        "Stage 1 Non-Technical CBT (Aptitude, Reasoning, General Awareness)",
        "Stage 2 Technical Domain CBT (Branch specific 100-150 Questions)",
        "Document Verification & Medical Suitability",
      ],
      expertTips: [
        "Master the standard engineering code provisions (e.g. IS 456 for Civil, IEEE for Electrical).",
        "Technical cutoff trends favor candidates with strong fundamentals in core engineering subjects.",
      ],
    },
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
    subtitle: "Official Circulars for Central Armed Police Forces (CAPF), Defense Services & State Police",
    metaDescription: "All Police and Defense jobs 2026. SSC GD Constable, NDA, CDS, CAPF AC, UP Police Constable, and Indian Coast Guard notifications with PET/PST criteria and physical standards.",
    badge: "Uniformed Services",
    canonicalPath: "/police-defense-jobs",
    overview: "Uniformed service recruitments offer valor, stability, and direct service to the nation. Drives encompass Central Paramilitary Forces (BSF, CISF, CRPF, ITBP, SSB), Armed Forces (NDA, CDS, AFCAT), and state police constable/sub-inspector positions.",
    eligibilityGuidance: {
      minimumQualification: "10th Pass (GD Constable), 12th Pass (Police Constable, NDA), or Graduation (CDS, CAPF Assistant Commandant, Sub-Inspector).",
      typicalAgeLimit: "18 to 23 / 25 / 27 Years.",
      ageRelaxations: "OBC: 3 Years | SC/ST: 5 Years | Ex-Servicemen: Service years + 3 years.",
      keyDocumentsRequired: [
        "10th Marksheet (mandatory DOB proof)",
        "Educational Qualification Certificates",
        "Valid Domicile / Permanent Residence Certificate for State Police drives",
        "Category Certificate in prescribed format",
      ],
      selectionRounds: [
        "Written CBT / OMR Examination",
        "Physical Standard Test (Height & Chest measurement)",
        "Physical Efficiency Test (timed running & high/long jump)",
        "Detailed Medical Examination (DME) for visual acuity and orthopedic fitness",
      ],
      expertTips: [
        "Height standards are strictly non-negotiable (typically 170 cm for males, 157 cm for females with regional hill-area relaxations).",
        "Practice endurance running on natural tracks to avoid shin splints before PET.",
      ],
    },
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
    subtitle: "Official Notifications & Exam Schedules Across 21 Railway Recruitment Boards",
    metaDescription: "Check all Railway RRB jobs in 2026. RRB NTPC (11,558 posts), Group D (1,03,769 posts), Assistant Loco Pilot (ALP 18,799 posts), and Junior Engineer with syllabus and application dates.",
    badge: "Indian Railways",
    canonicalPath: "/railway-jobs",
    overview: "Indian Railways is one of the world's largest employers. Standardized annual recruitment calendars now systematically conduct drives for Assistant Loco Pilots (ALP), Technicians, Junior Engineers (JE), Non-Technical Popular Categories (NTPC), and Level-1 Group D staff.",
    eligibilityGuidance: {
      minimumQualification: "10th Pass, ITI, 12th Intermediate, Polytechnic Diploma, or Bachelor's Degree depending on the specific CEN post.",
      typicalAgeLimit: "18 to 33 / 36 Years (includes 3-year special pandemic concession).",
      ageRelaxations: "OBC: 3 Years | SC/ST: 5 Years | PwBD: 10 Years.",
      keyDocumentsRequired: [
        "Matriculation Certificate for DOB verification",
        "Relevant Technical Trade / Academic Certificate",
        "Community / Caste Certificate (SC/ST/OBC-NCL/EWS)",
        "Bank Account Details (required for application fee refund upon attending CBT 1)",
      ],
      selectionRounds: [
        "Computer Based Test 1 (Screening Test)",
        "Computer Based Test 2 (Merit Determination)",
        "Skill Test (Typing Test / Computer Based Aptitude Test for Station Master / ALP)",
        "Document Verification & Strict Railway Medical Classification (A1/A2/A3/B1/B2/C1)",
      ],
      expertTips: [
        "A1 Medical Standard for ALP requires 6/6 distance vision without glasses; laser surgery is strictly disqualifying.",
        "Application fee is partially refunded directly to your bank account after attending CBT-1.",
      ],
    },
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
    subtitle: "Verified Recruitment Circulars for State Bank of India, Public Sector Banks & RBI",
    metaDescription: "Apply for Bank Jobs 2026. SBI PO, SBI Clerk, IBPS PO, IBPS Clerk, RRB Office Assistant, and RBI Grade B notifications with vacancy tables, syllabus, and exam dates.",
    badge: "Banking & Finance",
    canonicalPath: "/banking-jobs",
    overview: "Public sector banking offers structured career progression, competitive pay with dearness allowance, and nationwide branch opportunities. Drives are conducted primarily by the State Bank of India (SBI) and the Institute of Banking Personnel Selection (IBPS).",
    eligibilityGuidance: {
      minimumQualification: "Bachelor's Degree in any discipline from a recognized University. Final semester students can apply for select PO drives.",
      typicalAgeLimit: "20 to 28 Years for Clerks; 21 to 30 Years for Probationary Officers; 21 to 30 Years for RBI Grade B.",
      ageRelaxations: "OBC: 3 Years | SC/ST: 5 Years | PwD: 10 Years.",
      keyDocumentsRequired: [
        "Graduation Degree Certificate & Consolidated Marks Card",
        "Valid Photo Identity Proof (PAN / Aadhaar / Passport)",
        "Left Thumb Impression and Hand-written Declaration in prescribed format",
      ],
      selectionRounds: [
        "Preliminary Examination (100 Marks: English, Quant, Reasoning in 60 minutes)",
        "Main Examination (Objective + Descriptive English Essay & Letter)",
        "Group Exercise & Interview (for PO / Officer scale positions)",
      ],
      expertTips: [
        "Speed and accuracy are vital; practice daily sectional mocks with a strict 20-minute timer.",
        "Maintain a healthy credit history (CIBIL score above 650 is mandatory for SBI joining).",
      ],
    },
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
    subtitle: "Verified Vacancies for PRT, TGT, PGT Teachers, Lecturers & Central School Educators",
    metaDescription: "Find Government Teaching Jobs in 2026. Central Teacher Eligibility Test (CTET), Kendriya Vidyalaya (KVS), Navodaya (NVS), DSSSB, and State PSC Lecturer circulars.",
    badge: "Education & Teaching",
    canonicalPath: "/teaching-jobs",
    overview: "Teaching careers in government institutions provide distinguished societal standing, attractive 7th Pay Commission salary matrices, and long-term security across Primary (PRT), Trained Graduate (TGT), and Post Graduate (PGT) levels.",
    eligibilityGuidance: {
      minimumQualification: "D.El.Ed / B.Ed with 50% marks alongside a qualified CTET / State TET certificate for PRT/TGT. Master's degree in subject + B.Ed for PGT.",
      typicalAgeLimit: "PRT: Up to 30 Years; TGT: Up to 35 Years; PGT: Up to 40 Years (Women candidates often receive 10 years age relaxation in KVS/DSSSB).",
      ageRelaxations: "OBC: 3 Years | SC/ST: 5 Years | Women: Up to 10 Years for select schools.",
      keyDocumentsRequired: [
        "B.Ed / D.El.Ed Degree and Marksheets from NCTE approved institution",
        "CTET Paper-1 / Paper-2 Certificate from DigiLocker",
        "Graduation / Post Graduation Degree with specified minimum percentages",
      ],
      selectionRounds: [
        "Written CBT / Pen-Paper Examination",
        "Classroom Teaching Demo / Interview Round (for KVS / NVS / Assistant Professor)",
        "Verification of Teaching Credentials",
      ],
      expertTips: [
        "Ensure your B.Ed college has active NCTE recognition during the years you were enrolled.",
        "CTET certificate now has lifetime validity, saving candidates from re-appearing every few years.",
      ],
    },
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
    subtitle: "Official Employment Gazettes, Calendars & Notification Circulars Issued by SSC",
    metaDescription: "Complete guide to Staff Selection Commission (SSC) jobs in 2026. Latest notifications for SSC CGL, CHSL, GD Constable, MTS, CPO SI, and Stenographer with syllabus and apply links.",
    badge: "Staff Selection Commission",
    canonicalPath: "/organisations/ssc",
    overview: "The Staff Selection Commission (SSC) conducts recruitment for Group B and Group C non-technical and technical posts across ministries and departments of the Government of India, appointing over 1,00,000 personnel annually.",
    eligibilityGuidance: {
      minimumQualification: "10th Pass (MTS, GD Constable), 12th Pass (CHSL, Stenographer), or Bachelor's Degree (CGL, CPO SI).",
      typicalAgeLimit: "18 to 27 / 30 / 32 Years depending on the specific exam.",
      ageRelaxations: "OBC: 3 Years | SC/ST: 5 Years | PwD: 10 Years.",
      keyDocumentsRequired: [
        "OTR Registration ID from the new SSC portal (ssc.gov.in)",
        "Live Web-Camera Photograph captured during the application process",
        "Scanned signature (10-20 KB in JPEG format)",
      ],
      selectionRounds: [
        "Computer Based Examination (Tier 1 & Tier 2)",
        "Skill / Typing Test (for Clerical & Steno positions)",
        "Physical Tests for GD Constable & Sub-Inspectors",
      ],
      expertTips: [
        "SSC's new portal (ssc.gov.in) requires live webcam capture; ensure plain background and good lighting when applying.",
        "OTR registration details must strictly match your 10th matriculation certificate.",
      ],
    },
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
    subtitle: "Official Notifications, Prelims Dates & Circulars Issued by UPSC at Dholpur House",
    metaDescription: "Apply for UPSC Examinations 2026. Civil Services IAS/IPS, NDA, CDS, CAPF Assistant Commandant, and Indian Forest Service notices with detailed syllabus, eligibility and calendar.",
    badge: "Union Public Service Commission",
    canonicalPath: "/organisations/upsc",
    overview: "The Union Public Service Commission is India's premier constitutional recruiting agency for All India Services (IAS, IPS, IFS) and Central Group A & B Civil and Defense services.",
    eligibilityGuidance: {
      minimumQualification: "Bachelor's Degree for CSE and CDS; 12th Pass for NDA & NA.",
      typicalAgeLimit: "21 to 32 Years for CSE (General); 16.5 to 19.5 for NDA.",
      ageRelaxations: "OBC: 3 Years (9 attempts) | SC/ST: 5 Years (Unlimited attempts) | PwBD: 10 Years.",
      keyDocumentsRequired: [
        "UPSC OTR (One Time Registration) Profile",
        "Graduation Degree / Final Year Enrollment Certificate",
        "Valid Category and Disability certificates (if applicable)",
      ],
      selectionRounds: [
        "Preliminary Examination (Negative marking: 1/3rd of allotted marks)",
        "Main Written Examination (Descriptive Essay & GS Papers)",
        "Personality Test / Interview at Dholpur House, New Delhi",
      ],
      expertTips: [
        "CSAT (Paper 2) in Prelims is mandatory qualifying with 33% marks (66 out of 200).",
        "Detailed Application Form (DAF) submitted for Mains is thoroughly scrutinized during the interview round.",
      ],
    },
    filterPredicate: (job: JobNotification) => {
      return (
        job.orgShortCode.toUpperCase() === "UPSC" ||
        job.organization.toLowerCase().includes("union public service")
      );
    },
  },
  {
    slug: "railways-rrb",
    title: "RRB Recruitment 2026 - Indian Railways Centralized Employment Notices",
    h1: "Railway Recruitment Boards (RRB) 2026",
    subtitle: "Centralized Employment Notices (CEN) Across All 21 Zonal Railway Boards",
    metaDescription: "Explore all Railway Recruitment Board (RRB) circulars 2026. NTPC, ALP, Group D, Technician, and Junior Engineer vacancies with official application dates and test patterns.",
    badge: "Railway Recruitment Boards",
    canonicalPath: "/organisations/railways-rrb",
    overview: "Railway Recruitment Boards (RRB) execute massive national drives for technical and non-technical staff across 17 Railway Zones. Applications are managed centrally through rrbapply.gov.in.",
    eligibilityGuidance: {
      minimumQualification: "10th Pass, ITI, Diploma, or Graduate degree depending on the CEN.",
      typicalAgeLimit: "18 to 33 / 36 Years.",
      ageRelaxations: "OBC: 3 Years | SC/ST: 5 Years | PwBD: 10 Years.",
      keyDocumentsRequired: [
        "Active Bank Account in Candidate's name (for examination fee refund)",
        "Trade / Academic Certificates",
        "Valid Category Certificate in Central Railway format",
      ],
      selectionRounds: [
        "Stage 1 CBT (Computer Based Test)",
        "Stage 2 CBT (Technical or Merit)",
        "Aptitude Test / Typing Test",
        "Railway Medical Fitness Test",
      ],
      expertTips: [
        "Railway medical standards (A1, A2, B1) are very strict; read the medical manual before applying for running cadres.",
      ],
    },
    filterPredicate: (job: JobNotification) => {
      return (
        job.orgShortCode.toUpperCase() === "RRB" ||
        job.organization.toLowerCase().includes("railway")
      );
    },
  },
  {
    slug: "banking-ibps",
    title: "IBPS Recruitment 2026 - Bank PO, Clerk, Specialist Officer & RRBs",
    h1: "Institute of Banking Personnel Selection (IBPS) 2026",
    subtitle: "Centralized Common Recruitment Process (CRP) for 11 Participating Public Sector Banks",
    metaDescription: "Apply for IBPS Bank Exams 2026. IBPS PO, Clerk, SO, and Regional Rural Bank (RRB Office Assistant & Scale I/II/III) circulars with syllabus, cutoffs, and exam schedules.",
    badge: "IBPS Banking",
    canonicalPath: "/organisations/banking-ibps",
    overview: "IBPS conducts standardized Common Recruitment Processes (CRP) for 11 Public Sector Banks across India (including Bank of Baroda, PNB, Canara Bank, and Union Bank of India).",
    eligibilityGuidance: {
      minimumQualification: "Bachelor's Degree in any discipline from a recognized University.",
      typicalAgeLimit: "20 to 28 Years (Clerk); 20 to 30 Years (PO).",
      ageRelaxations: "OBC: 3 Years | SC/ST: 5 Years | PwD: 10 Years.",
      keyDocumentsRequired: [
        "Degree Certificate / Marksheets",
        "Photo and Thumb Impression with specific pixel constraints",
        "Hand-written declaration verbatim as specified in notification",
      ],
      selectionRounds: [
        "Preliminary Online Exam (100 Marks)",
        "Main Online Exam (with Descriptive Test for PO)",
        "Interview for Officer Cadres",
      ],
      expertTips: [
        "Sectional cutoff applies in both Prelims and Mains; do not neglect any single subject.",
      ],
    },
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
    subtitle: "Official Circulars for PO, Junior Associates & Specialist Officers in India's Largest Bank",
    metaDescription: "Latest SBI Bank Jobs 2026. State Bank of India PO, Junior Associate (Clerk), and Specialist Cadre Officer circulars with eligibility, pay scale, and online application links.",
    badge: "State Bank of India",
    canonicalPath: "/organisations/sbi",
    overview: "State Bank of India (SBI), a Fortune 500 entity, conducts its own independent examinations for Probationary Officers (PO) and Junior Associates (Customer Support & Sales), offering the highest entry-level compensation packages in Indian banking.",
    eligibilityGuidance: {
      minimumQualification: "Graduation in any discipline from a recognized University.",
      typicalAgeLimit: "20 to 28 Years (Clerk); 21 to 30 Years (PO).",
      ageRelaxations: "OBC: 3 Years | SC/ST: 5 Years | PwD: 10 Years.",
      keyDocumentsRequired: [
        "Degree Certificate",
        "Identity Proof and Caste Certificates",
        "Satisfactory CIBIL credit score of 650 or higher",
      ],
      selectionRounds: [
        "Phase-I: Preliminary Examination (100 Marks)",
        "Phase-II: Main Examination + Descriptive Test",
        "Phase-III: Psychometric Test + Group Discussion + Personal Interview",
      ],
      expertTips: [
        "SBI PO has no sectional cutoffs in Prelims or Mains, allowing candidates to maximize overall composite scores.",
      ],
    },
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

export function getJobsForHub(hub: CategoryHubInfo): JobNotification[] {
  return SAMPLE_JOBS.filter(hub.filterPredicate);
}
