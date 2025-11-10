export { GeoCoursesSection } from './index';
export { CourseCard } from './course-card';

export type {
  GeoCourseSectionProps,
  GeoCoursesData,
  LocationData,
} from './types';
export type { CourseCardProps, CourseCardData } from './course-card/types';
export type {
  CourseDTO,
  GeoCoursesSectionDTO,
  CourseModality,
} from './api/types';

export { useGeoCourses } from './hooks';
export {
  fetchGeoCoursesSection,
  fetchCourseBySlug,
  GEO_COURSES_QUERY_KEYS,
} from './api';
export { transformCourseDTO } from './course-card/types';

export { MOCK_GEO_COURSES_DATA, MOCK_COURSES_DTO } from './mocks';
