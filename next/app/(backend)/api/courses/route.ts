import { NextRequest, NextResponse } from 'next/server';
import {
  handleCoursesList,
  parseCoursesQueryParams,
} from '@/packages/bff/handlers';
import { BffValidationError } from '@/packages/bff/utils/errors';

export async function GET(request: NextRequest) {
  try {
    const params = parseCoursesQueryParams(request.nextUrl.searchParams);
    const response = handleCoursesList(params);
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof BffValidationError) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: error.statusCode },
      );
    }

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
