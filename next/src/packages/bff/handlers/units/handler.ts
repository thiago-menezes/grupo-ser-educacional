import type { StrapiClient } from '../../services/strapi';
import type { StrapiUnitsResponse, UnitsQueryParams } from './types';

/**
 * Handle units request
 */
export async function handleUnits(
  strapiClient: StrapiClient,
  params: UnitsQueryParams,
): Promise<StrapiUnitsResponse> {
  // First, verify the institution exists
  const institutionCheck = await strapiClient.fetch<{
    data: Array<{ id: number; slug: string; name: string }>;
  }>('institutions', {
    filters: {
      slug: { $eq: params.institutionSlug },
    },
  });

  if (!institutionCheck.data || institutionCheck.data.length === 0) {
    throw new Error(
      `Institution with slug "${params.institutionSlug}" not found. Available institutions can be checked at: http://localhost:1337/admin/content-manager/collectionType/api::institution/institution`,
    );
  }

  // Fetch units with institution filter
  const units = await strapiClient.fetch<StrapiUnitsResponse>('units', {
    filters: {
      institution: {
        slug: { $eq: params.institutionSlug },
      },
    },
    populate: ['institution', 'photos'],
  });

  if (!units.data || units.data.length === 0) {
    throw new Error(
      `No units found for institution "${params.institutionSlug}". Units can be managed at: http://localhost:1337/admin/content-manager/collectionType/api::unit/unit`,
    );
  }

  return units;
}
