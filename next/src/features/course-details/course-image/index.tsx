import { View } from 'reshaped';
import type { CourseDetails } from '../hooks/useCourseDetails';
import styles from './styles.module.scss';

export type CourseImageProps = {
  course: CourseDetails;
};

export function CourseImage({ course: _course }: CourseImageProps) {
  // Placeholder for course image - gray container as per design
  return (
    <View className={styles.imageContainer}>
      {/* TODO: Replace with actual course image when available */}
    </View>
  );
}
