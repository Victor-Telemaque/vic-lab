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
import { createCloudStageReveal } from '@/components/motion/section-variants';
import styles from './cloud-curtain.module.scss';

type CloudCurtainSectionProps = {
  id?: string;
  children: React.ReactNode;
  isRevealed?: boolean;
  revealDelay?: number;
};

const CLOUD_SRC = '/assets/picto/pastel-cloud.svg';

export function CloudCurtainSection({
  id,
  children,
  isRevealed = false,
  revealDelay = 0.38,
}: CloudCurtainSectionProps) {
  const stageRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const stageVariants = createCloudStageReveal(revealDelay);

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start end', 'end start'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 48,
    damping: 32,
    mass: 0.62,
  });

  const curtainOpacity = useTransform(
    smoothProgress,
    [0, 0.08, 0.22, 0.78, 0.92, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const leftX = useTransform(
    smoothProgress,
    [0.06, 0.34, 0.7],
    ['0vw', '-10vw', '-48vw'],
  );
  const rightX = useTransform(
    smoothProgress,
    [0.06, 0.34, 0.7],
    ['0vw', '10vw', '48vw'],
  );

  if (shouldReduceMotion) {
    return (
      <section ref={stageRef} id={id} className={styles.stage}>
        <div className={styles.content}>{children}</div>
      </section>
    );
  }

  return (
    <motion.section
      ref={stageRef}
      id={id}
      className={styles.stage}
      initial="hidden"
      animate={isRevealed ? 'show' : 'hidden'}
      variants={stageVariants}
    >
      <motion.div
        className={styles.curtain}
        aria-hidden
        style={{ opacity: curtainOpacity }}
      >
        <CloudPanel className={styles.panelLeft} x={leftX} />
        <CloudPanel className={styles.panelRight} x={rightX} mirrored />
      </motion.div>
      <div className={styles.content}>{children}</div>
    </motion.section>
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
