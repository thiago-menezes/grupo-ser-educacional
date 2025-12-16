import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useCurrentInstitution, useQueryParams } from '@/hooks';
import { query } from '@/libs';
import type { CoursesUnitsResponseDTO } from '@/types/api/courses-units';

export function useSelectedUnit() {
  const { searchParams, setParam } = useQueryParams();
  const { institutionSlug } = useCurrentInstitution();

  const state = searchParams.get('state');
  const city = searchParams.get('city');
  const sku = searchParams.get('sku');
  const unitId = searchParams.get('unit');

  const { data, isLoading } = useQuery({
    queryKey: ['units-by-course', institutionSlug, state, city, sku],
    queryFn: () =>
      query<CoursesUnitsResponseDTO>('/courses/units', {
        institution: institutionSlug!,
        state: state!,
        city: city!,
        sku: sku!,
      }),
    enabled: !!institutionSlug && !!state && !!city && !!sku,
  });

  const selectedUnit = data?.data.find(
    (u) => u.id === parseInt(unitId || '0', 10),
  );

  const handleUnitChange = useCallback(
    (newUnitId: number) => {
      setParam('unit', newUnitId.toString());
    },
    [setParam],
  );

  return {
    selectedUnit,
    units: data?.data || [],
    isLoading,
    unitId: unitId ? parseInt(unitId, 10) : null,
    handleUnitChange,
  };
}
