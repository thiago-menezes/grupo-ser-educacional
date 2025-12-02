export type HeroBannerImage = {
  url: string;
  alternativeText?: string;
};

export type HeroContent = {
  backgroundImage?: HeroBannerImage;
  showCarouselControls?: boolean;
  showQuickSearch?: boolean;
};
