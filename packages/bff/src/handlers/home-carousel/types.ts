export type HomeCarouselQueryParams = {
  institutionSlug: string;
  noCache?: boolean;
};

export type StrapiHomeCarouselItem = {
  id: number;
  attributes: {
    Nome: string;
    Desktop?: {
      data: {
        id: number;
        attributes: {
          url: string;
          alternativeText?: string;
        };
      } | null;
    };
    Mobile?: {
      data: {
        id: number;
        attributes: {
          url: string;
          alternativeText?: string;
        };
      } | null;
    };
    instituicao?: {
      data: {
        id: number;
        attributes: {
          slug: string;
        };
      } | null;
    };
  };
};

export type StrapiHomeCarouselResponse = {
  data: StrapiHomeCarouselItem[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

