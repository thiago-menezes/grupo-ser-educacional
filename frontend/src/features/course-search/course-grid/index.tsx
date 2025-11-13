'use client';

import { Grid, View } from 'reshaped';
import styles from './styles.module.scss';

export type CourseGridProps = {
  courses?: unknown[];
  banner?: unknown;
};

// TODO: remove this once we have the actual courses
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CourseGrid({ courses = [], banner }: CourseGridProps) {
  // For now, render placeholder cards
  const placeholderCards = Array.from({ length: 12 });

  return (
    <Grid
      columns={{ s: 1, m: 2, l: 2, xl: 3 }}
      gap={4}
      className={styles.coursesGrid}
    >
      {/* First 6 course cards */}
      {placeholderCards.slice(0, 6).map((_, index) => (
        <View key={index} className={styles.courseCard}>
          {/* Course card content */}
        </View>
      ))}

      {/* Banner Container - Always render for now */}
      <View className={styles.bannerContainer}>
        {/* Banner content will go here */}
      </View>

      {/* Remaining course cards */}
      {placeholderCards.slice(6).map((_, index) => (
        <View key={`more-${index}`} className={styles.courseCard}>
          {/* Course card content */}
        </View>
      ))}
    </Grid>
  );
}
