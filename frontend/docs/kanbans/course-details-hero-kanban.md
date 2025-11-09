# Course Details Hero - Kanban

## 📋 Component Overview

**Component**: Course Details Hero Section
**Page**: `/[institution]/cursos/[slug]` (Course Details)
**Priority**: High
**Estimated Effort**: 2 days

### Design Reference

- **Mockup**: `/docs/curso.jpg` (top section)
- **Figma**: Awaiting JSON export

### Features

- Breadcrumb navigation (Home / Lista de cursos / Course name)
- Large hero image or video placeholder
- Course title (h1)
- Course metadata:
  - Degree type icon + text (Bacharelado)
  - Duration with icon (5 anos, 10 semestres)
- "Visualizar grade curricular" link
- Modality selector (Presencial / Semipresencial / EAD)
- Entry method selector (Vestibular / ENEM / Transferência / Outro diploma)
- Responsive layout

---

## 🎯 Technical Requirements

### Stack

- Next.js 15 (Server + Client Components)
- Reshaped UI (Badge, Button, Tabs)
- TypeScript
- SCSS Modules

### Data Sources

- **Courses API**: Course basic info (name, duration, etc.)
- **Strapi Course Enrichment**: Hero image/video, curriculum link

### Key Components

```typescript
<CourseHero>
  <Breadcrumb />
  <HeroMedia /> {/* Image or video */}
  <CourseHeader>
    <CourseTitle />
    <CourseMetadata />
    <CurriculumLink />
  </CourseHeader>
  <ModalitySelector />
  <EntryMethodSelector />
</CourseHero>
```

### Responsive Breakpoints

- Mobile: < 768px (stacked, full-width)
- Desktop: >= 768px (hero with content overlay)

---

## 📊 Tasks

### Backlog

- [ ] Review course details page design
- [ ] Understand data structure from API
- [ ] Plan hero media strategy (image vs video)

### To Do

- [ ] **Task 1**: Create course hero container
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - `src/features/course-details/components/CourseHero/CourseHero.tsx`
    - `src/features/course-details/components/CourseHero/CourseHero.module.scss`
  - **Acceptance Criteria**:
    - Section layout
    - Proper z-index for overlays
    - Responsive container
  - **Figma Support**: Screenshot + JSON export

- [ ] **Task 2**: Build breadcrumb navigation
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - `src/components/Breadcrumb/Breadcrumb.tsx` (reusable)
  - **Acceptance Criteria**:
    - Dynamic breadcrumb trail
    - Links to parent pages
    - Structured data (JSON-LD)
    - Accessible (aria-label="breadcrumb")
  - **Figma Support**: Breadcrumb design

- [ ] **Task 3**: Implement hero media (image/video)
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/features/course-details/components/CourseHero/HeroMedia.tsx`
  - **Acceptance Criteria**:
    - next/image for images
    - Video player for videos (YouTube/Vimeo embed or native)
    - Fallback to placeholder if no media
    - Responsive aspect ratio (16:9)
  - **Figma Support**: Media container specs

- [ ] **Task 4**: Create course header
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/features/course-details/components/CourseHero/CourseHeader.tsx`
  - **Acceptance Criteria**:
    - Course title (h1)
    - Degree type with icon
    - Duration with icon
    - Curriculum link button
    - Proper typography hierarchy
  - **Figma Support**: Header typography specs

- [ ] **Task 5**: Build modality selector
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/features/course-details/components/CourseHero/ModalitySelector.tsx`
  - **Acceptance Criteria**:
    - 3 buttons: Presencial, Semipresencial, EAD
    - Toggle selection (radio button behavior)
    - Active state styling
    - Updates form in sidebar (context or prop)
    - Disabled if modality not available
  - **Figma Support**: Button group design

- [ ] **Task 6**: Create entry method selector
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/features/course-details/components/CourseHero/EntryMethodSelector.tsx`
  - **Acceptance Criteria**:
    - 4 card options: Vestibular, ENEM, Transferência, Outro diploma
    - Select one (radio behavior)
    - Each card shows icon + title + description
    - Updates form in sidebar
    - Reshaped Card component
  - **Figma Support**: Entry method cards design

