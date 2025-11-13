'use client';

import { Grid, View } from 'reshaped';
import { CourseCard } from '@/components/course-card';
import type { CourseCardData } from '@/components/course-card';
import { MOCK_COURSE_CARDS } from './mocks';
import styles from './styles.module.scss';

export type CourseGridProps = {
  courses?: CourseCardData[];
  banner?: React.ReactNode;
};

export function CourseGrid({
  courses = MOCK_COURSE_CARDS,
  banner,
}: CourseGridProps) {
  // Insert banner after 6th card
  const cardsBeforeBanner = courses.slice(0, 6);
  const cardsAfterBanner = courses.slice(6);

  return (
    <Grid
      columns={{ s: 1, m: 2, l: 2, xl: 3 }}
      gap={4}
      className={styles.coursesGrid}
    >
      {/* First 6 course cards */}
      {cardsBeforeBanner.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onClick={(slug) => console.log('Course clicked:', slug)}
        />
      ))}

      {/* Banner Container */}
      {banner && (
        <View className={styles.bannerContainer}>
          {/* Banner content will go here */}
        </View>
      )}

      {/* Remaining course cards */}
      {cardsAfterBanner.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onClick={(slug) => console.log('Course clicked:', slug)}
        />
      ))}
    </Grid>
  );
}
