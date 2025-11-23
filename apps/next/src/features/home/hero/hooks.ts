import { useCallback, useEffect, useRef, useState } from 'react';
import { useCityContext } from '@/contexts/city';
import { useGeolocation } from '@/hooks';
import { CAROUSEL_CONFIG, MOCK_CITIES } from './constants';
import { findMatchingCity } from './utils';

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
  const {
    city: contextCity,
    state: contextState,
    setCity: setContextCity,
    setCityState,
  } = useCityContext();
  const [localCity, setLocalCity] = useState('');
  const [course, setCourse] = useState('');
  const [modalities, setModalities] = useState<
    Array<'presencial' | 'semi' | 'ead'>
  >(['presencial', 'semi', 'ead']);

  // Use geolocation without manual override
  // This allows geolocation to detect and update the city independently
  const geolocation = useGeolocation();

  // Track if geolocation has been applied to prevent overriding manual selections
  const geolocationAppliedRef = useRef(false);
  const lastGeolocationCityRef = useRef<string | null>(null);

  // Update city from geolocation when it becomes available
  // Only update if no city is set or if current city is the default (Recife/PE)
  useEffect(() => {
    // Only update if geolocation is not loading and we have a result
    if (!geolocation.isLoading && geolocation.city && geolocation.state) {
      // Try to match geocoded city against MOCK_CITIES
      const matchedCity = findMatchingCity(
        geolocation.city,
        geolocation.state,
        MOCK_CITIES,
      );

      const geolocationCityKey = matchedCity
        ? `${matchedCity.city}-${matchedCity.state}`
        : `${geolocation.city}-${geolocation.state}`;

      // Store the geolocation city for comparison
      lastGeolocationCityRef.current = geolocationCityKey;

      // If geolocation succeeded and permission was granted, use the detected city
      // But only if:
      // 1. No city is currently set, OR
      // 2. Current city is Recife/PE (default), OR
      // 3. Current city matches the geolocation city (already correct)
      const isDefaultCity =
        (contextCity === 'Recife' && contextState === 'PE') || !contextCity;

      const currentCityKey =
        contextCity && contextState ? `${contextCity}-${contextState}` : null;

      const matchesGeolocation = currentCityKey === geolocationCityKey;

      // Only update if:
      // 1. Permission was granted
      // 2. AND (it's the default city OR it matches geolocation OR it's the first time and no city is set)
      // This prevents geolocation from overriding manual selections
      // Once a city is manually selected (different from geolocation), it won't be overridden
      const isFirstTime = !geolocationAppliedRef.current && !contextCity;
      const shouldUpdate =
        !geolocation.permissionDenied &&
        (isDefaultCity || matchesGeolocation || isFirstTime);

      if (shouldUpdate) {
        if (matchedCity) {
          // Use the matched city from MOCK_CITIES (exact format)
          // Only update if it's different from current city
          if (
            contextCity !== matchedCity.city ||
            contextState !== matchedCity.state
          ) {
            setCityState(matchedCity.city, matchedCity.state);
            geolocationAppliedRef.current = true;
          }
        } else {
          // Fallback to geocoded city if no match found
          // Only update if it's different from current city
          if (
            contextCity !== geolocation.city ||
            contextState !== geolocation.state
          ) {
            setCityState(geolocation.city, geolocation.state);
            geolocationAppliedRef.current = true;
          }
        }
      }
      // If permission denied, Recife/PE will remain (set by quick-search-form component)
    }
  }, [
    geolocation.city,
    geolocation.state,
    geolocation.isLoading,
    geolocation.permissionDenied,
    contextCity,
    contextState,
    setCityState,
  ]);

  // Sync local city state with context
  const city = contextCity || localCity;

  const setCity = useCallback(
    (newCity: string) => {
      setLocalCity(newCity);
      setContextCity(newCity);
    },
    [setContextCity],
  );

  const reset = useCallback(() => {
    setCity('');
    setCourse('');
    setModalities(['presencial', 'semi', 'ead']);
  }, [setCity]);

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
