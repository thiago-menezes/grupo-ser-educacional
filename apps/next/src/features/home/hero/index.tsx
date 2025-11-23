import { useMemo } from 'react';
import { Button } from 'reshaped';
import { Icon } from '@/components';
import { useCurrentInstitution } from '@/hooks';
import { useHeroContent, useHomeCarousel } from './api/query';
import { CarouselControls } from './carousel-controls';
import { DEFAULT_HERO_CONTENT } from './constants';
import { HeroBanner } from './hero-banner';
import { useHeroCarousel } from './hooks';
import { QuickSearchForm } from './quick-search-form';
import styles from './styles.module.scss';

export type HomeHeroProps = {
  institutionSlug: string;
  showPlaceholder?: boolean;
};

function HeroContent({ institutionSlug }: HomeHeroProps) {
  const { data: heroContent } = useHeroContent(institutionSlug);
  const { data: carouselItems = [] } = useHomeCarousel(institutionSlug);

  const content = useMemo(
    () => heroContent || DEFAULT_HERO_CONTENT,
    [heroContent],
  );

  // Use carousel if items exist, otherwise use single image
  const totalSlides = carouselItems.length > 0 ? carouselItems.length : 1;
  const {
    currentSlide,
    nextSlide,
    previousSlide,
    goToSlide,
    setIsAutoAdvancing,
  } = useHeroCarousel(totalSlides);

  // Transform carousel items to match HeroBanner props
  const carouselItemsFormatted = useMemo(() => {
    if (carouselItems.length === 0) {
      return undefined;
    }
    return carouselItems.map((item) => ({
      desktopImage: item.desktopImage,
      mobileImage: item.mobileImage,
      alt: item.alt,
    }));
  }, [carouselItems]);

  // Fallback to single image if no carousel items
  const fallbackImageUrl =
    carouselItems.length === 0
      ? content.backgroundImage?.url || '/placeholder-hero.jpg'
      : undefined;
  const fallbackImageUrlMobile =
    carouselItems.length === 0 ? content.backgroundImageMobile?.url : undefined;
  const fallbackImageAlt =
    carouselItems.length === 0
      ? content.backgroundImage?.alternativeText
      : undefined;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.heroSection}>
          <div className={styles.heroCard}>
            <HeroBanner
              carouselItems={carouselItemsFormatted}
              currentSlide={currentSlide}
              imageUrl={fallbackImageUrl}
              imageUrlMobile={fallbackImageUrlMobile}
              imageAlt={fallbackImageAlt}
            />

            {content.showCarouselControls && (
              <>
                <div className={styles.carouselControlsWrapper}>
                  <Button
                    className={styles.carouselLeftButton}
                    onClick={() => {
                      previousSlide();
                      setIsAutoAdvancing(false);
                    }}
                    aria-label="Previous slide"
                    icon={<Icon name="chevron-left" />}
                  />
                  <Button
                    className={styles.carouselRightButton}
                    onClick={() => {
                      nextSlide();
                      setIsAutoAdvancing(false);
                    }}
                    aria-label="Next slide"
                    icon={<Icon name="chevron-right" />}
                  />
                </div>

                <div className={styles.carouselIndicators}>
                  <CarouselControls
                    currentSlide={currentSlide}
                    totalSlides={totalSlides}
                    onPrevious={previousSlide}
                    onNext={nextSlide}
                    onGoToSlide={goToSlide}
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
