import { NextRequest, NextResponse } from 'next/server';
import { handleCourseDetails } from '@/packages/bff/handlers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const response = handleCourseDetails(slug);
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
