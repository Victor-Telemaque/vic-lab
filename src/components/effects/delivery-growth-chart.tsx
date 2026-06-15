'use client';

import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import {
  drawDeliveryChart,
  getDeliveryChartPalette,
} from '@/components/effects/delivery-growth-canvas';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import styles from './delivery-growth-chart.module.scss';

const PROGRESS_SPRING = 0.075;
const POINTER_SMOOTHING = 0.12;
const ACTIVATION_RATIO = 0.68;

function shouldActivateChart(entry: IntersectionObserverEntry) {
  if (!entry.isIntersecting) {
    return false;
  }

  const { top, bottom, height } = entry.boundingClientRect;
  const viewportHeight = window.innerHeight;

  if (height <= 0) {
    return false;
  }

  const visibleTop = Math.max(top, 0);
  const visibleBottom = Math.min(bottom, viewportHeight);
  const visibleHeight = Math.max(0, visibleBottom - visibleTop);
  const visibleRatio = visibleHeight / height;
  const centerY = top + height / 2;
  const isCenteredInViewport =
    centerY >= viewportHeight * 0.2 && centerY <= viewportHeight * 0.88;

  return visibleRatio >= ACTIVATION_RATIO && isCenteredInViewport;
}

export function DeliveryGrowthChart() {
  const intl = useIntl();
  const shouldReduceMotion = usePrefersReducedMotion();
  const shellRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const progressRef = useRef(shouldReduceMotion ? 1 : 0);
  const isActivatedRef = useRef(shouldReduceMotion);
  const pointerRef = useRef({ x: 0.5, y: 0.42, active: false });
  const smoothPointerRef = useRef({ x: 0.5, y: 0.42 });
  const [isActivated, setIsActivated] = useState(shouldReduceMotion);

  useEffect(() => {
    isActivatedRef.current = isActivated;
  }, [isActivated]);

  useEffect(() => {
    if (shouldReduceMotion) {
      setIsActivated(true);
      progressRef.current = 1;
      isActivatedRef.current = true;
      return;
    }

    const node = shellRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (shouldActivateChart(entry)) {
          setIsActivated(true);
          isActivatedRef.current = true;
          observer.disconnect();
        }
      },
      {
        threshold: [0, 0.35, 0.5, 0.68, 0.85, 1],
        rootMargin: '0px 0px -8% 0px',
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldReduceMotion]);

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

    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = shell.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const render = (timeMs: number) => {
      const target = isActivatedRef.current ? 1 : 0;
      progressRef.current += (target - progressRef.current) * PROGRESS_SPRING;

      if (!isActivatedRef.current && progressRef.current < 0.001) {
        const dpr = window.devicePixelRatio || 1;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);
        return;
      }

      smoothPointerRef.current.x +=
        (pointerRef.current.x - smoothPointerRef.current.x) * POINTER_SMOOTHING;
      smoothPointerRef.current.y +=
        (pointerRef.current.y - smoothPointerRef.current.y) * POINTER_SMOOTHING;

      drawDeliveryChart({
        ctx,
        width,
        height,
        palette: getDeliveryChartPalette(shell),
        progress: progressRef.current,
        timeMs,
        pointer: {
          x: smoothPointerRef.current.x,
          y: smoothPointerRef.current.y,
          active: pointerRef.current.active && isActivatedRef.current,
        },
        isAnimated: !shouldReduceMotion && isActivatedRef.current,
      });
    };

    const loop = (timeMs: number) => {
      render(timeMs);
      rafRef.current = window.requestAnimationFrame(loop);
    };

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = shell.getBoundingClientRect();
      pointerRef.current = {
        x: (clientX - rect.left) / rect.width,
        y: (clientY - rect.top) / rect.height,
        active:
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom,
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
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(shell);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    shell.addEventListener('pointerleave', onPointerLeave);
    const themeObserver = new MutationObserver(onThemeChange);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    rafRef.current = window.requestAnimationFrame(loop);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      resizeObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      shell.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [shouldReduceMotion]);

  return (
    <div
      ref={shellRef}
      className={styles.shell}
      role="img"
      aria-label={intl.formatMessage({ id: 'why.chartAria' })}
    >
      <div className={styles.frame} aria-hidden>
        <span className={styles.cornerLabel}>
          {intl.formatMessage({ id: 'why.chartKicker' })}
        </span>
        <span className={styles.cornerBadge}>
          {intl.formatMessage({ id: 'why.chartBadge' })}
        </span>
        <canvas ref={canvasRef} className={styles.canvas} />
        <span className={styles.sheen} />
      </div>
    </div>
  );
}
