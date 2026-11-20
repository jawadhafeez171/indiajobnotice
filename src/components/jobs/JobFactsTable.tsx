"use client";

import React, { useState } from "react";
import { ExternalLink } from "lucide-react";
import { JobNotification, ageText, formatFee, isJobApplicationClosed, payText } from "@/data/jobs";
import { formatDate } from "@/lib/utils";
import { getJobPostBreakdown } from "@/lib/exam-details";
import { getStateBySlug } from "@/config/states";
import { AgeCheck } from "./AgeCheck";
import { qualificationLabel } from "./JobListCard";
import { CopyLink, Linked, datesHeading, datesOf, hasEligibility, hasFeeSection } from "./JobFactSections";
import { PageRef } from "./NoticeTables";
import { hasPostsCard, hasSelection } from "./ExecutiveNotificationDigest";

// The whole job as one table of two columns: what the fact is, and the fact (owner's choice, 20 Nov: the layout
// candidates know from notice boards). Heading rows across both columns split it into the page's sections and
// carry the ids the "On this page" links jump to. Several values of one fact share a row ("40 marks · 2 h 30 min").
// Only what the notice states; nothing is shown as 0 or blank.

const FIRST = 8;

type Row = { label: React.ReactNode; value: React.ReactNode; key: string; sub?: boolean };
type Section = { id: string; title: string; rows: Row[]; more?: Row[] };

const dot = <span className="mx-1.5 text-faint" aria-hidden>·</span>;
const join = (parts: React.ReactNode[]) =>
  parts.filter((p) => p !== "" && p !== null && p !== undefined && p !== false)
    .map((p, i) => <React.Fragment key={i}>{i > 0 && dot}{p}</React.Fragment>);
const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** A heading row inside a section (an exam's stage, "Vacancies by category"). */
const subhead = (key: string, text: string): Row => ({ key, label: text, value: null, sub: true });

function linkOut(href: string, text: string) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-navy underline underline-offset-2 hover:text-saffron break-all">
      {text} <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
    </a>
  );
}

function hostOf(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; }
}

// --- the sections --------------------------------------------------------------------------------------

function overview(job: JobNotification): Section {
  const f = job.details?.facts || {};
  const rows: Row[] = [{ key: "org", label: "Organisation", value: job.organization }];
  if (job.advtNo) rows.push({ key: "advt", label: "Advt. No.", value: job.advtNo });
  if (job.totalVacancies > 0) rows.push({ key: "total", label: "Total posts", value: <b className="text-ink tabular-nums">{job.totalVacancies.toLocaleString("en-IN")}</b> });
  rows.push({ key: "where", label: "Job location", value: f.postingPlace?.value ? <>{f.postingPlace.value} <PageRef job={job} page={f.postingPlace.page} /></> : job.isCentral ? "Central government (All India)"
    : [job.districtName, getStateBySlug(job.stateSlug)?.name].filter(Boolean).join(", ") || "State government" });
  for (const [k, label] of [["employmentType", "Type of job"], ["contractPeriod", "Contract period"], ["probation", "Probation"], ["bond", "Bond"]] as const) {
    const v = f[k];
    if (v?.value) rows.push({ key: k, label, value: <>{v.value} <PageRef job={job} page={v.page} /></> });
  }
  if (job.isWalkIn) rows.push({ key: "walkin", label: "Selection by", value: "Walk-in interview" });
  return { id: "overview", title: "Overview", rows };
}

function dates(job: JobNotification): Section {
  const { steps, update } = datesOf(job);
  const rows: Row[] = [];
  if (update) {
    rows.push({ key: "update", label: <span className="text-saffron">Update{update.date ? ` (${formatDate(update.date)})` : ""}</span>, value: update.text });
  }
  for (const s of steps) {
    rows.push({
      key: s.key,
      label: s.label,
      value: (
        <>
          <span className={s.when === "now" ? "font-bold text-ink" : s.when === "next" ? "text-ink-2" : "font-semibold text-ink"}>{s.value}</span>
          {s.doc && (
            <span className="mt-1 block text-[13px] text-ink-2">
              {s.doc.summary}
              {s.doc.datesText && <span className="block font-semibold text-saffron">{s.doc.datesText}</span>}
              <span className="mt-1 flex flex-wrap gap-x-4">
                {s.doc.copyName && <CopyLink name={s.doc.copyName} />}
                {linkOut(s.doc.url, "Official document")}
                {s.doc.page && <a href={s.doc.page} className="font-semibold text-navy underline underline-offset-2 hover:text-saffron">Details</a>}
              </span>
            </span>
          )}
        </>
      ),
    });
  }
  return { id: "dates", title: datesHeading(job), rows };
}

