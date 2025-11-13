'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Grid, Pagination, View } from 'reshaped';
import { CourseCard, CourseCardSkeleton } from '@/components/course-card';
import { useQueryCourses } from './api/query';
import { ITEMS_PER_PAGE } from './constants';
import styles from './styles.module.scss';

export function CourseGrid() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: coursesResponse, isLoading } = useQueryCourses(
    'pe',
    'recife',
    currentPage,
    ITEMS_PER_PAGE,
  );

  const { courses = [], totalPages = 0 } = coursesResponse || {};

  const cardsBeforeBanner = courses.slice(0, 6);
  const cardsAfterBanner = courses.slice(6);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <View gap={6}>
      {isLoading ? (
        <Grid
          gap={4}
          columns={{
            xl: 'repeat(3, 1fr)',
            l: 'repeat(2, 1fr)',
            m: 'repeat(1, 1fr)',
          }}
        >
          {[...Array(3)].map((_, idx) => (
            <CourseCardSkeleton key={idx} />
          ))}
        </Grid>
      ) : (
        <Grid
          gap={4}
          columns={{
            xl: 'repeat(3, 1fr)',
            l: 'repeat(2, 1fr)',
            m: 'repeat(1, 1fr)',
          }}
        >
          {cardsBeforeBanner.map((course) => (
            <View key={course.id} align="center">
              <CourseCard
                course={course}
                onClick={(slug) => console.log('Course clicked:', slug)}
              />
            </View>
          ))}

          <View className={styles.bannerContainer}>
            <Image
              src="https://placehold.co/1200x200.png?text=Banner"
              alt="Banner"
              width={1200}
              height={200}
              priority
            />
          </View>

          {cardsAfterBanner.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onClick={(slug) => console.log('Course clicked:', slug)}
            />
          ))}
        </Grid>
      )}

      {courses.length > totalPages && (
        <View align="center">
          <Pagination
            total={totalPages}
            previousAriaLabel="Página anterior"
            nextAriaLabel="Próxima página"
            pageAriaLabel={(args) => `Página ${args.page}`}
            onChange={(args) => handlePageChange(args.page)}
            defaultPage={currentPage}
          />
        </View>
      )}
    </View>
  );
}
