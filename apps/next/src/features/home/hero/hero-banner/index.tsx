import { clsx } from 'clsx';
import Image from 'next/image';
import styles from './styles.module.scss';
import type { HeroBannerProps } from './types';

export function HeroBanner({
  imageUrl,
  imageUrlMobile,
  imageAlt = 'Hero banner',
}: HeroBannerProps) {
  return (
    <div className={styles.container}>
      {imageUrlMobile && (
        <Image
          src={imageUrlMobile}
          alt={imageAlt}
          fill
          className={clsx(styles.image, styles.imageMobile)}
          priority
          sizes="100vw"
        />
      )}
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
