export type CourseModality = 'presencial' | 'semipresencial' | 'ead';

export type CourseData = {
  id: string;
  category: string;
  title: string;
  degree: string;
  duration: string;
  modalities: CourseModality[];
  priceFrom: string;
  campusName: string;
  campusCity: string;
  campusState: string;
  slug: string;
};

/**
 * Response from BFF /api/courses endpoint
 * This is the single source of truth for the API response format
 * The BFF transforms data to this format before returning to frontend
 */
export type CoursesResponse = {
  total: number;
  currentPage: number;
  totalPages: number;
  perPage: number;
  courses: CourseData[];
};
