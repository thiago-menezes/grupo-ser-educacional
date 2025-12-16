import type { CourseDetails } from '@/features/course-details/types';

export type CoursesSlugResponseDTO = CourseDetails;

export type CoursesSlugErrorDTO = {
  error: string;
  message?: string;
};

