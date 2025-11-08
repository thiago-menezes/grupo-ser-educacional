# Home Areas Selector - Kanban

## 📋 Component Overview

**Component**: Study Areas Selector Section
**Page**: `/[institution]` (Homepage)
**Priority**: Medium
**Estimated Effort**: 2 days

### Design Reference
- **Mockup**: `/docs/home.jpg` (section with area images in grid)
- **Figma**: Awaiting JSON export

### Features
- Section title: "Já sabe que área seguir então busque o curso ideal"
- Grid of area cards with images
- Each card shows:
  - Background image
  - Area name overlay
  - Course count (optional)
  - Clickable to filter courses
- Areas include:
  - Engenharia & Tecnologia
  - Ciências Humanas
  - Ciências da Saúde
  - Ciências Exatas e da Terra
  - And more...
- "Mais cursos" link to view all
- Responsive grid

---

## 🎯 Technical Requirements

### Stack
- Next.js 15 (Server Component)
- Reshaped UI components
- TypeScript
- SCSS Modules
- next/image for optimized images

### Data Sources
- **Strapi**: Areas section content, area images

### Key Components
```typescript
<AreasSection>
  <SectionHeader />
  <AreasGrid>
    <AreaCard />
    <AreaCard />
    ...
  </AreasGrid>
  <ViewAllLink />
</AreasSection>
```

### Responsive Breakpoints
- Mobile: < 768px (2 columns)
- Tablet: 768px - 1024px (3 columns)
- Desktop: > 1024px (4 columns)

---

## 📊 Tasks

### Backlog
- [ ] Review areas grid design
- [ ] Identify all study areas
- [ ] Define Strapi areas component

### To Do
- [ ] **Task 1**: Create areas section container
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - `src/features/home/components/AreasSection/AreasSection.tsx`
    - `src/features/home/components/AreasSection/AreasSection.module.scss`
  - **Acceptance Criteria**:
    - Section with title
    - Grid container
    - "Mais cursos" link
  - **Figma Support**: Screenshot + JSON export

- [ ] **Task 2**: Build area card component
  - **Assignee**: TBD
  - **Effort**: 1 day
  - **Deliverables**:
    - `src/features/home/components/AreasSection/AreaCard.tsx`
  - **Acceptance Criteria**:
    - Background image (next/image)
    - Dark overlay for text readability
    - Area name overlay (white text)
    - Optional: Course count badge
    - Hover effect (zoom image or lighten overlay)
    - Clickable (navigates to filtered course search)
    - Aspect ratio maintained (square or 16:9)
  - **Figma Support**: Individual card screenshot

- [ ] **Task 3**: Implement grid layout
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - Grid CSS
  - **Acceptance Criteria**:
    - 4 columns on desktop
    - 3 columns on tablet
    - 2 columns on mobile
    - Equal height cards
    - Proper gap spacing
  - **Figma Support**: Grid spacing specs

- [ ] **Task 4**: Add image overlays and text
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - Overlay component
    - Typography styles
  - **Acceptance Criteria**:
    - Dark overlay (rgba(0,0,0,0.4))
    - White text centered
    - Bold font weight
    - Readable on all images
  - **Figma Support**: Overlay opacity specs

- [ ] **Task 5**: Implement hover effects
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - Hover state CSS
  - **Acceptance Criteria**:
    - Image scales on hover (1.05)
    - Smooth transition (300ms)
    - Overlay lightens
    - Cursor pointer
  - **Figma Support**: Hover interaction specs

- [ ] **Task 6**: Optimize images
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - next/image configuration
  - **Acceptance Criteria**:
    - WebP format
    - Responsive sizes (srcset)
    - Lazy loading
    - No layout shift
  - **Figma Support**: N/A (optimization task)

- [ ] **Task 7**: Make responsive
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - Mobile-optimized layout
  - **Acceptance Criteria**:
    - 2 columns on mobile
    - Touch-friendly cards
    - Proper spacing
  - **Figma Support**: Mobile grid screenshot

### In Progress
<!-- Tasks being actively worked on -->

### Review
<!-- Tasks pending code review or testing -->

### Done
<!-- Completed tasks -->

---

## 🔗 Dependencies

### Blocked By
- [ ] Strapi Home Page with areas_section component
- [ ] Study area images uploaded to Strapi

### Blocks
- [ ] None (self-contained section)

---

## 🧪 Testing Checklist

- [ ] **Unit Tests**
  - [ ] AreaCard renders with props
  - [ ] Links navigate correctly
  - [ ] Images load with proper alt text

- [ ] **Integration Tests**
  - [ ] Strapi areas load
  - [ ] Images optimized correctly
  - [ ] Clicking card filters course search

- [ ] **Visual Tests**
  - [ ] Screenshot grid at all breakpoints
  - [ ] Hover states captured
  - [ ] Overlay visibility on all images

- [ ] **Accessibility Tests**
  - [ ] Images have alt text
  - [ ] Links keyboard accessible
  - [ ] Color contrast sufficient
  - [ ] Cards have descriptive labels

- [ ] **Performance Tests**
  - [ ] Images lazy load
  - [ ] No layout shift (CLS)
  - [ ] Fast hover transitions

---

## 📦 Strapi Integration

### API Endpoint
```
GET /api/home-pages?filters[institution][slug][$eq]=uninassau&populate[areas_section][populate]=*
```

### Expected Response
```typescript
{
  data: {
    attributes: {
      areas_section: {
        title: "Já sabe que área seguir então busque o curso ideal",
        areas: [
          {
            name: "Engenharia & Tecnologia",
            image: {
              data: {
                attributes: {
                  url: string
                  alternativeText: string
                  formats: { ... }
                }
              }
            },
            icon?: { data: { ... } },
            courses_count?: 15,
            filter_tag: "Engenharia & Tecnologia" // Used for course search filter
          },
          {
            name: "Ciências Humanas",
            // ...
          }
          // ... more areas
        ]
      }
    }
  }
}
```

---

## 🎨 Figma Integration Workflow

When this task is assigned, the following will be provided:

1. **Screenshots**:
   - Full grid (desktop)
   - Individual card (default and hover)
   - Mobile 2-column layout

2. **Figma JSON Export**:
   - Card dimensions
   - Grid gaps
   - Typography (area name)
   - Overlay opacity
   - Hover scale factor

3. **Assets**:
   - All area images (high resolution)
   - Optional: Area icons

---

## 📝 Implementation Notes

### Performance Considerations
- Use next/image with `fill` prop for aspect ratio
- Lazy load images below the fold
- Optimize images (WebP, multiple sizes)
- Use `priority` only for first 4 images

### Accessibility
- Each card is a link with descriptive text
- Images have alt text describing the area
- Keyboard navigation works
- Focus indicator visible

### SEO
- Descriptive link text (not just "Learn more")
- Alt text on images
- Semantic HTML

### UX
- Smooth hover transitions
- Visual feedback on click
- Consistent card sizes

---

## ✅ Definition of Done

- [ ] Code merged to main branch
- [ ] All tests passing
- [ ] Accessibility audit passed
- [ ] Works on all breakpoints
- [ ] Tested with all institution themes
- [ ] Strapi integration working
- [ ] Images optimized
- [ ] Hover effects smooth
- [ ] Code reviewed and approved

---

**Created**: 2025-11-07
**Last Updated**: 2025-11-07
**Status**: To Do
