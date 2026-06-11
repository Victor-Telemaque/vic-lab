import { notFound } from "next/navigation";
import { AppIntlProvider } from "@/components/i18n/intl-provider";
import { PortfolioHome } from "@/components/sections/portfolio-home";
import { ProjectsIndex } from "@/components/sections/projects-index";
import { isSiteLocale, type SiteLocale } from "@/lib/site-config";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LocaleHomePage({ params }: Props) {
  const { locale } = await params;

  if (!isSiteLocale(locale)) {
    notFound();
  }

  return (
    <AppIntlProvider initialLocale={locale as SiteLocale}>
      <PortfolioHome projectsIndex={<ProjectsIndex locale={locale as SiteLocale} />} />
    </AppIntlProvider>
  );
}
