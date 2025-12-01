import { clsx } from 'clsx';
import Image from 'next/image';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import type { HeroBannerProps } from './types';

export function HeroBanner({
  carouselItems,
  currentSlide = 0,
  direction = 'right',
  imageUrl,
  imageUrlMobile,
  imageAlt = 'Hero banner',
}: HeroBannerProps) {
  const isInitialMount = useRef(true);
  const prevSlideRef = useRef<number | null>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useLayoutEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevSlideRef.current = currentSlide;
      return;
    }

    // Only animate if slide actually changed
    const prevSlide = prevSlideRef.current;
    if (prevSlide !== null && prevSlide !== currentSlide) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShouldAnimate(true);
    }

    prevSlideRef.current = currentSlide;
  }, [currentSlide, setShouldAnimate]);

  // Reset animation flag after animation completes
  useEffect(() => {
    if (!shouldAnimate) return;

    const timer = setTimeout(() => {
      setShouldAnimate(false);
    }, 600); // Match animation duration

    return () => clearTimeout(timer);
  }, [shouldAnimate]);

  // Use carousel if items are provided, otherwise fallback to single image
  const useCarousel = carouselItems && carouselItems.length > 0;

  if (useCarousel) {
    return (
      <div className={styles.container}>
        <div className={styles.slidesWrapper}>
          {carouselItems.map((item, index) => {
            const isActive = index === currentSlide % carouselItems.length;
            const slideDirectionClass =
              direction === 'right' ? styles.slideRight : styles.slideLeft;
            return (
              <div
                key={index}
                className={clsx(
                  styles.slide,
                  isActive && styles.slideActive,
                  slideDirectionClass,
                  shouldAnimate && styles.slideAnimated,
                )}
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
