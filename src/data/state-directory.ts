import { STATES_REGISTRY, StateInfo } from "@/config/states";

export interface CommissionEntry {
  name: string;
  shortCode: string;
  type: "PSC" | "SSB" | "POLICE" | "EDUCATION" | "MUNICIPAL";
  portalUrl: string;
  helpline: string;
  headquarters: string;
}

export interface StateDirectoryRecord {
  state: StateInfo;
  region: "North" | "South" | "East" | "West" | "Central" | "North-East" | "UT";
  apexPSC: CommissionEntry;
  subordinateBoard?: CommissionEntry;
  policeBoard?: CommissionEntry;
  verifiedOfficialDomain: string;
}

export const STATE_DIRECTORY_DATA: StateDirectoryRecord[] = [
  // KARNATAKA
  {
    state: STATES_REGISTRY.find((s) => s.slug === "karnataka")!,
    region: "South",
    verifiedOfficialDomain: "kpsc.kar.nic.in",
    apexPSC: {
      name: "Karnataka Public Service Commission",
      shortCode: "KPSC",
      type: "PSC",
      portalUrl: "https://kpsc.kar.nic.in",
      helpline: "080-30574957 / 30574901",
      headquarters: "Udyoga Soudha, Bengaluru - 560001",
    },
    subordinateBoard: {
      name: "Karnataka Examinations Authority",
      shortCode: "KEA",
      type: "SSB",
      portalUrl: "https://cetonline.karnataka.gov.in/kea",
      helpline: "080-23460460",
      headquarters: "18th Cross, Sampige Road, Malleshwaram, Bengaluru",
    },
    policeBoard: {
      name: "Karnataka State Police Recruitment Cell",
      shortCode: "KSP",
      type: "POLICE",
      portalUrl: "https://ksp-recruitment.in",
      helpline: "080-22942200",
      headquarters: "Chief Office, Nrupathunga Road, Bengaluru",
    },
  },

  // UTTAR PRADESH
  {
    state: STATES_REGISTRY.find((s) => s.slug === "up")!,
    region: "North",
    verifiedOfficialDomain: "uppsc.up.nic.in",
    apexPSC: {
      name: "Uttar Pradesh Public Service Commission",
      shortCode: "UPPSC",
      type: "PSC",
      portalUrl: "https://uppsc.up.nic.in",
      helpline: "0532-2407216 / 2407624",
      headquarters: "10, Kasturba Gandhi Marg, Prayagraj - 211018",
    },
    subordinateBoard: {
      name: "UP Subordinate Services Selection Commission",
      shortCode: "UPSSSC",
      type: "SSB",
      portalUrl: "https://upsssc.gov.in",
      helpline: "0522-2720814",
      headquarters: "Picup Bhawan, Vibhuti Khand, Gomti Nagar, Lucknow",
    },
    policeBoard: {
      name: "UP Police Recruitment and Promotion Board",
      shortCode: "UPPRPB",
      type: "POLICE",
      portalUrl: "https://uppbpb.gov.in",
      helpline: "0522-2235752",
      headquarters: "Tulsi Ganga Complex, 19C Vidhan Sabha Marg, Lucknow",
    },
  },

  // BIHAR
  {
    state: STATES_REGISTRY.find((s) => s.slug === "bihar")!,
    region: "East",
    verifiedOfficialDomain: "bpsc.bih.nic.in",
    apexPSC: {
      name: "Bihar Public Service Commission",
      shortCode: "BPSC",
      type: "PSC",
      portalUrl: "https://bpsc.bih.nic.in",
      helpline: "0612-2215795",
      headquarters: "15, Jawaharlal Nehru Marg, Bailey Road, Patna - 800001",
    },
    subordinateBoard: {
      name: "Bihar Staff Selection Commission",
      shortCode: "BSSC",
      type: "SSB",
      portalUrl: "https://bssc.bihar.gov.in",
      helpline: "0612-2227727",
      headquarters: "Veterinary College Campus, Patna - 800014",
    },
    policeBoard: {
      name: "Central Selection Board of Constable",
      shortCode: "CSBC",
      type: "POLICE",
      portalUrl: "https://csbc.bih.nic.in",
      helpline: "0612-2233711",
      headquarters: "Harding Road, Near Secretariat Halt, Patna",
    },
  },

  // RAJASTHAN
  {
    state: STATES_REGISTRY.find((s) => s.slug === "rajasthan")!,
    region: "West",
    verifiedOfficialDomain: "rpsc.rajasthan.gov.in",
    apexPSC: {
      name: "Rajasthan Public Service Commission",
      shortCode: "RPSC",
      type: "PSC",
      portalUrl: "https://rpsc.rajasthan.gov.in",
      helpline: "0145-2635200 / 2635212",
      headquarters: "Ghooghara Ghati, Jaipur Road, Ajmer - 305001",
    },
    subordinateBoard: {
      name: "Rajasthan Staff Selection Board",
      shortCode: "RSMSSB",
      type: "SSB",
      portalUrl: "https://rsmssb.rajasthan.gov.in",
      helpline: "0141-2722520",
      headquarters: "State Institute of Agriculture Management premises, Durgapura, Jaipur",
    },
    policeBoard: {
      name: "Rajasthan Police Recruitment Wing",
      shortCode: "RajPolice",
      type: "POLICE",
      portalUrl: "https://police.rajasthan.gov.in",
      helpline: "0141-2740784",
      headquarters: "Police Headquarters, Lal Kothi, Jaipur",
    },
  },

  // MADHYA PRADESH
  {
    state: STATES_REGISTRY.find((s) => s.slug === "mp")!,
    region: "Central",
    verifiedOfficialDomain: "mppsc.mp.gov.in",
    apexPSC: {
      name: "Madhya Pradesh Public Service Commission",
      shortCode: "MPPSC",
      type: "PSC",
      portalUrl: "https://mppsc.mp.gov.in",
      helpline: "0731-2496800",
      headquarters: "Residency Area, Indore - 452001",
    },
    subordinateBoard: {
      name: "MP Employees Selection Board (MPESB / Vyapam)",
      shortCode: "MPESB",
      type: "SSB",
      portalUrl: "https://esb.mp.gov.in",
      helpline: "0755-2578801",
      headquarters: "Chayan Bhawan, Main Road No. 1, Chinar Park East, Bhopal",
    },
    policeBoard: {
      name: "MP Police Selection Branch",
      shortCode: "MPPolice",
      type: "POLICE",
      portalUrl: "https://mppolice.gov.in",
      helpline: "0755-2443000",
      headquarters: "Jahangirabad, Bhopal - 462008",
    },
  },

  // MAHARASHTRA
  {
    state: STATES_REGISTRY.find((s) => s.slug === "maharashtra")!,
    region: "West",
    verifiedOfficialDomain: "mpsc.gov.in",
    apexPSC: {
      name: "Maharashtra Public Service Commission",
      shortCode: "MPSC",
      type: "PSC",
      portalUrl: "https://mpsc.gov.in",
      helpline: "022-22102222",
      headquarters: "5th, 7th & 8th Floor, Cooperage Telephone Exchange Bldg, Maharshi Karve Road, Mumbai",
    },
    policeBoard: {
      name: "Maharashtra Police Bharti Cell",
      shortCode: "MahaPolice",
      type: "POLICE",
      portalUrl: "https://mahapolice.gov.in",
      helpline: "022-22026636",
      headquarters: "Old Council Hall, Shaheed Bhagat Singh Road, Colaba, Mumbai",
    },
  },

  // TAMIL NADU
  {
    state: STATES_REGISTRY.find((s) => s.slug === "tn")!,
    region: "South",
    verifiedOfficialDomain: "tnpsc.gov.in",
    apexPSC: {
      name: "Tamil Nadu Public Service Commission",
      shortCode: "TNPSC",
      type: "PSC",
      portalUrl: "https://tnpsc.gov.in",
      helpline: "044-25300300 / 1800 425 1002",
      headquarters: "TNPSC Road, VOC Nagar, Park Town, Chennai - 600003",
    },
    policeBoard: {
      name: "Tamil Nadu Uniformed Services Recruitment Board",
      shortCode: "TNUSRB",
      type: "POLICE",
      portalUrl: "https://tnusrb.tn.gov.in",
      helpline: "044-28413658",
      headquarters: "Old Commissioner Office Campus, Pantheon Road, Egmore, Chennai",
    },
  },

  // WEST BENGAL
  {
    state: STATES_REGISTRY.find((s) => s.slug === "wb")!,
    region: "East",
    verifiedOfficialDomain: "psc.wb.gov.in",
    apexPSC: {
      name: "Public Service Commission, West Bengal",
      shortCode: "WBPSC",
      type: "PSC",
      portalUrl: "https://psc.wb.gov.in",
      helpline: "033-24197715",
      headquarters: "161-A, S.P. Mukherjee Road, Kolkata - 700026",
    },
    policeBoard: {
      name: "West Bengal Police Recruitment Board",
      shortCode: "WBPRB",
      type: "POLICE",
      portalUrl: "https://prb.wb.gov.in",
      helpline: "033-23214200",
      headquarters: "Araksha Bhawan, 5th Floor, Block-DJ, Sector-II, Salt Lake City, Kolkata",
    },
  },

  // HARYANA
  {
    state: STATES_REGISTRY.find((s) => s.slug === "haryana")!,
    region: "North",
    verifiedOfficialDomain: "hssc.gov.in",
    apexPSC: {
      name: "Haryana Public Service Commission",
      shortCode: "HPSC",
      type: "PSC",
      portalUrl: "https://hpsc.gov.in",
      helpline: "0172-2560755",
      headquarters: "Bays 1-10, Block B, Sector 4, Panchkula - 134112",
    },
    subordinateBoard: {
      name: "Haryana Staff Selection Commission",
      shortCode: "HSSC",
      type: "SSB",
      portalUrl: "https://hssc.gov.in",
      helpline: "0172-5143700",
      headquarters: "Bays No. 67-70, Sector-2, Panchkula",
    },
  },

  // PUNJAB
  {
    state: STATES_REGISTRY.find((s) => s.slug === "punjab")!,
    region: "North",
    verifiedOfficialDomain: "ppsc.gov.in",
    apexPSC: {
      name: "Punjab Public Service Commission",
      shortCode: "PPSC",
      type: "PSC",
      portalUrl: "https://ppsc.gov.in",
      helpline: "0175-5014847",
      headquarters: "Baradari Garden, Patiala - 147001",
    },
    subordinateBoard: {
      name: "Punjab Subordinate Services Selection Board",
      shortCode: "PSSSB",
      type: "SSB",
      portalUrl: "https://sssb.punjab.gov.in",
      helpline: "0172-2298000",
      headquarters: "Forest Complex, Sector 68, SAS Nagar (Mohali)",
    },
  },

  // GUJARAT
  {
    state: STATES_REGISTRY.find((s) => s.slug === "gujarat")!,
    region: "West",
    verifiedOfficialDomain: "gpsc.gujarat.gov.in",
    apexPSC: {
      name: "Gujarat Public Service Commission",
      shortCode: "GPSC",
      type: "PSC",
      portalUrl: "https://gpsc.gujarat.gov.in",
      helpline: "079-23258980",
      headquarters: "Sector 10-A, Near Chh Road, Gandhinagar - 382010",
    },
    subordinateBoard: {
      name: "Gujarat Subordinate Service Selection Board",
      shortCode: "GSSSB",
      type: "SSB",
      portalUrl: "https://gsssb.gujarat.gov.in",
      helpline: "079-23253504",
      headquarters: "Block No. 2, 1st Floor, Karmayogi Bhavan, Sector 10-A, Gandhinagar",
    },
  },

  // JHARKHAND
  {
    state: STATES_REGISTRY.find((s) => s.slug === "jharkhand")!,
    region: "East",
    verifiedOfficialDomain: "jpsc.gov.in",
    apexPSC: {
      name: "Jharkhand Public Service Commission",
      shortCode: "JPSC",
      type: "PSC",
      portalUrl: "https://jpsc.gov.in",
      helpline: "0651-2213009",
      headquarters: "Circular Road, Ranchi - 834001",
    },
    subordinateBoard: {
      name: "Jharkhand Staff Selection Commission",
      shortCode: "JSSC",
      type: "SSB",
      portalUrl: "https://jssc.nic.in",
      helpline: "0651-2490126",
      headquarters: "Kalinagar, Chai Bagan, Namkum, Ranchi - 834010",
    },
  },
];

// Helper to get directory record by state slug
export function getStateDirectoryRecord(slug: string): StateDirectoryRecord | undefined {
  return STATE_DIRECTORY_DATA.find((r) => r.state && r.state.slug === slug);
}
