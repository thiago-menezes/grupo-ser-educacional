import { useQuery } from '@tanstack/react-query';
import { CoursesResponse } from 'types/api/courses';
import { useCurrentInstitution } from '@/hooks';
import { query } from '@/libs';

type CityCoursesFilters = {
  city?: string;
  modalities?: string[];
  shifts?: string[];
  durations?: string[];
  courseName?: string;
};

/**
 * Parse city param to extract city name and state
 * Format: "city:ananindeua-state:pa" → { city: "ananindeua", state: "pa" }
 */
function parseCityParam(cityParam: string): { city: string; state: string } {
  const match = cityParam.match(/city:([^-]+)-state:([^-]+)/);
  return {
    city: match?.[1] || '',
    state: match?.[2] || '',
  };
}

/**
 * Hook to fetch courses for a specific city
 * Fetches units first, then courses for all units in parallel
 */
export const useQueryCityBasedCourses = (
  filters: CityCoursesFilters,
  page: number,
  perPage: number,
) => {
  const { institutionId } = useCurrentInstitution();

  // Extract city and state from city param
  const { city, state } = filters.city
    ? parseCityParam(filters.city)
    : { city: '', state: '' };

  return useQuery({
    queryKey: [
      'courses',
      'city',
      institutionId,
      state,
      city,
      filters.modalities?.join(','),
      filters.shifts?.join(','),
      filters.durations?.join(','),
      filters.courseName,
      page,
      perPage,
    ],
    queryFn: async () => {
      const params: Record<string, string | number | string[]> = {
        institution: institutionId,
        estado: state,
        cidade: city,
        page,
        perPage,
      };

      // Add filters to params
      if (filters.modalities && filters.modalities.length > 0) {
        params.modalities = filters.modalities;
      }
      if (filters.shifts && filters.shifts.length > 0) {
        params.shifts = filters.shifts;
      }
      if (filters.durations && filters.durations.length > 0) {
        params.durations = filters.durations;
      }
      if (filters.courseName) {
        params.courseName = filters.courseName;
      }

      return query<CoursesResponse>('/cursos/cidade', params);
    },
    enabled: !!city && !!state && !!institutionId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
