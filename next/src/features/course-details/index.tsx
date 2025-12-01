import { useParams } from 'next/navigation';
import { Container, View } from 'reshaped';
import { useQueryCourseDetails } from './api/query';
import { CourseDetailsContent } from './course-details-content';
import { CourseDetailsSkeleton } from './course-details-skeleton';
import styles from './styles.module.scss';

export type CourseDetailsPageParams = {
  institution: string;
  slug: string;
};

export function CourseDetailsPage() {
  const { slug } = useParams<CourseDetailsPageParams>();

  const { data: course, isLoading, error } = useQueryCourseDetails(slug);

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
