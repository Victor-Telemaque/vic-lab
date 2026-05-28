"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { CloudCurtainSection } from "@/components/effects/cloud-curtain";
import {
  fadeUp,
  flipUp,
  scrollViewport,
  slideUp,
  staggerContainer,
  staggerItem,
  zoomIn,
} from "@/components/motion/section-variants";
import { ProjectsCarousel3D } from "@/components/sections/projects-carousel-3d";
import { useIntl } from "react-intl";
import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import { useAppLocale } from "@/components/i18n/intl-provider";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { NarrativeMedia } from "@/components/media/narrative-media";
import {
  caseStudies,
  narrativeMedia,
  skillHighlights,
} from "@/data/portfolio-content";
import styles from "./portfolio-home.module.scss";

const easeOut = [0.22, 1, 0.36, 1] as const;

const heroStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: easeOut },
  },
};

const heroTitleItem = {
  hidden: { opacity: 0, y: 34, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.72, ease: easeOut },
  },
};

type ScrollRevealProps = {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "section";
  id?: string;
  variants?: Variants;
  usePerspective?: boolean;
};

function ScrollReveal({
  className,
  children,
  as = "div",
  id,
  variants = fadeUp,
  usePerspective = false,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as];

  if (shouldReduceMotion) {
    const Tag = as;
    return (
      <Tag className={className} id={id}>
        {children}
      </Tag>
    );
  }

  return (
    <Component
      id={id}
      className={`${className ?? ""} ${usePerspective ? styles.scrollPerspective : ""}`.trim()}
      initial="hidden"
      whileInView="show"
      viewport={scrollViewport}
      variants={variants}
    >
      {children}
    </Component>
  );
}

