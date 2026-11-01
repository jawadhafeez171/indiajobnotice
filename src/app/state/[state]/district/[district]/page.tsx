import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { JobCard } from "@/components/jobs/JobCard";
import { ReservedAdSlot } from "@/components/ads/ReservedAdSlot";
import { TricolorCapsule } from "@/components/common/BrandLogo";
import { DistrictSelectorBar } from "@/components/common/DistrictSelectorBar";
import { getStateBySlug, getStateBadgeColor } from "@/config/states";
import { 
  DISTRICTS_REGISTRY, 
  getDistrictBySlug, 
  getDistrictsByState,
  getMajorDistricts 
} from "@/config/districts";
import { getJobsByDistrict, getListingJobs } from "@/data/jobs";
import { getAllJobs } from "@/lib/jobs-store";

import { getCentralPortalUrl } from "@/lib/subdomains";
import { cn } from "@/lib/utils";
import { 
  MapPin, 
  ExternalLink, 
  Building2, 
  Scale, 
  Stethoscope, 
  ShieldAlert, 
  Briefcase, 
  ChevronRight,
  Info,
  CheckCircle2
} from "lucide-react";

interface PageProps {
  params: Promise<{
    state: string;
    district: string;
  }>;
}

export async function generateStaticParams() {
  return DISTRICTS_REGISTRY.map((d) => ({
    state: d.stateSlug,
    district: d.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { state: stateSlug, district: districtSlug } = await params;
  const state = getStateBySlug(stateSlug);
  const district = getDistrictBySlug(stateSlug, districtSlug);

  if (!state || !district) {
    return { title: "District Not Found" };
  }

  const canonicalUrl = `https://www.indiajobnotice.com/state/${state.slug}/district/${district.slug}`;
  const nativeSuffix = district.nativeName ? ` (${district.nativeName})` : "";

  return {
    title: `${district.name} Govt Job Notifications 2026, District Court & Collectorate Jobs`,
    description: `Official public recruitment gazettes for ${district.name}${nativeSuffix}, ${state.name}. Verified circulars for District & Sessions Court, CMO Health Society (NHM), Collectorate, and state commission posts with ${district.name} posting.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${district.name} Government Jobs - IndiaJobNotice`,
      description: `Official job alerts, exam schedules, and circulars for ${district.name}, ${state.name}.`,
      url: canonicalUrl,
      siteName: "India Job Notice",
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${district.name} Govt Job Notifications`,
      description: `Official recruitment gazettes for ${district.name}, ${state.name}. District Court, CMO & Collectorate posts.`,
    },
  };
}

export default async function DistrictPage({ params }: PageProps) {
  const { state: stateSlug, district: districtSlug } = await params;
  const state = getStateBySlug(stateSlug);
  const district = getDistrictBySlug(stateSlug, districtSlug);

  if (!state || !district) {
    notFound();
  }

  const jobs = getJobsByDistrict(getListingJobs(await getAllJobs()), state.slug, district.slug, true);
  const badgeStyle = getStateBadgeColor(state.code);

  // Categorize jobs for intuitive district presentation
  const districtDirectJobs = jobs.filter(
    (j) => j.districtSlug && j.districtSlug.toLowerCase() === district.slug.toLowerCase()
  );
  
  const statewideJobsWithQuota = jobs.filter(
    (j) => !j.districtSlug && j.districtWiseVacancies?.some((v) => v.districtSlug.toLowerCase() === district.slug.toLowerCase())
  );

  const statewideGeneralJobs = jobs.filter(
    (j) => !j.districtSlug && !j.districtWiseVacancies?.some((v) => v.districtSlug.toLowerCase() === district.slug.toLowerCase())
  );

  // Calculate local vacancies total
  const directVacanciesCount = districtDirectJobs.reduce((acc, j) => acc + j.totalVacancies, 0);
  const quotaVacanciesCount = statewideJobsWithQuota.reduce((acc, j) => {
    const quota = j.districtWiseVacancies?.find((v) => v.districtSlug.toLowerCase() === district.slug.toLowerCase());
    return acc + (quota?.vacancies || 0);
  }, 0);
  const totalLocalPositions = directVacanciesCount + quotaVacanciesCount;

  // Other major districts in same state for convenient hopping
  const otherMajorDistricts = getMajorDistricts(state.slug, 8).filter(
    (d) => d.slug !== district.slug
  );

  // Structured Data (JSON-LD Breadcrumbs)
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.indiajobnotice.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${state.name} jobs`,
        item: `https://www.indiajobnotice.com/state/${state.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${district.name} Jobs`,
        item: `https://www.indiajobnotice.com/state/${state.slug}/district/${district.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      <Navbar currentStateSlug={state.slug} />

      {/* District header */}
      <section className="border-b border-line bg-subtle py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-4">
          {/* Breadcrumb Hierarchy */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted flex-wrap">
            <a href={getCentralPortalUrl()} className="hover:text-navy font-medium transition-colors">
              All-India
            </a>
            <span>/</span>
            <Link href={`/state/${state.slug}`} className="hover:text-navy font-medium transition-colors">
              {state.name}
            </Link>
            <span>/</span>
            <span className="text-ink font-bold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-saffron" />
              {district.name} District
            </span>
          </nav>

          {/* District Title, Native Script & Authorities */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink tracking-tight">
                  {district.name} Govt Jobs
                </h1>
                {district.nativeName && (
                  <span className="text-xl font-serif text-muted">
                    {district.nativeName}
                  </span>
                )}
                <span
                  className={cn(
                    "text-xs font-mono px-2 py-0.5 rounded font-bold border",
                    badgeStyle.bg,
                    badgeStyle.text,
                    badgeStyle.border
                  )}
                >
                  {state.code} · District
                </span>
              </div>

              {/* Administrative Geography Meta */}
              <div className="mt-2 flex items-center gap-3 text-xs text-muted flex-wrap font-mono">
                <span>Headquarters: <strong className="text-ink">{district.hq}</strong></span>
                {district.division && (
                  <>
                    <span>·</span>
                    <span>Division: <strong className="text-ink">{district.division}</strong></span>
                  </>
                )}
                <span>·</span>
                <span>State: <Link href={`/state/${state.slug}`} className="text-navy hover:underline font-bold">{state.name}</Link></span>
              </div>

              <p className="mt-2 text-sm text-ink-2 max-w-2xl leading-relaxed">
                {district.description || 
                  `Official recruitment notices and employment gazettes for ${district.name} District, including District & Sessions Court, Chief Medical Officer (CMO/NHM), Collectorate, and state commission posts.`}
              </p>
            </div>

            {/* Official Portal Quick Action Pill */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
              <a
                href={district.officialNicUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-surface border border-line hover:border-navy hover:text-navy text-xs font-bold text-ink shadow-2xs transition-colors"
                title={`Open official ${district.name} district collectorate website`}
              >
                <Building2 className="w-3.5 h-3.5 text-saffron" />
                <span>Visit {district.name} NIC Portal</span>
                <ExternalLink className="w-3 h-3 text-muted" />
              </a>

              <div className="flex items-center justify-between gap-3 px-3 py-1.5 rounded-lg bg-subtle border border-line/80 text-[12px] font-mono text-muted">
                <span>Local Vacancies:</span>
                <span className="font-bold text-navy">
                  {totalLocalPositions > 0 ? `${totalLocalPositions.toLocaleString("en-IN")} Posts` : "Statewide Pool"}
                </span>
              </div>
            </div>
          </div>

          {/* District Switcher Bar for fast horizontal exploration */}
          <DistrictSelectorBar 
            stateSlug={state.slug} 
            stateName={state.name} 
            currentDistrictSlug={district.slug} 
          />
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-10">

        {/* SECTION 1: District-Exclusive Direct Postings */}
        {districtDirectJobs.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-saffron-solid animate-pulse" />
                <h2 className="font-serif text-xl font-bold text-ink">
                  Exclusive {district.name} Direct Postings
                </h2>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-saffron-tint text-saffron border border-saffron-line">
                  {districtDirectJobs.length} Active Notice{districtDirectJobs.length > 1 ? "s" : ""}
                </span>
              </div>
              <span className="text-xs text-muted hidden sm:inline">
                Posting strictly within {district.name} jurisdiction
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {districtDirectJobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  currentStateSlug={state.slug}
                  currentDistrictSlug={district.slug}
                />
              ))}
            </div>
          </section>
        )}

        {/* SECTION 2: Major State Recruitments with Dedicated Quota for this District */}
        {statewideJobsWithQuota.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <TricolorCapsule className="w-8 h-1.5" />
                <h2 className="font-serif text-xl font-bold text-ink">
                  State Recruitments with {district.name} Vacancy Quotas
                </h2>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-green-tint text-green border border-green-line">
                  District Allotment
                </span>
              </div>
            </div>

            <p className="text-xs text-ink-2">
              These state commission examinations reserve specific rank/cadre posts allocated specifically for posting in {district.name} district.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {statewideJobsWithQuota.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  currentStateSlug={state.slug}
                  currentDistrictSlug={district.slug}
                />
              ))}
            </div>
          </section>
        )}

        {/* Reserved Ad Space (0.00 CLS Protected) */}
        <ReservedAdSlot 
          slotType="leaderboard" 
          slotId={`district-${district.slug}-leaderboard`} 
        />

        {/* SECTION 3: Statewide Recruitments Applicable Across All Districts */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl font-bold text-ink">
                All {state.name} jobs open to candidates from {district.name}
              </h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-line text-ink-2">
                {statewideGeneralJobs.length} Notice{statewideGeneralJobs.length > 1 ? "s" : ""}
              </span>
            </div>
            <Link 
              href={`/state/${state.slug}`} 
              className="text-xs font-bold text-navy hover:underline flex items-center gap-1"
            >
              <span>All {state.name} jobs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {statewideGeneralJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                currentStateSlug={state.slug}
                currentDistrictSlug={district.slug}
              />
            ))}
          </div>
        </section>

        {/* SECTION 4: Local District Recruitment Authority Directory & Verification Guide */}
        <section className="bg-surface rounded-lg border border-line p-5 shadow-2xs space-y-5">
          <div className="border-b border-line-soft pb-3">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-navy" />
              <h3 className="font-serif text-base font-bold text-ink">
                Key Public Recruitment Authorities in {district.name} District
              </h3>
            </div>
            <p className="text-xs text-muted">
              Candidates in {district.name} should watch these four constitutional and departmental offices for local notices, contract recruitments, and walk-in interviews:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* 1. District Court */}
            <div className="p-3.5 rounded-lg border border-line bg-subtle flex flex-col justify-between space-y-2">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-ink">
                  <Scale className="w-4 h-4 text-navy" />
                  <span>District & Sessions Court</span>
                </div>
                <p className="text-[12px] text-muted leading-relaxed">
                  Stenographer, Peon, Process Server & Junior Clerk recruitments via eCourts.
                </p>
              </div>
              <a
                href={`https://districts.ecourts.gov.in`}
                target="_blank"
                rel="noreferrer"
                className="text-[12px] font-bold text-navy hover:underline inline-flex items-center gap-1 pt-1"
              >
                <span>Check eCourts {district.name}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* 2. CMO / NHM Health Society */}
            <div className="p-3.5 rounded-lg border border-line bg-subtle flex flex-col justify-between space-y-2">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-ink">
                  <Stethoscope className="w-4 h-4 text-green" />
                  <span>District Health Society (NHM)</span>
                </div>
                <p className="text-[12px] text-muted leading-relaxed">
                  CMO office walk-in interviews for Staff Nurse, ANM, Lab Technician & CHO.
                </p>
              </div>
              <a
                href={district.officialNicUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[12px] font-bold text-green hover:underline inline-flex items-center gap-1 pt-1"
              >
                <span>View CMO Notices</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* 3. Collectorate / DM Office */}
            <div className="p-3.5 rounded-lg border border-line bg-subtle flex flex-col justify-between space-y-2">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-ink">
                  <Building2 className="w-4 h-4 text-saffron" />
                  <span>District Collectorate (DM)</span>
                </div>
                <p className="text-[12px] text-muted leading-relaxed">
                  Revenue department, Patwari/Lekhpal verification, DRDA & Zilla Parishad tenders.
                </p>
              </div>
              <a
                href={district.officialNicUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[12px] font-bold text-saffron hover:underline inline-flex items-center gap-1 pt-1"
              >
                <span>Official NIC Notice Board</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* 4. District Rojgar Karyalaya */}
            <div className="p-3.5 rounded-lg border border-line bg-subtle flex flex-col justify-between space-y-2">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-ink">
                  <Briefcase className="w-4 h-4 text-muted" />
                  <span>District Employment Exchange</span>
                </div>
                <p className="text-[12px] text-muted leading-relaxed">
                  Zilla Rojgar Mela registration, apprenticeship drives & unemployment allowances.
                </p>
              </div>
              <Link
                href={`/state/${state.slug}`}
                className="text-[12px] font-bold text-navy hover:underline inline-flex items-center gap-1 pt-1"
              >
                <span>State Exchange Portal</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="bg-subtle p-3 rounded border border-line text-[12px] text-ink-2 flex items-start gap-2">
            <Info className="w-4 h-4 text-navy shrink-0 mt-0.5" />
            <span>
              <strong>Authenticity Verification Note:</strong> IndiaJobNotice only lists verified gazettes. Always cross-check offline application submissions with the District Magistrate (DM) office notice board or the official NIC domain (<code>{district.slug}.nic.in</code>).
            </span>
          </div>
        </section>

        {/* SECTION 5: Neighboring / Major Districts in {state.name} */}
        {otherMajorDistricts.length > 0 && (
          <section className="space-y-3">
            <h3 className="font-serif text-sm font-bold text-ink flex items-center gap-2">
              <MapPin className="w-4 h-4 text-saffron" />
              <span>Explore Neighboring & Major District Hubs in {state.name}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {otherMajorDistricts.map((od) => (
                <Link
                  key={od.slug}
                  href={`/state/${state.slug}/district/${od.slug}`}
                  className="p-2.5 rounded bg-surface border border-line hover:border-navy hover:bg-subtle transition-colors block text-center shadow-2xs group"
                >
                  <span className="font-bold text-ink group-hover:text-navy block truncate">
                    {od.name}
                  </span>
                  {od.nativeName && (
                    <span className="text-[11px] text-muted block truncate">
                      {od.nativeName}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
