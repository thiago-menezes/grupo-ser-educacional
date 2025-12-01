import { CoursesQueryParams, CoursesResponse } from 'types/api/courses';
import {
  enrichOffering,
  courseOfferings,
  units,
  institutions,
  courses,
  extractYearsFromDuration,
} from '../../data';
import { transformOfferingsToCourseData } from '../../transformers';

const DEFAULT_PER_PAGE = 12;

/**
 * Helper to get institution ID from slug or ID string
 */
function getInstitutionId(param: string): number | null {
  const id = parseInt(param, 10);
  if (!isNaN(id)) {
    const institution = institutions.find((inst) => inst.id === id);
    if (institution) return institution.id;
  }

  const institution = institutions.find(
    (inst) => inst.slug.toLowerCase() === param.toLowerCase(),
  );
  return institution ? institution.id : null;
}

/**
 * Helper to get course ID from slug or ID string
 */
function getCourseId(param: string): number | null {
  const id = parseInt(param, 10);
  if (!isNaN(id)) {
    const course = courses.find((c) => c.id === id);
    if (course) return course.id;
  }

  const course = courses.find(
    (c) => c.slug.toLowerCase() === param.toLowerCase(),
  );
  return course ? course.id : null;
}

/**
 * Handle courses list request
 */
export function handleCoursesList(params: CoursesQueryParams): CoursesResponse {
  let filteredOfferings = courseOfferings.filter((o) => o.active);

  // Filter by institution
  if (params.institution) {
    const institutionId = getInstitutionId(params.institution);
    if (institutionId) {
      filteredOfferings = filteredOfferings.filter((offering) => {
        const unit = units.find((u) => u.id === offering.unitId);
        return unit?.institutionId === institutionId;
      });
    } else {
      throw new Error(`Institution not found: ${params.institution}`);
    }
  }

  // Filter by location (city as free text input)
  if (params.location) {
    const locationLower = params.location.toLowerCase().trim();
    const relevantUnits = units.filter((unit) =>
      unit.city.toLowerCase().includes(locationLower),
    );

    const relevantUnitIds = relevantUnits.map((u) => u.id);
    filteredOfferings = filteredOfferings.filter((offering) =>
      relevantUnitIds.includes(offering.unitId),
    );
  }

  // Filter by modality
  if (params.modality !== undefined) {
    filteredOfferings = filteredOfferings.filter(
      (offering) => offering.modalityId === params.modality,
    );
  }

  // Filter by category
  if (params.category !== undefined) {
    filteredOfferings = filteredOfferings.filter((offering) => {
      const enriched = enrichOffering(offering);
      return enriched.course.categoryId === params.category;
    });
  }

  // Filter by enrollment status
  if (params.enrollmentOpen !== undefined) {
    filteredOfferings = filteredOfferings.filter(
      (offering) => offering.enrollmentOpen === params.enrollmentOpen,
    );
  }

  // Filter by period (turno)
  if (params.period !== undefined) {
    filteredOfferings = filteredOfferings.filter(
      (offering) => offering.periodId === params.period,
    );
  }

  // Filter by price range
  if (params.priceMin !== undefined || params.priceMax !== undefined) {
    const priceMin = params.priceMin ?? 0;
    const priceMax = params.priceMax ?? Infinity;

    filteredOfferings = filteredOfferings.filter(
      (offering) => offering.price >= priceMin && offering.price <= priceMax,
    );
  }

  // Filter by duration range
  if (params.durationRange) {
    filteredOfferings = filteredOfferings.filter((offering) => {
      const years = extractYearsFromDuration(offering.duration);
      if (years === null) return false;

      switch (params.durationRange) {
        case '1-2':
          return years >= 1 && years <= 2;
        case '2-3':
          return years >= 2 && years <= 3;
        case '3-4':
          return years >= 3 && years <= 4;
        case '4+':
          return years > 4;
        default:
          return true;
      }
    });
  }

  // Filter by level (graduação/pós-graduação)
  if (params.level) {
    filteredOfferings = filteredOfferings.filter((offering) => {
      const enriched = enrichOffering(offering);
      return enriched.course.level === params.level;
    });
  }

  // Filter by specific course
  if (params.course) {
    const courseId = getCourseId(params.course);
    if (courseId) {
      filteredOfferings = filteredOfferings.filter(
        (offering) => offering.courseId === courseId,
      );
    }
  }

  // Enrich offerings with related data
  const enrichedOfferings = filteredOfferings.map((offering) =>
    enrichOffering(offering),
  );

  // Pagination
  const page = params.page ? Math.max(1, params.page) : 1;
  const perPage = params.perPage
    ? Math.max(1, Math.min(100, params.perPage))
    : DEFAULT_PER_PAGE;

  const total = enrichedOfferings.length;
  const totalPages = Math.ceil(total / perPage);
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedOfferings = enrichedOfferings.slice(startIndex, endIndex);

  // Transform to CourseData format
  const transformedCourses = transformOfferingsToCourseData(paginatedOfferings);

  return {
    total,
    currentPage: page,
    totalPages,
    perPage,
    courses: transformedCourses,
  };
}
