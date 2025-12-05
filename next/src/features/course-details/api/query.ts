import { useQuery } from '@tanstack/react-query';
import { CourseDetails } from '../types';

export type CourseDetailsQueryParams = {
  sku: string;
  instituicao?: string;
  estado?: string;
  cidade?: string;
  idDaUnidade?: string;
};

async function fetchCourseDetails(
  params: CourseDetailsQueryParams,
): Promise<CourseDetails> {
  const { sku, instituicao, estado, cidade, idDaUnidade } = params;

  // Build query string for optional params
  const queryParams = new URLSearchParams();
  if (instituicao) queryParams.append('instituicao', instituicao);
  if (estado) queryParams.append('estado', estado);
  if (cidade) queryParams.append('cidade', cidade);
  if (idDaUnidade) queryParams.append('idDaUnidade', idDaUnidade);

  const queryString = queryParams.toString();
  const url = `/cursos/${sku}${queryString ? `?${queryString}` : ''}`;

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
  return useQuery({
    queryKey: ['course-details', params.sku],
    queryFn: () => fetchCourseDetails(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
