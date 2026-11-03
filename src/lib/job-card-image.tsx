import { ImageResponse } from "next/og";
import { getStateBySlug } from "@/config/states";
import { JobNotification, getJobBySlug, isJobApplicationClosed } from "@/data/jobs";
import { getAllJobs } from "@/lib/jobs-store";
import { formatDate } from "@/lib/utils";
import { rowTitle } from "@/components/jobs/JobListCard";

// A job page's preview picture (Google results, WhatsApp and Telegram link previews): drawn from the
// notice's own facts, made once per page on first request and then cached. No logos or emblems.
export const CARD_SIZE = { width: 1200, height: 315 };

const NAVY = "#14286b";
const SAFFRON = "#ef7a1a";
const GREEN = "#1f9a4a";
const CREAM = "#fbf8ee";

/** A Google Font as TrueType, only the glyphs the card uses (Vercel's documented way for next/og). */
export async function googleFont(family: string, weight: number, text: string): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
    if (!src) return null;
    const res = await fetch(src[1]);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

function clip(t: string, n: number): string {
  return t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t;
}

export async function jobCardImage(slug: string): Promise<ImageResponse> {
  const job: JobNotification | undefined = getJobBySlug(await getAllJobs(), slug);
  const code = job ? job.orgShortCode.split("·")[0].trim() : "";
  const place = job ? (job.isCentral ? "Central" : getStateBySlug(job.stateSlug)?.name || "") : "";
  const post = job ? clip(rowTitle(job), 90) : "Government job notification";
  const org = job ? clip(job.organization, 60) : "";
  const posts = job?.totalVacancies ? job.totalVacancies.toLocaleString("en-IN") : "See notice";
  const closed = job ? isJobApplicationClosed(job) : false;
  const lastLabel = job?.isWalkIn ? "Walk-in interview" : closed ? "Applications closed" : "Last date to apply";
  const last = job?.applicationEndDate ? formatDate(job.applicationEndDate) : "See notice";

  const words = `INDIA JOB NOTICE ${code} ${place} ${org} Posts ${posts} ${lastLabel} ${last} Read from the official notification www.indiajobnotice.com`;
  const [sans, sansBold, serif] = await Promise.all([
    googleFont("Barlow Semi Condensed", 600, words),
    googleFont("Barlow Semi Condensed", 800, words),
    googleFont("Source Serif 4", 700, post),
  ]);
  const fonts = [
    sans && { name: "Barlow", data: sans, weight: 600 as const, style: "normal" as const },
    sansBold && { name: "Barlow", data: sansBold, weight: 800 as const, style: "normal" as const },
    serif && { name: "Serif", data: serif, weight: 700 as const, style: "normal" as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 600 | 800 | 700; style: "normal" }[];

  // 1200x315, like the site card: the job on the left, posts and last date on the right
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: CREAM, fontFamily: "Barlow", color: NAVY }}>
        <div style={{ display: "flex", height: 10 }}>
          <div style={{ flex: 1, background: SAFFRON }} />
          <div style={{ flex: 1, background: "#ffffff" }} />
          <div style={{ flex: 1, background: GREEN }} />
        </div>
        <div style={{ display: "flex", flex: 1, padding: "18px 56px 0" }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", fontSize: 24, fontWeight: 800 }}>
              <span>INDIA&nbsp;</span>
              <span style={{ color: SAFFRON }}>JOB</span>
              <span>&nbsp;NOTICE</span>
              {(code || place) && <span style={{ color: "#9aa1b8", margin: "0 12px", fontWeight: 600 }}>|</span>}
              {code && (
                <span style={{ background: "#e4e9f7", color: NAVY, padding: "1px 10px", borderRadius: 6, marginRight: 10 }}>{code}</span>
              )}
              <span style={{ fontWeight: 600, color: "#4a5578" }}>{place}</span>
            </div>
            {/* the post in up to two lines: longer names in smaller type */}
            <div style={{ display: "flex", marginTop: 12, fontFamily: "Serif", fontWeight: 700, fontSize: post.length > 60 ? 34 : post.length > 38 ? 40 : 46, lineHeight: 1.12, color: "#101828", maxHeight: 104, overflow: "hidden" }}>
              {post}
            </div>
            {org && <div style={{ display: "flex", marginTop: 8, fontSize: 24, fontWeight: 600, color: "#4a5578" }}>{org}</div>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: 40, paddingLeft: 32, borderLeft: "2px solid #e4e9f7", minWidth: 250 }}>
            <span style={{ fontSize: 20, fontWeight: 600, color: "#6b7390" }}>Posts</span>
            <span style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.05 }}>{posts}</span>
            <span style={{ fontSize: 20, fontWeight: 600, color: "#6b7390", marginTop: 10 }}>{lastLabel}</span>
            <span style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.05, color: closed ? "#4a5578" : "#c2410c" }}>{last}</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 52, background: NAVY, color: "#ffffff", padding: "0 56px", fontSize: 22, fontWeight: 600 }}>
          <span>Read from the official notification</span>
          <span>www.indiajobnotice.com</span>
        </div>
      </div>
    ),
    { ...CARD_SIZE, fonts: fonts.length ? fonts : undefined },
  );
}
