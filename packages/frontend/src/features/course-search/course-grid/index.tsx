import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Pagination, View } from 'reshaped';
import {
  CourseCard,
  CourseCardSkeleton,
} from '../../../components/course-card';
import { useCurrentInstitution } from '../../../hooks/useInstitution';
import { useCourseGrid } from './hooks';
import styles from './styles.module.scss';

export function CourseGrid() {
  const router = useRouter();
  const { institutionId } = useCurrentInstitution();
  const {
    totalPages,
    isLoading,
    cardsBeforeBanner,
    cardsAfterBanner,
    handlePageChange,
    currentPage,
  } = useCourseGrid();

  const handleCourseClick = (slug: string) => {
    router.push(`/${institutionId}/cursos/${slug}`);
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
            <Image
              src="https://placehold.co/1200x200.png?text=Banner"
              alt="Banner"
              width={1200}
              height={200}
              priority
            />
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
