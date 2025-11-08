# Course Search Filters - Kanban

## 📋 Component Overview

**Component**: Course Search Filters Sidebar
**Page**: `/[institution]/cursos` (Course Search)
**Priority**: High
**Estimated Effort**: 3-4 days

### Design Reference
- **Mockup**: `/docs/busca.jpg` (left sidebar)
- **Figma**: Awaiting JSON export

### Features
- Collapsible filter sidebar
- Active filters display with clear all
- Filter categories:
  - **Degree Type**: Graduação / Pós-Graduação (chips)
  - **City**: Dropdown or text input
  - **Search Radius**: Slider (600m shown in mockup)
  - **Course Name**: Text search input
  - **Modality**: Checkboxes (Presencial, Semipresencial, EAD)
  - **Price Range**: Range slider (R$ 800 - R$ 2,000)
  - **Shift**: Checkboxes (Manhã, Tarde, Noite, Virtual)
  - **Duration**: Checkboxes (2-3 anos, 3-4 anos, 4+ anos)
- Filter state synced with URL params
- Mobile: Filters in modal/drawer
- "Limpar todos" button to reset

---

## 🎯 Technical Requirements

### Stack
- Next.js 15 (Client Component for interactivity)
- Reshaped UI (Checkbox, Slider, TextField, Button, Badge)
- TypeScript
- SCSS Modules
- React Hook Form + Zod (validation)
- URL state management (useSearchParams)

### Data Sources
- **URL Search Params**: Current filter state
- **Static**: Filter options (can be from Strapi later)

### Key Components
```typescript
<CourseFilters>
  <ActiveFilters />
  <FilterSection title="Graduação">
    <DegreeTypeFilter />
  </FilterSection>
  <FilterSection title="Em que cidade quer estudar?">
    <CityFilter />
  </FilterSection>
  <FilterSection title="Alcance da busca">
    <RadiusSlider />
  </FilterSection>
  <FilterSection title="Qual curso quer estudar?">
    <CourseSearchInput />
  </FilterSection>
  <FilterSection title="Modalidade do curso">
    <ModalityCheckboxes />
  </FilterSection>
  <FilterSection title="Preço da mensalidade">
    <PriceRangeSlider />
  </FilterSection>
  <FilterSection title="Turno">
    <ShiftCheckboxes />
  </FilterSection>
  <FilterSection title="Duração do curso">
    <DurationCheckboxes />
  </FilterSection>
</CourseFilters>
```

### Responsive Breakpoints
- Mobile: < 768px (filters in drawer/modal)
- Desktop: >= 768px (sidebar visible)

---

## 📊 Tasks

### Backlog
- [ ] Review filters design in mockup
- [ ] Define filter options and data types
- [ ] Plan URL state management strategy

### To Do
- [ ] **Task 1**: Create filters sidebar container
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/features/course-search/components/CourseFilters/CourseFilters.tsx`
    - `src/features/course-search/components/CourseFilters/CourseFilters.module.scss`
  - **Acceptance Criteria**:
    - Sidebar layout (fixed width on desktop)
    - Sticky positioning (scrolls with page)
    - Collapsible sections
  - **Figma Support**: Screenshot + JSON export

- [ ] **Task 2**: Build active filters display
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/features/course-search/components/CourseFilters/ActiveFilters.tsx`
  - **Acceptance Criteria**:
    - Shows applied filters as removable badges
    - "Limpar todos" button
    - Each badge has X to remove individual filter
    - Shows filter count (e.g., "Filtros aplicados (3)")
  - **Figma Support**: Active filters screenshot

- [ ] **Task 3**: Implement degree type filter
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/features/course-search/components/CourseFilters/DegreeTypeFilter.tsx`
  - **Acceptance Criteria**:
    - Two chip/button options: Graduação, Pós-Graduação
    - Toggle selection
    - Active state styling
    - Updates URL params
  - **Figma Support**: Degree type chips screenshot

- [ ] **Task 4**: Create city filter
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/features/course-search/components/CourseFilters/CityFilter.tsx`
  - **Acceptance Criteria**:
    - Dropdown or autocomplete input
    - Shows available cities (from API or static)
    - Updates URL params
  - **Figma Support**: City dropdown screenshot

- [ ] **Task 5**: Build search radius slider
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/features/course-search/components/CourseFilters/RadiusSlider.tsx`
  - **Acceptance Criteria**:
    - Reshaped Slider component
    - Range: 0 - 10km (or appropriate max)
    - Shows current value (e.g., "600m")
    - Debounced update to URL
  - **Figma Support**: Slider design specs

- [ ] **Task 6**: Implement course name search
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/features/course-search/components/CourseFilters/CourseSearchInput.tsx`
  - **Acceptance Criteria**:
    - Text input with placeholder
    - Optional: Autocomplete suggestions
    - Debounced search (500ms)
    - Updates URL params
  - **Figma Support**: Search input screenshot

- [ ] **Task 7**: Create modality checkboxes
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - `src/features/course-search/components/CourseFilters/ModalityCheckboxes.tsx`
  - **Acceptance Criteria**:
    - 3 checkboxes: Presencial, Semipresencial, EAD
    - Multi-select
    - Updates URL params (array)
  - **Figma Support**: Checkbox design

