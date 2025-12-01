import { CourseFiltersFormValues } from '../types';

export const FILTERS_CONTENT_HEIGHT_TO_UPDATE = 120;

export const DEFAULT_FILTERS: CourseFiltersFormValues = {
  courseLevel: 'graduation',
  city: '',
  radius: 60,
  courseName: '',
  modalities: [],
  priceRange: {
    min: 300,
    max: 3000,
  },
  shifts: [],
  durations: [],
};
