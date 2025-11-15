import { useMemo } from 'react';
import { useCurrentInstitution } from '../../../hooks';
import { useHeroContent } from './api/query';
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

  const content = useMemo(
    () => heroContent || DEFAULT_HERO_CONTENT,
    [heroContent],
  );

  const { currentSlide, nextSlide, previousSlide, setIsAutoAdvancing } =
    useHeroCarousel();

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.heroSection}>
          <div className={styles.heroCard}>
            <HeroBanner
              imageUrl={content.backgroundImage?.url || '/placeholder-hero.jpg'}
              imageUrlMobile={content.backgroundImageMobile?.url}
              imageAlt={content.backgroundImage?.alternativeText}
            />

            {content.showCarouselControls && (
              <CarouselControls
                currentSlide={currentSlide}
                totalSlides={1}
                onPrevious={previousSlide}
                onNext={nextSlide}
                onToggleAutoAdvance={setIsAutoAdvancing}
              />
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
