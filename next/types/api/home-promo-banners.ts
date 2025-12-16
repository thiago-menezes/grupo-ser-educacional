export type HomePromoBannerItemDTO = {
  id: number;
  link?: string | null;
  imageUrl: string | null;
  imageAlt?: string | null;
};

export type HomePromoBannersResponseDTO = {
  data: HomePromoBannerItemDTO[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type HomePromoBannersErrorDTO = {
  error: string;
  message?: string;
};
