# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Grupo Ser** is a multi-institutional educational website system built as a **Turborepo monorepo** with a unified codebase serving multiple universities via URL-based routing (`/[institution]`). The pilot institution is UNINASSAU.

### Key Architecture

- **Multi-tenant**: All institutions share the same codebase, differentiated by institution slug
- **Headless CMS**: Strapi manages content with institution-scoped data
- **Frontend**: Next.js 16 (App Router) with React 19, Reshaped Design System
- **Backend**: Strapi 5 CMS + external course APIs
- **State Management**: React Query for data fetching/caching
- **Monorepo**: Turborepo with Yarn 4 workspaces

## Workspace Structure

```
apps/
├── next/          # Next.js frontend (routes, UI)
└── strapi/        # Strapi CMS (content management)

packages/
├── types/         # Shared TypeScript types
├── utils/         # Shared utilities
├── bff/          # Backend-for-Frontend layer
└── eslint/       # ESLint configuration
```

## Development Commands

### Running Applications

```bash
# Run everything (builds packages, then starts apps)
yarn dev

# Run specific apps
yarn dev:next      # Next.js only
yarn dev:strapi    # Strapi only
```

### Building

```bash
# Build everything
yarn build

# Build specific workspaces
yarn build:packages    # All packages
yarn build:next        # Next.js only
yarn build:strapi      # Strapi only
```

### Testing & Quality

```bash
# From root
yarn lint          # Run ESLint across all workspaces
yarn typecheck     # TypeScript checking across all workspaces
yarn test          # Run all tests

# Next.js specific (from root or apps/next/)
yarn workspace next lint
yarn workspace next lint:fix
yarn workspace next typecheck
yarn workspace next test
yarn workspace next format
```

**IMPORTANT**: Never run `yarn build` when checking tests - it breaks the app.

### Cleaning

```bash
yarn clean         # Clean all workspaces
```

## Project Architecture

### Multi-Tenant Routing

Institution context flows through the URL:
- Routes: `/[institution]`, `/[institution]/cursos`, `/[institution]/cursos/[slug]`
- Institution slug determines theming, content filtering, and branding
- Default institution: `uninassau`
- Available institutions: `uninassau`, `ung`, `uninorte`, `unifael`, `unama`

### Next.js App Structure (HFSA Architecture)

The frontend follows **Hybrid Feature Scope Architecture** (see `docs/HFSA-ARCHITECTURE.md`):

```
apps/next/src/
├── app/                        # Next.js routes (thin route shells)
│   ├── (frontend)/
│   │   ├── [institution]/      # Dynamic institution routes
│   │   │   ├── page.tsx        # Homepage
│   │   │   ├── cursos/         # Course search
│   │   │   └── inscricao/      # Lead enrichment
│   │   ├── layout.tsx
│   │   └── providers.tsx       # Global providers
│   └── (backend)/
│       └── api/                # API routes
│
├── components/                 # Dumb, reusable UI primitives
│   └── [component]/
│       ├── index.tsx
│       ├── types.ts            # ONLY place for types
│       ├── styles.module.scss
│       ├── constants.ts
│       └── utils.ts
│
├── features/                   # Feature verticals with full ownership
│   └── [feature]/
│       ├── index.tsx
│       ├── hooks.ts            # React Query hooks
│       ├── types.ts            # ONLY place for types
│       ├── utils.ts
│       ├── constants.ts
│       ├── styles.module.scss
│       ├── context.tsx         # Feature-specific context
│       └── api/
│           ├── query.ts
│           ├── mutation.ts
│           └── types.ts        # API DTOs
│
├── contexts/                   # Global/shared contexts (business rules)
│   ├── city.tsx
│   └── courses.tsx
│
├── libs/                       # Cross-feature utilities
│   ├── api/                    # Axios + React Query client
│   └── testing/                # Test utilities
│
├── hooks/                      # Global custom hooks
├── seo/                        # SEO utilities
└── styles/                     # Global styles & tokens
```

### File Contracts

