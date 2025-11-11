export type AreaCourse = {
  id: string;
  name: string;
  slug: string;
};

export type AreaCard = {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  courses: AreaCourse[];
};

export type AreasSelectorContent = {
  title: string;
  areas: AreaCard[];
};

export type { UsePaginationOptions } from '@/hooks/usePagination.types';
