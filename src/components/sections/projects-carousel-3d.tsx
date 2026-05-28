"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useIntl } from "react-intl";
import type { CaseStudy } from "@/data/portfolio-content";
import type { Locale } from "@/i18n/messages";
import { useMediaQuery } from "@/hooks/use-media-query";
import cardStyles from "./portfolio-home.module.scss";
import styles from "./projects-carousel-3d.module.scss";

const SWIPE_THRESHOLD_PX = 72;

type Props = {
  studies: CaseStudy[];
  locale: Locale;
  className?: string;
};

function getCircularOffset(index: number, activeIndex: number, total: number) {
  let offset = index - activeIndex;
  if (offset > total / 2) {
    offset -= total;
  }
  if (offset < -total / 2) {
    offset += total;
  }
  return offset;
}

export function ProjectsCarousel3D({ studies, locale, className }: Props) {
  const intl = useIntl();
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isCompact = useMediaQuery("(max-width: 520px)");
  const [activeIndex, setActiveIndex] = useState(0);
  const slideSpread = isCompact ? 88 : isMobile ? 112 : 270;
  const slideRotate = isCompact ? -8 : isMobile ? -12 : -34;
  const slideDepth = isCompact ? 28 : isMobile ? 38 : 90;
  const [isDragging, setIsDragging] = useState(false);
  const swipeStartX = useRef(0);
  const didSwipe = useRef(false);
  const sceneRef = useRef<HTMLDivElement>(null);
  const total = studies.length;

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + total) % total);
    },
    [total],
  );

  const goNext = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  const endDrag = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const delta = event.clientX - swipeStartX.current;

    if (sceneRef.current?.hasPointerCapture(event.pointerId)) {
      sceneRef.current.releasePointerCapture(event.pointerId);
    }

    setIsDragging(false);

    if (delta <= -SWIPE_THRESHOLD_PX) {
      didSwipe.current = true;
      goNext();
    } else if (delta >= SWIPE_THRESHOLD_PX) {
      didSwipe.current = true;
      goPrev();
    }
  }, [goNext, goPrev]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    didSwipe.current = false;
    swipeStartX.current = event.clientX;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    endDrag(event);
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    if (sceneRef.current?.hasPointerCapture(event.pointerId)) {
      sceneRef.current.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
  };

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";

    return () => {
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isDragging]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        goNext();
      }
      if (event.key === "ArrowLeft") {
        goPrev();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev]);

  if (shouldReduceMotion) {
    return (
      <div className={`${styles.fallbackList} ${className ?? ""}`}>
        {studies.map((study) => (
          <article
            key={study.title.en}
            className={`${cardStyles.caseCard} ${cardStyles.rippleTarget}`}
          >
            <CaseCardContent study={study} locale={locale} />
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className={`${styles.carousel} ${className ?? ""}`}>
      <div
        ref={sceneRef}
        className={`${styles.scene} ${isDragging ? styles.sceneDragging : ""}`}
        aria-roledescription="carousel"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div className={styles.floorGlow} aria-hidden />

        <button
          type="button"
          className={styles.edgeZonePrev}
          onClick={goPrev}
          aria-label={intl.formatMessage({ id: "projects.carousel.prev" })}
        />

        <button
          type="button"
          className={styles.edgeZoneNext}
          onClick={goNext}
          aria-label={intl.formatMessage({ id: "projects.carousel.next" })}
        />

        <div className={styles.track}>
          {studies.map((study, index) => {
            const offset = getCircularOffset(index, activeIndex, total);
            const isActive = offset === 0;
            const isSide = Math.abs(offset) === 1;

            return (
              <motion.article
                key={study.title.en}
                className={`${cardStyles.caseCard} ${cardStyles.rippleTarget} ${styles.slide} ${
                  isActive ? styles.slideActive : ""
                } ${isSide ? styles.slideSide : ""}`}
                initial={false}
                animate={{
                  x: `calc(-50% + ${offset * slideSpread}px)`,
                  y: "-50%",
                  z: isActive ? 40 : -Math.abs(offset) * slideDepth,
                  rotateY: offset * slideRotate,
                  scale: isActive ? 1 : isCompact ? 0.9 : isMobile ? 0.92 : 0.9,
                  opacity: Math.abs(offset) > 1 ? 0 : isActive ? 1 : 0.58,
                }}
                transition={{ type: "spring", stiffness: 95, damping: 22, mass: 0.65 }}
                style={{ zIndex: isActive ? 12 : 24 }}
                onTap={() => {
                  if (didSwipe.current) {
                    didSwipe.current = false;
                    return;
                  }
                  if (!isActive) {
                    goTo(index);
                  }
                }}
                aria-hidden={!isActive}
                tabIndex={isActive ? 0 : -1}
              >
                <CaseCardContent study={study} locale={locale} />
              </motion.article>
            );
          })}
        </div>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.navButton}
          onClick={goPrev}
          aria-label={intl.formatMessage({ id: "projects.carousel.prev" })}
        >
          <FiChevronLeft aria-hidden />
        </button>

        <div
          className={styles.dots}
          role="tablist"
          aria-label={intl.formatMessage({ id: "projects.carousel.label" })}
        >
          {studies.map((study, index) => (
            <button
              key={study.title.en}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={study.title[locale]}
              className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ""}`}
              onClick={() => goTo(index)}
            />
          ))}
        </div>

        <button
          type="button"
          className={styles.navButton}
          onClick={goNext}
          aria-label={intl.formatMessage({ id: "projects.carousel.next" })}
        >
          <FiChevronRight aria-hidden />
        </button>
      </div>

      <p className={styles.hint}>{intl.formatMessage({ id: "projects.carousel.hint" })}</p>
    </div>
  );
}

type CaseCardContentProps = {
  study: CaseStudy;
  locale: Locale;
};

function CaseCardContent({ study, locale }: CaseCardContentProps) {
  return (
    <>
      <p className={cardStyles.caseRole}>{study.role[locale]}</p>
      <h3>{study.title[locale]}</h3>
      <p>{study.summary[locale]}</p>
      <p className={cardStyles.caseImpact}>{study.impact[locale]}</p>
      <ul className={cardStyles.tagList}>
        {study.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </>
  );
}
