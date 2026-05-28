"use client";

import { motion } from "framer-motion";
import { useIntl } from "react-intl";
import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import { useAppLocale } from "@/components/i18n/intl-provider";
import { NarrativeMedia } from "@/components/media/narrative-media";
import {
  caseStudies,
  narrativeMedia,
  skillHighlights,
} from "@/data/portfolio-content";
import styles from "./portfolio-home.module.scss";

const sectionReveal = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export function PortfolioHome() {
  const intl = useIntl();
  const { locale } = useAppLocale();

  return (
    <main className={styles.page}>
      <div className={styles.atmosphere} aria-hidden>
        <span className={styles.glowOrb} />
        <span className={styles.glowOrb} />
        <span className={styles.noiseMask} />
      </div>

      <section className={styles.hero}>
        <div className={styles.topBar}>
          <LocaleSwitcher />
        </div>
        <motion.p
          className={styles.kicker}
          initial="hidden"
          animate="show"
          variants={sectionReveal}
          transition={{ duration: 0.6 }}
        >
          {intl.formatMessage({ id: "hero.kicker" })}
        </motion.p>
        <motion.h1
          className={styles.title}
          initial="hidden"
          animate="show"
          variants={sectionReveal}
          transition={{ delay: 0.1, duration: 0.7 }}
        >
          {intl.formatMessage({ id: "hero.title" })}
        </motion.h1>
        <motion.p
          className={styles.lead}
          initial="hidden"
          animate="show"
          variants={sectionReveal}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          {intl.formatMessage({ id: "hero.lead" })}
        </motion.p>
        <motion.div
          className={styles.heroActions}
          initial="hidden"
          animate="show"
          variants={sectionReveal}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <a href="#projects" className={`${styles.primaryAction} ${styles.rippleTarget}`}>
            {intl.formatMessage({ id: "hero.projectsCta" })}
          </a>
          <a href="#contact" className={`${styles.secondaryAction} ${styles.rippleTarget}`}>
            {intl.formatMessage({ id: "hero.contactCta" })}
          </a>
        </motion.div>

        <motion.aside
          className={styles.narrativePanel}
          initial="hidden"
          animate="show"
          variants={sectionReveal}
          transition={{ delay: 0.35, duration: 0.7 }}
        >
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

      <section className={styles.storyStrip} aria-label="Storytelling scroll">
        <p className={styles.storyText}>
          {intl.formatMessage({ id: "story.text" })}
        </p>
        <ul className={styles.skills}>
          {skillHighlights[locale].map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </section>

      <section id="projects" className={styles.projects}>
        <div className={styles.sectionHeading}>
          <span>{intl.formatMessage({ id: "projects.label" })}</span>
          <h2>{intl.formatMessage({ id: "projects.title" })}</h2>
        </div>
        <div className={styles.projectGrid}>
          {caseStudies.map((study, index) => (
            <motion.article
              key={study.title.en}
              className={`${styles.caseCard} ${styles.rippleTarget}`}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
              variants={sectionReveal}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              <p className={styles.caseRole}>{study.role[locale]}</p>
              <h3>{study.title[locale]}</h3>
              <p>{study.summary[locale]}</p>
              <p className={styles.caseImpact}>{study.impact[locale]}</p>
              <ul className={styles.tagList}>
                {study.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </section>

      <section className={styles.about}>
        <div className={styles.sectionHeading}>
          <span>{intl.formatMessage({ id: "about.label" })}</span>
          <h2>{intl.formatMessage({ id: "about.title" })}</h2>
        </div>
        <p>{intl.formatMessage({ id: "about.description" })}</p>
      </section>

      <section id="contact" className={styles.contact}>
        <div>
          <p className={styles.kicker}>{intl.formatMessage({ id: "contact.label" })}</p>
          <h2>{intl.formatMessage({ id: "contact.title" })}</h2>
          <p>{intl.formatMessage({ id: "contact.description" })}</p>
        </div>
        <a className={styles.primaryAction} href="mailto:hello@vic-lab.dev">
          hello@vic-lab.dev
        </a>
      </section>
    </main>
  );
}
