import { JobNotification, getJobCanonicalPath, isOpenOrOpening, todayIST } from "@/data/jobs";

/** A body hiring in the state now: its open notices and the newest one's page. */
export interface HiringBody {
  name: string;
  code: string;
  open: number;
  posts: number;
  href: string;
}

/** What a state page says about itself (title, description, "at a glance"), from its own open notices only. */
export interface StateHubFacts {
  /** The state's own notices taking applications now or opening on a stated day. */
  open: JobNotification[];
  /** Of those, the ones whose last date is within the next 7 days, soonest first. */
  closingSoon: JobNotification[];
  /** Posts across the open notices that state a number. */
  posts: number;
  bodies: HiringBody[];
  biggest: JobNotification | null;
}

const addDays = (iso: string, n: number) => new Date(Date.parse(iso) + n * 86400000).toISOString().slice(0, 10);

/** `jobs` are the state's own notices (no central ones). */
export function stateHubFacts(jobs: JobNotification[], today = todayIST()): StateHubFacts {
  const open = jobs.filter((j) => !j.isCentral && !j.inProgress && isOpenOrOpening(j));
  const week = addDays(today, 7);
  const closingSoon = open
    .filter((j) => j.applicationEndDate && j.applicationEndDate >= today && j.applicationEndDate <= week)
    .sort((a, b) => a.applicationEndDate.localeCompare(b.applicationEndDate));
  const byBody = new Map<string, HiringBody & { newest: string }>();
  for (const j of open) {
    // one body under one code ("Karnataka Examinations Authority" and "KEA (for Department of ...)" are both KEA)
    const code = (j.orgShortCode || "").split(" · ")[0].trim();
    const key = code && code.length <= 10 ? `code:${code.toLowerCase()}` : j.organization.trim().toLowerCase();
    const at = j.publishedAt || j.notificationDate || "";
    const b = byBody.get(key);
    if (!b) {
      byBody.set(key, { name: j.organization, code, open: 1,
        posts: j.totalVacancies || 0, href: getJobCanonicalPath(j), newest: at });
    } else {
      b.open += 1;
      b.posts += j.totalVacancies || 0;
      // the body's own name, not "KEA (for Department of ...)"
      if (!j.organization.includes("(") && (b.name.includes("(") || j.organization.length < b.name.length)) b.name = j.organization;
      if (at > b.newest) Object.assign(b, { href: getJobCanonicalPath(j), newest: at });
    }
  }
  const bodies = [...byBody.values()]
    .sort((a, b) => b.open - a.open || b.posts - a.posts || a.name.localeCompare(b.name))
    .map((b): HiringBody => ({ name: b.name, code: b.code, open: b.open, posts: b.posts, href: b.href }));
  const biggest = [...open].sort((a, b) => (b.totalVacancies || 0) - (a.totalVacancies || 0))[0] || null;
  return { open, closingSoon, posts: open.reduce((n, j) => n + (j.totalVacancies || 0), 0), bodies, biggest };
}

/** "KPSC, KEA, KSP and 9 more" from the bodies hiring, by short code when it is short. */
export function bodiesPhrase(bodies: HiringBody[], show = 3): string {
  // short codes and short names only ("Principal District and Sessions Court, Vijayapura" is one of "N more")
  const label = (b: HiringBody) => (b.code && b.code.length <= 10 ? b.code : b.name.length <= 24 ? b.name : "");
  const names = bodies.map(label).filter(Boolean).slice(0, show);
  const rest = bodies.length - names.length;
  if (!names.length) return "";
  if (rest > 0) return `${names.join(", ")} and ${rest} more`;
  return names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names[0];
}

const n = (x: number) => x.toLocaleString("en-IN");

/** Search description: the count, who is hiring, what closes soon (about 155 characters). */
export function stateHubDescription(stateName: string, f: StateHubFacts): string {
  if (!f.open.length) {
    return `${stateName} government job notifications from its commissions, boards, police and courts: last dates, `
      + "eligibility, admit cards and results, each with the official notification link.";
  }
  const parts = [`${n(f.open.length)} open ${stateName} government job notification${f.open.length === 1 ? "" : "s"}`];
  const who = bodiesPhrase(f.bodies);
  if (who) parts[0] += ` from ${who}`;
  const tail = f.closingSoon.length ? `${n(f.closingSoon.length)} close${f.closingSoon.length === 1 ? "s" : ""} this week.` : "";
  return `${parts[0]}. ${tail} Last dates, eligibility and the official notification links.`.replace(/\s+/g, " ").trim();
}
