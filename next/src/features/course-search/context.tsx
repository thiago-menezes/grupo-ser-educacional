'use client';

import { useSearchParams } from 'next/navigation';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  startTransition,
} from 'react';
import { DEFAULT_FILTERS } from './filters-content/constants';
import type {
  ActiveFilter,
  CourseFiltersContextValues,
  CourseFiltersFormValues,
  CourseLevel,
} from './types';

const CourseFiltersContext = createContext<CourseFiltersContextValues>(
  {} as CourseFiltersContextValues,
);

const MODALITY_LABELS: Record<string, string> = {
  presencial: 'Presencial',
  semipresencial: 'Semipresencial',
  ead: 'EAD',
};

const SHIFT_LABELS: Record<string, string> = {
  morning: 'Manhã',
  afternoon: 'Tarde',
  night: 'Noite',
  fulltime: 'Integral',
  virtual: 'Virtual',
};

const DURATION_LABELS: Record<string, string> = {
  '1-2': '1 a 2 anos',
  '2-3': '2 a 3 anos',
  '3-4': '3 a 4 anos',
  '4-plus': 'Mais que 4 anos',
};

const COURSE_LEVEL_LABELS: Record<string, string> = {
  graduation: 'Graduação',
  postgraduate: 'Pós-graduação',
};

