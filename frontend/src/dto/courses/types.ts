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

export type CoursesResponseDTO = {
  institution: string;
  state: string;
  city: string;
  total: number;
  currentPage: number;
  totalPages: number;
  perPage: number;
  courses: CourseData[];
};
