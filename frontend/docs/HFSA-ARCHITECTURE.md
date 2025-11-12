# HFSA Architecture Adoption Guide

This document translates the Hybrid Feature Scope Architecture (HFSA) described in `/Users/thiago/Projects/hfsa-monorepo/articles/hfsa-english.md` into an actionable plan for the `grupo-ser/frontend` codebase. Use the boilerplate implementation in `/Users/thiago/Projects/hfsa-monorepo/apps/boilerplate` as the living reference for folder layout, naming, and file responsibilities.

## Guiding Principles

- **Scope-based organization** – every folder has a single responsibility (feature, component, lib, config) with minimal cross-talk.
- **Feature verticals first** – UI, hooks, API calls, domain logic, and tests for a feature stay together under `src/features/<feature>`.
- **Atomic components remain dumb** – `src/components` holds only logic-free building blocks; any business logic must live in a feature.
- **Predictable contracts** – each module exports from `index.tsx` and stores supporting code in a standard set of files (`hooks.ts`, `constants.ts`, `utils.ts`, `types.ts`, `styles.module.scss`, `api/*`).
- **Tests live with the code** – colocated `__tests__` folders (Vitest + Testing Library) exercise hooks, API adapters, and page-level flows.

## Target Directory Layout

```
src/
├── app/                         # Next.js routes (thin shells that import features)
├── components/                  # Reusable, logic-free UI primitives
│   └── button/
│       ├── index.tsx
│       ├── styles.module.scss
│       └── types.ts
├── features/                    # Vertical slices with full ownership
│   └── enrollment-form/
│       ├── index.tsx            # Feature entry component
│       ├── hooks.ts             # React Query hooks, controllers
│       ├── utils.ts             # Pure helpers
│       ├── constants.ts         # Static maps, copy decks
│       ├── styles.module.scss   # Feature-scoped styles
│       ├── types.ts             # UI/domain types (local)
│       ├── test.spec.ts         # UI/domain types (local)
│       └── api/
│           ├── query.ts         # Data fetchers wrapped in query keys
│           ├── mutation.ts      # Write operations
│           └── types.ts         # API contracts (DTOs)
│
├── libs/                        # Cross-feature tooling (API client, auth, testing)
├── config/                      # Global configuration (tokens, env parsing)
└── types/                       # Project-wide ambient type declarations
```

### Component Module Contract (`src/components/<name>`)

