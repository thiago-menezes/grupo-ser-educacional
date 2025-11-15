import { handleAutocomplete } from '@grupo-ser/bff';
import type { AutocompleteQueryParams } from '@grupo-ser/bff';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') as 'cities' | 'courses' | null;
  const query = searchParams.get('q') || '';

  try {
    if (!type || (type !== 'cities' && type !== 'courses')) {
      return NextResponse.json(
        { error: 'Invalid type. Use "cities" or "courses"' },
        { status: 400 },
      );
    }

    const params: AutocompleteQueryParams = {
      type,
      q: query,
    };

    const response = handleAutocomplete(params);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in autocomplete:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch autocomplete results',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
