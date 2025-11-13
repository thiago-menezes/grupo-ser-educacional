import { useQuery } from '@tanstack/react-query';
import { getCoursesDTO } from '@/dto/courses';
import { useCurrentInstitution } from '@/hooks/useInstitution';

export const useQueryCourses = (
  state: string,
  city: string,
  page: number,
  perPage: number,
) => {
  const { institutionId } = useCurrentInstitution();

  return useQuery({
    queryKey: ['courses', institutionId, state, city, page, perPage],
    queryFn: () => getCoursesDTO(institutionId, state, city, page, perPage),
  });
};
