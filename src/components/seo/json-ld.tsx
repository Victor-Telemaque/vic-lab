import { seoContent, siteConfig, type SiteLocale } from "@/lib/site-config";

type Props = {
  locale: SiteLocale;
};

function escapeJsonLd(value: string) {
  return value.replace(/</g, "\\u003c");
}

export function JsonLd({ locale }: Props) {
  const content = seoContent[locale];
  const pageUrl = `${siteConfig.url}/${locale}`;
  const isFrench = locale === "fr";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: content.description,
        inLanguage: ["fr-FR", "en-US"],
        publisher: { "@id": `${siteConfig.url}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        url: siteConfig.url,
        email: siteConfig.email,
        logo: `${siteConfig.url}${siteConfig.favicon}`,
        areaServed: [
          { "@type": "Country", name: siteConfig.location.country },
          {
            "@type": "AdministrativeArea",
            name: siteConfig.location.region,
          },
          { "@type": "Place", name: "Europe" },
          { "@type": "Place", name: "Worldwide" },
        ],
        ...(siteConfig.socialProfiles.length > 0
          ? { sameAs: siteConfig.socialProfiles }
          : {}),
      },
      {
        "@type": "Person",
        "@id": `${siteConfig.url}/#person`,
        name: siteConfig.ownerName,
        jobTitle: isFrench
          ? "Développeur Front-End Senior"
          : "Senior Front-End Developer",
        worksFor: { "@id": `${siteConfig.url}/#organization` },
        email: siteConfig.email,
        url: pageUrl,
        knowsAbout: [
          "React",
          "Vue.js",
          "TypeScript",
          "Next.js",
          "Front-end architecture",
          "Web performance",
          "Design systems",
        ],
        workLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressRegion: siteConfig.location.region,
            addressCountry: siteConfig.location.countryCode,
          },
        },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteConfig.url}/#service`,
        name: siteConfig.name,
        url: pageUrl,
        email: siteConfig.email,
        description: content.description,
        provider: { "@id": `${siteConfig.url}/#person` },
        areaServed: [
          { "@type": "Country", name: siteConfig.location.country },
          {
            "@type": "AdministrativeArea",
            name: siteConfig.location.region,
          },
          { "@type": "Place", name: "Europe" },
        ],
        serviceType: isFrench
          ? [
              "Développement front-end",
              "Développement React",
              "Développement Vue.js",
              "Audit performance web",
              "Renfort senior front-end",
            ]
          : [
              "Front-end development",
              "React development",
              "Vue.js development",
              "Web performance",
              "Senior front-end consulting",
            ],
        availableLanguage: ["French", "English"],
      },
    ],
  };

  const jsonLd = escapeJsonLd(JSON.stringify(schema));

  return (
    <template
      dangerouslySetInnerHTML={{
        __html: `<script type="application/ld+json">${jsonLd}</script>`,
      }}
    />
  );
}
