import { handleCoursesList } from '@grupo-ser/bff';
import type { CoursesQueryParams } from '@grupo-ser/bff';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  try {
    const params: CoursesQueryParams = {
      institution: searchParams.get('institution') || undefined,
      location: searchParams.get('location') || undefined,
      page: searchParams.get('page')
        ? parseInt(searchParams.get('page')!, 10)
        : undefined,
      perPage: searchParams.get('perPage')
        ? parseInt(searchParams.get('perPage')!, 10)
        : undefined,
      modality: searchParams.get('modality')
        ? parseInt(searchParams.get('modality')!, 10)
        : undefined,
      category: searchParams.get('category')
        ? parseInt(searchParams.get('category')!, 10)
        : undefined,
      enrollmentOpen:
        searchParams.get('enrollmentOpen') !== null
          ? searchParams.get('enrollmentOpen') === 'true'
          : undefined,
      period: searchParams.get('period')
        ? parseInt(searchParams.get('period')!, 10)
        : undefined,
      priceMin: searchParams.get('priceMin')
        ? parseFloat(searchParams.get('priceMin')!)
        : undefined,
      priceMax: searchParams.get('priceMax')
        ? parseFloat(searchParams.get('priceMax')!)
        : undefined,
      durationRange: searchParams.get('durationRange') as
        | '1-2'
        | '2-3'
        | '3-4'
        | '4+'
        | undefined,
      level: searchParams.get('level') as
        | 'graduacao'
        | 'pos-graduacao'
        | undefined,
      course: searchParams.get('course') || undefined,
    };

    const response = handleCoursesList(params);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching courses:', error);
    const statusCode =
      error instanceof Error && error.message.includes('not found') ? 404 : 500;
    return NextResponse.json(
      {
        error: 'Failed to fetch courses',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: statusCode },
    );
  }
}
