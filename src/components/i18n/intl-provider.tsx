"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { IntlProvider } from "react-intl";
import { Locale, messages } from "@/i18n/messages";

type IntlContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const IntlContext = createContext<IntlContextValue | null>(null);

type Props = {
  children: React.ReactNode;
};

function readStoredLocale(): Locale {
  const savedLocale = window.localStorage.getItem("portfolio-locale");
  if (savedLocale === "fr" || savedLocale === "en") {
    return savedLocale;
  }

  const browserLanguage = window.navigator.language.toLowerCase();
  return browserLanguage.startsWith("en") ? "en" : "fr";
}

export function AppIntlProvider({ children }: Props) {
  const [locale, setLocale] = useState<Locale>("fr");

  useEffect(() => {
    setLocale(readStoredLocale());
  }, []);

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
