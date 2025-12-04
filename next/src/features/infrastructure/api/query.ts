import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { query } from '@/libs';
import type { StrapiUnitsResponse } from './types';

export const useQueryInfrastructure = (enabled = true) => {
  const params = useParams<{ institution?: string }>();
  const slug = params.institution;

  return useQuery({
    queryKey: ['strapi', 'infrastructure', slug],
    queryFn: () =>
      query<StrapiUnitsResponse>('/units', {
        institutionSlug: slug,
      }),
    enabled: enabled && !!slug,
  });
};

/**
 * Query specific unit by ID with photos
 */
export const useQueryUnitById = (
  unitId: number | undefined,
  enabled = true,
) => {
  const params = useParams<{ institution?: string }>();
  const slug = params.institution;

  return useQuery({
    queryKey: ['strapi', 'unit', slug, unitId],
    queryFn: () =>
      query<StrapiUnitsResponse>('/units', {
        institutionSlug: slug,
        unitId: unitId?.toString(),
      }),
    enabled: enabled && !!slug && !!unitId,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};
