import { Button, Text, TextField, View } from 'reshaped';
import { formatPrice } from '@/packages/utils';
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

  // Get price from Client API if available
  const getClientApiPrice = () => {
    if (course.clientApiDetails?.Turnos?.length) {
      const firstTurno = course.clientApiDetails.Turnos[0];
      if (firstTurno.FormasIngresso?.length) {
        const firstForma = firstTurno.FormasIngresso[0];
        if (firstForma.TiposPagamento?.length) {
          const firstTipo = firstForma.TiposPagamento[0];
          if (firstTipo.ValoresPagamento?.length) {
            const firstValor = firstTipo.ValoresPagamento[0];
            return {
              price: parseFloat(firstValor.Mensalidade),
              priceFrom: parseFloat(firstValor.PrecoBase),
            };
          }
        }
      }
    }
    return null;
  };

  const clientApiPrice = getClientApiPrice();

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
            Processo seletivo - Inscreva-se agora
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

        {(clientApiPrice || minPrice) && (
          <View className={styles.priceSection}>
            <Text variant="caption-1" className={styles.priceLabel}>
              A partir de:
            </Text>
            <View className={styles.priceRow}>
              <Text variant="featured-2" weight="bold" className={styles.price}>
                {formatPrice(clientApiPrice?.price || minPrice || 0)}
              </Text>
              <Text
                variant="body-3"
                color="neutral-faded"
                className={styles.priceNote}
              >
                | Mensais
              </Text>
            </View>
            {clientApiPrice?.priceFrom &&
              clientApiPrice.priceFrom !== clientApiPrice.price && (
                <Text
                  variant="caption-2"
                  color="neutral-faded"
                  className={styles.originalPrice}
                >
                  De: {formatPrice(clientApiPrice.priceFrom)}
                </Text>
              )}
          </View>
        )}

        <Button color="primary" fullWidth className={styles.submitButton}>
          Inscrever-se
        </Button>
      </View>

      <CourseLocationSelector />
    </View>
  );
}
