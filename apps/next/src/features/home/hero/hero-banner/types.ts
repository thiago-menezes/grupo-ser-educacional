import type { CarouselItem } from '../api/query';

export type HeroBannerProps = {
  carouselItems?: CarouselItem[];
  currentSlide?: number;
  imageUrl?: string;
  imageUrlMobile?: string;
  imageAlt?: string;
  videoUrl?: string;
  isLoading?: boolean;
};
