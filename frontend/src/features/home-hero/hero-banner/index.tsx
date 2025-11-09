'use client';

import Image from 'next/image';
import styles from './styles.module.scss';
import type { HeroBannerProps } from './types';

export function HeroBanner({
  imageUrl,
  imageAlt = 'Hero banner',
}: HeroBannerProps) {
  return (
    <div className={styles.container}>
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        className={styles.image}
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1232px"
      />
    </div>
  );
}

export type { HeroBannerProps };
