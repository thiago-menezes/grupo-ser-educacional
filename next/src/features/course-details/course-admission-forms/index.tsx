import { Text, View } from 'reshaped';
import { ADMISSION_FORMS } from './constants';
import styles from './styles.module.scss';
import { CourseAdmissionFormsProps } from './types';

export function CourseAdmissionForms({
  availableForms = ADMISSION_FORMS,
  selectedFormId,
  onSelectForm,
}: CourseAdmissionFormsProps) {
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
        {availableForms.map((form) => {
          const isSelected = selectedFormId === form.id;
          const isDisabled = availableForms.length === 1;
          return (
            <button
              key={form.id}
              type="button"
              className={`${styles.formCard} ${
                isSelected ? styles.selected : ''
              } ${isDisabled ? styles.disabled : ''}`}
              aria-label={`${form.title}: ${form.description}`}
              aria-pressed={isSelected}
              disabled={isDisabled}
              onClick={() => onSelectForm(form.id)}
            >
              <View className={styles.formContent}>
                <Text
                  as="h3"
                  variant="body-2"
                  weight="bold"
                  className={styles.formTitle}
                >
                  {form.title}
                </Text>
                <Text
                  variant="body-3"
                  color="neutral-faded"
                  className={styles.formDescription}
                >
                  {form.description}
                </Text>
              </View>
            </button>
          );
        })}
      </View>
    </View>
  );
}
