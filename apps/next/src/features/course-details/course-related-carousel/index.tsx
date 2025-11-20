'use client';

import { formatPrice } from '@grupo-ser/utils';
import { useState } from 'react';
import { Button, Divider, Text, View } from 'reshaped';
import { CourseCard, Icon } from '../../../components';
import { MOCK_RELATED_COURSES } from '../mock';
import styles from './styles.module.scss';

export type CourseRelatedCarouselProps = {
  institution: string;
  currentCourseSlug: string;
  location?: string;
};

export function CourseRelatedCarousel({
  institution,
  currentCourseSlug: _currentCourseSlug,
  location = 'São José dos Campos - SP',
}: CourseRelatedCarouselProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(MOCK_RELATED_COURSES.length / itemsPerPage);

  const visibleCourses = MOCK_RELATED_COURSES.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  );

  const handleCourseClick = (slug: string) => {
    window.location.href = `/${institution}/cursos/${slug}`;
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <View className={styles.section}>
      <Divider />
      <View className={styles.header}>
        <View className={styles.headerContent}>
          <Text
            as="h2"
            variant="featured-1"
            weight="bold"
            className={styles.title}
          >
            Encontre o seu curso e transforme sua carreira!
          </Text>
          <View className={styles.locationInfo}>
            <Text variant="body-3" className={styles.locationLabel}>
              Cursos perto de você
            </Text>
            <View className={styles.location}>
              <Text variant="body-3" className={styles.locationText}>
                {location}
              </Text>
              <Icon name="map-pin" size={16} className={styles.locationIcon} />
            </View>
          </View>
        </View>
        <Button variant="ghost" color="primary" onClick={() => {}}>
          Ver todos os cursos
        </Button>
      </View>

      <View className={styles.carousel}>
        <View className={styles.coursesGrid}>
          {visibleCourses.map((course) => {
            // Map modality to valid CourseModality type
            const modalityMap: Record<
              string,
              'presencial' | 'semipresencial' | 'ead'
            > = {
              presencial: 'presencial',
              semipresencial: 'semipresencial',
              ead: 'ead',
              'digital (ead)': 'ead',
              'ao vivo': 'presencial',
            };
            const modality =
              modalityMap[course.modality.toLowerCase()] || 'presencial';

            return (
              <CourseCard
                key={course.id}
                course={{
                  id: course.id.toString(),
                  category: 'Tecnologia',
                  title: course.name,
                  degree: course.type,
                  duration: course.duration,
                  modalities: [modality],
                  priceFrom: formatPrice(course.price),
                  campusName: 'Unidade Aquarius',
                  campusCity: 'São José dos Campos',
                  campusState: 'SP',
                  slug: course.slug,
                }}
                onClick={handleCourseClick}
              />
            );
          })}
        </View>

        {totalPages > 1 && (
          <View className={styles.controls}>
            <button
              type="button"
              className={styles.navButton}
              onClick={handlePrev}
              aria-label="Página anterior"
            >
              <Icon name="chevron-left" size={20} />
            </button>
            <div className={styles.progress}>
              {Array.from({ length: totalPages }).map((_, index) => {
                const isActive = index === currentPage;
                return (
                  <div
                    key={index}
                    className={`${styles.progressDot} ${
                      isActive ? styles.progressDotActive : ''
                    }`}
                    aria-label={`Página ${index + 1}`}
                  />
                );
              })}
            </div>
            <button
              type="button"
              className={styles.navButton}
              onClick={handleNext}
              aria-label="Próxima página"
            >
              <Icon name="chevron-right" size={20} />
            </button>
          </View>
        )}
      </View>
    </View>
  );
}