- [ ] **Task 8**: Build price range slider
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/features/course-search/components/CourseFilters/PriceRangeSlider.tsx`
  - **Acceptance Criteria**:
    - Range slider (min and max handles)
    - Shows current range (e.g., "R$ 800 - R$ 2,000")
    - Debounced update
    - Updates URL params
  - **Figma Support**: Price slider screenshot

- [ ] **Task 9**: Create shift checkboxes
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - `src/features/course-search/components/CourseFilters/ShiftCheckboxes.tsx`
  - **Acceptance Criteria**:
    - 4 checkboxes: Manhã, Tarde, Noite, Virtual
    - Multi-select
    - Shows course count per shift (optional)
    - Updates URL params
  - **Figma Support**: Checkbox design

- [ ] **Task 10**: Implement duration checkboxes
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - `src/features/course-search/components/CourseFilters/DurationCheckboxes.tsx`
  - **Acceptance Criteria**:
    - Checkboxes for duration ranges
    - Multi-select
    - Updates URL params
  - **Figma Support**: Checkbox design

- [ ] **Task 11**: Add URL state management
  - **Assignee**: TBD
  - **Effort**: 1 day
  - **Deliverables**:
    - `src/features/course-search/hooks/useFilters.ts`
  - **Acceptance Criteria**:
    - Read filters from URL on mount
    - Update URL when filters change
    - Browser back/forward works correctly
    - URL is shareable (preserves filters)
    - Type-safe filter state
  - **Figma Support**: N/A (backend logic)

- [ ] **Task 12**: Create mobile filters drawer
  - **Assignee**: TBD
  - **Effort**: 1 day
  - **Deliverables**:
    - `src/features/course-search/components/CourseFilters/MobileFiltersDrawer.tsx`
  - **Acceptance Criteria**:
    - "Filtros" button to open drawer
    - Full-screen or bottom sheet modal
    - All filters accessible
    - "Aplicar filtros" button
    - Close button
    - Keyboard accessible
  - **Figma Support**: Mobile filters screenshot

- [ ] **Task 13**: Implement filter persistence
  - **Assignee**: TBD
  - **Effort**: 0.5 day (optional)
  - **Deliverables**:
    - LocalStorage integration
  - **Acceptance Criteria**:
    - Remember last used filters
    - Option to clear saved filters
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
- [ ] Course search results component (to display filtered courses)
- [ ] Courses API with filter support

### Blocks
- [ ] Course search results (depends on filter state)

---

## 🧪 Testing Checklist

- [ ] **Unit Tests**
  - [ ] Each filter component updates state correctly
  - [ ] Active filters display correctly
  - [ ] Clear all resets filters
  - [ ] URL params parse correctly

- [ ] **Integration Tests**
  - [ ] Filters trigger course search
  - [ ] URL updates when filters change
  - [ ] Browser back/forward works
  - [ ] Multiple filters combine correctly (AND logic)

- [ ] **Visual Tests**
  - [ ] Screenshot all filter states
  - [ ] Mobile drawer captured

- [ ] **Accessibility Tests**
  - [ ] All filters keyboard accessible
  - [ ] Slider accessible (arrow keys work)
  - [ ] Labels associated with inputs
  - [ ] Focus management in drawer

- [ ] **Performance Tests**
  - [ ] Debounced inputs don't over-fetch
  - [ ] Slider performs smoothly
  - [ ] No unnecessary re-renders

---

## 📦 URL State Schema

### URL Format
```
/uninassau/cursos?degree_type=Graduação&city=São+José+dos+Campos&radius=600&modality=Presencial,EAD&min_price=800&max_price=2000&shift=Manhã,Noite&search=Engenharia
```

### TypeScript Types
```typescript
type CourseFilters = {
  degree_type?: 'Graduação' | 'Pós-Graduação'
  city?: string
  radius?: number // meters
  search?: string
  modality?: Array<'Presencial' | 'Semipresencial' | 'EAD'>
  min_price?: number
  max_price?: number
  shift?: Array<'Manhã' | 'Tarde' | 'Noite' | 'Virtual'>
  duration_years?: number[]
}
```

### Hook Usage
```typescript
const { filters, updateFilter, clearFilters } = useFilters()

// Update single filter
updateFilter('city', 'São Paulo')

// Update array filter
updateFilter('modality', ['Presencial', 'EAD'])

// Clear all
clearFilters()
```

---

## 🎨 Figma Integration Workflow

When this task is assigned, the following will be provided:

1. **Screenshots**:
   - Full filters sidebar (desktop)
   - Active filters display
   - Mobile filters drawer
   - Each filter type (expanded)

2. **Figma JSON Export**:
   - Sidebar width
   - Section spacing
   - Typography (labels, values)
   - Input/slider specs
   - Checkbox/chip styles

3. **Assets**:
   - Icons (if needed for filters)

---

## 📝 Implementation Notes

### Performance Considerations
- Debounce text inputs (500ms)
- Debounce sliders (300ms)
- Memoize filter components
- Optimize URL updates (batch changes)

### Accessibility
- All filters keyboard accessible
- Sliders work with arrow keys
- Screen reader announces filter changes
- Mobile drawer traps focus

### UX
- Show course count for each filter option (optional)
- Disable options with 0 results (optional)
- Smooth animations for filter changes
- Clear visual feedback

---

## ✅ Definition of Done

- [ ] Code merged to main branch
- [ ] All tests passing
- [ ] Accessibility audit passed
- [ ] Works on all breakpoints
- [ ] URL state working correctly
- [ ] All filter types implemented
- [ ] Mobile drawer functional
- [ ] Debouncing optimized
- [ ] Code reviewed and approved

---

**Created**: 2025-11-07
**Last Updated**: 2025-11-07
**Status**: To Do
