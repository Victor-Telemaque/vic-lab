'use client';

import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaOptionsType } from 'embla-carousel';
import { useReducedMotion } from 'framer-motion';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useIntl } from 'react-intl';
import cardStyles from './portfolio-home.module.scss';
import styles from './embla-carousel.module.scss';

type CarouselLabels = {
  nav: string;
  prev: string;
  next: string;
  hint?: string;
};

type Props<T> = {
  items: T[];
  getItemKey: (item: T) => string;
  getItemLabel: (item: T) => string;
  renderSlide: (item: T, index: number) => ReactNode;
  labels: CarouselLabels;
  className?: string;
  slideClassName?: string;
  options?: EmblaOptionsType;
  onSlideChange?: (index: number) => void;
  dotsVariant?: 'default' | 'compact';
};

export function EmblaCarousel<T>({
  items,
  getItemKey,
  getItemLabel,
  renderSlide,
  labels,
  className,
  slideClassName,
  options,
  onSlideChange,
  dotsVariant = 'default',
}: Props<T>) {
  const intl = useIntl();
  const shouldReduceMotion = useReducedMotion();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [centerIndex, setCenterIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const lastIndexRef = useRef<number | null>(null);
  const onSlideChangeRef = useRef(onSlideChange);
  onSlideChangeRef.current = onSlideChange;

  const emblaOptions = useMemo<EmblaOptionsType>(
    () => ({
      align: 'center',
      containScroll: 'keepSnaps',
      loop: false,
      ...options,
    }),
    [options],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const lastEdgeGapRef = useRef<number | null>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const isCompactDots = dotsVariant === 'compact';

  const setViewportRef = useCallback(
    (node: HTMLDivElement | null) => {
      viewportRef.current = node;
      emblaRef(node);
    },
    [emblaRef],
  );

  const syncEdgeGaps = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const slide = viewport.querySelector<HTMLElement>(`.${styles.slide}`);
    if (!slide) {
      return;
    }

    const viewportWidth = viewport.clientWidth;
    const slideWidth = slide.getBoundingClientRect().width;
    const edgeGap = Math.round(Math.max(0, (viewportWidth - slideWidth) / 2));

    if (lastEdgeGapRef.current === edgeGap) {
      return;
    }

    lastEdgeGapRef.current = edgeGap;
    viewport.style.setProperty('--embla-edge-gap', `${edgeGap}px`);
    emblaApi?.reInit();
  }, [emblaApi]);

  const syncCenterIndex = useCallback(() => {
    if (!emblaApi) {
      return;
    }

    const progress = emblaApi.scrollProgress();
    const snaps = emblaApi.scrollSnapList();
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    snaps.forEach((snap, index) => {
      const distance = Math.abs(snap - progress);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setCenterIndex(closestIndex);
  }, [emblaApi]);

  const syncCarouselState = useCallback(() => {
    if (!emblaApi) {
      return;
    }

    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    syncCenterIndex();

    if (lastIndexRef.current !== index) {
      if (lastIndexRef.current !== null) {
        onSlideChangeRef.current?.(index);
      }
      lastIndexRef.current = index;
    }
  }, [emblaApi, syncCenterIndex]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    syncCarouselState();
    emblaApi.on('scroll', syncCenterIndex);
    emblaApi.on('select', syncCarouselState);
    emblaApi.on('reInit', syncCarouselState);

    return () => {
      emblaApi.off('scroll', syncCenterIndex);
      emblaApi.off('select', syncCarouselState);
      emblaApi.off('reInit', syncCarouselState);
    };
  }, [emblaApi, syncCarouselState, syncCenterIndex]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !emblaApi) {
      return;
    }

    syncEdgeGaps();

    const resizeObserver = new ResizeObserver(() => {
      syncEdgeGaps();
    });

    resizeObserver.observe(viewport);
    const firstSlide = viewport.querySelector(`.${styles.slide}`);
    if (firstSlide) {
      resizeObserver.observe(firstSlide);
    }

    return () => resizeObserver.disconnect();
  }, [emblaApi, items.length, syncEdgeGaps]);

  useEffect(() => {
    if (!isCompactDots) {
      return;
    }

    const dots = dotsRef.current;
    const activeDot = dots?.querySelector<HTMLElement>('[aria-selected="true"]');
    activeDot?.scrollIntoView({
      inline: 'center',
      block: 'nearest',
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    });
  }, [isCompactDots, selectedIndex, shouldReduceMotion]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  if (shouldReduceMotion) {
    return (
      <div className={`${styles.fallbackList} ${className ?? ''}`}>
        {items.map((item, index) => (
          <article
            key={getItemKey(item)}
            className={`${cardStyles.caseCard} ${cardStyles.rippleTarget}`}
          >
            {renderSlide(item, index)}
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className={`${styles.root} ${className ?? ''}`}>
      <div className={styles.viewport} ref={setViewportRef}>
        <div className={styles.container}>
          {items.map((item, index) => (
            <div
              key={getItemKey(item)}
              className={`${styles.slide} ${slideClassName ?? ''} ${
                index === centerIndex ? styles.slideSelected : styles.slideAside
              }`.trim()}
            >
              <article className={cardStyles.caseCard}>
                {renderSlide(item, index)}
              </article>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`${styles.controls} ${isCompactDots ? styles.controlsCompact : ''}`.trim()}
      >
        <button
          type="button"
          className={styles.navButton}
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          aria-label={intl.formatMessage({ id: labels.prev })}
        >
          <FiChevronLeft aria-hidden />
        </button>

        <div
          ref={dotsRef}
          className={`${styles.dots} ${isCompactDots ? styles.dotsCompact : ''}`.trim()}
          role="tablist"
          aria-label={intl.formatMessage({ id: labels.nav })}
        >
          {items.map((item, index) => (
            <button
              key={getItemKey(item)}
              type="button"
              role="tab"
              aria-selected={index === selectedIndex}
              aria-label={getItemLabel(item)}
              className={`${styles.dot} ${index === selectedIndex ? styles.dotActive : ''}`}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>

        <button
          type="button"
          className={styles.navButton}
          onClick={scrollNext}
          disabled={!canScrollNext}
          aria-label={intl.formatMessage({ id: labels.next })}
        >
          <FiChevronRight aria-hidden />
        </button>
      </div>

      {labels.hint ? (
        <p className={styles.hint}>{intl.formatMessage({ id: labels.hint })}</p>
      ) : null}
    </div>
  );
}
