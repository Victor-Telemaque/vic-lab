"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./narrative-media.module.scss";

type NarrativeMediaProps = {
  posterSrc: string;
  videoSrc?: string;
  alt: string;
};

export function NarrativeMedia({ posterSrc, videoSrc, alt }: NarrativeMediaProps) {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setShouldReduceMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  const shouldRenderVideo = Boolean(videoSrc) && !shouldReduceMotion;

  return (
    <div className={styles.mediaFrame}>
      {shouldRenderVideo ? (
        <video
          className={styles.media}
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-label={alt}
        />
      ) : (
        <Image
          className={styles.media}
          src={posterSrc}
          alt={alt}
          width={1200}
          height={760}
          priority={false}
        />
      )}
      <div className={styles.overlay} aria-hidden />
    </div>
  );
}
