import type { MetadataRoute } from "next";
import { siteConfig, siteLocales } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = `${siteConfig.url}/sitemap.xml`;

  return {
    rules: {
      userAgent: "*",
      allow: siteLocales.map((locale) => `/${locale}`),
      disallow: ["/api/"],
    },
    sitemap: sitemapUrl,
    host: siteConfig.url,
  };
}
