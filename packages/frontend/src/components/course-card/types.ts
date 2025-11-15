import type { CourseData } from '@grupo-ser/types';

export type CourseCardProps = {
  course: CourseData;
  onClick?: (slug: string) => void;
};
