import { Button, Text, View } from 'reshaped';
import { Icon } from '@/components';
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
          <Text
            as="h1"
            variant="featured-1"
            weight="bold"
            className={styles.title}
          >
            {course.name}
          </Text>
          <View className={styles.meta}>
            <View className={styles.metaItem}>
              <Icon name="school" size={16} aria-hidden="true" />
              <Text variant="body-3">{course.type}</Text>
            </View>
            {firstOffering && (
              <View className={styles.metaItem}>
                <Icon name="clock" size={16} aria-hidden="true" />
                <Text variant="body-3">{firstOffering.duration}</Text>
              </View>
            )}
            {unit && (
              <View className={styles.metaItem}>
                <Icon name="map-pin" size={16} aria-hidden="true" />
                <Text variant="body-3">
                  {unit.city} - {unit.state}
                </Text>
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
