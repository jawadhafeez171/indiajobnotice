import { ImageResponse } from "next/og";
import { getStateBySlug } from "@/config/states";
import { JobNotification, getJobBySlug, isJobApplicationClosed } from "@/data/jobs";
import { getAllJobs } from "@/lib/jobs-store";
import { formatDate } from "@/lib/utils";
import { rowTitle } from "@/components/jobs/JobListCard";

// A job page's preview picture (Google results, WhatsApp and Telegram link previews): drawn from the
// notice's own facts, made once per page on first request and then cached. No logos or emblems.
export const CARD_SIZE = { width: 1200, height: 630 };

const NAVY = "#14286b";
const SAFFRON = "#ef7a1a";
const GREEN = "#1f9a4a";
const CREAM = "#fbf8ee";

/** A Google Font as TrueType, only the glyphs the card uses (Vercel's documented way for next/og). */
async function googleFont(family: string, weight: number, text: string): Promise<ArrayBuffer | null> {
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
  const post = job ? clip(rowTitle(job), 110) : "Government job notification";
  const org = job ? clip(job.organization, 70) : "";
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

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: CREAM, fontFamily: "Barlow", color: NAVY }}>
        <div style={{ display: "flex", height: 14 }}>
          <div style={{ flex: 1, background: SAFFRON }} />
          <div style={{ flex: 1, background: "#ffffff" }} />
          <div style={{ flex: 1, background: GREEN }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "42px 72px 0" }}>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 800 }}>
            <span>INDIA&nbsp;</span>
            <span style={{ color: SAFFRON }}>JOB</span>
            <span>&nbsp;NOTICE</span>
          </div>
          {(code || place) && (
            <div style={{ display: "flex", alignItems: "center", marginTop: 40, fontSize: 32, fontWeight: 600, color: "#4a5578" }}>
              {code && (
                <span style={{ background: "#e4e9f7", color: NAVY, fontWeight: 800, padding: "4px 14px", borderRadius: 8, marginRight: 14 }}>{code}</span>
              )}
              <span>{place}</span>
            </div>
          )}
          {/* longer post names in smaller type, so three lines still leave room for the facts */}
          <div style={{ display: "flex", marginTop: 16, fontFamily: "Serif", fontWeight: 700, fontSize: post.length > 80 ? 42 : post.length > 45 ? 50 : 60, lineHeight: 1.1, color: "#101828", maxHeight: 170, overflow: "hidden" }}>
            {post}
          </div>
          {org && <div style={{ display: "flex", marginTop: 12, fontSize: 30, fontWeight: 600, color: "#4a5578" }}>{org}</div>}
          <div style={{ display: "flex", marginTop: "auto", marginBottom: 30 }}>
            <div style={{ display: "flex", flexDirection: "column", marginRight: 56 }}>
              <span style={{ fontSize: 24, fontWeight: 600, color: "#6b7390" }}>Posts</span>
              <span style={{ fontSize: 46, fontWeight: 800 }}>{posts}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 24, fontWeight: 600, color: "#6b7390" }}>{lastLabel}</span>
              <span style={{ fontSize: 46, fontWeight: 800, color: closed ? "#4a5578" : "#c2410c" }}>{last}</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 64, background: NAVY, color: "#ffffff", padding: "0 72px", fontSize: 26, fontWeight: 600 }}>
          <span>Read from the official notification</span>
          <span>www.indiajobnotice.com</span>
        </div>
      </div>
    ),
    { ...CARD_SIZE, fonts: fonts.length ? fonts : undefined },
  );
}
