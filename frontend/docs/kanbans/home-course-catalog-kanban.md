# Home Course Catalog - Kanban

## 📋 Component Overview

**Component**: Featured Courses Section
**Page**: `/[institution]` (Homepage)
**Priority**: High
**Estimated Effort**: 3-4 days

### Design Reference
- **Mockup**: `/docs/home.jpg` (course cards grid)
- **Figma**: Awaiting JSON export

### Features
- Section title: "Encontre o seu curso e transforme sua carreira!"
- Subtitle with location
- Grid of course cards (4 per row on desktop)
- Each card shows:
  - Course name
  - Degree type (Bacharelado, Licenciatura, Tecnólogo)
  - Duration (years and semesters)
  - Modality badges (Presencial, Semipresencial, EAD)
  - Price (monthly fee)
  - Campus location
  - "Mais sobre o curso" CTA button
- "Ver todos os cursos" link
- Responsive grid

---

## 🎯 Technical Requirements

### Stack
- Next.js 15 (Server + Client Components)
- Reshaped UI (Card, Badge, Button)
- TypeScript
- SCSS Modules
- React Query (for course data)

### Data Sources
- **Strapi**: Section title, featured course IDs
- **Courses API**: Course details (name, price, campus, etc.)
- **Strapi Course Enrichment**: Additional course metadata

### Key Components
```typescript
<CourseCatalog>
  <CatalogHeader />
  <CourseGrid>
    <CourseCard />
    <CourseCard />
    ...
  </CourseGrid>
  <ViewAllLink />
</CourseCatalog>
```

### Responsive Breakpoints
- Mobile: < 768px (1 column)
- Tablet: 768px - 1024px (2 columns)
- Desktop: > 1024px (3-4 columns)

---

## 📊 Tasks

### Backlog
- [ ] Review course card design
- [ ] Understand API response structure
- [ ] Plan data fetching strategy (SSR vs CSR)

### To Do
- [ ] **Task 1**: Create course catalog container
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - `src/features/home/components/CourseCatalog/CourseCatalog.tsx`
    - `src/features/home/components/CourseCatalog/CourseCatalog.module.scss`
  - **Acceptance Criteria**:
    - Section with title and subtitle
    - Grid container ready
    - "Ver todos os cursos" link
  - **Figma Support**: Screenshot + JSON export

- [ ] **Task 2**: Build course card component
  - **Assignee**: TBD
  - **Effort**: 2 days
  - **Deliverables**:
    - `src/components/CourseCard/CourseCard.tsx` (reusable)
    - `src/components/CourseCard/CourseCard.module.scss`
  - **Acceptance Criteria**:
    - Displays course name (h3)
    - Shows degree type icon + text
    - Displays duration with clock icon
    - Modality badges (colored pills)
    - Price formatting (R$ 950,10)
    - Campus name and location
    - CTA button at bottom
    - Hover effect (shadow lift)
    - Reshaped Card component as base
  - **Figma Support**: Detailed card screenshot + specs

- [ ] **Task 3**: Implement modality badges
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/components/CourseCard/ModalityBadges.tsx`
  - **Acceptance Criteria**:
    - Badge for each modality
    - Color coded (Presencial, Semipresencial, EAD)
    - Reshaped Badge component
    - Compact spacing
  - **Figma Support**: Badge color specs

- [ ] **Task 4**: Create course grid layout
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/features/home/components/CourseCatalog/CourseGrid.tsx`
  - **Acceptance Criteria**:
    - CSS Grid or Flexbox
    - 4 columns on desktop
    - 2 columns on tablet
    - 1 column on mobile
    - Equal height cards
    - Proper gap spacing
  - **Figma Support**: Grid spacing specs

- [ ] **Task 5**: Integrate with Courses API
  - **Assignee**: TBD
  - **Effort**: 1 day
  - **Deliverables**:
    - `src/features/courses/api/courses.ts`
    - `src/features/courses/hooks/useFeaturedCourses.ts`
  - **Acceptance Criteria**:
    - Fetch courses by IDs from Strapi
    - Merge with Course Enrichment data
    - Handle loading states
    - Handle error states
    - Cache with React Query
  - **Figma Support**: N/A (backend integration)

