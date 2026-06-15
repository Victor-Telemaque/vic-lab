'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { CloudCurtainSection } from '@/components/effects/cloud-curtain';
import { DeliveryGrowthChart } from '@/components/effects/delivery-growth-chart';
import { PastelRainbowArc } from '@/components/effects/pastel-rainbow-arc';
import { SitePastelBackground } from '@/components/effects/site-pastel-background';
import {
  VicLegoFooterPeek,
} from '@/components/effects/vic-lego-cameos';
import {
  sectionRevealItem,
  storyStripItemReveal,
  storyStripReveal,
  storyStripSkillItemReveal,
  storyStripSkillsStagger,
} from '@/components/motion/section-variants';
import { SectionReveal } from '@/components/motion/section-reveal';
import { PostHeroQuickNav } from '@/components/navigation/post-hero-quick-nav';
import { SectionNavLink } from '@/components/navigation/section-nav-link';
import { SiteNavigationProvider } from '@/components/navigation/site-navigation-context';
import { ContentSection } from '@/components/sections/content-section';
import { HeroScrollSequence } from '@/components/sections/hero-scroll-sequence';
import { InspirationalStampLayer } from '@/components/sections/inspirational-stamp-layer';
import { ProjectsCarousel } from '@/components/sections/projects-carousel';
import { SectionMediaBackdrop } from '@/components/sections/section-media-backdrop';
import { SiteFooter } from '@/components/sections/site-footer';
import { StackCarousel } from '@/components/sections/stack-carousel';
import { useIntl } from 'react-intl';
import { useAppLocale } from '@/components/i18n/intl-provider';
import { PostHeroSiteControls } from '@/components/theme/post-hero-site-controls';
import { NarrativeMedia } from '@/components/media/narrative-media';
import {
  aboutBackground,
  narrativeMedia,
  partnerProjects,
  skillHighlights,
  stackBackground,
  stackLogos,
  storyBackground,
} from '@/data/portfolio-content';
import styles from './portfolio-home.module.scss';

type Props = {
  projectsIndex?: React.ReactNode;
};

export function PortfolioHome({ projectsIndex }: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <SiteNavigationProvider initialPostHero={Boolean(shouldReduceMotion)}>
      <PortfolioHomeContent
        projectsIndex={projectsIndex}
        shouldReduceMotion={Boolean(shouldReduceMotion)}
      />
    </SiteNavigationProvider>
  );
}

type ContentProps = {
  projectsIndex?: React.ReactNode;
  shouldReduceMotion: boolean;
};

