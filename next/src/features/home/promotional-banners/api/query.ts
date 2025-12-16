import { useQuery } from '@tanstack/react-query';
import { query } from '@/libs';
import { getMediaUrl } from '@/packages/utils';
import type { PromotionalBanner } from '../types';
import type { PromotionalBannersResponseDTO } from './types';

const HOME_PROMO_BANNERS_QUERY_KEY = ['home', 'promo-banners'];

async function fetchPromotionalBanners(
  institutionSlug: string,
): Promise<PromotionalBanner[]> {
  try {
    const data = await query<PromotionalBannersResponseDTO>(
      '/home-promotional-banners',
      {
        institutionSlug,
      },
    );

    if (!data.data || data.data.length === 0) {
      return [];
    }

    return data.data.map((item) => ({
      id: String(item.id),
      imageUrl: item.imageUrl ? getMediaUrl(item.imageUrl) : '',
      imageAlt: item.imageAlt || undefined,
      link: item.link || null,
    }));
  } catch {
    return [];
  }
}

export function usePromotionalBanners(institutionSlug: string) {
  return useQuery({
    queryKey: [...HOME_PROMO_BANNERS_QUERY_KEY, institutionSlug],
    queryFn: () => fetchPromotionalBanners(institutionSlug),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
