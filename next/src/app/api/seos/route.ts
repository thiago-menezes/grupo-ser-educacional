import { NextRequest, NextResponse } from 'next/server';
import type { StrapiSeoResponse } from '@/libs/seo/types';
import { fetchFromStrapi } from '../services/strapi';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const institutionSlug = searchParams.get('institutionSlug');
  const noCache = searchParams.get('noCache') === 'true';

  if (!institutionSlug) {
    return NextResponse.json(
      { error: 'institutionSlug query parameter is required' },
      { status: 400 },
    );
  }

  try {
    console.log('[SEO Route] Fetching SEO for institution:', institutionSlug);
    const data = await fetchFromStrapi<StrapiSeoResponse>(
      'seos',
      {
        filters: {
          instituicao: {
            slug: { $eq: institutionSlug },
          },
        },
        populate: 'instituicao',
      },
      noCache,
    );

    console.log('[SEO Route] Received data:', JSON.stringify(data, null, 2));

    // In development, use shorter cache or no cache
    const cacheControl =
      process.env.NODE_ENV === 'development' || noCache
        ? 'no-store, no-cache, must-revalidate, proxy-revalidate'
        : 'public, s-maxage=3600, stale-while-revalidate=86400';

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': cacheControl,
        'X-Cache-Status': noCache ? 'bypassed' : 'cached',
      },
    });
  } catch (error) {
    console.error('Error fetching SEO from Strapi:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch SEO data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