function posts(job: JobNotification): Section | null {
  if (!hasPostsCard(job)) return null;
  const d = job.details || {};
  const list = getJobPostBreakdown(job);
  const quals = new Set(list.map((p) => p.qualification));
  const pays = new Set(list.map((p) => p.payLevel));
  const all: Row[] = list.map((p, i) => ({
    key: `p${i}`,
    label: p.postName,
    value: (
      <>
        {/\d/.test(String(p.vacancies))
          ? <b className="text-ink tabular-nums">{p.vacancies} post{String(p.vacancies) === "1" ? "" : "s"}</b>
          : <span className="text-muted">Number in the notice</span>}
        {pays.size > 1 && p.payLevel !== "See notification" && (
          <span className="mt-1 block"><span className="text-muted">Pay: </span>{payText(p.payLevel).replace(/^pay\s*/i, "")}</span>
        )}
        {quals.size > 1 && p.qualification !== "See notification" && (
          <span className="mt-1 block"><span className="text-muted">Qualification: </span>{p.qualification}</span>
        )}
      </>
    ),
  }));
  const rows: Row[] = [];
  if (pays.size === 1 && list.length && [...pays][0] !== "See notification") {
    rows.push({ key: "pay", label: list.length > 1 ? "Pay (all posts)" : "Pay", value: payText([...pays][0]) });
  } else if (!list.length && job.salary) {
    rows.push({ key: "pay", label: "Pay", value: payText(job.salary) });
  }
  if (!list.length && job.totalVacancies > 0) rows.push({ key: "n", label: "Posts", value: job.totalVacancies.toLocaleString("en-IN") });
  rows.push(...all.slice(0, FIRST));
  const more = all.slice(FIRST);

  const extra: Row[] = [];
  const t = job.reservation;
  if (t?.rows.length) {
    extra.push(subhead("res", "Vacancies by category"));
    for (const r of t.rows) {
      extra.push({ key: `res-${r.post}`, label: r.post || "All posts",
        value: join([...t.categories.filter((c) => r.counts[c] !== undefined).map((c) => `${c} ${r.counts[c]}`), <b key="t" className="text-ink">Total {r.total.toLocaleString("en-IN")}</b>]) });
    }
    const hz = t.horizontal;
    if (hz.length) extra.push({ key: "hz", label: "Within these categories", value: join(hz.map((h) => `${h.category} ${h.count}${h.post && t.rows.length > 1 ? ` (${h.post})` : ""}`)) });
  }
  if (d.regionVacancies?.length) {
    const byPost = [...new Set(d.regionVacancies.map((r) => r.post))];
    for (const post of byPost) {
      extra.push(subhead(`reg-${post}`, `Vacancies by district / region${post && byPost.length > 1 ? `: ${post}` : ""}`));
      for (const r of d.regionVacancies.filter((x) => x.post === post)) {
        extra.push({ key: `reg-${post}-${r.region}`, label: r.region, value: <b className="text-ink tabular-nums">{r.count.toLocaleString("en-IN")}</b> });
      }
    }
  }
  const req = (d.postDetails || []).filter((p) => p.experience);
  if (req.length) {
    extra.push(subhead("exp", "Experience required"));
    for (const p of req) extra.push({ key: `exp-${p.post}`, label: p.post, value: <>{p.experience} <PageRef job={job} page={p.page} /></> });
  }
  return { id: "posts", title: "Posts and vacancies", rows: more.length ? rows : [...rows, ...extra], more: more.length ? [...more, ...extra] : undefined };
}

type Limit = NonNullable<JobNotification["ageLimits"]>[number];

