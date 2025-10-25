import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { strapiQuery } from '@/libs/api/strapi';
import { ARTICLES_QUERY_KEY } from '../constants';
import type { ArticlesResponse, ArticleResponse } from './types';

/**
 * Fetch all articles from Strapi
 */
export const fetchArticles = async (
  params?: Record<string, unknown>,
): Promise<ArticlesResponse> => {
  return strapiQuery<ArticlesResponse>('/api/articles', {
    populate: '*',
    sort: 'publishedAt:desc',
    ...params,
  });
};

/**
 * Fetch a single article by ID
 */
export const fetchArticleById = async (
  id: number,
): Promise<ArticleResponse> => {
  return strapiQuery<ArticleResponse>(`/api/articles/${id}`, {
    populate: '*',
  });
};

/**
 * Fetch a single article by slug
 */
export const fetchArticleBySlug = async (
  slug: string,
): Promise<ArticlesResponse> => {
  return strapiQuery<ArticlesResponse>('/api/articles', {
    filters: { slug: { $eq: slug } },
    populate: '*',
  });
};

/**
 * React Query hook for fetching articles
 */
export const useArticlesQuery = (
  params?: Record<string, unknown>,
): UseQueryResult<ArticlesResponse, Error> => {
  return useQuery({
    queryKey: [...ARTICLES_QUERY_KEY, params],
    queryFn: () => fetchArticles(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * React Query hook for fetching a single article by ID
 */
export const useArticleQuery = (
  id: number,
): UseQueryResult<ArticleResponse, Error> => {
  return useQuery({
    queryKey: [...ARTICLES_QUERY_KEY, id],
    queryFn: () => fetchArticleById(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * React Query hook for fetching a single article by slug
 */
export const useArticleBySlugQuery = (
  slug: string,
): UseQueryResult<ArticlesResponse, Error> => {
  return useQuery({
    queryKey: [...ARTICLES_QUERY_KEY, 'slug', slug],
    queryFn: () => fetchArticleBySlug(slug),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
