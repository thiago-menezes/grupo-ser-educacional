import { useEffect, useRef } from 'react';
import styles from './styles.module.scss';
import type { CarouselControlsProps } from './types';

export function CarouselControls({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
  onToggleAutoAdvance,
}: CarouselControlsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        onPrevious();
        onToggleAutoAdvance?.(false);
      } else if (e.key === 'ArrowRight') {
        onNext();
        onToggleAutoAdvance?.(false);
      }
    };

    container?.addEventListener('keydown', handleKeyDown);
    return () => container?.removeEventListener('keydown', handleKeyDown);
  }, [onPrevious, onNext, onToggleAutoAdvance]);

  if (totalSlides <= 1) return null;

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        className={styles.arrowButton}
        onClick={() => {
          onPrevious();
          onToggleAutoAdvance?.(false);
        }}
        aria-label="Previous slide"
        title="Previous slide (or press ← arrow)"
        type="button"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div className={styles.indicators}>
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentSlide ? styles.active : ''}`}
            onClick={() => {
              // Could implement goToSlide if needed
              onToggleAutoAdvance?.(false);
            }}
            aria-label={`Go to slide ${index + 1}`}
            title={`Slide ${index + 1}`}
            type="button"
          />
        ))}
      </div>

      <button
        className={styles.arrowButton}
        onClick={() => {
          onNext();
          onToggleAutoAdvance?.(false);
        }}
        aria-label="Next slide"
        title="Next slide (or press → arrow)"
        type="button"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}

export type { CarouselControlsProps };
