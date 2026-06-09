"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  scrollViewport,
  sectionReveal,
} from "@/components/motion/section-variants";

type SectionRevealProps = {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "section";
  id?: string;
  ariaLabel?: string;
  variants?: Variants;
  viewport?: typeof scrollViewport;
  /** When set, animates on boolean flip (e.g. after hero exit) instead of whileInView */
  trigger?: boolean;
};

export function SectionReveal({
  className,
  children,
  as = "section",
  id,
  ariaLabel,
  variants = sectionReveal,
  viewport = scrollViewport,
  trigger,
}: SectionRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as];
  const usesTrigger = trigger !== undefined;

  if (shouldReduceMotion) {
    const Tag = as;
    return (
      <Tag className={className} id={id} aria-label={ariaLabel}>
        {children}
      </Tag>
    );
  }

  return (
    <Component
      id={id}
      aria-label={ariaLabel}
      className={className}
      initial="hidden"
      animate={usesTrigger ? (trigger ? "show" : "hidden") : undefined}
      whileInView={usesTrigger ? undefined : "show"}
      viewport={usesTrigger ? undefined : viewport}
      variants={variants}
    >
      {children}
    </Component>
  );
}
