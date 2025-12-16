import type { CoursesResponse } from 'types/api/courses';

export type CursosCidadeResponseDTO = CoursesResponse;

export type CursosCidadeErrorDTO = {
  error: string;
  message?: string;
};
