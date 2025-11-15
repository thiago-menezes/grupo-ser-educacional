import type { SeoQueryParams } from './types';
import type { StrapiClient } from '../../services/strapi';

/**
 * Handle SEO data request
 */
export async function handleSeo(
  strapiClient: StrapiClient,
  params: SeoQueryParams,
) {
  const data = await strapiClient.fetch(
    'seos',
    {
      filters: {
        instituicao: {
          slug: { $eq: params.institutionSlug },
        },
      },
      populate: 'instituicao',
    },
    params.noCache,
  );

  return data;
}

