# @grupo-ser/utils

Shared utility functions for Grupo Ser monorepo.

## Usage

```typescript
import { formatPrice, getMediaUrl } from "@grupo-ser/utils";

const price = formatPrice(1000); // "R$ 1.000,00"
const mediaUrl = getMediaUrl("uploads/image.jpg"); // "/api/media/uploads/image.jpg"
```

## Installation

This package should be installed as a **runtime dependency**:

```bash
yarn add @grupo-ser/utils
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
