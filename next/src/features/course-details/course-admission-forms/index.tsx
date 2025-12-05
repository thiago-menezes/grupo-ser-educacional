import { Text, View } from 'reshaped';
import type { FormasIngresso } from '@/features/course-details/types';
import styles from './styles.module.scss';
import type { CourseAdmissionFormsProps, AdmissionForm } from './types';

export function CourseAdmissionForms({
  availableForms,
  selectedFormId,
  onSelectForm,
}: CourseAdmissionFormsProps) {
  // If we have Client API data, use it instead of static forms
  if (
    availableForms &&
    Array.isArray(availableForms) &&
    availableForms.length > 0
  ) {
    const isClientApiForm = availableForms[0] && 'ID' in availableForms[0];

    if (isClientApiForm) {
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
            {(availableForms as FormasIngresso[]).map((form) => {
              const isSelected = selectedFormId === form.Codigo;
              return (
                <button
                  key={form.ID}
                  type="button"
                  className={`${styles.formCard} ${
                    isSelected ? styles.selected : ''
                  }`}
                  aria-label={`${form.Nome_FormaIngresso}`}
                  aria-pressed={isSelected}
                  onClick={() => onSelectForm(form.Codigo)}
                >
                  <View className={styles.formContent}>
                    <Text
                      as="h3"
                      variant="body-2"
                      weight="bold"
                      className={styles.formTitle}
                    >
                      {form.Nome_FormaIngresso}
                    </Text>
                  </View>
                </button>
              );
            })}
          </View>
        </View>
      );
    }
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
          const isStaticForm = 'id' in form;
          const formId = isStaticForm
            ? (form as AdmissionForm).id
            : (form as FormasIngresso).Codigo;
          const isSelected = selectedFormId === formId;
          const isDisabled = availableForms.length === 1;

          return (
            <button
              key={
                isStaticForm
                  ? (form as AdmissionForm).id
                  : (form as FormasIngresso).ID
              }
              type="button"
              className={`${styles.formCard} ${
                isSelected ? styles.selected : ''
              } ${isDisabled ? styles.disabled : ''}`}
              aria-label={
                isStaticForm
                  ? `${(form as AdmissionForm).title}: ${(form as AdmissionForm).description}`
                  : (form as FormasIngresso).Nome_FormaIngresso
              }
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
                  {isStaticForm
                    ? (form as AdmissionForm).title
                    : (form as FormasIngresso).Nome_FormaIngresso}
                </Text>
                {isStaticForm && (
                  <Text
                    variant="body-3"
                    color="neutral-faded"
                    className={styles.formDescription}
                  >
                    {(form as AdmissionForm).description}
                  </Text>
                )}
              </View>
            </button>
          );
        })}
      </View>
    </View>
  );
}
