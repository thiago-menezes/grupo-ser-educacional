import { useParams, useSearchParams } from 'next/navigation';
import { Container, View } from 'reshaped';
import { useQueryCourseDetails } from './api/query';
import { CourseDetailsContent } from './course-details-content';
import { CourseDetailsSkeleton } from './course-details-skeleton';
import styles from './styles.module.scss';

export type CourseDetailsPageParams = {
  sku: string;
};

export function CourseDetailsPage() {
  const params = useParams<CourseDetailsPageParams>();
  const searchParams = useSearchParams();

  const { data: course, isLoading, error } = useQueryCourseDetails({
    sku: params.sku,
    instituicao: searchParams.get('instituicao') || undefined,
    estado: searchParams.get('estado') || undefined,
    cidade: searchParams.get('cidade') || undefined,
    idDaUnidade: searchParams.get('idDaUnidade') || undefined,
  });

  if (isLoading) {
    return (
      <View className={styles.page}>
        <Container>
          <CourseDetailsSkeleton />
        </Container>
      </View>
    );
  }

  if (error || !course) {
    return (
      <View className={styles.page}>
        <Container>
          <View className={styles.error}>
            <h1>Curso não encontrado</h1>
            <p>O curso que você está procurando não foi encontrado.</p>
          </View>
        </Container>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <Container className={styles.topSection}>
        <CourseDetailsContent course={course} />
      </Container>
    </View>
  );
}
