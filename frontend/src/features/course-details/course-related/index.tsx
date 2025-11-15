'use client';

import { View } from 'reshaped';
import styles from './styles.module.scss';

export type CourseRelatedProps = {
  institution: string;
  currentCourseSlug: string;
};

export function CourseRelated({
  institution: _institution,
  currentCourseSlug: _currentCourseSlug,
}: CourseRelatedProps) {
  // TODO: Implement related courses section
  // For now, returning null as mentioned by user
  return null;

  // Future implementation:
  return (
    <View className={styles.related}>
      <h2 className={styles.title}>Cursos relacionados</h2>
      {/* Course cards grid */}
    </View>
  );
}
