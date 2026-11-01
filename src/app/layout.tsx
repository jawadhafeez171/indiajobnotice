import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.indiajobnotice.com"),
  alternates: {
    canonical: "https://www.indiajobnotice.com",
  },
  title: {
    template: "%s | IndiaJobNotice.com",
    default: "IndiaJobNotice.com - Government Job Notifications from All States",
  },
  description:
    "India's dedicated multi-state government job notification network. Official circulars, admit cards, answer keys, results, and eligibility calculator across all 28 states & UTs.",
  keywords: [
    "Sarkari Result",
    "Govt Job Notification",
    "UPPSC",
    "BPSC",
    "SSC CGL",
    "Railway RRB",
    "State Govt Jobs",
    "Admit Card 2026",
    "indiajobnotice.com",
    "www.indiajobnotice.com",
  ],
  openGraph: {
    title: "India Job Notice - Central & State Government Jobs",
    description: "Official repository of Central and State government recruitment notifications, exam schedules, admit cards, and results.",
    url: "https://www.indiajobnotice.com",
    siteName: "India Job Notice",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "India Job Notice - Government Job Notifications",
    description: "Verified Central & State Government job circulars, syllabus, admit cards, and results across all 36 states & UTs.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  verification: {
    google: "bhNS8zo6HRRVldr5jxE-UYvaWOCLUJ_uSYvithbIeM4",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "India Job Notice",
  alternateName: ["IndiaJobNotice", "IndiaJobNotice.com"],
  url: "https://www.indiajobnotice.com",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-canvas text-ink antialiased">
        {children}
        <ScrollToTop />
        <Analytics />
      </body>
    </html>
  );
}
