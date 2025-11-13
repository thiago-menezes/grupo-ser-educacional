import { CourseFiltersFormValues } from '../types';

export const FILTERS_CONTENT_HEIGHT_TO_UPDATE = 206;

export const DEFAULT_FILTERS: CourseFiltersFormValues = {
  courseLevel: 'graduation',
  city: '',
  radius: 60,
  courseName: '',
  modalities: [],
  priceRange: {
    min: 800,
    max: 2000,
  },
  shifts: [],
  durations: [],
};
