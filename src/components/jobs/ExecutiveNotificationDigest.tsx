import React from "react";
import { JobNotification, payText } from "@/data/jobs";
import { PostList, SharedValues } from "./PostList";
import { getJobPostBreakdown, PostVacancyBreakdown } from "@/lib/exam-details";
import { ReservationTable } from "./ReservationTable";
import { Fold, h2Cls, h3Cls, sectionCls } from "./JobFactSections";
import { ExamPatternTable, JobTerms, PageRef, PostRequirements, RegionTable, Syllabus } from "./NoticeTables";

interface Props {
  job: JobNotification;
}

/** Whether the posts section has anything to show (the jump links leave it out otherwise). */
export function hasPostsCard(job: JobNotification): boolean {
  return getJobPostBreakdown(job).length > 0 || job.totalVacancies > 0 || Boolean(job.salary) || Boolean(job.reservation?.rows.length);
}

/** The selection process steps as printed, tidied: the notice's own stages when the fuller read has them. */
function selectionSteps(job: JobNotification): string[] {
  const own = (job.details?.selectionStages || []).map((s) => s.stage);
  return (own.length ? own : job.selectionProcess || [])
    .map((t) => t.trim().replace(/[,;:.]+$/, ""))
    .filter(Boolean)
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1));
}

export function hasSelection(job: JobNotification): boolean {
  const d = job.details || {};
  return selectionSteps(job).length > 0 || Boolean(d.examPattern?.length || d.syllabus?.length || d.syllabusNote);
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
        {job.details?.facts && <JobTerms job={job} facts={job.details.facts} />}
        {Boolean(job.reservation?.rows.length) && (
          <Fold title="Vacancies by category">
            <ReservationTable job={job} />
          </Fold>
        )}
        {job.details?.regionVacancies?.length ? (
          <Fold title="Vacancies by district / region">
            <RegionTable job={job} rows={job.details.regionVacancies} />
          </Fold>
        ) : null}
        {job.details?.postDetails?.length ? <PostRequirements job={job} rows={job.details.postDetails} /> : null}
      </div>
    </section>
  );
}

/** How candidates are selected, as the notice says. */
export function SelectionProcess({ job }: Props) {
  const steps = selectionSteps(job);
  const d = job.details || {};
  if (!hasSelection(job)) return null;
  return (
    <section id="selection" aria-labelledby="selection-h" className={sectionCls}>
      <h2 id="selection-h" className={h2Cls}>{d.examPattern?.length || d.syllabus?.length ? "Selection, exam and syllabus" : "Selection process"}</h2>
      {steps.length === 1 ? (
        <p className="mt-3 text-sm text-ink max-w-prose">{steps[0]}</p>
      ) : steps.length > 1 ? (
        <ol className="mt-3 list-decimal pl-5 space-y-1 text-sm text-ink max-w-prose marker:font-bold marker:text-navy">
          {steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      ) : null}
      {d.examPattern?.length ? (
        <div className="mt-6">
          <h3 className={h3Cls}>Exam pattern</h3>
          <ExamPatternTable job={job} rows={d.examPattern} negative={d.facts?.negativeMarking?.value} />
        </div>
      ) : d.facts?.negativeMarking?.value ? (
        <p className="mt-3 text-sm text-ink-2 max-w-prose">
          <b className="font-semibold text-ink">Negative marking:</b> {d.facts.negativeMarking.value}{" "}
          <PageRef job={job} page={d.facts.negativeMarking.page} />
        </p>
      ) : null}
      {d.syllabus?.length ? (
        <div className="mt-6">
          <h3 className={h3Cls}>Syllabus</h3>
          <p className="mt-1 text-[13px] text-muted">As printed in the notice. Open a paper to see its topics.</p>
          <Syllabus job={job} papers={d.syllabus} />
        </div>
      ) : d.syllabusNote ? (
        <p className="mt-4 text-sm text-ink-2 max-w-prose"><b className="font-semibold text-ink">Syllabus:</b> {d.syllabusNote}</p>
      ) : null}
    </section>
  );
}
