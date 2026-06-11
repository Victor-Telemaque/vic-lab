import type { Locale } from "@/i18n/messages";

export const siteLocales = ["fr", "en"] as const satisfies readonly Locale[];

export type SiteLocale = (typeof siteLocales)[number];

export const defaultSiteLocale: SiteLocale = "fr";

export const socialLinks = {
  github: "https://github.com/Victor-Telemaque",
  linkedin: "https://www.linkedin.com/in/victor-four%C3%A9-dev",
  email: "mailto:foure.v@live.fr",
} as const;

export const siteConfig = {
  name: "Vic Lab",
  ownerName: "Victor Fouré",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vic-lab.dev",
  email: "foure.v@live.fr",
  favicon: "/assets/story/vic-labs-logo.png",
  appleIcon: "/assets/story/vic-labs-logo.png",
  ogImage: "/assets/story/peaceful-train.jpg",
  heroPoster: "/assets/story/peaceful-train.jpg",
  location: {
    region: "Provence-Alpes-Côte d'Azur",
    regionShort: "PACA",
    country: "France",
    countryCode: "FR",
    geoRegion: "FR-PAC",
  },
  socialProfiles: [
    socialLinks.github,
    socialLinks.linkedin,
  ],
} as const;

export const seoContent = {
  fr: {
    title: "Vic Lab | Développeur Front-End Senior — Freelance PACA & France",
    description:
      "Développeur front-end senior freelance en PACA et partout en France. Interfaces web performantes en React, Vue et TypeScript pour produits ambitieux. Missions remote et sur site.",
    keywords: [
      "développeur front-end freelance",
      "développeur React freelance France",
      "développeur Vue.js freelance",
      "développeur TypeScript",
      "freelance front-end PACA",
      "développeur web Provence",
      "mission front-end senior",
      "développement interface web",
      "consultant front-end France",
    ],
    ogLocale: "fr_FR",
    ogImageAlt: "Vic Lab — développement front-end senior en PACA et France",
  },
  en: {
    title: "Vic Lab | Senior Front-End Developer — France, EU & Remote",
    description:
      "Senior freelance front-end developer based in Provence-Alpes-Côte d'Azur, France. Product-minded React, Vue, and TypeScript interfaces for teams in France, Europe, and worldwide.",
    keywords: [
      "senior front-end developer France",
      "freelance React developer Europe",
      "Vue.js developer remote",
      "TypeScript front-end consultant",
      "front-end developer Provence",
      "France remote developer",
      "product front-end engineer",
      "web interface development",
    ],
    ogLocale: "en_US",
    ogImageAlt: "Vic Lab — senior front-end development from Provence, France",
  },
} as const satisfies Record<
  SiteLocale,
  {
    title: string;
    description: string;
    keywords: string[];
    ogLocale: string;
    ogImageAlt: string;
  }
>;

export function isSiteLocale(value: string): value is SiteLocale {
  return siteLocales.includes(value as SiteLocale);
}

export function getGoogleSiteVerification(): string | undefined {
  const value = process.env.GOOGLE_SITE_VERIFICATION?.trim();
  return value || undefined;
}
