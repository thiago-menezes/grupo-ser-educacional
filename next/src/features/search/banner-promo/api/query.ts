import { useQuery } from '@tanstack/react-query';
import type { SearchBannerPromosResponseDTO } from './types';

const SEARCH_BANNER_PROMOS_QUERY_KEY = 'search-banner-promos';

type UseSearchBannerPromosParams = {
  institutionSlug: string;
  enabled?: boolean;
};

async function fetchSearchBannerPromos(
  institutionSlug: string,
): Promise<SearchBannerPromosResponseDTO> {
  const url = new URL('/api/search-banner-promos', window.location.origin);
  url.searchParams.set('institutionSlug', institutionSlug);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error('Failed to fetch search banner promos');
  }

  return response.json();
}

export function useSearchBannerPromos({
  institutionSlug,
  enabled = true,
}: UseSearchBannerPromosParams) {
  return useQuery({
    queryKey: [SEARCH_BANNER_PROMOS_QUERY_KEY, institutionSlug],
    queryFn: () => fetchSearchBannerPromos(institutionSlug),
    enabled: enabled && !!institutionSlug,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
