import { useQuery } from '@tanstack/react-query';
import { getMockCourseDetails } from '../mock';

export type CourseDetails = {
  id: number;
  name: string;
  slug: string;
  description: string;
  type: string;
  workload: number | null;
  category: {
    id: number;
    name: string;
  };
  duration: string;
  priceFrom: string | null;
  modalities: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  units: Array<{
    id: number;
    name: string;
    city: string;
    state: string;
    address?: string;
  }>;
  offerings: Array<{
    id: number;
    unitId: number;
    modalityId: number;
    periodId: number;
    price: number | null;
    duration: string;
    enrollmentOpen: boolean;
    unit: {
      id: number;
      name: string;
      city: string;
      state: string;
    };
    modality: {
      id: number;
      name: string;
      slug: string;
    };
    period: {
      id: number;
      name: string;
    };
  }>;
};

async function fetchCourseDetails(slug: string): Promise<CourseDetails> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getMockCourseDetails(slug);
}

export function useCourseDetails(slug: string) {
  return useQuery({
    queryKey: ['course-details', slug],
    queryFn: () => fetchCourseDetails(slug),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
