import type { CourseCardData } from '@/components/course-card';

export type LocationData = {
  city: string;
  state: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
};

export type GeoCoursesData = {
  title: string;
  description: string;
  location: LocationData;
  courses: CourseCardData[];
};

export type GeoCourseSectionProps = {
  data?: GeoCoursesData;
  isLoading?: boolean;
  error?: string | null;
  city?: string;
  state?: string;
};
