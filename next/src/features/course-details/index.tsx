import { useSearchParams } from 'next/navigation';
import { Container, View } from 'reshaped';
import { useCurrentInstitution } from '@/hooks';
import { useQueryCourseDetails } from './api/query';
import { CourseDetailsContent } from './course-details-content';
import { CourseDetailsSkeleton } from './course-details-skeleton';
import styles from './styles.module.scss';

export function CourseDetailsPage() {
  const searchParams = useSearchParams();
  const { institutionSlug } = useCurrentInstitution();

  const sku = searchParams.get('sku');
  const state = searchParams.get('state');
  const city = searchParams.get('city');
  const unit = searchParams.get('unit');
  const admissionForm = searchParams.get('admissionForm');

  const {
    data: course,
    isLoading,
    error,
  } = useQueryCourseDetails({
    sku: sku || '',
    institution: institutionSlug || undefined,
    state: state || undefined,
    city: city || undefined,
    unit: unit || undefined,
    admissionForm: admissionForm || undefined,
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

  if (error || !course || !sku) {
    return (
      <View className={styles.page}>
        <Container>
          <View className={styles.error}>
            <h1>
              {!sku ? 'Parâmetro SKU não encontrado' : 'Curso não encontrado'}
            </h1>
            <p>
              {!sku
                ? 'O parâmetro SKU é obrigatório para visualizar os detalhes do curso.'
                : 'O curso que você está procurando não foi encontrado.'}
            </p>
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
