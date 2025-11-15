import { useEffect, useState } from 'react';
import { useCourseFiltersContext } from '../context';
import { useQueryCourses } from './api/query';
import { ITEMS_PER_PAGE } from './constants';

export const useCourseGrid = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { filters } = useCourseFiltersContext();

  const modalitiesKey = filters.modalities.join(',');
  const shiftsKey = filters.shifts.join(',');
  const durationsKey = filters.durations.join(',');

  useEffect(() => {
    setCurrentPage(1);
  }, [
    filters.city,
    modalitiesKey,
    filters.priceRange.min,
    filters.priceRange.max,
    shiftsKey,
    durationsKey,
    filters.courseLevel,
    filters.courseName,
    filters.radius,
  ]);

  const { data: coursesResponse, isLoading } = useQueryCourses(
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
