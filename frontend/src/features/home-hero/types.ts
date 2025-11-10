export type HeroBannerImage = {
  url: string;
  alternativeText?: string;
};

export type HeroContent = {
  backgroundImage?: HeroBannerImage;
  backgroundImageMobile?: HeroBannerImage;
  showCarouselControls?: boolean;
  showQuickSearch?: boolean;
};
