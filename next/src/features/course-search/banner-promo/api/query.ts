import { useQuery } from '@tanstack/react-query';
import type {
  SearchBannerPromosResponseDTO,
  UseSearchBannerPromosParams,
} from './types';

const SEARCH_BANNER_PROMOS_QUERY_KEY = 'search-banner-promos';

const getSearchBannerPromos = async (
  institutionSlug: string,
): Promise<SearchBannerPromosResponseDTO> => {
  const url = new URL('/api/search-banner-promos', window.location.origin);
  url.searchParams.set('institutionSlug', institutionSlug);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error('Failed to fetch search banner promos');
  }

  return response.json();
};

export function useQuerySearchBannerPromos({
  institutionSlug,
  enabled = true,
}: UseSearchBannerPromosParams) {
  return useQuery({
    queryKey: [SEARCH_BANNER_PROMOS_QUERY_KEY, institutionSlug],
    queryFn: () => getSearchBannerPromos(institutionSlug),
    enabled: enabled && !!institutionSlug,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
