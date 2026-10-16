/**
 * Statutory State & Central Reservation Registry
 *
 * Implements constitutional state-specific reservation rosters (Articles 15(4), 16(4), 341, 342)
 * covering statutory nomenclature, sub-categories, percentage quotas, and domicile regulations.
 */

export interface StateReservationCategory {
  code: string;
  name: string;
  shortLabel: string;
  defaultAgeRelaxationYears: number;
  maxAgeOverride?: number; // Specific absolute ceiling if defined by state service rules
  feeConcessionPercentage?: number; // e.g. 100 for full fee exemption
  description: string;
}

export interface StateSpecialQuota {
  id: string;
  name: string;
  percentage?: number;
  eligibilityCondition: string;
}

export interface StateReservationRuleset {
  stateSlug: string;
  stateName: string;
  domicileRule: string;
  categories: StateReservationCategory[];
  specialQuotas: StateSpecialQuota[];
}

// 1. Central / All-India Default Roster (DoPT Guidelines)
export const CENTRAL_RESERVATION_RULESET: StateReservationRuleset = {
  stateSlug: "central",
  stateName: "All-India / Central Government",
  domicileRule: "Central recruitments are open to all citizens of India. Central OBC (Non-Creamy Layer), SC, and ST certificates must follow standard Government of India formats issued by competent revenue authorities.",
  categories: [
    {
      code: "UR",
      name: "Unreserved / General Merit",
      shortLabel: "UR / Gen",
      defaultAgeRelaxationYears: 0,
      description: "Open competition category based purely on merit without caste relaxation.",
    },
    {
      code: "EWS",
      name: "Economically Weaker Sections (103rd Amendment)",
      shortLabel: "EWS",
      defaultAgeRelaxationYears: 0,
      description: "Family gross annual income below ₹8 Lakhs; standard upper age limit applies with 10% quota.",
    },
    {
      code: "OBC_NCL",
      name: "Other Backward Classes (Non-Creamy Layer)",
      shortLabel: "OBC (NCL)",
      defaultAgeRelaxationYears: 3,
      description: "Central list of OBCs. Requires valid Non-Creamy Layer certificate issued in current financial year.",
    },
    {
      code: "SC",
      name: "Scheduled Castes",
      shortLabel: "SC",
      defaultAgeRelaxationYears: 5,
      feeConcessionPercentage: 100,
      description: "Recognized Central SC list. Entitled to +5 years relaxation and statutory fee exemption.",
    },
    {
      code: "ST",
      name: "Scheduled Tribes",
      shortLabel: "ST",
      defaultAgeRelaxationYears: 5,
      feeConcessionPercentage: 100,
      description: "Recognized Central ST list. Entitled to +5 years relaxation and statutory fee exemption.",
    },
    {
      code: "PWBD",
      name: "Persons with Benchmark Disabilities (40%+)",
      shortLabel: "PwBD / Divyang",
      defaultAgeRelaxationYears: 10,
      feeConcessionPercentage: 100,
      description: "RPwD Act 2016 categories. +10 yrs (UR/EWS), +13 yrs (OBC), or +15 yrs (SC/ST).",
    },
    {
      code: "ESM",
      name: "Ex-Servicemen (Defense Forces)",
      shortLabel: "Ex-Servicemen",
      defaultAgeRelaxationYears: 3,
      description: "Military service rendered deducted from actual age plus additional 3 years allowance.",
    },
  ],
  specialQuotas: [
    {
      id: "central_esm",
      name: "Ex-Servicemen Horizontal Quota",
      percentage: 10,
      eligibilityCondition: "Minimum 6 months active military service with honorable discharge.",
    },
    {
      id: "central_pwd",
      name: "Rights of Persons with Disabilities (RPwD) Quota",
      percentage: 4,
      eligibilityCondition: "Valid disability certificate showing 40% or higher permanent benchmark impairment.",
    },
  ],
};

