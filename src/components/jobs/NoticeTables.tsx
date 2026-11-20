import React from "react";
import { Mail, Phone } from "lucide-react";
import { JobDetails, JobNotification } from "@/data/jobs";
import { Fold, h3Cls } from "./JobFactSections";

// The fuller read's tables (agent details.py): each copied from the notice, each row with the page it is on,
// so a reader can check it. Plain HTML tables (search engines and screen readers read them as tables); wide
// ones scroll sideways on phones with their first column held in place.

type D = NonNullable<JobNotification["details"]>;

/** "p. 4": a link that opens the notice at that page when the notice is a PDF, else the page number alone. */
export function PageRef({ job, page }: { job: JobNotification; page?: number }) {
  if (!page) return null;
  const url = job.officialPdfUrl || "";
  const pdf = /\.pdf($|[?#])/i.test(url);
  const cls = "inline-block whitespace-nowrap text-[12px] font-medium text-muted tabular-nums py-3.5 -my-3.5 px-2 -mx-2";
  return pdf ? (
    <a href={`${url.split("#")[0]}#page=${page}`} target="_blank" rel="noreferrer"
      className={`${cls} underline decoration-line underline-offset-2 hover:text-navy`}
      aria-label={`Page ${page} of the official notice`}>
      p.&nbsp;{page}
    </a>
  ) : (
    <span className={cls} title="Page of the official notice">p.&nbsp;{page}</span>
  );
}

/** The pages a table's rows come from, said once under it: "From the notice, p. 3, 5". */
function Source({ job, pages }: { job: JobNotification; pages: number[] }) {
  const list = [...new Set(pages.filter(Boolean))].sort((a, b) => a - b);
  if (!list.length) return null;
  return (
    <p className="mt-1.5 text-[12px] text-muted">
      From the notice,{" "}
      {list.map((p, i) => (
        <React.Fragment key={p}>
          {i > 0 && ", "}
          <PageRef job={job} page={p} />
        </React.Fragment>
      ))}
    </p>
  );
}

export interface Column<R> {
  key: string;
  label: string;
  cell: (r: R) => React.ReactNode;
  numeric?: boolean;
  /** wraps freely; other columns keep to one line where they can */
  wide?: boolean;
  /** a first column of numbers or short labels: no minimum width */
  narrow?: boolean;
}

/**
 * A table of the notice's rows. Header in a light band, numbers right-aligned in tabular figures, rows shaded
 * in turn when there are many, the first column held in place when the table scrolls sideways.
 */
export function DataTable<R>({ caption, columns, rows, className = "", groupBy }: {
  caption: string; columns: Column<R>[]; rows: R[]; className?: string;
  /** rows that share this value (an exam's stage) sit under one heading row that spans the table */
  groupBy?: (r: R) => string;
}) {
  const zebra = rows.length > 6 ? "[&>tr:nth-child(even)]:bg-subtle/60" : "";
  return (
    <>
    {columns.length > 3 && <p className="mt-1 text-[12px] text-muted sm:hidden">Swipe the table sideways to see every column.</p>}
    <div className={`mt-2 overflow-x-auto overscroll-x-contain rounded-lg border border-line ${className}`}>
      <table className="min-w-full border-collapse bg-surface text-sm [&_th]:border [&_td]:border [&_th]:border-line [&_td]:border-line [&_tr>*:first-child]:border-l-0 [&_tr>*:last-child]:border-r-0 [&_thead_tr>*]:border-t-0 [&_tbody>tr:last-child>*]:border-b-0">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="bg-navy-tint text-left text-[12px] font-bold uppercase tracking-wide text-navy">
            {columns.map((c, i) => (
              <th key={c.key} scope="col"
                className={`py-2.5 px-3 whitespace-nowrap ${c.numeric ? "text-right" : ""} ${i === 0 ? "sticky left-0 z-10 bg-navy-tint" : ""}`}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={zebra}>
          {rows.map((r, ri) => (
            <React.Fragment key={ri}>
            {groupBy && groupBy(r) && (ri === 0 || groupBy(rows[ri - 1]) !== groupBy(r)) && (
              <tr className="bg-navy-tint/60">
                <th colSpan={columns.length} scope="colgroup" className="py-2 px-3 text-left text-[13px] font-bold text-navy">
                  {groupBy(r)}
                </th>
              </tr>
            )}
            <tr className="align-top">
              {columns.map((c, i) => (
                i === 0 ? (
                  <th key={c.key} scope="row"
                    className={`sticky left-0 z-10 bg-surface py-2.5 px-3 text-left font-semibold text-ink ${c.narrow ? "w-12 tabular-nums text-navy" : "min-w-[7.5rem] max-w-[10.5rem] sm:min-w-[8.5rem] sm:max-w-[15rem]"}`}>
                    {c.cell(r)}
                  </th>
                ) : (
                  <td key={c.key}
                    className={`py-2.5 px-3 text-ink-2 ${c.numeric ? "text-right tabular-nums font-semibold text-ink whitespace-nowrap" : c.wide ? "min-w-[11rem] sm:min-w-[14rem]" : "min-w-[5rem] sm:min-w-[7rem]"}`}>
                    {c.cell(r)}
                  </td>
                )
              ))}
            </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}

const dash = <span className="text-faint" aria-label="not given">–</span>;
const or = (v: React.ReactNode) => (v === "" || v === null || v === undefined ? dash : v);
const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// --- fee ------------------------------------------------------------------------------------------

/** The printed wording says more than the amount ("+ GST", "intimation charges", "non-refundable"). */
const adds = (f: { amount: number | null; text: string }) =>
  Boolean(f.text) && f.text.replace(/\.00?(?!\d)/g, "").replace(/[₹\s,/-]|rs\.?|\(?non-refundable\)?|only/gi, "") !== String(f.amount ?? "");

export function FeeTable({ job, fees }: { job: JobNotification; fees: NonNullable<D["fees"]> }) {
  return (
    <>
      <DataTable caption="Application fee by category" rows={fees} columns={[
        { key: "c", label: "Category", cell: (f) => f.category },
        { key: "a", label: "Fee", numeric: true, cell: (f) => f.amount === 0 ? <span className="text-green">No fee</span> : f.amount ? rupees(f.amount) : or(f.text) },
        ...(fees.some(adds) ? [{ key: "t", label: "As printed", wide: true, cell: (f: (typeof fees)[number]) => adds(f) ? <span className="text-[13px]">{f.text}</span> : dash }] : []),
      ]} />
      <Source job={job} pages={fees.map((f) => f.page)} />
    </>
  );
}

// --- age relaxation -------------------------------------------------------------------------------

export function RelaxationTable({ job, rows }: { job: JobNotification; rows: NonNullable<D["ageRelaxations"]> }) {
  return (
    <>
      <DataTable caption="Upper age relaxation by category" rows={rows} columns={[
        { key: "c", label: "Category", cell: (r) => r.category },
        { key: "y", label: "Relaxation", numeric: true, cell: (r) => `+${r.years} year${r.years === 1 ? "" : "s"}` },
      ]} />
      <Source job={job} pages={rows.map((r) => r.page)} />
    </>
  );
}

// --- physical standards ---------------------------------------------------------------------------

export function PhysicalTable({ job, rows }: { job: JobNotification; rows: NonNullable<D["physical"]> }) {
  const women = rows.some((r) => r.women);
  const notes = rows.filter((r) => r.note);
  return (
    <>
      <DataTable caption="Physical standards and tests" rows={rows} columns={[
        { key: "t", label: "Test", cell: (r) => r.test },
        { key: "m", label: women ? "Men" : "Standard", wide: true, cell: (r) => or(r.men) },
        ...(women ? [{ key: "w", label: "Women", wide: true, cell: (r: (typeof rows)[number]) => or(r.women) }] : []),
      ]} />
      {notes.length > 0 && (
        <ul className="mt-2 space-y-1 text-[13px] text-ink-2 max-w-prose">
          {notes.map((r, i) => <li key={i}><b className="font-semibold text-ink">{r.test}:</b> {r.note}</li>)}
        </ul>
      )}
      <Source job={job} pages={rows.map((r) => r.page)} />
    </>
  );
}

// --- exam pattern ---------------------------------------------------------------------------------

export function ExamPatternTable({ job, rows, negative }: { job: JobNotification; rows: NonNullable<D["examPattern"]>; negative?: string }) {
  const has = (k: "questions" | "marks" | "time") => rows.some((r) => r[k]);
  type R = (typeof rows)[number];
  // several stages: each is a heading row across the table, so phones keep the numbers in view
  const grouped = new Set(rows.map((r) => r.stage)).size > 1 || rows.some((r) => !r.paper);
  const single = !grouped && rows[0]?.stage;
  return (
    <>
      {single && <p className="mt-1 text-sm font-semibold text-ink">{single}</p>}
      <DataTable caption="Exam pattern" rows={rows} groupBy={grouped ? (r) => r.stage : undefined} columns={[
        { key: "p", label: "Paper / subject", cell: (r: R) => or(r.paper || (grouped ? "" : r.stage)) },
        ...(has("questions") ? [{ key: "q", label: "Questions", numeric: true, cell: (r: R) => or(r.questions) }] : []),
        ...(has("marks") ? [{ key: "m", label: "Marks", numeric: true, cell: (r: R) => or(r.marks) }] : []),
        ...(has("time") ? [{ key: "t", label: "Time", cell: (r: R) => or(r.time) }] : []),
      ]} />
      {negative && <p className="mt-2 text-sm text-ink-2 max-w-prose"><b className="font-semibold text-ink">Negative marking:</b> {negative}</p>}
      <Source job={job} pages={rows.map((r) => r.page)} />
    </>
  );
}

// --- syllabus -------------------------------------------------------------------------------------

/** One fold per paper, closed: a syllabus runs to pages and would push the rest of the page down. */
export function Syllabus({ job, papers }: { job: JobNotification; papers: NonNullable<D["syllabus"]> }) {
  return (
    <div className="mt-1 divide-y divide-line-soft border-y border-line-soft">
      {papers.map((p, i) => {
        const title = [p.stage, p.paper].filter(Boolean).join(" · ") || `Paper ${i + 1}`;
        const pages = p.pageFrom && p.pageTo && p.pageTo !== p.pageFrom ? [p.pageFrom, p.pageTo] : [p.pageFrom];
        // a topic printed under another one is numbered under it: 2.1, 2.2...
        let main = 0, sub = 0;
        const rows = p.topics.map((t) => {
          if (t.sub && main) { sub += 1; return { ...t, n: `${main}.${sub}` }; }
          main += 1; sub = 0;
          return { ...t, n: String(main) };
        });
        type R = (typeof rows)[number];
        return (
          <Fold key={i} title={`${title} (${p.topics.length} topic${p.topics.length === 1 ? "" : "s"})`}>
            <DataTable caption={`Syllabus: ${title}`} rows={rows} columns={[
              { key: "n", label: "No.", narrow: true, cell: (r: R) => r.n },
              { key: "t", label: "Topic", wide: true, cell: (r: R) => <span className={r.sub ? "block pl-4 text-ink-2" : "font-medium text-ink"}>{r.text}</span> },
            ]} />
            <p className="mt-1.5 pb-3 text-[12px] text-muted">
              As printed in the notice,{" "}
              {pages.map((pg, k) => <React.Fragment key={k}>{k > 0 && "–"}<PageRef job={job} page={pg} /></React.Fragment>)}
            </p>
          </Fold>
        );
      })}
    </div>
  );
}

// --- how to apply ---------------------------------------------------------------------------------

export function ApplySteps({ job, steps }: { job: JobNotification; steps: NonNullable<D["applySteps"]> }) {
  const rows = steps.map((s, i) => ({ ...s, n: i + 1 }));
  type R = (typeof rows)[number];
  return (
    <>
      <DataTable caption="How to apply, step by step" rows={rows} columns={[
        { key: "n", label: "Step", narrow: true, cell: (r: R) => r.n },
        { key: "s", label: "What to do", wide: true, cell: (r: R) => r.step },
      ]} />
      <Source job={job} pages={steps.map((s) => s.page)} />
    </>
  );
}

export function DocumentsList({ job, docs }: { job: JobNotification; docs: NonNullable<D["documents"]> }) {
  const rows = docs.map((d, i) => ({ ...d, n: i + 1 }));
  type R = (typeof rows)[number];
  const table = (
    <>
      <DataTable caption="Documents to keep ready" rows={rows} columns={[
        { key: "n", label: "No.", narrow: true, cell: (r: R) => r.n },
        { key: "d", label: "Document", wide: true, cell: (r: R) => r.document },
      ]} />
      <Source job={job} pages={docs.map((d) => d.page)} />
    </>
  );
  return docs.length > 6 ? <Fold title={`Documents to keep ready (${docs.length})`} className="mt-2">{table}</Fold> : (
    <div className="mt-4">
      <h4 className={h3Cls}>Documents to keep ready</h4>
      {table}
    </div>
  );
}

export function Helpline({ facts }: { facts: NonNullable<D["facts"]> }) {
  const phone = facts.helplinePhone?.value;
  const email = facts.helplineEmail?.value;
  if (!phone && !email) return null;
  const emails = (email || "").match(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g) || [];
  const rows = [
    ...(phone ? [{ k: "Phone", v: <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-muted" aria-hidden />{phone}</span> }] : []),
    ...(email ? [{ k: "Email", v: (
      <span className="inline-flex items-center gap-1.5 break-all">
        <Mail className="h-3.5 w-3.5 text-muted shrink-0" aria-hidden />
        <span>{emails.length ? emails.map((e, i) => <React.Fragment key={e}>{i > 0 && ", "}<a href={`mailto:${e}`} className="text-navy underline underline-offset-2 hover:text-saffron">{e}</a></React.Fragment>) : email}</span>
      </span>
    ) }] : []),
  ];
  return (
    <div className="mt-4">
      <h4 className={h3Cls}>Help desk</h4>
      <DataTable caption="Help desk" rows={rows} columns={[
        { key: "k", label: "Contact", narrow: true, cell: (r) => r.k },
        { key: "v", label: "Details", wide: true, cell: (r) => r.v },
      ]} />
    </div>
  );
}

// --- posts: the job's terms, vacancies by region, what each post asks for beyond the qualification ----

const TERMS: [keyof NonNullable<D["facts"]>, string][] = [
  ["employmentType", "Type of job"], ["contractPeriod", "Contract period"], ["probation", "Probation"],
  ["bond", "Bond"], ["postingPlace", "Place of posting"],
];

export function JobTerms({ job, facts }: { job: JobNotification; facts: NonNullable<D["facts"]> }) {
  const rows = TERMS.filter(([k]) => facts[k]?.value).map(([k, label]) => ({ label, ...facts[k]! }));
  if (!rows.length) return null;
  return (
    <div>
      <DataTable caption="Terms of the job" rows={rows} columns={[
        { key: "l", label: "Term", cell: (r) => r.label },
        { key: "v", label: "Details", wide: true, cell: (r) => <>{r.value} <PageRef job={job} page={r.page} /></> },
      ]} />
    </div>
  );
}

export function RegionTable({ job, rows }: { job: JobNotification; rows: NonNullable<D["regionVacancies"]> }) {
  const posts = [...new Set(rows.map((r) => r.post))];
  return (
    <>
      {posts.map((post) => {
        const of = rows.filter((r) => r.post === post);
        return (
          <div key={post || "all"} className="mt-2 first:mt-0">
            {posts.length > 1 && <h4 className="text-sm font-semibold text-ink">{post || "All posts"}</h4>}
            <DataTable caption={`Vacancies by region${post ? `: ${post}` : ""}`} rows={of} columns={[
              { key: "r", label: "District / region", cell: (r) => r.region },
              { key: "n", label: "Vacancies", numeric: true, cell: (r) => r.count.toLocaleString("en-IN") },
            ]} />
          </div>
        );
      })}
      <Source job={job} pages={rows.map((r) => r.page)} />
    </>
  );
}

const words = (t: string) => new Set((t.toLowerCase().match(/[a-z0-9]{3,}/g) || []));

/** Most of the words of `a` are already in `b` (a post's "other requirements" restating its qualification). */
function repeats(a: string, b: string): boolean {
  const wa = words(a), wb = words(b);
  if (!wa.size) return true;
  let n = 0;
  wa.forEach((w) => { if (wb.has(w)) n += 1; });
  return n / wa.size >= 0.6;
}

export function PostRequirements({ job, rows }: { job: JobNotification; rows: NonNullable<D["postDetails"]> }) {
  const qualOf = (post: string) => {
    const p = words(post);
    const best = (job.posts || []).find((x) => [...words(x.postName)].filter((w) => p.has(w)).length >= Math.min(2, p.size));
    return best?.qualification || "";
  };
  const shown = rows
    .map((r) => ({ ...r, other: r.other && !repeats(r.other, qualOf(r.post)) ? r.other : "" }))
    .filter((r) => r.experience || r.other);
  if (!shown.length) return null;
  type R = (typeof shown)[number];
  return (
    <Fold title="Experience and other requirements by post">
      <DataTable caption="Experience and other requirements by post" rows={shown} columns={[
        { key: "p", label: "Post", cell: (r: R) => r.post },
        ...(shown.some((r) => r.experience) ? [{ key: "e", label: "Experience", wide: true, cell: (r: R) => or(r.experience) }] : []),
        ...(shown.some((r) => r.other) ? [{ key: "o", label: "Other requirements", wide: true, cell: (r: R) => or(r.other) }] : []),
      ]} />
      <Source job={job} pages={shown.map((r) => r.page)} />
    </Fold>
  );
}

// --- who can apply: conditions besides age and qualification ---------------------------------------

const CONDITIONS: [keyof NonNullable<D["facts"]>, string][] = [
  ["nationality", "Nationality"], ["domicile", "Domicile"], ["language", "Language"],
];

export function OtherConditions({ job, facts }: { job: JobNotification; facts: NonNullable<D["facts"]> }) {
  const rows = CONDITIONS.filter(([k]) => facts[k]?.value).map(([k, label]) => ({ label, ...facts[k]! }));
  if (!rows.length) return null;
  return (
    <>
      <h3 className={`mt-5 ${h3Cls}`}>Other conditions</h3>
      <div className="max-w-2xl">
        <DataTable caption="Other conditions" rows={rows} columns={[
          { key: "l", label: "Condition", cell: (r) => r.label },
          { key: "v", label: "Requirement", wide: true, cell: (r) => <>{r.value} <PageRef job={job} page={r.page} /></> },
        ]} />
      </div>
    </>
  );
}

/** Dates the notice gives that the timeline does not already show (correction window, admit card...). */
export function extraDates(details: JobDetails | undefined, shown: string[]): NonNullable<D["dates"]> {
  const have = new Set(shown.filter(Boolean));
  const seen = new Set<string>();
  return (details?.dates || []).filter((d) => {
    if (!d.date || have.has(d.date)) return false;
    const key = `${d.date}|${d.event.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    // the age date is said under "Who can apply"; the notice's own date and the application window are already there
    return !/^(last date|closing date|application (start|end|last)|online application (start|last|end)|notification|notice publication|advertisement)|age|reckon|cut-?off date/i.test(d.event);
  });
}
