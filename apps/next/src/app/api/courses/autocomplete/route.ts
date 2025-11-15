import { NextRequest, NextResponse } from 'next/server';
import { getAvailableCities, getAvailableCourses } from '@/data';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type'); // 'cities' or 'courses'
  const query = searchParams.get('q') || '';

  try {
    if (type === 'cities') {
      const cities = getAvailableCities();
      const filtered = cities.filter(
        (city) =>
          city.city.toLowerCase().includes(query.toLowerCase()) ||
          city.state.toLowerCase().includes(query.toLowerCase()),
      );

      return NextResponse.json({
        type: 'cities',
        results: filtered.map((city) => ({
          label: `${city.city} - ${city.state}`,
          value: city.city,
          city: city.city,
          state: city.state,
        })),
      });
    }

    if (type === 'courses') {
      const courses = getAvailableCourses();
      const filtered = courses.filter((course) =>
        course.name.toLowerCase().includes(query.toLowerCase()),
      );

      return NextResponse.json({
        type: 'courses',
        results: filtered.map((course) => ({
          id: course.id,
          label: course.name,
          value: course.slug,
          slug: course.slug,
          level: course.level,
          type: course.type,
        })),
      });
    }

    return NextResponse.json(
      { error: 'Invalid type. Use "cities" or "courses"' },
      { status: 400 },
    );
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
