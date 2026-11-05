import React from "react";
import Link from "next/link";
import { JobNotification, ageText, payText } from "@/data/jobs";
import { PostList, SharedValues } from "./PostList";
import {
  getJobPostBreakdown,
  getJobCategoryMatrix,
  PostVacancyBreakdown,
  CategoryStatutoryMatrixItem,
} from "@/lib/exam-details";
import { ShieldCheck } from "lucide-react";
import { ReservationTable } from "./ReservationTable";

interface Props {
  job: JobNotification;
}

const card = "bg-surface rounded-xl border border-line p-5 sm:p-6 shadow-2xs scroll-mt-32 md:scroll-mt-44";
const th = "py-2.5 px-3.5 font-bold";
const h3 = "text-sm font-bold text-ink";

/** Whether the posts card has anything to show (the jump links leave it out otherwise). */
export function hasPostsCard(job: JobNotification): boolean {
  return getJobPostBreakdown(job).length > 0 || job.totalVacancies > 0 || Boolean(job.salary)
    || (job.selectionProcess || []).some((t) => t.trim()) || Boolean(job.reservation?.rows.length)
    || getJobCategoryMatrix(job).length > 0;
}

// The notification's details below the key facts, in one card: the posts with their pay (and what
// differs by post), the vacancies by category, category-wise fees and age relaxation, and the
// selection process. Each part appears only when the notice gives it.
export function ExecutiveNotificationDigest({ job }: Props) {
  const posts = getJobPostBreakdown(job);
  const categories = getJobCategoryMatrix(job);
  const steps = (job.selectionProcess || [])
    .map((t) => t.trim().replace(/[,;:.]+$/, ""))
    .filter(Boolean)
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1));
  // A value every post shares is said once above the list, and not at all when "Who can apply"
  // already says it (null: it differs by post, so it gets a column; "": already said above). Pay is
  // said only here.
  const quals = job.qualifications.filter(Boolean);
  const sharedOf = (k: "qualification" | "ageLimit" | "payLevel", inKeyFacts: string[]): string | null => {
    const vals = new Set(posts.map((p) => p[k]));
    if (vals.size !== 1) return null;
    const v = [...vals][0];
    return v === "See notification" || inKeyFacts.includes(v) ? "" : v;
  };
  const shared: SharedValues = {
    qualification: sharedOf("qualification", [quals[0] || "", quals.join("; ")]),
    ageLimit: sharedOf("ageLimit", [ageText(job)]) === null ? null : "",
    payLevel: ((v) => (v ? payText(v) : v))(sharedOf("payLevel", [])),
  };

  if (!hasPostsCard(job)) return null;
  const hasPostList = posts.length > 0 || job.totalVacancies > 0 || Boolean(job.salary);
  return (
    <section id="posts" aria-labelledby="posts-h" className={card}>
      <h2 id="posts-h" className="font-serif text-lg font-bold text-ink">{hasPostList ? "Posts and selection" : "Selection process"}</h2>
      <div className="mt-4 space-y-6">
        {posts.length > 0 && (
          <PostList
            rows={posts.map((p: PostVacancyBreakdown) => ({
              ...p,
              vacancies: String(p.vacancies),
              payLevel: p.payLevel === "See notification" ? p.payLevel : payText(p.payLevel),
            }))}
            shared={shared}
          />
        )}
        {posts.length === 0 && (job.totalVacancies > 0 || job.salary) && (
          <dl className="text-sm text-ink-2 space-y-1">
            <div>
              <dt className="inline font-bold text-ink">Posts: </dt>
              <dd className="inline">{job.totalVacancies ? job.totalVacancies.toLocaleString("en-IN") : "See notification"}</dd>
            </div>
            {job.salary && (
              <div>
                <dt className="inline font-bold text-ink">Pay: </dt>
                <dd className="inline">{payText(job.salary)}</dd>
              </div>
            )}
          </dl>
        )}

        <ReservationTable job={job} />

        {categories.length > 0 && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h3 className={`${h3} flex items-center gap-2`}>
                <ShieldCheck className="w-4 h-4 text-green" />
                Fees and age relaxation by category
              </h3>
              <Link href="/calculator" className="text-xs font-bold text-saffron hover:underline shrink-0">
                Check your age →
              </Link>
            </div>
            <div className="overflow-x-auto rounded-lg border border-line">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-subtle border-b border-line text-[12px] uppercase tracking-wide text-muted">
                  <tr>
                    <th className={th}>Category</th>
                    <th className={th}>Fee</th>
                    <th className={th}>Age relaxation</th>
                    <th className={th}>Maximum age</th>
                    <th className={th}>Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-soft text-ink">
                  {categories.map((item: CategoryStatutoryMatrixItem, idx: number) => (
                    <tr key={idx}>
                      <td className="py-3 px-3.5 font-bold">{item.category}</td>
                      <td className="py-3 px-3.5">{item.fee}</td>
                      <td className="py-3 px-3.5">{item.ageRelaxation}</td>
                      <td className="py-3 px-3.5">{item.maxEligibleAge}</td>
                      <td className="py-3 px-3.5 text-ink-2">{item.exemptionNote}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {steps.length > 0 && (
          <div>
            {hasPostList && <h3 className={h3}>Selection process</h3>}
            {steps.length === 1 ? (
              <p className="mt-1 text-sm text-ink max-w-prose">{steps[0]}</p>
            ) : (
              <ol className="mt-1 list-decimal pl-5 space-y-1 text-sm text-ink max-w-prose marker:font-bold marker:text-navy">
                {steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
