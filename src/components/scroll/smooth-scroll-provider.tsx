"use client";

import {
  cancelFrame,
  frame,
  useReducedMotion,
} from "framer-motion";
import { ReactLenis, type LenisRef } from "lenis/react";
import type { LenisOptions } from "lenis";
import { useEffect, useRef } from "react";

const SMOOTH_SCROLL_OPTIONS: LenisOptions = {
  autoRaf: false,
  lerp: 0.075,
  smoothWheel: true,
  wheelMultiplier: 0.62,
  touchMultiplier: 0.95,
  syncTouch: false,
  allowNestedScroll: true,
};

type Props = {
  children: React.ReactNode;
};

export function SmoothScrollProvider({ children }: Props) {
  const shouldReduceMotion = useReducedMotion();
  const lenisRef = useRef<LenisRef>(null);
  const shouldEnableLenis = !shouldReduceMotion;

  useEffect(() => {
    if (!shouldEnableLenis) {
      return;
    }

    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp);
    }

    frame.update(update, true);

    return () => {
      cancelFrame(update);
    };
  }, [shouldEnableLenis]);

  if (!shouldEnableLenis) {
    return children;
  }

  return (
    <ReactLenis root options={SMOOTH_SCROLL_OPTIONS} ref={lenisRef}>
      {children}
    </ReactLenis>
  );
}
