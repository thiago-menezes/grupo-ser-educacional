import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pagination, View } from 'reshaped';
import type { CourseData } from 'types/api/courses';
import { BannerSkeleton, CourseCard, CourseCardSkeleton } from '@/components';
import { useImageFallback } from '@/features/infrastructure/utils/image-fallback';
import { useSearchBannerPromos } from '@/features/search/banner-promo/api';
import { useCurrentInstitution } from '@/hooks';
import { useCourseGrid } from './hooks';
import styles from './styles.module.scss';

export function CourseGrid() {
  const router = useRouter();
  const { institutionSlug } = useCurrentInstitution();
  const {
    totalPages,
    isLoading,
    cardsBeforeBanner,
    cardsAfterBanner,
    handlePageChange,
    currentPage,
  } = useCourseGrid();
  const { data: bannerData, isLoading: isBannerLoading } =
    useSearchBannerPromos({
      institutionSlug,
      enabled: !!institutionSlug,
    });
  const bannerItem = bannerData?.data?.[0];
  const { src: bannerSrc, handleError: handleBannerError } = useImageFallback(
    bannerItem?.imageUrl || '/banner cursos.png',
  );

  const handleCourseClick = (course: CourseData) => {
    const queryParams = new URLSearchParams();

    if (course.campusCity) {
      queryParams.set('city', course.campusCity.toLowerCase());
    }

    if (course.campusState) {
      queryParams.set('state', course.campusState.toLowerCase());
    }

    if (course.sku) {
      queryParams.set('sku', course.sku);
    }

    if (course.unitId) {
      queryParams.set('unit', course.unitId.toString());
    }

    if (course.admissionForm) {
      queryParams.set('admissionForm', course.admissionForm);
    }

    const queryString = queryParams.toString();
    const url = `/${institutionSlug}/cursos/detalhes?${queryString}`;

    router.push(url);
  };

  return (
    <div className={styles.wrapper}>
      {isLoading ? (
        <View gap={4} wrap direction="row" align="center" justify="center">
          {[...Array(3)].map((_, idx) => (
            <CourseCardSkeleton key={idx} />
          ))}
        </View>
      ) : (
        <>
          <View gap={4} wrap direction="row" align="center" justify="center">
            {cardsBeforeBanner.map((course) => (
              <CourseCard
                course={course}
                onClick={handleCourseClick}
                key={course.id}
              />
            ))}
          </View>

          <View className={styles.bannerContainer}>
            {isBannerLoading ? (
              <BannerSkeleton />
            ) : bannerItem?.link ? (
              <Link
                href={bannerItem.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={bannerSrc}
                  alt={bannerItem.imageAlt || 'Banner'}
                  onError={handleBannerError}
                  fill
                />
              </Link>
            ) : (
              <Image
                src={bannerSrc}
                alt={bannerItem?.imageAlt || 'Banner'}
                onError={handleBannerError}
                fill
              />
            )}
          </View>

          <View gap={4} wrap direction="row" align="center" justify="center">
            {cardsAfterBanner.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={handleCourseClick}
              />
            ))}
          </View>
        </>
      )}

      {totalPages > 1 && (
        <View align="center">
          <Pagination
            total={totalPages}
            previousAriaLabel="Página anterior"
            nextAriaLabel="Próxima página"
            pageAriaLabel={(args) => `Página ${args.page}`}
            onChange={(args) => handlePageChange(args.page)}
            defaultPage={currentPage}
          />
        </View>
      )}
    </div>
  );
}
