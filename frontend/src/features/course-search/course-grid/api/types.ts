import { CourseData } from '@/types/courses';

export type CoursesResponse = {
  institution: string;
  state: string;
  city: string;
  total: number;
  currentPage: number;
  totalPages: number;
  perPage: number;
  courses: CourseData[];
};
