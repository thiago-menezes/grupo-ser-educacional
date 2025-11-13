export type Course = {
  ID: string;
  Nome_Curso: string;
  Modalidade: string;
  Periodo: number;
};

export type CoursesDTO = {
  Cursos: Course[];
};

export type CoursesOriginalDTO = {
  institution: string;
  state: string;
  city: string;
  total: number;
  currentPage: number;
  totalPages: number;
  perPage: number;
  courses: CoursesOriginalDTO[];
};
