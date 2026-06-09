"use client";

import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { type RefObject, useMemo, useRef } from "react";
import { useIntl } from "react-intl";
import { heroBackground } from "@/data/portfolio-content";
import { useHeroScrollExit } from "@/hooks/use-hero-scroll-exit";
import styles from "./hero-scroll-sequence.module.scss";

function HeroVideoBackdrop({
  shouldPlayVideo,
  videoOpacity,
}: {
  shouldPlayVideo: boolean;
  videoOpacity?: MotionValue<number>;
}) {
  return (
    <div className={styles.mediaBackdrop} aria-hidden>
      {shouldPlayVideo ? (
        <motion.video
          className={styles.heroVideo}
          src={heroBackground.videoSrc}
          poster={heroBackground.posterSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          style={{ opacity: videoOpacity }}
        />
      ) : (
        <div
          className={styles.heroPoster}
          style={{ backgroundImage: `url("${heroBackground.posterSrc}")` }}
        />
      )}
      <div className={styles.mediaOverlay} />
      <div className={styles.mediaGrain} />
    </div>
  );
}

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.65,
      delay: 0.2 + index * 0.12,
      ease: [0.2, 0.8, 0.2, 1],
    },
  }),
};

type Props = {
  trackRef?: RefObject<HTMLElement | null>;
  onExited?: () => void;
};

export function HeroScrollSequence({ trackRef, onExited }: Props) {
  const intl = useIntl();
  const shouldReduceMotion = useReducedMotion();
  const title = intl.formatMessage({ id: "hero.title" });
  const internalTrackRef = useRef<HTMLElement>(null);
  const resolvedTrackRef = trackRef ?? internalTrackRef;

  const { exitProgress, hasExited, showScrollHint, playExit } = useHeroScrollExit({
    isEnabled: !shouldReduceMotion,
    onExited,
  });

  const sceneScale = useTransform(exitProgress, [0, 0.55, 0.78, 0.9, 1], [1, 1, 0.97, 0.9, 0.82]);
  const sceneY = useTransform(exitProgress, [0, 0.5, 0.82, 1], [0, 0, -48, -140]);
  const sceneOpacity = useTransform(exitProgress, [0.72, 0.92, 1], [1, 0.35, 0]);
  const innerScale = useTransform(exitProgress, [0, 0.58, 0.8, 0.9, 1], [1, 1, 0.94, 1.04, 0.88]);
  const innerBlur = useTransform(exitProgress, [0.5, 0.88], [0, 6]);
  const innerFilter = useTransform(innerBlur, (blur) => `blur(${blur}px)`);
  const videoOpacity = useTransform(exitProgress, [0, 0.7, 1], [0.34, 0.12, 0]);
  const exitVeilOpacity = useTransform(exitProgress, [0.58, 0.82, 1], [0, 0.55, 1]);
  const exitBurstScale = useTransform(exitProgress, [0.62, 0.86, 1], [0.4, 1.15, 1.45]);
  const hintOpacity = useTransform(exitProgress, [0, 0.08], [1, 0]);

  const lineChunks = useMemo(
    () =>
      title
        .replace(",", " ")
        .split(/\s+/)
        .filter(Boolean)
        .reduce<string[]>((lines, word) => {
          const current = lines.at(-1);
          if (!current) {
            lines.push(word);
            return lines;
          }
          if (`${current} ${word}`.length > 18) {
            lines.push(word);
            return lines;
          }
          lines[lines.length - 1] = `${current} ${word}`;
          return lines;
        }, []),
    [title]
  );

  const heroContent = (
    <>
      <motion.p
        className={styles.kicker}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {intl.formatMessage({ id: "hero.kicker" })}
      </motion.p>
      <h1 className={styles.title}>
        {lineChunks.map((line, index) => (
          <motion.span
            key={line}
            custom={index}
            variants={lineVariants}
            initial="hidden"
            animate="show"
            className={styles.titleLine}
          >
            {line}
          </motion.span>
        ))}
      </h1>
      <motion.p
        className={styles.lead}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        {intl.formatMessage({ id: "hero.lead" })}
      </motion.p>
    </>
  );

  const scrollHintLabel = intl.formatMessage({ id: "hero.scrollHint" });

  if (shouldReduceMotion) {
    return (
      <section ref={resolvedTrackRef} className={styles.track}>
        <div className={styles.scene}>
          <HeroVideoBackdrop shouldPlayVideo={false} />
          <div className={styles.inner}>
            <p className={styles.kicker}>{intl.formatMessage({ id: "hero.kicker" })}</p>
            <h1 className={styles.title}>
              {lineChunks.map((line) => (
                <span key={line} className={styles.titleLine}>
                  {line}
                </span>
              ))}
            </h1>
            <p className={styles.lead}>{intl.formatMessage({ id: "hero.lead" })}</p>
          </div>
        </div>
      </section>
    );
  }

  const trackClassName = [
    styles.track,
    hasExited ? styles.trackExited : styles.trackPinned,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {!hasExited ? <div className={styles.heroSpacer} aria-hidden /> : null}
      <section
        ref={resolvedTrackRef}
        className={trackClassName}
        aria-label={intl.formatMessage({ id: "hero.scrollSceneLabel" })}
      >
      <div className={styles.sceneShell}>
        <motion.div
          className={styles.scene}
          style={{
            scale: sceneScale,
            y: sceneY,
            opacity: sceneOpacity,
          }}
        >
          <HeroVideoBackdrop shouldPlayVideo videoOpacity={videoOpacity} />
          <motion.div
            className={styles.exitBurst}
            style={{ scale: exitBurstScale, opacity: exitVeilOpacity }}
            aria-hidden
          />
          <motion.div
            className={styles.exitVeil}
            style={{ opacity: exitVeilOpacity }}
            aria-hidden
          />
          <motion.div
            className={styles.inner}
            style={{
              scale: innerScale,
              filter: innerFilter,
            }}
          >
            {heroContent}
          </motion.div>

          {showScrollHint ? (
            <motion.button
              type="button"
              className={styles.scrollHint}
              style={{ opacity: hintOpacity }}
              aria-label={scrollHintLabel}
              onClick={playExit}
            >
              <span>{scrollHintLabel}</span>
              <svg
                className={styles.scrollHintChevron}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden
              >
                <path d="M12 5v12M7 13l5 5 5-5" />
              </svg>
            </motion.button>
          ) : null}
        </motion.div>
      </div>
    </section>
    </>
  );
}
