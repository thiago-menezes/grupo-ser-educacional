import type { StrapiSeo } from '@/seo/types';

export type SeosResponseDTO = {
  data: StrapiSeo[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type SeosErrorDTO = {
  error: string;
  message?: string;
};

