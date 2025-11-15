'use client';

import { useCallback, useRef } from 'react';
import { Button, Text } from 'reshaped';
import { CourseCard, CourseCardSkeleton } from '@/components/course-card';
import { Icon } from '@/components/icon';
import { Pagination } from '@/components/pagination';
import { useGeolocation } from '@/hooks/useGeolocation';
import { usePagination } from '@/hooks/usePagination';
import { MOCK_GEO_COURSES_DATA } from './api/mocks';
import styles from './styles.module.scss';
import type { GeoCourseSectionProps } from './types';

export { MOCK_POPULAR_COURSES_DATA } from './api/mocks';

const SKELETON_COUNT = 4;

export function GeoCoursesSection({
  data = MOCK_GEO_COURSES_DATA,
}: Partial<GeoCourseSectionProps>) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { city, state, permissionDenied, requestPermission, isLoading } =
    useGeolocation();

  const showSkeletons = permissionDenied || isLoading;
  const coursesToShow = showSkeletons ? [] : data.courses;

  const { currentPage, totalPages, goToPage, isScrollable } = usePagination({
    totalItems: showSkeletons ? SKELETON_COUNT : coursesToShow.length,
    containerRef: scrollContainerRef as React.RefObject<HTMLDivElement>,
  });

  const handleScroll = useCallback(
    (_e: React.UIEvent<HTMLDivElement>) => {},
    [],
  );

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <Text as="h2" variant="featured-1" weight="bold">
              {data.title}
            </Text>
            <div className={styles.subtitle}>
              <Text as="span" variant="body-2">
                Cursos perto de você
              </Text>
              {permissionDenied ? (
                <Button
                  variant="ghost"
                  size="small"
                  onClick={requestPermission}
                  disabled={isLoading}
                  className={styles.locationButton}
                >
                  <Icon name="current-location" size={16} />
                  Permitir localização
                </Button>
              ) : (
                <>
                  <Text as="span" variant="body-2" weight="medium">
                    {city} - {state}
                  </Text>
                  <Icon name="current-location" size={16} aria-hidden="true" />
                </>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => console.log('Ver todos os cursos')}
            aria-label="Ver todos os cursos disponíveis"
          >
            Ver todos os cursos
          </Button>
        </div>

        <div className={styles.coursesContainer}>
          <div
            ref={scrollContainerRef}
            className={styles.coursesScroll}
            onScroll={handleScroll}
            role="list"
          >
            {showSkeletons
              ? Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className={styles.card}
                    role="listitem"
                  >
                    <CourseCardSkeleton />
                  </div>
                ))
              : coursesToShow.map((course) => (
                  <div key={course.id} className={styles.card} role="listitem">
                    <CourseCard
                      course={course}
                      onClick={() => console.log('Curso clicado:', course.slug)}
                    />
                  </div>
                ))}
          </div>

          {isScrollable && !showSkeletons && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChangeAction={goToPage}
            />
          )}
        </div>
      </div>
    </section>
  );
}
