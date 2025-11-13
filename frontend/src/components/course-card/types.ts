import { CourseData } from '@/dto/courses/types';

export type CourseCardProps = {
  course: CourseData;
  onClick?: (slug: string) => void;
};
