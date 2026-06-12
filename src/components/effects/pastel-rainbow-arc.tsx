'use client';

import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import styles from './pastel-rainbow-arc.module.scss';
import {
  drawRainbowArc,
  getRainbowStripeColors,
  getRainbowThemeOpacity,
  RAINBOW_ARC_DEFAULTS,
  type RainbowPointer,
} from './rainbow-arc-canvas';

const RAINBOW_VISUAL_CONFIG = {
  ...RAINBOW_ARC_DEFAULTS,
  lineWidth: 0.15,
  lineLength: 0.35,
  density: 62,
  numOfRows: 11,
};

const POINTER_SMOOTHING = 0.14;
const ENABLE_SMOOTHING = 0.1;

export function PastelRainbowArc() {
  const shouldReduceMotion = usePrefersReducedMotion();
  const shellRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<RainbowPointer>({ x: 0.5, y: 0.3, active: false });
  const smoothPointerRef = useRef({ x: 0.5, y: 0.3 });
  const mouseEnabledRef = useRef(0);
  const mountAtRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const shell = shellRef.current;
    const canvas = canvasRef.current;

    if (!shell || !canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    mountAtRef.current = performance.now();

    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = shell.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const render = (timeMs: number) => {
      const targetEnabled = pointerRef.current.active ? 1 : 0;
      mouseEnabledRef.current +=
        (targetEnabled - mouseEnabledRef.current) * ENABLE_SMOOTHING;

      const targetX = pointerRef.current.x * width;
      const targetY = pointerRef.current.y * height;
      smoothPointerRef.current.x +=
        (targetX - smoothPointerRef.current.x) * POINTER_SMOOTHING;
      smoothPointerRef.current.y +=
        (targetY - smoothPointerRef.current.y) * POINTER_SMOOTHING;

      const colors = getRainbowStripeColors(shell);
      const opacity = getRainbowThemeOpacity();

      drawRainbowArc({
        ctx,
        width,
        height,
        colors,
        mountAt: mountAtRef.current,
        timeMs,
        pointer: {
          x: smoothPointerRef.current.x / Math.max(width, 1),
          y: smoothPointerRef.current.y / Math.max(height, 1),
          active: pointerRef.current.active,
        },
        mouseEnabledRatio: mouseEnabledRef.current,
        isAnimated: !shouldReduceMotion,
        opacity,
        config: RAINBOW_VISUAL_CONFIG,
      });
    };

    const loop = (timeMs: number) => {
      render(timeMs);
      rafRef.current = window.requestAnimationFrame(loop);
    };

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = shell.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;

      pointerRef.current = {
        x: Math.min(Math.max(x, 0), 1),
        y: Math.min(Math.max(y, 0), 1),
        active:
          clientX >= rect.left - 120 &&
          clientX <= rect.right + 120 &&
          clientY >= rect.top - 160 &&
          clientY <= rect.bottom + 60,
      };
    };

    const onPointerMove = (event: PointerEvent) => {
      updatePointer(event.clientX, event.clientY);
    };

    const onPointerLeave = () => {
      pointerRef.current.active = false;
    };

    const onThemeChange = () => {
      render(performance.now());
    };

    resize();
    render(performance.now());
    rafRef.current = window.requestAnimationFrame(loop);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      render(performance.now());
    });
    resizeObserver.observe(shell);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);

    const themeObserver = new MutationObserver(onThemeChange);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => {
      resizeObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [shouldReduceMotion]);

  return (
    <div ref={shellRef} className={styles.arc} aria-hidden>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
