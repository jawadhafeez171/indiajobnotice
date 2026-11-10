import { JobNotification, isOpenOrOpening } from "@/data/jobs";
import { getStateBySlug, StateInfo } from "@/config/states";
import { 
  QUALIFICATION_HUBS, 
  SECTOR_HUBS, 
  ORGANISATION_HUBS,
  CategoryHubInfo 
} from "@/data/permanent-categories";

export interface TaxonomyLink {
  label: string;
  href: string;
  type: "state" | "qualification" | "organisation" | "sector";
  badge?: string;
  description?: string;
}

export interface RelatedOpportunity {
  job: JobNotification;
  relationshipReason: string;
  relationshipType: "organisation" | "state" | "sector" | "qualification";
}

/**
 * Returns deliberate internal taxonomy links for a given job.
 * Every job deliberately connects to:
 * 1. Relevant state hub (/government-jobs/[state] and /state/[state])
 * 2. Relevant organisation hub (/organisations/ssc, upsc, railways-rrb, etc.)
 * 3. Relevant qualification hub (/qualification/12th-pass, diploma, graduate, 10th-pass)
 * 4. Relevant sector hub (/engineering-jobs, /police-defense-jobs, etc.)
 */
export function getJobTaxonomyLinks(job: JobNotification): {
  stateHub?: TaxonomyLink;
  stateDirHub?: TaxonomyLink;
  organisationHub?: TaxonomyLink;
  qualificationHubs: TaxonomyLink[];
  sectorHub?: TaxonomyLink;
  breadcrumbTrail: Array<{ label: string; href: string }>;
} {
  const result: {
    stateHub?: TaxonomyLink;
    stateDirHub?: TaxonomyLink;
    organisationHub?: TaxonomyLink;
    qualificationHubs: TaxonomyLink[];
    sectorHub?: TaxonomyLink;
    breadcrumbTrail: Array<{ label: string; href: string }>;
  } = {
    qualificationHubs: [],
    breadcrumbTrail: [{ label: "Home", href: "/" }],
  };

  // 1. STATE LINKS
  let stateInfo: StateInfo | null = null;
  if (!job.isCentral && job.stateSlug) {
    stateInfo = getStateBySlug(job.stateSlug) || null;
    if (stateInfo) {
      result.stateHub = {
        label: `${stateInfo.name} Govt Jobs Hub`,
        href: `/government-jobs/${stateInfo.slug}`,
        type: "state",
        badge: `${stateInfo.name} State`,
        description: `All active and upcoming recruitment gazettes in ${stateInfo.name}`,
      };
      result.stateDirHub = {
        label: `${stateInfo.name} Portal`,
        href: `/state/${stateInfo.slug}`,
        type: "state",
      };
    }
  } else {
    result.stateHub = {
      label: "All-India Central Jobs",
      href: "/",
      type: "state",
      badge: "Central Govt",
      description: "All-India central government circulars and gazettes",
    };
  }

  // 2. ORGANISATION LINKS
  const orgCode = job.orgShortCode.toUpperCase();
  const orgName = job.organization.toLowerCase();

  if (orgCode === "SSC" || orgName.includes("staff selection")) {
    result.organisationHub = {
      label: "Staff Selection Commission (SSC) Hub",
      href: "/organisations/ssc",
      type: "organisation",
      badge: "SSC Commission",
      description: "CGL, CHSL, GD Constable, MTS and CPO examinations",
    };
  } else if (orgCode === "UPSC" || orgName.includes("union public service")) {
    result.organisationHub = {
      label: "Union Public Service Commission (UPSC) Hub",
      href: "/organisations/upsc",
      type: "organisation",
      badge: "UPSC Apex",
      description: "Civil Services (IAS/IPS), NDA, CDS, and Central Group A drives",
    };
  } else if (orgCode === "RRB" || orgName.includes("railway")) {
    result.organisationHub = {
      label: "Railway Recruitment Boards (RRB) Hub",
      href: "/organisations/railways-rrb",
      type: "organisation",
      badge: "Indian Railways",
      description: "NTPC, ALP, Group D, and Junior Engineer centralized notices",
    };
  } else if (orgCode === "SBI" || orgCode === "IBPS" || orgName.includes("bank")) {
    result.organisationHub = {
      label: "IBPS & Bank Recruitment Hub",
      href: "/organisations/banking-ibps",
      type: "organisation",
      badge: "Banks",
      description: "SBI PO, Clerk, IBPS CRP, and Regional Rural Bank examinations",
    };
  } else if (stateInfo && /public service commission/.test(orgName)) {
    result.organisationHub = {
      label: `${stateInfo.name} Public Service Commissions`,
      href: `/organisations/state-psc`,
      type: "organisation",
      badge: "State PSC",
      description: `State civil service, police board and municipal recruitment in ${stateInfo.name}`,
    };
  }

  // 3. QUALIFICATION LINKS
  const qStr = job.qualifications.join(" ").toLowerCase();
  const titleStr = job.title.toLowerCase();
  // whole words only: "po" is in "posts", "je" in "subject"
  const titleHas = (w: string) => new RegExp(`\\b${w}\\b`).test(titleStr);

  if (qStr.includes("graduate") || qStr.includes("degree") || qStr.includes("bachelor") || titleHas("cgl") || titleHas("po")) {
    result.qualificationHubs.push({
      label: "Graduate (Degree) Govt Jobs",
      href: "/qualification/graduate",
      type: "qualification",
      badge: "Bachelor's Degree",
      description: "Premier administrative and officer cadre recruitments",
    });
  }
  if (qStr.includes("12th") || qStr.includes("10+2") || qStr.includes("intermediate") || /\bpuc\b|pre-university|higher secondary/.test(qStr) || titleHas("chsl") || titleStr.includes("constable")) {
    result.qualificationHubs.push({
      label: "12th Pass (10+2) Govt Jobs",
      href: "/qualification/12th-pass",
      type: "qualification",
      badge: "12th Intermediate",
      description: "Clerical, police constable, and technical entry circulars",
    });
  }
  if (qStr.includes("diploma") || qStr.includes("polytechnic") || titleStr.includes("junior engineer") || titleHas("je")) {
    result.qualificationHubs.push({
      label: "Diploma Polytechnic Govt Jobs",
      href: "/qualification/diploma",
      type: "qualification",
      badge: "Polytechnic / Diploma",
      description: "Junior engineer and technical assistant posts across boards",
    });
  }
  if (qStr.includes("10th") || qStr.includes("matric") || qStr.includes("high school") || titleStr.includes("mts") || titleStr.includes("group d") || titleStr.includes("gd constable")) {
    result.qualificationHubs.push({
      label: "10th Pass (Matriculation) Jobs",
      href: "/qualification/10th-pass",
      type: "qualification",
      badge: "10th High School",
      description: "Large-scale uniformed and staff appointments",
    });
  }

  // no fallback: a qualification hub only when the notice's qualification names one

  // 4. SECTOR / DOMAIN LINKS
  if (job.category === "Engineering / Technical" || titleStr.includes("engineer") || titleHas("je")) {
    result.sectorHub = {
      label: "Government Engineering Jobs 2026",
      href: "/engineering-jobs",
      type: "sector",
      badge: "Engineering & Technical",
      description: "AE, JE, and technical gazettes for B.Tech & Diploma engineers",
    };
  } else if (job.category === "Police / Defense" || titleStr.includes("police") || titleStr.includes("constable") || titleStr.includes("nda") || titleStr.includes("cds")) {
    result.sectorHub = {
      label: "Police & Defense Government Jobs",
      href: "/police-defense-jobs",
      type: "sector",
      badge: "Uniformed Services",
      description: "Armed forces, paramilitary CAPF, and state police drives",
    };
  } else if (job.category === "Railways" || orgName.includes("railway")) {
    result.sectorHub = {
      label: "Indian Railway Recruitment (RRB)",
      href: "/railway-jobs",
      type: "sector",
      badge: "Indian Railways",
      description: "CEN notifications across all 21 Zonal Railway Boards",
    };
  } else if (job.category === "Banking / Insurance" || orgName.includes("bank")) {
    result.sectorHub = {
      label: "Banking & Insurance Jobs",
      href: "/banking-jobs",
      type: "sector",
      badge: "Banking & Finance",
      description: "Probationary officers, clerical cadres, and specialist officers",
    };
  } else if (job.category === "Teaching / Education" || titleStr.includes("teacher") || titleStr.includes("ctet")) {
    result.sectorHub = {
      label: "Teaching & School Education Jobs",
      href: "/teaching-jobs",
      type: "sector",
      badge: "Teaching & Education",
      description: "PRT, TGT, PGT, and state teacher eligibility exams",
    };
  }

  // 5. CONSTRUCT DELIBERATE HIERARCHICAL BREADCRUMB
  // Example requested: Karnataka jobs → Karnataka engineering jobs → Individual recruitment
  if (stateInfo) {
    result.breadcrumbTrail.push({
      label: `${stateInfo.name} Jobs`,
      href: `/government-jobs/${stateInfo.slug}`,
    });

    if (result.sectorHub) {
      result.breadcrumbTrail.push({
        label: result.sectorHub.label,
        href: result.sectorHub.href,
      });
    } else if (result.qualificationHubs.length > 0) {
      result.breadcrumbTrail.push({
        label: result.qualificationHubs[0].label,
        href: result.qualificationHubs[0].href,
      });
    }
  } else {
    // Central jobs hierarchy
    if (result.organisationHub) {
      result.breadcrumbTrail.push({
        label: result.organisationHub.badge || result.organisationHub.label,
        href: result.organisationHub.href,
      });
    }
    if (result.sectorHub) {
      result.breadcrumbTrail.push({
        label: result.sectorHub.label,
        href: result.sectorHub.href,
      });
    } else if (result.qualificationHubs.length > 0) {
      result.breadcrumbTrail.push({
        label: result.qualificationHubs[0].label,
        href: result.qualificationHubs[0].href,
      });
    }
  }

  result.breadcrumbTrail.push({
    label: job.shortTitle,
    href: job.isCentral ? `/jobs/${job.slug}` : `/state/${job.stateSlug}/jobs/${job.slug}`,
  });

  return result;
}

