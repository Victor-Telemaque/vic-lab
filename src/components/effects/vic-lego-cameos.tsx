'use client';

import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { VicLegoAvatar } from './vic-lego-avatar';
import styles from './vic-lego-cameos.module.scss';

const LIFT_SPRING = { stiffness: 38, damping: 30, mass: 1.05 };

type AnchorProps = {
  anchorRef: React.RefObject<HTMLElement | null>;
  isEnabled: boolean;
};

type LiftPeekProps = {
  progress: MotionValue<number>;
  className?: string;
  imageClassName?: string;
  size: number;
  hiddenY?: string;
  visibleY?: string;
  revealStart?: number;
  revealEnd?: number;
  animateOpacity?: boolean;
};

function LiftScrollPeek({
  progress,
  className,
  imageClassName,
  size,
  hiddenY = '100%',
  visibleY = '0%',
  revealStart = 0.38,
  revealEnd = 0.78,
  animateOpacity = true,
}: LiftPeekProps) {
  const y = useTransform(
    progress,
    [0, revealStart, revealEnd, 1],
    [hiddenY, hiddenY, visibleY, visibleY],
  );
  const opacity = useTransform(
    progress,
    [0, revealStart + 0.02, revealEnd - 0.04, 1],
    [0, 0, 1, 1],
  );

  return (
    <motion.div
      className={className}
      style={animateOpacity ? { y, opacity } : { y }}
      aria-hidden
    >
      <VicLegoAvatar imageClassName={imageClassName} size={size} />
    </motion.div>
  );
}

export function VicLegoCloudPeek({
  anchorRef,
}: {
  anchorRef: React.RefObject<HTMLElement | null>;
}) {
  const shouldReduceMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: anchorRef,
    offset: ['start 0.98', 'start 0.08'],
  });
  const progress = useSpring(scrollYProgress, LIFT_SPRING);

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div className={styles.cloudStage}>
      <LiftScrollPeek
        progress={progress}
        className={styles.cloudPeek}
        imageClassName={styles.cloudAvatar}
        size={340}
        hiddenY="100%"
        visibleY="-8%"
        revealStart={0.44}
        revealEnd={0.84}
      />
    </div>
  );
}

export function VicLegoFooterPeek({ anchorRef, isEnabled }: AnchorProps) {
  const shouldReduceMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: anchorRef,
    offset: ['start end', 'end end'],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 52,
    damping: 26,
    mass: 0.85,
  });

  if (!isEnabled || shouldReduceMotion) {
    return null;
  }

  return (
    <div className={styles.footerStage}>
      <LiftScrollPeek
        progress={progress}
        className={styles.footerPeek}
        imageClassName={styles.footerAvatar}
        size={340}
        hiddenY="100%"
        visibleY="8%"
        revealStart={0.12}
        revealEnd={0.48}
        animateOpacity={false}
      />
    </div>
  );
}
