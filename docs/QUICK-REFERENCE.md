# Quick Reference Guide - Developer Cheat Sheet

Quick access to common information you'll need while implementing components.

## 🚀 Development Workflow

Follow these steps when implementing a new feature or fixing a bug:

1. **Understand the problem** - Analyze requirements, edge cases, and how it integrates with existing code
2. **Plan the solution** - Sketch component structure, state management, and API contracts before coding
3. **Implement** - Write code, tests, and documentation together
4. **Validate** - Run all checks before committing:
   ```bash
   yarn workspace next test              # Run all tests
   yarn workspace next lint              # Check code style
   yarn workspace next typecheck         # Verify TypeScript types
   ```
5. **Update tracking** - Mark the task as complete in the appropriate kanban file (`docs/kanbans/*.md`)

PS: Never run `yarn build` when checking tests - it breaks the app

---

## 📁 File Structure

```
src/
├── app/
│   ├── [institution]/              # Dynamic routes per institution
│   │   ├── page.tsx                # Homepage
│   │   ├── cursos/
│   │   │   ├── page.tsx            # Course search
│   │   │   └── [slug]/page.tsx     # Course details
│   │   └── inscricao/
│   │       └── [courseId]/page.tsx # Lead enrichment
│   └── layout.tsx
├── components/                      # Global reusable components
│   ├── Header/
│   ├── Footer/
│   ├── CourseCard/
│   ├── Breadcrumb/
│   └── RichText/
├── features/                        # Feature-specific components
│   ├── home/
│   ├── course-search/
│   │   └── context.tsx             # Feature-specific context
│   ├── course-details/
│   └── lead-enrichment/
├── contexts/                        # Global/shared contexts
│   ├── city.tsx                    # City context (business rule)
│   └── courses.tsx                 # Courses context (business rule)
├── libs/
│   ├── api/                         # Axios + React Query
│   ├── auth/                        # NextAuth
│   └── testing/
└── config/
    └── institutions.ts              # Institution registry
```

---

## 🔄 Context Patterns

### Context File Naming

**Feature/Component-specific contexts:**

- Use `context.tsx` inside the feature/component folder
- Example: `src/features/course-search/context.tsx`

**Global/shared contexts:**

- Use business rule name in `src/contexts/` folder
- Examples: `src/contexts/city.tsx`, `src/contexts/courses.tsx`

### Context Implementation Pattern

```typescript
// src/contexts/city.tsx (global context)
'use client';

import { createContext, useContext, useState, useCallback } from 'react';

type CityContextValue = {
  city: string;
  state: string;
  setCity: (city: string) => void;
};

const CityContext = createContext<CityContextValue | undefined>(undefined);

export function CityProvider({ children }: { children: ReactNode }) {
  const [city, setCityValue] = useState('');
  const [state, setStateValue] = useState('');

  const setCity = useCallback((newCity: string) => {
    setCityValue(newCity);
  }, []);

  return (
    <CityContext.Provider value={{ city, state, setCity }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCityContext() {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error('useCityContext must be used within a CityProvider');
  }
  return context;
}
```

```typescript
// src/features/course-search/context.tsx (feature-specific context)
"use client";

import { createContext, useContext } from "react";

const CourseFiltersContext = createContext<CourseFiltersContextValues>(
  {} as CourseFiltersContextValues,
);

export const CourseFiltersProvider = ({ children }: PropsWithChildren) => {
  // Context implementation
};

export const useCourseFiltersContext = () => {
  const context = useContext(CourseFiltersContext);
  if (context === undefined) {
    throw new Error(
      "useCourseFiltersContext must be used within CourseFiltersProvider",
    );
  }
  return context;
};
```

---

## 🎨 Reshaped Components Cheat Sheet

### Available Components

**Main Components**: ActionBar, Alert, Autocomplete, Avatar, Badge, Breadcrumbs, Button, Calendar, Card, Carousel, Checkbox, CheckboxGroup, ContextMenu, Divider, DropdownMenu, FileUpload, Hotkey, Link, Loader, MenuItem, Modal, NumberField, Pagination, PinField, Popover, Progress, ProgressIndicator, Radio, RadioGroup, Resizable, Scrim, Select, Skeleton, Slider, Stepper, Switch, Table, Tabs, TextArea, TextField, Timeline, Toast, ToggleButton, ToggleButtonGroup, Tooltip

**Utility Components**: Accordion, Actionable, Container, Dismissible, Flyout, FormControl, Grid, Hidden, HiddenVisually, Icon, Image, Overlay, Reshaped, ScrollArea, Text, Theme, View

