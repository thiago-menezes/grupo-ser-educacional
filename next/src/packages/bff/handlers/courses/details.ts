import { CourseDetailsResponse } from 'types/api/courses';
import {
  createClientApiClient,
  type ClientApiCourseDetails,
} from '../../services/client-api';

export type ClientApiParams = {
  institution: string;
  state: string;
  city: string;
  unit: string;
  sku: string;
  admissionForm?: string;
};

/**
 * Fetch course details from Client API
 * Returns pricing, shifts (turnos), admission forms, and payment info
 */
export async function fetchCourseDetailsFromClientApi(
  params: ClientApiParams,
): Promise<ClientApiCourseDetails> {
  const { institution, state, city, unit, sku } = params;

  const baseUrl = process.env.API_BASE_URL || process.env.CLIENT_API_BASE_URL;
  if (!baseUrl) {
    throw new Error('API_BASE_URL environment variable is not configured');
  }

  const clientApiClient = createClientApiClient(baseUrl);

  const clientApiDetails = await clientApiClient.fetchCourseDetails(
    institution,
    state,
    city,
    parseInt(unit, 10),
    sku,
  );

  return clientApiDetails;
}

/**
 * Handle course details request combining Strapi and Client API data
 */
export async function handleCourseDetailsWithClientApi(
  strapiCourse: CourseDetailsResponse,
  clientApiParams: ClientApiParams,
): Promise<CourseDetailsResponse> {
  try {
    const clientApiDetails =
      await fetchCourseDetailsFromClientApi(clientApiParams);

    return {
      ...strapiCourse,
      clientApiDetails,
    };
  } catch (error) {
    console.warn('[CourseDetails] Failed to fetch Client API details:', error);
    // Return Strapi data without Client API enrichment
    return strapiCourse;
  }
}
