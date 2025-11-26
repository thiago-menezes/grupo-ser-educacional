import { useState } from 'react';
import { View } from 'reshaped';
import { InfrastructureSection } from '@/features';
import { CourseAbout } from '../course-about';
import { CourseAdmissionForms } from '../course-admission-forms';
import { CourseCoordination } from '../course-coordination';
import { CourseEnrollmentSidebar } from '../course-enrollment-sidebar';
import { CourseImage } from '../course-image';
import { CourseInfo } from '../course-info';
import { CourseJobMarketSection } from '../course-job-market-section';
import { CourseModalitySelector } from '../course-modality-selector';
import { CourseRelatedCarousel } from '../course-related-carousel';
import { CourseSalarySection } from '../course-salary-section';
import { CurriculumGridModal } from '../curriculum-grid-modal';
import type { CourseDetails } from '../hooks/useCourseDetails';
import styles from './styles.module.scss';

export type CourseDetailsContentProps = {
  course: CourseDetails;
  institution: string;
};

export function CourseDetailsContent({
  course,
  institution,
}: CourseDetailsContentProps) {
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);
  const [selectedModalityId, setSelectedModalityId] = useState<number | null>(
    course.modalities[0]?.id || null,
  );

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
          <CourseRelatedCarousel
            institution={institution}
            currentCourseSlug={course.slug}
          />
        </View>

        <CourseEnrollmentSidebar
          course={course}
          selectedModalityId={selectedModalityId}
        />
      </div>

      <CurriculumGridModal
        isOpen={isCurriculumModalOpen}
        onClose={() => setIsCurriculumModalOpen(false)}
        course={course}
      />
    </View>
  );
}
