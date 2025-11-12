import axios from 'axios';

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export const strapiClient = axios.create({
  baseURL: `${STRAPI_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export function buildStrapiQuery(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, String(v)));
    } else if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}

export function getStrapiMediaUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${STRAPI_BASE_URL}${path}`;
}

export const query = async <T>(
  endpoint: string,
  params?: Record<string, unknown>,
) => {
  const { data } = await strapiClient.get<T>(endpoint, { params });
  return data;
};

export const mutate = async <T, P>(
  endpoint: string,
  payload: P,
  method: 'post' | 'put' | 'delete' | 'patch' | 'get' = 'post',
) => {
  const { data } = await strapiClient[method]<T>(endpoint, payload);
  return data;
};
