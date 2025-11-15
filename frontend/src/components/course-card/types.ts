import { CourseData } from '@/types/courses';

export type CourseCardProps = {
  course: CourseData;
  onClick?: (slug: string) => void;
};
