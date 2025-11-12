import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { strapiClient } from '@/libs/api/strapi';
import { MOCK_STRAPI_UNITS_RESPONSE } from './mocks';
import type { StrapiUnitsResponse } from './types';

const getInfrastructureContent = async (
  institutionSlug?: string,
): Promise<StrapiUnitsResponse> => {
  const { data } = await strapiClient.get<StrapiUnitsResponse>('/units', {
    params: {
      'filters[institution][slug][$eq]': institutionSlug,
      'filters[institution][publishedAt][$notNull]': true,
      'filters[publishedAt][$notNull]': true,
      populate: ['photos', 'institution'],
      sort: 'name:asc',
    },
  });

  if (process.env.NODE_ENV === 'development' && !data) {
    return MOCK_STRAPI_UNITS_RESPONSE;
  }

  return data;
};

export const useQueryInfrastructure = (enabled = true) => {
  const params = useParams<{ institution?: string }>();
  const slug = params.institution;

  return useQuery({
    queryKey: ['strapi', 'infrastructure', slug],
    queryFn: () => getInfrastructureContent(slug),
    enabled: enabled && !!slug,
  });
};
