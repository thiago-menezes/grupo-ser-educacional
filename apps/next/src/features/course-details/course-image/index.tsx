import Image from 'next/image';
import { View } from 'reshaped';
import type { CourseDetails } from '../hooks/useCourseDetails';
import styles from './styles.module.scss';

export type CourseImageProps = {
  course: CourseDetails;
};

export function CourseImage({ course }: CourseImageProps) {
  const placeholderUrl = 'https://placehold.co/800x120.png';
  const imageAlt = course.name || 'Imagem do curso';

  return (
    <View className={styles.imageContainer}>
      <Image
        src={placeholderUrl}
        alt={imageAlt}
        width={800}
        height={120}
        className={styles.image}
      />
    </View>
  );
}