**Component Module** (`src/components/[name]`):
- `index.tsx`: Stateless component export
- `types.ts`: **ONLY** file for type definitions (props, variants)
- `styles.module.scss`: CSS modules
- `constants.ts`: Copy decks, icon maps
- `utils.ts`: Pure helpers
- `hooks.ts`: Presentation-only hooks (no data fetching)

**Feature Module** (`src/features/[feature]`):
- `index.tsx`: Composes UI, wires hooks
- `hooks.ts`: React Query hooks + derived-state helpers
- `types.ts`: **ONLY** file for feature-scoped types
- `api/query.ts`: Read operations
- `api/mutation.ts`: Write operations
- `api/types.ts`: DTOs and server contracts
- `context.tsx`: Feature-specific context (if needed)

### Critical Rules

1. **Type Organization**: **DO NOT create types in component, hook, or context files** - types must live in `types.ts` files
2. **Always use `type`** instead of `interface` (except for env files and `next-env.d.ts`)
3. **Component Reuse**: Never recreate Design System components - always check Reshaped first
4. **Context Naming**:
   - Feature-specific: `context.tsx` inside feature folder (e.g., `src/features/course-search/context.tsx`)
   - Global/shared: Business rule name in `src/contexts/` (e.g., `src/contexts/city.tsx`)

## Design System (Reshaped)

**Always prioritize Reshaped components before creating custom ones.**

- Documentation: https://reshaped.so/docs
- Storybook: https://main--5ed400f96e43cc00226d4df6.chromatic.com/

### Available Components

**Main**: ActionBar, Alert, Autocomplete, Avatar, Badge, Breadcrumbs, Button, Calendar, Card, Carousel, Checkbox, CheckboxGroup, ContextMenu, Divider, DropdownMenu, FileUpload, Hotkey, Link, Loader, MenuItem, Modal, NumberField, Pagination, PinField, Popover, Progress, ProgressIndicator, Radio, RadioGroup, Resizable, Scrim, Select, Skeleton, Slider, Stepper, Switch, Table, Tabs, TextArea, TextField, Timeline, Toast, ToggleButton, ToggleButtonGroup, Tooltip

**Utility**: Accordion, Actionable, Container, Dismissible, Flyout, FormControl, Grid, Hidden, HiddenVisually, Icon, Image, Overlay, Reshaped, ScrollArea, Text, Theme, View

## Styling Guidelines

### CSS Load Order (IMPORTANT!)

**Reshaped CSS is explicitly imported in `layout.tsx` BEFORE component styles.** This ensures proper cascade order:

```typescript
// app/(frontend)/layout.tsx
import 'reshaped/themes/reshaped/theme.css';  // 1. Reshaped (loaded first)
import './icon/tabler-300.css';                // 2. Icons
import '@/styles/global.scss';                 // 3. Global styles & themes
// Component CSS modules load automatically when used (highest priority)
```

**Why?** Next.js's `optimizePackageImports` feature reorders imports in production builds. By explicitly importing Reshaped CSS first, we ensure component CSS modules (loaded later) always override Reshaped styles via normal CSS cascade—no `!important` needed.

### Design Tokens

- **Always use Reshaped design tokens** - never create custom SCSS variables
- Use tokens from `tokens.scss` and theme files (`grupo-ser.scss`, `uninassau.scss`, etc.)
- **Never use hardcoded colors** (supports light/dark themes)

```scss
// ✅ CORRECT - Use Reshaped tokens
.button {
  color: var(--rs-color-background-primary);
  background: var(--rs-color-background-primary-faded);
}

// ❌ WRONG - Don't create custom color variables
$blue-primary: #052b82;
.button { background: $blue-primary; }
```

### Viewport Breakpoints

Use PostCSS custom media queries from Reshaped:

```scss
// ✅ CORRECT - Use PostCSS custom media queries
.component {
  // Mobile: default styles

  @media (--rs-viewport-m) {
    // Medium viewport (≥660px)
  }

  @media (--rs-viewport-l) {
    // Large viewport (≥900px)
  }

  @media (--rs-viewport-xl) {
    // Extra large viewport (≥1280px)
  }
}

// ❌ WRONG - Don't create custom breakpoint variables
$breakpoint-tablet: 768px;
@media (min-width: calc(var(--rs-viewport-m-min) * 1px)) {}
```

