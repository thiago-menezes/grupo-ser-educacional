import { getSeoFromStrapi } from './api';
import { StrapiSeo } from './types';

export async function generateJsonLd(
  institutionSlug: string,
): Promise<StrapiSeo['jsonld'] | undefined> {
  if (!institutionSlug) return undefined;

  const seoData = await getSeoFromStrapi(institutionSlug);

  return seoData?.jsonld as StrapiSeo['jsonld'];
}

export { getSeoFromStrapi };
