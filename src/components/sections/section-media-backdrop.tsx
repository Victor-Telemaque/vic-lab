"use client";

import { useReducedMotion } from "framer-motion";
import styles from "./section-media-backdrop.module.scss";

type OverlayVariant = "projects" | "about" | "stack";

const overlayClassMap = {
  projects: "overlayProjects",
  about: "overlayAbout",
  stack: "overlayStack",
} as const;

type Props = {
  mode: "video" | "image";
  overlayVariant: OverlayVariant;
  videoSrc?: string;
  imageSrc?: string;
  posterSrc?: string;
};

export function SectionMediaBackdrop({
  mode,
  overlayVariant,
  videoSrc,
  imageSrc,
  posterSrc,
}: Props) {
  const shouldReduceMotion = useReducedMotion();
  const shouldPlayVideo = mode === "video" && !shouldReduceMotion && Boolean(videoSrc);
  const fallbackImage = imageSrc ?? posterSrc;

  return (
    <div
      className={`${styles.backdrop} ${
        overlayVariant === "stack" ? styles.backdropStack : ""
      }`.trim()}
      aria-hidden
    >
      {shouldPlayVideo ? (
        <video
          className={styles.mediaVideo}
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          // @ts-expect-error fetchPriority is valid on video in modern browsers
          fetchPriority="low"
        />
      ) : fallbackImage ? (
        <div
          className={styles.mediaImage}
          style={{ backgroundImage: `url("${fallbackImage}")` }}
        />
      ) : null}
      <div
        className={`${styles.mediaOverlay} ${styles[overlayClassMap[overlayVariant]]}`}
      />
    </div>
  );
}
