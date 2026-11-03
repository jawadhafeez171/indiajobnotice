"use client";

import React, { useId, useMemo, useState } from "react";
import { JobNotification, calculateAgeAtDate } from "@/data/jobs";
import { formatDate } from "@/lib/utils";

type Limit = NonNullable<JobNotification["ageLimits"]>[number];

const months = (y: number, m: number) => y * 12 + m;
const say = (total: number) => {
  const y = Math.floor(total / 12), m = total % 12;
  return [y && `${y} year${y === 1 ? "" : "s"}`, m && `${m} month${m === 1 ? "" : "s"}`].filter(Boolean).join(" ") || "less than a month";
};

/**
 * Date of birth -> age on the notice's own reckoning date -> within the printed limit for the chosen
 * post and category or not. Shown only when the notice gives both (nothing is assumed).
 */
export function AgeCheck({ asOn, limits }: { asOn: string; limits: Limit[] }) {
  const id = useId();
  const posts = useMemo(() => [...new Set(limits.map((l) => l.post))], [limits]);
  const [post, setPost] = useState(posts[0] ?? "");
  const cats = useMemo(() => [...new Set(limits.filter((l) => l.post === post).map((l) => l.category))], [limits, post]);
  const [cat, setCat] = useState(cats[0] ?? "");
  const [dob, setDob] = useState("");
  const category = cats.includes(cat) ? cat : cats[0] ?? "";
  const limit = limits.find((l) => l.post === post && l.category === category);

  let result: { ok: boolean; text: string } | null = null;
  if (dob && limit && dob < asOn) {
    const age = calculateAgeAtDate(dob, asOn);
    const have = months(age.years, age.months);
    const ageText = `${age.years} years${age.months ? ` ${age.months} months` : ""}`;
    if (have >= months(limit.max + 1, 0)) {
      result = { ok: false, text: `On ${formatDate(asOn)} you will be ${ageText}: over the upper limit of ${limit.max} (you reached ${limit.max + 1} on ${formatDate(`${Number(dob.slice(0, 4)) + limit.max + 1}${dob.slice(4)}`)}).` };
    } else if (limit.min && have < months(limit.min, 0)) {
      result = { ok: false, text: `On ${formatDate(asOn)} you will be ${ageText}: under the minimum of ${limit.min} by ${say(months(limit.min, 0) - have)}.` };
    } else {
      result = { ok: true, text: `On ${formatDate(asOn)} you will be ${ageText}: within the limit${limit.min ? ` of ${limit.min} to ${limit.max}` : ` of ${limit.max}`}.` };
    }
  }

  const field = "mt-1 block w-full min-h-[44px] rounded-lg border border-line bg-surface px-3 text-sm text-ink focus:border-navy";
  return (
    <div className="rounded-lg bg-subtle px-4 py-4 space-y-3">
      <p className="text-sm font-bold text-ink">Check your age for this notice</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-xs font-semibold text-muted" htmlFor={`${id}-dob`}>
          Your date of birth
          <input id={`${id}-dob`} type="date" value={dob} max={asOn} onChange={(e) => setDob(e.target.value)} className={field} />
        </label>
        {posts.length > 1 && (
          <label className="text-xs font-semibold text-muted" htmlFor={`${id}-post`}>
            Post
            <select id={`${id}-post`} value={post} onChange={(e) => setPost(e.target.value)} className={field}>
              {posts.map((p) => <option key={p} value={p}>{p || "All posts"}</option>)}
            </select>
          </label>
        )}
        {cats.length > 1 && (
          <label className="text-xs font-semibold text-muted" htmlFor={`${id}-cat`}>
            Your category
            <select id={`${id}-cat`} value={category} onChange={(e) => setCat(e.target.value)} className={field}>
              {cats.map((c) => <option key={c} value={c}>{c || "All candidates"}</option>)}
            </select>
          </label>
        )}
      </div>
      <p aria-live="polite" className={`text-sm font-semibold ${result ? (result.ok ? "text-green" : "text-danger") : "text-muted font-normal"}`}>
        {result ? result.text : `Age is counted as on ${formatDate(asOn)}, the date the notification gives.`}
      </p>
      <p className="text-xs text-muted">
        Only the limits printed above are checked. Other relaxations (ex-servicemen, persons with disabilities,
        government employees…) are in the official notification.
      </p>
    </div>
  );
}