/**
 * Returns genuinely related opportunities for a given job.
 * Scored by matching:
 * 1. Same recruiting commission / organisation (Tier 1)
 * 2. Same state administration (Tier 2)
 * 3. Same category / sector (Tier 3)
 * 4. Same qualification tier (Tier 4)
 */
export function getGenuinelyRelatedOpportunities(
  jobs: JobNotification[],
  currentJob: JobNotification,
  limit: number = 4
): RelatedOpportunity[] {
  const scored: Array<{ job: JobNotification; score: number; reason: string; type: RelatedOpportunity["relationshipType"] }> = [];
  // someone on an open notice is looking for jobs to apply to: only open (or opening) ones, never past
  // recruitments' results (11 Nov, owner's choice); a closed notice's page may still show its body's others
  const currentOpen = isOpenOrOpening(currentJob);

  for (const candidate of jobs) {
    if (candidate.id === currentJob.id) continue;
    if (currentOpen && !isOpenOrOpening(candidate)) continue;

    let score = 0;
    let reason = "";
    let type: RelatedOpportunity["relationshipType"] = "sector";

    // 1. Same Organisation (Highest Relevance)
    if (candidate.orgShortCode.toUpperCase() === currentJob.orgShortCode.toUpperCase() && currentJob.orgShortCode !== "Central") {
      score += 50;
      reason = "Same organisation";
      type = "organisation";
    }
    // 2. Same State (High Relevance for State Aspirants)
    else if (!currentJob.isCentral && candidate.stateSlug === currentJob.stateSlug) {
      const state = getStateBySlug(currentJob.stateSlug);
      score += 40;
      reason = `Also in ${state ? state.name : currentJob.stateSlug.toUpperCase()}`;
      type = "state";
    }
    // 3 and 4 only within the same reach (central with central, or the same state): an Andhra
    // engineering post is not "similar" to an all-India bank post
    else if (candidate.isCentral !== currentJob.isCentral || (!currentJob.isCentral && candidate.stateSlug !== currentJob.stateSlug)) {
      // a state notice's page may suggest open all-India jobs of the same kind (anyone may apply to those)
      if (!(currentOpen && candidate.isCentral && candidate.category === currentJob.category)) continue;
      score += 10;
      reason = `All-India ${currentJob.category.toLowerCase()}`;
      type = "sector";
    }
    // 3. Same Category / Sector
    else if (candidate.category === currentJob.category) {
      score += 30;
      reason = `Also ${currentJob.category.toLowerCase()}`;
      type = "sector";
    }
    // 4. Same Minimum Qualification
    else {
      const hasSharedQual = candidate.qualifications.some((q) =>
        currentJob.qualifications.some((cq) => cq.toLowerCase() === q.toLowerCase())
      );
      if (hasSharedQual) {
        score += 20;
        reason = "Same qualification";
        type = "qualification";
      }
    }

    // Boost if currently accepting applications; other bodies' closed notices are not suggested
    const candidateOpen = isOpenOrOpening(candidate);
    if (candidateOpen) {
      score += 15;
    } else if (type !== "organisation") {
      continue;
    }

    if (score > 0) {
      scored.push({ job: candidate, score, reason, type });
    }
  }

  // Sort by score descending, then by viewsCount
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.job.viewsCount - a.job.viewsCount;
  });

  return scored.slice(0, limit).map((s) => ({
    job: s.job,
    relationshipReason: s.reason,
    relationshipType: s.type,
  }));
}

