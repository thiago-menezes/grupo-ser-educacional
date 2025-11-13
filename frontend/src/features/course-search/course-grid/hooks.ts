import { useState } from 'react';
import { useQueryCourses } from './api/query';
import { ITEMS_PER_PAGE } from './constants';

export const useCourseGrid = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: coursesResponse, isLoading } = useQueryCourses(
    'pe',
    'recife',
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