- [ ] **Task 7**: Make responsive
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - Mobile-optimized layout
  - **Acceptance Criteria**:
    - Hero media full-width on mobile
    - Selectors stack vertically
    - Touch-friendly buttons
  - **Figma Support**: Mobile hero screenshot

### In Progress

<!-- Tasks being actively worked on -->

### Review

<!-- Tasks pending code review or testing -->

### Done

<!-- Completed tasks -->

---

## 🔗 Dependencies

### Blocked By

- [ ] Courses API with course details endpoint
- [ ] Strapi Course Enrichment with hero media
- [ ] Breadcrumb component

### Blocks

- [ ] Course content section (below hero)
- [ ] Lead form sidebar (receives selected modality/entry method)

---

## 🧪 Testing Checklist

- [ ] **Unit Tests**
  - [ ] Breadcrumb generates correct links
  - [ ] Modality selector updates state
  - [ ] Entry method selector updates state

- [ ] **Integration Tests**
  - [ ] Course data loads from API
  - [ ] Hero media displays correctly
  - [ ] Selections update sidebar form

- [ ] **Visual Tests**
  - [ ] Screenshot hero at all breakpoints
  - [ ] All selector states captured

- [ ] **Accessibility Tests**
  - [ ] Breadcrumb accessible
  - [ ] Selectors keyboard accessible
  - [ ] Semantic heading (h1 for course title)
  - [ ] ARIA labels on interactive elements

- [ ] **SEO Tests**
  - [ ] Breadcrumb structured data
  - [ ] Course schema.org markup
  - [ ] Meta tags updated

---

## 📦 API Integration

### Courses API Endpoint

```
GET /api/courses/:slug?institution_code=UNINASSAU
```

**Response**:

```typescript
{
  id: string;
  name: string;
  area: string;
  degree_type: 'Bacharelado' | 'Licenciatura' | 'Tecnólogo';
  modalities: ['Presencial', 'EAD'];
  duration: {
    years: 5;
    semesters: 10;
  }
  available_entry_methods: [
    'Vestibular',
    'ENEM',
    'Transferência',
    'Outro diploma',
  ];
  slug: string;
  // ... other fields
}
```

### Strapi Endpoint

```
GET /api/course-enrichments?filters[course_id][$eq]=:id&populate=*
```

**Response**:

```typescript
{
  data: {
    attributes: {
      hero_image: { data: { ... } }
      hero_video_url: string
      curriculum_pdf: { data: { ... } }
      // ... other fields
    }
  }
}
```

---

## 🎨 Figma Integration Workflow

When this task is assigned, the following will be provided:

1. **Screenshots**:
   - Full hero section (desktop)
   - Modality selector states
   - Entry method cards
   - Mobile hero view

2. **Figma JSON Export**:
   - Spacing and layout
   - Typography (title, metadata)
   - Button/card styles
   - Icons

3. **Assets**:
   - Placeholder hero image
   - Icons (degree type, duration)
   - Entry method icons

---

## 📝 Implementation Notes

### Performance

- Server-render hero content
- Lazy load video player
- Optimize hero image (priority load)

### Accessibility

- Breadcrumb uses `<nav aria-label="breadcrumb">`
- Modality selector is radio group
- Entry method selector is radio group
- Focus management

### SEO

- H1 for course title
- Breadcrumb JSON-LD
- Course schema.org structured data

---

## ✅ Definition of Done

- [ ] Code merged to main branch
- [ ] All tests passing
- [ ] Accessibility audit passed
- [ ] Works on all breakpoints
- [ ] API integration working
- [ ] Selectors update sidebar form
- [ ] Breadcrumb functional
- [ ] Code reviewed and approved

---

**Created**: 2025-11-07
**Last Updated**: 2025-11-07
**Status**: To Do