function PortfolioHomeContent({
  projectsIndex,
  shouldReduceMotion,
}: ContentProps) {
  const intl = useIntl();
  const { locale } = useAppLocale();
  const heroTrackRef = useRef<HTMLElement>(null);
  const storyAnchorRef = useRef<HTMLDivElement>(null);
  const footerAnchorRef = useRef<HTMLDivElement>(null);
  const [isPostHeroRevealed, setIsPostHeroRevealed] = useState(
    shouldReduceMotion,
  );

  useEffect(() => {
    if (shouldReduceMotion || isPostHeroRevealed) {
      return;
    }

    const revealIfScrolled = () => {
      if (window.scrollY > window.innerHeight * 0.45) {
        setIsPostHeroRevealed(true);
      }
    };

    revealIfScrolled();
    window.addEventListener('scroll', revealIfScrolled, { passive: true });
    return () => window.removeEventListener('scroll', revealIfScrolled);
  }, [isPostHeroRevealed, shouldReduceMotion]);

  return (
    <main className={styles.site}>
      <SitePastelBackground cloudPeekAnchorRef={storyAnchorRef} />
      <InspirationalStampLayer isRevealed={isPostHeroRevealed} />
      {!shouldReduceMotion ? (
        <HeroScrollSequence
          trackRef={heroTrackRef}
          onExited={() => setIsPostHeroRevealed(true)}
        />
      ) : null}
      <PostHeroSiteControls />
      <PostHeroQuickNav />

      <div className={styles.page}>
        {shouldReduceMotion ? (
          <div className={styles.sectionShell}>
            <section className={styles.hero}>
              <p className={styles.heroName}>
                {intl.formatMessage({ id: 'hero.name' })}
              </p>
              <p className={styles.kicker}>
                {intl.formatMessage({ id: 'hero.kicker' })}
              </p>
              <h1 className={styles.title}>
                {intl.formatMessage({ id: 'hero.title' })}
              </h1>
              <p className={styles.lead}>
                {intl.formatMessage({ id: 'hero.lead' })}
              </p>
              <div className={styles.heroActions}>
                <SectionNavLink
                  sectionId="projects"
                  labelKey="hero.projectsCta"
                  className={`${styles.primaryAction} ${styles.rippleTarget}`}
                />
                <SectionNavLink
                  sectionId="contact"
                  labelKey="hero.contactCta"
                  className={`${styles.secondaryAction} ${styles.rippleTarget}`}
                />
              </div>
              <aside className={styles.narrativePanel}>
                <p className={styles.narrativeLabel}>
                  {intl.formatMessage({ id: 'hero.narrativeLabel' })}
                </p>
                <p className={styles.narrativeDescription}>
                  {intl.formatMessage({ id: 'hero.narrativeDescription' })}
                </p>
                <NarrativeMedia
                  posterSrc={narrativeMedia.posterSrc}
                  videoSrc={narrativeMedia.videoSrc}
                  alt={narrativeMedia.alt}
                />
              </aside>
            </section>
          </div>
        ) : null}

        <div ref={storyAnchorRef} className={styles.storyRainbowGroup}>
          <SectionReveal
            as="section"
            className={styles.storyStrip}
            ariaLabel="Storytelling scroll"
            variants={storyStripReveal}
            trigger={isPostHeroRevealed}
          >
            <SectionMediaBackdrop
              mode="image"
              overlayVariant="story"
              imageSrc={storyBackground.imageSrc}
            />
            <div className={styles.storyDecor} aria-hidden>
              <span className={styles.storyDecorOrb} />
              <span className={styles.storyDecorRing} />
              <span className={styles.storyDecorArc} />
            </div>
            <div className={styles.storyCopy}>
              <motion.p
                className={styles.storyLabel}
                variants={storyStripItemReveal}
              >
                {intl.formatMessage({ id: 'story.label' })}
              </motion.p>
              <motion.p
                className={styles.storyText}
                variants={storyStripItemReveal}
              >
                {intl.formatMessage({ id: 'story.text' })}
              </motion.p>
              <motion.p
                className={styles.storyTextSecondary}
                variants={storyStripItemReveal}
              >
                {intl.formatMessage({ id: 'story.textSecondary' })}
              </motion.p>
              <motion.ul
                className={styles.skills}
                variants={storyStripSkillsStagger}
              >
                {skillHighlights[locale].map((skill) => (
                  <motion.li key={skill} variants={storyStripSkillItemReveal}>
                    {skill}
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </SectionReveal>

          <div className={styles.rainbowBand} aria-hidden>
            <PastelRainbowArc />
          </div>
        </div>

        <CloudCurtainSection
          id="projects"
          isRevealed={isPostHeroRevealed}
          revealDelay={0.4}
        >
          <SectionReveal
            as="div"
            className={`${styles.projects} ${styles.projectsPanel}`}
          >
            <motion.div
              className={styles.sectionHeading}
              variants={sectionRevealItem}
            >
              <span>{intl.formatMessage({ id: 'projects.label' })}</span>
              <h2>{intl.formatMessage({ id: 'projects.title' })}</h2>
            </motion.div>
            <motion.p
              className={styles.sectionHook}
              variants={sectionRevealItem}
            >
              {intl.formatMessage({ id: 'projects.hook' })}
            </motion.p>
            <motion.p className={styles.panelBody} variants={sectionRevealItem}>
              {intl.formatMessage({ id: 'projects.main' })}
            </motion.p>
            <motion.div
              className={styles.projectGrid}
              variants={sectionRevealItem}
            >
              <ProjectsCarousel projects={partnerProjects} locale={locale} />
              {projectsIndex}
            </motion.div>
          </SectionReveal>
        </CloudCurtainSection>

        <SectionReveal
          as="section"
          id="about"
          className={`${styles.about} ${styles.contentPanel} ${styles.mediaPanel}`}
        >
          <SectionMediaBackdrop
            mode="image"
            overlayVariant="about"
            imageSrc={aboutBackground.imageSrc}
            posterSrc={aboutBackground.imageSrc}
          />
          <motion.div
            className={styles.sectionHeading}
            variants={sectionRevealItem}
          >
            <span>{intl.formatMessage({ id: 'about.label' })}</span>
            <h2>{intl.formatMessage({ id: 'about.title' })}</h2>
          </motion.div>
          <motion.p className={styles.sectionHook} variants={sectionRevealItem}>
            {intl.formatMessage({ id: 'about.hook' })}
          </motion.p>
          <motion.p className={styles.panelBody} variants={sectionRevealItem}>
            {intl.formatMessage({ id: 'about.description' })}
          </motion.p>
        </SectionReveal>

        <ContentSection
          id="stack"
          className={`${styles.stackPanel} ${styles.contentPanel}`}
          labelKey="stack.label"
          titleKey="stack.title"
          hookKey="stack.hook"
          backdrop={
            <SectionMediaBackdrop
              mode="video"
              overlayVariant="stack"
              videoSrc={stackBackground.videoSrc}
              posterSrc={stackBackground.posterSrc}
            />
          }
        >
          <StackCarousel logos={stackLogos} />
        </ContentSection>

        <ContentSection
          id="impact"
          layout="split"
          className={`${styles.impactPanel} ${styles.contentPanel}`}
          labelKey="why.label"
          titleKey="why.title"
          hookKey="why.hook"
          bodyKey="why.main"
          bodySecondaryKey="why.mainSecondary"
          pillsKey="why.short"
          visualSlotClassName={styles.impactChartSlot}
        >
          <DeliveryGrowthChart />
        </ContentSection>

        <div className={styles.contactAnchor}>
          <SectionReveal
            as="section"
            className={`${styles.contact} ${styles.contentPanel}`}
            id="contact"
          >
            <motion.div
              className={styles.contactIntro}
              variants={sectionRevealItem}
            >
              <div className={styles.sectionHeading}>
                <span>{intl.formatMessage({ id: 'contact.label' })}</span>
                <h2>{intl.formatMessage({ id: 'contact.title' })}</h2>
              </div>
              <p className={styles.sectionHook}>
                {intl.formatMessage({ id: 'contact.hook' })}
              </p>
              <p className={styles.panelBody}>
                {intl.formatMessage({ id: 'contact.description' })}
              </p>
            </motion.div>
            <motion.div
              className={styles.contactActions}
              variants={sectionRevealItem}
            >
              <a className={styles.contactCta} href="mailto:foure.v@live.fr">
                foure.v@live.fr
              </a>
            </motion.div>
          </SectionReveal>
        </div>
      </div>

      <div ref={footerAnchorRef} className={styles.footerAnchor}>
        <VicLegoFooterPeek
          anchorRef={footerAnchorRef}
          isEnabled={isPostHeroRevealed}
        />
        <SiteFooter partners={partnerProjects} />
      </div>
    </main>
  );
}
