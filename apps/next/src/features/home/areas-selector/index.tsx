'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { Button } from 'reshaped';
import { Icon, Pagination } from '@/components';
import { usePagination } from '@/hooks';
import { DEFAULT_AREAS_CONTENT } from './constants';
import { useAreaSelector } from './hooks';
import styles from './styles.module.scss';
import { AreasSelectorProps } from './types';

export function AreasSelector({
  content = DEFAULT_AREAS_CONTENT,
}: AreasSelectorProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { currentPage, totalPages, goToPage, isScrollable } = usePagination({
    totalItems: content.areas.length,
    containerRef: scrollRef,
    gap: 24,
  });

  const { handleCourseClick, handleAllCourses } = useAreaSelector();

  return (
    <section className={styles.section} aria-label="Selecione áreas de estudo">
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>
            Já sabe que área seguir então busque o curso ideal
          </h2>
        </header>

        <div className={styles.carousel}>
          <div ref={scrollRef} className={styles.scrollArea} role="list">
            {content.areas.map((area) => (
              <article key={area.id} className={styles.card} role="listitem">
                <div className={styles.imageWrapper}>
                  <Image
                    src={area.imageUrl}
                    alt={`Área ${area.title}`}
                    width={290}
                    height={180}
                    loading="lazy"
                  />
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.areaTitle}>{area.title}</h3>

                  <div className={styles.courseList}>
                    {area.courses.map((course) => (
                      <button
                        key={course.id}
                        className={styles.courseButton}
                        onClick={() => handleCourseClick(area, course.slug)}
                        type="button"
                      >
                        {course.name}
                        <Icon name="chevron-right" size={16} />
                      </button>
                    ))}
                  </div>

                  <div className={styles.allCourses}>
                    <Button
                      type="button"
                      onClick={() => handleAllCourses(area.slug)}
                      variant="ghost"
                      color="primary"
                      icon={<Icon name="link" size={16} />}
                      fullWidth
                    >
                      Todos os cursos
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {isScrollable && (
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
