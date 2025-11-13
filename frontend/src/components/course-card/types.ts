import { CourseData } from '@/features/course-search/course-grid/api/types';

export type CourseCardProps = {
  course: CourseData;
  onClick?: (slug: string) => void;
};
