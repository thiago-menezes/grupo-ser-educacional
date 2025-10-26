/**
 * Strapi v5 Media type
 */
export interface StrapiMedia {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: MediaFormat;
    small?: MediaFormat;
    medium?: MediaFormat;
    large?: MediaFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string | null;
  provider: string;
  provider_metadata?: unknown;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface MediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
}

/**
 * Shared component: Rich Text
 */
export interface RichTextBlock {
  __component: 'shared.rich-text';
  id: number;
  body: string;
}

/**
 * Shared component: Media
 */
export interface MediaBlock {
  __component: 'shared.media';
  id: number;
  file?: StrapiMedia;
}

/**
 * Shared component: Quote
 */
export interface QuoteBlock {
  __component: 'shared.quote';
  id: number;
  title?: string;
  body: string;
}

/**
 * Shared component: Slider
 */
export interface SliderBlock {
  __component: 'shared.slider';
  id: number;
  files?: StrapiMedia[];
}

/**
 * Union type for all possible block types in the dynamic zone
 */
export type ArticleBlock = RichTextBlock | MediaBlock | QuoteBlock | SliderBlock;

/**
 * Author type (Strapi v5 flat structure)
 */
export interface Author {
  id: number;
  documentId: string;
  name: string;
  email?: string;
  avatar?: StrapiMedia | null;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

/**
 * Category type (Strapi v5 flat structure)
 */
export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

/**
 * Article type (Strapi v5 flat structure)
 */
export interface Article {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  cover?: StrapiMedia | null;
  author?: Author | null;
  category?: Category | null;
  blocks?: ArticleBlock[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

/**
 * Response type for fetching a single article
 */
export interface ArticleResponse {
  article: Article;
}

/**
 * Response type for fetching multiple articles
 */
export interface ArticlesResponse {
  articles: Article[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
