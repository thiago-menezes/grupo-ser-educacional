/**
 * BFF service initialization
 * Creates and configures BFF clients for use in Next.js API routes
 */

import { createStrapiClient } from '@grupo-ser/bff';

const STRAPI_URL = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL;

/**
 * Get Strapi client instance
 */
export function getStrapiClient() {
  if (!STRAPI_URL) {
    throw new Error('STRAPI_URL environment variable is not configured');
  }
  return createStrapiClient(STRAPI_URL);
}
