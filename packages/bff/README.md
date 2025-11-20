# @grupo-ser/bff

Backend for Frontend (BFF) package containing all business logic, data transformation, and service integrations.

## Structure

```
src/
  services/        # External service clients (Strapi, Geolocation)
  handlers/        # Business logic handlers (courses, SEO, units, media)
  transformers/    # Data transformation utilities
  types/           # TypeScript types and DTOs
  utils/           # Utility functions
  data/            # Static JSON data
```

## Usage

### Services

#### Strapi Client

```typescript
import { createStrapiClient } from '@grupo-ser/bff';

const strapiClient = createStrapiClient(process.env.STRAPI_URL!);

const data = await strapiClient.fetch('endpoint', {
  filters: { field: { $eq: 'value' } },
  populate: ['relation'],
});
```

#### Geolocation Service

```typescript
import { reverseGeocode, getLocationFromCoordinates } from '@grupo-ser/bff';

const location = await getLocationFromCoordinates(lat, lng);
```

### Handlers

#### Courses

```typescript
import {
  handleCoursesList,
  handleCourseDetails,
  handleAutocomplete,
} from '@grupo-ser/bff';

// List courses with filters
const courses = handleCoursesList({
  institution: 'slug',
  location: 'city',
  page: 1,
  perPage: 12,
});

// Get course details
const course = handleCourseDetails('course-slug');

// Autocomplete
const results = handleAutocomplete({
  type: 'courses',
  q: 'query',
});
```

#### SEO, Units, Media

```typescript
import { handleSeo, handleUnits, handleMedia } from '@grupo-ser/bff';
import { createStrapiClient } from '@grupo-ser/bff';

const strapiClient = createStrapiClient(process.env.STRAPI_URL!);

const seo = await handleSeo(strapiClient, { institutionSlug: 'slug' });
const units = await handleUnits(strapiClient, { institutionSlug: 'slug' });
const media = await handleMedia(strapiClient, {
  path: ['uploads', 'file.jpg'],
});
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

This package is framework-agnostic and contains pure business logic. It's consumed by Next.js API routes which act as thin HTTP layers.
