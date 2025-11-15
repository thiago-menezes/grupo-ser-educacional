'use client';

import { Button, TextField, View } from 'reshaped';
import { formatPrice } from '@/utils/format-price';
import type { CourseDetails } from '../hooks/useCourseDetails';
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
          <h3 className={styles.title}>
            Processo seletivo 2026.1 - Comece em Fevereiro
          </h3>
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
            placeholder="Telefone"
            className={styles.field}
          />
        </View>

        {minPrice && (
          <View className={styles.priceSection}>
            <p className={styles.priceLabel}>A partir de:</p>
            <View className={styles.priceRow}>
              <span className={styles.price}>{formatPrice(minPrice)}</span>
              <span className={styles.priceNote}>| Mensais</span>
            </View>
          </View>
        )}

        <Button color="primary" fullWidth className={styles.submitButton}>
          Inscrever-se
        </Button>
      </View>
    </View>
  );
}
