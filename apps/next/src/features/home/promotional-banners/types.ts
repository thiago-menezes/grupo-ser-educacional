export type PromotionalBanner = {
  id: string;
  imageUrl: string;
  imageAlt?: string;
};

export type PromotionalBannersProps = {
  banners?: PromotionalBanner[];
};
