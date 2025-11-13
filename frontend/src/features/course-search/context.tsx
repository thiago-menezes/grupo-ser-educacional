'use client';

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';
import { DEFAULT_FILTERS } from './filters-content/constants';
import type {
  CourseFiltersContextValues,
  CourseFiltersFormValues,
} from './types';

const CourseFiltersContext = createContext<CourseFiltersContextValues>(
  {} as CourseFiltersContextValues,
);

export const CourseFiltersProvider = ({ children }: PropsWithChildren) => {
  // Applied filters - these trigger the search/API call
  const [appliedFilters, setAppliedFilters] =
    useState<CourseFiltersFormValues>(DEFAULT_FILTERS);

  const [activeFilters, setActiveFilters] = useState<
    { id: string; label: string }[]
  >([]);

  const activeFiltersCount = activeFilters.length;

  const applyFilters = useCallback((filters: CourseFiltersFormValues) => {
    setAppliedFilters(filters);
    // TODO: Trigger API call here or via useEffect watching appliedFilters
    // TODO: Update activeFilters based on applied filter values
  }, []);

  const resetFilters = useCallback(() => {
    setAppliedFilters(DEFAULT_FILTERS);
    setActiveFilters([]);
  }, []);

  const handleRemoveFilter = useCallback((filterId: string) => {
    setActiveFilters((prev) => prev.filter((f) => f.id !== filterId));
    // TODO: Update appliedFilters when removing a filter tag
  }, []);

  const handleClearAllFilters = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  console.log('appliedFilters', appliedFilters);

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
};

export const useCourseFiltersContext = (): CourseFiltersContextValues => {
  const context = useContext(CourseFiltersContext);

  if (context === undefined) {
    throw new Error(
      'useCourseFiltersContext must be used within a CourseFiltersProvider',
    );
  }

  return context;
};
