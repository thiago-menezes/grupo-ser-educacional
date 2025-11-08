# RCHITECTURAL OVERVIEW

The boilerplate uses a three-tier architecture:

┌─────────────────────────────────────────────────────────────┐
│ src/features/ → Business logic modules (ProductList) │
│ src/components/ → Reusable UI components (Header) │
│ src/libs/ → Shared infrastructure (API, Auth) │
│ src/app/ → Next.js routing and layouts │
└─────────────────────────────────────────────────────────────┘

# FEATURE STRUCTURE (Core Pattern)

Each feature follows this standard structure:

feature/
├── index.tsx # Component (rendering logic)
├── hooks.ts # Feature hooks (business logic)
├── utils.ts # Helper functions
├── constants.ts # QUERY_KEYS and constants
├── styles.module.scss # Component styles (CSS Modules)
├── test.integration.spec.tsx # Integration tests
└── api/
├── query.ts # React Query hooks
├── types.ts # All TypeScript types
└── mock.ts # OpenAPI mock definitions

# THREE-LAYER HOOKS ARCHITECTURE

Component (index.tsx)
↓ uses
Feature Hook (hooks.ts) - Business logic & transformation
↓ uses
API Query Hook (api/query.ts) - React Query wrapper
↓ uses
React Query useQuery() - Data fetching with caching
↓ calls
Axios query() helper - HTTP client with interceptors

# NAMING CONVENTIONS

Component Files: PascalCase ProductList.tsx, Header.tsx
Hooks: useXxx pattern useProductList, useProductsQuery
Types: PascalCase Product, ProductSearchResponse
Constants: CONSTANT_CASE QUERY_KEYS, TIMEOUT_MS
Utility Functions: camelCase currency(), formatDate()
CSS Classes: camelCase .container, .productTitle
Directories: kebab-case product-list, order-history

# KEY TECHNOLOGIES

Framework: Next.js 15 (App Router)
Language: TypeScript
Styling: CSS Modules + SCSS
State Management: React Query (server) + Context (client)
HTTP Client: Axios with interceptors
Authentication: NextAuth v5 (Auth0)
Testing: Vitest + Testing Library + Prism
Design System: Reshaped (monorepo package)
Package Manager: pnpm

# CORE DESIGN DECISIONS

1. Separate features/ and components/
   - features/ = stateful, business logic modules
   - components/ = stateless, reusable UI

2. Split api/ subfolder in each feature
   - api/query.ts = React Query hooks (raw)
   - hooks.ts = Business logic (composed)

3. Co-locate styles with components
   - styles.module.scss in same folder
   - Scoped, zero-runtime CSS Modules

4. React Query over Redux
   - Built for server state + API caching
   - Less boilerplate, better DX

5. All types in api/types.ts
   - Query inputs, domain models, API responses
   - Single source of truth

# DEPENDENCY RULES

ALLOWED:
✓ features/_ can import from libs/_
✓ features/_ can import from components/_
✓ components/_ can import from libs/_

FORBIDDEN:
✗ features/a cannot import from features/b
✗ components/_ cannot import from features/_
✗ libs/_ cannot import from features/_

This prevents circular dependencies and keeps features independent.

# REAL WORLD EXAMPLES IN BOILERPLATE

1. ProductList Feature (Complete Example)
   Location: src/features/product-list/
   Files: index.tsx, hooks.ts, api/query.ts, api/types.ts, utils.ts,
   constants.ts, styles.module.scss, test.integration.spec.tsx
   Shows: Data fetching, transformation, rendering, testing

2. Login Feature (Auth Example)
   Location: src/features/login/
   Files: index.tsx, hook.ts, styles.module.scss
   Shows: Authentication patterns, error handling

3. Header Component (Shared UI)
   Location: src/components/header/
   Files: index.tsx, styles.module.scss
   Shows: Server component, auth session access

# SHARED INFRASTRUCTURE

libs/api/
axios.ts - API client factory with request/response interceptors
queryClient.ts - React Query configuration
token.ts - Auth token extraction
types.ts - Shared TypeScript types

libs/auth/
index.ts - NextAuth configuration and handlers

libs/testing/
testing-wrapper.tsx - Custom render() with all providers
integration-test-setup.ts - Prism mock server setup

# FILE ORGANIZATION QUICK REFERENCE

Where should I put...?

✓ New feature with component, hooks, API, styles
→ src/features/<name>/

✓ Reusable UI (Header, Button, Modal)
→ src/components/<name>/

✓ Helper functions used by multiple features
→ src/libs/hooks/

✓ API client setup, auth configuration
→ src/libs/<category>/

✓ Global type definitions
→ src/types/

✓ Next.js routes, layouts, API routes
→ src/app/

# IMPORT PATH PATTERNS (Use These!)

Features:
import { ProductList } from '@/features/product-list';
import type { Product } from '@/features/product-list/api/types';

Components:
import { Header } from '@/components/header';

Libraries:
import { apiClient, query } from '@/libs/api/axios';
import { auth, signIn, signOut } from '@/libs/auth';
import { render } from '@/libs/testing/testing-wrapper';

All imports use @ alias (absolute paths), NO relative imports!

# COMMON COMMANDS

Development:
pnpm dev # Start dev server (http://localhost:3000)
pnpm build # Build for production
pnpm start # Run production build

