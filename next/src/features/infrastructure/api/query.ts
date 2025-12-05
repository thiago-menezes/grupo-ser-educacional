import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { query } from '@/libs';
import type { ClientUnitsResponse, StrapiUnitsResponse } from './types';

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

/**
 * Query hook for fetching units from client API
 */
export const useQueryClientUnits = (
  institution: string | undefined,
  state: string | undefined,
  city: string | undefined,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['client-api', 'units', institution, state, city],
    queryFn: () =>
      query<ClientUnitsResponse>('/units/client', {
        institution,
        state,
        city,
      }),
    enabled: enabled && !!institution && !!state && !!city,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};