**Storybook**: https://main--5ed400f96e43cc00226d4df6.chromatic.com/

### Commonly Used Components

```tsx
import {
  Button,
  TextField,
  Select,
  Checkbox,
  Radio,
  Card,
  Badge,
  Modal,
  Slider
} from 'reshaped'

// Button
<Button variant="primary" size="medium">Click me</Button>

// TextField
<TextField
  name="email"
  type="email"
  placeholder="Enter email"
  error="Invalid email"
/>

// Select
<Select
  name="city"
  options={[
    { value: 'sp', label: 'São Paulo' },
    { value: 'rj', label: 'Rio de Janeiro' }
  ]}
/>

// Card
<Card padding={4}>
  <Card.Header>Title</Card.Header>
  <Card.Content>Content here</Card.Content>
</Card>

// Badge
<Badge color="primary">Presencial</Badge>
```

---

## 🔌 API Integration Patterns

### React Query Hook Pattern

```typescript
// src/features/[feature]/hooks/use[Feature].ts
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/libs/api/axios";

export function useCourses(filters: CourseFilters) {
  return useQuery({
    queryKey: ["courses", filters],
    queryFn: async () => {
      const { data } = await apiClient.get("/courses", { params: filters });
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: Boolean(filters.institution),
  });
}

// Usage in component
const { data, isLoading, error } = useCourses({ institution: "uninassau" });
```

### Mutation Pattern

```typescript
import { useMutation } from "@tanstack/react-query";

export function useLeadSubmission() {
  return useMutation({
    mutationFn: async (leadData: LeadFormData) => {
      const { data } = await apiClient.post("/leads", leadData);
      return data;
    },
    onSuccess: (data) => {
      // Redirect or show success
    },
    onError: (error) => {
      // Show error message
    },
  });
}

// Usage
const mutation = useLeadSubmission();
mutation.mutate(formData);
```

---

## 📝 Form Validation Pattern

### React Hook Form + Zod

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Define schema
const schema = z.object({
  full_name: z.string().min(3, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido')
})

type FormData = z.infer<typeof schema>

// In component
const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema)
})

const onSubmit = (data: FormData) => {
  console.log(data)
}

// In JSX
<form onSubmit={handleSubmit(onSubmit)}>
  <TextField
    {...register('email')}
    error={errors.email?.message}
  />
</form>
```

---

## 🎯 URL State Management

### useSearchParams Pattern

```typescript
"use client";
import { useSearchParams, useRouter } from "next/navigation";

export function useFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filters = {
    city: searchParams.get("city") || "",
    modality: searchParams.getAll("modality"),
  };

  const updateFilter = (key: string, value: string | string[]) => {
    const params = new URLSearchParams(searchParams);

    if (Array.isArray(value)) {
      params.delete(key);
      value.forEach((v) => params.append(key, v));
    } else {
      params.set(key, value);
    }

    router.push(`?${params.toString()}`);
  };

  return { filters, updateFilter };
}
```

---

## 🎨 Theming & Styling

### SCSS Module Pattern

```scss
// Component.module.scss
.container {
  padding: var(--rs-unit-x4);
  background: var(--rs-color-background-primary);
}

.title {
  font-size: var(--rs-font-size-featured-1);
  color: var(--rs-color-foreground-neutral);
}

// Use Reshaped color tokens
.buttonPrimary {
  color: var(--rs-color-background-primary);
  background: var(--rs-color-background-primary-faded);
}

.buttonCritical {
  color: var(--rs-color-background-critical);
  background: var(--rs-color-background-critical-faded);
}
```

### Design Tokens Rules

- **Always use Reshaped design tokens** - never create custom SCSS variables
- **Never create custom breakpoint variables** - use `@media (--rs-viewport-m)` instead
- **Never create custom color variables** - use `var(--rs-color-background-primary)` etc.
- All tokens are defined in `src/styles/tokens.scss` and theme files

### Accessing Institution Theme

```typescript
// Theme is injected via CSS variables
const styles = {
  backgroundColor: "var(--institution-primary-color)",
  color: "var(--institution-secondary-color)",
};
```

---

## 🧪 Testing Patterns

### Component Test

```typescript
import { render, screen } from '@/libs/testing/testing-wrapper'
import { CourseCard } from './CourseCard'

