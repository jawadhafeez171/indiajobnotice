import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
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
    default: "IndiaJobNotice.com - Official Govt Job Notifications & State Subdomains",
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
    title: "India Job Notice - Central & State Government Employment Gazettes",
    description: "Official repository of Central and State government recruitment notifications, exam schedules, admit cards, and results.",
    url: "https://www.indiajobnotice.com",
    siteName: "India Job Notice",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "India Job Notice - Official Govt Employment Gazettes",
    description: "Verified Central & State Government job circulars, syllabus, admit cards, and results across all 36 states & UTs.",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full scroll-smooth`}>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
