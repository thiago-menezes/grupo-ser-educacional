import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, TextField, Checkbox, FormControl } from 'reshaped';
import { Icon } from '@/components/icon';
import { useQuickSearchForm } from '../hooks';
import { buildSearchParams } from '../utils';
import styles from './styles.module.scss';
import type { CourseLevel, QuickSearchFormProps } from './types';

export function QuickSearchForm({
  institutionSlug,
  onSubmit,
}: QuickSearchFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<CourseLevel>('graduation');
  const {
    city,
    setCity,
    course,
    setCourse,
    modalities,
    toggleModality,
    validateForm,
    errors,
  } = useQuickSearchForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const searchData = { city, course, modalities, courseLevel: activeTab };

      if (onSubmit) {
        onSubmit(searchData);
      }

      // Build URL and navigate
      const params = buildSearchParams(searchData);
      router.push(`/${institutionSlug}/cursos?${params.toString()}`);
    } catch (error) {
      console.error('[QuickSearchForm] Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.tabsContainer}>
        <Button
          size="large"
          variant={activeTab === 'graduation' ? 'solid' : 'ghost'}
          color={activeTab === 'graduation' ? 'primary' : undefined}
          onClick={() => setActiveTab('graduation')}
          disabled={isLoading}
          icon={<Icon name="school" />}
        >
          Graduação
        </Button>

        <Button
          size="large"
          variant={activeTab === 'postgraduate' ? 'solid' : 'ghost'}
          color={activeTab === 'postgraduate' ? 'primary' : undefined}
          onClick={() => setActiveTab('postgraduate')}
          disabled={isLoading}
          icon={<Icon name="briefcase" />}
        >
          Pós-Graduação
        </Button>
      </div>

      <div className={styles.inputsContainer}>
        <FormControl hasError={!!errors.city} disabled={isLoading}>
          <FormControl.Label>Em que cidade quer estudar?</FormControl.Label>
          <TextField
            name="city"
            placeholder="Encontre sua cidade"
            value={city}
            onChange={({ value }) => setCity(value)}
            disabled={isLoading}
            size="large"
          />
          {errors.city && <FormControl.Error>{errors.city}</FormControl.Error>}
        </FormControl>

        <FormControl hasError={!!errors.course} disabled={isLoading}>
          <FormControl.Label>Qual curso quer estudar?</FormControl.Label>
          <TextField
            name="course"
            placeholder="Encontre seu curso"
            value={course}
            onChange={({ value }) => setCourse(value)}
            disabled={isLoading}
            size="large"
          />
          {errors.course && (
            <FormControl.Error>{errors.course}</FormControl.Error>
          )}
        </FormControl>

        <Button
          type="submit"
          size="large"
          color="primary"
          disabled={isLoading}
          aria-label="Search courses"
        >
          {isLoading ? 'Buscando...' : 'Buscar'}
        </Button>
      </div>

      <div className={styles.filtersContainer}>
        <span className={styles.filtersLabel}>Modalidade:</span>
        <div className={styles.filterOptions}>
          {['Presencial', 'Semi', 'EAD'].map((modality) => (
            <Checkbox
              key={modality}
              name={`modality-${modality}`}
              checked={modalities.includes(
                modality as 'presencial' | 'semi' | 'ead',
              )}
              onChange={() =>
                toggleModality(modality as 'presencial' | 'semi' | 'ead')
              }
              disabled={isLoading}
            >
              {modality === 'semi' ? 'Semi' : modality}
            </Checkbox>
          ))}
        </div>
      </div>
    </form>
  );
}

export type { QuickSearchFormProps };
