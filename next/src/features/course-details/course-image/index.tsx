import Image from 'next/image';
import { View } from 'reshaped';
import { useImageFallback } from '@/features/infrastructure/utils/image-fallback';
import type { CourseDetails } from '../types';
import styles from './styles.module.scss';

export type CourseImageProps = {
  course: CourseDetails;
};

export function CourseImage({ course }: CourseImageProps) {
  // Use Strapi featuredImage if available, fallback to default
  const initialImageUrl = course.featuredImage || '/banner curso.png';
  const { src, handleError } = useImageFallback(initialImageUrl);
  const imageAlt = course.name || 'Imagem do curso';

  return (
    <View className={styles.imageContainer}>
      <Image
        src={src}
        alt={imageAlt}
        width={800}
        height={120}
        className={styles.image}
        onError={handleError}
      />
    </View>
  );
}
