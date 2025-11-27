import { Metadata } from 'next';
import { getSeoFromStrapi } from './api';
import { StrapiSeo } from './types';

export async function generateJsonLd(
  institutionSlug: string,
): Promise<StrapiSeo['jsonld'] | undefined> {
  if (!institutionSlug) return undefined;

  try {
    const seoData = await getSeoFromStrapi(institutionSlug);

    // Handle nested structure: metadata.jsonld or jsonld
    const jsonld =
      (seoData as { metadata?: { jsonld?: StrapiSeo['jsonld'] } })?.metadata
        ?.jsonld || (seoData as StrapiSeo)?.jsonld;

    return (jsonld as StrapiSeo['jsonld']) || undefined;
  } catch {
    // Return undefined if CMS is unavailable during build
    return undefined;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ institution: string }>;
}): Promise<Metadata> {
  const { institution } = await params;

  try {
    const seoData = await getSeoFromStrapi(institution);

    if (!seoData) {
      return {
        title: 'Grupo SER - Portal Institucional',
        description: 'Portal multi-institucional do Grupo SER Educacional',
      };
    }

    // Handle nested structure: metadata.metadata or metadata
    const metadata =
      (seoData as { metadata?: { metadata?: Metadata } })?.metadata?.metadata ||
      (seoData as StrapiSeo)?.metadata;

    return (
      (metadata as Metadata) || {
        title: 'Grupo SER - Portal Institucional',
        description: 'Portal multi-institucional do Grupo SER Educacional',
      }
    );
  } catch {
    // Return default metadata if CMS is unavailable during build
    return {
      title: 'Grupo SER - Portal Institucional',
      description: 'Portal multi-institucional do Grupo SER Educacional',
    };
  }
}
