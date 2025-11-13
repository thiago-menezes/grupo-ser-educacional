'use client';

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { DEFAULT_FILTERS } from './filters-content/constants';
import type {
  CourseFiltersContextValues,
  CourseFiltersFormValues,
} from './types';

const CourseFiltersContext = createContext<CourseFiltersContextValues>(
  {} as CourseFiltersContextValues,
);

export const CourseFiltersProvider = ({ children }: PropsWithChildren) => {
  const { control, handleSubmit, reset, watch, setValue } =
    useForm<CourseFiltersFormValues>({
      defaultValues: DEFAULT_FILTERS,
      mode: 'onChange',
    });

  const filters = useMemo(() => watch(), [watch]);

  useEffect(() => {
    reset(filters, { keepDefaultValues: false });
  }, [filters, reset]);

  const [activeFilters, setActiveFilters] = useState<
    { id: string; label: string }[]
  >([]);

  const activeFiltersCount = activeFilters.length;

  const resetFilters = () => {
    reset(DEFAULT_FILTERS);
    setActiveFilters([]);
  };

  const handleRemoveFilter = (filterId: string) => {
    setActiveFilters((prev) => prev.filter((f) => f.id !== filterId));
  };

  const handleClearAllFilters = () => {
    resetFilters();
  };

  const contextValues: CourseFiltersContextValues = useMemo(
    () => ({
      filters,
      activeFilters,
      activeFiltersCount,
      updateFilters: setValue,
      resetFilters,
      handleRemoveFilter,
      handleClearAllFilters,
      control,
      handleSubmit,
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
