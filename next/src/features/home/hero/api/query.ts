import { useQuery } from '@tanstack/react-query';
import { query } from '@/libs';
import { getMediaUrl } from '@/packages/utils';
import { HOME_HERO_QUERY_KEY, DEFAULT_HERO_CONTENT } from '../constants';
import type { HeroContent } from '../types';
import type {
  HomePageResponseDTO,
  CourseSearchQueryDTO,
  CourseSearchResultDTO,
  HomeCarouselResponseDTO,
} from './types';

async function fetchHeroContent(institutionSlug: string): Promise<HeroContent> {
  try {
    const response = await fetch(
      `/api/home-pages?filters[institution][slug][$eq]=${institutionSlug}&populate[hero][populate]=*`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch hero content: ${response.statusText}`);
    }

    const data: HomePageResponseDTO = await response.json();

    if (!data.data?.attributes?.hero) {
      return DEFAULT_HERO_CONTENT;
    }

    return {
      backgroundImage: {
        url: data.data.attributes.hero.attributes.backgroundImage.data
          .attributes.url,
        alternativeText:
          data.data.attributes.hero.attributes.backgroundImage.data.attributes
            .alternativeText,
      },
      showCarouselControls:
        data.data.attributes.hero.attributes.showCarouselControls ?? true,
      showQuickSearch:
        data.data.attributes.hero.attributes.showQuickSearch ?? true,
    };
  } catch {
    return DEFAULT_HERO_CONTENT;
  }
}

export function useHeroContent(institutionSlug: string) {
  return useQuery({
    queryKey: [...HOME_HERO_QUERY_KEY, institutionSlug],
    queryFn: () => fetchHeroContent(institutionSlug),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

async function searchCourses(
  params: CourseSearchQueryDTO,
): Promise<CourseSearchResultDTO[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params.city) queryParams.append('city', params.city);
    if (params.course) queryParams.append('course', params.course);
    if (params.modalities?.length) {
      params.modalities.forEach((m) => queryParams.append('modalities[]', m));
    }

    const response = await fetch(
      `/api/courses/search?${queryParams.toString()}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to search courses: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export function useCoursesSearch(
  params: CourseSearchQueryDTO,
  enabled = false,
) {
  return useQuery({
    queryKey: [...HOME_HERO_QUERY_KEY, 'search', params],
    queryFn: () => searchCourses(params),
    enabled,
    staleTime: 10 * 60 * 1000,
  });
}

export type CarouselItem = {
  desktopImage: string;
  alt?: string;
};

async function fetchHomeCarousel(
  institutionSlug: string,
): Promise<CarouselItem[]> {
  try {
    const data = await query<HomeCarouselResponseDTO>('/home-carousels', {
      institutionSlug,
    });

    if (!data.data || data.data.length === 0) {
      return [];
    }

    const items: CarouselItem[] = [];

    for (const item of data.data) {
      const desktopUrl = item.desktop?.url;
      const alt =
        item.desktop?.alternativeText || item.nome || 'Hero banner';

      if (!desktopUrl) {
        continue;
      }

      items.push({
        desktopImage: getMediaUrl(desktopUrl),
        alt,
      });
    }

    return items;
  } catch {
    return [];
  }
}

export function useHomeCarousel(institutionSlug: string) {
  return useQuery({
    queryKey: [...HOME_HERO_QUERY_KEY, 'carousel', institutionSlug],
    queryFn: () => fetchHomeCarousel(institutionSlug),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
