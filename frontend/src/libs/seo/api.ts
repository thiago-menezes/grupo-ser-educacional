import { Metadata } from 'next';
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

    const response = await fetch(
      `${STRAPI_URL}/api/seos?filters[instituicao][slug][$eq]=${institutionSlug}&populate=instituicao`,
      {
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch SEO: ${response.statusText}`);
    }

    const data: StrapiSeoResponse = await response.json();

    if (!data.data || data.data.length === 0) {
      return {
        metadata: {
          title: 'Grupo SER - Portal Institucional',
          description: 'Portal multi-institucional do Grupo SER Educacional',
        } as Metadata,
        jsonld: {} as StrapiSeo['jsonld'],
      } as StrapiSeo;
    }

    return data.data[0];
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
