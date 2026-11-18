// The 64 hand-written jobs removed on 30 Oct (commit 96d780f), when the site began reading the notice
// agent's published notices. Google still showed their addresses (18 Nov SEO check: the CISF, SSC MTS and
// Patna court pages were among the most shown, all 404). Each one now redirects permanently: to the same
// recruitment's current notice where there is one, else to its organisation, category or state page.
// Covers /jobs/<slug>, /state/<any>/jobs/<slug> and their sub-pages (/eligibility, /result ...).

const UPSC = "/organisations/upsc";
const SSC = "/organisations/ssc";
const SBI = "/organisations/sbi";
const IBPS = "/organisations/banking-ibps";
const RAIL = "/railway-jobs";
const FORCES = "/police-defense-jobs";
const TEACH = "/teaching-jobs";
const BANK = "/banking-jobs";

export const REMOVED_JOBS: Record<string, string> = {
  // central
  "upsc-civil-services-ias-ips-examination-2026": UPSC,
  "ssc-cgl-recruitment-2026": SSC,
  "ssc-gd-constable-recruitment-2026": "/jobs/ssc-constable-gd-in-central-armed-police-forces-capfs-and-11910",
  "railway-rrb-ntpc-recruitment-2026": RAIL,
  "railway-rrb-group-d-level-1-recruitment-2026": RAIL,
  "railway-rrb-alp-technician-recruitment-2026": RAIL,
  "railway-rrb-junior-engineer-recruitment-2026": RAIL,
  "drdo-ceptam-11-sta-b-technician-a-recruitment-2026": "/engineering-jobs",
  "ssc-mts-havaldar-recruitment-2026": SSC,
  "ssc-cpo-sub-inspector-delhi-police-capf-2026": SSC,
  "ssc-chsl-10-plus-2-tier-1-admit-card-2026": SSC,
  "upsc-nda-naval-academy-examination-2026": UPSC,
  "upsc-combined-defence-services-examination-cds-2026": UPSC,
  "indian-navy-ssc-officer-executive-technical-recruitment-2026": FORCES,
  "indian-coast-guard-assistant-commandant-02-2026-batch": FORCES,
  "upsc-capf-assistant-commandant-recruitment-2026": UPSC,
  "sbi-po-probationary-officer-recruitment-2026": SBI,
  "sbi-specialist-cadre-officer-sco-recruitment-2026": SBI,
  "sbi-clerk-junior-associate-recruitment-2026": SBI,
  "ibps-po-mt-recruitment-2026": IBPS,
  "ibps-specialist-officer-so-crp-spl-xiv-recruitment-2026": IBPS,
  "ibps-clerk-crp-clerk-xiv-recruitment-2026": IBPS,
  "rbi-officer-grade-b-general-depr-recruitment-2026": BANK,
  "india-post-gramin-dak-sevak-gds-recruitment-2026": "/",
  "cbse-ctet-central-teacher-eligibility-test-dec-2026": TEACH,
  "kvs-teacher-prt-tgt-pgt-recruitment-2026": TEACH,
  "indian-coast-guard-navik-gd-db-recruitment-2026": "/jobs/ssc-navik-cgept-01-27-navik-cgept-02-27-yantrik-31985",
  "railway-rrb-technician-grade-1-3-recruitment-2026": RAIL,
  "railway-rrb-paramedical-categories-recruitment-2026": RAIL,
  "ssc-chsl-tier-1-result-tier-2-exam-schedule-2026": SSC,
  "ssc-stenographer-grade-c-d-result-cut-off-marks-2026": SSC,
  "ibps-rrb-xiii-officer-scale-1-po-mains-result-2026": IBPS,
  "india-post-postman-mail-guard-mts-recruitment-2026": "/",
  "cisf-constable-tradesman-recruitment-2026": FORCES,
  "itbp-police-telecom-sub-inspector-constable-recruitment-2026": FORCES,
  "aiims-norcet-7-nursing-officer-stage-2-result-allocation-2026": "/",
  "indian-air-force-agniveervayu-intake-01-2027-recruitment": FORCES,
  // states
  "bpsc-school-teacher-tre-3-result-cut-off-2026": "/state/bihar",
  "up-police-sub-inspector-si-civil-police-recruitment-2026": "/state/up",
  "varanasi-district-health-society-cmo-staff-nurse-cho-recruitment-2026": "/state/up",
  "up-police-constable-60244-recruitment": "/state/up",
  "uppsc-combined-state-upper-subordinate-pcs-2026": "/state/up",
  "upsssc-preliminary-eligibility-test-pet-2026": "/state/up",
  "bpsc-70th-combined-competitive-examination-2026": "/state/bihar",
  "bihar-bssc-2nd-inter-level-combined-exam-admit-card-2026": "/state/bihar",
  "patna-district-court-clerk-stenographer-peon-recruitment-2026": "/state/bihar/jobs/patna-stenographer-clerk-peon-orderly-36304",
  "bihar-police-constable-recruitment-2026": "/state/bihar",
  "rajasthan-rpsc-ras-rts-recruitment-2026": "/state/rajasthan",
  "rajasthan-rsmssb-cet-common-eligibility-test-2026": "/state/rajasthan",
  "rajasthan-rsmssb-animal-attendant-pashu-parichar-2026": "/state/rajasthan",
  "jaipur-metropolitan-district-sessions-court-clerk-recruitment-2026": "/state/rajasthan",
  "mppsc-state-service-sse-recruitment-2026": "/state/mp",
  "karnataka-kea-direct-recruitment-4744-posts-2026": "/state/karnataka",
  "bengaluru-urban-district-court-stenographer-typist-peon-recruitment-2026": "/state/karnataka",
  "karnataka-prisons-jail-warder-recruitment-2026": "/state/karnataka",
  "kpsc-kas-gazetted-probationers-319-exam-2026": "/state/karnataka/jobs/kpsc-kas-gazetted-probationers-examination-32342",
  "karnataka-kea-vao-village-administrative-officer-572-exam-2026": "/state/karnataka/jobs/kea-village-administrative-officer-vao-recruitment-posts-27893",
  "karnataka-state-police-cpc-civil-constable-3991-result-2026": "/state/karnataka",
  "kpsc-commercial-tax-inspector-cti-242-result-2026": "/state/karnataka",
  "kpsc-group-b-gazetted-technical-recruitment-2026": "/state/karnataka",
  "delhi-dsssb-tgt-pgt-assistant-teacher-recruitment-2026": "/state/delhi",
  "west-bengal-wb-police-constable-lady-constable-admit-card-2026": "/state/wb",
  "maharashtra-police-constable-bharti-written-exam-merit-list-2026": "/state/maharashtra",
  "haryana-hssc-cet-group-c-d-recruitment-2026": "/state/haryana",
};

export function removedJobRedirects() {
  return Object.entries(REMOVED_JOBS).flatMap(([slug, destination]) => [
    { source: `/jobs/${slug}/:rest*`, destination, permanent: true },
    { source: `/state/:state/jobs/${slug}/:rest*`, destination, permanent: true },
  ]);
}
