import { ImageResponse } from "next/og";
import { getAllJobs } from "@/lib/jobs-store";
import { googleFont } from "@/lib/job-card-image";

// The site's preview picture (home, calendar, category, state and other pages; job pages have their
// own): wordmark, tagline, the kinds of jobs listed, how many are open now, the site and the channels.
export const alt = "India Job Notice: verified government job alerts";
export const size = { width: 1200, height: 315 };
export const contentType = "image/png";
export const revalidate = 3600;

const NAVY = "#14286b";
const SAFFRON = "#ef7a1a";
const GREEN = "#1f9a4a";
const CREAM = "#fbf8ee";
const FIELDS = ["PSC", "SSC & UPSC", "Engineering", "Medical", "Police", "Defence", "Railways", "Banking", "Teaching"];

export default async function Image() {
  let open = 0;
  try {
    open = (await getAllJobs()).filter((j) => j.status === "APPLY_OPEN" || j.status === "LAST_DATE_NEAR").length;
  } catch {
    open = 0;     // the card still works without the count
  }
  const words = `INDIA JOB NOTICE Verified government job alerts ${FIELDS.join(" ")} ${open} jobs open now www.indiajobnotice.com WhatsApp & Telegram: India Job Notice Central and state`;
  const [regular, bold] = await Promise.all([
    googleFont("Barlow Semi Condensed", 600, words),
    googleFont("Barlow Semi Condensed", 800, words),
  ]);
  const fonts = [
    regular && { name: "Barlow", data: regular, weight: 600 as const, style: "normal" as const },
    bold && { name: "Barlow", data: bold, weight: 800 as const, style: "normal" as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 600 | 800; style: "normal" }[];

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: CREAM, fontFamily: "Barlow", color: NAVY }}>
        <div style={{ display: "flex", height: 10 }}>
          <div style={{ flex: 1, background: SAFFRON }} />
          <div style={{ flex: 1, background: "#ffffff" }} />
          <div style={{ flex: 1, background: GREEN }} />
        </div>
        <div style={{ display: "flex", flex: 1, padding: "22px 56px 0", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", fontSize: 58, fontWeight: 800, lineHeight: 1 }}>
              <span>INDIA&nbsp;</span>
              <span style={{ color: SAFFRON }}>JOB</span>
              <span>&nbsp;NOTICE</span>
            </div>
            <div style={{ display: "flex", marginTop: 6, fontSize: 28, fontWeight: 600, color: "#4a5578" }}>
              Verified government job alerts · Central and state
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", marginTop: 16, maxWidth: 820 }}>
              {FIELDS.map((f) => (
                <span key={f} style={{ display: "flex", fontSize: 22, fontWeight: 600, color: NAVY, background: "#e4e9f7", padding: "3px 12px", borderRadius: 6, marginRight: 8, marginBottom: 8 }}>
                  {f}
                </span>
              ))}
            </div>
          </div>
          {open > 0 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginLeft: 24, marginTop: 4 }}>
              <span style={{ fontSize: 76, fontWeight: 800, color: "#c2410c", lineHeight: 1 }}>{open}</span>
              <span style={{ fontSize: 24, fontWeight: 600, color: "#4a5578" }}>jobs open now</span>
            </div>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 52, background: NAVY, color: "#ffffff", padding: "0 56px", fontSize: 24, fontWeight: 600 }}>
          <span>www.indiajobnotice.com</span>
          <span>WhatsApp &amp; Telegram: India Job Notice</span>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
