import type { MetadataRoute } from "next";
import { siteConfig, siteLocales } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return siteLocales.map((locale) => ({
    url: `${siteConfig.url}/${locale}`,
    lastModified,
    changeFrequency: "monthly",
    priority: locale === "fr" ? 1 : 0.9,
    alternates: {
      languages: Object.fromEntries(
        siteLocales.map((entry) => [entry, `${siteConfig.url}/${entry}`]),
      ),
    },
  }));
}
