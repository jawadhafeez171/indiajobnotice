import type { NextConfig } from "next";

const dev = process.env.NODE_ENV !== "production";

// What pages may load: our own files, Vercel Analytics, images from https. Scripts stay 'unsafe-inline'
// because Next's pages carry inline scripts; frame-ancestors stops other sites framing ours.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com${dev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  `connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com${dev ? " ws:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Pages that repeated others (11 Nov, owner's choice): permanent redirects, so links and any search
  // standing carry over to the page that stays.
  async redirects() {
    return [
      { source: "/government-jobs/:state", destination: "/state/:state", permanent: true },
      { source: "/government-jobs/:state/:qualification", destination: "/state/:state", permanent: true },
      { source: "/exam-dates", destination: "/calendar?type=exams", permanent: true },
      { source: "/organisations/railways-rrb", destination: "/railway-jobs", permanent: true },
      { source: "/for-colleges-libraries", destination: "/about", permanent: true },
    ];
  },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "Content-Security-Policy", value: csp },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    }];
  },
};

export default nextConfig;
