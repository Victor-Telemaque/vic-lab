"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "framer-motion";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { useIntl } from "react-intl";
import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import { useAppLocale } from "@/components/i18n/intl-provider";
import { SectionNav } from "@/components/navigation/section-nav";
import { ThemeSwitcher } from "./theme-switcher";
import { useAppTheme } from "./theme-provider";
import styles from "./post-hero-site-controls.module.scss";

const MOBILE_QUERY = "(max-width: 768px)";

const openSpring: Transition = {
  type: "spring",
  stiffness: 460,
  damping: 36,
  mass: 0.8,
};

const closeTween: Transition = {
  duration: 0.44,
  ease: [0.33, 1, 0.68, 1] as const,
};

const rowCloseEase = [0.4, 0, 0.2, 1] as const;

const rowVariants = {
  hidden: { opacity: 0, y: 6, filter: "blur(3px)" },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      ...openSpring,
      delay: index * 0.06,
    },
  }),
  exit: (index: number) => ({
    opacity: 0,
    y: -4,
    filter: "blur(2px)",
    transition: {
      duration: 0.32,
      ease: rowCloseEase,
      delay: (1 - index) * 0.05,
    },
  }),
};

export function PostHeroSiteControls() {
  const intl = useIntl();
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useAppLocale();
  const { theme } = useAppTheme();
  const panelId = useId();
  const dockRef = useRef<HTMLDivElement>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isDockOpen, setIsDockOpen] = useState(false);
  const isPanelOpenRef = useRef(isPanelOpen);

  isPanelOpenRef.current = isPanelOpen;

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);

    const handleViewportChange = () => {
      if (!mediaQuery.matches) {
        setIsPanelOpen(false);
        setIsDockOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleViewportChange);

    return () => mediaQuery.removeEventListener("change", handleViewportChange);
  }, []);

  const open = useCallback(() => {
    setIsDockOpen(true);
    requestAnimationFrame(() => setIsPanelOpen(true));
  }, []);

  const close = useCallback(() => {
    setIsPanelOpen(false);
  }, []);

  const handlePanelExitComplete = useCallback(() => {
    requestAnimationFrame(() => {
      if (!isPanelOpenRef.current) {
        setIsDockOpen(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!isPanelOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!dockRef.current?.contains(event.target as Node)) {
        close();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, isPanelOpen]);

  const panelTransition = shouldReduceMotion ? { duration: 0.12 } : closeTween;
  const panelLabel = intl.formatMessage({ id: "siteControls.panelLabel" });
  const closeAfterNavigate = close;

  return (
    <>
      <SectionNav
        className={styles.desktopSectionNav}
        linkClassName={styles.sectionNavLink}
      />
      <div
        className={styles.desktopHost}
        role="group"
        aria-label={panelLabel}
      >
        <div className={styles.panel}>
          <LocaleSwitcher />
          <ThemeSwitcher />
        </div>
      </div>

      <div
        ref={dockRef}
        className={styles.dock}
        data-open={isDockOpen}
        data-panel-open={isPanelOpen}
      >
        <span className={styles.dockSheen} aria-hidden />
        <span className={styles.dockNoise} aria-hidden />

        <button
          type="button"
          className={styles.orb}
          aria-expanded={isPanelOpen}
          aria-controls={panelId}
          aria-label={intl.formatMessage({ id: "siteControls.toggleLabel" })}
          onClick={() => (isPanelOpen ? close() : open())}
        >
          <span className={styles.orbRing} aria-hidden />
          <span className={styles.orbCore}>
            <span className={styles.orbLocale}>
              {intl.formatMessage({ id: `language.${locale}` })}
            </span>
            <span className={styles.orbTheme} aria-hidden suppressHydrationWarning>
              {theme === "light" ? <FiSun /> : <FiMoon />}
            </span>
          </span>
        </button>

        <AnimatePresence initial={false} onExitComplete={handlePanelExitComplete}>
          {isPanelOpen ? (
            <motion.div
              id={panelId}
              key="dock-panel"
              className={styles.dockPanel}
              role="group"
              aria-label={panelLabel}
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 8, scale: 0.96, filter: "blur(4px)" }
              }
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
              }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      y: -6,
                      scale: 0.95,
                      filter: "blur(3px)",
                    }
              }
              transition={panelTransition}
            >
              <motion.div
                className={styles.dockSectionNav}
                custom={0}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <SectionNav
                  className={styles.dockSectionList}
                  linkClassName={styles.dockSectionLink}
                  onNavigate={closeAfterNavigate}
                />
              </motion.div>
              <motion.span
                className={styles.dockDivider}
                aria-hidden
                initial={{ opacity: 0, scaleX: 0.5 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0.2 }}
                transition={panelTransition}
              />
              <motion.div
                className={styles.dockRow}
                custom={1}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <LocaleSwitcher onLocaleChange={close} />
              </motion.div>
              <motion.span
                className={styles.dockDivider}
                aria-hidden
                initial={{ opacity: 0, scaleX: 0.5 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0.2 }}
                transition={panelTransition}
              />
              <motion.div
                className={styles.dockRow}
                custom={2}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <ThemeSwitcher onThemeChange={close} />
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  );
}
