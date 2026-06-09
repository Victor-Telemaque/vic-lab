"use client";

import { animate, useMotionValue } from "framer-motion";
import { useLenis } from "lenis/react";
import type { VirtualScrollData } from "lenis";
import { useCallback, useEffect, useRef, useState } from "react";

const EXIT_EASE: [number, number, number, number] = [0.22, 1.12, 0.36, 1];
const EXIT_DURATION_S = 0.9;
const TOUCH_EXIT_DELTA_PX = 48;

type Options = {
  isEnabled: boolean;
  onExited?: () => void;
};

export function useHeroScrollExit({ isEnabled, onExited }: Options) {
  const lenis = useLenis();
  const exitProgress = useMotionValue(0);
  const [hasExited, setHasExited] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const isAnimatingRef = useRef(false);
  const animationStopRef = useRef<(() => void) | null>(null);
  const gateActiveRef = useRef(false);
  const playExitRef = useRef<() => void>(() => undefined);
  const onExitedRef = useRef(onExited);
  onExitedRef.current = onExited;

  gateActiveRef.current = isEnabled && !hasExited;

  const playExit = useCallback(() => {
    if (!isEnabled || hasExited || isAnimatingRef.current) {
      return;
    }
    if (exitProgress.get() >= 1) {
      setHasExited(true);
      onExitedRef.current?.();
      return;
    }

    isAnimatingRef.current = true;
    setIsAnimating(true);

    lenis?.stop();

    const controls = animate(exitProgress, 1, {
      duration: EXIT_DURATION_S,
      ease: EXIT_EASE,
    });

    animationStopRef.current = () => controls.stop();

    void controls.then(() => {
      isAnimatingRef.current = false;
      setIsAnimating(false);
      setHasExited(true);
      animationStopRef.current = null;
      lenis?.start();
      onExitedRef.current?.();
    });
  }, [exitProgress, hasExited, isEnabled, lenis]);

  playExitRef.current = playExit;

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    document.documentElement.classList.toggle("hero-gate-active", !hasExited);

    return () => {
      document.documentElement.classList.remove("hero-gate-active");
    };
  }, [hasExited, isEnabled]);

  useEffect(() => {
    if (!isEnabled || hasExited) {
      return;
    }

    const previousScrollRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    lenis?.scrollTo(0, { immediate: true });

    return () => {
      history.scrollRestoration = previousScrollRestoration;
    };
  }, [hasExited, isEnabled, lenis]);

  const handleScrollIntent = useCallback((deltaY: number, event?: Event) => {
    if (!gateActiveRef.current) {
      return;
    }

    if (deltaY <= 0) {
      if (isAnimatingRef.current && event?.cancelable) {
        event.preventDefault();
      }
      return;
    }

    if (event?.cancelable) {
      event.preventDefault();
    }

    if (!isAnimatingRef.current) {
      playExitRef.current();
    }
  }, []);

  useLenis(
    (lenis) => {
      if (!isEnabled || hasExited) {
        return;
      }

      const onVirtualScroll = ({ deltaY, event }: VirtualScrollData) => {
        handleScrollIntent(deltaY, event);
      };

      return lenis.on("virtual-scroll", onVirtualScroll);
    },
    [handleScrollIntent, hasExited, isEnabled],
  );

  useEffect(() => {
    if (!isEnabled || hasExited) {
      return;
    }

    const onWheel = (event: WheelEvent) => {
      if (lenis) {
        return;
      }
      handleScrollIntent(event.deltaY, event);
    };

    let touchStartY = 0;

    const onTouchStart = (event: TouchEvent) => {
      if (!gateActiveRef.current) {
        return;
      }
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (!gateActiveRef.current) {
        return;
      }
      const touchEndY = event.changedTouches[0]?.clientY ?? touchStartY;
      if (touchStartY - touchEndY >= TOUCH_EXIT_DELTA_PX) {
        handleScrollIntent(TOUCH_EXIT_DELTA_PX, event);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!gateActiveRef.current) {
        return;
      }

      const isScrollKey =
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        event.key === " " ||
        event.key === "Enter";

      if (!isScrollKey) {
        return;
      }

      event.preventDefault();
      playExitRef.current();
    };

    document.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
      animationStopRef.current?.();
    };
  }, [handleScrollIntent, hasExited, isEnabled, lenis]);

  const showScrollHint = isEnabled && !hasExited && !isAnimating;

  return {
    exitProgress,
    hasExited,
    isAnimating,
    showScrollHint,
    playExit,
  };
}
