// Services
export * from './services/strapi';
export * from './services/geolocation';

// Handlers
export {
  handleCoursesList,
  handleCourseDetails,
  handleAutocomplete,
} from './handlers/courses';
export { handleSeo } from './handlers/seos';
export { handleUnits } from './handlers/units';
export { handleMedia } from './handlers/media';

// Types - shared types are exported from @grupo-ser/shared
export type { CoursesQueryParams, AutocompleteQueryParams } from './handlers/courses/types';
export type { SeoQueryParams } from './handlers/seos/types';
export type { UnitsQueryParams } from './handlers/units/types';
export type { MediaQueryParams } from './handlers/media/types';
