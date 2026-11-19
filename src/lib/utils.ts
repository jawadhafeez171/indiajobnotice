import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** One date format for the whole site: "02 Nov 2026". Accepts ISO dates or anything Date parses. */
export function formatDate(dateString: string): string {
  if (!dateString) return "";
  const iso = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    const [, year, month, day] = iso;
    return `${day} ${MONTHS[Number(month) - 1]} ${year}`;
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return `${String(date.getDate()).padStart(2, "0")} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/** Compact lists: "02 Nov" in the current year (IST), "02 Nov 2027" otherwise. */
export function formatDateShort(dateString: string): string {
  const full = formatDate(dateString);
  const thisYear = new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 4);
  return full.endsWith(` ${thisYear}`) ? full.slice(0, -5) : full;
}

/**
 * Whole days from today in India to a date: 0 on the day itself ("Closes today"), 1 the day before.
 * Calendar days in IST, the same count as the deadline groups (daysUntil / todayIST). 20 Nov: this compared
 * UTC midnight with the current moment, so from 00:00 to 05:30 IST every count was one too high
 * ("Closes tomorrow" under "Closing today").
 */
export function getDaysRemaining(targetDate: string, now = Date.now()): number {
  const todayIst = new Date(now + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
  return Math.round((Date.parse(targetDate.slice(0, 10)) - Date.parse(todayIst)) / 86400000);
}
