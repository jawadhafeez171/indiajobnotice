import { revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";

// Called by the notice agent after it publishes or updates notices, so new jobs show within seconds.
// The secret (REVALIDATE_SECRET) is sent in the x-revalidate-secret header.
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const given = request.headers.get("x-revalidate-secret") ?? "";
  if (!secret || given.length !== secret.length || !timingSafeEqual(Buffer.from(given), Buffer.from(secret))) {
    return Response.json({ ok: false }, { status: 401 });
  }
  // expire 0: the next visit gets the new list, not one more stale page
  revalidateTag("jobs", { expire: 0 });
  // job pages only when the agent names them (changed or withdrawn); the rest renew once a day
  let slugs: string[] = [];
  try {
    const body = (await request.json()) as { slugs?: unknown };
    if (Array.isArray(body?.slugs)) slugs = body.slugs.filter((s): s is string => typeof s === "string" && /^[a-z0-9-]{1,200}$/i.test(s));
  } catch {
    // no body: the lists only
  }
  for (const slug of slugs.slice(0, 2000)) revalidateTag(`job:${slug.toLowerCase()}`, { expire: 0 });
  return Response.json({ ok: true, revalidated: "jobs", jobs: slugs.length });
}
