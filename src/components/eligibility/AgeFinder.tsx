"use client";

import React, { useId, useMemo, useState } from "react";
import Link from "next/link";
import { calculateAgeAtDate } from "@/data/jobs";
import { formatDate } from "@/lib/utils";

/** One open notice, as much as the calculator needs (prepared on the server). */
export interface AgeJob {
  id: string;
  href: string;
  code: string;
  title: string;
  /** "Karnataka", "Central" */
  place: string;
  placeSlug: string;
  lastDate: string;
  /** The date the notice counts age on; "" when it gives none (the last date is then used, and said). */
  asOn: string;
  /** Limits as printed: per post and category. */
  limits: { post: string; category: string; min: number; max: number }[];
  /** When no table was read: the one range read from the wording (0 = not stated). */
  minAge: number;
  maxAge: number;
  /** The notice's residence rule as printed, with its page. */
  domicile?: { value: string; page: number };
}

type Verdict = { kind: "general" | "some" | "over" | "under" | "range"; text: string };

// "General", "UR", "GM", "General (ಸಾಮಾನ್ಯ ಅರ್ಹತೆ)", "सामान्य"; not a relaxed group that names General ("PwBD (General/EWS)")
const RELAXED = /pwbd|pwd|ph|disab|divyang|ex-?s|ex-?serv|widow|sport|depart|in-?service|govt\.? ?emp/i;
const isGeneral = (c: string) => !c.trim() || (!RELAXED.test(c) && /(gen(eral)?|ur|unreserved|gm|open)|ಸಾಮಾನ್ಯ|सामान्य|अनारक्षित/i.test(c));

function verdict(job: AgeJob, years: number, months: number): Verdict {
  const age = years + months / 12;
  if (job.limits.length) {
    const fits = job.limits.filter((l) => age >= (l.min || 0) && years <= l.max);
    const general = job.limits.filter((l) => isGeneral(l.category));
    if (fits.some((l) => isGeneral(l.category))) return { kind: "general", text: "Within the General limit" };
    if (fits.length) {
      const cats = [...new Set(fits.map((l) => l.category || "All candidates"))];
      return { kind: "some", text: `Within the limit for ${cats.slice(0, 3).join(", ")}${cats.length > 3 ? ` and ${cats.length - 3} more` : ""}` };
    }
    const mins = job.limits.map((l) => l.min).filter(Boolean);
    if (mins.length && age < Math.min(...mins)) return { kind: "under", text: `Under the minimum age of ${Math.min(...mins)}` };
    const top = Math.max(...job.limits.map((l) => l.max));
    return { kind: "over", text: general.length ? `Over the General limit of ${Math.min(...general.map((l) => l.max))} and every printed relaxation (up to ${top})` : `Over every printed limit (up to ${top})` };
  }
  if (job.minAge && age < job.minAge) return { kind: "under", text: `Under the minimum age of ${job.minAge}` };
  if (years > job.maxAge) return { kind: "over", text: `Over the upper limit of ${job.maxAge} (category relaxations: see the notice)` };
  // only one number was read from the wording: often the highest (relaxed) limit, so this is a "may fit"
  return { kind: "range", text: `May fit: the highest age limit read is ${job.maxAge}. Check the limit for your category in the notice` };
}

const STYLE: Record<Verdict["kind"], string> = {
  general: "text-green", some: "text-green", range: "text-saffron", over: "text-danger", under: "text-danger",
};

/**
 * Date of birth -> each open notice checked on the date it counts age from, against the limits it prints
 * (21 Nov, owner's choice): no relaxation is added or assumed.
 */
