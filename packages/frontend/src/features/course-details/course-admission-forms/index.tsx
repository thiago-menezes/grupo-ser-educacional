import { View } from 'reshaped';
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
];

export function CourseAdmissionForms() {
  return (
    <View className={styles.forms}>
      <h2 className={styles.label}>Selecione sua forma de ingresso:</h2>
      <View className={styles.formsGrid}>
        {ADMISSION_FORMS.map((form) => (
          <button
            key={form.id}
            type="button"
            className={styles.formCard}
            aria-label={`${form.title}: ${form.description}`}
          >
            <View className={styles.formContent}>
              <h3 className={styles.formTitle}>{form.title}</h3>
              <p className={styles.formDescription}>{form.description}</p>
            </View>
          </button>
        ))}
      </View>
    </View>
  );
}
