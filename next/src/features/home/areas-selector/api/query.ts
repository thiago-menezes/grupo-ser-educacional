import { useQuery } from '@tanstack/react-query';
import { query } from '@/libs';
import { getMediaUrl } from '@/packages/utils';
import type { AreaCard } from '../types';
import type { AreasOfInterestResponseDTO } from './types';

const AREAS_INTERESSE_QUERY_KEY = ['home', 'areas-interesse'];

async function fetchAreasInteresse(
  institutionSlug: string,
): Promise<AreaCard[]> {
  try {
    const data = await query<AreasOfInterestResponseDTO>('/areas-of-interest', {
      institutionSlug,
    });

    if (!data.data || data.data.length === 0) {
      return [];
    }

    return data.data.map((item) => ({
      id: String(item.id),
      title: item.title,
      slug: item.slug,
      imageUrl: item.imageUrl ? getMediaUrl(item.imageUrl) : '',
      courses: item.courses.map((course) => ({
        id: course.id,
        name: course.name,
        slug: course.slug,
      })),
    }));
  } catch {
    return [];
  }
}

export function useAreasInteresse(institutionSlug: string) {
  return useQuery({
    queryKey: [...AREAS_INTERESSE_QUERY_KEY, institutionSlug],
    queryFn: () => fetchAreasInteresse(institutionSlug),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