const KK = { code: "KK" as const, label: "Kalyana Karnataka local cadre (KK)" };
const RPC = { code: "RPC" as const, label: "residual parent cadre (RPC)" };

/**
 * Karnataka recruitments come as two notices of one round: posts in the Kalyana Karnataka local
 * cadre (KK) and in the residual parent cadre (RPC). Which one this is: from its title, else its
 * advert number ("ED/KEA/42/NE.A/2026 (RPC)", "…/2026 (ಕೆಕೆ)"), else KEA's page for it
 * (".../wcwdkk2026.aspx"); titles often leave it out (5 Nov: the two Women Supervisor notices).
 */
export function noticeArea(job: Pick<JobNotification, "title"> & Partial<Pick<JobNotification, "advtNo" | "officialPdfUrl">>):
  { code: "KK" | "RPC"; label: string } | null {
  if (/\bKK\b|kalyana[ -]karnataka/i.test(job.title)) return KK;
  if (/\bRPC\b|residual parent cadre/i.test(job.title)) return RPC;
  const advt = job.advtNo || "";
  if (/\bKK\b|ಕೆ\.?ಕೆ/i.test(advt)) return KK;
  if (/\bRPC\b|ಆರ್‌?\.?ಪಿ\.?ಸಿ/i.test(advt)) return RPC;
  const url = job.officialPdfUrl || "";
  if (/karnataka\.gov\.in/i.test(url)) {
    if (/[a-z]kk\d{4}|[_/-]kk[_.\d/-]/i.test(url)) return KK;
    if (/rpc\d{4}|[_/-]rpc[_.\d/-]/i.test(url)) return RPC;
  }
  return null;
}

