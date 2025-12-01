/**
 * BFF service initialization
 * Creates and configures BFF clients for use in Next.js API routes
 */

import { createStrapiClient } from '@/packages/bff/services/strapi';

const STRAPI_URL = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

/**
 * Get Strapi client instance
 */
export function getStrapiClient() {
  if (!STRAPI_URL) {
    throw new Error('STRAPI_URL environment variable is not configured');
  }
  return createStrapiClient(STRAPI_URL, STRAPI_TOKEN);
}
