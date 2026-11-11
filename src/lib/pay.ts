// The pay range a notice states, for the job page's JobPosting data (Google shows it in job results).
// Only when it can be read safely (11 Nov): monthly or daily amounts in a sane range. Yearly CTC in lakhs,
// per-lecture or per-hour fees, and references such as "OM No.3-25/2020 dated 09.12.2020" give no range, so
// nothing wrong is sent: an empty or wrong amount is worse in Search Console than none.

export interface PayRange {
  min: number;
  max?: number;
  unit: "MONTH" | "DAY";
}

const NOT_MONTHLY = /lakh|crore|\bctc\b|per\s+annum|\bp\.\s?a\.|\bannual|per\s+(?:lecture|hour|class|session|visit|period)/i;
const DAILY = /per\s*day|\bdaily\b|per\s+diem/i;

export function payRange(text?: string | null): PayRange | null {
  if (!text || NOT_MONTHLY.test(text)) return null;
  const daily = DAILY.test(text) && !/month/i.test(text);
  const cleaned = text
    .replace(/\bO\.?\s?M\.?\s*No\.?[^|;]*/gi, " ") // office memo references
    .replace(/\bNo\.\s*[\w/.-]+/gi, " ") // other reference numbers
    .replace(/\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b/g, " ") // dates
    .replace(/\d+(?:\.\d+)?\s*%/g, " "); // "15% HRA"
  const amounts = [...cleaned.matchAll(/\d[\d,]*(?:\.\d+)?/g)]
    .map((m) => Number(m[0].replace(/,/g, "")))
    .filter((n) => Number.isFinite(n));
  // pay-scale increments ("64820-2340/1-67160"), levels and years fall below the floor
  const [low, high] = daily ? [100, 20000] : [5000, 500000];
  const ok = amounts.filter((n) => n >= low && n <= high);
  if (!ok.length) return null;
  const min = Math.min(...ok);
  const max = Math.max(...ok);
  return { min, ...(max > min ? { max } : {}), unit: daily ? "DAY" : "MONTH" };
}
