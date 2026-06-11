"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { SectionNavLink } from "./section-nav-link";
import { useSiteNavigation } from "./site-navigation-context";
import styles from "./post-hero-quick-nav.module.scss";

export function PostHeroQuickNav() {
  const intl = useIntl();
  const shouldReduceMotion = useReducedMotion();
  const { isPostHero } = useSiteNavigation();
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: "0px 0px 0px 0px",
      },
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const isVisible = isPostHero && !isFooterVisible;

  return (
    <div className={styles.host} aria-hidden={!isVisible}>
      <AnimatePresence>
        {isVisible ? (
          <motion.div
            className={styles.bar}
            role="group"
            aria-label={intl.formatMessage({ id: "nav.postHero.ariaLabel" })}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionNavLink
              sectionId="projects"
              labelKey="hero.projectsCta"
              className={`${styles.action} ${styles.actionSecondary}`}
            />
            <SectionNavLink
              sectionId="contact"
              labelKey="hero.contactCta"
              className={`${styles.action} ${styles.actionPrimary}`}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
