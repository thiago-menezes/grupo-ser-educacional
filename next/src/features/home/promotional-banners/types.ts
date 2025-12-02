export type PromotionalBanner = {
  id: string;
  imageUrl: string;
  imageAlt?: string;
  link?: string | null;
};

export type PromotionalBannersProps = {
  banners?: PromotionalBanner[];
};
