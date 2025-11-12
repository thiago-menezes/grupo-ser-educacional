import { Metadata } from 'next';
import { headers } from 'next/headers';
import { getSeoFromStrapi } from './api';
import { StrapiSeo } from './types';

export async function generateJsonLd(
  institutionSlug: string,
): Promise<StrapiSeo['jsonld'] | undefined> {
  if (!institutionSlug) return undefined;

  const seoData = await getSeoFromStrapi(institutionSlug);

  return seoData?.jsonld as StrapiSeo['jsonld'];
}

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const referer = headersList.get('referer');
  const institution = referer?.split(`${process.env.APP_BASE_URL}/`)[1];

  const seoData = await getSeoFromStrapi(institution || '');

  return seoData?.metadata as Metadata;
}
