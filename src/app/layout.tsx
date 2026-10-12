import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
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
  ],
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
      </body>
    </html>
  );
}
