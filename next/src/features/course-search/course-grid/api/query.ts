import { useQuery } from '@tanstack/react-query';
import { CoursesResponse } from 'types/api/courses';
import { useCurrentInstitution } from '@/hooks';
import { query } from '@/libs';
import {
  mapCourseLevel,
  mapDurationRange,
  mapModality,
  mapShiftToPeriodId,
} from '../mappers';
import { CityCoursesFilters, CourseFilters } from './types';

export const useQueryCourses = (
  filters: Partial<CourseFilters>,
  page: number,
  perPage: number,
) => {
  const { institutionId } = useCurrentInstitution();

  return useQuery({
    queryKey: [
      'courses',
      institutionId,
      filters.location,
      filters.radius,
      filters.modalities?.join(','),
      filters.priceMin,
      filters.priceMax,
      filters.shifts?.join(','),
      filters.durations?.join(','),
      filters.level,
      filters.courseName,
      page,
      perPage,
    ],
    queryFn: async () => {
      const params: Record<string, string | number> = {
        institution: institutionId,
        page,
        perPage,
      };

      // Add filters to params
      if (filters.location) params.location = filters.location;
      if (filters.radius !== undefined) params.radius = filters.radius;
      if (filters.modalities && filters.modalities.length > 0) {
        // API accepts single modality, so we'll use the first one
        // If multiple, we might need to handle differently
        const mappedModality = mapModality(filters.modalities[0]);
        if (mappedModality) {
          params.modality = mappedModality;
        }
      }
      if (filters.priceMin !== undefined) params.priceMin = filters.priceMin;
      if (filters.priceMax !== undefined) params.priceMax = filters.priceMax;
      if (filters.shifts && filters.shifts.length > 0) {
        const periodId = mapShiftToPeriodId(filters.shifts[0]);
        if (periodId !== undefined) {
          params.period = periodId;
        }
      }
      if (filters.durations && filters.durations.length > 0) {
        const mappedDuration = mapDurationRange(filters.durations[0]);
        if (mappedDuration) {
          params.durationRange = mappedDuration;
        }
      }
      if (filters.level) {
        const mappedLevel = mapCourseLevel(filters.level);
        if (mappedLevel) {
          params.level = mappedLevel;
        }
      }
      if (filters.courseName) {
        params.course = filters.courseName;
      }

      return query<CoursesResponse>('/courses', { params });
    },
  });
};

function parseCityParam(cityParam: string): { city: string; state: string } {
  // Expected format: city:<slug>-state:<uf>
  // City slug may contain hyphens, so we match greedily until the last "-state:"
  const match = cityParam.match(/^city:(.+)-state:([a-z]{2})$/i);
  return {
    city: match?.[1] || '',
    state: match?.[2] || '',
  };
}

export const useQueryCityBasedCourses = (
  filters: Partial<CityCoursesFilters>,
  page: number,
  perPage: number,
) => {
  const { institutionId } = useCurrentInstitution();

  const { city, state } = filters.city
    ? parseCityParam(filters.city)
    : { city: '', state: '' };

  return useQuery({
    queryKey: [
      'courses',
      'city',
      institutionId,
      state,
      city,
      filters.modalities?.join(','),
      filters.shifts?.join(','),
      filters.durations?.join(','),
      filters.courseName,
      page,
      perPage,
    ],
    queryFn: async () => {
      const params: Record<string, string | number | string[]> = {
        institution: institutionId,
        state,
        city,
        page,
        perPage,
      };

      // Add filters to params
      if (filters.modalities && filters.modalities.length > 0) {
        params.modalities = filters.modalities;
      }
      if (filters.shifts && filters.shifts.length > 0) {
        params.shifts = filters.shifts;
      }
      if (filters.durations && filters.durations.length > 0) {
        params.durations = filters.durations;
      }
      if (filters.courseName) {
        params.courseName = filters.courseName;
      }

      return query<CoursesResponse>('/courses/by-city', params);
    },
    enabled: !!city && !!state && !!institutionId,
  });
};
