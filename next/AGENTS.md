# AGENTS.md

## Documentation

For project understanding and development guidelines, read:

1. **[HFSA-ARCHITECTURE.md](./docs/HFSA-ARCHITECTURE.md)** - Project structure and organization principles
2. **[PROJECT-INDEX.md](./docs/PROJECT-INDEX.md)** - Complete project documentation index
3. **[QUICK-DEVELOPMENT-GUIDE.md](./docs/QUICK-DEVELOPMENT-GUIDE.md)** - Essential coding standards and rules
4. **[QUICK-REFERENCE.md](./docs/QUICK-REFERENCE.md)** - Developer cheat sheet and patterns

## Commands

- `yarn dev:next` - Start development server with Turbopack
- `yarn build:next` - Build for production
- `yarn workspace next typecheck` - Run TypeScript type checking
- `yarn workspace next lint` - Run ESLint
- `yarn workspace next lint:fix` - Fix ESLint issues automatically
- `yarn format` - Format code with Prettier and fix linting
- `yarn workspace next test` - Run all tests with Vitest
- `yarn workspace next test:unit` - Run unit tests only (`src/**/*.spec.{ts,tsx}`)
- `yarn workspace next test:integration` - Run integration tests only (`src/**/*.integration.spec.{ts,tsx}`)
- `yarn workspace next test:ui` - Run tests with UI interface
- `yarn workspace next test:coverage` - Generate coverage report
- `yarn workspace next test src/path/to/test.spec.tsx` - Run single test file

## Code Style Guidelines

### Import Order

1. React/Next built-ins
2. External libraries (node_modules)
3. Local components (`@/components/*`)
4. Styles (`.module.scss`)
5. Types (`type` imports)

### Naming Conventions

- Components: PascalCase (match filename kebab-case)
- Props: `ComponentNameProps`
- Constants: `UPPER_SNAKE_CASE`
- Functions/variables: camelCase
- Hooks: `useFeatureName`
- CSS classes: camelCase

### Component Structure

```typescript
// 1. Imports (ordered)
// 2. Component function with typed props
// 3. Export types at bottom
export function ComponentName({ prop }: ComponentProps) {}
export type { ComponentProps };
```

### Required Patterns

- Use CSS Modules (`.module.scss`) only
- Use Reshaped components, not custom HTML
- Use `Icon` component, never inline SVGs
- Always type props and exports
- Use design tokens (`var(--rs-*)`)
- Conditional rendering with `&&` operator
- List keys must be unique IDs, not indices
- **Always use `type` instead of `interface`** (except for global definitions)
- All types go in `types.ts` files
- Only export component from `index.ts`

### Testing

- Unit tests: `*.spec.{ts,tsx}`
- Integration tests: `*.integration.spec.{ts,tsx}`
- Use Testing Library + Vitest
- Coverage threshold: 80% minimum

### Error Handling

- Use union types instead of `any`
- Nullish coalescing (`??`) for optional values
- Proper TypeScript types for API responses (DTO suffix)
