import Link from 'next/link';
import { Button } from 'reshaped';
import { useCurrentInstitution } from '@/hooks/useInstitution';
import { Icon } from '../icon';
import { MODALITY_LABELS } from './constants';
import styles from './styles.module.scss';
import type { CourseCardProps } from './types';

export function CourseCard({ course }: CourseCardProps) {
  const { institutionSlug } = useCurrentInstitution();

  // Build course URL with actual course data
  const city = course.campusCity.toLowerCase().replace(/\s+/g, '-');
  const state = course.campusState.toLowerCase();
  const sku = course.sku || '';
  const unitId = course.unitId || '';
  const courseUrl = `/${institutionSlug}/cursos/detalhes?city=${city}&state=${state}&sku=${sku}&unit=${unitId}`;

  return (
    <Link href={courseUrl} className={styles.card} role="article">
      <div className={styles.header}>
        <div className={styles.title}>{course.title}</div>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <Icon name="school" size={12} aria-hidden="true" />
            <span>{course.degree}</span>
          </div>
          <div className={styles.metaItem}>
            <Icon name="clock" size={12} aria-hidden="true" />
            <span>{course.duration}</span>
          </div>
        </div>
      </div>

      <div className={styles.modalities}>
        <div className={styles.modalitiesLabel}>Modalidade:</div>
        <div className={styles.modalitiesList}>
          {course.modalities.map((modality) => (
            <span key={modality} className={styles.badge}>
              {MODALITY_LABELS[modality]}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.priceSection}>
        <div className={styles.priceLabel}>A partir de:</div>
        <div className={styles.price}>{course.priceFrom}</div>
      </div>

      <div className={styles.locationWrapper}>
        <div className={styles.location}>
          <span className={styles.campusName}>{course.campusName}</span>
          <span className={styles.campusCity}>
            {course.campusCity} - {course.campusState}
          </span>
        </div>
      </div>

      <Button
        color="primary"
        fullWidth
        aria-label={`Saiba mais sobre ${course.title}`}
      >
        Mais sobre o curso
      </Button>
    </Link>
  );
}