### RGB Transparency

```scss
// ✅ CORRECT
.element {
  background: rgb(from var(--color-variable) r g b / 0.5);
}

// ❌ WRONG
rgba(...)
```

### Avoid !important

Component CSS modules load after Reshaped CSS, so normal cascade rules apply. You should **never need `!important`** to override Reshaped styles. If you do, the CSS load order is broken.

## Data Fetching Patterns

### React Query Hook

```typescript
// src/features/[feature]/hooks.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/libs/api/axios';

export function useCourses(filters: CourseFilters) {
  return useQuery({
    queryKey: ['courses', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/courses', { params: filters });
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: Boolean(filters.institution),
  });
}
```

### Mutation

```typescript
export function useLeadSubmission() {
  return useMutation({
    mutationFn: async (leadData: LeadFormData) => {
      const { data } = await apiClient.post('/leads', leadData);
      return data;
    },
    onSuccess: (data) => {
      // Handle success
    },
  });
}
```

## Form Validation

Use React Hook Form + Zod:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  full_name: z.string().min(3, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
});

type FormData = z.infer<typeof schema>;

const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
});
```

## Testing

```typescript
import { render, screen } from '@/libs/testing/testing-wrapper';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText('Text')).toBeInTheDocument();
  });
});
```

## Strapi Content Management

See `apps/strapi/CLAUDE.md` for detailed CMS documentation.

### Key Content Types

- **Institution**: Base entity (slug, code, branding)
- **Course**: Academic courses with institution relation
- **Page Content**: Flexible content blocks by section/institution

### API Query Patterns

```javascript
// Get institution content
GET /api/page-contents?filters[institution][slug][$eq]=uninassau&filters[category][$eq]=home-hero&populate=*

// Get courses for institution
GET /api/courses?filters[institution][slug][$eq]=uninassau&filters[featured][$eq]=true&populate=*
```

## Commit Guidelines

Follow Conventional Commits pattern (observed in git log):
- `feat:` - New features
- `fix:` - Bug fixes
- `chore:` - Maintenance tasks
- `refactor:` - Code restructuring
- `docs:` - Documentation updates

Keep subject lines under 72 characters.

## Environment Requirements

- **Node**: >=22.0.0
- **Yarn**: >=4.0.0 (4.9.4 specified)
- **Package Manager**: Yarn 4 with workspaces

## Important Documentation

- **Quick Development Guide**: `docs/QUICK-DEVELOPMENT-GUIDE.md` - Coding standards and rules
- **Quick Reference**: `docs/QUICK-REFERENCE.md` - Developer cheat sheet
- **HFSA Architecture**: `docs/HFSA-ARCHITECTURE.md` - Project structure principles
- **Project Index**: `docs/PROJECT-INDEX.md` - Complete project overview
- **General Execution Plan**: `docs/general-execution-plan.md` - Roadmap and strategy
- **Strapi Content Strategy**: `docs/strapi-content-strategy.md` - CMS architecture
- **Component Kanbans**: `docs/kanbans/*.md` - Task breakdowns per component

## Configuration Files

- **Next.js**: `apps/next/next.config.ts`
  - Transpiles Reshaped for optimization
  - Remote image patterns for Strapi uploads
  - Removes console logs in production
- **Turbo**: `turbo.json` - Build pipeline configuration
- **PostCSS**: `apps/next/postcss.config.mjs` - Reshaped viewport tokens
- **TypeScript**: `apps/next/tsconfig.json` - Strict mode with path aliases

## Pre-Commit Checklist

- [ ] `yarn workspace next typecheck` passes
- [ ] `yarn workspace next lint` passes
- [ ] `yarn workspace next test` passes
- [ ] Component works at all breakpoints
- [ ] No console errors
- [ ] Accessibility tested

## Common Issues

1. **Module not found**: Check import path, run `yarn install`
2. **TypeScript errors in tests**: Import from `@/libs/testing/testing-wrapper` not `@testing-library/react`
3. **Styles not applying**: Check SCSS module imported, use `className={styles.className}`
4. **Build breaks tests**: Never run `yarn build` when checking tests
