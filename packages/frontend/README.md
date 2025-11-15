# @grupo-ser/frontend

Frontend package containing React components, features, hooks, and utilities used by the Next.js application.

## Structure

```
src/
  components/      # Reusable UI components (breadcrumb, course-card, header, footer, etc.)
  features/        # Feature modules (course-details, course-search, home, institutions-list)
  hooks/           # Custom React hooks (useGeolocation, useInstitution, usePagination)
  libs/            # Library configurations (API clients, testing utilities)
  seo/             # SEO utilities and types
  styles/           # Global styles, themes, and design tokens
```

## Usage

### Components

```typescript
import { Breadcrumb, CourseCard, Header, Footer } from '@grupo-ser/frontend';
```

### Features

```typescript
import { CourseDetailsPage, CourseSearchPage } from '@grupo-ser/frontend';
```

### Hooks

```typescript
import {
  useGeolocation,
  useInstitution,
  usePagination,
} from '@grupo-ser/frontend';
```

### SEO

```typescript
import { getSeoFromStrapi, generateJsonLd } from '@grupo-ser/frontend';
```

## Development

```bash
# Build
yarn build

# Type check
yarn typecheck

# Test
yarn test

# Watch mode
yarn dev
```

## Architecture

This package contains React components and utilities that are consumed by the Next.js application. It's framework-agnostic React code that can be used in any React application.
