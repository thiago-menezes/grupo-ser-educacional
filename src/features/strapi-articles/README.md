# Strapi Articles Feature

Example feature implementation for integrating with Strapi CMS.

## Structure

```
strapi-articles/
├── api/
│   ├── types.ts        # TypeScript types for articles
│   └── query.ts        # React Query hooks for fetching articles
├── constants.ts        # Query keys
├── hooks.ts            # Custom hooks wrapping React Query
├── index.tsx           # ArticlesList component
├── styles.module.scss  # Component styles
└── README.md           # This file
```

## Usage

### Basic Usage

```tsx
import { ArticlesList } from '@/features/strapi-articles';

export default function ArticlesPage() {
  return <ArticlesList />;
}
```

### Using Custom Hooks

```tsx
'use client';

import { useArticles, useArticleBySlug } from '@/features/strapi-articles/hooks';

// Fetch all articles
export function MyArticlesComponent() {
  const { articles, isLoading, error } = useArticles();
  // ... render logic
}

// Fetch article by slug
export function ArticleDetail({ slug }: { slug: string }) {
  const { article, isLoading, error } = useArticleBySlug(slug);
  // ... render logic
}
```

### Using React Query Hooks Directly

```tsx
import { useArticlesQuery } from '@/features/strapi-articles/api/query';

export function CustomArticlesComponent() {
  const { data, isLoading } = useArticlesQuery({
    pagination: { page: 1, pageSize: 10 },
    filters: { category: { $eq: 'news' } },
  });

  // ... render logic
}
```

## Strapi API Configuration

The Strapi client is configured in `src/libs/api/strapi.ts` and uses:

- **STRAPI_URL**: Base URL for your Strapi instance (e.g., http://localhost:1337)
- **STRAPI_TOKEN**: API token for authentication

These are defined in your `.env` file.

## Strapi Query Parameters

The Strapi API supports various query parameters:

### Pagination

```ts
useArticlesQuery({
  pagination: {
    page: 1,
    pageSize: 25,
  },
});
```

### Sorting

```ts
useArticlesQuery({
  sort: 'publishedAt:desc',
});
```

### Filtering

```ts
useArticlesQuery({
  filters: {
    title: { $contains: 'React' },
    publishedAt: { $gte: '2024-01-01' },
  },
});
```

### Population

```ts
useArticlesQuery({
  populate: '*', // Populate all relations
  // or
  populate: ['author', 'category'], // Populate specific relations
});
```

## Creating Your Own Strapi Feature

Follow this pattern for other Strapi content types:

1. **Create feature directory**: `src/features/strapi-{content-type}/`
2. **Define types**: `api/types.ts`
3. **Create React Query hooks**: `api/query.ts`
4. **Add constants**: `constants.ts` (query keys)
5. **Create custom hooks**: `hooks.ts`
6. **Build component**: `index.tsx`
7. **Add styles**: `styles.module.scss`

## Example: Creating a "Posts" Feature

```typescript
// api/types.ts
export interface PostAttributes {
  title: string;
  content: string;
  // ... other fields
}
export type Post = StrapiEntity<PostAttributes>;
export type PostsResponse = StrapiResponse<Post[]>;

// constants.ts
export const POSTS_QUERY_KEY = ['strapi', 'posts'] as const;

// api/query.ts
export const fetchPosts = async () => {
  return strapiQuery<PostsResponse>('/api/posts');
};

export const usePostsQuery = () => {
  return useQuery({
    queryKey: POSTS_QUERY_KEY,
    queryFn: fetchPosts,
  });
};

// hooks.ts
export const usePosts = () => {
  const { data, isLoading, error } = usePostsQuery();
  return {
    posts: data?.data ?? [],
    isLoading,
    error,
  };
};
```

## References

- [Strapi REST API Documentation](https://docs.strapi.io/dev-docs/api/rest)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Project Architecture](../../../CLAUDE.md)
