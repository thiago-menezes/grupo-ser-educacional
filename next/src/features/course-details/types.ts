export type CoordinatorData = {
  id: number;
  name: string;
  description: string;
  photo?: string;
  email?: string;
  phone?: string;
};

export type TeacherData = {
  id: number;
  name: string;
  role: string;
  title?: string;
  photo?: string;
  modalities?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
};

export type PedagogicalProjectData = {
  content: string;
};

export type SalaryRangeData = {
  level: string;
  range: string;
  description: string;
  icon?: string;
};

export type RelatedCourseData = {
  id: number;
  name: string;
  slug: string;
  type: string;
  duration: string;
  modality: string;
  price: number | null;
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
  PrecoBase?: string;
  Mensalidade?: string;
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
  Hash_CursoTurno?: string;
};

export type CourseDetails = {
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
  // Optional fields from Strapi
  coordinator?: CoordinatorData;
  teachers?: TeacherData[];
  pedagogicalProject?: PedagogicalProjectData;
  jobMarketAreas?: string[];
  salaryRanges?: SalaryRangeData[];
  relatedCourses?: RelatedCourseData[];
  featuredImage?: string;
  methodology?: string;
  certificate?: string;
  curriculumMarkdown?: string;
  // New fields from Client API (pricing, shifts, admission forms)
  clientApiDetails?: {
    ID: string;
    Nome_Curso: string;
    Modalidade: string;
    Periodo: number;
    Turnos: Turnos[];
  };
};
