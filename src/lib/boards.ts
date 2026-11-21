import { STATE_BOARDS, StateBoard } from "@/data/state-boards";
import { getStateBySlug } from "@/config/states";
import { JobNotification, getExamsInProgress, isOpenOrOpening, todayIST } from "@/data/jobs";

// Board pages (21 Nov, owner's plan): one page per official recruiting body the agent watches in a state, at
// /state/<state>/boards/<board>. A notice belongs to the board whose source found it (`job.source`, written by
// the agent); a state's district courts share one page. Only facts from the notices and our own records.

export interface Board {
  stateSlug: string;
  slug: string;
  name: string;
  /** "Public service commissions", "Courts"... */
  group: string;
  /** The official recruitment page (the shortest of its sources' pages). */
  url: string;
  sources: string[];
  /** A shared page (district courts): each court with its own official page. */
  members?: StateBoard[];
}

let built: { byState: Map<string, Board[]>; bySource: Map<string, Board> } | null = null;

function index() {
  if (built) return built;
  const byState = new Map<string, Board[]>();
  const bySource = new Map<string, Board>();
  for (const [stateSlug, groups] of Object.entries(STATE_BOARDS)) {
    const boards = new Map<string, Board>();
    for (const g of groups) {
      for (const b of g.bodies) {
        let board = boards.get(b.board);
        if (!board) {
          const shared = b.board === "district-courts" || b.board === "district-recruitment-bureaus";
          board = {
            stateSlug, slug: b.board, group: g.label, url: b.url, sources: [],
            name: shared ? (b.board === "district-courts" ? "District courts" : "District recruitment bureaus") : b.name,
            members: shared ? [] : undefined,
          };
          boards.set(b.board, board);
        }
        board.sources.push(...b.sources);
        board.members?.push(b);
        for (const s of b.sources) bySource.set(s, board);
      }
    }
    byState.set(stateSlug, [...boards.values()]);
  }
  built = { byState, bySource };
  return built;
}

export function getBoardsOfState(stateSlug: string): Board[] {
  return index().byState.get(stateSlug) || [];
}

export function getBoard(stateSlug: string, boardSlug: string): Board | undefined {
  return getBoardsOfState(stateSlug).find((b) => b.slug === boardSlug);
}

/** The board a notice came from, when its source is one we list. */
export function boardOfJob(job: Pick<JobNotification, "source">): Board | undefined {
  return job.source ? index().bySource.get(job.source) : undefined;
}

export function boardPath(b: Pick<Board, "stateSlug" | "slug">): string {
  return `/state/${b.stateSlug}/boards/${b.slug}`;
}

/** The board's notices: open, under way, and earlier ones notified within the last 12 months. */
export function boardJobs(board: Board, jobs: JobNotification[], today = todayIST()) {
  const own = jobs.filter((j) => j.source && board.sources.includes(j.source));
  const open = own.filter((j) => !j.inProgress && isOpenOrOpening(j))
    .sort((a, b) => (a.applicationEndDate || "9999").localeCompare(b.applicationEndDate || "9999"));
  // as the state page counts them: a final result older than 45 days is no longer "under way"
  const underWay = getExamsInProgress(own);
  const yearAgo = new Date(Date.parse(today) - 365 * 86400000).toISOString().slice(0, 10);
  const earlier = own.filter((j) => !open.includes(j) && !underWay.includes(j)
    && (j.notificationDate || j.publishedAt || j.applicationEndDate || "") >= yearAgo)
    .sort((a, b) => (b.applicationEndDate || "").localeCompare(a.applicationEndDate || ""));
  return { open, underWay, earlier };
}

/** A board is worth search engines' time while something of its own is open or under way. */
export function boardHasListings(board: Board, jobs: JobNotification[]): boolean {
  const { open, underWay } = boardJobs(board, jobs);
  return open.length + underWay.length > 0;
}

/** The job with its board's page link (its source from the job, else from the daily list, which has it). */
export function withBoard(job: JobNotification, all: JobNotification[]): JobNotification {
  const source = job.source || all.find((j) => j.id === job.id)?.source;
  const board = source ? boardOfJob({ source }) : undefined;
  return board ? { ...job, source, boardHref: boardPath(board), boardName: board.members ? `${board.name} in ${getStateBySlug(board.stateSlug)?.name || board.stateSlug}` : board.name } : job;
}
