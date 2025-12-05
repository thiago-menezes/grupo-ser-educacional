import { NextRequest, NextResponse } from 'next/server';
import { fetchCityCourses } from '@/packages/bff/handlers/courses/client-handler';
import { getClientApiClient } from '../../services/bff';

/**
 * GET /api/cursos/cidade
 * Fetch courses for a city by fetching units first, then courses for each unit
 *
 * Query params:
 * - institution: Institution slug (e.g., "unama") [required]
 * - estado: State abbreviation (e.g., "pa") [required]
 * - cidade: City name (e.g., "ananindeua") [required]
 * - modalities: Array of modality filters (e.g., ["presencial", "ead"])
 * - shifts: Array of shift filters (e.g., ["morning", "night"])
 * - durations: Array of duration ranges (e.g., ["1-2", "4-plus"])
 * - courseName: Course name search term
 * - page: Page number (default: 1)
 * - perPage: Items per page (default: 12)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const institution = searchParams.get('institution');
  const estado = searchParams.get('estado');
  const cidade = searchParams.get('cidade');

  // Validate required parameters
  if (!institution) {
    return NextResponse.json(
      { error: 'institution query parameter is required' },
      { status: 400 },
    );
  }

  if (!estado) {
    return NextResponse.json(
      { error: 'estado query parameter is required' },
      { status: 400 },
    );
  }

  if (!cidade) {
    return NextResponse.json(
      { error: 'cidade query parameter is required' },
      { status: 400 },
    );
  }

  try {
    // Parse optional parameters
    const modalities = searchParams.getAll('modalities');
    const shifts = searchParams.getAll('shifts');
    const durations = searchParams.getAll('durations');
    const courseName = searchParams.get('courseName') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = parseInt(searchParams.get('perPage') || '12', 10);

    const clientApiClient = getClientApiClient();
    const data = await fetchCityCourses(clientApiClient, {
      institution,
      estado,
      cidade,
      modalities: modalities.length > 0 ? modalities : undefined,
      shifts: shifts.length > 0 ? shifts : undefined,
      durations: durations.length > 0 ? durations : undefined,
      courseName,
      page,
      perPage,
    });

    return NextResponse.json(data, {
      headers: {
        // Cache for 5 minutes, stale-while-revalidate for 6 hours
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=21600',
      },
    });
  } catch (error) {
    const statusCode =
      error instanceof Error && error.message.includes('not found') ? 404 : 500;

    return NextResponse.json(
      {
        error: 'Failed to fetch courses for city',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: statusCode },
    );
  }
}
