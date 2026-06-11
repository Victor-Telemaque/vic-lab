"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { IntlProvider } from "react-intl";
import { defaultSiteLocale, type SiteLocale } from "@/lib/site-config";
import { Locale, messages } from "@/i18n/messages";

type IntlContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const IntlContext = createContext<IntlContextValue | null>(null);

type Props = {
  children: React.ReactNode;
  initialLocale?: SiteLocale;
};

export function AppIntlProvider({ children, initialLocale = defaultSiteLocale }: Props) {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  useEffect(() => {
    setLocale(initialLocale);
  }, [initialLocale]);

  useLayoutEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    window.localStorage.setItem("portfolio-locale", locale);
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale }), [locale]);

  return (
    <IntlContext.Provider value={value}>
      <IntlProvider locale={locale} messages={messages[locale]}>
        {children}
      </IntlProvider>
    </IntlContext.Provider>
  );
}

export function useAppLocale() {
  const context = useContext(IntlContext);
  if (!context) {
    throw new Error("useAppLocale must be used within AppIntlProvider");
  }
  return context;
}
