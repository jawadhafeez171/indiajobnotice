import { JobNotification, formatAgeRange } from "@/data/jobs";

export interface ExamStageSubject {
  name: string;
  questions: number;
  marks: number;
  durationMinutes?: number;
}

export interface ExamStage {
  stageName: string;
  mode: string; // e.g., "Computer Based Test (CBT)", "Offline (OMR Sheet)", "Physical Test"
  totalQuestions: number;
  totalMarks: number;
  duration: string;
  negativeMarking?: string;
  qualifyingCriteria?: string;
  subjects: ExamStageSubject[];
}

export interface PhysicalStandards {
  heightMale?: string;
  heightFemale?: string;
  chestMale?: string;
  runningMale?: string;
  runningFemale?: string;
  shotPut?: string;
  highJump?: string;
  otherCriteria?: string;
}

export interface CutoffBenchmark {
  year: string;
  category: string; // UR, OBC, EWS, SC, ST
  score: string;
  maxMarks: string;
}

export interface SyllabusSubjectSection {
  subject: string;
  topics: string[];
}

export interface PostVacancyBreakdown {
  postName: string;
  department: string;
  vacancies: number | string;
  qualification: string;
  ageLimit: string;
  payLevel: string;
}

export interface AgeReckoningInfo {
  crucialDate: string;
  minAge: number;
  maxAge: number;
  bornBetween: string;
  specialClauses?: string;
}

export interface CategoryStatutoryMatrixItem {
  category: string;
  code: string;
  fee: string;
  ageRelaxation: string;
  maxEligibleAge: string;
  exemptionNote?: string;
}

export interface CorrigendumNotice {
  noticeDate: string;
  type: "Extension" | "Corrigendum" | "Correction Window" | "Vacancy Revision";
  headline: string;
  details: string;
  officialGazetteRef?: string;
}

export interface PayBreakdown {
  payLevel: string;
  basicPay: string;
  inHandEstimated: string;
  allowances: string[];
}

// Curated data for major recruitment examinations
const EXAM_DATA_REGISTRY: Record<
  string,
  {
    stages: ExamStage[];
    physical?: PhysicalStandards;
    cutoffs: CutoffBenchmark[];
    syllabus: SyllabusSubjectSection[];
  }
