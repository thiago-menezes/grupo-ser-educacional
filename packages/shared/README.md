# @grupo-ser/shared

Shared utilities, types, and ESLint configuration for Grupo Ser monorepo.

## Structure

```
src/
  utils/        # Shared utilities (format-price, media-url, etc)
  types/        # Shared TypeScript types (API responses, DTOs)
eslint.config.mjs  # Shared ESLint configuration
```

## Usage

### Utils

```typescript
import { formatPrice, getMediaUrl } from '@grupo-ser/shared';

const price = formatPrice(1000); // "R$ 1.000,00"
const mediaUrl = getMediaUrl('uploads/image.jpg'); // "/api/media/uploads/image.jpg"
```

### Types

```typescript
import type {
  CourseData,
  CoursesResponse,
  CourseDetailsResponse,
  CourseModality,
  AutocompleteResponse,
} from '@grupo-ser/shared';
```

### ESLint Configuration

```javascript
// eslint.config.mjs
import sharedConfig from '@grupo-ser/shared/eslint.config.mjs';

export default [
  ...sharedConfig,
  // Add app-specific rules here
];
```

## Development

```bash
# Build
yarn build

# Type check
yarn typecheck

# Clean
yarn clean
```


