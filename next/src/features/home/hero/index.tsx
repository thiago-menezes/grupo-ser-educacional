import { useMemo } from 'react';
import { Button } from 'reshaped';
import { Icon } from '@/components';
import { useCurrentInstitution } from '@/hooks';
import { useHeroContent, useHomeCarousel } from './api/query';
import { CarouselControls } from './carousel-controls';
import { DEFAULT_HERO_CONTENT } from './constants';
import { HeroBanner } from './hero-banner';
import { HeroBannerSkeleton } from './hero-banner-skeleton';
import { useHeroCarousel } from './hooks';
import { QuickSearchForm } from './quick-search-form';
import styles from './styles.module.scss';

export type HomeHeroProps = {
  institutionSlug: string;
  showPlaceholder?: boolean;
};

function HeroContent({ institutionSlug }: HomeHeroProps) {
  const { data: heroContent, isLoading: isLoadingHeroContent } =
    useHeroContent(institutionSlug);
  const { data: carouselItems = [], isLoading: isLoadingCarousel } =
    useHomeCarousel(institutionSlug);

  const isLoading = isLoadingHeroContent || isLoadingCarousel;

  const content = useMemo(
    () => heroContent || DEFAULT_HERO_CONTENT,
    [heroContent],
  );

  // Use carousel if items exist, otherwise use single image
  const totalSlides = carouselItems.length > 0 ? carouselItems.length : 1;
  const {
    currentSlide,
    direction,
    nextSlide,
    previousSlide,
    goToSlide,
    setIsAutoAdvancing,
    pauseAutoAdvance,
  } = useHeroCarousel(totalSlides);

  // Transform carousel items to match HeroBanner props
  const carouselItemsFormatted = useMemo(() => {
    if (carouselItems.length === 0) {
      return undefined;
    }
    return carouselItems.map((item) => ({
      image: item.image,
      alt: item.alt,
      link: item.link,
    }));
  }, [carouselItems]);

  // Fallback to single image if no carousel items
  const fallbackImageUrl =
    carouselItems.length === 0 ? content.backgroundImage?.url : undefined;
  const fallbackImageAlt =
    carouselItems.length === 0
      ? content.backgroundImage?.alternativeText
      : undefined;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.heroSection}>
          <div className={styles.heroCard}>
            {isLoading ? (
              <HeroBannerSkeleton />
            ) : (
              <HeroBanner
                carouselItems={carouselItemsFormatted}
                currentSlide={currentSlide}
                direction={direction}
                imageUrl={fallbackImageUrl}
                imageAlt={fallbackImageAlt}
              />
            )}

            {content.showCarouselControls && (
              <>
                <div className={styles.carouselControlsWrapper}>
                  <Button
                    className={styles.carouselLeftButton}
                    onClick={() => {
                      previousSlide();
                      pauseAutoAdvance();
                    }}
                    aria-label="Previous slide"
                    icon={<Icon name="chevron-left" size={24} />}
                  />
                  <Button
                    className={styles.carouselRightButton}
                    onClick={() => {
                      nextSlide();
                      pauseAutoAdvance();
                    }}
                    aria-label="Next slide"
                    icon={<Icon name="chevron-right" size={24} />}
                  />
                </div>

                <div className={styles.carouselIndicators}>
                  <CarouselControls
                    currentSlide={currentSlide}
                    totalSlides={totalSlides}
                    onPrevious={() => {
                      previousSlide();
                      pauseAutoAdvance();
                    }}
                    onNext={() => {
                      nextSlide();
                      pauseAutoAdvance();
                    }}
                    onGoToSlide={(index) => {
                      goToSlide(index);
                      pauseAutoAdvance();
                    }}
                    onToggleAutoAdvance={setIsAutoAdvancing}
                    showArrows={false}
                  />
                </div>
              </>
            )}
          </div>

          {content.showQuickSearch && (
            <div className={styles.searchFormContainer}>
              <QuickSearchForm institutionSlug={institutionSlug} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  const { institutionId } = useCurrentInstitution();

  return <HeroContent institutionSlug={institutionId} />;
}