| File                 | Responsibility                                                                                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.tsx`          | Export of the stateless component. May import hooks from sibling `hooks.ts` only if the logic is presentation-related (e.g., focus management).                            |
| `styles.module.scss` | Styling with CSS modules. Name it exactly `styles.module.scss` for parity with the boilerplate.                                                                            |
| `types.ts`           | **ONLY** file where types are defined. Public props (`<Component>Props`), discriminated unions for variants. **DO NOT create types in component, hook, or context files.** |
| `constants.ts`       | Copy decks, icon maps, tokens used by the component.                                                                                                                       |
| `utils.ts`           | Pure helpers (formatters, class builders).                                                                                                                                 |
| `hooks.ts`           | Optional component-level hooks (no data fetching, only presentation logic).                                                                                                |
| `api/*`              | **Only for stateful widgets**. If a “component” owns remote data, promote it to `src/features`.                                                                            |

### Feature Module Contract (`src/features/<feature>`)

| File/Folder          | Responsibility                                                                                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.tsx`          | Composes the UI, wires hooks, and exports a single public component/hook for route usage.                                                                                       |
| `hooks.ts`           | React Query hooks (`useEnrollmentsQuery`, `useCreateEnrollmentMutation`) plus derived-state helpers.                                                                            |
| `constants.ts`       | Static labels, query keys, feature flags.                                                                                                                                       |
| `types.ts`           | **ONLY** file where types are defined. Feature-scoped view models and discriminated unions that are not API DTOs. **DO NOT create types in component, hook, or context files.** |
| `utils.ts`           | Pure transformers (e.g., map API DTO → view model).                                                                                                                             |
| `styles.module.scss` | Feature styles (optionally split into smaller SCSS partials imported here).                                                                                                     |
| `api/query.ts`       | Read operations. Each function wraps `libs/api/queryClient` and exposes the hook-friendly contract.                                                                             |
| `api/mutation.ts`    | Write operations and side effects.                                                                                                                                              |
| `api/types.ts`       | DTOs and server contracts.                                                                                                                                                      |
| `api/mock.ts`        | Optional MSW handlers or fixtures.                                                                                                                                              |
| `__tests__/`         | Vitest specs (unit, hook, and integration). Name them `<feature>.integration.spec.tsx` when exercising the route.                                                               |

### Routing Contract

- Route files under `src/app` should remain minimal. They import feature entry points and pass params through.
- Example pattern:

```tsx
// src/app/(marketing)/enrollment/page.tsx
import { EnrollmentFeature } from '@/features/enrollment-form';

export default function EnrollmentPage({ params }: Props) {
  return <EnrollmentFeature institution={params.institution} />;
}
```

## Shared Libraries & Cross-Cutting Concerns

- `src/libs/api` exposes only low-level primitives (`apiClient`, `queryClient`, token management). No feature should call `axios` directly.
- Authentication, logging, and feature-flag helpers also stay inside `src/libs/*`.
- `src/config` holds read-only configuration (institution registry, env parsing). If a config evolves into rich behavior, graduate it into a feature module.
- Testing utilities remain in `src/libs/testing` and are imported from feature tests via `@/libs/testing`.

## Implementation Workflow

1. **Create the feature skeleton** using the table above (copy from `apps/boilerplate/src/features/product-list` if needed).
2. **Model the API** inside `api/types.ts`, add fetchers/mutators, then wrap them in React Query hooks in `hooks.ts`.
3. **Compose UI** in `index.tsx`, keeping visual primitives in `src/components`.
4. **Document the feature** via inline JSDoc and optional `README.md`.
5. **Test locally** with colocated `__tests__` plus Playwright/Vitest integration.
6. **Expose via routing** by importing the feature into the relevant file under `src/app`.

## Current State vs HFSA Readiness

| Area                       | Current State                                                                                                                                                                              | Gap / Action                                                                                                                                                            |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Routing + feature boundary | `src/app/[institution]/page.tsx` mixes data constants, view logic, and layout in a single file (`tokenSwatches`, `componentTiles`, `buttonClassMap`, component definitions) [lines 7-150]. | Move the entire experience into `src/features/theme-demo` (or similar) with `constants.ts`, `types.ts`, and `styles.module.scss`, leaving the route as a thin delegate. |
| Components folder          | `src/components/header` now ships with `index.tsx`, `types.ts`, and `styles.module.scss`, matching the HFSA contract for dumb UI primitives.                                               | Use the header implementation as the template and audit remaining components to ensure they follow the same structure.                                                  |
| Theming provider           | `src/components/InstitutionThemeProvider.tsx` lives as a loose file with business logic in the components root [lines 1-55].                                                               | Convert into `src/features/theme/institution-theme-provider/` or move under `src/features/theme` with the standard file layout.                                         |
| Feature directory usage    | `src/features/theme` only contains `__tests__/institution-theme.integration.spec.tsx` and no production code [lines 1-158].                                                                | Populate `src/features/theme` (or new feature folders) with UI, hooks, and API files; keep tests colocated.                                                             |
| API ownership              | `src/libs/api/axios.ts` declares `query` and `mutate` helpers globally [lines 5-70], so features do not own their fetch logic.                                                             | Keep the Axios client in `libs/api`, but create per-feature adapters (`api/query.ts`, `api/mutation.ts`) to encapsulate endpoints and query keys.                       |
| Domain configuration       | Institution data and helper functions live in `src/config/institutions.ts` [lines 26-160], far from any feature.                                                                           | Wrap brand logic in a `theme` feature (e.g., `features/theme/config`) that provides hooks plus the config object, leaving `src/config` with environment-only data.      |

## Implementation Progress

### ✅ Completed

- Basic HFSA structure established in `src/features/`
- Component contracts defined for `src/components/`
- Testing utilities in `src/libs/testing`
- API client foundation in `src/libs/api`

### 🔄 In Progress

- Migration of existing components to HFSA structure
- Feature-based API adapters
- Theme provider refactoring

### 📋 Next Steps

1. Audit existing components for HFSA compliance
2. Create feature adapters for API calls
3. Migrate theme logic to feature structure
4. Update documentation to reflect current state

## Next Steps

1. Pick the first feature to migrate (the `[institution]` themed landing page is a good candidate).
2. Scaffold the feature folder using the boilerplate’s `product-list` example.
3. Move supporting UI (e.g., `Header`) into compliant component modules.
4. Shift API calls and constants into the new structure, adding relevant tests under `__tests__`.

Tracking progress against this guide before touching implementation will keep the migration predictable and incremental.
