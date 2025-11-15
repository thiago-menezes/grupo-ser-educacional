import { NextRequest, NextResponse } from 'next/server';
import type { StrapiUnitsResponse } from '@/features/home/infrastructure/api/types';
import { fetchFromStrapi } from '../services/strapi';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const institutionSlug = searchParams.get('institutionSlug');

  if (!institutionSlug) {
    return NextResponse.json(
      { error: 'institutionSlug query parameter is required' },
      { status: 400 },
    );
  }

  try {
    console.log(
      '[Units Route] Fetching units for institution:',
      institutionSlug,
    );

    // First, verify the institution exists
    console.log('[Units Route] Step 1: Checking if institution exists...');
    const institutionCheck = await fetchFromStrapi<{
      data: Array<{ id: number; slug: string; name: string }>;
    }>('institutions', {
      filters: {
        slug: { $eq: institutionSlug },
      },
    });
    console.log(
      '[Units Route] Institution check result:',
      JSON.stringify(institutionCheck, null, 2),
    );

    if (!institutionCheck.data || institutionCheck.data.length === 0) {
      console.warn(
        `[Units Route] Institution with slug "${institutionSlug}" not found in Strapi`,
      );
    }

    // Check if there are ANY units at all (without filters)
    console.log('[Units Route] Step 2: Checking total units count...');
    const allUnits = await fetchFromStrapi<StrapiUnitsResponse>('units', {
      populate: ['institution'],
    });
    console.log(
      `[Units Route] Total units in Strapi: ${allUnits.data?.length || 0}`,
    );
    if (allUnits.data && allUnits.data.length > 0) {
      console.log(
        '[Units Route] Sample units:',
        allUnits.data.slice(0, 3).map((u) => ({
          id: u.id,
          name: u.name,
          institutionSlug: u.institution?.slug,
        })),
      );
    }

    // Now fetch with institution filter
    // Removed institution.publishedAt filter as it might be causing issues
    // Only filter by institution slug and unit publishedAt
    const data = await fetchFromStrapi<StrapiUnitsResponse>('units', {
      filters: {
        institution: {
          slug: { $eq: institutionSlug },
        },
        publishedAt: { $notNull: true },
      },
      populate: ['photos', 'institution'],
      sort: 'name:asc',
    });

    console.log(
      '[Units Route] Final query result:',
      JSON.stringify(data, null, 2),
    );

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching units from Strapi:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch units',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
