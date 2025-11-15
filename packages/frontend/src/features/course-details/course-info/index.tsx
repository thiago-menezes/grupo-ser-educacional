import { Button, View } from 'reshaped';
import { Icon } from '../../../components/icon';
import type { CourseDetails } from '../hooks/useCourseDetails';
import styles from './styles.module.scss';

export type CourseInfoProps = {
  course: CourseDetails;
  onViewCurriculum: () => void;
};

export function CourseInfo({ course, onViewCurriculum }: CourseInfoProps) {
  // Get first offering for default info
  const firstOffering = course.offerings[0];
  const unit = firstOffering?.unit || course.units[0];

  return (
    <View className={styles.info}>
      <View className={styles.header}>
        <View className={styles.titleSection}>
          <h1 className={styles.title}>{course.name}</h1>
          <View className={styles.meta}>
            <View className={styles.metaItem}>
              <Icon name="school" size={16} aria-hidden="true" />
              <span>{course.type}</span>
            </View>
            {firstOffering && (
              <View className={styles.metaItem}>
                <Icon name="clock" size={16} aria-hidden="true" />
                <span>{firstOffering.duration}</span>
              </View>
            )}
            {unit && (
              <View className={styles.metaItem}>
                <Icon name="map-pin" size={16} aria-hidden="true" />
                <span>
                  {unit.city} - {unit.state}
                </span>
              </View>
            )}
          </View>
        </View>
        <Button
          onClick={onViewCurriculum}
          variant="outline"
          className={styles.curriculumButton}
        >
          Ver grade curricular
        </Button>
      </View>
    </View>
  );
}
