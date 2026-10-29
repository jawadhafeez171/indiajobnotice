import { getAllJobs } from "@/lib/jobs-store";

// Saved jobs for the watchlist drawer: GET /api/jobs?ids=ijn-1,ijn-2 (ids or slugs, at most 100).
export async function GET(request: Request) {
  const ids = (new URL(request.url).searchParams.get("ids") ?? "").split(",").filter(Boolean).slice(0, 100);
  if (ids.length === 0) return Response.json([]);
  const wanted = new Set(ids);
  const jobs = (await getAllJobs()).filter((j) => wanted.has(j.id) || wanted.has(j.slug));
  return Response.json(jobs);
}
