import { startTransition, useEffect, useRef, useState } from 'react';
import { useCourseFiltersContext } from '../context';
import { useQueryCityBasedCourses } from './api/city-query';
import { useQueryCourses } from './api/query';
import { ITEMS_PER_PAGE } from './constants';

/**
 * Check if the city filter is in the format "city:name-state:code"
 * which indicates a city-based search
 */
function isCityBasedSearch(cityFilter: string): boolean {
  return /^city:.+-state:.+$/.test(cityFilter);
}

export const useCourseGrid = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { filters } = useCourseFiltersContext();
  const prevFiltersRef = useRef<string>('');

  const modalitiesKey = filters.modalities.join(',');
  const shiftsKey = filters.shifts.join(',');
  const durationsKey = filters.durations.join(',');

  const filtersKey = [
    filters.city,
    modalitiesKey,
    filters.priceRange.min,
    filters.priceRange.max,
    shiftsKey,
    durationsKey,
    filters.courseLevel,
    filters.courseName,
    filters.radius,
  ].join('|');

  useEffect(() => {
    // Reset to page 1 when filters change
    if (prevFiltersRef.current !== filtersKey) {
      prevFiltersRef.current = filtersKey;
      if (currentPage !== 1) {
        startTransition(() => {
          setCurrentPage(1);
        });
      }
    }
  }, [filtersKey, currentPage]);

  // Detect if this is a city-based search
  const isCity = filters.city && isCityBasedSearch(filters.city);

  // Use city-based query for city searches, standard query otherwise
  const standardQuery = useQueryCourses(
    {
      location: filters.city || undefined,
      radius: filters.radius,
      modalities:
        filters.modalities.length > 0 ? filters.modalities : undefined,
      priceMin: filters.priceRange.min,
      priceMax: filters.priceRange.max,
      shifts: filters.shifts.length > 0 ? filters.shifts : undefined,
      durations: filters.durations.length > 0 ? filters.durations : undefined,
      level: filters.courseLevel,
      courseName: filters.courseName || undefined,
    },
    currentPage,
    ITEMS_PER_PAGE,
  );

  const cityQuery = useQueryCityBasedCourses(
    {
      city: filters.city,
      modalities:
        filters.modalities.length > 0 ? filters.modalities : undefined,
      shifts: filters.shifts.length > 0 ? filters.shifts : undefined,
      durations: filters.durations.length > 0 ? filters.durations : undefined,
      courseName: filters.courseName || undefined,
    },
    currentPage,
    ITEMS_PER_PAGE,
  );

  // Use appropriate query based on search mode
  const activeQuery = isCity ? cityQuery : standardQuery;
  const { data: coursesResponse, isLoading } = activeQuery;

  const { courses = [], totalPages = 0 } = coursesResponse || {};

  const cardsBeforeBanner = courses.slice(0, 6);
  const cardsAfterBanner = courses.slice(6);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    courses,
    totalPages,
    isLoading,
    cardsBeforeBanner,
    cardsAfterBanner,
    handlePageChange,
    currentPage,
  };
};
