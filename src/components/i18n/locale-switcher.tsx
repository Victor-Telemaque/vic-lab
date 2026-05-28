"use client";

import { useIntl } from "react-intl";
import { Locale } from "@/i18n/messages";
import { useAppLocale } from "./intl-provider";
import styles from "./locale-switcher.module.scss";

const supportedLocales: Locale[] = ["fr", "en"];

export function LocaleSwitcher() {
  const intl = useIntl();
  const { locale, setLocale } = useAppLocale();

  return (
    <div className={styles.switcher} aria-label={intl.formatMessage({ id: "language.label" })}>
      {supportedLocales.map((value) => (
        <button
          key={value}
          type="button"
          className={value === locale ? styles.active : styles.button}
          onClick={() => setLocale(value)}
        >
          {intl.formatMessage({ id: `language.${value}` })}
        </button>
      ))}
    </div>
  );
}
