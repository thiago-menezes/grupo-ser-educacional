import { useQuery } from '@tanstack/react-query';
import { getMockCourseDetails } from '../mock';
import { CourseDetails } from '../types';

async function fetchCourseDetails(slug: string): Promise<CourseDetails> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getMockCourseDetails(slug);
}

export function useQueryCourseDetails(slug: string) {
  return useQuery({
    queryKey: ['course-details', slug],
    queryFn: () => fetchCourseDetails(slug),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
