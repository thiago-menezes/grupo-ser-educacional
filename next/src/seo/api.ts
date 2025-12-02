import { Metadata } from 'next';
import type { StrapiSeo, StrapiSeoResponse } from './types';

function getBaseUrl(): string {
  // Server-side: construct absolute URL
  if (typeof window === 'undefined') {
    // In production, use the deployment URL
    if (process.env.VERCEL_URL) {
      const baseUrl = `https://${process.env.VERCEL_URL}`;
      console.log('Using VERCEL_URL for SEO API:', baseUrl);
      return baseUrl;
    }
    // If custom API base URL is configured
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
      // Remove /api suffix if present since we'll add /api/seos
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL.replace(
        /\/api$/,
        '',
      );
      console.log('Using NEXT_PUBLIC_API_BASE_URL for SEO API:', baseUrl);
      return baseUrl;
    }
    // Fallback to NextAuth URL if available
    if (process.env.NEXTAUTH_URL) {
      console.log('Using NEXTAUTH_URL for SEO API:', process.env.NEXTAUTH_URL);
      return process.env.NEXTAUTH_URL;
    }
    // Development fallback
    console.log('Using localhost fallback for SEO API');
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

    // Log for debugging in production
    if (process.env.NODE_ENV === 'production') {
      console.log('SEO API Request:', { baseUrl, apiUrl, institutionSlug });
    }

    // In development, bypass cache to see changes immediately
    const revalidate = process.env.NODE_ENV === 'development' ? 0 : 3600;

    // Add timeout for build time (10 seconds for production)
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      process.env.NODE_ENV === 'production' ? 10000 : 5000,
    );

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
      const errorText = await response.text();
      if (process.env.NODE_ENV === 'production') {
        console.error('SEO API Error:', {
          status: response.status,
          statusText: response.statusText,
          errorText,
        });
      }
      throw new Error(
        `Failed to fetch SEO: ${response.status} ${response.statusText}`,
      );
    }

    const strapiResponse: StrapiSeoResponse = await response.json();

    if (!strapiResponse.data || strapiResponse.data.length === 0) {
      if (process.env.NODE_ENV === 'production') {
        console.log('SEO API: No data found for institution:', institutionSlug);
      }
      return {
        metadata: {
          title: 'Grupo SER - Portal Institucional',
          description: 'Portal multi-institucional do Grupo SER Educacional',
        } as Metadata,
        jsonld: {} as StrapiSeo['jsonld'],
      } as StrapiSeo;
    }

    if (process.env.NODE_ENV === 'production') {
      console.log(
        'SEO API: Successfully fetched data for institution:',
        institutionSlug,
      );
    }

    return strapiResponse.data[0];
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error('SEO API Error:', error);
    }
    return {
      metadata: {
        title: 'Grupo SER - Portal Institucional',
        description: 'Portal multi-institucional do Grupo SER Educacional',
      } as Metadata,
      jsonld: {} as StrapiSeo['jsonld'],
    } as StrapiSeo;
  }
}
