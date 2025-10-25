# Strapi Integration Setup Guide

This document describes how Strapi CMS has been configured in this Next.js application.

## Environment Variables

The following environment variables are configured in [.env](.env):

```bash
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=<your-api-token>
```

These are also documented in [.env.example](.env.example) for reference.

## File Structure

### Core Configuration

- **[src/libs/api/strapi.ts](src/libs/api/strapi.ts)** - Strapi API client with Bearer token authentication
- **[src/types/env.d.ts](src/types/env.d.ts)** - TypeScript definitions for environment variables

### Example Feature

A complete example feature has been created at `src/features/strapi-articles/`:

```
src/features/strapi-articles/
├── api/
│   ├── types.ts        # TypeScript types (Article, ArticlesResponse)
│   └── query.ts        # React Query hooks (useArticlesQuery, useArticleQuery)
├── constants.ts        # Query keys for React Query cache
├── hooks.ts            # Custom hooks (useArticles, useArticle)
├── index.tsx           # ArticlesList component
├── styles.module.scss  # Component styles
└── README.md           # Feature documentation
```

## How to Use

### 1. Basic Component Usage

Import and use the pre-built `ArticlesList` component:

```tsx
import { ArticlesList } from '@/features/strapi-articles';

export default function ArticlesPage() {
  return <ArticlesList />;
}
```

### 2. Using Custom Hooks

For more control, use the custom hooks:

```tsx
'use client';

import { useArticles } from '@/features/strapi-articles/hooks';

export function MyComponent() {
  const { articles, isLoading, error, pagination } = useArticles();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {articles.map((article) => (
        <div key={article.id}>
          <h2>{article.attributes.title}</h2>
          <p>{article.attributes.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### 3. Using React Query Hooks Directly

For maximum flexibility:

```tsx
import { useArticlesQuery } from '@/features/strapi-articles/api/query';

export function FilteredArticles() {
  const { data, isLoading } = useArticlesQuery({
    filters: {
      category: { $eq: 'technology' },
    },
    sort: 'publishedAt:desc',
    pagination: {
      page: 1,
      pageSize: 10,
    },
  });

  // ... render logic
}
```

## Creating New Strapi Features

Follow the feature-based architecture pattern:

### Step 1: Create Feature Directory

```bash
mkdir -p src/features/strapi-{content-type}/api
```

### Step 2: Define Types (`api/types.ts`)

```typescript
import type { StrapiEntity, StrapiResponse } from '@/libs/api/strapi';

export interface YourContentAttributes {
  title: string;
  // ... other fields
}

export type YourContent = StrapiEntity<YourContentAttributes>;
export type YourContentResponse = StrapiResponse<YourContent[]>;
```

### Step 3: Create Query Hooks (`api/query.ts`)

```typescript
import { useQuery } from '@tanstack/react-query';
import { strapiQuery } from '@/libs/api/strapi';

export const fetchYourContent = async () => {
  return strapiQuery<YourContentResponse>('/api/your-content');
};

export const useYourContentQuery = () => {
  return useQuery({
    queryKey: ['strapi', 'your-content'],
    queryFn: fetchYourContent,
  });
};
```

### Step 4: Add Constants (`constants.ts`)

```typescript
export const YOUR_CONTENT_QUERY_KEY = ['strapi', 'your-content'] as const;
```

### Step 5: Create Custom Hooks (`hooks.ts`)

```typescript
import { useYourContentQuery } from './api/query';

export const useYourContent = () => {
  const { data, isLoading, error } = useYourContentQuery();
  return {
    items: data?.data ?? [],
    isLoading,
    error,
  };
};
```

### Step 6: Build Component (`index.tsx`)

```tsx
'use client';

import { useYourContent } from './hooks';

export function YourContentList() {
  const { items, isLoading, error } = useYourContent();

  // ... render logic
}
```

## Strapi API Client Details

The Strapi client ([src/libs/api/strapi.ts](src/libs/api/strapi.ts)) provides:

### Helper Functions

- `strapiQuery<T>(endpoint, params?)` - GET requests
- `strapiMutate<T, P>(endpoint, payload, method)` - POST/PUT/PATCH/DELETE requests

### Type Definitions

- `StrapiResponse<T>` - Standard Strapi response with data and meta
- `StrapiEntity<T>` - Entity structure with id and attributes
- `StrapiError` - Error response structure

### Features

- Automatic Bearer token authentication
- 30-second timeout
- Error logging in development mode
- TypeScript type safety

## Strapi Query Parameters

The Strapi REST API supports various query parameters:

### Filters

```typescript
{
  filters: {
    title: { $contains: 'React' },
    publishedAt: { $gte: '2024-01-01' },
    category: { $in: ['tech', 'news'] }
  }
}
```

### Sorting

```typescript
{
  sort: 'publishedAt:desc'
}
```

### Pagination

```typescript
{
  pagination: {
    page: 1,
    pageSize: 25
  }
}
```

### Population (Relations)

```typescript
{
  populate: '*' // All relations
  // or
  populate: ['author', 'category'] // Specific relations
}
```

## Architecture Alignment

This Strapi integration follows the project's feature-based architecture:

1. **API Layer** - Axios client with Strapi configuration
2. **React Query** - Server state management
3. **Custom Hooks** - Abstraction layer for components
4. **Type Safety** - Full TypeScript coverage
5. **Testing Ready** - Compatible with existing test setup

## Next Steps

1. **Create your Strapi content types** in Strapi admin panel
2. **Generate API tokens** in Strapi (Settings → API Tokens)
3. **Create features** following the pattern in `strapi-articles`
4. **Add tests** using the existing test utilities

## References

- [Strapi REST API Docs](https://docs.strapi.io/dev-docs/api/rest)
- [React Query Docs](https://tanstack.com/query/latest)
- [Example Feature](src/features/strapi-articles/README.md)
- [Project Architecture](CLAUDE.md)
