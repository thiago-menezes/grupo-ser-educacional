import type { AutocompleteResponse } from '@grupo-ser/types';

import { getAvailableCities, getAvailableCourses } from '../../data';

import type { AutocompleteQueryParams } from './types';

/**
 * Handle autocomplete request
 */
export function handleAutocomplete(
  params: AutocompleteQueryParams,
): AutocompleteResponse {
  const query = params.q || '';

  if (params.type === 'cities') {
    const cities = getAvailableCities();
    const filtered = cities.filter(
      (city) =>
        city.city.toLowerCase().includes(query.toLowerCase()) ||
        city.state.toLowerCase().includes(query.toLowerCase()),
    );

    return {
      type: 'cities',
      results: filtered.map((city) => ({
        label: `${city.city} - ${city.state}`,
        value: city.city,
        city: city.city,
        state: city.state,
      })),
    };
  }

  if (params.type === 'courses') {
    const courses = getAvailableCourses();
    const filtered = courses.filter((course) =>
      course.name.toLowerCase().includes(query.toLowerCase()),
    );

    return {
      type: 'courses',
      results: filtered.map((course) => ({
        id: course.id,
        label: course.name,
        value: course.slug,
        slug: course.slug,
        level: course.level,
        type: course.type,
      })),
    };
  }

  throw new Error('Invalid type. Use "cities" or "courses"');
}
