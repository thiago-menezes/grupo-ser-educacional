import type { CourseDetails } from '@/features/course-details/types';

export type CourseBySkuResponseDTO = CourseDetails;

export type CourseBySkuErrorDTO = {
  error: string;
  message?: string;
  sku?: string;
};

