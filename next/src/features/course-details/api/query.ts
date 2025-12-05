import { useQuery } from '@tanstack/react-query';
import type { CourseDetails } from '../types';

export type CourseDetailsQueryParams = {
  sku: string;
  institution?: string;
  state?: string;
  city?: string;
  unit?: string;
  admissionForm?: string;
};

async function fetchCourseDetails(
  params: CourseDetailsQueryParams,
): Promise<CourseDetails> {
  const { sku, institution, state, city, unit, admissionForm } = params;

  const queryParams = new URLSearchParams();
  if (sku) queryParams.append('sku', sku);
  if (institution) queryParams.append('institution', institution);
  if (state) queryParams.append('state', state);
  if (city) queryParams.append('city', city);
  if (unit) queryParams.append('unit', unit);
  if (admissionForm) queryParams.append('admissionForm', admissionForm);

  const queryString = queryParams.toString();
  const url = `/api/cursos/detalhes?${queryString}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch course details');
  }

  return response.json();
}

export function useQueryCourseDetails(params: CourseDetailsQueryParams) {
  const { sku, institution, state, city, unit, admissionForm } = params;

  return useQuery({
    queryKey: [
      'course-details',
      sku,
      institution,
      state,
      city,
      unit,
      admissionForm,
    ],
    queryFn: () => fetchCourseDetails(params),
    enabled: !!sku,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
