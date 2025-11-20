import {
  BffValidationError,
  handleAutocomplete,
  parseAutocompleteQueryParams,
} from '@grupo-ser/bff';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const params = parseAutocompleteQueryParams(request.nextUrl.searchParams);
    const response = handleAutocomplete(params);
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

    return NextResponse.json(
      {
        error: 'Failed to fetch autocomplete results',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
