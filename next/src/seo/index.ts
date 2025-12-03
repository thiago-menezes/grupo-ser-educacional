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

  const icons = {
    icon: `/favicons/${institution}.ico`,
  };

  // Default metadata as fallback
  const defaultMetadata: Metadata = {
    title: 'Grupo SER - Portal Institucional',
    description: 'Portal multi-institucional do Grupo SER Educacional',
    icons,
  };

  try {
    console.log(`SEO: Fetching metadata for ${institution}...`);
    const startTime = Date.now();

    const seoData = getSeoFromStrapi(institution);

    const elapsed = Date.now() - startTime;
    console.log(`SEO: Fetch completed in ${elapsed}ms`);

    if (!seoData) {
      console.log(
        'SEO: Using default metadata - no data for institution:',
        institution,
      );
      return defaultMetadata;
    }

    // Handle nested structure: metadata.metadata or metadata
    const metadata =
      (seoData as { metadata?: { metadata?: Metadata } })?.metadata?.metadata ||
      ((await seoData) as StrapiSeo)?.metadata;

    if (!metadata) {
      console.log(
        'SEO: Using default metadata - no metadata in response for institution:',
        institution,
      );
      return defaultMetadata;
    }

    console.log(
      'SEO: Successfully loaded metadata for institution:',
      institution,
    );
    return {
      ...(metadata as Metadata),
      icons,
    };
  } catch (error) {
    console.error('SEO: Error fetching metadata, using default:', error);
    return defaultMetadata;
  }
}
