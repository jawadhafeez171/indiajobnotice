import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { TricolorCapsule } from "@/components/common/BrandLogo";
import { 
  GraduationCap, 
  Calendar, 
  Calculator, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Printer, 
  Code, 
  Download, 
  ExternalLink,
  BookOpen,
  School,
  Library
} from "lucide-react";

export const metadata: Metadata = {
  title: "Free Resources for College Placement Cells, Libraries & Coaching Centres",
  description: "Free, embeddable, and printable public-interest recruitment resources: Deadline Calendar, Qualification Vacancy Tracker, Cutoff Date Age Calculator, and State Commission Directory for campus notice boards.",
  alternates: {
    canonical: "https://www.indiajobnotice.com/for-colleges-libraries",
  },
  openGraph: {
    title: "Institutional Resources for Placement Cells & Libraries - IndiaJobNotice",
    description: "Equip your students with verified recruitment tools: deadline calendar, qualification tracker, cutoff age calculator, and state directory.",
    url: "https://www.indiajobnotice.com/for-colleges-libraries",
    siteName: "India Job Notice",
    locale: "en_IN",
    type: "website",
  },
};

export default function ForCollegesLibrariesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Institutional Resources for College Placement Cells, Libraries & Coaching Centres",
    description: "Public-interest government employment tools and printable bulletins for educational institutions.",
    url: "https://www.indiajobnotice.com/for-colleges-libraries",
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F1ECE1]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar currentStateSlug="central" />

      {/* Hero Header */}
      <section className="border-b border-[#D5CAB5] bg-[#FCFAF4] py-10 sm:py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-2.5">
            <TricolorCapsule className="w-14 h-1.5" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#1E3799] font-bold">
              Educational & Public Interest Initiative
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1918] tracking-tight">
            Free Recruitment Resources for College Placement Cells, Libraries & Coaching Centres
          </h1>

          <p className="text-sm sm:text-base text-[#3F3B35] mt-3 max-w-3xl leading-relaxed">
            Career guidance cells, university training & placement officers (TPOs), district public libraries, and coaching faculties are welcome to freely reuse, embed, and print our verified public recruitment resources to support students.
          </p>

          <div className="mt-4 flex items-center gap-3 text-xs text-[#17803A] font-bold flex-wrap">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>100% Free & Open Access</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero Artificial Link Schemes / Google Spam-Policy Compliant</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Printer className="w-4 h-4" />
              <span>Printable Campus Notice Board Bulletins</span>
            </span>
          </div>
        </div>
      </section>

      {/* 4 Core Link-Worthy Resources */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resource 1: Recruitment Deadline Calendar */}
          <div className="bg-white rounded-xl border border-[#D5CAB5] p-6 shadow-2xs flex flex-col justify-between hover:border-[#1E3799] transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-lg bg-[#EEF2FA] text-[#1E3799] flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-mono font-bold text-[#1E3799] bg-[#EEF2FA] px-2 py-0.5 rounded border border-[#CCD8F0]">
                  Resource #1
                </span>
              </div>

              <h2 className="font-serif text-xl font-bold text-[#1A1918]">
                Recruitment Exam & Deadline Calendar
              </h2>

              <p className="text-xs text-[#3F3B35] leading-relaxed">
                A unified, continuously updated calendar tracking upcoming application deadlines, CBT exam dates, and admit card releases across UPSC, SSC, Railways, Banking, and State PSCs.
              </p>

              <div className="bg-[#FCFAF4] p-3 rounded-lg border border-[#D5CAB5] text-xs space-y-1.5 text-[#3E3C38]">
                <span className="font-bold text-[#1E3799] block font-mono text-[11px] uppercase">
                  Institutional Utilities:
                </span>
                <p>• One-click <code>.ics</code> calendar feed download for student smartphone sync.</p>
                <p>• Responsive embeddable widget for college career portals and intranet websites.</p>
                <p>• Print-ready monthly and weekly agenda for physical library and department notice boards.</p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#E2D8C6] flex items-center justify-between">
              <Link
                href="/calendar"
                className="font-bold text-xs text-[#1E3799] hover:underline flex items-center gap-1"
              >
                <span>Open Deadline Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-[11px] font-mono text-[#4F4A43]">/calendar</span>
            </div>
          </div>

          {/* Resource 2: Qualification-Wise Vacancy Tracker */}
          <div className="bg-white rounded-xl border border-[#D5CAB5] p-6 shadow-2xs flex flex-col justify-between hover:border-[#1E3799] transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-lg bg-[#FDF3EB] text-[#B84D0A] flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-mono font-bold text-[#B84D0A] bg-[#FDF3EB] px-2 py-0.5 rounded border border-[#F9D9C3]">
                  Resource #2
                </span>
              </div>

              <h2 className="font-serif text-xl font-bold text-[#1A1918]">
                Qualification-Wise Vacancy Tracker
              </h2>

              <p className="text-xs text-[#3F3B35] leading-relaxed">
                Live matrix aggregating verified government vacancies segmented strictly by education level (10th Pass, 12th Pass, Diploma/Polytechnic, General Degree, and B.Tech Engineering).
              </p>

              <div className="bg-[#FCFAF4] p-3 rounded-lg border border-[#D5CAB5] text-xs space-y-1.5 text-[#3E3C38]">
                <span className="font-bold text-[#B84D0A] block font-mono text-[11px] uppercase">
                  Institutional Utilities:
                </span>
                <p>• TPO placement officers can instantly see how many active posts match their graduating batch.</p>
                <p>• Pay scale breakdown and statutory age limit ranges per educational tier.</p>
                <p>• Formatted campus noticeboard bulletin ready for black-and-white printing.</p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#E2D8C6] flex items-center justify-between">
              <Link
                href="/vacancies"
                className="font-bold text-xs text-[#B84D0A] hover:underline flex items-center gap-1"
              >
                <span>Open Vacancy Tracker</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-[11px] font-mono text-[#4F4A43]">/vacancies</span>
            </div>
          </div>

          {/* Resource 3: Notification Cut-off Date Age Calculator */}
          <div className="bg-white rounded-xl border border-[#D5CAB5] p-6 shadow-2xs flex flex-col justify-between hover:border-[#1E3799] transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-lg bg-[#EDF7F0] text-[#17803A] flex items-center justify-center font-bold">
                  <Calculator className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-mono font-bold text-[#17803A] bg-[#EDF7F0] px-2 py-0.5 rounded border border-[#C6E7D0]">
                  Resource #3
                </span>
              </div>

              <h2 className="font-serif text-xl font-bold text-[#1A1918]">
                Notification Cut-off Date Age Calculator
              </h2>

              <p className="text-xs text-[#3F3B35] leading-relaxed">
                Unlike generic age calculators that compute age as of today, this engine evaluates candidates strictly against each notification’s statutory cut-off reference date (e.g. 1st August for UPSC/SSC or 1st July for Police).
              </p>

              <div className="bg-[#FCFAF4] p-3 rounded-lg border border-[#D5CAB5] text-xs space-y-1.5 text-[#3E3C38]">
                <span className="font-bold text-[#17803A] block font-mono text-[11px] uppercase">
                  Institutional Utilities:
                </span>
                <p>• Eliminates candidate disqualifications caused by edge-case cutoff date miscalculations.</p>
                <p>• Automatically applies official reservation category relaxations (OBC +3y, SC/ST +5y, PwD +10y).</p>
                <p>• Free embed snippet for college career websites and student counseling computers.</p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#E2D8C6] flex items-center justify-between">
              <Link
                href="/calculator"
                className="font-bold text-xs text-[#17803A] hover:underline flex items-center gap-1"
              >
                <span>Open Cutoff Calculator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-[11px] font-mono text-[#4F4A43]">/calculator</span>
            </div>
          </div>

          {/* Resource 4: State Recruitment Directory */}
          <div className="bg-white rounded-xl border border-[#D5CAB5] p-6 shadow-2xs flex flex-col justify-between hover:border-[#1E3799] transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-lg bg-[#FAF7EF] text-[#1E3799] flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-mono font-bold text-[#1E3799] bg-[#FAF7EF] px-2 py-0.5 rounded border border-[#D5CAB5]">
                  Resource #4
                </span>
              </div>

              <h2 className="font-serif text-xl font-bold text-[#1A1918]">
                State Recruitment Commissions Directory
              </h2>

              <p className="text-xs text-[#3F3B35] leading-relaxed">
                A verified directory of official Public Service Commissions (KPSC, UPPSC, BPSC, MPSC, TNPSC, GPSC), Staff Selection Boards, and State Police Recruitment Boards across all 28 states and union territories.
              </p>

              <div className="bg-[#FCFAF4] p-3 rounded-lg border border-[#D5CAB5] text-xs space-y-1.5 text-[#3E3C38]">
                <span className="font-bold text-[#1E3799] block font-mono text-[11px] uppercase">
                  Institutional Utilities:
                </span>
                <p>• Verified official <code>.gov.in</code> and <code>.nic.in</code> portals to protect students from scam sites.</p>
                <p>• Physical commission headquarters addresses and candidate telephone helplines.</p>
                <p>• Direct cross-links to state recruitment gazettes and domicile eligibility rules.</p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#E2D8C6] flex items-center justify-between">
              <Link
                href="/directory"
                className="font-bold text-xs text-[#1E3799] hover:underline flex items-center gap-1"
              >
                <span>Open Commission Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-[11px] font-mono text-[#4F4A43]">/directory</span>
            </div>
          </div>
        </div>

        {/* Ethical Link-Earning Statement Compliant with Google Guidelines */}
        <div className="bg-white rounded-xl border border-[#D5CAB5] p-6 sm:p-7 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-[#17803A]" />
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1A1918]">
                Ethical Link-Earning & Academic Sharing Policy
              </h3>
              <p className="text-xs text-[#4F4A43]">
                Strict adherence to Google Search Central quality guidelines against artificial link schemes
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-[#3F3B35] leading-relaxed">
            <p>
              IndiaJobNotice does <strong>not</strong> purchase backlinks, sponsor directory placements, or engage in private blog networks (PBNs). In accordance with Google’s Webmaster Spam Policies, links must be earned organically through genuinely useful, freely accessible reference tools that human users value.
            </p>
            <p>
              College placement officers, librarians, and educators are encouraged to share these resources on their official websites, digital repositories, and reading room notice boards solely when they serve the genuine career interests of their students.
            </p>
          </div>

          {/* Quick Copy Snippets */}
          <div className="pt-3 border-t border-[#E2D8C6] space-y-2">
            <span className="font-mono text-[12px] uppercase font-bold text-[#1A1918] block">
              Suggested Clean Anchor Text for College Career Portals:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded bg-[#FCFAF4] border border-[#D5CAB5] font-mono text-[12px] text-[#1E3799]">
                &lt;a href=&quot;https://www.indiajobnotice.com/calendar&quot;&gt;Government Exam &amp; Deadline Calendar 2026&lt;/a&gt;
              </div>
              <div className="p-2.5 rounded bg-[#FCFAF4] border border-[#D5CAB5] font-mono text-[12px] text-[#1E3799]">
                &lt;a href=&quot;https://www.indiajobnotice.com/calculator&quot;&gt;Government Job Cut-off Date Age Calculator&lt;/a&gt;
              </div>
              <div className="p-2.5 rounded bg-[#FCFAF4] border border-[#D5CAB5] font-mono text-[12px] text-[#1E3799]">
                &lt;a href=&quot;https://www.indiajobnotice.com/vacancies&quot;&gt;Qualification-Wise Government Vacancy Tracker&lt;/a&gt;
              </div>
              <div className="p-2.5 rounded bg-[#FCFAF4] border border-[#D5CAB5] font-mono text-[12px] text-[#1E3799]">
                &lt;a href=&quot;https://www.indiajobnotice.com/directory&quot;&gt;State Public Service Commissions Directory&lt;/a&gt;
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
