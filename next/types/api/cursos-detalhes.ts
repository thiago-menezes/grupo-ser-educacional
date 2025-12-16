import type { CourseDetails } from '@/features/course-details/types';

export type CursosDetalhesResponseDTO = CourseDetails;

export type CursosDetalhesErrorDTO = {
  error: string;
  message?: string;
};