/** The printed age limits said once: posts and categories that share a limit are one row. */
function ageRows(limits: Limit[]): Row[] {
  const allPosts = [...new Set(limits.map((l) => l.post).filter(Boolean))];
  const cats = new Set(limits.map((l) => l.category));
  const groups = new Map<string, { min?: number; max: number; category: string; posts: string[] }>();
  for (const l of limits) {
    const key = `${l.category}|${l.min || 0}|${l.max}`;
    const g = groups.get(key) || { min: l.min || undefined, max: l.max, category: l.category, posts: [] };
    if (l.post && !g.posts.includes(l.post)) g.posts.push(l.post);
    groups.set(key, g);
  }
  return [...groups.values()].map((g, i) => {
    const who = [cats.size > 1 ? g.category : "", allPosts.length > 1 ? (g.posts.length === allPosts.length ? "all posts" : g.posts.join("; ")) : ""]
      .filter(Boolean).join(", ") || "All candidates";
    return { key: `age${i}`, label: <span className="tabular-nums">{g.min ? `${g.min} to ${g.max}` : `Up to ${g.max}`} years</span>,
      value: who.charAt(0).toUpperCase() + who.slice(1) };
  });
}

function eligibility(job: JobNotification): Section | null {
  if (!hasEligibility(job)) return null;
  const d = job.details || {};
  const limits = job.ageLimits || [];
  const wording = ageText(job).trim();
  const rows: Row[] = [];
  if (limits.length) {
    rows.push(subhead("age", "Age limit"), ...ageRows(limits));
  } else {
    rows.push({ key: "age", label: "Age limit", value: wording || "See the official notification" });
  }
  if (job.ageAsOn) rows.push({ key: "asOn", label: "Age counted as on", value: formatDate(job.ageAsOn) });
  for (const r of d.ageRelaxations || []) {
    rows.push({ key: `rel-${r.category}`, label: `Relaxation: ${r.category}`, value: <>+{r.years} year{r.years === 1 ? "" : "s"} <PageRef job={job} page={r.page} /></> });
  }
  if (limits.length && wording) rows.push({ key: "ageWords", label: "Age rule as printed", value: wording });
  if (job.ageAsOn && limits.length) {
    rows.push({ key: "ageCheck", label: "Check your age", value: (
      <details className="group">
        <summary className="cursor-pointer list-none font-semibold text-navy hover:text-saffron [&::-webkit-details-marker]:hidden">Enter your date of birth</summary>
        <div className="pt-2"><AgeCheck asOn={job.ageAsOn} limits={limits} /></div>
      </details>
    ) });
  }
  const quals = (job.qualifications || []).filter(Boolean);
  const postQuals = new Set((job.posts || []).map((p) => p.qualification.trim()).filter(Boolean));
  const varies = (postQuals.size > 1 || quals.length > 1) && (job.posts || []).length > 1;
  rows.push({ key: "qual", label: "Qualification", value: varies
    ? <>Differs by post{qualificationLabel(job) && qualificationLabel(job) !== "Varies by post" ? ` (${qualificationLabel(job)})` : ""}: see <a href="#posts" className="font-semibold text-navy underline underline-offset-2">Posts and vacancies</a></>
    : quals.length ? quals.join("; ") : "See the official notification." });
  for (const [k, label] of [["nationality", "Nationality"], ["domicile", "Domicile"], ["language", "Language"]] as const) {
    const v = d.facts?.[k];
    if (v?.value) rows.push({ key: k, label, value: <>{v.value} <PageRef job={job} page={v.page} /></> });
  }
  const other = (d.postDetails || []).filter((p) => p.other);
  if (other.length && other.length <= 3) {
    for (const p of other) rows.push({ key: `oth-${p.post}`, label: other.length > 1 ? `Also needed: ${p.post}` : "Also needed", value: <>{p.other} <PageRef job={job} page={p.page} /></> });
  }
  if (d.physical?.length) {
    rows.push(subhead("phys", "Physical standards"));
    for (const r of d.physical) {
      rows.push({ key: `ph-${r.test}`, label: r.test, value: (
        <>
          {join([r.men && (r.women ? <span key="m"><span className="text-muted">Men:</span> {r.men}</span> : r.men),
            r.women && <span key="w"><span className="text-muted">Women:</span> {r.women}</span>])}
          {r.note && <span className="block text-[13px] text-ink-2">{r.note}</span>}
          {" "}<PageRef job={job} page={r.page} />
        </>
      ) });
    }
  }
  return { id: "eligibility", title: "Who can apply", rows };
}

