import type { PromotionalBanner } from './types';

const PLACEHOLDER_IMAGE = 'https://placehold.co/625x250.png';

export const MOCK_PROMOTIONAL_BANNERS: PromotionalBanner[] = [
  {
    id: 'stripe-placeholder-1',
    imageUrl: PLACEHOLDER_IMAGE,
    imageAlt: 'Banner promocional placeholder 1',
  },
  {
    id: 'stripe-placeholder-2',
    imageUrl: PLACEHOLDER_IMAGE,
    imageAlt: 'Banner promocional placeholder 2',
  },
  {
    id: 'stripe-placeholder-3',
    imageUrl: PLACEHOLDER_IMAGE,
    imageAlt: 'Banner promocional placeholder 3',
  },
];
