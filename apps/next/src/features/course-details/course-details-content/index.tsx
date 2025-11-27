import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);
  const [selectedModalityId, setSelectedModalityId] = useState<number | null>(
    null,
  );
  const [selectedAdmissionFormId, setSelectedAdmissionFormId] = useState<
    string | null
  >(null);

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

  // Initialize selected admission form from URL params
  useEffect(() => {
    const admissionFormParam = searchParams.get('admissionForm');
    if (admissionFormParam) {
      setSelectedAdmissionFormId(admissionFormParam);
    } else {
      // Default to first form if no param (will update URL when user selects)
      setSelectedAdmissionFormId('vestibular');
    }
  }, [searchParams]);

  // Handler to update modality query parameter
  const handleModalityChange = useCallback(
    (modalityId: number) => {
      setSelectedModalityId(modalityId);
      const selectedModality = course.modalities.find(
        (m) => m.id === modalityId,
      );
      if (selectedModality) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('modality', selectedModality.slug);
        router.push(`${pathname}?${params.toString()}`);
      }
    },
    [course.modalities, router, pathname, searchParams],
  );

  // Handler to update admission form query parameter
  const handleAdmissionFormChange = useCallback(
    (formId: string) => {
      setSelectedAdmissionFormId(formId);
      const params = new URLSearchParams(searchParams.toString());
      params.set('admissionForm', formId);
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <>
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
              onSelectModality={handleModalityChange}
            />
            <CourseAdmissionForms
              selectedFormId={selectedAdmissionFormId}
              onSelectForm={handleAdmissionFormChange}
            />
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
    </>
  );
}
