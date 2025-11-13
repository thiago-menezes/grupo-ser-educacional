'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Pagination, View } from 'reshaped';
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
        <View gap={4} wrap direction="row" align="center" justify="center">
          {[...Array(3)].map((_, idx) => (
            <View key={idx} width="100%" maxWidth="312px">
              <CourseCardSkeleton />
            </View>
          ))}
        </View>
      ) : (
        <>
          <View gap={4} wrap direction="row" align="center" justify="center">
            {cardsBeforeBanner.map((course) => (
              <View key={course.id} width="100%" maxWidth="312px">
                <CourseCard
                  course={course}
                  onClick={(slug) => console.log('Course clicked:', slug)}
                />
              </View>
            ))}
          </View>

          <View className={styles.bannerContainer}>
            <Image
              src="https://placehold.co/1200x200.png?text=Banner"
              alt="Banner"
              width={1200}
              height={200}
              priority
            />
          </View>

          <View gap={4} wrap direction="row" align="center" justify="center">
            {cardsAfterBanner.map((course) => (
              <View key={course.id} width="100%" maxWidth="312px">
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={(slug) => console.log('Course clicked:', slug)}
                />
              </View>
            ))}
          </View>
        </>
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
