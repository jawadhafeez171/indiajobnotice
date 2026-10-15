import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/*?search=*",
          "/*?q=*",
          "/*?filter=*",
          "/*?category=*",
          "/*?sort=*",
        ],
      },
    ],
    sitemap: "https://www.indiajobnotice.com/sitemap.xml",
    host: "https://www.indiajobnotice.com",
  };
}
