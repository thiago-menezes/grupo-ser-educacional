'use client';

import { useRouter } from 'next/navigation';
import { useCurrentInstitution } from '../../../hooks';
import type { AreaCard } from './types';

export function useAreaSelector() {
  const { institutionId } = useCurrentInstitution();
  const router = useRouter();

  const handleCourseClick = (area: AreaCard, courseSlug: string) => {
    if (!institutionId) return;
    const params = new URLSearchParams({
      area: area.slug,
      course: courseSlug,
    });
    router.push(`/${institutionId}/cursos?${params.toString()}`);
  };

  const handleAllCourses = (areaSlug: string) => {
    if (!institutionId) return;
    const params = new URLSearchParams({
      area: areaSlug,
    });
    router.push(`/${institutionId}/cursos?${params.toString()}`);
  };

  return {
    handleCourseClick,
    handleAllCourses,
  };
}
