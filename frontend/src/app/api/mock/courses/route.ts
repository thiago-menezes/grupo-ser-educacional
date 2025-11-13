import { NextRequest, NextResponse } from 'next/server';
import { CourseData } from '@/dto/courses/types';
import { CoursesDTO } from './types';

const BASE_URL = process.env.API_MOCK_BASE_URL;
const DEFAULT_PER_PAGE = 12;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const institution = searchParams.get('institution');
  const state = searchParams.get('state');
  const city = searchParams.get('city');
  const pageParam = searchParams.get('page');
  const perPageParam = searchParams.get('perPage');

  if (!institution || !state || !city) {
    return NextResponse.json(
      {
        error:
          'Missing required parameters: institution, state, and city are required',
      },
      { status: 400 },
    );
  }

  const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
  const perPage = perPageParam
    ? Math.max(1, Math.min(100, parseInt(perPageParam, 10)))
    : DEFAULT_PER_PAGE;

  if (!BASE_URL) {
    return NextResponse.json(
      {
        error: 'NEXT_PUBLIC_API_MOCK environment variable is not configured',
      },
      { status: 500 },
    );
  }

  try {
    const apiPath = `/p/${institution}/${state}/${city}/unidades/100/cursos`;
    const apiUrl = `${BASE_URL}${apiPath}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    const data: CoursesDTO = await response.json();

    const allCourses: CourseData[] = (data.Cursos || []).map((course) => ({
      id: course.ID,
      category: 'NAO TEMOS INFORMACAO AINDA',
      title: course.Nome_Curso || '',
      degree: 'NAO TEMOS INFORMACAO AINDA',
      duration: 'NAO TEMOS INFORMACAO AINDA',
      modalities: course.Modalidade
        ? [
            course.Modalidade.toLowerCase() as
              | 'presencial'
              | 'semipresencial'
              | 'ead',
          ]
        : [],
      priceFrom: 'NAO TEMOS INFORMACAO AINDA',
      campusName: 'NAO TEMOS INFORMACAO AINDA',
      campusCity: city,
      campusState: state,
      slug: course.ID,
    }));

    const total = allCourses.length;
    const totalPages = Math.ceil(total / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const courses = allCourses.slice(startIndex, endIndex);

    return NextResponse.json({
      institution,
      state,
      city,
      total,
      currentPage: page,
      totalPages,
      perPage,
      courses,
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch courses',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
