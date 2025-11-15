import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { query } from '@/libs/api/axios';
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
