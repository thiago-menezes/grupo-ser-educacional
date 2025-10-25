import type { StrapiEntity, StrapiResponse } from '@/libs/api/strapi';

/**
 * Article attributes from Strapi
 */
export interface ArticleAttributes {
  title: string;
  description: string;
  content: string;
  slug: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Article entity with Strapi structure
 */
export type Article = StrapiEntity<ArticleAttributes>;

/**
 * Response type for fetching multiple articles
 */
export type ArticlesResponse = StrapiResponse<Article[]>;

/**
 * Response type for fetching a single article
 */
export type ArticleResponse = StrapiResponse<Article>;
