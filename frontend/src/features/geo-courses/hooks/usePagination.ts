'use client';

import { useEffect, useRef, useState } from 'react';
import type { UsePaginationOptions, PaginationState } from './types';

const CARD_WIDTH = 290;
const GAP = 16;
const CARD_TOTAL_WIDTH = CARD_WIDTH + GAP;

export function usePagination({
  totalItems,
  containerRef,
}: UsePaginationOptions): PaginationState {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const updateItemsPerPage = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const calculatedItemsPerPage = Math.max(
        1,
        Math.floor(containerWidth / CARD_TOTAL_WIDTH),
      );

      setItemsPerPage(calculatedItemsPerPage);
      setTotalPages(Math.ceil(totalItems / calculatedItemsPerPage));
      setCurrentPage(0);
    };

    if (containerRef.current) {
      resizeObserverRef.current = new ResizeObserver(updateItemsPerPage);
      resizeObserverRef.current.observe(containerRef.current);
    }

    updateItemsPerPage();

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [totalItems, containerRef]);

  const goToPage = (page: number) => {
    const container = containerRef.current;
    if (!container) return;

    const clampedPage = Math.max(0, Math.min(page, totalPages - 1));
    const firstItemIndex = clampedPage * itemsPerPage;
    const scrollPosition = firstItemIndex * CARD_TOTAL_WIDTH;

    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth',
    });

    setCurrentPage(clampedPage);
  };

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    goToPage,
  };
}
