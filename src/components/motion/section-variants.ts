import type { Variants } from "framer-motion";

export const scrollViewport = { once: true, amount: 0.22 };

export const sectionEase = [0.22, 1, 0.36, 1] as const;

export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.62,
      ease: sectionEase,
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

export const sectionRevealItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: sectionEase },
  },
};

const postHeroEase = [0.22, 1.18, 0.36, 1] as const;

/** First block after hero exit — deliberate “new universe” reveal */
export const storyStripReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 72,
    scale: 0.9,
    filter: "blur(12px)",
    clipPath: "inset(10% 5% 22% 5% round 1rem)",
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    clipPath: "inset(0% 0% 0% 0% round 1.2rem)",
    transition: {
      duration: 0.95,
      ease: postHeroEase,
      staggerChildren: 0.12,
      delayChildren: 0.18,
    },
  },
};

export const storyStripItemReveal: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: postHeroEase },
  },
};

export const storyStripSkillsStagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.42 },
  },
};

export const storyStripSkillItemReveal: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.92 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: postHeroEase },
  },
};

const cloudStageHidden = {
  opacity: 0,
  y: 96,
  scale: 0.94,
  filter: "blur(6px)",
};

const cloudStageShown = {
  opacity: 1,
  y: 0,
  scale: 1,
  filter: "blur(0px)",
};

/** Cloud curtain stage — follows story strip with a short delay */
export const cloudStageReveal: Variants = {
  hidden: cloudStageHidden,
  show: {
    ...cloudStageShown,
    transition: {
      duration: 1.05,
      ease: postHeroEase,
    },
  },
};

export function createCloudStageReveal(delay = 0): Variants {
  return {
    hidden: cloudStageHidden,
    show: {
      ...cloudStageShown,
      transition: {
        duration: 1.05,
        ease: postHeroEase,
        delay,
      },
    },
  };
}

/** @deprecated Use sectionReveal */
export const fadeUp = sectionReveal;

/** @deprecated Use sectionReveal */
export const zoomIn = sectionReveal;

/** @deprecated Use sectionReveal */
export const flipUp = sectionReveal;

/** @deprecated Use sectionReveal */
export const slideUp = sectionReveal;

/** @deprecated Use sectionRevealItem */
export const storyStripShell = sectionReveal;

/** @deprecated Use sectionRevealItem */
export const storyStripItem = sectionRevealItem;

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

export const staggerItem: Variants = sectionRevealItem;

export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -24, y: 12 },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.55, ease: sectionEase },
  },
};

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 24, y: 12 },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.55, ease: sectionEase },
  },
};
