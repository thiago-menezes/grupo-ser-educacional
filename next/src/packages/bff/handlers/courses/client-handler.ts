/**
 * Client API Courses Handler
 * Orchestrates units + courses fetching with proper error handling
 */

import type { ClientApiClient } from '../../services/client-api';
import type { CoursesResponse, CourseData } from 'types/api/courses';
import { transformClientCourse } from '../../transformers/client-api';

export interface CityCoursesParams {
  institution: string;
  estado: string;
  cidade: string;
  modalities?: string[];
  shifts?: string[];
  durations?: string[];
  courseName?: string;
  page?: number;
  perPage?: number;
}

/**
 * Fetch all courses for a city by fetching units first, then courses for each unit
 */
export async function fetchCityCourses(
  clientApi: ClientApiClient,
  params: CityCoursesParams,
): Promise<CoursesResponse> {
  const { institution, estado, cidade, page = 1, perPage = 12 } = params;

  try {
    // Step 1: Fetch units for the city
    const unitsResponse = await clientApi.fetchUnits(institution, estado, cidade);

    if (!unitsResponse.Unidades || unitsResponse.Unidades.length === 0) {
      return {
        total: 0,
        currentPage: page,
        totalPages: 0,
        perPage,
        courses: [],
      };
    }

    // Step 2: Fetch courses for all units in parallel
    const coursePromises = unitsResponse.Unidades.map((unit) =>
      clientApi
        .fetchCoursesByUnit(institution, estado, cidade, unit.ID)
        .then((coursesResponse) => ({
          unit,
          courses: coursesResponse.Cursos || [],
        }))
        .catch((error) => {
          console.error(
            `Failed to fetch courses for unit ${unit.ID}:`,
            error,
          );
          return { unit, courses: [] };
        }),
    );

    const coursesResults = await Promise.all(coursePromises);

    // Step 3: Flatten all courses and transform them
    const allCoursesWithUnits = coursesResults.flatMap(({ unit, courses }) =>
      courses.map((course) => ({ course, unit })),
    );

    let transformedCourses: CourseData[] = allCoursesWithUnits.map(
      ({ course, unit }) => transformClientCourse(course, unit),
    );

    // Step 4: Apply filters
    transformedCourses = applyFilters(transformedCourses, params);

    // Step 5: Apply pagination
    const total = transformedCourses.length;
    const totalPages = Math.ceil(total / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedCourses = transformedCourses.slice(startIndex, endIndex);

    return {
      total,
      currentPage: page,
      totalPages,
      perPage,
      courses: paginatedCourses,
    };
  } catch (error) {
    console.error('Error fetching city courses:', error);
    throw error;
  }
}

/**
 * Apply filters to courses
 */
function applyFilters(
  courses: CourseData[],
  params: CityCoursesParams,
): CourseData[] {
  let filtered = courses;

  // Filter by modality
  if (params.modalities && params.modalities.length > 0) {
    filtered = filtered.filter((course) =>
      course.modalities.some((modality) =>
        params.modalities!.includes(modality),
      ),
    );
  }

  // Filter by course name (case-insensitive search)
  if (params.courseName) {
    const searchTerm = params.courseName.toLowerCase();
    filtered = filtered.filter((course) =>
      course.title.toLowerCase().includes(searchTerm),
    );
  }

  // Filter by duration
  if (params.durations && params.durations.length > 0) {
    filtered = filtered.filter((course) => {
      // Extract years from duration string
      const match = course.duration.match(/(\d+)\s+anos?/);
      if (!match) return false;

      const years = parseInt(match[1], 10);

      return params.durations!.some((range) => {
        if (range === '1-2') return years >= 1 && years <= 2;
        if (range === '2-3') return years >= 2 && years <= 3;
        if (range === '3-4') return years >= 3 && years <= 4;
        if (range === '4-plus' || range === '4+') return years >= 4;
        return false;
      });
    });
  }

  // Note: Shift filtering is not implemented as the Client API doesn't provide shift information
  // This would require additional API data or mapping

  return filtered;
}
