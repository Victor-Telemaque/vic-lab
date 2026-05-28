import type { Variants } from "framer-motion";

export const scrollViewport = { once: false, amount: 0.28 };

const easeOut = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease: easeOut },
  },
};

export const zoomIn: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.62, ease: easeOut },
  },
};

export const flipUp: Variants = {
  hidden: {
    opacity: 0,
    rotateX: 14,
    y: 28,
    transformPerspective: 900,
  },
  show: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    transformPerspective: 900,
    transition: { duration: 0.68, ease: easeOut },
  },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 52 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -36 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
};

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 36 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
};
