import { Metadata } from 'next';
import { getSeoFromStrapi } from './api';
import { StrapiSeo } from './types';

export async function generateJsonLd(
  institutionSlug: string,
): Promise<StrapiSeo['jsonld'] | undefined> {
  if (!institutionSlug) return undefined;

  const seoData = await getSeoFromStrapi(institutionSlug);

  return seoData?.jsonld as StrapiSeo['jsonld'];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ institution: string }>;
}): Promise<Metadata> {
  const { institution } = await params;
  const seoData = await getSeoFromStrapi(institution);
  return seoData?.metadata as Metadata;
}
