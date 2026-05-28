"use client";

import { useIntl } from "react-intl";
import { FiMoon, FiSun } from "react-icons/fi";
import { useAppTheme } from "./theme-provider";
import styles from "./theme-switcher.module.scss";

const themeOptions = [
  { value: "light" },
  { value: "dark" },
] as const;

export function ThemeSwitcher() {
  const intl = useIntl();
  const { theme, setTheme } = useAppTheme();

  return (
    <div
      className={styles.switcher}
      role="group"
      aria-label={intl.formatMessage({ id: "theme.toggleLabel" })}
    >
      {themeOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          className={theme === option.value ? styles.active : styles.button}
          onClick={() => setTheme(option.value)}
          aria-label={
            option.value === "light"
              ? intl.formatMessage({ id: "theme.light" })
              : intl.formatMessage({ id: "theme.dark" })
          }
        >
          <span className={styles.icon} aria-hidden>
            {option.value === "light" ? <FiSun /> : <FiMoon />}
          </span>
        </button>
      ))}
    </div>
  );
}
