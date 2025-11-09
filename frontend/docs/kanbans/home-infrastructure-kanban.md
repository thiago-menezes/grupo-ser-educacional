# Home Infrastructure Section - Kanban

## 📋 Component Overview

**Component**: Infrastructure Gallery Section
**Page**: `/[institution]` (Homepage)
**Priority**: Low
**Estimated Effort**: 1 day

### Design Reference

- **Mockup**: `/docs/home.jpg` (photo gallery section at bottom)
- **Figma**: Awaiting JSON export

### Features

- Section title: "Conheça nossa infraestrutura"
- Subtitle text
- Photo gallery grid (6+ images)
- Images show campus facilities
- Optional: "Ver todas as unidades" link
- Responsive layout

---

## 🎯 Technical Requirements

### Stack

- Next.js 15 (Server Component)
- Reshaped UI components
- TypeScript
- SCSS Modules
- next/image for optimization

### Data Sources

- **Strapi**: Infrastructure section images

### Key Components

```typescript
<InfrastructureSection>
  <SectionHeader />
  <ImageGallery>
    <GalleryImage />
    <GalleryImage />
    ...
  </ImageGallery>
  <ViewAllLink />
</InfrastructureSection>
```

### Responsive Breakpoints

- Mobile: < 768px (2 columns)
- Tablet: 768px - 1024px (3 columns)
- Desktop: > 1024px (3 columns, masonry or grid)

---

## 📊 Tasks

### Backlog

- [ ] Review infrastructure section design
- [ ] Define Strapi infrastructure component

### To Do

- [ ] **Task 1**: Create infrastructure section container
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - `src/features/home/components/InfrastructureSection/InfrastructureSection.tsx`
    - `src/features/home/components/InfrastructureSection/InfrastructureSection.module.scss`
  - **Acceptance Criteria**:
    - Section with title and subtitle
    - Gallery grid container
    - Optional CTA link
  - **Figma Support**: Screenshot + JSON export

- [ ] **Task 2**: Build image gallery component
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/features/home/components/InfrastructureSection/ImageGallery.tsx`
  - **Acceptance Criteria**:
    - Grid layout (3 columns)
    - Supports variable number of images
    - next/image for optimization
    - Aspect ratio maintained (16:9 or auto)
    - Optional: Masonry layout (Pinterest-style)
  - **Figma Support**: Gallery layout screenshot

- [ ] **Task 3**: Implement gallery image component
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/features/home/components/InfrastructureSection/GalleryImage.tsx`
  - **Acceptance Criteria**:
    - next/image with proper sizing
    - Hover effect (slight zoom or opacity)
    - Optional: Click to open lightbox
    - Alt text for accessibility
    - Loading skeleton
  - **Figma Support**: Individual image specs

- [ ] **Task 4**: Add optional lightbox/modal
  - **Assignee**: TBD
  - **Effort**: 0.5 day (optional task)
  - **Deliverables**:
    - Lightbox component (Reshaped Modal)
  - **Acceptance Criteria**:
    - Click image to open full-size
    - Navigate between images
    - Close with X or ESC
    - Keyboard accessible
  - **Figma Support**: N/A (standard lightbox)

- [ ] **Task 5**: Optimize images
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - Image optimization configuration
  - **Acceptance Criteria**:
    - WebP format
    - Responsive sizes
    - Lazy loading
    - No layout shift
  - **Figma Support**: N/A

- [ ] **Task 6**: Make responsive
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - Mobile-optimized gallery
  - **Acceptance Criteria**:
    - 2 columns on mobile
    - Touch-friendly images
    - Proper spacing
  - **Figma Support**: Mobile gallery screenshot

### In Progress

<!-- Tasks being actively worked on -->

### Review

<!-- Tasks pending code review or testing -->

### Done

<!-- Completed tasks -->

---

## 🔗 Dependencies

### Blocked By

- [ ] Strapi Home Page with infrastructure_section
- [ ] Infrastructure images uploaded

### Blocks

- [ ] None (last section on homepage)

---

## 🧪 Testing Checklist

- [ ] **Unit Tests**
  - [ ] GalleryImage renders with props
  - [ ] Images load correctly
  - [ ] Lightbox opens/closes (if implemented)

- [ ] **Integration Tests**
  - [ ] Strapi images load
  - [ ] Images lazy load
  - [ ] Gallery responsive at all breakpoints

- [ ] **Visual Tests**
  - [ ] Screenshot gallery at all breakpoints
  - [ ] Hover states captured

- [ ] **Accessibility Tests**
  - [ ] Images have alt text
  - [ ] Lightbox keyboard accessible
  - [ ] Focus management in modal

- [ ] **Performance Tests**
  - [ ] Images optimized
  - [ ] Lazy loading working
  - [ ] No layout shift

---

## 📦 Strapi Integration

### API Endpoint

```
GET /api/home-pages?filters[institution][slug][$eq]=uninassau&populate[infrastructure_section][populate]=*
```

### Expected Response

```typescript
{
  data: {
    attributes: {
      infrastructure_section: {
        title: "Conheça nossa infraestrutura",
        subtitle: "Unidades preparadas para o seu aprendizado",
        images: {
          data: [
            {
              attributes: {
                url: string
                alternativeText: string
                caption?: string
                formats: { ... }
              }
            }
          ]
        },
        cta_text: "Ver todas as unidades",
        cta_url: "/uninassau/unidades"
      }
    }
  }
}
```

---

## 🎨 Figma Integration Workflow

When this task is assigned, the following will be provided:

1. **Screenshots**:
   - Full gallery (desktop)
   - Mobile 2-column view
   - Hover state

2. **Figma JSON Export**:
   - Grid gaps
   - Image aspect ratios
   - Spacing

3. **Assets**:
   - All infrastructure images (high resolution)

---

## 📝 Implementation Notes

### Performance

- Server Component for gallery structure
- Client Component for lightbox (if needed)
- Lazy load all images
- Optimize for Core Web Vitals

### Accessibility

- Images have descriptive alt text
- Lightbox keyboard accessible
- Focus trap in modal

### SEO

- Alt text on images
- Optional: Image sitemap

---

## ✅ Definition of Done

- [ ] Code merged to main branch
- [ ] All tests passing
- [ ] Accessibility audit passed
- [ ] Works on all breakpoints
- [ ] Tested with all institution themes
- [ ] Strapi integration working
- [ ] Images optimized
- [ ] Lightbox working (if implemented)
- [ ] Code reviewed and approved

---

**Created**: 2025-11-07
**Last Updated**: 2025-11-07
**Status**: To Do
