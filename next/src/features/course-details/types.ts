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

export type CourseDetails = {
  id: number;
  name: string;
  slug: string;
  description: string;
  type: string;
  workload: number | null;
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
};
