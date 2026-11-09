import Link from "next/link";
import { getJobCanonicalPath, isOpenOrOpening, JobNotification } from "@/data/jobs";
import { formatDateShort } from "@/lib/utils";

/**
 * Every open notice as a plain link in the page's HTML. The interactive list shows ~20 rows and loads the
 * rest in the browser, so Google saw links to only 20 job pages from the homepage (9 Nov). Folded away
 * for visitors; read by crawlers all the same.
 */
export function OpenJobLinks({ jobs, heading = "All open notifications" }: { jobs: JobNotification[]; heading?: string }) {
  const open = jobs
    .filter(isOpenOrOpening)
    .sort((a, b) => (a.applicationEndDate || "9999").localeCompare(b.applicationEndDate || "9999"));
  if (!open.length) return null;
  return (
    <details className="rounded-xl border border-line bg-surface px-4 py-3 text-sm">
      <summary className="cursor-pointer font-bold text-ink min-h-[44px] flex items-center">
        {heading} ({open.length}) · plain list
      </summary>
      <ul className="mt-2 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
        {open.map((j) => (
          <li key={j.id} className="leading-snug">
            <Link href={getJobCanonicalPath(j)} className="text-navy hover:underline">
              {j.shortTitle || j.title}
            </Link>
            {j.applicationEndDate && (
              <span className="text-muted"> · last date {formatDateShort(j.applicationEndDate)}</span>
            )}
          </li>
        ))}
      </ul>
    </details>
  );
}
