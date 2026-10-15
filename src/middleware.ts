import { NextRequest, NextResponse } from "next/server";
import { getStateBySlugOrCode } from "./config/states";

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all static files with extensions (e.g. /favicon.ico, .png, .jpg, .svg, .webp)
     */
    "/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)",
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // Extract host without port (e.g. "karnataka.localhost:3001" -> "karnataka.localhost")
  const hostWithoutPort = hostname.split(":")[0].toLowerCase();
  const PROD_DOMAIN = (process.env.NEXT_PUBLIC_BASE_DOMAIN || "indiajobnotice.com").toLowerCase();

  let subdomain: string | null = null;

  // 1. Check for localhost subdomains (e.g., karnataka.localhost)
  if (hostWithoutPort.endsWith(".localhost")) {
    subdomain = hostWithoutPort.replace(".localhost", "");
  }
  // 2. Check for production subdomains (e.g., karnataka.indiajobnotice.com)
  else if (hostWithoutPort.endsWith(`.${PROD_DOMAIN}`)) {
    subdomain = hostWithoutPort.replace(`.${PROD_DOMAIN}`, "");
  }

  // Normalize: 'www' or empty means central root portal
  if (!subdomain || subdomain === "www") {
    subdomain = null;
  }

  // If a user hits a legacy subdomain, redirect them to the canonical subdirectory /state/[state]
  if (subdomain) {
    const state = getStateBySlugOrCode(subdomain);
    if (state) {
      const targetPath = `/state/${state.slug}${url.pathname === "/" ? "" : url.pathname}`;
      const targetBase = hostWithoutPort.includes("localhost")
        ? `http://localhost:${url.port || 3000}`
        : `https://www.${PROD_DOMAIN}`;
      return NextResponse.redirect(new URL(targetPath, targetBase), 301);
    }
  }

  // If a user enters a short state path directly like /up, /bihar, /delhi, redirect to /state/[state]
  const pathParts = url.pathname.split("/").filter(Boolean);
  if (pathParts.length === 1) {
    const firstSegment = pathParts[0].toLowerCase();
    // Exclude known top-level routes
    if (!["state", "calculator", "calendar", "jobs", "api"].includes(firstSegment)) {
      const stateMatch = getStateBySlugOrCode(firstSegment);
      if (stateMatch) {
        return NextResponse.redirect(new URL(`/state/${stateMatch.slug}`, req.url), 301);
      }
    }
  }

  return NextResponse.next();
}
