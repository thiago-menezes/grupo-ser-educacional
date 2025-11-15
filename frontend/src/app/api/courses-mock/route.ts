import { NextRequest, NextResponse } from 'next/server';
import {
  enrichOffering,
  courseOfferings,
  units,
  institutions,
  courses,
  extractYearsFromDuration,
} from '@/data';
import { findUnitsWithinRadius } from '@/data/utils';

const DEFAULT_PER_PAGE = 12;
const DEFAULT_RADIUS_KM = 50; // Default radius for location-based search

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Filter parameters
  const institutionParam = searchParams.get('institution'); // slug or id
  const cityParam = searchParams.get('city');
  const stateParam = searchParams.get('state');
  const latParam = searchParams.get('lat');
  const lonParam = searchParams.get('lon');
  const radiusParam = searchParams.get('radius'); // in km

  // Pagination
  const pageParam = searchParams.get('page');
  const perPageParam = searchParams.get('perPage');

  // Additional filters
  const modalityParam = searchParams.get('modality');
  const categoryParam = searchParams.get('category');
  const enrollmentOpenParam = searchParams.get('enrollmentOpen');
  const periodParam = searchParams.get('period'); // Turno
  const priceMinParam = searchParams.get('priceMin');
  const priceMaxParam = searchParams.get('priceMax');
  const durationRangeParam = searchParams.get('durationRange'); // '1-2', '2-3', '3-4', '4+'
  const levelParam = searchParams.get('level'); // 'graduacao' or 'pos-graduacao'
  const courseParam = searchParams.get('course'); // course slug or id

  try {
    let filteredOfferings = courseOfferings.filter((o) => o.active);

    // Filter by institution
    if (institutionParam) {
      const institutionId = getInstitutionId(institutionParam);
      if (institutionId) {
        filteredOfferings = filteredOfferings.filter((offering) => {
          const unit = units.find((u) => u.id === offering.unitId);
          return unit?.institutionId === institutionId;
        });
      } else {
        return NextResponse.json(
          { error: `Institution not found: ${institutionParam}` },
          { status: 404 },
        );
      }
    }

    // Filter by city and/or state
    if (cityParam || stateParam) {
      const relevantUnits = units.filter((unit) => {
        const cityMatch =
          !cityParam || unit.city.toLowerCase() === cityParam.toLowerCase();
        const stateMatch =
          !stateParam || unit.state.toUpperCase() === stateParam.toUpperCase();
        return cityMatch && stateMatch;
      });

      const relevantUnitIds = relevantUnits.map((u) => u.id);
      filteredOfferings = filteredOfferings.filter((offering) =>
        relevantUnitIds.includes(offering.unitId),
      );
    }

    // Filter by latitude/longitude (radius search)
    if (latParam && lonParam) {
      const lat = parseFloat(latParam);
      const lon = parseFloat(lonParam);
      const radius = radiusParam ? parseFloat(radiusParam) : DEFAULT_RADIUS_KM;

      if (isNaN(lat) || isNaN(lon)) {
        return NextResponse.json(
          { error: 'Invalid latitude or longitude values' },
          { status: 400 },
        );
      }

      if (isNaN(radius) || radius <= 0) {
        return NextResponse.json(
          { error: 'Radius must be a positive number' },
          { status: 400 },
        );
      }

      const unitsInRadius = findUnitsWithinRadius(units, lat, lon, radius);
      const unitIdsInRadius = unitsInRadius.map((u) => u.id);
      filteredOfferings = filteredOfferings.filter((offering) =>
        unitIdsInRadius.includes(offering.unitId),
      );
    }

    // Filter by modality
    if (modalityParam) {
      const modalityId = parseInt(modalityParam, 10);
      if (!isNaN(modalityId)) {
        filteredOfferings = filteredOfferings.filter(
          (offering) => offering.modalityId === modalityId,
        );
      }
    }

    // Filter by category
    if (categoryParam) {
      const categoryId = parseInt(categoryParam, 10);
      if (!isNaN(categoryId)) {
        filteredOfferings = filteredOfferings.filter((offering) => {
          const enriched = enrichOffering(offering);
          return enriched.course.categoryId === categoryId;
        });
      }
    }

    // Filter by enrollment status
    if (enrollmentOpenParam !== null) {
      const enrollmentOpen = enrollmentOpenParam === 'true';
      filteredOfferings = filteredOfferings.filter(
        (offering) => offering.enrollmentOpen === enrollmentOpen,
      );
    }

    // Filter by period (turno)
    if (periodParam) {
      const periodId = parseInt(periodParam, 10);
      if (!isNaN(periodId)) {
        filteredOfferings = filteredOfferings.filter(
          (offering) => offering.periodId === periodId,
        );
      }
    }

    // Filter by price range
    if (priceMinParam || priceMaxParam) {
      const priceMin = priceMinParam ? parseFloat(priceMinParam) : 0;
      const priceMax = priceMaxParam ? parseFloat(priceMaxParam) : Infinity;

      if (!isNaN(priceMin) && !isNaN(priceMax)) {
        filteredOfferings = filteredOfferings.filter(
          (offering) =>
            offering.price >= priceMin && offering.price <= priceMax,
        );
      }
    }

    // Filter by duration range
    if (durationRangeParam) {
      filteredOfferings = filteredOfferings.filter((offering) => {
        const years = extractYearsFromDuration(offering.duration);
        if (years === null) return false;

        switch (durationRangeParam) {
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
    if (levelParam) {
      filteredOfferings = filteredOfferings.filter((offering) => {
        const enriched = enrichOffering(offering);
        return enriched.course.level === levelParam;
      });
    }

    // Filter by specific course
    if (courseParam) {
      const courseId = getCourseId(courseParam);
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
    const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
    const perPage = perPageParam
      ? Math.max(1, Math.min(100, parseInt(perPageParam, 10)))
      : DEFAULT_PER_PAGE;

    const total = enrichedOfferings.length;
    const totalPages = Math.ceil(total / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedOfferings = enrichedOfferings.slice(startIndex, endIndex);

    // Transform to API response format
    const courses = paginatedOfferings.map((offering) => ({
      id: offering.id,
      course: {
        id: offering.course.id,
        name: offering.course.name,
        slug: offering.course.slug,
        category: {
          id: offering.course.category.id,
          name: offering.course.category.name,
          slug: offering.course.category.slug,
        },
        type: offering.course.type,
        workload: offering.course.workload,
        description: offering.course.description,
        featured: offering.course.featured,
      },
      unit: {
        id: offering.unit.id,
        name: offering.unit.name,
        address: offering.unit.address,
        city: offering.unit.city,
        state: offering.unit.state,
        coordinates: {
          lat: offering.unit.latitude,
          lng: offering.unit.longitude,
        },
        institution: {
          id: offering.unit.institution.id,
          name: offering.unit.institution.name,
          slug: offering.unit.institution.slug,
          code: offering.unit.institution.code,
        },
      },
      modality: {
        id: offering.modality.id,
        name: offering.modality.name,
        slug: offering.modality.slug,
        code: offering.modality.code,
      },
      period: {
        id: offering.period.id,
        name: offering.period.name,
        slug: offering.period.slug,
        code: offering.period.code,
      },
      price: offering.price,
      duration: offering.duration,
      enrollmentOpen: offering.enrollmentOpen,
    }));

    return NextResponse.json({
      total,
      currentPage: page,
      totalPages,
      perPage,
      courses,
      filters: {
        institution: institutionParam || null,
        city: cityParam || null,
        state: stateParam || null,
        coordinates:
          latParam && lonParam
            ? {
                lat: parseFloat(latParam),
                lon: parseFloat(lonParam),
                radius: radiusParam
                  ? parseFloat(radiusParam)
                  : DEFAULT_RADIUS_KM,
              }
            : null,
        modality: modalityParam || null,
        category: categoryParam || null,
        enrollmentOpen: enrollmentOpenParam || null,
        period: periodParam || null,
        priceRange:
          priceMinParam || priceMaxParam
            ? {
                min: priceMinParam ? parseFloat(priceMinParam) : null,
                max: priceMaxParam ? parseFloat(priceMaxParam) : null,
              }
            : null,
        durationRange: durationRangeParam || null,
        level: levelParam || null,
        course: courseParam || null,
      },
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch courses',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * Helper to get institution ID from slug or ID string
 */
function getInstitutionId(param: string): number | null {
  // Try as ID first
  const id = parseInt(param, 10);
  if (!isNaN(id)) {
    const institution = institutions.find((inst) => inst.id === id);
    if (institution) return institution.id;
  }

  // Try as slug
  const institution = institutions.find(
    (inst) => inst.slug.toLowerCase() === param.toLowerCase(),
  );
  return institution ? institution.id : null;
}

/**
 * Helper to get course ID from slug or ID string
 */
function getCourseId(param: string): number | null {
  // Try as ID first
  const id = parseInt(param, 10);
  if (!isNaN(id)) {
    const course = courses.find((c) => c.id === id);
    if (course) return course.id;
  }

  // Try as slug
  const course = courses.find(
    (c) => c.slug.toLowerCase() === param.toLowerCase(),
  );
  return course ? course.id : null;
}
