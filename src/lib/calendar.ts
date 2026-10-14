import { JobNotification } from "@/data/jobs";

export interface CalendarEventParams {
  title: string;
  description: string;
  startDate: string; // YYYY-MM-DD or ISO string
  endDate?: string;
  location?: string;
  url?: string;
}

function formatDateToIcs(dateStr: string, isAllDay: boolean = true): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      // Fallback: strip dashes from YYYY-MM-DD
      return dateStr.replace(/[-:]/g, "");
    }
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    if (isAllDay) {
      return `${year}${month}${day}`;
    }
    const hours = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");
    const secs = String(d.getSeconds()).padStart(2, "0");
    return `${year}${month}${day}T${hours}${mins}${secs}Z`;
  } catch {
    return dateStr.replace(/[-:]/g, "");
  }
}

export function generateGoogleCalendarUrl(event: CalendarEventParams): string {
  const start = formatDateToIcs(event.startDate);
  // For all-day Google Calendar events, end date must be start + 1 day
  let end = start;
  try {
    const d = new Date(event.startDate);
    d.setDate(d.getDate() + 1);
    end = formatDateToIcs(d.toISOString().slice(0, 10));
  } catch {
    end = start;
  }

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    details: `${event.description}\n\nOfficial Gazette: ${event.url || "https://indiajobnotice.com"}`,
    location: event.location || "National / India (Official Gazette)",
    sprop: "name:IndiaJobNotice",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function generateIcsContent(events: CalendarEventParams[]): string {
  const timestamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";

  let ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//IndiaJobNotice//Govt Recruitment Calendar 2026//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  events.forEach((ev, idx) => {
    const start = formatDateToIcs(ev.startDate);
    let end = start;
    try {
      const d = new Date(ev.startDate);
      d.setDate(d.getDate() + 1);
      end = formatDateToIcs(d.toISOString().slice(0, 10));
    } catch {
      end = start;
    }

    ics.push(
      "BEGIN:VEVENT",
      `UID:indiajobnotice-${idx}-${Date.now()}@indiajobnotice.com`,
      `DTSTAMP:${timestamp}`,
      `DTSTART;VALUE=DATE:${start}`,
      `DTEND;VALUE=DATE:${end}`,
      `SUMMARY:${ev.title.replace(/[,;]/g, " ")}`,
      `DESCRIPTION:${ev.description.replace(/\n/g, "\\n")}`,
      `LOCATION:${(ev.location || "India").replace(/[,;]/g, " ")}`,
      `URL:${ev.url || "https://indiajobnotice.com"}`,
      "STATUS:CONFIRMED",
      "END:VEVENT"
    );
  });

  ics.push("END:VCALENDAR");
  return ics.join("\r\n");
}

export function downloadIcsFile(event: CalendarEventParams, filename = "job-deadline.ics"): void {
  if (typeof window === "undefined") return;
  const content = generateIcsContent([event]);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadCombinedIcsFile(
  events: CalendarEventParams[],
  filename = "indiajobnotice-watchlist-schedule.ics"
): void {
  if (typeof window === "undefined") return;
  const content = generateIcsContent(events);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
