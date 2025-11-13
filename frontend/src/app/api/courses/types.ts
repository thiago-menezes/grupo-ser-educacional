export type Course = {
  ID: string;
  Nome_Curso: string;
  Modalidade: string;
  Periodo: number;
};

export type CoursesDTO = {
  Cursos: Course[];
};
