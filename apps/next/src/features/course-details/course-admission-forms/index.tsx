import { Text, View } from 'reshaped';
import styles from './styles.module.scss';

const ADMISSION_FORMS = [
  {
    id: 'vestibular',
    title: 'Vestibular',
    description: 'Faça seu vestibular online',
  },
  {
    id: 'enem',
    title: 'ENEM',
    description: 'Utilize notas do ENEM dos últimos 5 anos',
  },
  {
    id: 'transferencia',
    title: 'Transferência',
    description: 'Transfira seu curso de outra instituição',
  },
  {
    id: 'diploma',
    title: 'Outro diploma',
    description: 'Utilize seu diploma para ingressar',
  },
] as const;

export type AdmissionFormId = (typeof ADMISSION_FORMS)[number]['id'];

export type CourseAdmissionFormsProps = {
  selectedFormId?: string | null;
  onSelectForm: (formId: string) => void;
};

export function CourseAdmissionForms({
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
        {ADMISSION_FORMS.map((form) => {
          const isSelected = selectedFormId === form.id;
          return (
            <button
              key={form.id}
              type="button"
              className={`${styles.formCard} ${
                isSelected ? styles.selected : ''
              }`}
              aria-label={`${form.title}: ${form.description}`}
              aria-pressed={isSelected}
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