function fee(job: JobNotification): Section | null {
  if (!hasFeeSection(job)) return null;
  const d = job.details || {};
  const facts = d.facts || {};
  const rows: Row[] = [];
  if (d.fees?.length) {
    rows.push(subhead("fee", "Application fee"));
    for (const f of d.fees) {
      const extra = f.text && f.text.replace(/\.00?(?!\d)/g, "").replace(/[₹\s,/-]|rs\.?|\(?non-refundable\)?|only/gi, "") !== String(f.amount ?? "");
      rows.push({ key: `fee-${f.category}`, label: f.category, value: (
        <>{f.amount === 0 ? <b className="text-green">No fee</b> : f.amount ? <b className="text-ink tabular-nums">{rupees(f.amount)}</b> : f.text}
          {extra && f.amount !== null && <span className="ml-1.5 text-[13px] text-ink-2">({f.text})</span>} <PageRef job={job} page={f.page} /></>
      ) });
    }
  } else {
    rows.push({ key: "fee", label: "Application fee", value: formatFee(job).replace(/\bRs\.?\s*/gi, "₹") });
  }
  if (facts.feePaymentMode?.value) rows.push({ key: "pay", label: "How to pay", value: <>{facts.feePaymentMode.value} <PageRef job={job} page={facts.feePaymentMode.page} /></> });

  if (d.applySteps?.length) {
    rows.push(subhead("apply", "How to apply"));
    d.applySteps.forEach((s, i) => rows.push({ key: `st${i}`, label: `Step ${i + 1}`, value: <>{s.step} <PageRef job={job} page={s.page} /></> }));
  } else {
    rows.push({ key: "apply", label: "How to apply", value: <Linked text={job.howToApply?.trim() || "Apply on the official website. The steps are in the official notification."} /> });
  }
  const docs = d.documents || [];
  let more: Row[] | undefined;
  if (docs.length) {
    const docRows = docs.map((x, i) => ({ key: `doc${i}`, label: `Document ${i + 1}`, value: <>{x.document} <PageRef job={job} page={x.page} /></> }));
    rows.push(subhead("docs", "Documents to keep ready"), ...docRows.slice(0, FIRST));
    if (docRows.length > FIRST) more = docRows.slice(FIRST);
  }
  const help: Row[] = [];
  if (facts.helplinePhone?.value) help.push({ key: "phone", label: "Help desk phone", value: facts.helplinePhone.value });
  if (facts.helplineEmail?.value) {
    const emails = facts.helplineEmail.value.match(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g) || [];
    help.push({ key: "mail", label: "Help desk email", value: emails.length
      ? <span className="break-all">{emails.map((e, i) => <React.Fragment key={e}>{i > 0 && ", "}<a href={`mailto:${e}`} className="text-navy underline underline-offset-2">{e}</a></React.Fragment>)}</span>
      : facts.helplineEmail.value });
  }
  return { id: "fee", title: "Fee and how to apply", rows: more ? rows : [...rows, ...help], more: more ? [...more, ...help] : undefined };
}

function selection(job: JobNotification): Section | null {
  if (!hasSelection(job)) return null;
  const d = job.details || {};
  const own = (d.selectionStages || []).map((s) => s.stage);
  const stages = (own.length ? own : job.selectionProcess || []).map((t) => t.trim().replace(/[,;:.]+$/, "")).filter(Boolean);
  const rows: Row[] = stages.map((t, i) => ({ key: `s${i}`, label: stages.length > 1 ? `Stage ${i + 1}` : "Selection", value: t.charAt(0).toUpperCase() + t.slice(1) }));
  const pattern = d.examPattern || [];
  if (pattern.length) {
    rows.push(subhead("pat", "Exam pattern"));
    const many = new Set(pattern.map((p) => p.stage)).size > 1;
    pattern.forEach((p, i) => {
      if (many && p.stage && (i === 0 || pattern[i - 1].stage !== p.stage)) rows.push({ key: `ps${i}`, label: <span className="font-bold text-navy">{p.stage}</span>, value: null });
      rows.push({ key: `p${i}`, label: p.paper || p.stage || "Paper", value: (
        <>{join([p.questions && `${p.questions} questions`, p.marks && <b key="m" className="text-ink">{p.marks} marks</b>, p.time])} <PageRef job={job} page={p.page} /></>
      ) });
    });
  }
  const neg = d.facts?.negativeMarking;
  if (neg?.value) rows.push({ key: "neg", label: "Negative marking", value: <>{neg.value} <PageRef job={job} page={neg.page} /></> });
  if (d.syllabus?.length) {
    rows.push(subhead("syl", "Syllabus (as printed in the notice)"));
    d.syllabus.forEach((p, i) => {
      const title = [p.stage, p.paper].filter(Boolean).join(" · ") || `Paper ${i + 1}`;
      const list = (
        <ul className="space-y-1">
          {p.topics.map((t, j) => <li key={j} className={t.sub ? "pl-4 text-ink-2" : "text-ink"}>{t.sub ? "– " : ""}{t.text}</li>)}
        </ul>
      );
      rows.push({ key: `syl${i}`, label: title, value: (
        <>
          {p.topics.length > 6 ? (
            <details className="group">
              <summary className="cursor-pointer list-none font-semibold text-navy hover:text-saffron [&::-webkit-details-marker]:hidden">
                Show {p.topics.length} topics
              </summary>
              <div className="pt-2">{list}</div>
            </details>
          ) : list}
          <span className="mt-1 block text-[12px] text-muted">From the notice, <PageRef job={job} page={p.pageFrom} /></span>
        </>
      ) });
    });
  } else if (d.syllabusNote) {
    rows.push({ key: "sylnote", label: "Syllabus", value: d.syllabusNote });
  }
  return { id: "selection", title: own.length || pattern.length ? "Selection and exam" : "Selection process", rows };
}

