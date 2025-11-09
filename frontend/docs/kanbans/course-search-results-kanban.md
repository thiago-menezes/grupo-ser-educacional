# Course Search Results - Kanban

## 📋 Component Overview

**Component**: Course Search Results Grid
**Page**: `/[institution]/cursos` (Course Search)
**Priority**: High
**Estimated Effort**: 2-3 days

### Design Reference

- **Mockup**: `/docs/busca.jpg` (main content area)
- **Figma**: Awaiting JSON export

### Features

- Page header:
  - Title: "Encontre o curso ideal para você"
  - Results count: "150 cursos encontrados"
  - Sort dropdown: "Ordenar por: Mais relevantes"
- Grid of course cards (3 columns on desktop)
- Reuses CourseCard component from homepage
- Pagination at bottom
- Loading states (skeletons)
- Empty state (no results)
- Responsive layout

---

## 🎯 Technical Requirements

### Stack

- Next.js 15 (Client Component for pagination)
- Reshaped UI (Select, Pagination)
- TypeScript
- SCSS Modules
- React Query (data fetching)

### Data Sources

- **Courses API**: Filtered and sorted courses
- **URL Params**: Filters, sort, page

### Key Components

```typescript
<CourseSearchResults>
  <ResultsHeader>
    <ResultsCount />
    <SortDropdown />
  </ResultsHeader>
  <CourseGrid>
    <CourseCard /> {/* Reused from home */}
    <CourseCard />
    ...
  </CourseGrid>
  <Pagination />
  <EmptyState /> {/* Shown when no results */}
</CourseSearchResults>
```

### Responsive Breakpoints

- Mobile: < 768px (1 column)
- Tablet: 768px - 1024px (2 columns)
- Desktop: > 1024px (3 columns)

---

## 📊 Tasks

### Backlog

- [ ] Review results page design
- [ ] Understand API response format
- [ ] Plan pagination strategy

### To Do

- [ ] **Task 1**: Create results container
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - `src/features/course-search/components/CourseSearchResults/CourseSearchResults.tsx`
    - `src/features/course-search/components/CourseSearchResults/CourseSearchResults.module.scss`
  - **Acceptance Criteria**:
    - Main content area layout
    - Responsive grid container
    - Integration with filters sidebar
  - **Figma Support**: Screenshot + JSON export

- [ ] **Task 2**: Build results header
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/features/course-search/components/CourseSearchResults/ResultsHeader.tsx`
  - **Acceptance Criteria**:
    - Page title (h1)
    - Results count display
    - Sort dropdown (aligned right)
    - Responsive (stack on mobile)
  - **Figma Support**: Header screenshot

- [ ] **Task 3**: Implement sort dropdown
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/features/course-search/components/CourseSearchResults/SortDropdown.tsx`
  - **Acceptance Criteria**:
    - Reshaped Select component
    - Options: Mais relevantes, Menor preço, Maior preço, Nome A-Z
    - Updates URL param
    - Triggers new search
  - **Figma Support**: Dropdown design

- [ ] **Task 4**: Create course results grid
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/features/course-search/components/CourseSearchResults/CourseGrid.tsx`
  - **Acceptance Criteria**:
    - Reuses CourseCard from home
    - 3 columns on desktop
    - Equal height cards
    - Proper gap spacing
    - Responsive (1-2-3 columns)
  - **Figma Support**: Grid layout specs

- [ ] **Task 5**: Integrate with Courses API
  - **Assignee**: TBD
  - **Effort**: 1 day
  - **Deliverables**:
    - `src/features/course-search/hooks/useCourseSearch.ts`
  - **Acceptance Criteria**:
    - Fetch courses with filters
    - Support pagination
    - Support sorting
    - React Query caching
    - Handle loading states
    - Handle errors
  - **Figma Support**: N/A (backend integration)

- [ ] **Task 6**: Add pagination component
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/features/course-search/components/CourseSearchResults/Pagination.tsx`
  - **Acceptance Criteria**:
    - Page numbers (1, 2, 3, ..., 10)
    - Previous/Next buttons
    - Updates URL param
    - Scrolls to top on page change
    - Accessible (keyboard navigation)
  - **Figma Support**: Pagination design from mockup

- [ ] **Task 7**: Implement loading skeletons
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - Reuse CourseCardSkeleton
  - **Acceptance Criteria**:
    - Shows grid of skeletons while loading
    - Matches CourseCard layout
    - Shimmer animation
  - **Figma Support**: N/A (standard skeleton)