> = {
  "upsc-cse-2026": {
    stages: [
      {
        stageName: "Stage 1: Civil Services Preliminary Examination (Screening)",
        mode: "Offline (OMR Sheet)",
        totalQuestions: 180,
        totalMarks: 400,
        duration: "2 Hours per Paper (Morning & Afternoon)",
        negativeMarking: "1/3rd (0.33%) deducted for each incorrect MCQ",
        qualifyingCriteria: "Paper-2 (CSAT) mandatory 33% qualifying. Merit for Mains based strictly on Paper-1 GS.",
        subjects: [
          { name: "Paper-1: General Studies (History, Polity, Geography, Economy, Env, Current)", questions: 100, marks: 200, durationMinutes: 120 },
          { name: "Paper-2: CSAT (Comprehension, Reasoning, Basic Numeracy - 33% Qualifying)", questions: 80, marks: 200, durationMinutes: 120 },
        ],
      },
      {
        stageName: "Stage 2: Civil Services Main Examination (Written Descriptive)",
        mode: "Descriptive (Subjective Pen-Paper)",
        totalQuestions: 9,
        totalMarks: 1750,
        duration: "3 Hours each Paper (5 Days)",
        negativeMarking: "Subjective Evaluation",
        qualifyingCriteria: "Papers A & B (Languages) qualifying (25%). Merit computed out of 1750 marks across 7 ranking papers.",
        subjects: [
          { name: "Paper A: Indian Language (Qualifying - 300M)", questions: 6, marks: 300 },
          { name: "Paper B: English Language (Qualifying - 300M)", questions: 5, marks: 300 },
          { name: "Paper I: Essay Paper (Two 1000-1200 word essays)", questions: 2, marks: 250 },
          { name: "Paper II: General Studies I (Heritage, Culture, History & Geography)", questions: 20, marks: 250 },
          { name: "Paper III: General Studies II (Governance, Constitution, Polity, Social Justice & IR)", questions: 20, marks: 250 },
          { name: "Paper IV: General Studies III (Technology, Economic Development, Biodiversity, Security)", questions: 20, marks: 250 },
          { name: "Paper V: General Studies IV (Ethics, Integrity and Aptitude)", questions: 12, marks: 250 },
          { name: "Paper VI: Optional Subject Paper 1", questions: 5, marks: 250 },
          { name: "Paper VII: Optional Subject Paper 2", questions: 5, marks: 250 },
        ],
      },
      {
        stageName: "Stage 3: Personality Test / Interview (Dholpur House)",
        mode: "UPSC Board Interview",
        totalQuestions: 0,
        totalMarks: 275,
        duration: "30 to 45 Minutes",
        qualifyingCriteria: "Grand Total computed out of 2025 Marks (1750 Mains + 275 Interview) for IAS/IPS cadre allotment.",
        subjects: [
          { name: "Board Assessment: Intellectual integrity, mental caliber, leadership & administrative judgment", questions: 0, marks: 275 },
        ],
      },
    ],
    cutoffs: [
      { year: "2023 Final (Prelims)", category: "General (UR)", score: "75.41", maxMarks: "200" },
      { year: "2023 Final (Prelims)", category: "EWS", score: "68.02", maxMarks: "200" },
      { year: "2023 Final (Prelims)", category: "OBC", score: "74.75", maxMarks: "200" },
      { year: "2023 Final (Prelims)", category: "SC", score: "59.25", maxMarks: "200" },
      { year: "2023 Final (Prelims)", category: "ST", score: "47.82", maxMarks: "200" },
    ],
    syllabus: [
      {
        subject: "General Studies Paper-1 (Prelims)",
        topics: [
          "Current Events of National and International Importance",
          "History of India and Indian National Movement",
          "Indian and World Geography - Physical, Social, Economic Geography of India and the World",
          "Indian Polity and Governance - Constitution, Political System, Panchayati Raj, Public Policy, Rights Issues",
          "Economic and Social Development - Sustainable Development, Poverty, Inclusion, Demographics, Social Sector Initiatives",
          "General issues on Environmental Ecology, Bio-diversity and Climate Change",
        ],
      },
      {
        subject: "Civil Services Aptitude Test (CSAT)",
        topics: [
          "Reading Comprehension & Interpersonal Skills",
          "Logical Reasoning and Analytical Ability",
          "Decision-making and Problem-solving",
          "General Mental Ability & Basic Numeracy (Numbers and their relations, Orders of magnitude up to Class X)",
          "Data Interpretation (Charts, graphs, tables, data sufficiency up to Class X)",
        ],
      },
    ],
  },
  "ssc-gd-constable-2026": {
    stages: [
      {
        stageName: "Stage 1: Computer Based Examination (CBE 160 Marks)",
        mode: "Online (CBT)",
        totalQuestions: 80,
        totalMarks: 160,
        duration: "60 Minutes",
        negativeMarking: "0.25 marks deducted for each wrong answer (+2 for correct)",
        qualifyingCriteria: "Shortlisted candidates (8 times vacancies) called for PST & PET round",
        subjects: [
          { name: "Part A: General Intelligence & Reasoning", questions: 20, marks: 40 },
          { name: "Part B: General Knowledge & General Awareness", questions: 20, marks: 40 },
          { name: "Part C: Elementary Mathematics", questions: 20, marks: 40 },
          { name: "Part D: English OR Hindi (Language choice)", questions: 20, marks: 40 },
        ],
      },
      {
        stageName: "Stage 2: Physical Standard Test (PST) & Physical Efficiency Test (PET)",
        mode: "Ground Field Race & Measurements",
        totalQuestions: 0,
        totalMarks: 0,
        duration: "Standard timing on race ground",
        qualifyingCriteria: "Must qualify running endurance within prescribed time limits",
        subjects: [
          { name: "Male Running: 5 km race in 24 minutes", questions: 1, marks: 0 },
          { name: "Female Running: 1.6 km race in 8.5 minutes", questions: 1, marks: 0 },
        ],
      },
      {
        stageName: "Stage 3: Detailed Medical Examination (DME) & Document Verification",
        mode: "CAPF Medical Board Verification",
        totalQuestions: 0,
        totalMarks: 0,
        duration: "Hospital Board",
        qualifyingCriteria: "Eye vision minimum 6/6 & 6/9 without glasses, no color blindness, orthopedic check",
        subjects: [],
      },
    ],
    physical: {
      heightMale: "170 cm (162.5 cm for ST; 165 cm for North-East & Hill tribes)",
      heightFemale: "157 cm (150 cm for ST; 152.5 cm for Hill tribes)",
      chestMale: "80 cm unexpanded with minimum 5 cm expansion (76 cm for ST)",
      runningMale: "5 km within 24 Minutes (Qualifying)",
      runningFemale: "1.6 km within 8.5 Minutes (Qualifying)",
      otherCriteria: "Proportionate weight to height and age as per medical standards. Tattoos on salute arm prohibited.",
    },
    cutoffs: [
      { year: "Previous Cycle (SSB/CISF GD)", category: "UR (All-India)", score: "138.50", maxMarks: "160" },
      { year: "Previous Cycle (SSB/CISF GD)", category: "OBC", score: "135.20", maxMarks: "160" },
      { year: "Previous Cycle (SSB/CISF GD)", category: "EWS", score: "132.80", maxMarks: "160" },
      { year: "Previous Cycle (SSB/CISF GD)", category: "SC", score: "123.40", maxMarks: "160" },
      { year: "Previous Cycle (SSB/CISF GD)", category: "ST", score: "118.60", maxMarks: "160" },
    ],
    syllabus: [
      {
        subject: "General Intelligence & Reasoning",
        topics: [
          "Arithmetic Number Series, Non-verbal series, Coding and Decoding",
          "Spatial Visualization, Spatial Orientation, Visual Memory",
          "Discrimination, Observation, Relationship concepts, Arithmetical reasoning",
          "Analogies, Similarities and Differences",
        ],
      },
      {
        subject: "General Knowledge & General Awareness",
        topics: [
          "Sports, History, Culture, Geography, Economic Scene",
          "General Polity, Indian Constitution, Scientific Research",
          "Current Affairs of National and International importance",
        ],
      },
      {
        subject: "Elementary Mathematics",
        topics: [
          "Number Systems, Computation of Whole Numbers, Decimals and Fractions",
          "Fundamental arithmetical operations, Percentages, Ratio and Proportion",
          "Averages, Interest (Simple & Compound), Profit and Loss, Discount",
          "Mensuration, Time and Distance, Ratio and Time, Time and Work",
        ],
      },
    ],
  },
  "ssc-cgl-2026": {
    stages: [
      {
        stageName: "Tier-1: Preliminary Computer Based Examination (CBT)",
        mode: "Online (CBT)",
        totalQuestions: 100,
        totalMarks: 200,
        duration: "60 Minutes (80 mins for scribe candidates)",
        negativeMarking: "0.50 marks deducted for each wrong answer",
        qualifyingCriteria: "Qualifying in nature for shortlisting to Tier-2",
        subjects: [
          { name: "General Intelligence & Reasoning", questions: 25, marks: 50 },
          { name: "General Awareness & Static GK", questions: 25, marks: 50 },
          { name: "Quantitative Aptitude (Arithmetic & Advanced)", questions: 25, marks: 50 },
          { name: "English Comprehension & Grammar", questions: 25, marks: 50 },
        ],
      },
      {
        stageName: "Tier-2: Mains Computer Based Examination (Paper-I)",
        mode: "Online (CBT) + Skill Test",
        totalQuestions: 150,
        totalMarks: 390,
        duration: "2 Hours 15 Minutes + 15 Minutes Typing",
        negativeMarking: "1.00 mark deducted per wrong answer in Sections I & II",
        qualifyingCriteria: "Merit strictly determined by Section I & II + qualifying Computer & Typing",
        subjects: [
          { name: "Mathematical Abilities (Section I - Module 1)", questions: 30, marks: 90 },
          { name: "Reasoning & General Intelligence (Section I - Module 2)", questions: 30, marks: 90 },
          { name: "English Language & Comprehension (Section II - Module 1)", questions: 45, marks: 135 },
          { name: "General Awareness (Section II - Module 2)", questions: 25, marks: 75 },
          { name: "Computer Knowledge Module (Section III - Qualifying)", questions: 20, marks: 60 },
          { name: "Data Entry Speed Test (DEST)", questions: 1, marks: 0, durationMinutes: 15 },
        ],
      },
    ],
    cutoffs: [
      { year: "2024 Cycle", category: "Unreserved (UR)", score: "153.25", maxMarks: "200" },
      { year: "2024 Cycle", category: "OBC", score: "148.60", maxMarks: "200" },
      { year: "2024 Cycle", category: "EWS", score: "143.40", maxMarks: "200" },
      { year: "2024 Cycle", category: "SC", score: "128.50", maxMarks: "200" },
      { year: "2024 Cycle", category: "ST", score: "119.80", maxMarks: "200" },
    ],
    syllabus: [
      {
        subject: "General Intelligence & Reasoning",
        topics: [
          "Analogies & Classification",
          "Coding-Decoding & Series (Number, Alphabet)",
          "Blood Relations & Direction Sense",
          "Venn Diagrams & Syllogism",
          "Non-verbal Reasoning (Paper folding, Mirror image, Embedded figures)",
        ],
      },
      {
        subject: "Quantitative Aptitude",
        topics: [
          "Arithmetic: Percentage, Ratio & Proportion, Profit & Loss, Simple & Compound Interest",
          "Time & Work, Time, Speed & Distance, Averages",
          "Algebra: Basic algebraic identities, linear equations",
          "Geometry: Triangles, circles, tangents, quadrilaterals",
          "Trigonometry & Heights & Distances",
          "Mensuration (2D & 3D Area and Volume)",
        ],
      },
      {
        subject: "General Awareness",
        topics: [
          "Current Affairs (National & International)",
          "Indian History & Culture (Ancient, Medieval, Modern Freedom Movement)",
          "Indian Constitution, Fundamental Rights, Parliament & Judiciary",
          "Geography: Physical, Economic & River systems of India",
          "General Science (Physics, Chemistry, Biology fundamentals)",
        ],
      },
      {
        subject: "English Comprehension",
        topics: [
          "Spotting Errors & Sentence Improvement",
          "Fill in the Blanks, Idioms & Phrases",
          "Synonyms, Antonyms, One-word substitution",
          "Active & Passive Voice, Direct & Indirect Speech",
          "Reading Comprehension passages & Cloze Test",
        ],
      },
    ],
  },
  "rrb-ntpc-2026": {
    stages: [
      {
        stageName: "1st Stage Computer Based Test (CBT-1 Screening)",
        mode: "Online (CBT)",
        totalQuestions: 100,
        totalMarks: 100,
        duration: "90 Minutes (120 mins for PwD)",
        negativeMarking: "1/3rd (0.33 mark) deducted for each incorrect answer",
        qualifyingCriteria: "Common screening test for all posts",
        subjects: [
          { name: "General Awareness & Current Affairs", questions: 40, marks: 40 },
          { name: "Mathematics (Arithmetic & Elementary Algebra)", questions: 30, marks: 30 },
          { name: "General Intelligence & Reasoning", questions: 30, marks: 30 },
        ],
      },
      {
        stageName: "2nd Stage Computer Based Test (CBT-2 Level-wise)",
        mode: "Online (CBT)",
        totalQuestions: 120,
        totalMarks: 120,
        duration: "90 Minutes",
        negativeMarking: "1/3rd (0.33 mark) deducted for each incorrect response",
        qualifyingCriteria: "Separate exams for Pay Level 2, 3, 5, and 6",
        subjects: [
          { name: "General Awareness", questions: 50, marks: 50 },
          { name: "Mathematics", questions: 35, marks: 35 },
          { name: "General Intelligence & Reasoning", questions: 35, marks: 35 },
        ],
      },
      {
        stageName: "CBAT (Aptitude Test for Station Master) / Typing Skill Test",
        mode: "Skill Test",
        totalQuestions: 0,
        totalMarks: 0,
        duration: "As per Railway norms",
        qualifyingCriteria: "Qualifying speed: 30 WPM English or 25 WPM Hindi without editing aids",
        subjects: [
          { name: "Computer Based Aptitude Test (CBAT) for Station Master", questions: 5, marks: 30 },
          { name: "Typing Test for Clerks & Accountants", questions: 1, marks: 0 },
        ],
      },
    ],
    cutoffs: [
      { year: "RRB CEN (Previous Cycle)", category: "UR (Station Master Level 6)", score: "74.80", maxMarks: "120" },
      { year: "RRB CEN (Previous Cycle)", category: "OBC (Station Master Level 6)", score: "70.20", maxMarks: "120" },
      { year: "RRB CEN (Previous Cycle)", category: "EWS (Station Master Level 6)", score: "67.50", maxMarks: "120" },
      { year: "RRB CEN (Previous Cycle)", category: "SC (Station Master Level 6)", score: "61.40", maxMarks: "120" },
      { year: "RRB CEN (Previous Cycle)", category: "ST (Station Master Level 6)", score: "58.10", maxMarks: "120" },
    ],
    syllabus: [
      {
        subject: "General Awareness (Railway Focus)",
        topics: [
          "Indian Railways history, modern initiatives (Vande Bharat, Dedicated Freight Corridors)",
          "Current Events of National and International Importance",
          "Indian Literature, Monuments, Places of India, Art and Culture",
          "General Science and Life Sciences (up to 10th CBSE)",
          "Environment, Ecology, and Climate Change basics",
        ],
      },
      {
        subject: "Mathematics",
        topics: [
          "Number System, Decimals, Fractions, LCM and HCF",
          "Ratio and Proportions, Percentages, Mensuration",
          "Time and Work, Time and Distance, Simple and Compound Interest",
          "Profit and Loss, Elementary Algebra, Geometry and Trigonometry, Elementary Statistics",
        ],
      },
      {
        subject: "General Intelligence & Reasoning",
        topics: [
          "Analogies, Completion of Number and Alphabetical Series",
          "Coding and Decoding, Mathematical Operations, Relationships",
          "Syllogism, Jumbling, Venn Diagrams, Puzzle, Data Sufficiency",
          "Statement-Conclusion, Statement-Courses of Action, Decision Making",
        ],
      },
    ],
  },
  "ibps-po-2026": {
    stages: [
      {
        stageName: "Preliminary Examination (Phase-I Online)",
        mode: "Online (CBT)",
        totalQuestions: 100,
        totalMarks: 100,
        duration: "60 Minutes (20 mins per section strictly timed)",
        negativeMarking: "0.25 marks penalty per wrong answer",
        qualifyingCriteria: "Sectional and overall cut-off required for Mains shortlisting",
        subjects: [
          { name: "English Language", questions: 30, marks: 30, durationMinutes: 20 },
          { name: "Quantitative Aptitude", questions: 35, marks: 35, durationMinutes: 20 },
          { name: "Reasoning Ability", questions: 35, marks: 35, durationMinutes: 20 },
        ],
      },
      {
        stageName: "Main Examination (Phase-II Objective + Descriptive)",
        mode: "Online (CBT) + Descriptive Typing",
        totalQuestions: 157,
        totalMarks: 225,
        duration: "3 Hours 30 Minutes",
        negativeMarking: "0.25 marks penalty per wrong answer",
        qualifyingCriteria: "Score carried forward to final merit list (80:20 ratio with interview)",
        subjects: [
          { name: "Reasoning & Computer Aptitude", questions: 45, marks: 60, durationMinutes: 60 },
          { name: "General, Economy & Banking Awareness", questions: 40, marks: 40, durationMinutes: 35 },
          { name: "English Language", questions: 35, marks: 40, durationMinutes: 40 },
          { name: "Data Analysis & Interpretation", questions: 35, marks: 60, durationMinutes: 45 },
          { name: "English Descriptive (Letter & Essay Typing)", questions: 2, marks: 25, durationMinutes: 30 },
        ],
      },
      {
        stageName: "Phase-III: Common Interview",
        mode: "In-Person Personality Interview",
        totalQuestions: 0,
        totalMarks: 100,
        duration: "15 to 20 Minutes",
        qualifyingCriteria: "Minimum qualifying marks: 40% (35% for SC/ST/OBC/PwD)",
        subjects: [
          { name: "Personal Background, Banking Awareness, Situation Reactions", questions: 0, marks: 100 },
        ],
      },
    ],
    cutoffs: [
      { year: "2024 Cycle", category: "UR (Prelims)", score: "54.25", maxMarks: "100" },
      { year: "2024 Cycle", category: "EWS (Prelims)", score: "54.25", maxMarks: "100" },
      { year: "2024 Cycle", category: "OBC (Prelims)", score: "54.25", maxMarks: "100" },
      { year: "2024 Cycle", category: "SC (Prelims)", score: "48.75", maxMarks: "100" },
      { year: "2024 Cycle", category: "ST (Prelims)", score: "42.00", maxMarks: "100" },
    ],
    syllabus: [
      {
        subject: "Data Analysis & Interpretation",
        topics: [
          "Tabular DI, Line Graph, Bar Chart, Pie Chart, Mixed Graph",
          "Caselet DI, Radar Graph, Funnel Graph, Missing DI",
          "Arithmetic DI based on Time & Work, Profit & Loss, Mixtures",
          "Data Sufficiency (2 and 3 statements)",
        ],
      },
      {
        subject: "Banking & Financial Awareness",
        topics: [
          "RBI Monetary Policy, Repo Rate, Reverse Repo, CRR, SLR",
          "Priority Sector Lending (PSL) norms, Basel III Accords",
          "Digital Banking, UPI, NPCI, NEFT, RTGS, IMPS framework",
          "Recent Government Schemes (PMJDY, Mudra, Atal Pension)",
          "Financial Inclusion, Non-Performing Assets (NPAs), IBC 2016",
        ],
      },
      {
        subject: "Reasoning & Computer Aptitude",
        topics: [
          "Advanced Puzzles: Circular, Linear, Floor-Flat, Box arrangements",
          "Machine Input-Output, Coded Inequalities, Direction & Distance",
          "Critical Reasoning: Statement-Assumption, Cause & Effect, Inference",
        ],
      },
    ],
  },
  "rrb-group-d-2026": {
    stages: [
      {
        stageName: "Stage 1: Computer Based Test (CBT 100 Marks)",
        mode: "Online (CBT)",
        totalQuestions: 100,
        totalMarks: 100,
        duration: "90 Minutes (120 minutes for PwBD)",
        negativeMarking: "1/3rd (0.33 mark) deducted for each incorrect answer",
        qualifyingCriteria: "Shortlisting 3 times vacancy for Physical Efficiency Test (PET)",
        subjects: [
          { name: "General Science (Physics, Chemistry, Life Sciences up to 10th CBSE)", questions: 25, marks: 25 },
          { name: "Mathematics (Arithmetic, Algebra, Geometry, Stats)", questions: 25, marks: 25 },
          { name: "General Intelligence and Reasoning", questions: 30, marks: 30 },
          { name: "General Awareness and Current Affairs", questions: 20, marks: 20 },
        ],
      },
      {
        stageName: "Stage 2: Physical Efficiency Test (PET - Mandatory Qualifying)",
        mode: "Field Athletics Test",
        totalQuestions: 0,
        totalMarks: 0,
        duration: "Standard timing on race ground",
        qualifyingCriteria: "Must qualify both weight-carry and running events without setting down weight",
        subjects: [
          { name: "Male Weight Carry: 35 kg weight for a distance of 100 meters in 2 minutes", questions: 1, marks: 0 },
          { name: "Male Running: 1,000 meters in 4 minutes 15 seconds in one single chance", questions: 1, marks: 0 },
          { name: "Female Weight Carry: 20 kg weight for a distance of 100 meters in 2 minutes", questions: 1, marks: 0 },
          { name: "Female Running: 1,000 meters in 5 minutes 40 seconds in one single chance", questions: 1, marks: 0 },
        ],
      },
      {
        stageName: "Stage 3: Document Verification (DV) and Medical Examination",
        mode: "Railway Hospital Medical Board",
        totalQuestions: 0,
        totalMarks: 0,
        duration: "As per Railway norms",
        qualifyingCriteria: "Medical Standards A-2, A-3, B-1, B-2, C-1 and C-2 depending on post assignment",
        subjects: [],
      },
    ],
    cutoffs: [
      { year: "Previous Cycle (Normalized)", category: "UR (General)", score: "68.20 - 74.50", maxMarks: "100" },
      { year: "Previous Cycle (Normalized)", category: "OBC", score: "63.40 - 70.10", maxMarks: "100" },
      { year: "Previous Cycle (Normalized)", category: "EWS", score: "54.00 - 62.50", maxMarks: "100" },
      { year: "Previous Cycle (Normalized)", category: "SC", score: "55.80 - 64.20", maxMarks: "100" },
      { year: "Previous Cycle (Normalized)", category: "ST", score: "48.90 - 58.70", maxMarks: "100" },
    ],
    syllabus: [
      {
        subject: "General Science",
        topics: [
          "Physics: Work, Power, Energy, Gravitation, Electricity, Optics, Sound",
          "Chemistry: Periodic Table, Acids & Bases, Chemical Reactions, Metals and Non-metals",
          "Biology: Cell Structure, Human Body Systems, Genetics, Ecology, Diseases",
        ],
      },
      {
        subject: "Mathematics",
        topics: [
          "Number system, BODMAS, Decimals, Fractions, LCM, HCF",
          "Ratio and Proportion, Percentages, Mensuration, Time and Work",
          "Time and Distance, Simple and Compound Interest, Profit and Loss",
          "Algebra, Geometry and Trigonometry, Elementary Statistics",
        ],
      },
    ],
  },
  "sbi-po-2026": {
    stages: [
      {
        stageName: "Phase-I: Preliminary Examination (Online 100 Marks)",
        mode: "Online (CBT)",
        totalQuestions: 100,
        totalMarks: 100,
        duration: "60 Minutes (Strictly 20 mins per section)",
        negativeMarking: "1/4th (0.25 mark) penalty for wrong answers",
        qualifyingCriteria: "Top 10 times total vacancies shortlisted for Phase-II Mains",
        subjects: [
          { name: "English Language", questions: 30, marks: 30, durationMinutes: 20 },
          { name: "Quantitative Aptitude", questions: 35, marks: 35, durationMinutes: 20 },
          { name: "Reasoning Ability", questions: 35, marks: 35, durationMinutes: 20 },
        ],
      },
      {
        stageName: "Phase-II: Main Examination (Objective 200M + Descriptive 50M)",
        mode: "Online (CBT + Typing)",
        totalQuestions: 157,
        totalMarks: 250,
        duration: "3 Hours 30 Minutes",
        negativeMarking: "1/4th (0.25 mark) penalty for wrong objective answers",
        qualifyingCriteria: "Score normalized to 75 marks out of 100 for final merit",
        subjects: [
          { name: "Reasoning & Computer Aptitude", questions: 40, marks: 50, durationMinutes: 50 },
          { name: "Data Analysis & Interpretation", questions: 30, marks: 50, durationMinutes: 45 },
          { name: "General / Economy / Banking Awareness", questions: 50, marks: 60, durationMinutes: 45 },
          { name: "English Language", questions: 35, marks: 40, durationMinutes: 40 },
          { name: "Descriptive Writing (Letter & Essay Typing)", questions: 2, marks: 50, durationMinutes: 30 },
        ],
      },
      {
        stageName: "Phase-III: Psychometric Test, Group Exercises (20M) & Interview (30M)",
        mode: "In-Person Assessment at SBI LHO",
        totalQuestions: 0,
        totalMarks: 50,
        duration: "Group Discussion + 25 mins Interview",
        qualifyingCriteria: "Normalized to 25 marks. Final merit out of 100 (75 Mains + 25 Phase-III).",
        subjects: [
          { name: "Group Discussion & Prioritization Exercise", questions: 1, marks: 20 },
          { name: "Personal Interview & Banking Acumen", questions: 0, marks: 30 },
        ],
      },
    ],
    cutoffs: [
      { year: "2023-24 Cycle (Prelims)", category: "General (UR)", score: "59.25", maxMarks: "100" },
      { year: "2023-24 Cycle (Prelims)", category: "EWS", score: "59.25", maxMarks: "100" },
      { year: "2023-24 Cycle (Prelims)", category: "OBC", score: "59.25", maxMarks: "100" },
      { year: "2023-24 Cycle (Prelims)", category: "SC", score: "53.00", maxMarks: "100" },
      { year: "2023-24 Cycle (Prelims)", category: "ST", score: "47.50", maxMarks: "100" },
    ],
    syllabus: [
      {
        subject: "Data Analysis & Interpretation (SBI Standard)",
        topics: [
          "Advanced Caselets & Missing Variable Data Interpretation",
          "Scatter Plot, Radar Graph, Probability-based DI",
          "Data Sufficiency (3 Statements), Arithmetic Word Problems",
        ],
      },
      {
        subject: "Banking & Financial Awareness",
        topics: [
          "SBI products, YONO platform, financial technology initiatives",
          "Monetary policy, NPA resolution, Insolvency & Bankruptcy Code",
          "Union Budget allocations, Economic Survey highlights",
        ],
      },
    ],
  },
  "upsc-nda-2026": {
    stages: [
      {
        stageName: "Stage 1: Written Examination (Mathematics + GAT 900 Marks)",
        mode: "Offline (OMR Sheet)",
        totalQuestions: 270,
        totalMarks: 900,
        duration: "5 Hours (2.5 Hours Math + 2.5 Hours GAT)",
        negativeMarking: "1/3rd (0.33%) deducted for each incorrect answer",
        qualifyingCriteria: "Minimum qualifying standard: 25% marks in each paper mandatory",
        subjects: [
          { name: "Code 01: Mathematics (Algebra, Calculus, Matrices, Trig)", questions: 120, marks: 300, durationMinutes: 150 },
          { name: "Code 02: General Ability Test (Part A English 200M + Part B GK 400M)", questions: 150, marks: 600, durationMinutes: 150 },
        ],
      },
      {
        stageName: "Stage 2: SSB Interview (Intelligence & Personality Test)",
        mode: "5-Day Services Selection Board",
        totalQuestions: 0,
        totalMarks: 900,
        duration: "5 Consecutive Days",
        qualifyingCriteria: "Officer Intelligence Rating (OIR), PPDT, GTO tasks, Psychology test, and Final Board Conference",
        subjects: [
          { name: "Stage-I: Screening (OIR & PPDT)", questions: 2, marks: 0 },
          { name: "Stage-II: Psychological Tests, Group Testing Officer (GTO) Tasks & Interview", questions: 0, marks: 900 },
        ],
      },
    ],
    physical: {
      heightMale: "157 cm (162.5 cm for Air Force Flying Branch; 152 cm for Gorkhas/Hills)",
      heightFemale: "152 cm (162.5 cm for Air Force Flying Branch)",
      chestMale: "Minimum 5 cm expansion required",
      runningMale: "2.4 km run in 15 minutes, 20 Squats, Pushups & Chin-ups (Recommended physical standard)",
      runningFemale: "2.4 km run in 17 minutes, 15 Squats, Pushups",
      otherCriteria: "Unmarried status strictly enforced during entire training at NDA Khadakwasla.",
    },
    cutoffs: [
      { year: "NDA (Previous Exam)", category: "Written Exam Minimum", score: "301", maxMarks: "900" },
      { year: "NDA (Previous Exam)", category: "Final Recommended Candidate", score: "664", maxMarks: "1800" },
    ],
    syllabus: [
      {
        subject: "Mathematics (NDA Syllabus)",
        topics: [
          "Algebra: Sets, Relations, Complex Numbers, Progressions, Permutations & Combinations",
          "Matrices and Determinants: Applications to system of linear equations",
          "Trigonometry: Angles, Properties of Triangles, Inverse trigonometric functions",
          "Analytical Geometry: 2D and 3D Lines, Conic sections, Sphere",
          "Differential & Integral Calculus, Vectors, Statistics and Probability",
        ],
      },
      {
        subject: "General Ability Test (GAT)",
        topics: [
          "Part A (English): Grammar, Usage, Vocabulary, Comprehension (200 marks)",
          "Part B (General Knowledge): Physics (100M), Chemistry (60M), General Science (40M), History & Freedom Movement (80M), Geography (80M), Current Events (40M)",
        ],
      },
    ],
  },
  "up-police-constable-2026": {
    stages: [
      {
        stageName: "Stage 1: Written Examination (OMR Based)",
        mode: "Offline (OMR Sheet)",
        totalQuestions: 150,
        totalMarks: 300,
        duration: "2 Hours (120 Minutes)",
        negativeMarking: "0.50 marks (1/4th) deducted for each wrong answer (+2 for correct)",
        qualifyingCriteria: "Shortlisting 2.5 times candidates for DV & Physical standards",
        subjects: [
          { name: "General Knowledge (सामान्य ज्ञान)", questions: 38, marks: 76 },
          { name: "General Hindi (सामान्य हिन्दी)", questions: 37, marks: 74 },
          { name: "Numerical & Mental Ability (संख्यात्मक एवं मानसिक योग्यता)", questions: 38, marks: 76 },
          { name: "Mental Aptitude, IQ & Reasoning Ability", questions: 37, marks: 74 },
        ],
      },
      {
        stageName: "Stage 2: Document Verification & Physical Standard Test (DV/PST)",
        mode: "Physical Measurement",
        totalQuestions: 0,
        totalMarks: 0,
        duration: "Standard on-site verification",
        qualifyingCriteria: "Height, Chest (males), and Weight (females) criteria check",
        subjects: [],
      },
      {
        stageName: "Stage 3: Physical Efficiency Test (PET Running)",
        mode: "Field Run (RFID Tagged)",
        totalQuestions: 0,
        totalMarks: 0,
        duration: "Male: 25 mins | Female: 14 mins",
        qualifyingCriteria: "Qualifying strictly within the prescribed time limit",
        subjects: [
          { name: "Male Running: 4.8 km within 25 Minutes", questions: 1, marks: 0 },
          { name: "Female Running: 2.4 km within 14 Minutes", questions: 1, marks: 0 },
        ],
      },
    ],
    physical: {
      heightMale: "168 cm (160 cm for ST)",
      heightFemale: "152 cm (147 cm for ST)",
      chestMale: "79 cm unexpanded to 84 cm expanded (Min 5 cm expansion required)",
      runningMale: "4.8 km in 25 Minutes (Qualifying)",
      runningFemale: "2.4 km in 14 Minutes (Qualifying)",
      otherCriteria: "Female minimum weight: 40 kg. Color blindness / flat foot disqualifies.",
    },
    cutoffs: [
      { year: "2024 Exam", category: "UR (Male)", score: "214.04", maxMarks: "300" },
      { year: "2024 Exam", category: "OBC (Male)", score: "206.50", maxMarks: "300" },
      { year: "2024 Exam", category: "EWS (Male)", score: "198.80", maxMarks: "300" },
      { year: "2024 Exam", category: "SC (Male)", score: "182.20", maxMarks: "300" },
      { year: "2024 Exam", category: "ST (Male)", score: "154.60", maxMarks: "300" },
      { year: "2024 Exam", category: "Female (All)", score: "185.00", maxMarks: "300" },
    ],
    syllabus: [
      {
        subject: "सामान्य ज्ञान (General Knowledge)",
        topics: [
          "उत्तर प्रदेश विशेष: शिक्षा, संस्कृति, कृषि, उद्योग, व्यापार एवं सामाजिक प्रथाएं",
          "भारतीय इतिहास, संस्कृति, भारत का संविधान एवं अर्थव्यवस्था",
          "पर्यावरण एवं नगरीकरण, भारत व विश्व का भूगोल एवं प्राकृतिक संसाधन",
          "मानवाधिकार, पुलिस व सामान्य प्रशासनिक व्यवस्था, साइबर क्राइम, जीएसटी",
        ],
      },
      {
        subject: "सामान्य हिन्दी (General Hindi)",
        topics: [
          "हिन्दी वर्णमाला, तद्भव-तत्सम, पर्यायवाची, विलोम, अनेकार्थक",
          "वाक्यांशों के लिए एक शब्द, समरूपी भिन्नार्थक शब्द, अशुद्ध वाक्यों को शुद्ध करना",
          "लिंग, वचन, कारक, सर्वनाम, विशेषण, क्रिया, काल, वाच्य, अव्यय",
          "उपसर्ग, प्रत्यय, सन्धि, समास, विराम चिन्ह, मुहावरे एवं लोकोक्तियां, रस, छन्द, अलंकार",
        ],
      },
      {
        subject: "संख्यात्मक एवं मानसिक योग्यता",
        topics: [
          "संख्या पद्धति, सरलीकरण, दशमलव और भिन्न, महत्तम एवं लघुत्तम समापवर्तक",
          "अनुपात और समानुपात, प्रतिशतता, लाभ और हानि, छूट, साधारण एवं चक्रवृद्धि ब्याज",
          "साझेदारी, औसत, समय और कार्य, समय और दूरी, सारणी और ग्राफ का प्रयोग, क्षेत्रमिति",
        ],
      },
    ],
  },
  "bpsc-70th-cce-2026": {
    stages: [
      {
        stageName: "Preliminary Examination (CCE Prelims)",
        mode: "Offline (OMR Sheet)",
        totalQuestions: 150,
        totalMarks: 150,
        duration: "2 Hours (120 Minutes)",
        negativeMarking: "1/3rd (0.33 mark) deducted for each incorrect answer",
        qualifyingCriteria: "Screening test for Mains. Cutoff around 91-100 marks out of 150.",
        subjects: [
          { name: "General Studies & Bihar Special", questions: 150, marks: 150 },
        ],
      },
      {
        stageName: "Main Written Examination (Descriptive)",
        mode: "Descriptive (Pen-Paper)",
        totalQuestions: 5,
        totalMarks: 900,
        duration: "3 Hours each paper",
        negativeMarking: "Subjective evaluation",
        qualifyingCriteria: "General Hindi qualifying (30 marks min). Merit based on GS-1, GS-2, and Essay (900 marks total).",
        subjects: [
          { name: "General Hindi (Qualifying Paper - 30% needed)", questions: 10, marks: 100 },
          { name: "General Studies Paper-1 (History, Modern India, Statistical Analysis)", questions: 8, marks: 300 },
          { name: "General Studies Paper-2 (Polity, Economy, Geography, Science & Tech)", questions: 8, marks: 300 },
          { name: "Essay Paper (3 Sections: National, International, Bihar Proverbs/Culture)", questions: 3, marks: 300 },
          { name: "Optional Subject (MCQ based - Qualifying nature only)", questions: 100, marks: 100 },
        ],
      },
      {
        stageName: "Personality Test (Interview)",
        mode: "Board Interview at BPSC Patna",
        totalQuestions: 0,
        totalMarks: 120,
        duration: "20 to 30 Minutes",
        qualifyingCriteria: "Final merit computed out of 1020 Marks (900 Mains + 120 Interview)",
        subjects: [
          { name: "Personality, Bihar Administrative Acumen, Current Events", questions: 0, marks: 120 },
        ],
      },
    ],
    cutoffs: [
      { year: "69th CCE", category: "UR (Male)", score: "91.67", maxMarks: "150" },
      { year: "69th CCE", category: "UR (Female)", score: "84.00", maxMarks: "150" },
      { year: "69th CCE", category: "EWS", score: "86.67", maxMarks: "150" },
      { year: "69th CCE", category: "BC (OBC)", score: "88.67", maxMarks: "150" },
      { year: "69th CCE", category: "SC", score: "75.00", maxMarks: "150" },
      { year: "69th CCE", category: "ST", score: "79.33", maxMarks: "150" },
    ],
    syllabus: [
      {
        subject: "General Studies (Prelims)",
        topics: [
          "General Science (Day-to-day scientific observations and discoveries)",
          "Current Events of National and International Importance",
          "History of India and salient features of the History of Bihar (Buddhism, Mauryas, 1857 revolt in Bihar, Champaran)",
          "General Geography and Geographical Division of Bihar and its major river systems (Ganga, Gandak, Kosi)",
          "Indian Polity and Economy and major changes in the economy of Bihar post-independence",
          "Indian National Movement and the contribution of Bihar (Kunwar Singh, Dr. Rajendra Prasad, JP Narayan)",
          "General Mental Ability and Basic Mathematics",
        ],
      },
      {
        subject: "General Studies Paper-1 (Mains)",
        topics: [
          "Modern History of India and Indian Culture from mid-19th century",
          "Role of Bihar in the Freedom Struggle (Santhal Uprising, Birsa Munda, Quit India Movement)",
          "Statistical Analysis, Graphs and Diagrams (Testing common-sense conclusions from statistical and graphical data - 72 marks)",
        ],
      },
      {
        subject: "Essay Paper (Mains 300 Marks)",
        topics: [
          "Section 1: Philosophical, Socio-Economic and Political Essays",
          "Section 2: Science, Technology, Environmental & Geo-strategic Essays",
          "Section 3: Unique Bihar Folk culture, Local Dialects (Bhojpuri, Maithili, Magahi) and rural economy proverbs",
        ],
      },
    ],
  },
};

