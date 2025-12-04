import { useState } from 'react';
import { View } from 'reshaped';
import { Breadcrumb } from '@/components';
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
import { CourseDetails } from '../types';
import { useCourseDetailsContent } from './hooks';
import styles from './styles.module.scss';

export function CourseDetailsContent({ course }: { course: CourseDetails }) {
  const {
    breadcrumbItems,
    setIsCurriculumModalOpen,
    selectedModalityId,
    selectedAdmissionFormId,
    handleModalityChange,
    handleAdmissionFormChange,
    isCurriculumModalOpen,
  } = useCourseDetailsContent(course);

  const [selectedUnitId, setSelectedUnitId] = useState<number>(
    course.offerings[0]?.unitId || course.units[0]?.id,
  );

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

  const handleUnitChange = (unitId: number) => {
    setSelectedUnitId(unitId);
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
                selectedFormId={selectedAdmissionFormId}
                onSelectForm={handleAdmissionFormChange}
              />
            </header>
            <CourseAbout description={course.description} />
            <CourseJobMarketSection />
            <CourseSalarySection />
            <CourseCoordination course={course} />
          </View>

          <CourseEnrollmentSidebar
            course={course}
            selectedModalityId={selectedModalityId}
            selectedUnitId={selectedUnitId}
            onUnitChange={handleUnitChange}
          />
        </div>

        <InfrastructureSection preselectedUnitId={selectedUnitId} />
        <GeoCoursesSection title="Encontre o seu curso e transforme sua carreira!" />

        <CurriculumGridModal
          isOpen={isCurriculumModalOpen}
          onClose={() => setIsCurriculumModalOpen(false)}
          course={course}
        />
      </View>
    </section>
  );
}
