import { NextRequest, NextResponse } from 'next/server';
import { getStrapiClient } from '../../services/bff';
import { handleCourseDetailsFromStrapi } from '@/packages/bff/handlers/courses';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    const { sku } = await params;
    const { searchParams } = new URL(request.url);

    // Extract query params (optional, for context/filtering)
    const instituicao = searchParams.get('instituicao');
    const estado = searchParams.get('estado');
    const cidade = searchParams.get('cidade');
    const idDaUnidade = searchParams.get('idDaUnidade');

    console.log('[API] Fetching course details:', {
      sku,
      instituicao,
      estado,
      cidade,
      idDaUnidade,
    });

    // Get Strapi client
    const strapiClient = getStrapiClient();

    // Fetch course details from Strapi
    const courseDetails = await handleCourseDetailsFromStrapi(strapiClient, {
      courseSku: sku,
    });

    // Return course details with cache headers
    return NextResponse.json(courseDetails, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('[API] Error fetching course details:', error);

    // Determine error type and status code
    const statusCode =
      error instanceof Error && error.message.includes('not found') ? 404 : 500;

    const { sku } = await params;

    return NextResponse.json(
      {
        error: 'Failed to fetch course details',
        message: error instanceof Error ? error.message : 'Unknown error',
        sku,
      },
      { status: statusCode }
    );
  }
}
