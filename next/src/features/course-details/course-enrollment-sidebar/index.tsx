import { Turnstile } from '@marsidev/react-turnstile';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Text, TextField, View } from 'reshaped';
import { withMask } from 'use-mask-input';
import { useCurrentInstitution } from '@/hooks';
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
    const firstShift = course.enrollment?.shifts?.[0];
    const firstForm = firstShift?.admissionForms?.[0];
    const firstPaymentType = firstForm?.paymentTypes?.[0];
    const firstPaymentOption = firstPaymentType?.paymentOptions?.[0];

    if (firstPaymentOption?.parsed.monthlyPrice) {
      return {
        price: firstPaymentOption.parsed.monthlyPrice,
        priceFrom: firstPaymentOption.parsed.basePrice ?? undefined,
      };
    }
    return null;
  };

  const { institutionSlug } = useCurrentInstitution();

  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [firstClick, setFirstClick] = useState(false);
  const [turnstileSuccess, setTurnstileSuccess] = useState(false);
  const [formHasTouched, setFormHasTouched] = useState(false);

  const clientApiPrice = getClientApiPrice();
  const isFullNameValid = formData.name.trim().split(/\s+/).length >= 2;
  const nameError = !formData.name.trim()
    ? 'Nome é obrigatório'
    : !isFullNameValid
      ? 'Informe nome e sobrenome'
      : null;
  const isFormValid =
    !nameError && !!formData.email.trim() && !!formData.phone.trim();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!isFormValid) {
          setFormHasTouched(true);
          return;
        }
        if (!turnstileSuccess) {
          setFirstClick(true);
        } else {
          router.push(`/${institutionSlug}/pre-inscricao`);
        }
      }}
    >
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
              value={formData.name}
              onChange={({ value }) =>
                setFormData({ ...formData, name: value })
              }
              hasError={formHasTouched && !!nameError}
              inputAttributes={{
                required: true,
                pattern: '^\\s*\\S+\\s+\\S+.*$',
                title: 'Informe nome e sobrenome',
                'aria-invalid':
                  formHasTouched && !isFormValid && !formData.name,
              }}
            />

            <Text variant="caption-2" color="critical">
              {formHasTouched && nameError}
            </Text>

            <TextField
              name="email"
              placeholder="E-mail"
              className={styles.field}
              value={formData.email}
              onChange={({ value }) =>
                setFormData({ ...formData, email: value })
              }
              hasError={formHasTouched && !isFormValid && !formData.email}
              inputAttributes={{
                type: 'email',
              }}
            />

            <Text variant="caption-2" color="critical">
              {formHasTouched &&
                !isFormValid &&
                !formData.email &&
                'E-mail é obrigatório'}
            </Text>

            <TextField
              name="phone"
              placeholder="Celular"
              className={styles.field}
              value={formData.phone}
              hasError={formHasTouched && !isFormValid && !formData.phone}
              onChange={({ value }) =>
                setFormData({ ...formData, phone: value })
              }
              inputAttributes={{
                ref: withMask('(99) 99999-9999'),
                placeholder: 'Celular',
              }}
            />

            <Text variant="caption-2" color="critical">
              {formHasTouched &&
                !isFormValid &&
                !formData.phone &&
                'Celular é obrigatório'}
            </Text>
          </View>

          {(clientApiPrice || minPrice) && (
            <View className={styles.priceSection}>
              <Text variant="caption-1" className={styles.priceLabel}>
                A partir de:
              </Text>
              <View className={styles.priceRow}>
                <Text
                  variant="featured-2"
                  weight="bold"
                  className={styles.price}
                >
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

          {firstClick && (
            <Turnstile
              siteKey="1x00000000000000000000AA"
              onSuccess={() => setTurnstileSuccess(true)}
            />
          )}

          <Button
            color="primary"
            fullWidth
            type="submit"
            className={styles.submitButton}
            disabled={!turnstileSuccess && firstClick}
          >
            Inscrever-se
          </Button>
        </View>

        <CourseLocationSelector />
      </View>
    </form>
  );
}
