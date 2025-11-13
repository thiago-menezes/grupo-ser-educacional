export type CourseModality = 'presencial' | 'semipresencial' | 'ead';

export type CourseCardData = {
  id: string;
  category: string;
  title: string;
  degree: string;
  duration: string;
  modalities: CourseModality[];
  priceFrom: string;
  campusName: string;
  campusCity: string;
  campusState: string;
  slug: string;
};

export type CourseCardProps = {
  course: CourseCardData;
  onClick?: (slug: string) => void;
};