export function AgeFinder({ jobs }: { jobs: AgeJob[] }) {
  const id = useId();
  const [dob, setDob] = useState("");
  const [place, setPlace] = useState("all");
  const [q, setQ] = useState("");
  const [showAll, setShowAll] = useState(false);

  const places = useMemo(() => {
    const m = new Map<string, string>();
    for (const j of jobs) m.set(j.placeSlug, j.place);
    return [...m.entries()].sort((a, b) => (a[0] === "central" ? -1 : b[0] === "central" ? 1 : a[1].localeCompare(b[1])));
  }, [jobs]);

  const rows = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return jobs
      .filter((j) => place === "all" || j.placeSlug === place)
      .filter((j) => words.every((w) => `${j.code} ${j.title} ${j.place}`.toLowerCase().includes(w)))
      .map((j) => {
        const on = j.asOn || j.lastDate;
        const age = dob && on && dob < on ? calculateAgeAtDate(dob, on) : null;
        return { j, on, age, v: age ? verdict(j, age.years, age.months) : null };
      })
      .sort((a, b) => a.j.lastDate.localeCompare(b.j.lastDate));
  }, [jobs, dob, place, q]);

  const sure = rows.filter((r) => r.v && (r.v.kind === "general" || r.v.kind === "some"));
  const maybe = rows.filter((r) => r.v && r.v.kind === "range");
  // those that fit by their printed limits first, then the "may fit"
  const fitting = [...sure, ...maybe];
  const list = dob && !showAll ? fitting : rows;
  const field = "mt-1 block w-full min-h-[48px] rounded-lg border border-line bg-surface px-3 text-base text-ink focus:border-navy";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-xl border border-line bg-surface p-4 sm:grid-cols-3 sm:p-5">
        <label htmlFor={`${id}-dob`} className="text-sm font-semibold text-ink">
          Your date of birth
          <input id={`${id}-dob`} type="date" value={dob} max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => { setDob(e.target.value); setShowAll(false); }} className={field} />
          <span className="mt-1 block text-[12px] font-normal text-muted">As on your 10th certificate</span>
        </label>
        <label htmlFor={`${id}-place`} className="text-sm font-semibold text-ink">
          Jobs in
          <select id={`${id}-place`} value={place} onChange={(e) => setPlace(e.target.value)} className={field}>
            <option value="all">All states and central</option>
            {places.map(([slug, name]) => <option key={slug} value={slug}>{name}</option>)}
          </select>
        </label>
        <label htmlFor={`${id}-q`} className="text-sm font-semibold text-ink">
          Search a post or body
          <input id={`${id}-q`} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. constable, KEA, nurse" className={field} />
        </label>
      </div>

      <div>
        <p className="text-sm text-ink" aria-live="polite">
          {dob ? (
            <><b>{sure.length}</b> open notice{sure.length === 1 ? "" : "s"} fit your age by the limits they print
              {maybe.length > 0 && <>, and <b>{maybe.length}</b> more may fit (only one limit was read from their wording)</>}.{" "}
              <button type="button" onClick={() => setShowAll(!showAll)} className="inline-flex min-h-[44px] items-center font-semibold text-navy underline underline-offset-2">
                {showAll ? "Show only those that fit" : "Show all, with the reason"}
              </button></>
          ) : (
            <><b>{rows.length}</b> open notice{rows.length === 1 ? "" : "s"} with an age limit. Enter your date of birth to see which fit.</>
          )}
        </p>

        <ul className="mt-2 divide-y divide-line-soft rounded-xl border border-line bg-surface">
          {list.slice(0, 80).map(({ j, on, age, v }) => (
            <li key={j.id} className="px-4 py-3">
              <Link href={j.href} className="block font-semibold text-ink hover:text-navy leading-snug">
                <span className="font-bold text-navy">{j.code}</span> {j.title}
              </Link>
              <p className="mt-0.5 text-[13px] text-muted">
                {j.place} · last date {formatDate(j.lastDate)}
              </p>
              {age && v ? (
                <p className={`mt-1 text-sm font-semibold ${STYLE[v.kind]}`}>
                  {v.text}
                  <span className="block text-[13px] font-normal text-ink-2">
                    Age on {formatDate(on)}: {age.years} years{age.months ? ` ${age.months} months` : ""}
                    {j.asOn ? " (the date the notice counts age on)" : " (the notice gives no date; its last date is used)"}
                  </span>
                </p>
              ) : (
                <p className="mt-1 text-[13px] text-ink-2">
                  {j.limits.length ? `Limits printed for ${new Set(j.limits.map((l) => l.category || "all")).size} categor${new Set(j.limits.map((l) => l.category || "all")).size === 1 ? "y" : "ies"}` : `Upper age limit ${j.maxAge}`}
                  {j.asOn ? `, age counted as on ${formatDate(j.asOn)}` : ""}
                </p>
              )}
              {j.domicile && (
                <p className="mt-1 text-[13px] text-ink-2"><span className="font-semibold text-ink">Residence rule:</span> {j.domicile.value}{j.domicile.page ? ` (p. ${j.domicile.page})` : ""}</p>
              )}
            </li>
          ))}
          {!list.length && (
            <li className="px-4 py-6 text-sm text-ink-2">
              {dob ? "No open notice in this list fits your age. Try all states, or show all with the reason." : "No open notice matches. Clear the search or choose all states."}
            </li>
          )}
        </ul>
        {list.length > 80 && <p className="mt-2 text-sm text-ink-2">Showing the first 80, by last date. Choose a state or search to narrow the list.</p>}
      </div>

      <p className="max-w-[68ch] text-sm text-ink-2">
        Each notice is checked against the age limits it prints, on the date it counts age from. Nothing is added:
        relaxations a notice does not print in a table (ex-servicemen, government employees, widows…) are in the
        notice itself. Always confirm on the official notification before you apply.
      </p>
    </div>
  );
}
