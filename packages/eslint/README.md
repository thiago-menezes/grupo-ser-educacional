# @hfsa/eslint-config

Shared ESLint configuration for HFSA monorepo.

## Installation

```bash
# Install the package
yarn add -D @hfsa/eslint-config

# Install peer dependencies
yarn add -D eslint prettier typescript
```

## Usage

### Base Configuration

```js
// eslint.config.js
import { base } from '@hfsa/eslint-config';

export default base;
```

### React Configuration

```js
// eslint.config.js
import { react } from '@hfsa/eslint-config';

export default react;
```

### Next.js Configuration

```js
// eslint.config.js
import { next } from '@hfsa/eslint-config';

export default next;
```

## Configurations Available

- **base**: Base TypeScript and Node.js rules
- **react**: Adds React and React Hooks rules
- **next**: Adds Next.js and Storybook rules

## Rules Included

- TypeScript ESLint recommended rules
- Prettier integration
- Import ordering and organization
- React and React Hooks best practices
- Next.js core web vitals
- Storybook support
- Turbo monorepo support
