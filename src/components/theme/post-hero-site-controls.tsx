"use client";

import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import { ThemeSwitcher } from "./theme-switcher";
import styles from "./post-hero-site-controls.module.scss";

export function PostHeroSiteControls() {
  return (
    <div className={styles.host}>
      <LocaleSwitcher />
      <ThemeSwitcher />
    </div>
  );
}
