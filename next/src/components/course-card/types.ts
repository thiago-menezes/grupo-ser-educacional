import { CourseData } from 'types/api/courses';

export type CourseCardProps = {
  course: CourseData;
  onClick?: (slug: string) => void;
};
