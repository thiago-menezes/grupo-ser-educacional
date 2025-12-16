import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { View } from 'reshaped';
import { Breadcrumb } from '@/components';
import { InfrastructureSection } from '@/features';
import { GeoCoursesSection } from '@/features/home/geo-courses';
import { MOCK_GEO_COURSES_DATA } from '@/features/home/geo-courses/api/mocks';
import { CourseAbout } from '../course-about';
import { CourseAdmissionForms } from '../course-admission-forms';
import { CourseCoordination } from '../course-coordination';
import { CourseEnrollmentSidebar } from '../course-enrollment-sidebar';
import { CourseImage } from '../course-image';
import { CourseInfo } from '../course-info';
import { CourseJobMarketSection } from '../course-job-market-section';
import { CourseModalitySelector } from '../course-modality-selector';
import { CourseTextSection } from '../course-text-section';
import { CurriculumGridModal } from '../curriculum-grid-modal';
import type { CourseDetails } from '../types';
import { useCourseDetailsContent } from './hooks';
import styles from './styles.module.scss';

export function CourseDetailsContent({ course }: { course: CourseDetails }) {
  const searchParams = useSearchParams();
  const unitFromUrl = searchParams.get('unit');

  console.log('[CourseDetailsContent] Course data:', {
    hasMethodology: !!course.methodology,
    hasCertificate: !!course.certificate,
    methodologyLength: course.methodology?.length,
    certificateLength: course.certificate?.length,
    methodology: course.methodology?.substring(0, 100),
    certificate: course.certificate?.substring(0, 100),
  });

  const {
    breadcrumbItems,
    setIsCurriculumModalOpen,
    selectedModalityId,
    selectedAdmissionFormId,
    handleModalityChange,
    handleAdmissionFormChange,
    isCurriculumModalOpen,
    selectedTurnoId,
    // handleTurnoChange - available for future turno selector component
  } = useCourseDetailsContent(course);

  const [selectedUnitId, setSelectedUnitId] = useState<number>(() => {
    if (unitFromUrl) {
      return parseInt(unitFromUrl, 10);
    }
    return course.offerings[0]?.unitId || course.units[0]?.id;
  });

  // Get admission forms from selected turno in Client API data
  const availableAdmissionForms = useMemo(() => {
    if (!course.clientApiDetails?.Turnos?.length) return undefined;

    const selectedTurno = course.clientApiDetails.Turnos.find(
      (t) => t.ID === selectedTurnoId,
    );

    return (
      selectedTurno?.FormasIngresso ||
      course.clientApiDetails.Turnos[0]?.FormasIngresso
    );
  }, [course.clientApiDetails, selectedTurnoId]);

  const handleUnitClick = (unitId: number) => {
    setSelectedUnitId(unitId);

    // Scroll para infraestrutura
    const infraSection = document.getElementById('infrastructure-section');
    if (infraSection) {
      infraSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <section>
      <View className={styles.content}>
        <div className={styles.layout}>
          <View className={styles.mainSection}>
            <header className={styles.header}>
              <Breadcrumb items={breadcrumbItems} />
              <CourseImage course={course} />
              <CourseInfo
                course={course}
                selectedUnitId={selectedUnitId}
                onUnitClick={handleUnitClick}
                onViewCurriculum={() => setIsCurriculumModalOpen(true)}
              />
              <CourseModalitySelector
                modalities={course.modalities}
                selectedModalityId={selectedModalityId}
                onSelectModality={handleModalityChange}
              />
              <CourseAdmissionForms
                availableForms={availableAdmissionForms}
                selectedFormId={selectedAdmissionFormId}
                onSelectForm={handleAdmissionFormChange}
              />
            </header>
            {course.description && (
              <CourseAbout description={course.description} />
            )}
            {course.methodology && (
              <CourseTextSection
                title="Metodologia"
                content={course.methodology}
              />
            )}
            {course.jobMarketAreas && course.jobMarketAreas.length > 0 && (
              <CourseJobMarketSection />
            )}
            {course.certificate && (
              <CourseTextSection
                title="Certificado"
                content={course.certificate}
              />
            )}
            {(course.coordinator ||
              (course.teachers && course.teachers.length > 0) ||
              course.pedagogicalProject) && (
              <CourseCoordination
                course={course}
                selectedModalityId={selectedModalityId}
              />
            )}
          </View>

          <CourseEnrollmentSidebar
            course={course}
            selectedModalityId={selectedModalityId}
          />
        </div>

        <InfrastructureSection preselectedUnitId={selectedUnitId} />
        <GeoCoursesSection
          data={MOCK_GEO_COURSES_DATA}
          title="Encontre o seu curso e transforme sua carreira!"
        />

        <CurriculumGridModal
          isOpen={isCurriculumModalOpen}
          onClose={() => setIsCurriculumModalOpen(false)}
          course={course}
        />
      </View>
    </section>
  );
}
