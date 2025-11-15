import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { publicApiClient } from '@/libs/api/axios';
import { MOCK_STRAPI_UNITS_RESPONSE } from './mocks';
import type { StrapiUnitsResponse } from './types';

const getInfrastructureContent = async (
  institutionSlug?: string,
): Promise<StrapiUnitsResponse> => {
  try {
    const { data } = await publicApiClient.get<StrapiUnitsResponse>('/units', {
      params: {
        institutionSlug,
      },
    });

    if (process.env.NODE_ENV === 'development' && !data) {
      return MOCK_STRAPI_UNITS_RESPONSE;
    }

    return data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to fetch infrastructure, using mock:', error);
      return MOCK_STRAPI_UNITS_RESPONSE;
    }
    throw error;
  }
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
