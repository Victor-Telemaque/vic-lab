"use client";

import { useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import { useCallback } from "react";

const SECTION_SCROLL_OFFSET = -20;

export function useScrollToSection() {
  const lenis = useLenis();
  const shouldReduceMotion = useReducedMotion();

  return useCallback(
    (sectionId: string) => {
      const target = document.getElementById(sectionId);
      if (!target) {
        return;
      }

      if (lenis && !shouldReduceMotion) {
        lenis.scrollTo(target, {
          offset: SECTION_SCROLL_OFFSET,
          duration: 1.05,
        });
        return;
      }

      const top =
        target.getBoundingClientRect().top +
        window.scrollY +
        SECTION_SCROLL_OFFSET;

      window.scrollTo({
        top,
        behavior: shouldReduceMotion ? "auto" : "smooth",
      });
    },
    [lenis, shouldReduceMotion],
  );
}