// 2. State-Specific Statutory Registries
export const STATE_RESERVATIONS_REGISTRY: Record<string, StateReservationRuleset> = {
  // KARNATAKA (KPSC / KEA / KSP)
  karnataka: {
    stateSlug: "karnataka",
    stateName: "Karnataka",
    domicileRule: "Reserved category benefits (Cat-1, 2A, 2B, 3A, 3B, SC, ST) and quotas (Kannada Medium, Rural, 371J) strictly apply to Karnataka residents. Out-of-state candidates are evaluated as General Merit (GM) without age or fee concession.",
    categories: [
      {
        code: "GM",
        name: "General Merit (GM)",
        shortLabel: "GM (General)",
        defaultAgeRelaxationYears: 0,
        maxAgeOverride: 35,
        description: "Open competition for all Karnataka and non-Karnataka aspirants. Base upper age limit: 35 Years.",
      },
      {
        code: "CAT_1",
        name: "Category-1 (Most Backward Communities)",
        shortLabel: "Category-1",
        defaultAgeRelaxationYears: 5,
        maxAgeOverride: 40,
        feeConcessionPercentage: 100,
        description: "Statutory 4% quota in Karnataka. Upper age limit relaxed up to 40 Years.",
      },
      {
        code: "2A",
        name: "Category 2A (Other Backward Classes)",
        shortLabel: "Category 2A",
        defaultAgeRelaxationYears: 3,
        maxAgeOverride: 38,
        description: "15% Karnataka state quota. Maximum age limit relaxed up to 38 Years.",
      },
      {
        code: "2B",
        name: "Category 2B (Muslim Minority Backward)",
        shortLabel: "Category 2B",
        defaultAgeRelaxationYears: 3,
        maxAgeOverride: 38,
        description: "4% Karnataka state quota. Upper age limit relaxed up to 38 Years.",
      },
      {
        code: "3A",
        name: "Category 3A (Vokkaliga & Allied Groups)",
        shortLabel: "Category 3A",
        defaultAgeRelaxationYears: 3,
        maxAgeOverride: 38,
        description: "4% Karnataka state quota. Maximum age limit relaxed up to 38 Years.",
      },
      {
        code: "3B",
        name: "Category 3B (Lingayat & Allied Groups)",
        shortLabel: "Category 3B",
        defaultAgeRelaxationYears: 3,
        maxAgeOverride: 38,
        description: "5% Karnataka state quota. Maximum age limit relaxed up to 38 Years.",
      },
      {
        code: "SC",
        name: "Scheduled Castes (Karnataka)",
        shortLabel: "SC (Karnataka)",
        defaultAgeRelaxationYears: 5,
        maxAgeOverride: 40,
        feeConcessionPercentage: 100,
        description: "17% state quota. Upper age relaxed up to 40 Years with full exam fee waiver.",
      },
      {
        code: "ST",
        name: "Scheduled Tribes (Karnataka)",
        shortLabel: "ST (Karnataka)",
        defaultAgeRelaxationYears: 5,
        maxAgeOverride: 40,
        feeConcessionPercentage: 100,
        description: "7% state quota. Upper age relaxed up to 40 Years with full exam fee waiver.",
      },
    ],
    specialQuotas: [
      {
        id: "rural_karnataka",
        name: "Rural Candidate Quota (Gramina)",
        percentage: 15,
        eligibilityCondition: "Studied from 1st to 10th standard in rural Karnataka schools recognized by state government.",
      },
      {
        id: "kannada_medium",
        name: "Kannada Medium Studied Quota",
        percentage: 5,
        eligibilityCondition: "Completed 10 full academic years of primary & secondary schooling in Kannada medium.",
      },
      {
        id: "art_371j",
        name: "Article 371(J) Kalyana-Karnataka Local Cadre",
        percentage: 75,
        eligibilityCondition: "Permanent resident certificate for Bidar, Bellary, Kalaburagi, Koppal, Raichur, or Yadgir.",
      },
    ],
  },

  // UTTAR PRADESH (UPPSC / UPSSSC / UPPRPB)
  up: {
    stateSlug: "up",
    stateName: "Uttar Pradesh",
    domicileRule: "Caste reservation and age relaxation (OBC, SC, ST) are strictly admissible to permanent residents holding UP Domicile and Caste Certificates issued by UP Revenue Officers. Candidates from all other states are treated under General (UR) category.",
    categories: [
      {
        code: "UR",
        name: "General / Unreserved (Open to All India)",
        shortLabel: "UR (Open)",
        defaultAgeRelaxationYears: 0,
        description: "Base eligibility without relaxation. Open to all Indian citizens meeting minimum criteria.",
      },
      {
        code: "EWS",
        name: "UP Economically Weaker Sections",
        shortLabel: "EWS (UP)",
        defaultAgeRelaxationYears: 0,
        description: "10% quota for UP residents. Standard upper age applies.",
      },
      {
        code: "OBC",
        name: "UP Other Backward Classes (Non-Creamy Layer)",
        shortLabel: "OBC (UP)",
        defaultAgeRelaxationYears: 5,
        description: "27% state quota. UP government provides +5 years age relaxation for state residents.",
      },
      {
        code: "SC",
        name: "UP Scheduled Castes",
        shortLabel: "SC (UP)",
        defaultAgeRelaxationYears: 5,
        feeConcessionPercentage: 50,
        description: "21% state quota. +5 years age relaxation and fee concession for UP residents.",
      },
      {
        code: "ST",
        name: "UP Scheduled Tribes",
        shortLabel: "ST (UP)",
        defaultAgeRelaxationYears: 5,
        feeConcessionPercentage: 50,
        description: "2% state quota. +5 years age relaxation and fee concession for UP residents.",
      },
    ],
    specialQuotas: [
      {
        id: "up_women",
        name: "UP Domicile Women Horizontal Reservation",
        percentage: 20,
        eligibilityCondition: "Reserved horizontally across social categories for female candidates with UP domicile.",
      },
      {
        id: "up_dff",
        name: "Dependents of Freedom Fighters (DFF)",
        percentage: 2,
        eligibilityCondition: "Direct descendants of recognized freedom fighters certified by District Magistrate.",
      },
      {
        id: "up_esm",
        name: "Ex-Servicemen (UP Domicile)",
        percentage: 5,
        eligibilityCondition: "Retired military defense personnel residing in Uttar Pradesh.",
      },
    ],
  },

  // BIHAR (BPSC / BSSC / CSBC)
  bihar: {
    stateSlug: "bihar",
    stateName: "Bihar",
    domicileRule: "Bihar reservation rosters divide OBC into EBC and BC. Out-of-state applicants can only apply under General (UR) and do not receive female or caste concessions. Domicile certificate from Bihar Revenue Officer is mandatory for reserved benefits.",
    categories: [
      {
        code: "UR",
        name: "Unreserved (General)",
        shortLabel: "UR (General)",
        defaultAgeRelaxationYears: 0,
        maxAgeOverride: 37,
        description: "Male upper age ceiling is 37 Years. Open to all candidates across India.",
      },
      {
        code: "UR_FEMALE",
        name: "Unreserved Female (General Female)",
        shortLabel: "UR Female",
        defaultAgeRelaxationYears: 3,
        maxAgeOverride: 40,
        description: "Under Bihar civil service rules, General category female candidates get upper age relaxation up to 40 Years.",
      },
      {
        code: "EWS",
        name: "Economically Weaker Section (Bihar)",
        shortLabel: "EWS (Bihar)",
        defaultAgeRelaxationYears: 0,
        maxAgeOverride: 37,
        description: "10% state reservation for Bihar residents. Male age 37 yrs, Female 40 yrs.",
      },
      {
        code: "BC",
        name: "Backward Class (BC / OBC Annexure-2)",
        shortLabel: "BC (Annexure-2)",
        defaultAgeRelaxationYears: 3,
        maxAgeOverride: 40,
        description: "12% state quota. Upper age relaxed up to 40 Years for both male and female candidates.",
      },
      {
        code: "EBC",
        name: "Extremely Backward Class (EBC / Annexure-1)",
        shortLabel: "EBC (Annexure-1)",
        defaultAgeRelaxationYears: 3,
        maxAgeOverride: 40,
        description: "18% state quota. Upper age relaxed up to 40 Years for both male and female candidates.",
      },
      {
        code: "WBC",
        name: "Women of Backward Classes (WBC)",
        shortLabel: "WBC (3% Quota)",
        defaultAgeRelaxationYears: 3,
        maxAgeOverride: 40,
        description: "Dedicated 3% reservation for backward class women across Bihar recruitments.",
      },
      {
        code: "SC",
        name: "Scheduled Castes (Bihar)",
        shortLabel: "SC (Bihar)",
        defaultAgeRelaxationYears: 5,
        maxAgeOverride: 42,
        feeConcessionPercentage: 75,
        description: "16% state quota. Upper age limit relaxed up to 42 Years (Male & Female).",
      },
      {
        code: "ST",
        name: "Scheduled Tribes (Bihar)",
        shortLabel: "ST (Bihar)",
        defaultAgeRelaxationYears: 5,
        maxAgeOverride: 42,
        feeConcessionPercentage: 75,
        description: "1% state quota. Upper age limit relaxed up to 42 Years (Male & Female).",
      },
    ],
    specialQuotas: [
      {
        id: "bihar_women_35",
        name: "Mukhyamantri Mahila Sashaktikaran Quota",
        percentage: 35,
        eligibilityCondition: "35% horizontal reservation across all categories for female candidates with Bihar domicile.",
      },
      {
        id: "bihar_freedom_grandchild",
        name: "Grandchildren of Freedom Fighters Quota",
        percentage: 2,
        eligibilityCondition: "Potra/Potri/Naati/Naatini of freedom fighters receiving pension from Central or Bihar Government.",
      },
    ],
  },

  // RAJASTHAN (RPSC / RSMSSB)
  rajasthan: {
    stateSlug: "rajasthan",
    stateName: "Rajasthan",
    domicileRule: "Rajasthan provides separate MBC (Most Backward Class) quota. Candidates from outside Rajasthan are treated as General category candidates regardless of their caste status in other states.",
    categories: [
      {
        code: "GEN",
        name: "General / Open Competition",
        shortLabel: "General",
        defaultAgeRelaxationYears: 0,
        maxAgeOverride: 40,
        description: "Base upper age limit: 40 Years. Open to all India candidates.",
      },
      {
        code: "EWS",
        name: "Rajasthan Economically Weaker Sections",
        shortLabel: "EWS (Raj)",
        defaultAgeRelaxationYears: 0,
        maxAgeOverride: 40,
        description: "10% state reservation for permanent residents of Rajasthan.",
      },
      {
        code: "OBC",
        name: "Rajasthan Other Backward Classes (NCL)",
        shortLabel: "OBC (Raj)",
        defaultAgeRelaxationYears: 5,
        maxAgeOverride: 45,
        description: "21% state quota. Male candidates get +5 yrs (45 yrs), Female candidates get +10 yrs (50 yrs).",
      },
      {
        code: "MBC",
        name: "Most Backward Classes (Gujjar & Allied)",
        shortLabel: "MBC (Gujjar)",
        defaultAgeRelaxationYears: 5,
        maxAgeOverride: 45,
        description: "5% state quota for 5 designated communities in Rajasthan.",
      },
      {
        code: "SC",
        name: "Scheduled Castes (Rajasthan)",
        shortLabel: "SC (Raj)",
        defaultAgeRelaxationYears: 5,
        maxAgeOverride: 45,
        feeConcessionPercentage: 50,
        description: "16% state quota. Male candidates get +5 yrs (45 yrs), Female candidates get +10 yrs (50 yrs).",
      },
      {
        code: "ST",
        name: "Scheduled Tribes (Rajasthan Non-TSP)",
        shortLabel: "ST (Non-TSP)",
        defaultAgeRelaxationYears: 5,
        maxAgeOverride: 45,
        feeConcessionPercentage: 50,
        description: "12% state quota in non-tribal sub-plan areas.",
      },
      {
        code: "SAHARIYA",
        name: "Sahariya Primitive Tribe (Baran District)",
        shortLabel: "Sahariya",
        defaultAgeRelaxationYears: 5,
        maxAgeOverride: 45,
        description: "Special state quota for Sahariya indigenous community in Shahbad & Kishanganj tehsils.",
      },
    ],
    specialQuotas: [
      {
        id: "tsp_area",
        name: "Tribal Sub-Plan (TSP) Local Resident Quota",
        percentage: 45,
        eligibilityCondition: "Domicile resident of scheduled tribal areas in Banswara, Dungarpur, Pratapgarh, and Udaipur.",
      },
      {
        id: "raj_women",
        name: "Rajasthan Domicile Women Quota",
        percentage: 30,
        eligibilityCondition: "Horizontal reservation for female candidates of Rajasthan across categories.",
      },
    ],
  },

  // MAHARASHTRA (MPSC)
  maharashtra: {
    stateSlug: "maharashtra",
    stateName: "Maharashtra",
    domicileRule: "Maharashtra recognizes SBC, VJ-A, NT-B, NT-C, NT-D, and SEBC. Out-of-state candidates are evaluated purely under the Open category without fee or age benefits.",
    categories: [
      {
        code: "OPEN",
        name: "Open Category (General)",
        shortLabel: "Open",
        defaultAgeRelaxationYears: 0,
        maxAgeOverride: 38,
        description: "Base upper age limit is 38 Years for civil and state services.",
      },
      {
        code: "EWS",
        name: "Maharashtra EWS",
        shortLabel: "EWS (Maha)",
        defaultAgeRelaxationYears: 5,
        maxAgeOverride: 43,
        description: "10% state reservation with age relaxation up to 43 Years.",
      },
      {
        code: "OBC",
        name: "Other Backward Classes (Maharashtra)",
        shortLabel: "OBC (Maha)",
        defaultAgeRelaxationYears: 5,
        maxAgeOverride: 43,
        description: "19% state reservation. Relaxed up to 43 Years with valid Non-Creamy Layer.",
      },
      {
        code: "SEBC",
        name: "Socially and Educationally Backward Classes",
        shortLabel: "SEBC",
        defaultAgeRelaxationYears: 5,
        maxAgeOverride: 43,
        description: "10% quota under Maharashtra SEBC Act for Maratha and designated communities.",
      },
      {
        code: "SBC",
        name: "Special Backward Classes (SBC)",
        shortLabel: "SBC",
        defaultAgeRelaxationYears: 5,
        maxAgeOverride: 43,
        description: "2% state quota for designated coastal and artisan communities.",
      },
      {
        code: "VJ_A",
        name: "Vimukta Jati (VJ-A / Denotified Tribes)",
        shortLabel: "VJ-A",
        defaultAgeRelaxationYears: 5,
        maxAgeOverride: 43,
        description: "3% state quota for 14 denotified tribes.",
      },
      {
        code: "NT_B",
        name: "Nomadic Tribes B (NT-B)",
        shortLabel: "NT-B",
        defaultAgeRelaxationYears: 5,
        maxAgeOverride: 43,
        description: "2.5% state quota for nomadic pastoral communities.",
      },
      {
        code: "NT_C",
        name: "Nomadic Tribes C (NT-C / Dhangar)",
        shortLabel: "NT-C",
        defaultAgeRelaxationYears: 5,
        maxAgeOverride: 43,
        description: "3.5% state quota for Dhangar and allied nomadic groups.",
      },
      {
        code: "NT_D",
        name: "Nomadic Tribes D (NT-D / Vanjari)",
        shortLabel: "NT-D",
        defaultAgeRelaxationYears: 5,
        maxAgeOverride: 43,
        description: "2% state quota for Vanjari community.",
      },
      {
        code: "SC",
        name: "Scheduled Castes (Maharashtra)",
        shortLabel: "SC (Maha)",
        defaultAgeRelaxationYears: 5,
        maxAgeOverride: 43,
        feeConcessionPercentage: 100,
        description: "13% state quota with age limit relaxed up to 43 Years.",
      },
      {
        code: "ST",
        name: "Scheduled Tribes (Maharashtra)",
        shortLabel: "ST (Maha)",
        defaultAgeRelaxationYears: 5,
        maxAgeOverride: 43,
        feeConcessionPercentage: 100,
        description: "7% state quota with age limit relaxed up to 43 Years.",
      },
    ],
    specialQuotas: [
      {
        id: "maha_women",
        name: "Maharashtra Women Parallel Reservation",
        percentage: 30,
        eligibilityCondition: "30% parallel reservation across categories for female candidates with Maharashtra domicile.",
      },
      {
        id: "maha_orphan",
        name: "Anath (Orphan) Quota",
        percentage: 1,
        eligibilityCondition: "Recognized state orphan certificate issued by Women and Child Development Department.",
      },
    ],
  },

  // TAMIL NADU (TNPSC / TNUSRB)
  tamilnadu: {
    stateSlug: "tamilnadu",
    stateName: "Tamil Nadu",
    domicileRule: "Tamil Nadu maintains a 69% reservation structure with distinct MBC/DNC, BCM, and SCA categories. Non-Tamil Nadu candidates are classified exclusively under General Turn (GT).",
    categories: [
      {
        code: "GT",
        name: "General Turn (GT / Open Competition)",
        shortLabel: "GT (General)",
        defaultAgeRelaxationYears: 0,
        description: "31% open competition for all Indian candidates based on merit.",
      },
      {
        code: "BC",
        name: "Backward Classes (Other than BC Muslims)",
        shortLabel: "BC",
        defaultAgeRelaxationYears: 3,
        description: "26.5% quota in Tamil Nadu public services.",
      },
      {
        code: "BCM",
        name: "Backward Class Muslims (BCM)",
        shortLabel: "BCM",
        defaultAgeRelaxationYears: 3,
        description: "3.5% exclusive state quota for Muslim backward communities.",
      },
      {
        code: "MBC_DNC",
        name: "Most Backward Classes / Denotified Communities",
        shortLabel: "MBC / DNC",
        defaultAgeRelaxationYears: 3,
        description: "20% state quota in Tamil Nadu.",
      },
      {
        code: "SC",
        name: "Scheduled Castes (Tamil Nadu)",
        shortLabel: "SC (TN)",
        defaultAgeRelaxationYears: 5,
        feeConcessionPercentage: 100,
        description: "15% state quota. Full exam fee concession.",
      },
      {
        code: "SCA",
        name: "Scheduled Castes Arunthathiyar",
        shortLabel: "SC (Arunthathiyar)",
        defaultAgeRelaxationYears: 5,
        feeConcessionPercentage: 100,
        description: "3% preferential quota within the SC category for Arunthathiyar community.",
      },
      {
        code: "ST",
        name: "Scheduled Tribes (Tamil Nadu)",
        shortLabel: "ST (TN)",
        defaultAgeRelaxationYears: 5,
        feeConcessionPercentage: 100,
        description: "1% state quota with fee waiver.",
      },
    ],
    specialQuotas: [
      {
        id: "pstm_tamil",
        name: "Persons Studied in Tamil Medium (PSTM)",
        percentage: 20,
        eligibilityCondition: "Completed entire prescribed qualification (SSLC, HSC, or Degree) in Tamil medium.",
      },
    ],
  },
};

/**
 * Retrieves the appropriate reservation ruleset based on stateSlug.
 * Defaults to Central / All-India if the state does not have an explicit custom roster.
 */
export function getStateReservationRules(stateSlug?: string): StateReservationRuleset {
  if (!stateSlug || stateSlug === "central") {
    return CENTRAL_RESERVATION_RULESET;
  }
  return STATE_RESERVATIONS_REGISTRY[stateSlug.toLowerCase()] || {
    ...CENTRAL_RESERVATION_RULESET,
    stateSlug,
    stateName: stateSlug.toUpperCase(),
    domicileRule: `Caste reservations for ${stateSlug.toUpperCase()} state recruitments apply strictly to state residents. Out-of-state candidates must apply under General (UR).`,
  };
}
