export type CourseModality = 'presencial' | 'semipresencial' | 'ead';

export type CoursesQueryParams = {
  institution?: string; // slug or id
  location?: string; // city as free text
  page?: number;
  perPage?: number;
  modality?: number;
  category?: number;
  enrollmentOpen?: boolean;
  period?: number; // Turno
  priceMin?: number;
  priceMax?: number;
  durationRange?: '1-2' | '2-3' | '3-4' | '4+';
  level?: 'graduacao' | 'pos-graduacao';
  course?: string; // course slug or id
};

export type CityCoursesParams = {
  institution: string;
  estado: string;
  cidade: string;
  modalities?: string[];
  shifts?: string[];
  durations?: string[];
  courseName?: string;
  page?: number;
  perPage?: number;
};

export type CourseData = {
  id: string;
  category: string;
  title: string;
  degree: string;
  duration: string;
  modalities: CourseModality[];
  priceFrom: string;
  campusName: string;
  campusCity: string;
  campusState: string;
  slug: string;
  sku?: string;
  unitId?: number;
  admissionForm?: string;
};

export type CoursesResponse = {
  total: number;
  currentPage: number;
  totalPages: number;
  perPage: number;
  courses: CourseData[];
};

export type OfertaEntrada = {
  mesInicio: number;
  mesFim: number;
  Tipo: 'Percentual' | 'Valor';
  Valor: string;
};

export type ValoresPagamento = {
  ID: number;
  Valor: string;
  TemplateCampanha: string;
  OfertaEntrada: OfertaEntrada[];
  PrecoBase: string;
  Mensalidade: string;
  InicioVigencia: string;
  FimVigencia: string;
  PrioridadeAbrangencia: number;
};

export type TiposPagamento = {
  ID: number;
  Nome_TipoPagamento: string;
  Codigo: string;
  LinkCheckout: string;
  ValoresPagamento: ValoresPagamento[];
};

export type FormasIngresso = {
  ID: number;
  Nome_FormaIngresso: string;
  Codigo: string;
  TiposPagamento: TiposPagamento[];
};

export type Turnos = {
  ID: number;
  Nome_Turno: string;
  Periodo: string;
  FormasIngresso: FormasIngresso[];
};

export type ClientApiCourseDetails = {
  ID: string;
  Nome_Curso: string;
  Modalidade: string;
  Periodo: number;
  Turnos: Turnos[];
};

export type CourseDetailsResponse = {
  id: number;
  name: string;
  slug: string;
  description: string;
  type: string;
  workload: string | null;
  category: {
    id: number;
    name: string;
  };
  duration: string;
  priceFrom: string | null;
  modalities: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  units: Array<{
    id: number;
    name: string;
    city: string;
    state: string;
    address?: string;
  }>;
  offerings: Array<{
    id: number;
    unitId: number;
    modalityId: number;
    periodId: number;
    price: number | null;
    duration: string;
    enrollmentOpen: boolean;
    unit: {
      id: number;
      name: string;
      city: string;
      state: string;
    };
    modality: {
      id: number;
      name: string;
      slug: string;
    };
    period: {
      id: number;
      name: string;
    };
  }>;
  // Optional: enriched data from Client API
  clientApiDetails?: ClientApiCourseDetails;
};
