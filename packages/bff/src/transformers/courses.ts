import type { CourseModality, CourseData } from '@grupo-ser/shared';
import type { CourseOfferingEnriched } from '../data';
import { formatPrice } from '@grupo-ser/shared';

/**
 * Transform enriched offering to CourseData format
 */
export function transformOfferingToCourseData(
  offering: CourseOfferingEnriched,
): CourseData {
  const modalityMap: Record<string, CourseModality> = {
    presencial: 'presencial',
    ead: 'ead',
    hibrido: 'semipresencial',
  };

  const modality =
    modalityMap[offering.modality.slug] || 'presencial';

  return {
    id: String(offering.id),
    category: offering.course.category.name || 'Não informado',
    title: offering.course.name,
    degree: offering.course.type || 'Não informado',
    duration: offering.duration || 'Não informado',
    modalities: [modality],
    priceFrom: formatPrice(offering.price),
    campusName: offering.unit.name || 'Não informado',
    campusCity: offering.unit.city,
    campusState: offering.unit.state,
    slug: offering.course.slug,
  };
}

/**
 * Transform multiple offerings to CourseData array
 */
export function transformOfferingsToCourseData(
  offerings: CourseOfferingEnriched[],
): CourseData[] {
  return offerings.map(transformOfferingToCourseData);
}

