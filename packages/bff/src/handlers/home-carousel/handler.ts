import type { StrapiClient } from '../../services/strapi';

import type {
  HomeCarouselQueryParams,
  StrapiHomeCarouselResponse,
} from './types';

/**
 * Handle home carousel data request
 */
export async function handleHomeCarousel(
  strapiClient: StrapiClient,
  params: HomeCarouselQueryParams,
): Promise<StrapiHomeCarouselResponse> {
  const data = await strapiClient.fetch<StrapiHomeCarouselResponse>(
    'home-carousels',
    {
      filters: {
        instituicao: {
          slug: { $eq: params.institutionSlug },
        },
      },
      populate: {
        Desktop: true,
        Mobile: true,
        instituicao: true,
      },
      sort: ['Nome:ASC'],
    },
    params.noCache,
  );

  return data;
}
