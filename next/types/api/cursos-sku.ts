import type { CourseDetails } from '@/features/course-details/types';

export type CursosSkuResponseDTO = CourseDetails;

export type CursosSkuErrorDTO = {
  error: string;
  message?: string;
  sku?: string;
};
