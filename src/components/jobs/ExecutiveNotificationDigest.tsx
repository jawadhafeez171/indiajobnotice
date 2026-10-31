import React from "react";
import Link from "next/link";
import { JobNotification } from "@/data/jobs";
import {
  getJobPostBreakdown,
  getJobCategoryMatrix,
  PostVacancyBreakdown,
  CategoryStatutoryMatrixItem,
} from "@/lib/exam-details";
import { GraduationCap, ShieldCheck, Layers } from "lucide-react";

interface Props {
  job: JobNotification;
}

const card = "bg-white rounded-xl border border-[#EAE2D2] p-5 sm:p-6 shadow-2xs space-y-4";
const th = "py-2.5 px-3.5 font-bold";

// The notification's details below the key facts: posts with their eligibility, category-wise fees
// and age relaxation, and the selection process. Each part appears only when the notice gives it.
export function ExecutiveNotificationDigest({ job }: Props) {
  const posts = getJobPostBreakdown(job);
  const categories = getJobCategoryMatrix(job);
  const steps = (job.selectionProcess || []).filter(Boolean).map((t) => t.charAt(0).toUpperCase() + t.slice(1));

  return (
    <section className="space-y-6" id="details">
      {posts.length > 0 && (
        <div className={card}>
          <h2 className="font-serif text-lg font-bold text-[#1A1918] flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#1E3799]" />
            Posts and eligibility
          </h2>
          <ul className="md:hidden space-y-2.5">
            {posts.map((post: PostVacancyBreakdown, idx: number) => (
              <li key={idx} className="p-3.5 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2] text-xs space-y-1.5">
                <p className="font-bold text-sm text-[#1E3799]">
                  {post.postName}
                  {typeof post.vacancies === "number" ? (post.vacancies ? ` · ${post.vacancies} posts` : "") : ` · ${post.vacancies}`}
                </p>
                <p><span className="font-bold text-[#68635B]">Qualification: </span>{post.qualification}</p>
                <p><span className="font-bold text-[#68635B]">Age: </span>{post.ageLimit}</p>
                <p><span className="font-bold text-[#68635B]">Pay: </span>{post.payLevel}</p>
              </li>
            ))}
          </ul>
          <div className="hidden md:block overflow-x-auto rounded-lg border border-[#EAE2D2]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#FAF7EF] border-b border-[#EAE2D2] text-[11px] uppercase tracking-wide text-[#68635B]">
                <tr>
                  <th className={th}>Post</th>
                  <th className={`${th} text-center`}>Posts</th>
                  <th className={`${th} min-w-[200px]`}>Qualification</th>
                  <th className={th}>Age limit</th>
                  <th className={th}>Pay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE1] text-[#1A1918]">
                {posts.map((post: PostVacancyBreakdown, idx: number) => (
                  <tr key={idx} className="align-top">
                    <td className="py-3 px-3.5 font-bold text-[#1E3799]">{post.postName}</td>
                    <td className="py-3 px-3.5 font-bold text-center">
                      {typeof post.vacancies === "number"
                        ? post.vacancies ? post.vacancies.toLocaleString("en-IN") : "—"
                        : post.vacancies}
                    </td>
                    <td className="py-3 px-3.5 leading-relaxed">{post.qualification}</td>
                    <td className="py-3 px-3.5 text-[#524E48]">{post.ageLimit}</td>
                    <td className="py-3 px-3.5 text-[#524E48]">{post.payLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {categories.length > 0 && (
        <div className={card}>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h2 className="font-serif text-lg font-bold text-[#1A1918] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#209948]" />
              Fees and age relaxation by category
            </h2>
            <Link href="/calculator" className="text-xs font-bold text-[#E96B15] hover:underline shrink-0">
              Check your age →
            </Link>
          </div>
          <div className="overflow-x-auto rounded-lg border border-[#EAE2D2]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#FAF7EF] border-b border-[#EAE2D2] text-[11px] uppercase tracking-wide text-[#68635B]">
                <tr>
                  <th className={th}>Category</th>
                  <th className={th}>Fee</th>
                  <th className={th}>Age relaxation</th>
                  <th className={th}>Maximum age</th>
                  <th className={th}>Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE1] text-[#1A1918]">
                {categories.map((item: CategoryStatutoryMatrixItem, idx: number) => (
                  <tr key={idx}>
                    <td className="py-3 px-3.5 font-bold">{item.category}</td>
                    <td className="py-3 px-3.5">{item.fee}</td>
                    <td className="py-3 px-3.5">{item.ageRelaxation}</td>
                    <td className="py-3 px-3.5">{item.maxEligibleAge}</td>
                    <td className="py-3 px-3.5 text-[#524E48]">{item.exemptionNote}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {steps.length > 0 && (
        <div className={card}>
          <h2 className="font-serif text-lg font-bold text-[#1A1918] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#1E3799]" />
            Selection process
          </h2>
          <ol className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {steps.map((step, idx) => (
              <li key={idx} className="p-3.5 rounded-lg bg-[#FCFAF4] border border-[#EAE2D2] text-xs text-[#1A1918]">
                <span className="w-5 h-5 rounded-full bg-[#1E3799] text-white text-[11px] font-bold flex items-center justify-center mb-2">
                  {idx + 1}
                </span>
                <span className="font-semibold leading-snug">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
