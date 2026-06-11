"use client";

import { useIntl } from "react-intl";
import { Locale } from "@/i18n/messages";
import { siteLocales } from "@/lib/site-config";
import { useAppLocale } from "./intl-provider";
import styles from "./locale-switcher.module.scss";

const supportedLocales: Locale[] = [...siteLocales];

type Props = {
  onLocaleChange?: () => void;
};

export function LocaleSwitcher({ onLocaleChange }: Props) {
  const intl = useIntl();
  const { locale, setLocale } = useAppLocale();

  const switchLocale = (value: Locale) => {
    if (value === locale) {
      return;
    }

    setLocale(value);
    document.documentElement.lang = value;
    window.history.replaceState(window.history.state, "", `/${value}`);
    onLocaleChange?.();
  };

  return (
    <div className={styles.switcher} aria-label={intl.formatMessage({ id: "language.label" })}>
      {supportedLocales.map((value) => (
        <button
          key={value}
          type="button"
          className={value === locale ? styles.active : styles.button}
          onClick={() => switchLocale(value)}
        >
          {intl.formatMessage({ id: `language.${value}` })}
        </button>
      ))}
    </div>
  );
}
