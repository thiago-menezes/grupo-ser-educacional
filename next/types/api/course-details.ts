import type { CourseDetails } from '@/features/course-details/types';

export type CourseDetailsResponseDTO = CourseDetails;

export type CourseDetailsErrorDTO = {
  error: string;
  message?: string;
};
