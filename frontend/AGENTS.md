# AGENTS.md

## Commands

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues automatically
- `pnpm format` - Format code with Prettier and fix linting
- `pnpm test` - Run all tests with Vitest
- `pnpm test:unit` - Run unit tests only (`src/**/*.spec.{ts,tsx}`)
- `pnpm test:integration` - Run integration tests only (`src/**/*.integration.spec.{ts,tsx}`)
- `pnpm test:ui` - Run tests with UI interface
- `pnpm test:coverage` - Generate coverage report
- `pnpm test src/path/to/test.spec.tsx` - Run single test file

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

### Testing

- Unit tests: `*.spec.{ts,tsx}`
- Integration tests: `*.integration.spec.{ts,tsx}`
- Use Testing Library + Vitest
- Coverage threshold: 80% minimum

### Error Handling

- Use union types instead of `any`
- Nullish coalescing (`??`) for optional values
- Proper TypeScript types for API responses (DTO suffix)
