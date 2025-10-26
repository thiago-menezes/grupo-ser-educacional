import axios, { type AxiosInstance } from 'axios';

/**
 * Strapi API Client
 *
 * Configured with:
 * - Base URL from STRAPI_URL environment variable
 * - Bearer token authentication from NEXT_PUBLIC_STRAPI_TOKEN
 * - 30-second timeout
 * - JSON content type
 */
export const createStrapiClient = (): AxiosInstance => {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const strapiToken = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

  if (!strapiUrl) {
    throw new Error(
      'NEXT_PUBLIC_STRAPI_URL environment variable is not defined',
    );
  }

  if (!strapiToken) {
    throw new Error(
      'NEXT_PUBLIC_STRAPI_TOKEN environment variable is not defined',
    );
  }

  const client = axios.create({
    baseURL: strapiUrl,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${strapiToken}`,
    },
    timeout: 30000,
  });

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Strapi API Error:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          message: error.response?.data?.error?.message || error.message,
        });
      }
      return Promise.reject(error);
    },
  );

  return client;
};

// Singleton instance for server-side use
export const strapiClient = createStrapiClient();

/**
 * Generic query helper for GET requests
 * @param endpoint - API endpoint (e.g., '/api/articles')
 * @param params - Query parameters
 */
export const strapiQuery = async <T>(
  endpoint: string,
  params?: Record<string, unknown>,
): Promise<T> => {
  const { data } = await strapiClient.get<T>(endpoint, { params });
  return data;
};

/**
 * Generic mutation helper for POST/PUT/PATCH/DELETE requests
 * @param endpoint - API endpoint
 * @param payload - Request payload
 * @param method - HTTP method
 */
export const strapiMutate = async <T, P = unknown>(
  endpoint: string,
  payload?: P,
  method: 'post' | 'put' | 'patch' | 'delete' = 'post',
): Promise<T> => {
  const { data } = await strapiClient[method]<T>(endpoint, payload);
  return data;
};

/**
 * Strapi-specific types for common response structures
 */
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiEntity<T> {
  id: number;
  attributes: T & {
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
  };
}

export interface StrapiError {
  error: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
