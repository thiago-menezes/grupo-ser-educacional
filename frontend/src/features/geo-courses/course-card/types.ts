import type { CourseDTO, CourseModality } from '../api/types';

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

export function transformCourseDTO(dto: CourseDTO): CourseCardData {
  const formattedPrice = formatPrice(dto.price);

  return {
    id: dto.id,
    category: dto.category,
    title: dto.name,
    degree: dto.degree,
    duration: dto.duration,
    modalities: dto.modalities,
    priceFrom: formattedPrice,
    campusName: dto.campus.name,
    campusCity: dto.campus.city,
    campusState: dto.campus.state,
    slug: dto.slug,
  };
}

function formatPrice(price: number): string {
  const formattedPrice = (price / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  return formattedPrice;
}