export function PortfolioHome() {
  const intl = useIntl();
  const { locale } = useAppLocale();
  const shouldReduceMotion = useReducedMotion();

  return (
    <main className={styles.page}>
      <div className={styles.atmosphere} aria-hidden>
        <span className={styles.glowOrb} />
        <span className={styles.glowOrb} />
        <span className={styles.noiseMask} />
      </div>

      {shouldReduceMotion ? (
        <div className={styles.sectionShell}>
          <section className={styles.hero}>
            <div className={styles.topBar}>
              <ThemeSwitcher />
              <LocaleSwitcher />
            </div>
            <p className={styles.kicker}>{intl.formatMessage({ id: "hero.kicker" })}</p>
            <h1 className={styles.title}>{intl.formatMessage({ id: "hero.title" })}</h1>
            <p className={styles.lead}>{intl.formatMessage({ id: "hero.lead" })}</p>
            <div className={styles.heroActions}>
              <a href="#projects" className={`${styles.primaryAction} ${styles.rippleTarget}`}>
                {intl.formatMessage({ id: "hero.projectsCta" })}
              </a>
              <a href="#contact" className={`${styles.secondaryAction} ${styles.rippleTarget}`}>
                {intl.formatMessage({ id: "hero.contactCta" })}
              </a>
            </div>
            <aside className={styles.narrativePanel}>
              <p className={styles.narrativeLabel}>
                {intl.formatMessage({ id: "hero.narrativeLabel" })}
              </p>
              <p className={styles.narrativeDescription}>
                {intl.formatMessage({ id: "hero.narrativeDescription" })}
              </p>
              <NarrativeMedia
                posterSrc={narrativeMedia.posterSrc}
                videoSrc={narrativeMedia.videoSrc}
                alt={narrativeMedia.alt}
              />
            </aside>
          </section>
        </div>
      ) : (
        <motion.div
          className={styles.sectionShell}
          initial="hidden"
          animate="show"
          variants={heroStagger}
        >
          <section className={styles.hero}>
            <motion.div className={styles.topBar} variants={heroItem}>
              <ThemeSwitcher />
              <LocaleSwitcher />
            </motion.div>
            <motion.p className={styles.kicker} variants={heroItem}>
              {intl.formatMessage({ id: "hero.kicker" })}
            </motion.p>
            <motion.h1 className={styles.title} variants={heroTitleItem}>
              {intl.formatMessage({ id: "hero.title" })}
            </motion.h1>
            <motion.p className={styles.lead} variants={heroItem}>
              {intl.formatMessage({ id: "hero.lead" })}
            </motion.p>
            <motion.div className={styles.heroActions} variants={heroItem}>
              <a href="#projects" className={`${styles.primaryAction} ${styles.rippleTarget}`}>
                {intl.formatMessage({ id: "hero.projectsCta" })}
              </a>
              <a href="#contact" className={`${styles.secondaryAction} ${styles.rippleTarget}`}>
                {intl.formatMessage({ id: "hero.contactCta" })}
              </a>
            </motion.div>
            <motion.aside className={styles.narrativePanel} variants={heroItem}>
              <p className={styles.narrativeLabel}>
                {intl.formatMessage({ id: "hero.narrativeLabel" })}
              </p>
              <p className={styles.narrativeDescription}>
                {intl.formatMessage({ id: "hero.narrativeDescription" })}
              </p>
              <NarrativeMedia
                posterSrc={narrativeMedia.posterSrc}
                videoSrc={narrativeMedia.videoSrc}
                alt={narrativeMedia.alt}
              />
            </motion.aside>
          </section>
        </motion.div>
      )}

      {shouldReduceMotion ? (
        <div className={styles.sectionShell}>
          <section className={styles.storyStrip} aria-label="Storytelling scroll">
            <p className={styles.storyText}>{intl.formatMessage({ id: "story.text" })}</p>
            <ul className={styles.skills}>
              {skillHighlights[locale].map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </section>
        </div>
      ) : (
        <motion.div
          className={styles.sectionShell}
          initial="hidden"
          whileInView="show"
          viewport={scrollViewport}
          variants={staggerContainer}
        >
          <section className={styles.storyStrip} aria-label="Storytelling scroll">
            <motion.p className={styles.storyText} variants={staggerItem}>
              {intl.formatMessage({ id: "story.text" })}
            </motion.p>
            <motion.ul className={styles.skills} variants={staggerContainer}>
              {skillHighlights[locale].map((skill) => (
                <motion.li key={skill} variants={staggerItem}>
                  {skill}
                </motion.li>
              ))}
            </motion.ul>
          </section>
        </motion.div>
      )}

      <CloudCurtainSection id="projects">
        <div className={`${styles.projects} ${styles.projectsPanel}`}>
          <ScrollReveal className={styles.sectionHeading} variants={zoomIn}>
            <span>{intl.formatMessage({ id: "projects.label" })}</span>
            <h2>{intl.formatMessage({ id: "projects.title" })}</h2>
          </ScrollReveal>
          <ProjectsCarousel3D
            className={styles.projectGrid}
            studies={caseStudies}
            locale={locale}
          />
        </div>
      </CloudCurtainSection>

      <ScrollReveal as="section" className={styles.about} variants={flipUp} usePerspective>
        <div className={styles.sectionHeading}>
          <span>{intl.formatMessage({ id: "about.label" })}</span>
          <h2>{intl.formatMessage({ id: "about.title" })}</h2>
        </div>
        <p>{intl.formatMessage({ id: "about.description" })}</p>
      </ScrollReveal>

      <ScrollReveal as="section" className={styles.contact} id="contact" variants={slideUp}>
        <div>
          <p className={styles.kicker}>{intl.formatMessage({ id: "contact.label" })}</p>
          <h2>{intl.formatMessage({ id: "contact.title" })}</h2>
          <p>{intl.formatMessage({ id: "contact.description" })}</p>
        </div>
        <a className={styles.primaryAction} href="mailto:hello@vic-lab.dev">
          hello@vic-lab.dev
        </a>
      </ScrollReveal>
    </main>
  );
}
