import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { TricolorCapsule } from "@/components/common/BrandLogo";
import { ShieldCheck, Lock, Eye, FileText, ExternalLink, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Official privacy policy for IndiaJobNotice.com. Explains data protection practices, log files, cookie policies, Google AdSense & DoubleClick DART cookies, and user rights.",
  alternates: {
    canonical: "https://www.indiajobnotice.com/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy - IndiaJobNotice",
    description: "Data protection, cookies, and transparency practices on IndiaJobNotice.com.",
    url: "https://www.indiajobnotice.com/privacy-policy",
    siteName: "India Job Notice",
    locale: "en_IN",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "October 18, 2026";

  return (
    <div className="min-h-screen flex flex-col bg-[#F1ECE1]">
      <Navbar />

      {/* Editorial Header */}
      <section className="border-b border-[#D5CAB5] bg-[#FCFAF4] py-8 sm:py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-[#4F4A43] mb-3">
            <Link href="/" className="hover:text-[#1E3799] font-medium transition-colors">
              All-India Gazettes
            </Link>
            <span>/</span>
            <span className="text-[#1A1918] font-bold">Privacy Policy</span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <TricolorCapsule className="w-10 h-1.5" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#1E3799] font-bold">
              Compliance & User Trust
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1918] tracking-tight">
            Privacy Policy
          </h1>

          <p className="mt-2 text-xs text-[#4F4A43] font-mono">
            Effective Date & Last Updated: <strong>{lastUpdated}</strong>
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full space-y-8 text-sm text-[#423F3A] leading-relaxed">
        
        {/* Core Commitment Box */}
        <div className="bg-white rounded-lg border border-[#D5CAB5] p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2.5 font-serif font-bold text-[#1A1918] text-base">
            <ShieldCheck className="w-5 h-5 text-[#17803A]" />
            <h2>Our Core Privacy Commitment to Aspirants</h2>
          </div>
          <p className="text-xs text-[#3F3B35] leading-relaxed">
            At <strong>IndiaJobNotice.com</strong>, accessible from <a href="https://www.indiajobnotice.com" className="text-[#1E3799] underline">https://www.indiajobnotice.com</a>, the privacy of our visitors is of paramount importance to us. As an independent public career notice directory, we provide open access to employment notifications without requiring candidate registration, logins, or fees. This Privacy Policy outlines the types of information recorded and how we utilize it in full compliance with Indian and international privacy standards.
          </p>
        </div>

        {/* 1. Information We Collect */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[#1A1918] border-b border-[#D5CAB5] pb-2">
            1. Information We Collect
          </h2>
          <p>
            IndiaJobNotice.com is engineered for anonymous, friction-free browsing. We do not require users to register accounts, share phone numbers, or submit identity proofs (such as Aadhaar, PAN, or voter IDs) to read gazettes or use our eligibility tools.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-[#3F3B35]">
            <li>
              <strong>Standard Log Files:</strong> Like most standard websites, we utilize log files. Information recorded includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamps, referring/exit pages, and number of clicks. This data is not linked to any personally identifiable information and is used exclusively for analyzing traffic patterns, administering the platform, and mitigating denial-of-service threats.
            </li>
            <li>
              <strong>Direct Correspondence:</strong> If you contact our editorial team via email (e.g., to report an errata or request assistance), we may retain your email address and message history solely to reply and correct the circular. We never share or sell correspondence lists.
            </li>
          </ul>
        </section>

        {/* 2. Advertising & Google AdSense Disclosure */}
        <section className="space-y-3 bg-white p-5 rounded-lg border border-[#D5CAB5]">
          <div className="flex items-center gap-2 text-[#B84D0A]">
            <Eye className="w-5 h-5" />
            <h2 className="font-serif text-xl font-bold text-[#1A1918]">
              2. Third-Party Advertising & Google AdSense
            </h2>
          </div>
          <p>
            To keep all recruitment notices, eligibility tools, and district directories 100% free for students and job aspirants across India without charging subscription fees, IndiaJobNotice displays third-party advertisements, primarily through <strong>Google AdSense</strong>.
          </p>
          <div className="space-y-2 text-xs text-[#3F3B35] pl-2 border-l-2 border-[#E96B15]">
            <p>
              <strong>Google DoubleClick DART Cookies:</strong> Google is a third-party vendor on our site. Google uses cookies, including DART cookies, to serve ads to our site visitors based upon their visit to www.indiajobnotice.com and other sites on the internet.
            </p>
            <p>
              <strong>User Opt-Out Rights:</strong> Visitors may choose to decline the use of DART cookies by visiting the Google Ad and Content Network Privacy Policy at the following URL:{" "}
              <a 
                href="https://policies.google.com/technologies/ads" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[#1E3799] underline font-medium inline-flex items-center gap-1"
              >
                <span>Google Ads Privacy Policy</span>
                <ExternalLink className="w-3 h-3" />
              </a>.
            </p>
            <p>
              You can also opt out of personalized advertising from participating networks by visiting{" "}
              <a 
                href="https://www.aboutads.info/choices/" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[#1E3799] underline font-medium"
              >
                AboutAds.info Choices
              </a>.
            </p>
          </div>
          <p className="text-xs text-[#4F4A43]">
            Third-party ad servers or ad networks use technology in their respective advertisements and links that appear on IndiaJobNotice, which are sent directly to users&apos; browsers. They automatically receive your IP address when this occurs. These technologies (such as cookies, JavaScript, or Web Beacons) are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content you see. IndiaJobNotice has no access to or control over cookies used by third-party advertisers.
          </p>
        </section>

        {/* 3. Cookies and Local Storage */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[#1A1918] border-b border-[#D5CAB5] pb-2">
            3. Cookies & Local Browser Storage
          </h2>
          <p>
            IndiaJobNotice utilizes minimal first-party browser storage exclusively for user-requested convenience features:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#3F3B35]">
            <li>
              <strong>Pinned Notices (Watchlist):</strong> When you click the bookmark pin on a notification, that ID is saved locally on your device via <code>localStorage</code> so you can review saved circulars. This never leaves your device and is not transmitted to our servers.
            </li>
            <li>
              <strong>State Filter Preferences:</strong> Used to remember your preferred state or district hub for rapid navigation.
            </li>
          </ul>
          <p className="text-xs text-[#4F4A43]">
            You can choose to disable cookies through your individual browser options. Detailed information about cookie management with specific web browsers can be found at the browsers&apos; respective websites.
          </p>
        </section>

        {/* 4. Third-Party Websites & External Links */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[#1A1918] border-b border-[#D5CAB5] pb-2">
            4. External Government Portals
          </h2>
          <p>
            IndiaJobNotice contains links to external official government websites, such as the Union Public Service Commission (<code>upsc.gov.in</code>), Staff Selection Commission (<code>ssc.gov.in</code>), state public service commissions, District Court portals (<code>*.ecourts.gov.in</code>), and District Collectorate sites (<code>*.nic.in</code>).
          </p>
          <p className="text-xs text-[#3F3B35]">
            Please be aware that IndiaJobNotice has no control over the content, privacy policies, or practices of any external sites. We strongly encourage you to review the privacy statement of every website you visit before providing any personal information.
          </p>
        </section>

        {/* 5. Children's Information Protection */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[#1A1918] border-b border-[#D5CAB5] pb-2">
            5. Children&apos;s Information
          </h2>
          <p>
            Another part of our priority is adding protection for children while using the internet. IndiaJobNotice does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you believe that a child has provided personal information on our website, we strongly encourage you to contact us immediately and we will promptly remove such information from our records.
          </p>
        </section>

        {/* 6. Indian DPDP Act 2023 & International Rights */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[#1A1918] border-b border-[#D5CAB5] pb-2">
            6. Digital Personal Data Protection (DPDP) & User Rights
          </h2>
          <p>
            Under applicable data protection legislation (including India&apos;s Digital Personal Data Protection Act, 2023 and international standards such as GDPR/CCPA where applicable), every user is entitled to the following rights:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#3F3B35]">
            <li><strong>Right to Access:</strong> You have the right to request copies of any personal correspondence or data we hold.</li>
            <li><strong>Right to Rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
            <li><strong>Right to Erasure:</strong> You have the right to request that we erase your personal contact records, under certain conditions.</li>
          </ul>
        </section>

        {/* 7. Contact & Grievance Redressal */}
        <section className="bg-white rounded-lg border border-[#D5CAB5] p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-[#1E3799]">
            <Mail className="w-5 h-5" />
            <h2 className="font-serif text-lg font-bold text-[#1A1918]">
              7. Grievance Officer & Contact Information
            </h2>
          </div>
          <p className="text-xs text-[#3F3B35]">
            If you have any questions, concerns, or requests regarding this Privacy Policy or our compliance practices, please contact our designated Grievance Officer:
          </p>
          <div className="text-xs font-mono space-y-1 bg-[#FCFAF4] p-3 rounded border border-[#D5CAB5] text-[#1A1918]">
            <p><strong>Entity:</strong> IndiaJobNotice.com Editorial & Compliance Team</p>
            <p><strong>Email:</strong> <a href="mailto:contact@indiajobnotice.com" className="text-[#1E3799] underline">contact@indiajobnotice.com</a></p>
            <p><strong>Response Time:</strong> Within 48 hours for privacy or errata queries.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
