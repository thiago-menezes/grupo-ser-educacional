# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application using the App Router, built with TypeScript, NextAuth (Auth0), React Query, and Axios. The project follows a **feature-based architecture** where each feature is self-contained with its own API layer, hooks, types, utilities, and tests.

## Commands

### Development

```bash
npm run dev              # Start dev server with Turbopack
npm run build            # Build for production
npm start                # Start production server
```

### Code Quality

```bash
npm run typecheck        # TypeScript type checking (tsc --noEmit)
npm run lint             # ESLint with cache
npm run lint:fix         # Auto-fix ESLint issues
npm run format           # Prettier + ESLint fix
```

### Testing

```bash
npm run test             # Run all tests with Vitest
npm run test:ui          # Run tests with Vitest UI
npm run test:unit        # Run only unit tests (*.spec.{ts,tsx})
npm run test:integration # Run only integration tests (*.integration.spec.{ts,tsx})
npm run test:coverage    # Generate coverage report (80% threshold)
npm run test:coverage:ui # Coverage with UI
```

## Architecture

### Feature-Based Structure

Each feature lives in `src/features/` and contains:

- `api/types.ts` - TypeScript types for the feature
- `api/query.ts` - React Query hooks (e.g., `useProductsQuery`)
- `api/mock.ts` - API endpoint documentation
- `hooks.ts` - Custom hooks that wrap React Query hooks
- `constants.ts` - Feature-specific constants (e.g., query keys)
- `utils.ts` - Pure utility functions (e.g., `formatCurrency`)
- `index.tsx` - Main component
- `*.module.scss` - Component styles
- `test.integration.spec.tsx` - Integration tests

### Data Flow Pattern

```
Component → Custom Hook → React Query Hook → Axios Client → API
```

Example from ProductList feature:

1. `<ProductList />` calls `useProductList()` custom hook
2. `useProductList()` wraps `useProductsQuery()` React Query hook
3. `useProductsQuery()` uses `query()` helper with `apiClient`
4. `apiClient` (Axios) adds auth headers and makes HTTP request

### API Integration

**Two Axios clients available:**

- `apiClient` - With auth interceptor (for protected routes)
- `publicApiClient` - Without auth (for public routes)

Both clients are located in `src/libs/api/axios.ts` and include:

- Automatic Bearer token injection from session
- Request timeout handling (50s default)
- 401 error handling with automatic sign-out
- Error logging in development

**Generic query helpers:**

```typescript
// GET requests
query<T>(endpoint: string, params?: object): Promise<T>

// POST/PUT/PATCH/DELETE requests
mutate<T, P>(endpoint: string, payload: P, method: 'POST' | 'PUT' | 'PATCH' | 'DELETE'): Promise<T>
```

### Authentication Flow

Uses NextAuth v5 (beta) with Auth0 as the provider:

1. User navigates to protected route `(auth)/page.tsx`
2. NextAuth redirects to Auth0 for login
3. Auth0 returns access token and refresh token
4. Token stored in JWT session (8-hour max age)
5. Axios interceptor adds `Authorization: Bearer <token>` to all requests
6. 401 errors trigger automatic sign-out

**Session extensions:** Custom fields added via `src/types/next-auth.d.ts` include `id`, `name`, `email`, and `accessToken`.

### State Management

No Redux/Zustand/Jotai. State is managed through:

1. **Server State** - React Query (`@tanstack/react-query`)
2. **Auth State** - NextAuth sessions
3. **Client State** - React hooks + Context
4. **Form State** - React Hook Form + Zod (dependencies installed, ready to use)

React Query configuration (`src/libs/api/queryClient.ts`):

- Stale time: 5 seconds
- Retry: 1 time on failure
- No refetch on window focus
- DevTools enabled in development only

### Environment Variables

Required variables (see `.env.local` or `.env.development`):

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:4010
NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000

# NextAuth
AUTH_URL=http://localhost:3000
AUTH_SECRET=<random-string>
AUTH_TRUST_HOST=true

# Auth0
AUTH0_ISSUER=https://your-tenant.auth0.com
AUTH0_ID=<client-id>
AUTH0_SECRET=<client-secret>

# Development
MOCK_SERVER=http://localhost:4010
```

## Path Aliases

Configured in `tsconfig.json`:

- `@/*` → `./src/*` (main imports)
- `@root/*` → `./*` (root imports)

## Testing Setup

**Framework:** Vitest with happy-dom environment

**Test patterns:**

- Unit tests: `src/**/*.spec.{ts,tsx}`
- Integration tests: `src/**/*.integration.spec.{ts,tsx}`

**Integration test utilities:**
Located in `src/libs/testing/integration-test-setup.ts`:

- `setupIntegrationTest()` - Mock successful API responses
- `setupIntegrationTest({ mockError: true })` - Mock error responses

**Custom render wrapper:**
Import `render` from `src/libs/testing/testing-wrapper.tsx` (not from `@testing-library/react` directly). This custom render automatically wraps components with:

- SessionProvider (NextAuth)
- QueryClientProvider (React Query)
- Reshaped theme

```typescript
import { render, screen, waitFor } from '@/libs/testing/testing-wrapper';

render(<YourComponent />);
```

**Coverage thresholds:** 80% for branches, functions, lines, and statements.

## Key Conventions

1. **Query keys** - Define in `features/*/constants.ts` (e.g., `['products']`)
2. **API documentation** - Document endpoints in `features/*/api/mock.ts`
3. **Component styles** - Use SCSS modules (`.module.scss`)
4. **Error boundaries** - Global error boundary in `app/error.tsx`
5. **Type safety** - Extend NextAuth types in `src/types/next-auth.d.ts`
6. **Import ordering** - ESLint enforces import groups (React → Next → external → internal → relative)

## Adding a New Feature

1. Create feature directory: `src/features/my-feature/`
2. Add API types: `api/types.ts`
3. Add React Query hooks: `api/query.ts`
4. Create custom hook: `hooks.ts`
5. Define constants: `constants.ts` (query keys, etc.)
6. Add utilities if needed: `utils.ts`
7. Create main component: `index.tsx`
8. Add styles: `index.module.scss`
9. Write integration tests: `test.integration.spec.tsx`

## Important Notes

- **Package manager**: This project uses `npm` (not pnpm/yarn)
- **Dev server**: Uses Turbopack for faster hot reload
- **Styling**: Reshaped component library with Slate theme
- **API docs**: Available at `/reference` route (Scalar API Reference)
- **TypeScript strict mode**: Enabled - all code must be type-safe
- **ESLint**: Flat config format (ESLint 9+)
