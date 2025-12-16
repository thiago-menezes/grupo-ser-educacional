import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { useCurrentInstitution } from '@/hooks';
import type { CoursesUnitsResponseDTO } from '@/types/api/courses-units';

async function fetchUnitsByCourse(
  institution: string,
  state: string,
  city: string,
  sku: string,
): Promise<CoursesUnitsResponseDTO> {
  const params = new URLSearchParams({
    institution,
    state,
    city,
    sku,
  });

  const response = await fetch(`/api/courses/units?${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch units');
  }

  return response.json();
}

export function useSelectedUnit() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { institutionSlug } = useCurrentInstitution();

  const state = searchParams.get('state');
  const city = searchParams.get('city');
  const sku = searchParams.get('sku');
  const unitId = searchParams.get('unit');

  const { data, isLoading } = useQuery({
    queryKey: ['units-by-course', institutionSlug, state, city, sku],
    queryFn: () => fetchUnitsByCourse(institutionSlug!, state!, city!, sku!),
    enabled: !!institutionSlug && !!state && !!city && !!sku,
  });

  const selectedUnit = data?.data.find(
    (u) => u.id === parseInt(unitId || '0', 10),
  );

  const handleUnitChange = useCallback(
    (newUnitId: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('unit', newUnitId.toString());
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return {
    selectedUnit,
    units: data?.data || [],
    isLoading,
    unitId: unitId ? parseInt(unitId, 10) : null,
    handleUnitChange,
  };
}
