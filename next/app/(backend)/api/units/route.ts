import { NextRequest, NextResponse } from 'next/server';
import { handleUnits } from '@/packages/bff/handlers';
import { transformUnit } from '@/packages/bff/transformers/strapi';
import { getStrapiClient } from '../services/bff';

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
    const strapiClient = getStrapiClient();
    const strapiData = await handleUnits(strapiClient, { institutionSlug });

    // Transform Portuguese field names to English DTOs
    const transformedData = {
      data: strapiData.data.map(transformUnit),
      meta: strapiData.meta,
    };

    return NextResponse.json(transformedData, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    const statusCode =
      error instanceof Error && error.message.includes('not found') ? 404 : 500;
    return NextResponse.json(
      {
        error: 'Failed to fetch units',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: statusCode },
    );
  }
}
