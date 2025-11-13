'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchGeoCoursesSection } from './api';
import { transformCourseDTO } from './api/utils';
import type { GeoCoursesData } from './types';

type UseGeoCoursesOptions = {
  city?: string;
  state?: string;
  enabled?: boolean;
};

export function useGeoCourses({
  city = 'São José dos Campos',
  state = 'SP',
  enabled = true,
}: UseGeoCoursesOptions = {}) {
  const [data, setData] = useState<GeoCoursesData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const dto = await fetchGeoCoursesSection(city, state);

        const transformedCourses = dto.courses.map(transformCourseDTO);

        const geoData: GeoCoursesData = {
          title: dto.title,
          description: dto.description,
          location: dto.location,
          courses: transformedCourses,
        };

        setData(geoData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load courses';
        setError(errorMessage);
        console.error('Error fetching geo courses:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [city, state, enabled]);

  const refetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const dto = await fetchGeoCoursesSection(city, state);

      const transformedCourses = dto.courses.map(transformCourseDTO);

      const geoData: GeoCoursesData = {
        title: dto.title,
        description: dto.description,
        location: dto.location,
        courses: transformedCourses,
      };

      setData(geoData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load courses';
      setError(errorMessage);
      console.error('Error refetching geo courses:', err);
    } finally {
      setIsLoading(false);
    }
  }, [city, state]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}
