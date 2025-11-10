import type { GeoCoursesSectionDTO } from './types';

const GEO_COURSES_API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const GEO_COURSES_ENDPOINT = '/api/courses/geo';

/**
 * Fetches courses for a specific geographic location
 * @param city - City name (e.g., 'São José dos Campos')
 * @param state - State abbreviation (e.g., 'SP')
 * @returns Promise with GeoCoursesSectionDTO
 */
export async function fetchGeoCoursesSection(
  city: string,
  state: string,
): Promise<GeoCoursesSectionDTO> {
  const searchParams = new URLSearchParams({
    city,
    state,
  });

  const url = `${GEO_COURSES_API_BASE}${GEO_COURSES_ENDPOINT}?${searchParams}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch courses: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Fetches a single course by slug
 * @param slug - Course slug
 * @returns Promise with CourseDTO
 */
export async function fetchCourseBySlug(slug: string) {
  const url = `${GEO_COURSES_API_BASE}/api/courses/${slug}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch course: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export const GEO_COURSES_QUERY_KEYS = {
  all: ['geo-courses'] as const,
  lists: () => [...GEO_COURSES_QUERY_KEYS.all, 'list'] as const,
  list: (city: string, state: string) =>
    [...GEO_COURSES_QUERY_KEYS.lists(), { city, state }] as const,
  details: () => [...GEO_COURSES_QUERY_KEYS.all, 'detail'] as const,
  detail: (slug: string) =>
    [...GEO_COURSES_QUERY_KEYS.details(), slug] as const,
};
