import { useQuery } from '@tanstack/react-query';
import { useCurrentInstitution } from '@/hooks/useInstitution';
import { query } from '@/libs/api/axios';
import { CoursesResponse } from './types';

export const useQueryCourses = (
  state: string,
  city: string,
  page: number,
  perPage: number,
) => {
  const { institutionId } = useCurrentInstitution();

  return useQuery({
    queryKey: ['courses', institutionId, state, city, page, perPage],
    queryFn: async () =>
      query<CoursesResponse>(`/courses`, {
        institution: institutionId,
        state,
        city,
        page,
        perPage,
      }),
  });
};
