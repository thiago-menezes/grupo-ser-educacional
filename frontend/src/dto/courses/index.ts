import { query } from '../../libs/api/axios';
import { CoursesResponseDTO } from './types';

export const getCoursesDTO = async (
  institution: string,
  state: string,
  city: string,
  page: number,
  perPage: number,
) => {
  const data = await query<CoursesResponseDTO>(`/courses`, {
    institution,
    state,
    city,
    page,
    perPage,
  });

  return data;
};
