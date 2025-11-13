'use client';

import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
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
  const [filters, setFilters] =
    useState<CourseFiltersFormValues>(DEFAULT_FILTERS);

  const [activeFilters, setActiveFilters] = useState<
    { id: string; label: string }[]
  >([]);

  const activeFiltersCount = activeFilters.length;

  const updateFilters = (newFilters: Partial<CourseFiltersFormValues>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    // TODO: Update activeFilters based on new filter values
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setActiveFilters([]);
  };

  const handleRemoveFilter = (filterId: string) => {
    setActiveFilters((prev) => prev.filter((f) => f.id !== filterId));
    // TODO: Update filters state when removing a filter
  };

  const handleClearAllFilters = () => {
    resetFilters();
  };

  const contextValues: CourseFiltersContextValues = useMemo(
    () => ({
      filters,
      activeFilters,
      activeFiltersCount,
      updateFilters,
      resetFilters,
      handleRemoveFilter,
      handleClearAllFilters,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters, activeFilters, activeFiltersCount],
  );

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
