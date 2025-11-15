import type { UnitsQueryParams } from './types';
import type { StrapiClient } from '../../services/strapi';

/**
 * Handle units request
 */
export async function handleUnits(
  strapiClient: StrapiClient,
  params: UnitsQueryParams,
) {
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
      `Institution with slug "${params.institutionSlug}" not found`,
    );
  }

  // Fetch units with institution filter
  const units = await strapiClient.fetch('units', {
    filters: {
      institution: {
        slug: { $eq: params.institutionSlug },
      },
    },
    populate: ['institution'],
  });

  return units;
}

