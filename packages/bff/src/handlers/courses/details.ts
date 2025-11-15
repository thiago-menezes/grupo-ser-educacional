import type { CourseDetailsResponse } from '@grupo-ser/shared';
import {
  getCourseBySlug,
  getOfferingsByCourse,
  categories,
} from '../../data';
import { formatPrice } from '@grupo-ser/shared';

/**
 * Handle course details request
 */
export function handleCourseDetails(slug: string): CourseDetailsResponse {
  const course = getCourseBySlug(slug);

  if (!course) {
    throw new Error(`Course not found: ${slug}`);
  }

  // Get category
  const category = categories.find((c) => c.id === course.categoryId);
  if (!category) {
    throw new Error(`Category not found for course: ${slug}`);
  }

  // Get all active offerings for this course
  const allOfferings = getOfferingsByCourse(course.id);
  const offerings = allOfferings.filter((o) => o.active);

  if (offerings.length === 0) {
    throw new Error(`No active offerings found for course: ${slug}`);
  }

  // Get unique modalities
  const modalityMap = new Map();
  offerings.forEach((o) => {
    const key = o.modality.id;
    if (!modalityMap.has(key)) {
      modalityMap.set(key, {
        id: o.modality.id,
        name: o.modality.name,
        slug: o.modality.slug,
      });
    }
  });
  const modalities = Array.from(modalityMap.values());

  // Get unique units
  const unitMap = new Map();
  offerings.forEach((o) => {
    const key = o.unit.id;
    if (!unitMap.has(key)) {
      unitMap.set(key, {
        id: o.unit.id,
        name: o.unit.name,
        city: o.unit.city,
        state: o.unit.state,
        address: o.unit.address,
      });
    }
  });
  const units = Array.from(unitMap.values());

  // Get minimum price
  const prices = offerings
    .map((o) => o.price)
    .filter((p): p is number => p !== null && p !== undefined);
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;

  // Build response
  return {
    id: course.id,
    name: course.name,
    slug: course.slug,
    description: course.description || '',
    type: course.type || 'Não informado',
    workload: course.workload ? String(course.workload) : null,
    category: {
      id: category.id,
      name: category.name,
    },
    duration: offerings[0]?.duration || 'Não informado',
    priceFrom: minPrice ? formatPrice(minPrice) : null,
    modalities,
    units,
    offerings: offerings.map((offering) => ({
      id: offering.id,
      unitId: offering.unitId,
      modalityId: offering.modalityId,
      periodId: offering.periodId,
      price: offering.price,
      duration: offering.duration,
      enrollmentOpen: offering.enrollmentOpen,
      unit: {
        id: offering.unit.id,
        name: offering.unit.name,
        city: offering.unit.city,
        state: offering.unit.state,
      },
      modality: {
        id: offering.modality.id,
        name: offering.modality.name,
        slug: offering.modality.slug,
      },
      period: {
        id: offering.period.id,
        name: offering.period.name,
      },
    })),
  };
}

