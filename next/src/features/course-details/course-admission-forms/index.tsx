import { Text, View } from 'reshaped';
import styles from './styles.module.scss';
import type { CourseAdmissionFormsProps, AdmissionForm } from './types';

export function CourseAdmissionForms({
  availableForms,
  selectedFormId,
  onSelectForm,
}: CourseAdmissionFormsProps) {
  const dynamicForms =
    availableForms &&
    Array.isArray(availableForms) &&
    availableForms.length > 0 &&
    'code' in availableForms[0]
      ? availableForms
      : undefined;

  if (dynamicForms) {
    return (
      <View className={styles.forms}>
        <Text
          as="h2"
          variant="featured-2"
          weight="medium"
          className={styles.label}
        >
          Selecione sua forma de ingresso:
        </Text>

        <View className={styles.formsGrid}>
          {dynamicForms.map((form) => {
            const isSelected = selectedFormId === form.code;
            return (
              <button
                key={form.id}
                type="button"
                className={`${styles.formCard} ${isSelected ? styles.selected : ''}`}
                aria-label={`${form.name}`}
                aria-pressed={isSelected}
                onClick={() => onSelectForm(form.code)}
              >
                <View className={styles.formContent}>
                  <Text
                    as="h3"
                    variant="body-2"
                    weight="bold"
                    className={styles.formTitle}
                  >
                    {form.name}
                  </Text>
                </View>
              </button>
            );
          })}
        </View>
      </View>
    );
  }

  // Fallback to static forms
  return (
    <View className={styles.forms}>
      <Text
        as="h2"
        variant="featured-2"
        weight="medium"
        className={styles.label}
      >
        Selecione sua forma de ingresso:
      </Text>

      <View className={styles.formsGrid}>
        {availableForms?.map((form) => {
          const formId = (form as AdmissionForm).id;
          const isSelected = selectedFormId === formId;
          const isDisabled = availableForms.length === 1;

          return (
            <button
              key={(form as AdmissionForm).id}
              type="button"
              className={`${styles.formCard} ${
                isSelected ? styles.selected : ''
              } ${isDisabled ? styles.disabled : ''}`}
              aria-label={`${(form as AdmissionForm).title}: ${(form as AdmissionForm).description}`}
              aria-pressed={isSelected}
              disabled={isDisabled}
              onClick={() => onSelectForm(formId)}
            >
              <View className={styles.formContent}>
                <Text
                  as="h3"
                  variant="body-2"
                  weight="bold"
                  className={styles.formTitle}
                >
                  {(form as AdmissionForm).title}
                </Text>
                <Text
                  variant="body-3"
                  color="neutral-faded"
                  className={styles.formDescription}
                >
                  {(form as AdmissionForm).description}
                </Text>
              </View>
            </button>
          );
        })}
      </View>
    </View>
  );
}
