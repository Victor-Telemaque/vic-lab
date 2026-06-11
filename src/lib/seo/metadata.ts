import type { Metadata } from "next";
import {
  defaultSiteLocale,
  getGoogleSiteVerification,
  seoContent,
  siteConfig,
  type SiteLocale,
} from "@/lib/site-config";

export function buildPageMetadata(locale: SiteLocale): Metadata {
  const content = seoContent[locale];
  const alternateLocale: SiteLocale = locale === "fr" ? "en" : "fr";
  const canonical = `/${locale}`;
  const googleVerification = getGoogleSiteVerification();

  return {
    metadataBase: new URL(siteConfig.url),
    title: content.title,
    description: content.description,
    keywords: [...content.keywords],
    authors: [{ name: siteConfig.ownerName, url: siteConfig.url }],
    creator: siteConfig.ownerName,
    publisher: siteConfig.name,
    alternates: {
      canonical,
      languages: {
        fr: "/fr",
        en: "/en",
        "x-default": `/${defaultSiteLocale}`,
      },
    },
    openGraph: {
      type: "website",
      locale: content.ogLocale,
      alternateLocale: [seoContent[alternateLocale].ogLocale],
      url: canonical,
      siteName: siteConfig.name,
      title: content.title,
      description: content.description,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: content.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
      images: [siteConfig.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: siteConfig.favicon,
      apple: siteConfig.appleIcon,
    },
    category: "technology",
    ...(googleVerification
      ? {
          verification: {
            google: googleVerification,
          },
        }
      : {}),
    other: {
      "geo.region": siteConfig.location.geoRegion,
      "geo.placename": siteConfig.location.region,
      "geo.country": siteConfig.location.countryCode,
    },
  };
}