describe('CourseCard', () => {
  it('renders course information', () => {
    render(<CourseCard course={mockCourse} />)

    expect(screen.getByText('Engenharia Civil')).toBeInTheDocument()
    expect(screen.getByText('R$ 950,10')).toBeInTheDocument()
  })

  it('navigates to course details on click', async () => {
    const { user } = render(<CourseCard course={mockCourse} />)

    await user.click(screen.getByText('Mais sobre o curso'))

    // Assert navigation
  })
})
```

### Integration Test with API

```typescript
import { server } from '@/libs/testing/msw-server'
import { rest } from 'msw'

it('loads courses from API', async () => {
  server.use(
    rest.get('/api/courses', (req, res, ctx) => {
      return res(ctx.json({ data: mockCourses }))
    })
  )

  render(<CourseSearch />)

  await screen.findByText('Engenharia Civil')
})
```

---

## 📱 Responsive Breakpoints

Use Reshaped PostCSS custom media queries:

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
```

**Available Viewport Tokens**:

- `--rs-viewport-s` - Small (mobile, max-width: 659px)
- `--rs-viewport-m` - Medium (≥660px)
- `--rs-viewport-l` - Large (≥900px)
- `--rs-viewport-xl` - Extra Large (≥1280px)

**DO NOT** create custom breakpoint variables or use `calc()` with viewport tokens.

---

## 🔍 Common Commands

```bash
# Development
yarn dev:next

# Type checking
yarn workspace next typecheck

# Linting
yarn workspace next lint

# Testing
yarn workspace next test                    # All tests
yarn workspace next test:unit              # Unit tests only
yarn workspace next test:integration       # Integration tests
yarn workspace next test -- CourseCard     # Specific test file

# Build
yarn build:next
yarn start:next                  # Serve production build
```

---

## 🌐 API Endpoints Reference

### Strapi (Content)

```
GET /api/institutions/:slug
GET /api/home-pages?filters[institution][slug][$eq]=:slug
GET /api/course-enrichments?filters[course_id][$eq]=:id
```

### Courses API (External)

```
GET /api/courses
  ?institution_code=UNINASSAU
  &modality=Presencial
  &page=1
  &limit=12

GET /api/courses/:id
  ?institution_code=UNINASSAU

POST /api/leads
PUT /api/leads/:id
```

---

## 🎨 Institution Slugs

```typescript
const institutions = {
  uninassau: "UNINASSAU",
  ung: "UNG",
  uninorte: "UNINORTE",
  unifael: "UNIFAEL",
  unama: "UNAMA",
};
```

Default institution: `uninassau`

---

## ✅ Pre-Commit Checklist

Before committing:

- [ ] `yarn workspace next typecheck` passes
- [ ] `yarn workspace next lint` passes
- [ ] `yarn workspace next test` passes
- [ ] Component works at all breakpoints
- [ ] Accessibility tested (keyboard, screen reader)
- [ ] No console errors
- [ ] Code reviewed by peer

---

## 🆘 Common Issues & Solutions

### Issue: "Module not found"

**Solution**: Check import path is correct, run `yarn install`

### Issue: TypeScript errors in tests

**Solution**: Import from `@/libs/testing/testing-wrapper` not `@testing-library/react`

### Issue: Styles not applying

**Solution**:

1. Check SCSS module imported: `import styles from './Component.module.scss'`
2. Use `className={styles.className}` not `className="className"`

### Issue: API not returning data

**Solution**:

1. Check network tab for request
2. Verify query key in React Query DevTools
3. Check `enabled` condition in useQuery

### Issue: Images not loading

**Solution**: Use `next/image` component, verify path is correct

---

## 📚 Useful Resources

- **Reshaped Docs**: https://reshaped.so/docs
- **Next.js 15 Docs**: https://nextjs.org/docs
- **React Query Docs**: https://tanstack.com/query/latest/docs/react
- **Zod Docs**: https://zod.dev/
- **Testing Library**: https://testing-library.com/docs/react-testing-library/intro/

---

## 🔖 Code Snippets

### Server Component

```tsx
// app/[institution]/page.tsx
import { Suspense } from "react";

export default async function HomePage({
  params,
}: {
  params: { institution: string };
}) {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <AsyncContent institution={params.institution} />
      </Suspense>
    </div>
  );
}
```

### Client Component

```tsx
"use client";
import { useState } from "react";

export function InteractiveComponent() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

### Error Boundary

```tsx
// app/[institution]/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Algo deu errado</h2>
      <button onClick={reset}>Tentar novamente</button>
    </div>
  );
}
```

---

**Keep this doc handy while coding!**

For detailed information, refer to main documentation files in `/docs`.
