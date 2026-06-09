'use client';

import Image from 'next/image';
import type { BrandLogo } from '@/data/portfolio-content';
import { EmblaCarousel } from '@/components/sections/embla-carousel';
import styles from './projects-carousel.module.scss';
import stackStyles from './stack-carousel.module.scss';

const stackLabels = {
  nav: 'stack.carousel.label',
  prev: 'stack.carousel.prev',
  next: 'stack.carousel.next',
  hint: 'stack.carousel.hint',
} as const;

type Props = {
  logos: BrandLogo[];
  className?: string;
};

export function StackCarousel({ logos, className }: Props) {
  return (
    <EmblaCarousel
      items={logos}
      getItemKey={(logo) => logo.id}
      getItemLabel={(logo) => logo.name}
      labels={stackLabels}
      className={`${stackStyles.carousel} ${className ?? ''}`.trim()}
      slideClassName={stackStyles.stackSlide}
      renderSlide={(logo) => <StackCardContent logo={logo} />}
    />
  );
}

function StackCardContent({ logo }: { logo: BrandLogo }) {
  return (
    <div className={styles.stackLogo}>
      <Image
        src={logo.src}
        alt={logo.name}
        width={200}
        height={80}
        unoptimized
        className={styles.stackLogoImage}
      />
    </div>
  );
}
