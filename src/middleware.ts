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

  // 1. Check for localhost subdomains (e.g., karnataka.localhost, up.localhost, bihar.localhost)
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

  // If a valid state slug or code is matched (e.g. 'karnataka', 'ka', 'bihar', 'up')
  if (subdomain) {
    const state = getStateBySlugOrCode(subdomain);
    if (state) {
      // Avoid infinite loop if already on /state/...
      if (!url.pathname.startsWith("/state/")) {
        if (url.pathname === "/calculator") {
          return NextResponse.next();
        }

        // Rewrite internally to the state route handler while preserving the clean subdomain URL
        // e.g. karnataka.indiajobnotice.com/ -> /state/karnataka
        // e.g. karnataka.localhost:3001/ -> /state/karnataka
        const targetPath = `/state/${state.slug}${url.pathname === "/" ? "" : url.pathname}`;
        return NextResponse.rewrite(new URL(targetPath, req.url));
      }
    }
  }

  return NextResponse.next();
}