- [ ] **Task 8**: Create empty state
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/features/course-search/components/CourseSearchResults/EmptyState.tsx`
  - **Acceptance Criteria**:
    - Friendly message: "Nenhum curso encontrado"
    - Suggestions: "Tente ajustar os filtros"
    - Optional: "Limpar filtros" button
    - Optional: Illustration
  - **Figma Support**: Empty state design (if available)

- [ ] **Task 9**: Add error state
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - Error boundary or fallback UI
  - **Acceptance Criteria**:
    - User-friendly error message
    - "Tentar novamente" button
    - Doesn't break page layout
  - **Figma Support**: N/A

- [ ] **Task 10**: Optimize for performance
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - Performance optimizations
  - **Acceptance Criteria**:
    - Virtualized list for many results (optional)
    - Efficient re-renders
    - Prefetch next page on hover
    - Debounced filter updates
  - **Figma Support**: N/A

### In Progress

<!-- Tasks being actively worked on -->

### Review

<!-- Tasks pending code review or testing -->

### Done

<!-- Completed tasks -->

---

## 🔗 Dependencies

### Blocked By

- [ ] CourseCard component (from homepage)
- [ ] Courses API with filtering/sorting
- [ ] Course filters component

### Blocks

- [ ] Course details page (linked from cards)

---

## 🧪 Testing Checklist

- [ ] **Unit Tests**
  - [ ] Results count displays correctly
  - [ ] Sort dropdown updates state
  - [ ] Pagination calculates pages correctly

- [ ] **Integration Tests**
  - [ ] Courses load with filters applied
  - [ ] Sorting changes order
  - [ ] Pagination fetches new page
  - [ ] Empty state shows when no results
  - [ ] Error state shows on API failure

- [ ] **Visual Tests**
  - [ ] Screenshot results grid at all breakpoints
  - [ ] Loading state captured
  - [ ] Empty state captured

- [ ] **Accessibility Tests**
  - [ ] Results count announced to screen readers
  - [ ] Pagination keyboard accessible
  - [ ] Course cards focusable
  - [ ] Sort dropdown accessible

- [ ] **Performance Tests**
  - [ ] Large result sets perform well
  - [ ] No unnecessary API calls
  - [ ] Efficient re-renders

---

## 📦 Courses API Integration

### API Endpoint

```
GET /api/courses?institution_code=UNINASSAU&degree_type=Graduação&modality=Presencial,EAD&min_price=800&max_price=2000&page=1&limit=12&sort_by=price_asc
```

### Expected Response

```typescript
{
  data: [
    {
      id: string
      name: string
      area: string
      degree_type: string
      modalities: string[]
      duration: {
        years: number
        semesters: number
      }
      pricing: {
        monthly_fee: number
        currency: string
      }
      campus: {
        name: string
        city: string
        state: string
      }
      slug: string
    }
  ],
  meta: {
    total: number
    page: number
    limit: number
    total_pages: number
  }
}
```

### React Query Hook

```typescript
// src/features/course-search/hooks/useCourseSearch.ts
export function useCourseSearch(
  filters: CourseFilters,
  page: number,
  sortBy: string,
) {
  return useQuery({
    queryKey: ['courses', 'search', filters, page, sortBy],
    queryFn: () => fetchCourses(filters, page, sortBy),
    keepPreviousData: true, // Smooth pagination
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
```

---

## 🎨 Figma Integration Workflow

When this task is assigned, the following will be provided:

1. **Screenshots**:
   - Full results page (desktop)
   - Results header with sort dropdown
   - Pagination component
   - Mobile stacked view
   - Empty state

2. **Figma JSON Export**:
   - Grid layout specs
   - Typography (title, count)
   - Sort dropdown styles
   - Pagination button styles

3. **Assets**:
   - Empty state illustration (optional)

---

## 📝 Implementation Notes

### Performance Considerations

- Use `keepPreviousData` in React Query for smooth pagination
- Prefetch next page on pagination hover
- Virtualize list if > 50 results per page
- Debounce filter changes to reduce API calls

### Accessibility

- Results count announced to screen readers
- Pagination keyboard accessible (tab + enter)
- Focus management (scroll to top on page change)
- Loading state announced

### UX

- Show loading state immediately on filter change
- Preserve scroll position when returning from course details
- Show "Back to search" breadcrumb on details page
- Smooth transitions between states

### SEO

- Server-side render first page of results
- Dynamic meta tags with filter info
- Canonical URL for paginated results

---

## ✅ Definition of Done

- [ ] Code merged to main branch
- [ ] All tests passing
- [ ] Accessibility audit passed
- [ ] Works on all breakpoints
- [ ] API integration working
- [ ] Loading states functional
- [ ] Empty state functional
- [ ] Pagination working
- [ ] Sorting working
- [ ] Performance optimized
- [ ] Code reviewed and approved

---

**Created**: 2025-11-07
**Last Updated**: 2025-11-07
**Status**: To Do
