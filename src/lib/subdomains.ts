/**
 * Helper to construct direct subdirectory URLs for state portals.
 * Subdirectory convention: /state/[state]/[path]
 * (e.g. /state/up, /state/bihar, /state/rajasthan)
 */
export function getStateDirectoryUrl(stateSlug: string, path: string = ""): string {
  const normalizedPath = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `/state/${stateSlug}${normalizedPath}`;
}

// Backwards-compatible alias for existing imports
export const getStateSubdomainUrl = getStateDirectoryUrl;

export function getCentralPortalUrl(path: string = ""): string {
  const normalizedPath = path.startsWith("/") ? path : path ? `/${path}` : "";
  return normalizedPath || "/";
}
