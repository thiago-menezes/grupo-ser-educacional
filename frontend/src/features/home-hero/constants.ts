import { HeroContent } from './types';

export const HOME_HERO_QUERY_KEY = ['home-hero'] as const;

export const DEFAULT_HERO_CONTENT: HeroContent = {
  backgroundImage: {
    url: 'https://placehold.co/1232x520.png',
    alternativeText: 'Hero banner background',
  },
  backgroundImageMobile: {
    url: 'https://placehold.co/800x600.png',
    alternativeText: 'Hero banner background',
  },
  showCarouselControls: true,
  showQuickSearch: true,
};

export const CAROUSEL_CONFIG = {
  autoAdvanceInterval: 5000,
  transitionDuration: 300,
} as const;
