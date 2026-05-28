'use client';

import Image from 'next/image';
import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useMediaQuery } from '@/hooks/use-media-query';
import styles from './cloud-curtain.module.scss';

type CloudCurtainSectionProps = {
  id?: string;
  children: React.ReactNode;
};

const CLOUD_SRC = '/assets/picto/pastel-cloud.svg';

const DESKTOP_OFFSETS = {
  scroll: ['start 0.92', 'end 0.08'] as const,
  opacity: {
    input: [0.05, 0.14, 0.22, 0.72, 0.86, 0.96],
    output: [0, 0, 1, 1, 0, 0] as number[],
  },
  leftX: {
    input: [0.12, 0.38, 0.52, 0.68, 0.86],
    output: ['24vw', '18vw', '-48vw', '-16vw', '24vw'] as string[],
  },
  rightX: {
    input: [0.12, 0.38, 0.52, 0.68, 0.86],
    output: ['-24vw', '-18vw', '48vw', '16vw', '-24vw'] as string[],
  },
  openLeft: '-48vw',
  openRight: '48vw',
};

const MOBILE_OFFSETS = {
  scroll: ['start 0.96', 'end 0.06'] as const,
  opacity: {
    input: [0.06, 0.16, 0.26, 0.7, 0.84, 0.94],
    output: [0, 0, 1, 1, 0, 0] as number[],
  },
  leftX: {
    input: [0.14, 0.4, 0.54, 0.7, 0.88],
    output: ['12vw', '10vw', '-34vw', '-8vw', '12vw'] as string[],
  },
  rightX: {
    input: [0.14, 0.4, 0.54, 0.7, 0.88],
    output: ['-12vw', '-10vw', '34vw', '8vw', '-12vw'] as string[],
  },
  openLeft: '-34vw',
  openRight: '34vw',
};

export function CloudCurtainSection({
  id,
  children,
}: CloudCurtainSectionProps) {
  const stageRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const motionConfig = isMobile ? MOBILE_OFFSETS : DESKTOP_OFFSETS;

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: [...motionConfig.scroll],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: isMobile ? 50 : 42,
    damping: isMobile ? 30 : 28,
    mass: isMobile ? 0.75 : 0.7,
  });

  const curtainOpacity = useTransform(
    smoothProgress,
    motionConfig.opacity.input,
    motionConfig.opacity.output,
  );
  const leftX = useTransform(
    smoothProgress,
    motionConfig.leftX.input,
    motionConfig.leftX.output,
  );
  const rightX = useTransform(
    smoothProgress,
    motionConfig.rightX.input,
    motionConfig.rightX.output,
  );

  return (
    <section ref={stageRef} id={id} className={styles.stage}>
      <motion.div
        className={styles.curtain}
        aria-hidden
        style={{ opacity: shouldReduceMotion ? 0 : curtainOpacity }}
      >
        <CloudPanel
          className={styles.panelLeft}
          x={shouldReduceMotion ? motionConfig.openLeft : leftX}
        />
        <CloudPanel
          className={styles.panelRight}
          x={shouldReduceMotion ? motionConfig.openRight : rightX}
          mirrored
        />
      </motion.div>
      <div className={styles.content}>{children}</div>
    </section>
  );
}

type CloudPanelProps = {
  className: string;
  x: MotionValue<string> | string;
  mirrored?: boolean;
};

function CloudPanel({ className, x, mirrored }: CloudPanelProps) {
  return (
    <motion.div className={`${styles.panel} ${className}`} style={{ x }}>
      <div className={mirrored ? styles.panelMirror : undefined}>
        <Image
          src={CLOUD_SRC}
          alt=""
          width={1200}
          height={620}
          className={styles.cloudImage}
        />
        <div className={styles.cloudGradient} />
      </div>
    </motion.div>
  );
}
