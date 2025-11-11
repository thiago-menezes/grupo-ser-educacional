import { DEFAULT_AREAS_CONTENT } from './constants';

export type AreasSelectorProps = {
  content?: typeof DEFAULT_AREAS_CONTENT;
};

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
