import { Container, View } from 'reshaped';
import { Breadcrumb } from '@/components/breadcrumb';
import { CourseDetailsContent } from './course-details-content';
import { CourseDetailsSkeleton } from './course-details-skeleton';
import { useCourseDetails } from './hooks/useCourseDetails';
import styles from './styles.module.scss';

export type CourseDetailsPageProps = {
  institution: string;
  courseSlug: string;
};

export function CourseDetailsPage({
  institution,
  courseSlug,
}: CourseDetailsPageProps) {
  const { data: course, isLoading, error } = useCourseDetails(courseSlug);

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

  const breadcrumbItems = [
    { label: 'Início', href: `/${institution}` },
    { label: 'Cursos', href: `/${institution}/cursos` },
    { label: course.name },
  ];

  return (
    <View className={styles.page}>
      <Container>
        <Breadcrumb items={breadcrumbItems} />
        <CourseDetailsContent course={course} institution={institution} />
      </Container>
    </View>
  );
}
