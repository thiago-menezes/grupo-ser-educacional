export type CourseModality = 'presencial' | 'semipresencial' | 'ead';

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
};

export type CoursesResponse = {
  total: number;
  currentPage: number;
  totalPages: number;
  perPage: number;
  courses: CourseData[];
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
    address: string;
  }>;
  offerings: Array<{
    id: number;
    unitId: number;
    modalityId: number;
    periodId: number;
    price: number;
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
};

export type AutocompleteResponse = {
  type: 'cities' | 'courses';
  results: Array<
    | {
        label: string;
        value: string;
        city: string;
        state: string;
      }
    | {
        id: number;
        label: string;
        value: string;
        slug: string;
        level: string;
        type: string;
      }
  >;
};


