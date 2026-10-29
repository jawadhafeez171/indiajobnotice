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
  // expire 0: the next visit gets the new list, not one more stale page (publishing is twice a day)
  revalidateTag("jobs", { expire: 0 });
  return Response.json({ ok: true, revalidated: "jobs" });
}
