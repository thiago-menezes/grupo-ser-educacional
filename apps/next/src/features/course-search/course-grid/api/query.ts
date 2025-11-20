import type { CoursesResponse } from '@grupo-ser/types';
import { useQuery } from '@tanstack/react-query';
import { useCurrentInstitution } from '../../../../hooks';
import { query } from '../../../../libs';

type CourseFilters = {
  location?: string;
  radius?: number;
  modalities?: string[];
  priceMin?: number;
  priceMax?: number;
  shifts?: string[];
  durations?: string[];
  level?: string;
  courseName?: string;
};

/**
 * Map course level to API level format
 */
function mapCourseLevel(level: string): string | undefined {
  const levelMap: Record<string, string> = {
    graduation: 'graduacao',
    postgraduate: 'pos-graduacao',
  };
  return levelMap[level];
}

/**
 * Map modality to API format
 */
function mapModality(modality: string): string | undefined {
  const modalityMap: Record<string, string> = {
    presencial: 'presencial',
    semipresencial: 'hibrido',
    ead: 'ead',
  };
  return modalityMap[modality];
}

/**
 * Map duration range to API format
 */
function mapDurationRange(duration: string): string | undefined {
  const durationMap: Record<string, string> = {
    '1-2': '1-2',
    '2-3': '2-3',
    '3-4': '3-4',
    '4-plus': '4+',
  };
  return durationMap[duration];
}

/**
 * Map shift to period ID
 * Shifts: morning, afternoon, night, fulltime, virtual
 * Periods: manha (1), tarde (2), noite (3), integral (4), virtual (5)
 */
function mapShiftToPeriodId(shift: string): number | undefined {
  const shiftMap: Record<string, number> = {
    morning: 1, // Manhã
    afternoon: 2, // Tarde
    night: 3, // Noite
    fulltime: 4, // Integral
    virtual: 5, // Virtual
  };
  return shiftMap[shift];
}

export const useQueryCourses = (
  filters: CourseFilters,
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
