import React from "react";
import { JobNotification, payText } from "@/data/jobs";
import { PostList, SharedValues } from "./PostList";
import { getJobPostBreakdown, PostVacancyBreakdown } from "@/lib/exam-details";
import { ReservationTable } from "./ReservationTable";
import { Fold, h2Cls, sectionCls } from "./JobFactSections";

interface Props {
  job: JobNotification;
}

/** Whether the posts section has anything to show (the jump links leave it out otherwise). */
export function hasPostsCard(job: JobNotification): boolean {
  return getJobPostBreakdown(job).length > 0 || job.totalVacancies > 0 || Boolean(job.salary) || Boolean(job.reservation?.rows.length);
}

/** The selection process steps as printed, tidied. */
function selectionSteps(job: JobNotification): string[] {
  return (job.selectionProcess || [])
    .map((t) => t.trim().replace(/[,;:.]+$/, ""))
    .filter(Boolean)
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1));
}

export function hasSelection(job: JobNotification): boolean {
  return selectionSteps(job).length > 0;
}

// The posts with their vacancies, pay and qualification (what differs by post), then the vacancies by
// category folded away. Age is said once, under "Who can apply", not again per post.
export function ExecutiveNotificationDigest({ job }: Props) {
  const posts = getJobPostBreakdown(job);
  // A value every post shares is said once above the list (null: it differs by post, so it gets a column;
  // "": said elsewhere). Qualification is said under "Who can apply" when every post shares it.
  const quals = job.qualifications.filter(Boolean);
  const sharedOf = (k: "qualification" | "payLevel", inKeyFacts: string[]): string | null => {
    const vals = new Set(posts.map((p) => p[k]));
    if (vals.size !== 1) return null;
    const v = [...vals][0];
    return v === "See notification" || inKeyFacts.includes(v) ? "" : v;
  };
  const shared: SharedValues = {
    qualification: sharedOf("qualification", [quals[0] || "", quals.join("; ")]),
    ageLimit: "",
    payLevel: ((v) => (v ? payText(v) : v))(sharedOf("payLevel", [])),
  };

  if (!hasPostsCard(job)) return null;
  return (
    <section id="posts" aria-labelledby="posts-h" className={sectionCls}>
      <h2 id="posts-h" className={h2Cls}>
        Posts and vacancies
        {job.totalVacancies > 0 && <span className="ml-2 font-sans text-base font-semibold text-muted tabular-nums">{job.totalVacancies.toLocaleString("en-IN")}</span>}
      </h2>
      <div className="mt-4 space-y-4">
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
        {Boolean(job.reservation?.rows.length) && (
          <Fold title="Vacancies by category">
            <ReservationTable job={job} />
          </Fold>
        )}
      </div>
    </section>
  );
}

/** How candidates are selected, as the notice says. */
export function SelectionProcess({ job }: Props) {
  const steps = selectionSteps(job);
  if (!steps.length) return null;
  return (
    <section id="selection" aria-labelledby="selection-h" className={sectionCls}>
      <h2 id="selection-h" className={h2Cls}>Selection process</h2>
      {steps.length === 1 ? (
        <p className="mt-3 text-sm text-ink max-w-prose">{steps[0]}</p>
      ) : (
        <ol className="mt-3 list-decimal pl-5 space-y-1 text-sm text-ink max-w-prose marker:font-bold marker:text-navy">
          {steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      )}
    </section>
  );
}
