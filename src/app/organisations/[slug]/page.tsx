import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { CategoryHubView } from "@/components/category/CategoryHubView";
import { 
  ORGANISATION_HUBS, 
  getOrganisationHubBySlug 
} from "@/data/permanent-categories";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ORGANISATION_HUBS.map((hub) => ({
    slug: hub.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const hub = getOrganisationHubBySlug(slug);
  if (!hub) return { title: "Organisation Not Found" };

  const canonicalUrl = `https://www.indiajobnotice.com${hub.canonicalPath}`;

  return {
    title: `${hub.title}`,
    description: hub.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: hub.title,
      description: hub.metaDescription,
      url: canonicalUrl,
      siteName: "India Job Notice",
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: hub.title,
      description: hub.metaDescription,
    },
  };
}

export default async function OrganisationPage({ params }: Props) {
  const { slug } = await params;
  const hub = getOrganisationHubBySlug(slug);

  if (!hub) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF4]">
      <Navbar currentStateSlug="central" />
      <main className="flex-1">
        <CategoryHubView 
          hub={hub} 
          parentCrumb={{ label: "Recruiting Bodies", href: "/" }} 
        />
      </main>
      <Footer />
    </div>
  );
}