- [ ] **Task 6**: Add loading skeletons
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/components/CourseCard/CourseCardSkeleton.tsx`
  - **Acceptance Criteria**:
    - Skeleton matches card layout
    - Shimmer animation
    - Shows while loading
    - Accessible (aria-busy)
  - **Figma Support**: N/A (standard skeleton)

- [ ] **Task 7**: Implement error states
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - Error boundary or fallback UI
  - **Acceptance Criteria**:
    - User-friendly error message
    - Retry button
    - Doesn't break page layout
  - **Figma Support**: N/A (error state design)

- [ ] **Task 8**: Make fully responsive
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - Mobile-optimized cards
  - **Acceptance Criteria**:
    - Cards stack on mobile
    - Readable font sizes
    - Touch-friendly buttons
    - Proper spacing
  - **Figma Support**: Mobile course card screenshot

### In Progress
<!-- Tasks being actively worked on -->

### Review
<!-- Tasks pending code review or testing -->

### Done
<!-- Completed tasks -->

---

## 🔗 Dependencies

### Blocked By
- [ ] Courses API implemented (GET /api/courses)
- [ ] Strapi Course Enrichment collection type
- [ ] Strapi Home Page with featured_courses relation

### Blocks
- [ ] Course search page (reuses CourseCard)
- [ ] Course details page (similar data structure)

---

## 🧪 Testing Checklist

- [ ] **Unit Tests**
  - [ ] CourseCard renders with all props
  - [ ] Price formatting correct
  - [ ] Duration display correct
  - [ ] Badges render for each modality

- [ ] **Integration Tests**
  - [ ] Featured courses load from API
  - [ ] Clicking card navigates to course details
  - [ ] Loading state shows skeletons
  - [ ] Error state shows fallback

- [ ] **Visual Tests**
  - [ ] Screenshot all card variations
  - [ ] Grid layouts at all breakpoints
  - [ ] Hover states

- [ ] **Accessibility Tests**
  - [ ] Cards keyboard accessible
  - [ ] Semantic heading hierarchy
  - [ ] Color contrast on badges
  - [ ] Screen reader announces correctly

- [ ] **Performance Tests**
  - [ ] Cards lazy load images
  - [ ] No layout shift (CLS)
  - [ ] Efficient re-renders

---

## 📦 Strapi + API Integration

### Strapi Endpoint
```
GET /api/home-pages?filters[institution][slug][$eq]=uninassau&populate[featured_courses]=*
```

**Response**:
```typescript
{
  data: {
    attributes: {
      featured_courses_title: "Encontre o seu curso e transforme sua carreira!",
      featured_courses: {
        data: [
          {
            id: 1,
            attributes: {
              course_id: "eng-civil-123" // Use this to fetch from Courses API
            }
          }
        ]
      }
    }
  }
}
```

### Courses API Endpoint
```
GET /api/courses?ids[]=eng-civil-123&ids[]=sociologia-456&institution_code=UNINASSAU
```

**Response**:
```typescript
{
  data: [
    {
      id: "eng-civil-123",
      name: "Engenharia civil",
      area: "Engenharia & Tecnologia",
      degree_type: "Bacharelado",
      modalities: ["Presencial", "EAD"],
      duration: {
        years: 5,
        semesters: 10
      },
      pricing: {
        monthly_fee: 950.10,
        currency: "BRL"
      },
      campus: {
        name: "Unidade Aquarius",
        city: "São José dos Campos",
        state: "SP"
      },
      slug: "engenharia-civil"
    }
  ]
}
```

### React Query Hook
```typescript
// src/features/courses/hooks/useFeaturedCourses.ts
export function useFeaturedCourses(institutionSlug: string) {
  // 1. Fetch featured course IDs from Strapi
  const { data: homePage } = useHomePage(institutionSlug)

  // 2. Extract course IDs
  const courseIds = homePage?.featured_courses.map(fc => fc.course_id) || []

  // 3. Fetch course details from Courses API
  return useQuery({
    queryKey: ['courses', 'featured', institutionSlug],
    queryFn: () => fetchCoursesByIds(courseIds, institutionSlug),
    enabled: courseIds.length > 0,
    staleTime: 10 * 60 * 1000,
  })
}
```

---

## 🎨 Figma Integration Workflow

When this task is assigned, the following will be provided:

1. **Screenshots**:
   - Course card (default state)
   - Course card (hover state)
   - Full grid (desktop view)
   - Mobile stacked view

2. **Figma JSON Export**:
   - Card dimensions
   - Typography (course name, price, etc.)
   - Spacing (internal padding, grid gaps)
   - Colors (badges, borders)
   - Icons (degree type, duration)

3. **Assets**:
   - Icons (graduation cap, clock, location pin)
   - Modality badge colors

---

## 📝 Implementation Notes

### Performance Considerations
- Server-side render (SSR) for SEO
- Prefetch course details on hover
- Optimize images (course thumbnails if any)
- Lazy load cards below the fold

### Accessibility
- Each card is a clickable region
- Heading hierarchy (h2 for section, h3 for courses)
- Price announced correctly by screen readers
- Keyboard navigation to cards

### SEO
- Course names as h3 headings
- Structured data (Course schema.org)
- Internal links to course detail pages

### Reusability
- CourseCard component reused in:
  - Homepage featured courses
  - Homepage popular courses
  - Course search results
  - Related courses carousel

---

## ✅ Definition of Done

- [ ] Code merged to main branch
- [ ] All tests passing
- [ ] Accessibility audit passed
- [ ] Works on all breakpoints
- [ ] Tested with all institution themes
- [ ] API integration working
- [ ] Loading and error states functional
- [ ] CourseCard component documented (Storybook?)
- [ ] Code reviewed and approved

---

**Created**: 2025-11-07
**Last Updated**: 2025-11-07
**Status**: To Do
