/**
 * Helper to construct direct subdomain URLs for state portals.
 * - In production: https://[state].indiajobnotice.com/[path]
 * - In local development: http://[state].localhost:[port]/[path]
 * - Server-side / fallback: /state/[state]/[path]
 */
export function getStateSubdomainUrl(stateSlug: string, path: string = ""): string {
  const normalizedPath = path.startsWith("/") ? path : path ? `/${path}` : "";

  // Check if we are running in the browser
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname.toLowerCase();
    const port = window.location.port ? `:${window.location.port}` : "";
    const protocol = window.location.protocol;

    // Localhost development mode (e.g. up.localhost:3001)
    if (hostname === "localhost" || hostname.endsWith(".localhost") || hostname === "127.0.0.1") {
      return `${protocol}//${stateSlug}.localhost${port}${normalizedPath}`;
    }

    // Production mode (e.g. up.indiajobnotice.com)
    const baseDomain = (process.env.NEXT_PUBLIC_BASE_DOMAIN || "indiajobnotice.com").toLowerCase();
    if (hostname.includes(baseDomain)) {
      return `${protocol}//${stateSlug}.${baseDomain}${normalizedPath}`;
    }
  }

  // Fallback to internal path if SSR or raw IP
  return `/state/${stateSlug}${normalizedPath}`;
}

export function getCentralPortalUrl(path: string = ""): string {
  const normalizedPath = path.startsWith("/") ? path : path ? `/${path}` : "";

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname.toLowerCase();
    const port = window.location.port ? `:${window.location.port}` : "";
    const protocol = window.location.protocol;

    if (hostname.includes("localhost")) {
      return `${protocol}//localhost${port}${normalizedPath}`;
    }

    const baseDomain = (process.env.NEXT_PUBLIC_BASE_DOMAIN || "indiajobnotice.com").toLowerCase();
    if (hostname.includes(baseDomain)) {
      return `${protocol}//${baseDomain}${normalizedPath}`;
    }
  }

  return `/${normalizedPath}`;
}
