'use client';

import Image from 'next/image';
import { motion, type MotionProps } from 'framer-motion';
import styles from './vic-lego-avatar.module.scss';

export const VIC_LEGO_SRC = '/assets/picto/vic-lego.png';

type Props = {
  className?: string;
  imageClassName?: string;
  size?: number;
  alt?: string;
  motionProps?: MotionProps;
};

export function VicLegoAvatar({
  className,
  imageClassName,
  size = 96,
  alt = '',
  motionProps,
}: Props) {
  const image = (
    <Image
      src={VIC_LEGO_SRC}
      alt={alt}
      width={size}
      height={size}
      unoptimized
      className={`${styles.image} ${imageClassName ?? ''}`.trim()}
      draggable={false}
    />
  );

  if (motionProps) {
    return (
      <motion.div
        className={`${styles.shell} ${className ?? ''}`.trim()}
        {...motionProps}
      >
        {image}
      </motion.div>
    );
  }

  return <div className={`${styles.shell} ${className ?? ''}`.trim()}>{image}</div>;
}