// Automatic smart fallback generator for any job without explicit registry entry
export function getJobExamStages(job: JobNotification): ExamStage[] {
  // No generated exam pattern (question counts, marks, negative marking): only one recorded for this
  // exam. The notification's own selection process is shown from job.selectionProcess.
  return EXAM_DATA_REGISTRY[job.id]?.stages ?? [];
}

export function getJobPhysicalStandards(job: JobNotification): PhysicalStandards | null {
  // no generic physical standards: only ones recorded for this recruitment
  return EXAM_DATA_REGISTRY[job.id]?.physical ?? null;
}

export function getJobCutoffs(job: JobNotification): CutoffBenchmark[] {
  // no estimated cut-offs: only ones recorded for this exam
  return EXAM_DATA_REGISTRY[job.id]?.cutoffs ?? [];
}

export function getJobDetailedSyllabus(job: JobNotification): SyllabusSubjectSection[] {
  // no generic syllabus: only one recorded for this exam
  return EXAM_DATA_REGISTRY[job.id]?.syllabus ?? [];
}

// ==========================================
// POST-WISE VACANCY & QUALIFICATION MATRIX
// Answers: "Which qualifications qualify for which posts?"
// ==========================================
const POST_BREAKDOWN_REGISTRY: Record<string, PostVacancyBreakdown[]> = {
  "upsc-cse-2026": [
    { postName: "Indian Administrative Service (IAS)", department: "Department of Personnel & Training (DoPT)", vacancies: 180, qualification: "Bachelor's Degree in any discipline", ageLimit: "21 to 32 Years", payLevel: "Level 10 (₹56,100)" },
    { postName: "Indian Police Service (IPS)", department: "Ministry of Home Affairs (MHA)", vacancies: 200, qualification: "Bachelor's Degree (subject to medical/height standards)", ageLimit: "21 to 32 Years", payLevel: "Level 10 (₹56,100)" },
    { postName: "Indian Foreign Service (IFS)", department: "Ministry of External Affairs (MEA)", vacancies: 37, qualification: "Bachelor's Degree in any discipline", ageLimit: "21 to 32 Years", payLevel: "Level 10 (₹56,100)" },
    { postName: "Indian Revenue Service (IRS - IT & Customs)", department: "Ministry of Finance", vacancies: 308, qualification: "Bachelor's Degree in any discipline", ageLimit: "21 to 32 Years", payLevel: "Level 10 (₹56,100)" },
    { postName: "Central Group A & B Allied Services (DANICS, DANIPS, P&T)", department: "Various Central Ministries", vacancies: 380, qualification: "Bachelor's Degree in any discipline", ageLimit: "21 to 32 Years", payLevel: "Level 7 to Level 10" },
  ],
  "ssc-cgl-2026": [
    { postName: "Assistant Section Officer (ASO)", department: "Central Secretariat Service (CSS) / MEA / IB", vacancies: 3450, qualification: "Bachelor's Degree in any discipline", ageLimit: "20 to 30 Years", payLevel: "Pay Level 7 (₹44,900 - ₹1,42,400)" },
    { postName: "Inspector of Income Tax & Central Excise", department: "CBDT & CBIC (Ministry of Finance)", vacancies: 4890, qualification: "Bachelor's Degree in any discipline", ageLimit: "18 to 30 Years", payLevel: "Pay Level 7 (₹44,900 - ₹1,42,400)" },
    { postName: "Sub Inspector (SI) - CBI & NIA", department: "Central Bureau of Investigation / NIA", vacancies: 180, qualification: "Bachelor's Degree (Height: 165 cm male, 150 cm female)", ageLimit: "20 to 30 Years", payLevel: "Pay Level 7 (₹44,900)" },
    { postName: "Auditor & Accountant", department: "Comptroller & Auditor General of India (CAG)", vacancies: 4210, qualification: "Bachelor's Degree in any discipline", ageLimit: "18 to 27 Years", payLevel: "Pay Level 5 (₹29,200 - ₹92,300)" },
    { postName: "Tax Assistant & Upper Division Clerk", department: "CBDT / CBIC / Central Bureau of Narcotics", vacancies: 4997, qualification: "Bachelor's Degree + Data Entry Speed (8,000 key depressions/hr)", ageLimit: "18 to 27 Years", payLevel: "Pay Level 4 (₹25,500 - ₹81,100)" },
  ],
  "rrb-ntpc-2026": [
    { postName: "Station Master (SM)", department: "Operating & Traffic", vacancies: 2940, qualification: "Bachelor's Degree in any stream + CBAT Aptitude Test", ageLimit: "18 to 36 Years", payLevel: "Level 6 (₹35,400 Basic)" },
    { postName: "Goods Train Manager (Goods Guard)", department: "Operating Department", vacancies: 3144, qualification: "Bachelor's Degree in any stream (A2 Medical Standard)", ageLimit: "18 to 36 Years", payLevel: "Level 5 (₹29,200 Basic)" },
    { postName: "Senior Commercial cum Ticket Clerk", department: "Commercial Department", vacancies: 1736, qualification: "Bachelor's Degree in any discipline", ageLimit: "18 to 36 Years", payLevel: "Level 5 (₹29,200 Basic)" },
    { postName: "Junior Clerk cum Typist", department: "Personnel & Accounts", vacancies: 2840, qualification: "12th Standard (10+2) with 50% Marks + English 30 wpm or Hindi 25 wpm Typing", ageLimit: "18 to 33 Years", payLevel: "Level 2 (₹19,900 Basic)" },
    { postName: "Accounts Clerk cum Typist", department: "Accounts Department", vacancies: 898, qualification: "12th Standard (10+2) with 50% Marks + Computer Typing", ageLimit: "18 to 33 Years", payLevel: "Level 2 (₹19,900 Basic)" },
  ],
  "rrb-alp-technician-2026": [
    { postName: "Assistant Loco Pilot (ALP - Electrical)", department: "Electrical Traction", vacancies: 10450, qualification: "10th Matric + ITI (Fitter/Electrician) OR 3-Yr Diploma in Mech/Elec/Auto", ageLimit: "18 to 33 Years", payLevel: "Level 2 (₹19,900 + Running Allowances)" },
    { postName: "Assistant Loco Pilot (ALP - Mechanical)", department: "Mechanical (Diesel / Rolling Stock)", vacancies: 8349, qualification: "10th Matric + ITI (Fitter/Turner/Diesel Mech) OR Diploma in Mechanical", ageLimit: "18 to 33 Years", payLevel: "Level 2 (₹19,900 + Running Allowances)" },
  ],
  "rrb-je-2026": [
    { postName: "Junior Engineer (Civil Engineering)", department: "P-Way, Works & Bridge Cadre", vacancies: 3120, qualification: "3-Year Diploma / B.E. / B.Tech in Civil Engineering", ageLimit: "18 to 36 Years", payLevel: "Level 6 (₹35,400 Basic)" },
    { postName: "Junior Engineer (Electrical & Mechanical)", department: "Rolling Stock, Traction & Workshops", vacancies: 3450, qualification: "3-Year Diploma / B.E. in Electrical / Mechanical / Production", ageLimit: "18 to 36 Years", payLevel: "Level 6 (₹35,400 Basic)" },
    { postName: "Junior Engineer (Signal & Telecommunication)", department: "S&T Department", vacancies: 1381, qualification: "3-Year Diploma / B.E. in Electronics / Electrical / CS / IT", ageLimit: "18 to 36 Years", payLevel: "Level 6 (₹35,400 Basic)" },
  ],
  "ssc-gd-constable-2026": [
    { postName: "Constable (General Duty) - BSF", department: "Border Security Force", vacancies: 15654, qualification: "10th High School Matriculation Pass", ageLimit: "18 to 23 Years", payLevel: "Level 3 (₹21,700 - ₹69,100)" },
    { postName: "Constable (General Duty) - CISF", department: "Central Industrial Security Force", vacancies: 13632, qualification: "10th High School Matriculation Pass", ageLimit: "18 to 23 Years", payLevel: "Level 3 (₹21,700 - ₹69,100)" },
    { postName: "Constable (General Duty) - CRPF", department: "Central Reserve Police Force", vacancies: 9410, qualification: "10th High School Matriculation Pass", ageLimit: "18 to 23 Years", payLevel: "Level 3 (₹21,700 - ₹69,100)" },
    { postName: "Constable (General Duty) - SSB, ITBP, AR, SSF", department: "Sashastra Seema Bal & Special Security Force", vacancies: 785, qualification: "10th High School Matriculation Pass", ageLimit: "18 to 23 Years", payLevel: "Level 3 (₹21,700 - ₹69,100)" },
  ],
  "up-police-constable-2026": [
    { postName: "Civil Police Constable (Male)", department: "Uttar Pradesh Police", vacancies: 48200, qualification: "12th (Intermediate) Pass from recognized board (Height: 168 cm, Run: 4.8 km in 25 min)", ageLimit: "18 to 25 Years", payLevel: "Level 3 (₹21,700 - ₹69,100)" },
    { postName: "Civil Police Constable (Female)", department: "Uttar Pradesh Police", vacancies: 12044, qualification: "12th (Intermediate) Pass from recognized board (Height: 152 cm, Run: 2.4 km in 14 min)", ageLimit: "18 to 28 Years", payLevel: "Level 3 (₹21,700 - ₹69,100)" },
  ],
  "up-police-constable-60244": [
    { postName: "Civil Police Constable (Male)", department: "Uttar Pradesh Police", vacancies: 48200, qualification: "12th (Intermediate) Pass from recognized board (Height: 168 cm, Run: 4.8 km in 25 min)", ageLimit: "18 to 25 Years", payLevel: "Level 3 (₹21,700 - ₹69,100)" },
    { postName: "Civil Police Constable (Female)", department: "Uttar Pradesh Police", vacancies: 12044, qualification: "12th (Intermediate) Pass from recognized board (Height: 152 cm, Run: 2.4 km in 14 min)", ageLimit: "18 to 28 Years", payLevel: "Level 3 (₹21,700 - ₹69,100)" },
  ],
  "bpsc-tre-3-teacher-result": [
    { postName: "Primary Teacher (Class 1 to 5)", department: "Education Department, Bihar", vacancies: 28025, qualification: "Senior Secondary (12th with 50%) + D.El.Ed + CTET Paper-1 / BTET Paper-1", ageLimit: "18 to 37 Years", payLevel: "Basic ₹25,000 + DA + HRA" },
    { postName: "Middle School Teacher (Class 6 to 8)", department: "Education Department, Bihar", vacancies: 19645, qualification: "Graduation + B.Ed / D.El.Ed + CTET Paper-2 / BTET Paper-2", ageLimit: "21 to 37 Years", payLevel: "Basic ₹28,000 + DA + HRA" },
    { postName: "Secondary Teacher (Class 9 to 10)", department: "Education Department, Bihar", vacancies: 16970, qualification: "Graduation in relevant subject (50%) + B.Ed + Bihar STET Paper-1", ageLimit: "21 to 37 Years", payLevel: "Basic ₹31,000 + DA + HRA" },
    { postName: "Higher Secondary Teacher (Class 11 to 12)", department: "Education Department, Bihar", vacancies: 22373, qualification: "Post Graduation in subject (50%) + B.Ed + Bihar STET Paper-2", ageLimit: "21 to 37 Years", payLevel: "Basic ₹32,000 + DA + HRA" },
  ],
  "bpsc-tre-3": [
    { postName: "Primary Teacher (Class 1 to 5)", department: "Education Department, Bihar", vacancies: 28025, qualification: "Senior Secondary (12th with 50%) + D.El.Ed + CTET Paper-1 / BTET Paper-1", ageLimit: "18 to 37 Years", payLevel: "Basic ₹25,000 + DA + HRA" },
    { postName: "Middle School Teacher (Class 6 to 8)", department: "Education Department, Bihar", vacancies: 19645, qualification: "Graduation + B.Ed / D.El.Ed + CTET Paper-2 / BTET Paper-2", ageLimit: "21 to 37 Years", payLevel: "Basic ₹28,000 + DA + HRA" },
    { postName: "Secondary Teacher (Class 9 to 10)", department: "Education Department, Bihar", vacancies: 16970, qualification: "Graduation in relevant subject (50%) + B.Ed + Bihar STET Paper-1", ageLimit: "21 to 37 Years", payLevel: "Basic ₹31,000 + DA + HRA" },
    { postName: "Higher Secondary Teacher (Class 11 to 12)", department: "Education Department, Bihar", vacancies: 22373, qualification: "Post Graduation in subject (50%) + B.Ed + Bihar STET Paper-2", ageLimit: "21 to 37 Years", payLevel: "Basic ₹32,000 + DA + HRA" },
  ],
  "rrb-group-d-2026": [
    { postName: "Track Maintainer Grade-IV", department: "Civil Engineering Department", vacancies: 42150, qualification: "10th Pass (Matriculation) OR ITI from NCVT/SCVT", ageLimit: "18 to 33 Years", payLevel: "Level 1 (₹18,000 Basic + Risk Allowance)" },
    { postName: "Pointsman / Shunting Master", department: "Traffic & Operating", vacancies: 24800, qualification: "10th Pass from recognized board (A2 Medical Standard)", ageLimit: "18 to 33 Years", payLevel: "Level 1 (₹18,000 Basic + Night Allowance)" },
    { postName: "Assistant Workshop & Carriage/Wagon (C&W)", department: "Mechanical Department", vacancies: 28500, qualification: "10th Pass OR ITI in Fitter / Welder / Machinist", ageLimit: "18 to 33 Years", payLevel: "Level 1 (₹18,000 Basic)" },
    { postName: "Assistant Signal & Telecommunication (S&T)", department: "Signal & Telecom Department", vacancies: 8319, qualification: "10th Pass OR ITI in Electrical / Wireman / Electronics", ageLimit: "18 to 33 Years", payLevel: "Level 1 (₹18,000 Basic)" },
  ],
  "ssc-mts-havaldar-2026": [
    { postName: "Multi-Tasking Staff (MTS Non-Technical)", department: "Various Central Ministries & Attached Offices", vacancies: 6144, qualification: "10th Class (Matriculation) Pass from recognized Board", ageLimit: "18 to 25 Years (Select posts up to 27)", payLevel: "Pay Level 1 (₹18,000 - ₹56,900)" },
    { postName: "Havaldar (Customs, Central Excise & Narcotics)", department: "CBIC & CBN (Department of Revenue)", vacancies: 3439, qualification: "10th Pass + Physical Walking (1600m in 15 min male / 1km in 20 min female)", ageLimit: "18 to 27 Years", payLevel: "Pay Level 1 (₹18,000 - ₹56,900)" },
  ],
  "ssc-chsl-tier1-admit-card": [
    { postName: "Lower Division Clerk (LDC) / Junior Secretariat Assistant (JSA)", department: "Central Ministries, Armed Forces HQ, Election Commission", vacancies: 3210, qualification: "12th Standard Pass + English 35 wpm or Hindi 30 wpm Typing", ageLimit: "18 to 27 Years", payLevel: "Pay Level 2 (₹19,900 - ₹63,200)" },
    { postName: "Data Entry Operator (DEO Grade A)", department: "Comptroller & Auditor General of India (CAG) / Ministry of Consumer Affairs", vacancies: 490, qualification: "12th Standard Pass in Science stream with Mathematics", ageLimit: "18 to 27 Years", payLevel: "Pay Level 4 (₹25,500 - ₹81,100)" },
  ],
  "sbi-po-2026": [
    { postName: "Probationary Officer (PO)", department: "State Bank of India (All India Branches)", vacancies: 2000, qualification: "Graduation in any discipline from a recognized University", ageLimit: "21 to 30 Years", payLevel: "Junior Management Grade Scale-I (Basic ₹41,960)" },
  ],
  "sbi-clerk-2026": [
    { postName: "Junior Associate (Customer Support & Sales)", department: "State Bank of India (State-wise Circles)", vacancies: 8283, qualification: "Graduation in any discipline + Proficiency in Official Local Language of the State", ageLimit: "20 to 28 Years", payLevel: "Clerical Cadre (Basic ₹19,900)" },
  ],
  "kea-major-recruitment-4744": [
    { postName: "First Division Assistant (FDA) / Senior Assistant", department: "Various Karnataka State Government Boards & Corporations", vacancies: 1820, qualification: "Bachelor's Degree in any discipline with Kannada language proficiency", ageLimit: "18 to 35 Years (OBC 38y, SC/ST 40y)", payLevel: "State Pay Scale (₹27,650 - ₹52,650)" },
    { postName: "Second Division Assistant (SDA) / Junior Assistant", department: "Various Karnataka State Government Boards & Corporations", vacancies: 2924, qualification: "12th Standard / 2nd PUC Pass or 3-Year Diploma", ageLimit: "18 to 35 Years (OBC 38y, SC/ST 40y)", payLevel: "State Pay Scale (₹21,400 - ₹42,000)" },
  ],
  "india-post-gds-2026": [
    { postName: "Branch Postmaster (BPM)", department: "Department of Posts (Gramin Dak Sevak)", vacancies: 18450, qualification: "10th Class Secondary School Examination with Maths & English + Computer knowledge", ageLimit: "18 to 40 Years", payLevel: "TRCA Slab 1 (₹12,000 - ₹29,380)" },
    { postName: "Assistant Branch Postmaster (ABPM) / Dak Sevak", department: "Department of Posts (Gramin Dak Sevak)", vacancies: 25778, qualification: "10th Class Secondary School Examination with Maths & English", ageLimit: "18 to 40 Years", payLevel: "TRCA Slab 2 (₹10,000 - ₹24,470)" },
  ],
};