function links(job: JobNotification): Section {
  const closed = isJobApplicationClosed(job);
  const rows: Row[] = [];
  if (!closed && job.applyOnlineUrl) rows.push({ key: "apply", label: "Apply online", value: linkOut(job.applyOnlineUrl, hostOf(job.applyOnlineUrl)) });
  rows.push({ key: "pdf", label: "Official notification", value: linkOut(job.officialPdfUrl, /\.pdf($|[?#])/i.test(job.officialPdfUrl) ? "Notification (PDF)" : hostOf(job.officialPdfUrl)) });
  if (job.copyName) rows.push({ key: "copy", label: "Our copy", value: <CopyLink name={job.copyName} /> });
  return { id: "links", title: "Important links", rows };
}

// --- the table -----------------------------------------------------------------------------------------

function Rows({ rows }: { rows: Row[] }) {
  return (
    <>
      {rows.map((r) => r.sub ? (
        <tr key={r.key}>
          <th colSpan={2} scope="colgroup" className="bg-subtle px-3 py-2 text-left text-[13px] font-bold text-ink">{r.label}</th>
        </tr>
      ) : r.value === null ? (
        <tr key={r.key}><th colSpan={2} scope="colgroup" className="px-3 pt-3 pb-1 text-left text-[13px]">{r.label}</th></tr>
      ) : (
        <tr key={r.key} className="align-top">
          <th scope="row" className="w-[36%] sm:w-[30%] px-3 py-2.5 text-left font-semibold text-ink-2 break-words">{r.label}</th>
          <td className="px-3 py-2.5 text-ink break-words">{r.value}</td>
        </tr>
      ))}
    </>
  );
}

function SectionBody({ s }: { s: Section }) {
  const [open, setOpen] = useState(false);
  return (
    <tbody className="[&>tr>*]:border [&>tr>*]:border-line">
      <tr>
        <th id={s.id} colSpan={2} scope="colgroup" className="scroll-mt-28 md:scroll-mt-36 bg-navy-tint px-3 py-2.5 text-left">
          <h2 className="font-serif text-lg font-bold text-navy">{s.title}</h2>
        </th>
      </tr>
      <Rows rows={s.rows} />
      {s.more && (open ? <Rows rows={s.more} /> : null)}
      {s.more && (
        <tr className="print:hidden">
          <td colSpan={2} className="px-3 py-1">
            <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open}
              className="min-h-[40px] text-sm font-bold text-navy hover:text-saffron">
              {open ? "Show fewer" : `Show ${s.more.length} more row${s.more.length === 1 ? "" : "s"}`}
            </button>
          </td>
        </tr>
      )}
    </tbody>
  );
}

export function JobFactsTable({ job }: { job: JobNotification }) {
  const sections = [overview(job), dates(job), posts(job), eligibility(job), fee(job), selection(job), links(job)]
    .filter((s): s is Section => Boolean(s && s.rows.length));
  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <table className="w-full table-fixed border-collapse bg-surface text-sm [&_tr>*:first-child]:border-l-0 [&_tr>*:last-child]:border-r-0 [&_tbody:first-child>tr:first-child>*]:border-t-0 [&_tbody:last-child>tr:last-child>*]:border-b-0">
        <caption className="sr-only">{job.title}: the notice in a table</caption>
        {sections.map((s) => <SectionBody key={s.id} s={s} />)}
      </table>
    </div>
  );
}
