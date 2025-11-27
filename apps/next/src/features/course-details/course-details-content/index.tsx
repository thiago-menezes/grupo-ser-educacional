import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { View } from 'reshaped';
import { InfrastructureSection } from '@/features';
import { GeoCoursesSection } from '@/features/home/geo-courses';
import { CourseAbout } from '../course-about';
import { CourseAdmissionForms } from '../course-admission-forms';
import { CourseCoordination } from '../course-coordination';
import { CourseEnrollmentSidebar } from '../course-enrollment-sidebar';
import { CourseImage } from '../course-image';
import { CourseInfo } from '../course-info';
import { CourseJobMarketSection } from '../course-job-market-section';
import { CourseModalitySelector } from '../course-modality-selector';
import { CourseSalarySection } from '../course-salary-section';
import { CurriculumGridModal } from '../curriculum-grid-modal';
import type { CourseDetails } from '../hooks/useCourseDetails';
import styles from './styles.module.scss';

export type CourseDetailsContentProps = {
  course: CourseDetails;
};

export function CourseDetailsContent({ course }: CourseDetailsContentProps) {
  const searchParams = useSearchParams();
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);
  const [selectedModalityId, setSelectedModalityId] = useState<number | null>(
    null,
  );

  // Initialize selected modality based on URL params
  useEffect(() => {
    const modalityParam = searchParams.get('modality');
    let selectedId: number | null = null;

    if (modalityParam) {
      // Find modality by slug
      const modalityBySlug = course.modalities.find(
        (m) => m.slug === modalityParam,
      );
      if (modalityBySlug) {
        selectedId = modalityBySlug.id;
      } else {
        // Try to find by ID if slug doesn't match
        const modalityById = course.modalities.find(
          (m) => m.id.toString() === modalityParam,
        );
        if (modalityById) {
          selectedId = modalityById.id;
        }
      }
    }

    if (!selectedId) {
      // Default to EAD if no valid modality in URL
      const eadModality = course.modalities.find((m) => m.slug === 'ead');
      if (eadModality) {
        selectedId = eadModality.id;
      } else {
        // Fallback to first available modality
        selectedId = course.modalities[0]?.id || null;
      }
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedModalityId(selectedId);
  }, [course.modalities, searchParams]);

  return (
    <View className={styles.content}>
      <div className={styles.layout}>
        <View className={styles.mainSection}>
          <CourseImage course={course} />
          <CourseInfo
            course={course}
            onViewCurriculum={() => setIsCurriculumModalOpen(true)}
          />
          <CourseModalitySelector
            modalities={course.modalities}
            selectedModalityId={selectedModalityId}
            onSelectModality={setSelectedModalityId}
          />
          <CourseAdmissionForms />
          <CourseAbout description={course.description} />
          <CourseJobMarketSection />
          <CourseSalarySection />
          <CourseCoordination course={course} />
          <InfrastructureSection />
        </View>

        <CourseEnrollmentSidebar
          course={course}
          selectedModalityId={selectedModalityId}
        />
      </div>

      <GeoCoursesSection />

      <CurriculumGridModal
        isOpen={isCurriculumModalOpen}
        onClose={() => setIsCurriculumModalOpen(false)}
        course={course}
      />
    </View>
  );
}