export function getJobPostBreakdown(job: JobNotification): PostVacancyBreakdown[] {
  if (POST_BREAKDOWN_REGISTRY[job.id]) {
    return POST_BREAKDOWN_REGISTRY[job.id];
  }
  if (job.posts && job.posts.length > 0) {
    return job.posts.map((p) => ({
      postName: p.postName,
      department: job.organization,
      vacancies: p.vacancies ? p.vacancies.toLocaleString("en-IN") : "See notification",
      qualification: p.qualification || "See notification",
      ageLimit: p.ageLimit || formatAgeRange(job, "Years"),
      payLevel: p.pay || "See notification",
    }));
  }
  return [
    {
      postName: job.shortTitle,
      department: job.organization,
      vacancies: job.totalVacancies ? job.totalVacancies.toLocaleString("en-IN") : "See notification",
      qualification: job.qualifications.join("; ") || "See notification",
      ageLimit: formatAgeRange(job, "Years"),
      payLevel: job.salary || "See notification",
    },
  ];
}

// ==========================================
// AGE RECKONING (CRUCIAL DATE FOR AGE CALCULATION)
// ==========================================
export function getJobAgeReckoning(job: JobNotification): AgeReckoningInfo {
  // the reckoning date only when the notification gives one
  return {
    crucialDate: job.ageCutoffDate ? job.ageCutoffDate.split("-").reverse().join("/") : "the date in the notification",
    minAge: job.minAge,
    maxAge: job.maxAge,
    bornBetween: "",
    specialClauses: job.ageRelaxation,
  };
}

