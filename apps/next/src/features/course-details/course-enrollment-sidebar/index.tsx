import { formatPrice } from '@grupo-ser/utils';
import { Button, Text, TextField, View } from 'reshaped';
import { CourseLocationSelector } from '../course-location-selector';
import type { CourseDetails } from '../types';
import styles from './styles.module.scss';

export type CourseEnrollmentSidebarProps = {
  course: CourseDetails;
  selectedModalityId: number | null;
};

export function CourseEnrollmentSidebar({
  course,
  selectedModalityId,
}: CourseEnrollmentSidebarProps) {
  // Get offerings for selected modality
  const modalityOfferings = course.offerings.filter(
    (o) => !selectedModalityId || o.modalityId === selectedModalityId,
  );

  // Get minimum price from available offerings
  const prices = modalityOfferings
    .map((o) => o.price)
    .filter((p): p is number => p !== null && p !== undefined);
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;

  return (
    <View className={styles.sidebar}>
      <View className={styles.card}>
        <View className={styles.header}>
          <Text
            as="h3"
            variant="body-3"
            weight="medium"
            className={styles.title}
          >
            Processo seletivo 2026.1 - Começe em Fevereiro
          </Text>
        </View>

        <View className={styles.form}>
          <TextField
            name="name"
            placeholder="Nome completo"
            className={styles.field}
          />
          <TextField
            name="email"
            placeholder="E-mail"
            className={styles.field}
          />
          <TextField
            name="phone"
            placeholder="Celular"
            className={styles.field}
          />
        </View>

        {minPrice && (
          <View className={styles.priceSection}>
            <Text variant="caption-1" className={styles.priceLabel}>
              A partir de:
            </Text>
            <View className={styles.priceRow}>
              <Text variant="featured-2" weight="bold" className={styles.price}>
                {formatPrice(minPrice)}
              </Text>
              <Text
                variant="body-3"
                color="neutral-faded"
                className={styles.priceNote}
              >
                | Mensais
              </Text>
            </View>
          </View>
        )}

        <Button color="primary" fullWidth className={styles.submitButton}>
          Inscrever-se
        </Button>
      </View>

      <CourseLocationSelector course={course} />
    </View>
  );
}
