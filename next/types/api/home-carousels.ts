export type HomeCarouselItemDTO = {
  id: number;
  nome: string | null;
  link?: string | null;
  imagem?: {
    id: number;
    url: string;
    alternativeText?: string | null;
  } | null;
};

export type HomeCarouselResponseDTO = {
  data: HomeCarouselItemDTO[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type HomeCarouselsErrorDTO = {
  error: string;
  message?: string;
};

