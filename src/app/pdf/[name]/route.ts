import { NextResponse } from "next/server";
import { getAllJobs } from "@/lib/jobs-store";
import { signedPdfUrl } from "@/lib/r2-link";

// /pdf/<name>.pdf: our stored copy of a notice sent by hand (the agent could not get its official
// address, e.g. UPSC refuses it). Sends the visitor to a short-lived link to that one file, not through
// this function (Vercel limits how large a response can be). Only files a published notice names.
export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const jobs = await getAllJobs();
  const owner = jobs.find((j) => j.copyName === name || j.stages?.some((s) => s.copyName === name));
  if (!owner) return new NextResponse("Not found", { status: 404 });
  const stage = owner.stages?.find((s) => s.copyName === name);
  const key = stage?.copyKey || (owner.copyName === name ? owner.copyKey : undefined);
  const target = (key && signedPdfUrl(key)) || stage?.url || owner.officialPdfUrl;
  return NextResponse.redirect(target, {
    status: 307,
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  });
}
