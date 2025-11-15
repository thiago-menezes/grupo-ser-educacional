import categoriesData from './categories.json';
import courseOfferingsData from './course_offerings.json';
import coursesData from './courses.json';
import institutionsData from './institutions.json';
import modalitiesData from './modalities.json';
import periodsData from './periods.json';
import unitsData from './units.json';

// Types
export type Institution = (typeof institutionsData)[number];
export type Unit = (typeof unitsData)[number];
export type Category = (typeof categoriesData)[number];
export type Modality = (typeof modalitiesData)[number];
export type Period = (typeof periodsData)[number];
export type Course = (typeof coursesData)[number];
export type CourseOffering = (typeof courseOfferingsData)[number];

// Enriched types (with relations populated)
export type CourseOfferingEnriched = CourseOffering & {
  course: Course & { category: Category };
  unit: Unit & { institution: Institution };
  modality: Modality;
  period: Period;
};

// Data exports
export const institutions = institutionsData;
export const units = unitsData;
export const categories = categoriesData;
export const modalities = modalitiesData;
export const periods = periodsData;
export const courses = coursesData;
export const courseOfferings = courseOfferingsData;

// Helper functions

/**
 * Get all course offerings for a specific unit
 */
export function getOfferingsByUnit(unitId: number): CourseOfferingEnriched[] {
  return courseOfferings
    .filter((offering) => offering.unitId === unitId)
    .map((offering) => enrichOffering(offering));
}

/**
 * Get all course offerings for a specific course
 */
export function getOfferingsByCourse(
  courseId: number,
): CourseOfferingEnriched[] {
  return courseOfferings
    .filter((offering) => offering.courseId === courseId)
    .map((offering) => enrichOffering(offering));
}

/**
 * Get all course offerings for a specific institution
 */
export function getOfferingsByInstitution(
  institutionId: number,
): CourseOfferingEnriched[] {
  const unitIds = units
    .filter((unit) => unit.institutionId === institutionId)
    .map((unit) => unit.id);

  return courseOfferings
    .filter((offering) => unitIds.includes(offering.unitId))
    .map((offering) => enrichOffering(offering));
}

/**
 * Get all courses in a specific category
 */
export function getCoursesByCategory(categoryId: number): Course[] {
  return courses.filter((course) => course.categoryId === categoryId);
}

/**
 * Get course offerings filtered by modality
 */
export function getOfferingsByModality(
  modalityId: number,
): CourseOfferingEnriched[] {
  return courseOfferings
    .filter((offering) => offering.modalityId === modalityId)
    .map((offering) => enrichOffering(offering));
}

/**
 * Enrich a course offering with related data
 */
export function enrichOffering(
  offering: CourseOffering,
): CourseOfferingEnriched {
  const course = courses.find((c) => c.id === offering.courseId);
  const unit = units.find((u) => u.id === offering.unitId);
  const modality = modalities.find((m) => m.id === offering.modalityId);
  const period = periods.find((p) => p.id === offering.periodId);
  const institution = institutions.find((i) => i.id === unit?.institutionId);
  const category = categories.find((c) => c.id === course?.categoryId);

  if (!course || !unit || !modality || !period || !institution || !category) {
    throw new Error(`Missing related data for offering ${offering.id}`);
  }

  return {
    ...offering,
    course: {
      ...course,
      category,
    },
    unit: {
      ...unit,
      institution,
    },
    modality,
    period,
  };
}

/**
 * Get all active course offerings
 */
export function getActiveOfferings(): CourseOfferingEnriched[] {
  return courseOfferings
    .filter((offering) => offering.active)
    .map((offering) => enrichOffering(offering));
}

/**
 * Get all course offerings with enrollment open
 */
export function getOfferingsWithEnrollmentOpen(): CourseOfferingEnriched[] {
  return courseOfferings
    .filter((offering) => offering.enrollmentOpen && offering.active)
    .map((offering) => enrichOffering(offering));
}

/**
 * Search courses by name
 */
export function searchCourses(query: string): Course[] {
  const lowerQuery = query.toLowerCase();
  return courses.filter(
    (course) =>
      course.name.toLowerCase().includes(lowerQuery) ||
      course.description?.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get units by institution
 */
export function getUnitsByInstitution(institutionId: number): Unit[] {
  return units.filter((unit) => unit.institutionId === institutionId);
}

/**
 * Get institution by slug
 */
export function getInstitutionBySlug(slug: string): Institution | undefined {
  return institutions.find((inst) => inst.slug === slug);
}

/**
 * Get course by slug
 */
export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((course) => course.slug === slug);
}

/**
 * Get all unique cities from units
 */
export function getAvailableCities(): Array<{ city: string; state: string }> {
  const cityMap = new Map<string, { city: string; state: string }>();
  units.forEach((unit) => {
    const key = `${unit.city}-${unit.state}`;
    if (!cityMap.has(key)) {
      cityMap.set(key, { city: unit.city, state: unit.state });
    }
  });
  return Array.from(cityMap.values()).sort((a, b) =>
    a.city.localeCompare(b.city),
  );
}

/**
 * Get all courses available (with at least one active offering)
 */
export function getAvailableCourses(): Course[] {
  const courseIds = new Set(
    courseOfferings.filter((o) => o.active).map((o) => o.courseId),
  );
  return courses.filter((c) => courseIds.has(c.id));
}

/**
 * Extract years from duration string (e.g., "5 anos" -> 5)
 */
export function extractYearsFromDuration(duration: string): number | null {
  const match = duration.match(/(\d+)\s*ano/);
  return match ? parseInt(match[1], 10) : null;
}
