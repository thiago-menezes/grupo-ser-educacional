import {
  useArticlesQuery,
  useArticleQuery,
  useArticleBySlugQuery,
} from './api/query';

/**
 * Custom hook for fetching and managing articles list
 */
export const useArticles = (params?: Record<string, unknown>) => {
  const { data, isLoading, error, refetch } = useArticlesQuery(params);

  return {
    articles: data?.data ?? [],
    pagination: data?.meta.pagination,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Custom hook for fetching and managing a single article by ID
 */
export const useArticle = (id: number) => {
  const { data, isLoading, error, refetch } = useArticleQuery(id);

  return {
    article: data?.data,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Custom hook for fetching and managing a single article by slug
 */
export const useArticleBySlug = (slug: string) => {
  const { data, isLoading, error, refetch } = useArticleBySlugQuery(slug);

  // Strapi returns array even with filters, so take first item
  const article = data?.data?.[0];

  return {
    article,
    isLoading,
    error,
    refetch,
  };
};
