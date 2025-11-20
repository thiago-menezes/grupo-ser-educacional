'use client';

import { useCallback, useEffect, useState } from 'react';
import { CAROUSEL_CONFIG } from './constants';

export function useHeroCarousel(totalSlides: number = 1) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(true);

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentSlide(index % totalSlides);
    },
    [totalSlides],
  );

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const previousSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (!isAutoAdvancing || totalSlides <= 1) return;

    const interval = setInterval(
      nextSlide,
      CAROUSEL_CONFIG.autoAdvanceInterval,
    );

    return () => clearInterval(interval);
  }, [isAutoAdvancing, totalSlides, nextSlide]);

  return {
    currentSlide,
    goToSlide,
    nextSlide,
    previousSlide,
    isAutoAdvancing,
    setIsAutoAdvancing,
  };
}

export function useQuickSearchForm() {
  const [city, setCity] = useState('');
  const [course, setCourse] = useState('');
  const [modalities, setModalities] = useState<
    Array<'presencial' | 'semi' | 'ead'>
  >(['presencial', 'semi', 'ead']);

  const reset = useCallback(() => {
    setCity('');
    setCourse('');
    setModalities(['presencial', 'semi', 'ead']);
  }, []);

  const toggleModality = useCallback(
    (modality: 'presencial' | 'semi' | 'ead') => {
      setModalities((prev) =>
        prev.includes(modality)
          ? prev.filter((m) => m !== modality)
          : [...prev, modality],
      );
    },
    [],
  );

  return {
    city,
    setCity,
    course,
    setCourse,
    modalities,
    toggleModality,
    reset,
  };
}
