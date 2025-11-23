import { clsx } from 'clsx';
import Image from 'next/image';
import styles from './styles.module.scss';
import type { HeroBannerProps } from './types';

export function HeroBanner({
  carouselItems,
  currentSlide = 0,
  imageUrl,
  imageUrlMobile,
  imageAlt = 'Hero banner',
}: HeroBannerProps) {
  // Use carousel if items are provided, otherwise fallback to single image
  const useCarousel = carouselItems && carouselItems.length > 0;

  if (useCarousel) {
    return (
      <div className={styles.container}>
        <div className={styles.slidesWrapper}>
          {carouselItems.map((item, index) => {
            const isActive = index === currentSlide % carouselItems.length;
            return (
              <div
                key={index}
                className={clsx(styles.slide, isActive && styles.slideActive)}
              >
                {item.mobileImage && (
                  <Image
                    src={item.mobileImage}
                    alt={item.alt || `Hero banner ${index + 1}`}
                    fill
                    className={clsx(styles.image, styles.imageMobile)}
                    priority={index === 0}
                    sizes="100vw"
                  />
                )}
                <Image
                  src={item.desktopImage}
                  alt={item.alt || `Hero banner ${index + 1}`}
                  fill
                  className={styles.image}
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1232px"
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Fallback to single image (backward compatibility)
  if (!imageUrl) {
    return null;
  }

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
