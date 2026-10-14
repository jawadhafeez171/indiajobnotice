import { JobNotification } from "@/data/jobs";

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
  const registered = EXAM_DATA_REGISTRY[job.id];
  if (registered?.stages && registered.stages.length > 0) {
    return registered.stages;
  }

  // Derive realistic stages from job.selectionProcess and syllabusSummary
  const isPoliceOrDefense = job.category === "Police / Defense";
  const isTeaching = job.category === "Teaching / Education";
  const isTechnical = job.category === "Engineering / Technical";

  const stages: ExamStage[] = [];

  // Stage 1
  stages.push({
    stageName: job.selectionProcess[0] || "Stage 1: Written Examination / CBT",
    mode: isPoliceOrDefense ? "Offline (OMR Sheet) / CBT" : "Online (CBT)",
    totalQuestions: 100,
    totalMarks: 100,
    duration: "90 Minutes",
    negativeMarking: "1/4th (0.25) or 1/3rd (0.33) per incorrect response",
    qualifyingCriteria: "Standard qualifying marks: 40% for UR, 35% for OBC/SC/ST",
    subjects: [
      { name: "General Awareness & Current Affairs", questions: 30, marks: 30 },
      { name: "Reasoning & Mental Ability", questions: 30, marks: 30 },
      { name: isTechnical ? "Core Technical / Domain Subject" : "Quantitative Aptitude", questions: 40, marks: 40 },
    ],
  });

  // Stage 2 if available
  if (job.selectionProcess.length > 1) {
    const stage2Name = job.selectionProcess[1];
    const isPhysical = stage2Name.toLowerCase().includes("physical") || stage2Name.toLowerCase().includes("pet");

    if (isPhysical) {
      stages.push({
        stageName: stage2Name,
        mode: "Physical Field Evaluation",
        totalQuestions: 0,
        totalMarks: 0,
        duration: "Standard on-ground test",
        qualifyingCriteria: "Must qualify all physical norms (Running, Height, Chest measurements)",
        subjects: [
          { name: "Physical Standards Test (PST) Verification", questions: 1, marks: 0 },
          { name: "Physical Efficiency Test (PET Race / Endurance)", questions: 1, marks: 0 },
        ],
      });
    } else {
      stages.push({
        stageName: stage2Name,
        mode: stage2Name.toLowerCase().includes("interview") ? "Interview / Viva-Voce" : "Written / Skill Test",
        totalQuestions: stage2Name.toLowerCase().includes("interview") ? 0 : 100,
        totalMarks: stage2Name.toLowerCase().includes("interview") ? 100 : 200,
        duration: stage2Name.toLowerCase().includes("interview") ? "20 Minutes" : "120 Minutes",
        qualifyingCriteria: "Merit compilation round",
        subjects: [
          { name: isTeaching ? "Pedagogy & Subject Specialization" : "Advanced Domain / Descriptive Evaluation", questions: 50, marks: 100 },
        ],
      });
    }
  }

  // Final Stage: Document Verification
  if (job.selectionProcess.length > 2) {
    stages.push({
      stageName: job.selectionProcess[2],
      mode: "Document Verification & Medical Fitness",
      totalQuestions: 0,
      totalMarks: 0,
      duration: "Designated Centers",
      qualifyingCriteria: "Verification of original academic degrees, category certificates and biometric identity",
      subjects: [],
    });
  }

  return stages;
}

export function getJobPhysicalStandards(job: JobNotification): PhysicalStandards | null {
  const registered = EXAM_DATA_REGISTRY[job.id];
  if (registered?.physical) {
    return registered.physical;
  }

  if (job.category === "Police / Defense") {
    return {
      heightMale: "165 - 168 cm (Relaxable for ST / Hill areas)",
      heightFemale: "152 - 155 cm",
      chestMale: "79 - 84 cm (Minimum 5 cm expansion)",
      runningMale: "4.8 km in 25 mins or 1.6 km in 6.5 mins",
      runningFemale: "2.4 km in 14 mins or 800m in 4 mins",
      otherCriteria: "Good visual acuity (6/6 or 6/9), no knock-knees or flat feet.",
    };
  }

  return null;
}

export function getJobCutoffs(job: JobNotification): CutoffBenchmark[] {
  const registered = EXAM_DATA_REGISTRY[job.id];
  if (registered?.cutoffs && registered.cutoffs.length > 0) {
    return registered.cutoffs;
  }

  // Realistic estimates based on general trends
  return [
    { year: "Previous Cycle", category: "Unreserved (UR)", score: "72 - 78%", maxMarks: "100%" },
    { year: "Previous Cycle", category: "OBC", score: "68 - 74%", maxMarks: "100%" },
    { year: "Previous Cycle", category: "EWS", score: "66 - 72%", maxMarks: "100%" },
    { year: "Previous Cycle", category: "SC", score: "58 - 65%", maxMarks: "100%" },
    { year: "Previous Cycle", category: "ST", score: "52 - 60%", maxMarks: "100%" },
  ];
}

export function getJobDetailedSyllabus(job: JobNotification): SyllabusSubjectSection[] {
  const registered = EXAM_DATA_REGISTRY[job.id];
  if (registered?.syllabus && registered.syllabus.length > 0) {
    return registered.syllabus;
  }

  // Parse summary or provide structured standards
  return [
    {
      subject: "General Knowledge & Current Affairs",
      topics: [
        "National & International Current Affairs (Last 6-12 Months)",
        "Indian Constitution, Fundamental Rights, Directive Principles",
        "Modern Indian History & Freedom Struggle",
        "Geography of India, Rivers, National Parks & Agriculture",
        "Everyday General Science, Environment & Technology Updates",
      ],
    },
    {
      subject: "Reasoning & Mental Ability",
      topics: [
        "Analogy, Number & Alphabetical Series, Classification",
        "Coding-Decoding, Blood Relations, Direction Sense",
        "Venn Diagrams, Syllogisms, Non-verbal series",
        "Statement & Assumptions, Logical deduction",
      ],
    },
    {
      subject: "Quantitative Aptitude / Domain Specialization",
      topics: [
        "Percentages, Ratio & Proportion, Profit & Loss, Simple & Compound Interest",
        "Time & Work, Speed, Time & Distance, Averages",
        "Basic Algebra, Geometry, Mensuration & Data Interpretation",
        "Department-specific statutory guidelines and job roles",
      ],
    },
  ];
}
