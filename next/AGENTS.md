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
- **Feature API file conventions**:
  - For feature-scoped API code (e.g. `src/features/<feature>/api/`), keep queries consolidated in `query.ts` (and mutations in `mutation.ts` when needed).
  - Do **not** create ad-hoc files like `*-query.ts`; add new query hooks to the feature’s existing `api/query.ts`.
- **Backend API & shared types language**:
  - All **backend endpoints** (Next.js `app/(backend)/api/**`) must use **English** route paths and file/folder names.
  - All **shared API contracts** in `types/api/**` must be written in **English** (filenames + exported type names).
  - **Frontend user-facing URLs** and **HTML text content** may be **Portuguese**.
  - Backend/CMS responses may contain Portuguese fields, but the **BFF must translate to English DTOs** before exposing to the app.
- **Context files:**
  - Feature/component-specific: `context.tsx` (inside feature/component folder)
  - Global/shared: Business rule name in `src/contexts/` folder (e.g., `city.tsx`, `courses.tsx`)

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
- **Always use `type` instead of `interface`** (no exceptions)
- All types go in `types.ts` files
- Only export component from `index.ts`
- **No comments in code** - code should be self-explanatory

### Error Handling

- Use union types instead of `any`
- Nullish coalescing (`??`) for optional values
- Proper TypeScript types for API responses (DTO suffix)
