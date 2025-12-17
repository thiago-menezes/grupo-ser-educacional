export type CourseAPIRaw = {
  Marca_ID: string;
  Marca_Nome: string;
  Unidade_ID: string;
  Unidade_Nome: string;
  Estado: string;
  Cidade: string;
  Curso_ID: string;
  Curso_Nome: string;
  Modalidade: string;
  Nivel_Ensino: string;
  Turno_ID: string;
  Turno_Nome: string;
  Hash_CursoTurno: string;
  Periodo: number;
  FormaIngresso_ID: string;
  FormaIngresso_Nome: string;
  FormaIngresso_Codigo: string;
  TipoPagamento_ID: string;
  TipoPagamento_Nome: string;
  TipoPagamento_Codigo: string;
  URL_Checkout: string;
  ValorPagamento_ID: string;
  Valor: number;
  InicioVigencia: string;
  FimVigencia: string;
  PrioridadeAbrangencia: number;
};

export type CoursesAPIResponse = {
  cursos: CourseAPIRaw[];
  total: number;
};

export type CoursesAPIParams = {
  nivel_ensino?: string;
  cidade?: string;
  estado?: string;
  modalidade?: string;
  curso_nome?: string;
  turno?: string;
  valor_min?: number;
  valor_max?: number;
};
