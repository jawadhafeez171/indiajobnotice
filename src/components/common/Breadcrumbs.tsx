import React from "react";
import Link from "next/link";
import { safeJson } from "@/lib/json-ld";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  /** Absent for the page itself (the last step). */
  href?: string;
}

const SITE = "https://www.indiajobnotice.com";

/**
 * "Home › Delhi jobs › Engineering jobs › DSSSB Combined Examinations…": one line on every page but the home
 * page (11 Nov, owner's choice). Phones keep Home, the first step and this page, so it never wraps; the page's
 * own name is cut with "…". The same trail goes to Google as BreadcrumbList data unless the page already sends
 * it (`data={false}`: the job page's structured data carries its own).
 */
export function Breadcrumbs({
  items,
  className,
  data = true,
  aside,
}: {
  items: Crumb[];
  className?: string;
  data?: boolean;
  /** Something for the far end of the line on wider screens ("← Delhi jobs"). */
  aside?: React.ReactNode;
}) {
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...items];
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: c.href.startsWith("http") ? c.href : `${SITE}${c.href}` } : {}),
    })),
  };
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center justify-between gap-3 text-[13px] text-muted print:hidden", className)}>
      {data && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(ld) }} />}
      <ol className="flex items-center gap-x-1.5 min-w-0 list-none p-0 m-0 whitespace-nowrap">
        {trail.map((c, i) => {
          const last = i === trail.length - 1;
          return (
            <li
              key={`${i}-${c.label}`}
              className={cn("items-center gap-x-1.5", last ? "flex min-w-0" : "flex shrink-0", i > 1 && !last && "hidden sm:flex")}
            >
              {i > 0 && <span aria-hidden className="text-faint">›</span>}
              {last || !c.href ? (
                <span aria-current={last ? "page" : undefined} className={cn("truncate", last && "text-ink-2 font-medium")}>
                  {c.label}
                </span>
              ) : (
                <Link href={c.href} className="inline-block py-1.5 font-medium hover:text-navy transition-colors">
                  {c.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      {aside && <div className="hidden sm:block shrink-0">{aside}</div>}
    </nav>
  );
}