// ==========================================
// CATEGORY-WISE STATUTORY MATRIX (FEES & RELAXATIONS)
// ==========================================
export function getJobCategoryMatrix(job: JobNotification): CategoryStatutoryMatrixItem[] {
  // Category-wise fees and age relaxations differ by notification; the notice text is shown instead
  // (formatFee, job.ageRelaxation) rather than a table built from general norms.
  void job;
  return [];
}

// ==========================================
// DATED CORRIGENDUM & EXTENSION NOTICES
// ==========================================
const CORRIGENDUM_REGISTRY: Record<string, CorrigendumNotice> = {
  "rrb-alp-technician-2026": {
    noticeDate: "12 October 2026",
    type: "Vacancy Revision",
    headline: "Official Gazette Notice: ALP Vacancies Revised to 18,799 Posts",
    details: "Ministry of Railways has approved a major revision in Assistant Loco Pilot vacancies from the initial 5,696 to 18,799 posts across all 21 regional RRB boards to address operational requirements.",
    officialGazetteRef: "Railway Board Gazette Circular No. RRB/CEN-01/2026-REV",
  },
  "ssc-cgl-2026": {
    noticeDate: "05 October 2026",
    type: "Extension",
    headline: "Registration Deadline Extended by Staff Selection Commission",
    details: "The closing date for submission of online applications for Combined Graduate Level Examination (CGL 2026) has been officially extended to 05 November 2026. The 2-day correction window will open on 08-09 November 2026.",
    officialGazetteRef: "SSC Order F.No. 3/1/2026-P&P-I",
  },
  "rrb-ntpc-2026": {
    noticeDate: "18 September 2026",
    type: "Correction Window",
    headline: "One-Time Special 3-Year Age Concession Notified",
    details: "To provide relief to candidates affected by previous cycle postponements, an official 3-year age relaxation beyond the prescribed upper limit is granted across all categories for CEN 05/2026 & CEN 06/2026.",
    officialGazetteRef: "Gazette of India Extraordinary No. CEN-05/2026",
  },
  "up-police-constable-2026": {
    noticeDate: "28 January 2026",
    type: "Corrigendum",
    headline: "Chief Minister Notifies 3-Year Age Relaxation Across All Categories",
    details: "Government of Uttar Pradesh has issued an official gazette notification relaxing the maximum age limit by 3 years for all male and female candidates for the 60,244 civil constable posts.",
    officialGazetteRef: "UPPRPB Order No. 2026/CONST-01",
  },
  "up-police-constable-60244": {
    noticeDate: "28 January 2026",
    type: "Corrigendum",
    headline: "Chief Minister Notifies 3-Year Age Relaxation Across All Categories",
    details: "Government of Uttar Pradesh has issued an official gazette notification relaxing the maximum age limit by 3 years for all male and female candidates for the 60,244 civil constable posts.",
    officialGazetteRef: "UPPRPB Order No. 2026/CONST-01",
  },
};

export function getJobCorrigendum(job: JobNotification): CorrigendumNotice | null {
  return CORRIGENDUM_REGISTRY[job.id] || null;
}

// ==========================================
// IN-HAND ESTIMATED PAY BREAKDOWN
// ==========================================
export function getJobPayBreakdown(job: JobNotification): PayBreakdown {
  // Only the pay the notification states; no in-hand estimates (they would not be from the notice).
  return {
    payLevel: job.salary || "See notification",
    basicPay: job.salary || "See notification",
    inHandEstimated: "",
    allowances: [],
  };
}

