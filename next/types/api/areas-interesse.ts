export type AreaCourseDTO = {
  id: string;
  name: string;
  slug: string;
};

export type AreaInteresseItemDTO = {
  id: number;
  title: string;
  slug: string;
  imageUrl: string | null;
  imageAlt: string | null;
  courses: AreaCourseDTO[];
};

export type AreasInteresseResponseDTO = {
  data: AreaInteresseItemDTO[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type AreasInteresseErrorDTO = {
  error: string;
  message?: string;
};
