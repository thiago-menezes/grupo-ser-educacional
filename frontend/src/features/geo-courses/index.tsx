'use client';

import { useCallback, useRef } from 'react';
import { Button, Text } from 'reshaped';
import { Icon } from '@/components/icon';
import { CourseCard } from './course-card';
import { usePagination } from './hooks/usePagination';
import { MOCK_GEO_COURSES_DATA } from './mocks';
import styles from './styles.module.scss';

export function GeoCoursesSection() {
  const data = MOCK_GEO_COURSES_DATA;
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const { currentPage, totalPages, goToPage } = usePagination({
    totalItems: data.courses.length,
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
              <Icon name="map-pin" size={16} aria-hidden="true" />
              <Text as="span" variant="body-2" weight="medium">
                {data.location.city} - {data.location.state}
              </Text>
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
            {data.courses.map((course) => (
              <div key={course.id} className={styles.card} role="listitem">
                <CourseCard
                  course={course}
                  onClick={() => console.log('Curso clicado:', course.slug)}
                />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              {Array.from({ length: totalPages }).map((_, pageIndex) => (
                <button
                  key={`pagination-${pageIndex}`}
                  className={`${styles.paginationDot} ${
                    pageIndex === currentPage ? styles.active : ''
                  }`}
                  onClick={() => goToPage(pageIndex)}
                  aria-label={`Go to page ${pageIndex + 1}`}
                  aria-current={pageIndex === currentPage ? 'true' : 'false'}
                  type="button"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