function buildActiveFilters(filters: CourseFiltersFormValues): ActiveFilter[] {
  const activeFilters: ActiveFilter[] = [];

  if (filters.courseName) {
    activeFilters.push({
      id: 'courseName',
      label: filters.courseName,
    });
  }

  if (filters.city) {
    // Format city label from technical value format (city:name-state:code)
    const techFormatMatch = filters.city.match(
      /^city:(.+?)-state:([a-z]{2})$/i,
    );
    let cityLabel = filters.city;

    if (techFormatMatch) {
      const citySlug = techFormatMatch[1];
      const stateCode = techFormatMatch[2].toUpperCase();
      const cityName = citySlug.replace(/-/g, ' ');

      // Capitalize city name properly
      const formattedCity = cityName
        .split(' ')
        .map((word) => {
          // Handle special cases like "de", "da", "do", "dos", "das"
          const lowerWords = ['de', 'da', 'do', 'dos', 'das', 'e'];
          if (lowerWords.includes(word.toLowerCase())) {
            return word.toLowerCase();
          }
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');

      cityLabel = `${formattedCity} - ${stateCode}`;
    }

    activeFilters.push({
      id: 'city',
      label: cityLabel,
    });
  }

  if (
    filters.courseLevel &&
    filters.courseLevel !== DEFAULT_FILTERS.courseLevel
  ) {
    activeFilters.push({
      id: 'courseLevel',
      label: COURSE_LEVEL_LABELS[filters.courseLevel] || filters.courseLevel,
    });
  }

  filters.modalities.forEach((modality) => {
    activeFilters.push({
      id: `modality-${modality}`,
      label: MODALITY_LABELS[modality] || modality,
    });
  });

  filters.shifts.forEach((shift) => {
    activeFilters.push({
      id: `shift-${shift}`,
      label: SHIFT_LABELS[shift] || shift,
    });
  });

  filters.durations.forEach((duration) => {
    activeFilters.push({
      id: `duration-${duration}`,
      label: DURATION_LABELS[duration] || duration,
    });
  });

  if (
    filters.priceRange.min !== DEFAULT_FILTERS.priceRange.min ||
    filters.priceRange.max !== DEFAULT_FILTERS.priceRange.max
  ) {
    activeFilters.push({
      id: 'priceRange',
      label: `R$ ${filters.priceRange.min} - R$ ${filters.priceRange.max}`,
    });
  }

  if (filters.radius !== DEFAULT_FILTERS.radius) {
    activeFilters.push({
      id: 'radius',
      label: `${filters.radius} km`,
    });
  }

  return activeFilters;
}

function parseFiltersFromSearchParams(
  searchParams: URLSearchParams,
): Partial<CourseFiltersFormValues> {
  const filters: Partial<CourseFiltersFormValues> = {};

  const courseLevel = searchParams.get('courseLevel');
  if (courseLevel === 'graduation' || courseLevel === 'postgraduate') {
    filters.courseLevel = courseLevel as CourseLevel;
  }

  const city = searchParams.get('city');
  if (city) {
    filters.city = city;
  }

  const courseName = searchParams.get('course');
  if (courseName) {
    filters.courseName = courseName;
  }

  const modalities = searchParams.getAll('modalities');
  if (modalities.length > 0) {
    filters.modalities = modalities.filter(
      (m): m is CourseFiltersFormValues['modalities'][number] =>
        m === 'presencial' || m === 'semipresencial' || m === 'ead',
    );
  }

  return filters;
}

export function CourseFiltersProvider({ children }: PropsWithChildren) {
  const searchParams = useSearchParams();

  // Initialize filters from URL params on mount
  const [appliedFilters, setAppliedFilters] = useState<CourseFiltersFormValues>(
    () => {
      const urlFilters = parseFiltersFromSearchParams(searchParams);
      return {
        ...DEFAULT_FILTERS,
        ...urlFilters,
      };
    },
  );

  // Update filters when URL params change
  useEffect(() => {
    const urlFilters = parseFiltersFromSearchParams(searchParams);
    startTransition(() => {
      setAppliedFilters((prev) => {
        // Only update if there are actual changes to avoid unnecessary re-renders
        const hasChanges =
          (urlFilters.courseLevel &&
            urlFilters.courseLevel !== prev.courseLevel) ||
          (urlFilters.city !== undefined && urlFilters.city !== prev.city) ||
          (urlFilters.courseName !== undefined &&
            urlFilters.courseName !== prev.courseName) ||
          (urlFilters.modalities !== undefined &&
            JSON.stringify(urlFilters.modalities) !==
              JSON.stringify(prev.modalities));

        if (!hasChanges) {
          return prev;
        }

        return {
          ...prev,
          ...urlFilters,
        };
      });
    });
  }, [searchParams]);

  const activeFilters = useMemo(
    () => buildActiveFilters(appliedFilters),
    [appliedFilters],
  );

  const activeFiltersCount = activeFilters.length;

  const applyFilters = useCallback((filters: CourseFiltersFormValues) => {
    setAppliedFilters(filters);
  }, []);

  const resetFilters = useCallback(() => {
    setAppliedFilters(DEFAULT_FILTERS);
  }, []);

  const handleRemoveFilter = useCallback((filterId: string) => {
    setAppliedFilters((prev) => {
      const updated = { ...prev };

      if (filterId === 'courseName') {
        updated.courseName = '';
      } else if (filterId === 'city') {
        updated.city = '';
      } else if (filterId === 'courseLevel') {
        updated.courseLevel = DEFAULT_FILTERS.courseLevel;
      } else if (filterId === 'priceRange') {
        updated.priceRange = { ...DEFAULT_FILTERS.priceRange };
      } else if (filterId === 'radius') {
        updated.radius = DEFAULT_FILTERS.radius;
      } else if (filterId.startsWith('modality-')) {
        const modality = filterId.replace('modality-', '');
        updated.modalities = prev.modalities.filter((m) => m !== modality);
      } else if (filterId.startsWith('shift-')) {
        const shift = filterId.replace('shift-', '');
        updated.shifts = prev.shifts.filter((s) => s !== shift);
      } else if (filterId.startsWith('duration-')) {
        const duration = filterId.replace('duration-', '');
        updated.durations = prev.durations.filter((d) => d !== duration);
      }

      return updated;
    });
  }, []);

  const handleClearAllFilters = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  const contextValues: CourseFiltersContextValues = {
    filters: appliedFilters,
    activeFilters,
    activeFiltersCount,
    applyFilters,
    resetFilters,
    handleRemoveFilter,
    handleClearAllFilters,
  };

  return (
    <CourseFiltersContext.Provider value={contextValues}>
      {children}
    </CourseFiltersContext.Provider>
  );
}

export const useCourseFiltersContext = (): CourseFiltersContextValues => {
  const context = useContext(CourseFiltersContext);

  if (context === undefined) {
    throw new Error(
      'useCourseFiltersContext must be used within a CourseFiltersProvider',
    );
  }

  return context;
};