Testing:
pnpm test # Run all tests
pnpm test:unit # Unit tests
pnpm test:integration # Integration tests

Quality:
pnpm typecheck # TypeScript checking
pnpm lint # ESLint

# CREATING A NEW FEATURE - STEP BY STEP

1. Create directory structure
   mkdir src/features/my-feature/api

2. Create index.tsx (component)
   - Import hooks from ./hooks
   - Import styles from ./styles.module.scss
   - Render clean JSX

3. Create hooks.ts (feature logic)
   - Import API query from ./api/query
   - Compose and transform data
   - Return clean interface

4. Create api/query.ts (React Query)
   - useQuery with queryKey and queryFn
   - Use query() helper from @/libs/api/axios

5. Create api/types.ts (all types)
   - Input types, domain model, API response

6. Create utils.ts (helpers, if needed)
   - Simple utility functions

7. Create constants.ts
   - QUERY_KEYS, timeouts, etc.

8. Create styles.module.scss
   - Scoped component styles

9. Create test.integration.spec.tsx
   - Test component + hooks + API together

10. Create api/mock.ts (optional)
    - OpenAPI mock definition

11. Export from app route
    - Import in src/app/route/page.tsx
    - Use in component

# FILE SIZE GUIDELINES

index.tsx: 100-200 lines (split if >300)
hooks.ts: 50-100 lines (split if >150)
api/query.ts: 40-80 lines (extract if >120)
styles.module.scss: 100-200 lines (refactor if >300)
utils.ts: 50-100 lines (split if >150)
api/types.ts: Any size (keep related together)

These are guidelines, not hard rules. Prioritize readability!

# TESTING STRATEGY

Focus on Integration Tests:
✓ Test component + hooks + API together
✓ Use custom render() from @/libs/testing/testing-wrapper
✓ All providers automatically injected
✓ Prism mock server provides realistic responses

Pattern:
it('renders products', async () => {
const { ProductList } = await import('./index');
render(<ProductList />);
await waitFor(() => {
expect(screen.getByText('Products')).toBeInTheDocument();
});
});

# SCALABILITY

This architecture scales well for:

- Up to 50+ independent features
- Multiple development teams
- Complex state management

Future scaling options:

- Feature subfolders for domain grouping
- Monorepo with separate packages per domain
- Feature teams with autonomous ownership

# BEST PRACTICES

1. Keep features independent and self-contained
2. Use three-layer hooks architecture consistently
3. Centralize all types in api/types.ts
4. Co-locate styles with components
5. Use CSS Modules for scoped styling
6. Test at integration level, not unit level
7. Use absolute imports (@/) never relative
8. Monitor file sizes, split when needed
9. Follow naming conventions strictly
10. Prevent circular dependencies absolutely

# COMMON PITFALLS TO AVOID

✗ Features importing from each other
→ Lift shared logic to libs/

✗ Styles in global CSS
→ Use CSS Modules for scoping

✗ API calls in components
→ Move to hooks, then to api/query.ts

✗ Huge component files
→ Split into subcomponents

✗ Types scattered everywhere
→ Centralize in api/types.ts

✗ No tests for features
→ Always add test.integration.spec.tsx

✗ Circular dependencies
→ Follow dependency rules strictly

✗ Features growing unbounded
→ Monitor sizes, split proactively

# DOCUMENTATION PROVIDED

This exploration created comprehensive documentation:

1. ARCHITECTURE-SUMMARY.md
   Complete overview with all core concepts

2. quick-reference.txt
   Quick lookup for patterns and checklists

3. boilerplate-structure.txt
   Detailed directory structure with explanations

4. code-examples.txt
   12 real code examples showing patterns

5. key-decisions.txt
   Why each architectural decision was made

6. visual-guide.txt
   ASCII diagrams, flows, and visual references

7. INDEX.txt
   Complete documentation index and guide

# WHERE TO START

For quick understanding:

1. Read ARCHITECTURE-SUMMARY.md (30 min)
2. Explore src/features/product-list/ (20 min)
3. Refer to quick-reference.txt as needed

For deep learning:

1. Read boilerplate-structure.txt
2. Read key-decisions.txt
3. Study code-examples.txt
4. Review visual-guide.txt

For specific patterns:

1. Check INDEX.txt for your question
2. Find relevant documentation
3. Review code examples
4. Look at actual boilerplate files

# KEY TAKEAWAYS

1. HFSA = Three tiers (features, components, libs)
2. Features are independent, testable modules
3. Three-layer hooks for clean data flow
4. React Query handles server state + caching
5. CSS Modules provide scoped styling
6. Absolute imports (@/) for clarity
7. Integration tests focus for better DX
8. Strict dependency rules prevent issues
9. Consistent naming conventions matter
10. Scalable to 50+ features easily

# NEXT STEPS

1. Read the summary documentation
2. Explore actual boilerplate files
3. Create a test feature following patterns
4. Study existing features (product-list, login)
5. Run tests and development server
6. Review code examples for your use case
7. Follow established patterns in new code

================================================================================
EXPLORATION COMPLETE
================================================================================

The HFSA boilerplate demonstrates a modern, production-ready approach to
Next.js application architecture that scales well, is easy to test, and
provides excellent developer experience through consistent patterns and
clear organization.

All documentation is self-contained and can be referenced as needed.
EOF
cat /tmp/FINAL-SUMMARY.txt
