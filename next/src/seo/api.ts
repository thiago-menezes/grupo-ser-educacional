import { Metadata } from 'next';
import type { StrapiSeo, StrapiSeoResponse } from './types';

function getBaseUrl(): string {
  // Server-side: construct absolute URL
  if (typeof window === 'undefined') {
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
      // Remove /api suffix if present since we'll add /api/seos
      return process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/api$/, '');
    }
    if (process.env.NEXTAUTH_URL) {
      return process.env.NEXTAUTH_URL;
    }
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    return 'http://localhost:3000';
  }
  // Client-side: use relative URL
  return '';
}

export async function getSeoFromStrapi(
  institutionSlug: string,
): Promise<StrapiSeoResponse['data'][0] | null> {
  try {
    const baseUrl = getBaseUrl();
    const apiUrl = `${baseUrl}/api/seos?institutionSlug=${encodeURIComponent(institutionSlug)}`;

    // In development, bypass cache to see changes immediately
    const revalidate = process.env.NODE_ENV === 'development' ? 0 : 3600;

    // Add timeout for build time (5 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add cache-busting in development
        ...(process.env.NODE_ENV === 'development'
          ? { 'Cache-Control': 'no-cache' }
          : {}),
      },
      next: { revalidate },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch SEO: ${response.statusText}`);
    }

    const strapiResponse: StrapiSeoResponse = await response.json();

    if (!strapiResponse.data || strapiResponse.data.length === 0) {
      return {
        metadata: {
          title: 'Grupo SER - Portal Institucional',
          description: 'Portal multi-institucional do Grupo SER Educacional',
        } as Metadata,
        jsonld: {} as StrapiSeo['jsonld'],
      } as StrapiSeo;
    }

    return strapiResponse.data[0];
  } catch {
    return {
      metadata: {
        title: 'Grupo SER - Portal Institucional',
        description: 'Portal multi-institucional do Grupo SER Educacional',
      } as Metadata,
      jsonld: {} as StrapiSeo['jsonld'],
    } as StrapiSeo;
  }
}
