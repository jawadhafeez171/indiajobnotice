"use client";

import React, { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { JobNotification, ageText, formatFee, getJobCanonicalPath, isJobApplicationClosed, payText } from "@/data/jobs";
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

/** strong: a row that decides whether to apply (the last date), set apart from the rest */
/** stack: on phones the label runs across the table with the value under it (post names are too long for a third) */
type Row = { label: React.ReactNode; value: React.ReactNode; key: string; sub?: boolean; strong?: boolean; stack?: boolean; info?: boolean };
/** rows after the first ones open with "Show all N <noun>" */
type Group = { rows: Row[]; more?: Row[]; noun?: string };
/** more: rows behind "Show N more"; after: rows shown after that button (a section's own sub-tables) */
type Section = { id: string; title: string; rows: Row[]; more?: Row[]; noun?: string; after?: Group[] };

const dot = <span className="mx-1.5 text-faint" aria-hidden>·</span>;
const join = (parts: React.ReactNode[]) =>
  parts.filter((p) => p !== "" && p !== null && p !== undefined && p !== false)
    .map((p, i) => <React.Fragment key={i}>{i > 0 && dot}{p}</React.Fragment>);
const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** A heading row inside a section (an exam's stage, "Vacancies by category"). */
const subhead = (key: string, text: string): Row => ({ key, label: text, value: null, sub: true });

function linkOut(href: string, text: string, extra = "") {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1 ${extra} font-semibold text-navy underline underline-offset-2 hover:text-saffron break-all`}>
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
  if (job.totalVacancies > 0) rows.push({ key: "total", label: "Total posts", value: <b className="text-base text-ink tabular-nums">{job.totalVacancies.toLocaleString("en-IN")}</b> });
  rows.push({ key: "where", label: "Job location", value: f.postingPlace?.value ? <>{f.postingPlace.value} <PageRef job={job} page={f.postingPlace.page} /></> : job.isCentral ? "Central government (All India)"
    : [job.districtName, getStateBySlug(job.stateSlug)?.name].filter(Boolean).join(", ") || "State government" });
  for (const [k, label] of [["employmentType", "Type of job"], ["contractPeriod", "Contract period"], ["probation", "Probation"], ["bond", "Bond"]] as const) {
    const v = f[k];
    if (v?.value) rows.push({ key: k, label, value: <>{v.value.charAt(0).toUpperCase() + v.value.slice(1)} <PageRef job={job} page={v.page} /></> });
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
      strong: s.key === "end" && s.when === "now",
      label: s.label,
      value: (
        <>
          <span className={s.when === "now" ? "font-bold text-ink" : s.when === "next" ? "text-ink-2" : "font-semibold text-ink"}>{s.value}</span>
          {s.doc && (
            <span className="mt-1 block text-[13px] text-ink-2">
              {/* the row already gives the date: a summary starting with it ("16/10/2026 Result…") drops it */}
              {s.doc.summary.replace(/^\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\s*[-–:]?\s*/, "")}
              {s.doc.datesText && <span className="block font-semibold text-ink">{s.doc.datesText}</span>}
              <span className="mt-1 flex flex-wrap gap-x-4">
                {s.doc.copyName && <CopyLink name={s.doc.copyName} />}
                {linkOut(s.doc.url, "Official document", "min-h-[44px]")}
                {s.doc.page && <a href={s.doc.page} className="inline-flex min-h-[44px] items-center font-semibold text-navy underline underline-offset-2 hover:text-saffron">Details</a>}
              </span>
            </span>
          )}
        </>
      ),
    });
  }
  rows.push({ key: "report-dates", label: "Something wrong?", value: <ReportLink job={job} text="Email a correction" /> });
  return { id: "dates", title: datesHeading(job), rows };
}

/** The value most posts share, when at least 3 posts and half of them share it, else "". */
function common(values: string[]): string {
  const counts = new Map<string, number>();
  for (const v of values) if (v && v !== "See notification") counts.set(v, (counts.get(v) || 0) + 1);
  const [v, n] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0] || ["", 0];
  return n >= 3 && n >= values.length / 2 ? v : "";
}

const nameWords = (t: string) => new Set(t.toLowerCase().match(/[a-z]{4,}/g) || []);
/** The fuller read's post (postDetails) that is this listed post, by the words of their names. */
function samePost(a: string, b: string): boolean {
  const norm = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  if (norm(a) === norm(b)) return true;
  const wa = nameWords(a), wb = nameWords(b);
  const [small, big] = wa.size <= wb.size ? [wa, wb] : [wb, wa];
  return small.size > 0 && [...small].every((x) => big.has(x));
}

/** The one fuller-read post that is this post; none when two could be (no guessing). */
function onlyMatch<T extends { post: string }>(items: T[], name: string): T | undefined {
  const hits = items.filter((x) => samePost(x.post, name));
  return hits.length === 1 ? hits[0] : undefined;
}

const textWords = (t: string) => new Set(t.toLowerCase().match(/[a-z0-9]{3,}/g) || []);
/** Most of a's words are already in b ("Also needed" restating the qualification). */
function restates(a: string, b: string): boolean {
  const wa = textWords(a), wb = textWords(b);
  if (!wa.size || !wb.size) return false;
  return [...wa].filter((x) => wb.has(x)).length / wa.size >= 0.6;
}

/** "As per rule 16.2 (post-wise qualifications)" says nothing a reader can use: treated as not stated. */
const vague = (q: string) => !q || q === "See notification" || /^as per\b|post-?wise/i.test(q.trim());
const TOTAL_IN_NAME = /\s*\(\s*total\s+no\.?\s+of\s+posts?\s*[–-]\s*\d+\s*\)/i;

/** A part every post name ends with (" - Government/ZPP/MP"), when there are 2+ posts, else "". */
function sharedSuffix(names: string[]): string {
  if (names.length < 2) return "";
  const tails = names.map((n) => { const i = n.lastIndexOf(" - "); return i > 0 ? n.slice(i + 3).trim() : ""; });
  return tails[0] && tails.every((t) => t === tails[0]) ? tails[0] : "";
}

/** Rows past `keep` fold when a sub-table runs longer than `over`. */
function fold(rows: Row[], noun: string, over = 6, keep = 3): Group {
  return rows.length > over ? { rows: rows.slice(0, keep), more: rows.slice(keep), noun } : { rows };
}

function posts(job: JobNotification): Section | null {
  if (!hasPostsCard(job)) return null;
  const d = job.details || {};
  const list = getJobPostBreakdown(job).map((p) => ({ ...p, qualification: vague(p.qualification) ? "See notification" : p.qualification }));
  const suffix = sharedSuffix(list.map((p) => p.postName));
  const tailOf = (n: string) => { const i = n.lastIndexOf(" - "); return i > 0 ? n.slice(i + 3).trim() : ""; };
  // no single suffix, but a few that each cover 2+ posts: the posts sit under a small heading per suffix
  const tails = new Map<string, number>();
  for (const p of list) tails.set(tailOf(p.postName), (tails.get(tailOf(p.postName)) || 0) + 1);
  const grouped = !suffix && tails.size > 1 && tails.size <= 4 && [...tails].every(([t, n]) => t && n >= 2);
  const nameOf = (n: string) => (suffix || grouped ? n.slice(0, n.lastIndexOf(" - ")) : n).replace(TOTAL_IN_NAME, "").trim();
  const quals = new Set(list.map((p) => p.qualification));
  const pays = new Set(list.map((p) => p.payLevel));
  const sharedQual = quals.size > 1 ? common(list.map((p) => p.qualification)) : "";
  const sharedPay = pays.size > 1 ? common(list.map((p) => p.payLevel)) : "";
  const all: Row[] = list.map((p, i) => ({
    key: `p${i}`,
    stack: true,
    label: nameOf(p.postName),
    value: (
      <>
        {/\d/.test(String(p.vacancies))
          ? <b className="text-base text-ink tabular-nums">{p.vacancies} post{String(p.vacancies) === "1" ? "" : "s"}</b>
          : <span className="text-muted">Number in the notice</span>}
        {pays.size > 1 && p.payLevel !== "See notification" && p.payLevel !== sharedPay && (
          <span className="mt-1 block"><span className="text-muted">Pay: </span>{payText(p.payLevel).replace(/^pay\s*(?=[₹\d])/i, "")}</span>
        )}
        {quals.size > 1 && p.qualification !== "See notification" && p.qualification !== sharedQual && (
          <span className="mt-1 block"><span className="text-muted">Qualification: </span>{p.qualification}</span>
        )}
        {(() => {
          // what else this post asks for (marks, TET...), on its own row instead of a separate list
          const o = onlyMatch((d.postDetails || []).filter((x) => x.other), p.postName);
          return o && !restates(o.other, p.qualification) ? <span className="mt-1 block"><span className="text-muted">Also needed: </span>{o.other} <PageRef job={job} page={o.page} /></span> : null;
        })()}
      </>
    ),
  }));
  const rows: Row[] = [];
  if (suffix) rows.push({ info: true, key: "under", label: list.length > 2 ? "All posts are in" : "Both posts are in", value: suffix });
  if (pays.size === 1 && list.length && [...pays][0] !== "See notification") {
    rows.push({ info: true, key: "pay", label: list.length > 1 ? "Pay (all posts)" : "Pay", value: payText([...pays][0]) });
  } else if (sharedPay) {
    rows.push({ info: true, key: "pay", label: "Pay (unless shown below)", value: payText(sharedPay) });
  } else if (!list.length && job.salary) {
    rows.push({ key: "pay", label: "Pay", value: payText(job.salary) });
  }
  if (sharedQual) rows.push({ info: true, key: "qual", label: "Qualification (unless shown below)", value: sharedQual });
  if (!list.length && job.totalVacancies > 0) rows.push({ key: "n", label: "Posts", value: job.totalVacancies.toLocaleString("en-IN") });
  let postRows = all;
  if (grouped) {
    postRows = [];
    for (const tail of tails.keys()) {
      postRows.push(subhead(`tail-${tail}`, tail));
      list.forEach((p, i) => { if (tailOf(p.postName) === tail) postRows.push(all[i]); });
    }
  }
  const cut = grouped ? postRows.findIndex((_, i) => postRows.slice(0, i + 1).filter((r) => !r.sub).length > FIRST) : FIRST;
  rows.push(...(cut > 0 ? postRows.slice(0, cut) : postRows));
  const more = cut > 0 ? postRows.slice(cut) : [];

  const after: Group[] = [];
  const t = job.reservation;
  if (t?.rows.length) {
    const res: Row[] = [subhead("res", "Vacancies by category")];
    for (const r of t.rows) {
      res.push({ key: `res-${r.post}`, stack: true, label: r.post ? nameOf(r.post) : "All posts",
        value: join([...t.categories.filter((c) => r.counts[c] !== undefined).map((c) => `${c} ${r.counts[c]}`), <b key="t" className="text-ink">Total {r.total.toLocaleString("en-IN")}</b>]) });
    }
    const hz = t.horizontal;
    if (hz.length) res.push({ key: "hz", label: "Within these categories", value: join(hz.map((h) => `${h.category} ${h.count}${h.post && t.rows.length > 1 ? ` (${nameOf(h.post)})` : ""}`)) });
    after.push({ rows: res });
  }
  if (d.regionVacancies?.length) {
    const byPost = [...new Set(d.regionVacancies.map((r) => r.post))];
    for (const post of byPost) {
      const regs = d.regionVacancies.filter((x) => x.post === post).map((r): Row => (
        { key: `reg-${post}-${r.region}`, label: r.region, value: <b className="text-ink tabular-nums">{r.count.toLocaleString("en-IN")}</b> }));
      const g = fold(regs, "districts", 10, 6);
      after.push({ ...g, rows: [subhead(`reg-${post}`, `Vacancies by district / region${post && byPost.length > 1 ? `: ${nameOf(post)}` : ""}`), ...g.rows] });
    }
  }
  const req = (d.postDetails || []).filter((p) => p.experience);
  if (req.length) {
    const exp = req.map((p): Row => ({ key: `exp-${p.post}`, stack: true, label: nameOf(p.post), value: <>{p.experience} <PageRef job={job} page={p.page} /></> }));
    const g = fold(exp, "entries");
    after.push({ ...g, rows: [subhead("exp", "Experience required"), ...g.rows] });
  }
  return { id: "posts", title: "Posts and vacancies", rows, more: more.length ? more : undefined, noun: "posts", after };
}

type Limit = NonNullable<JobNotification["ageLimits"]>[number];

/**
 * The printed age limits said once. Several posts: a small heading per post (or set of posts sharing limits), then one
 * row per category. A category with no minimum of its own keeps its post's minimum ("21 to 33", not "Up to 33").
 */
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
  const byPosts = new Map<string, { posts: string[]; items: { min?: number; max: number; category: string }[] }>();
  for (const g of groups.values()) {
    const k = allPosts.length > 1 ? (g.posts.length === allPosts.length ? "" : g.posts.join("; ")) : "";
    const b = byPosts.get(k) || { posts: g.posts, items: [] };
    b.items.push(g);
    byPosts.set(k, b);
  }
  const rows: Row[] = [];
  let n = 0;
  for (const [k, b] of byPosts) {
    const mins = new Set(b.items.map((x) => x.min).filter(Boolean));
    const postMin = mins.size === 1 ? [...mins][0] : undefined;
    if (byPosts.size > 1) rows.push(subhead(`agep${n}`, `Age limit: ${k || "all posts"}`));
    for (const g of b.items) {
      const min = g.min || postMin;
      const label = byPosts.size > 1 ? (cats.size > 1 && g.category ? g.category : "All candidates")
        : cats.size > 1 && g.category ? `Age limit (${g.category})` : "Age limit";
      rows.push({ key: `age${n++}`, label, value: <b className="text-ink tabular-nums">{min ? `${min} to ${g.max}` : `Up to ${g.max}`} years</b> });
    }
  }
  return rows;
}

function eligibility(job: JobNotification): Section | null {
  if (!hasEligibility(job)) return null;
  const d = job.details || {};
  const limits = job.ageLimits || [];
  const wording = ageText(job).trim();
  const rows: Row[] = [];
  if (limits.length) {
    rows.push(...ageRows(limits));
  } else {
    rows.push({ key: "age", label: "Age limit", value: wording || "See the official notification" });
  }
  if (job.ageAsOn || (limits.length && wording)) {
    rows.push({ key: "asOn", label: job.ageAsOn ? "Age counted as on" : "Age rule as printed", value: (
      <>
        {job.ageAsOn && formatDate(job.ageAsOn)}
        {limits.length > 0 && wording && (
          job.ageAsOn ? (
            <details className="group mt-1">
              <summary className="inline-flex min-h-[44px] cursor-pointer list-none items-center gap-1.5 text-sm font-semibold text-navy hover:text-saffron [&::-webkit-details-marker]:hidden">
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden />The age rule as printed
              </summary>
              <span className="block pb-1 text-ink-2">{wording}</span>
            </details>
          ) : wording
        )}
      </>
    ) });
  }
  for (const r of d.ageRelaxations || []) {
    rows.push({ key: `rel-${r.category}`, label: `Relaxation: ${r.category}`, value: <>+{r.years} year{r.years === 1 ? "" : "s"} <PageRef job={job} page={r.page} /></> });
  }
  if (job.ageAsOn && limits.length) {
    rows.push({ key: "ageCheck", label: "Check your age", value: (
      <details className="group">
        <summary className="inline-flex min-h-[44px] cursor-pointer list-none items-center gap-1.5 font-semibold text-navy hover:text-saffron [&::-webkit-details-marker]:hidden">
          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden />Enter your date of birth
        </summary>
        <div className="pt-2"><AgeCheck asOn={job.ageAsOn} limits={limits} /></div>
      </details>
    ) });
  }
  const quals = (job.qualifications || []).filter(Boolean);
  const postQuals = new Set((job.posts || []).map((p) => p.qualification.trim()).filter(Boolean));
  const varies = (postQuals.size > 1 || quals.length > 1) && (job.posts || []).length > 1;
  rows.push({ key: "qual", label: "Qualification", value: varies
    ? <>Differs by post{qualificationLabel(job) && qualificationLabel(job) !== "Varies by post" ? ` (${qualificationLabel(job)})` : ""}: see <a href="#posts" className="font-semibold text-navy underline underline-offset-2">Posts and vacancies</a></>
    : quals.length ? [...new Set(quals.map((q) => q.trim().replace(/[.;]+$/, "")))].join("; ") : "See the official notification." });
  for (const [k, label] of [["nationality", "Nationality"], ["domicile", "Domicile"], ["language", "Language"]] as const) {
    const v = d.facts?.[k];
    if (v?.value) rows.push({ key: k, label, value: <>{v.value} <PageRef job={job} page={v.page} /></> });
  }
  // shown on the post's own row when the post is listed; here only for a notice without a post list
  const listed = getJobPostBreakdown(job);
  const other = listed.length ? [] : (d.postDetails || []).filter((p) => p.other);
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
        <>{f.amount === 0 ? <b className="text-green">No fee</b> : f.amount ? <b className="text-base text-ink tabular-nums">{rupees(f.amount)}</b> : f.text}
          {extra && f.amount !== null && <span className="ml-1.5 text-[13px] text-ink-2">({f.text})</span>} <PageRef job={job} page={f.page} /></>
      ) });
    }
  } else {
    rows.push({ key: "fee", label: "Application fee", value: formatFee(job).replace(/\bRs\.?\s*/gi, "₹") });
  }
  if (facts.feePaymentMode?.value) rows.push({ key: "pay", label: "How to pay", value: <>{facts.feePaymentMode.value} <PageRef job={job} page={facts.feePaymentMode.page} /></> });

  if (d.applySteps?.length) {
    rows.push({ key: "steps", label: "How to apply", value: <Numbered job={job} items={d.applySteps.map((x) => ({ text: x.step, page: x.page }))} /> });
  } else {
    rows.push({ key: "apply", label: "How to apply", value: <Linked text={job.howToApply?.trim() || "Apply on the official website. The steps are in the official notification."} /> });
  }
  const docs = d.documents || [];
  if (docs.length) {
    rows.push({ key: "docs", label: "Documents to keep ready", value: <Numbered job={job} items={docs.map((x) => ({ text: x.document, page: x.page }))} /> });
  }
  const help: Row[] = [];
  if (facts.helplinePhone?.value) {
    const v = facts.helplinePhone.value;
    const nums = v.match(/\+?\d[\d\s-]{6,}\d/g) || [];
    help.push({ key: "phone", label: "Help desk phone", value: nums.length ? (
      <span className="flex flex-wrap gap-x-4">
        {nums.map((n) => <a key={n} href={`tel:${n.replace(/[\s-]/g, "")}`} className="inline-flex min-h-[44px] items-center font-semibold text-navy underline underline-offset-2">{n.trim()}</a>)}
      </span>
    ) : v });
  }
  if (facts.helplineEmail?.value) {
    const emails = facts.helplineEmail.value.match(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g) || [];
    help.push({ key: "mail", label: "Help desk email", value: emails.length
      ? <span className="break-all">{emails.map((e, i) => <React.Fragment key={e}>{i > 0 && ", "}<a href={`mailto:${e}`} className="text-navy underline underline-offset-2">{e}</a></React.Fragment>)}</span>
      : facts.helplineEmail.value });
  }
  return { id: "fee", title: "Fee and how to apply", rows: [...rows, ...help] };
}

function selection(job: JobNotification): Section | null {
  if (!hasSelection(job)) return null;
  const d = job.details || {};
  const own = (d.selectionStages || []).map((s) => s.stage);
  const stages = (own.length ? own : job.selectionProcess || []).map((t) => t.trim().replace(/[,;:.]+$/, "")).filter(Boolean);
  const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
  const rows: Row[] = !stages.length ? [] : stages.length === 1
    ? [{ key: "s0", label: "Selection", value: cap(stages[0]) }]
    : [{ key: "stages", label: "Selection stages", value: <Numbered job={job} items={stages.map((t) => ({ text: cap(t), page: 0 }))} /> }];
  const pattern = d.examPattern || [];
  if (pattern.length) {
    rows.push(subhead("pat", "Exam pattern"));
    const groups: { stage: string; rows: typeof pattern }[] = [];
    for (const p of pattern) {
      if (!groups.length || groups[groups.length - 1].stage !== p.stage) groups.push({ stage: p.stage, rows: [] });
      groups[groups.length - 1].rows.push(p);
    }
    const spaced = (t: string) => (t || "").replace(/(\d)([A-Za-z])/g, "$1 $2");
    groups.forEach((g, gi) => {
      const times = new Set(g.rows.map((p) => spaced(p.time)));
      const sharedTime = g.rows.length > 1 && times.size === 1 ? [...times][0] : "";
      if (groups.length > 1 && g.stage || sharedTime) {
        rows.push({ key: `ps${gi}`, label: <span className="font-bold text-navy">{[groups.length > 1 ? g.stage : "", sharedTime && `Time: ${sharedTime}`].filter(Boolean).join(" · ")}</span>, value: null });
      }
      g.rows.forEach((p, i) => rows.push({ key: `p${gi}-${i}`, label: /^total$/i.test((p.paper || "").trim()) ? <b className="text-ink">Total</b> : p.paper || p.stage || "Paper", value: (
        <>{join([p.questions && `${p.questions} question${p.questions === "1" ? "" : "s"}`, p.marks && <b key="m" className="text-ink">{p.marks} mark{p.marks === "1" ? "" : "s"}</b>, !sharedTime && spaced(p.time)])} <PageRef job={job} page={p.page} /></>
      ) }));
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

/** "Email a correction": the email opens with this page's link and title filled in (the reader is on the page). */
function ReportLink({ job, text }: { job: JobNotification; text: string }) {
  const pageUrl = `https://www.indiajobnotice.com${getJobCanonicalPath(job)}`;
  const mail = `mailto:indiajobnotice@gmail.com?subject=${encodeURIComponent(`Correction: ${job.shortTitle || job.title}`.slice(0, 150))}&body=${encodeURIComponent(
    `Job page link: ${pageUrl}\n\nWhat is wrong on the page:\n\nWhat the official notice says (page number if you know it):\n`)}`;
  return (
    <a href={mail} className="inline-flex min-h-[44px] items-center font-semibold text-navy underline underline-offset-2 hover:text-saffron">
      {text}
    </a>
  );
}

function links(job: JobNotification): Section {
  const closed = isJobApplicationClosed(job);
  const rows: Row[] = [];
  if (!closed && job.applyOnlineUrl) rows.push({ key: "apply", label: "Apply online", value: linkOut(job.applyOnlineUrl, hostOf(job.applyOnlineUrl)) });
  rows.push({ key: "pdf", label: "Official notification", value: linkOut(job.officialPdfUrl, /\.pdf($|[?#])/i.test(job.officialPdfUrl) ? "Notification (PDF)" : hostOf(job.officialPdfUrl)) });
  if (job.copyName) rows.push({ key: "copy", label: "Our copy", value: <CopyLink name={job.copyName} /> });
  rows.push({ key: "report", label: "Found a mistake?", value: <ReportLink job={job} text="Email a correction for this page" /> });
  return { id: "links", title: "Important links", rows };
}

// --- the table -----------------------------------------------------------------------------------------

/** Steps, documents or stages: one row, the list in the value cell; more than 8 open on a tap. */
function Numbered({ job, items }: { job: JobNotification; items: { text: string; page: number }[] }) {
  const [all, setAll] = useState(false);
  const shown = all ? items : items.slice(0, FIRST);
  return (
    <>
      <ol className="list-decimal space-y-1.5 pl-5 marker:font-semibold marker:text-navy">
        {shown.map((x, i) => <li key={i} className="pl-0.5">{x.text} <PageRef job={job} page={x.page} /></li>)}
      </ol>
      {items.length > FIRST && (
        <button type="button" onClick={() => setAll((v) => !v)} aria-expanded={all}
          className="mt-1 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-navy hover:text-saffron">
          <ChevronDown className={`h-4 w-4 transition-transform ${all ? "rotate-180" : ""}`} aria-hidden />
          {all ? "Show fewer" : `Show all ${items.length}`}
        </button>
      )}
    </>
  );
}

/** "SC/ST/BC/EWS" may break after a slash, not mid-word (<wbr>: nothing extra when copied) */
const slashes = (v: React.ReactNode) =>
  typeof v === "string" && v.includes("/")
    ? v.split("/").map((part, i) => <React.Fragment key={i}>{i > 0 && <>/<wbr /></>}{part}</React.Fragment>)
    : v;

function Rows({ rows }: { rows: Row[] }) {
  const th = "px-2.5 sm:px-3 py-2.5 text-left text-[13px] sm:text-sm [overflow-wrap:break-word]";
  const td = "px-2.5 sm:px-3 py-2.5 text-[15px] leading-snug [overflow-wrap:break-word]";
  return (
    <>
      {rows.map((r) => r.sub ? (
        <tr key={r.key}>
          <th colSpan={2} scope="colgroup" className="bg-subtle px-3 py-2 text-left text-[13px] font-bold text-ink">{r.label}</th>
        </tr>
      ) : r.value === null ? (
        <tr key={r.key}><th colSpan={2} scope="colgroup" className="px-3 pt-3 pb-1 text-left text-[13px]">{r.label}</th></tr>
      ) : (
        <React.Fragment key={r.key}>
          {r.stack && (
            // phones: the post name across the table, its facts under it
            <tr className="align-top sm:hidden">
              <th scope="row" colSpan={2} lang="en" className={`${th} font-normal`}>
                <span className="block font-semibold text-ink">{slashes(r.label)}</span>
                <span className="mt-1 block text-[15px] text-ink">{r.value}</span>
              </th>
            </tr>
          )}
          <tr className={`align-top ${r.stack ? "hidden sm:table-row" : ""} ${r.strong ? "bg-saffron-tint" : ""}`}>
            <th scope="row" lang="en" className={`${th} hyphens-auto ${r.strong ? "font-bold text-ink" : "font-normal text-ink-2"}`}>{slashes(r.label)}</th>
            <td className={`${td} ${r.strong ? "text-base font-semibold text-ink" : "text-ink"}`}>{r.value}</td>
          </tr>
        </React.Fragment>
      ))}
    </>
  );
}

function GroupRows({ g }: { g: Group }) {
  const [open, setOpen] = useState(false);
  const total = [...g.rows, ...(g.more || [])].filter((r) => !r.sub && !r.info).length;
  return (
    <>
      <Rows rows={g.rows} />
      {g.more && open ? <Rows rows={g.more} /> : null}
      {g.more && (
        <tr className="print:hidden">
          <td colSpan={2} className="px-3 py-0.5">
            <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open}
              className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-navy hover:text-saffron">
              <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
              {open ? "Show fewer" : `Show all ${total} ${g.noun || "rows"}`}
            </button>
          </td>
        </tr>
      )}
    </>
  );
}

function SectionBody({ s }: { s: Section }) {
  return (
    <tbody className="[&>tr>*]:border-b [&>tr>*]:border-line">
      <tr>
        {/* stays under the site header while its rows scroll (64 px on phones; with the state bar from md) */}
        <th id={s.id} colSpan={2} scope="colgroup" className="sticky top-16 md:top-[105px] z-10 scroll-mt-28 md:scroll-mt-36 bg-navy-tint px-3 py-2.5 text-left">
          <h2 className="font-serif text-lg font-bold text-navy">{s.title}</h2>
        </th>
      </tr>
      <GroupRows g={{ rows: s.rows, more: s.more, noun: s.noun }} />
      {(s.after || []).map((g, i) => <GroupRows key={i} g={g} />)}
    </tbody>
  );
}

export function JobFactsTable({ job }: { job: JobNotification }) {
  const sections = [overview(job), dates(job), posts(job), eligibility(job), fee(job), selection(job), links(job)]
    .filter((s): s is Section => Boolean(s && s.rows.length));
  return (
    // overflow-clip, not hidden: rounded corners without breaking the sticky section headings
    <div className="overflow-clip rounded-xl border border-line">
      <table className="w-full table-fixed border-collapse bg-surface text-sm [&_tbody:last-child>tr:last-child>*]:border-b-0">
        <caption className="sr-only">{job.title}: the notice in a table</caption>
        {/* fixed layout takes widths from the first row, a heading across both columns: the widths go here */}
        <colgroup>
          <col className="w-[34%] sm:w-[28%]" />
          <col />
        </colgroup>
        {sections.map((s) => <SectionBody key={s.id} s={s} />)}
      </table>
    </div>
  );
}
