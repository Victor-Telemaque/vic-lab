import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { isSiteLocale, siteConfig, siteLocales, type SiteLocale } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return siteLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  if (!isSiteLocale(locale)) {
    return {};
  }

  return buildPageMetadata(locale);
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!isSiteLocale(locale)) {
    notFound();
  }

  return (
    <>
      <link
        rel="preload"
        as="image"
        href={siteConfig.heroPoster}
        fetchPriority="high"
      />
      <JsonLd locale={locale as SiteLocale} />
      {children}
    </>
  );
}
