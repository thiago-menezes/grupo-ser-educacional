import { NextRequest, NextResponse } from 'next/server';
import { handleCourseDetailsFromStrapi } from '@/packages/bff/handlers/courses';
import { getStrapiClient } from '../../services/bff';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const strapiClient = getStrapiClient();
    const response = await handleCourseDetailsFromStrapi(strapiClient, {
      courseSku: slug,
      courseSlug: slug,
    });
    return NextResponse.json(response);
  } catch (error) {
    const statusCode =
      error instanceof Error && error.message.includes('not found') ? 404 : 500;
    return NextResponse.json(
      {
        error: 'Failed to fetch course',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: statusCode },
    );
  }
}