/** The title without its KK / RPC part: the same for both notices of one round. */
function roundKey(title: string): string {
  return title
    .replace(/\b(KK|RPC)\b|kalyana[ -]karnataka|residual parent cadre/gi, "")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
}

/**
 * KEA's page for a notice without its KK / RPC part (".../kea/wcwdkk2026.aspx" and ".../wcwdrpc2026.aspx"
 * give the same key): one round's notices often have different titles but pages named alike.
 */
function roundPageKey(url: string | undefined): string | null {
  if (!url || !/karnataka\.gov\.in/i.test(url)) return null;
  try {
    const path = new URL(url).pathname.toLowerCase();
    const key = path.replace(/kk|rpc/g, "");
    return key === path ? null : key;
  } catch {
    return null;
  }
}

/** The other notice(s) of the same round (KK for an RPC notice and the other way round). */
export function getSiblingNotices(jobs: JobNotification[], job: JobNotification): JobNotification[] {
  const area = noticeArea(job);
  if (!area) return [];
  const key = roundKey(job.title);
  const page = roundPageKey(job.officialPdfUrl);
  return jobs.filter((j) => {
    if (j.id === job.id || j.organization !== job.organization) return false;
    const other = noticeArea(j);
    if (!other || other.code === area.code) return false;
    return roundKey(j.title) === key || (!!page && roundPageKey(j.officialPdfUrl) === page);
  });
}
