import { Metadata } from 'next';
import { query } from '../api/strapi';
import type { StrapiSeo, StrapiSeoResponse } from './types';

export async function getSeoFromStrapi(
  institutionSlug: string,
): Promise<StrapiSeoResponse['data'][0] | null> {
  try {
    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

    if (!STRAPI_URL) {
      console.warn('NEXT_PUBLIC_STRAPI_URL is not defined');
      return null;
    }

    // Use fetch directly for ISR support
    const response = await query<StrapiSeoResponse>(
      `${STRAPI_URL}/api/seos?filters[instituicao][slug][$eq]=${institutionSlug}&populate=instituicao`,
      {
        next: { revalidate: 3600 }, // ISR - revalida a cada hora
      },
    );

    if (!response.data) {
      return {
        metadata: {
          title: 'Grupo SER - Portal Institucional',
          description: 'Portal multi-institucional do Grupo SER Educacional',
        } as Metadata,
        jsonld: {} as StrapiSeo['jsonld'],
      } as StrapiSeo;
    }

    return response.data?.[0] || null;
  } catch (error) {
    console.warn(`Failed to fetch SEO data for ${institutionSlug}:`, error);
    return {
      metadata: {
        title: 'Grupo SER - Portal Institucional',
        description: 'Portal multi-institucional do Grupo SER Educacional',
      } as Metadata,
      jsonld: {} as StrapiSeo['jsonld'],
    } as StrapiSeo;
  }
}
