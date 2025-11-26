// Services
export * from './services/strapi';
export * from './services/geolocation';
export * from './services/cities';

// Handlers
export {
  handleCoursesList,
  handleCourseDetails,
  handleAutocomplete,
} from './handlers/courses';
export {
  parseCoursesQueryParams,
  parseAutocompleteQueryParams,
} from './handlers/courses/parsers';
export { handleSeo } from './handlers/seos';
export { handleUnits } from './handlers/units';
export { handleMedia } from './handlers/media';
export { handleHomeCarousel } from './handlers/home-carousel';

// Types - shared types are exported from @grupo-ser/types
export type {
  CoursesQueryParams,
  AutocompleteQueryParams,
} from '@grupo-ser/types';
export type { SeoQueryParams } from './handlers/seos/types';
export type { UnitsQueryParams } from './handlers/units/types';
export type { MediaQueryParams } from './handlers/media/types';
export type { HomeCarouselQueryParams } from './handlers/home-carousel/types';

// Errors
export { BffValidationError } from './utils/errors';
