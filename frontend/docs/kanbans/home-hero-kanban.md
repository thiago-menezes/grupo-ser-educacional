# Home Hero Section - Kanban

## 📋 Component Overview

**Component**: Homepage Hero Section
**Page**: `/[institution]` (Homepage)
**Priority**: High
**Estimated Effort**: 2-3 days

### Design Reference
- **Mockup**: `/docs/home.jpg` (top section)
- **Figma**: Awaiting JSON export

### Features
- Large background image/video
- Headline with branded typography
- Subheadline text
- Multiple CTA buttons (Graduação, Pós-graduação)
- Quick search form (inline)
  - "Qual curso quer estudar?" input
  - "Em que cidade quer estudar?" input
  - Search button
- Institution logo overlay
- Navigation arrows (carousel)
- Responsive layout

---

## 🎯 Technical Requirements

### Stack
- Next.js 15 (Client Component for interactivity)
- Reshaped UI (Button, TextField)
- TypeScript
- SCSS Modules
- Framer Motion (animations)

### Data Sources
- **Strapi**: Hero content (title, subtitle, background, CTAs)
- **Client State**: Form inputs

### Key Components
```typescript
<HomeHero>
  <HeroBackground />
  <HeroContent>
    <HeroTitle />
    <HeroSubtitle />
    <HeroCTAs />
    <QuickSearchForm />
  </HeroContent>
  <CarouselControls />
</HomeHero>
```

### Responsive Breakpoints
- Mobile: < 768px (stacked, full-width)
- Tablet: 768px - 1024px (condensed spacing)
- Desktop: > 1024px (full layout with sidebar form)

---

## 📊 Tasks

### Backlog
- [ ] Review hero section design
- [ ] Define Strapi hero component schema
- [ ] Research video background best practices

### To Do
- [ ] **Task 1**: Create hero container structure
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/features/home/components/HomeHero/HomeHero.tsx`
    - `src/features/home/components/HomeHero/HomeHero.module.scss`
  - **Acceptance Criteria**:
    - Full viewport height section
    - Proper z-index layering
    - Responsive container
  - **Figma Support**: Screenshot + JSON export

- [ ] **Task 2**: Implement background image/video
  - **Assignee**: TBD
  - **Effort**: 1 day
  - **Deliverables**:
    - `src/features/home/components/HomeHero/HeroBackground.tsx`
  - **Acceptance Criteria**:
    - next/image for static images
    - Video background with fallback image
    - Overlay gradient for text readability
    - Autoplay video (muted, loop)
    - Lazy load video
  - **Figma Support**: Background image specs

- [ ] **Task 3**: Build headline and subtitle
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - `src/features/home/components/HomeHero/HeroTitle.tsx`
  - **Acceptance Criteria**:
    - Animated entrance (fade + slide up)
    - Branded typography (from Strapi richtext)
    - Highlighted text styling (green background in mockup)
    - Responsive font sizes
  - **Figma Support**: Typography specs and animations

- [ ] **Task 4**: Create CTA buttons
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/features/home/components/HomeHero/HeroCTAs.tsx`
  - **Acceptance Criteria**:
    - Multiple button styles (primary, secondary)
    - "GRADUAÇÃO E EAD" and "PÓS-GRADUAÇÃO" buttons
    - Links to respective pages
    - Hover animations
    - Configurable from Strapi
  - **Figma Support**: Button specs (colors, spacing)

- [ ] **Task 5**: Build quick search form
  - **Assignee**: TBD
  - **Effort**: 1 day
  - **Deliverables**:
    - `src/features/home/components/HomeHero/QuickSearchForm.tsx`
  - **Acceptance Criteria**:
    - Two inputs: course name, city
    - Autocomplete for courses (optional)
    - Search button
    - Form submission navigates to `/[institution]/cursos` with filters
    - Validation (at least one field required)
    - Loading state
  - **Figma Support**: Form design screenshot

- [ ] **Task 6**: Add carousel controls (if multiple slides)
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/features/home/components/HomeHero/CarouselControls.tsx`
  - **Acceptance Criteria**:
    - Left/right arrows
    - Dot indicators
    - Auto-advance every 5 seconds
    - Pause on hover
    - Keyboard navigation (arrow keys)
  - **Figma Support**: Control icons and positioning

- [ ] **Task 7**: Implement animations
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - Framer Motion variants
  - **Acceptance Criteria**:
    - Title fades in + slides up (0.3s delay)
    - Subtitle fades in (0.5s delay)
    - CTAs fade in (0.7s delay)
    - Form fades in (0.9s delay)
    - Smooth transitions
  - **Figma Support**: Animation specs (durations, easings)

- [ ] **Task 8**: Make fully responsive
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - Mobile-optimized layout
    - Touch-friendly controls
  - **Acceptance Criteria**:
    - Form stacks on mobile
    - Font sizes scale appropriately
    - CTA buttons full-width on mobile
    - Background image crops correctly
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
- [ ] Header component (for proper z-index)
- [ ] Strapi Home Page collection type created
- [ ] Institution theming working

### Blocks
- [ ] None (hero is self-contained)

---

## 🧪 Testing Checklist

- [ ] **Unit Tests**
  - [ ] Form validation works
  - [ ] Search button navigates correctly
  - [ ] Carousel advances automatically

- [ ] **Integration Tests**
  - [ ] Strapi hero content loads
  - [ ] Search form submits to correct URL with params
  - [ ] Video plays on desktop, shows image on mobile

- [ ] **Visual Tests**
  - [ ] Screenshot all hero slides
  - [ ] Test with long/short headlines
  - [ ] All breakpoints captured

- [ ] **Accessibility Tests**
  - [ ] Carousel controls keyboard accessible
  - [ ] Form inputs labeled correctly
  - [ ] Color contrast on overlay text
  - [ ] Video has no audio (or muted)

- [ ] **Performance Tests**
  - [ ] Largest Contentful Paint (LCP) < 2.5s
  - [ ] Video lazy loads
  - [ ] Images optimized (WebP)

---

## 📦 Strapi Integration

### API Endpoint
```
GET /api/home-pages?filters[institution][slug][$eq]=uninassau&populate[hero][populate]=*
```

### Expected Response
```typescript
{
  data: {
    attributes: {
      hero: {
        title: string // richtext
        subtitle: string
        background_image: {
          data: {
            attributes: {
              url: string
              alternativeText: string
              formats: { ... }
            }
          }
        },
        background_video_url?: string
        cta_buttons: [
          {
            label: string
            url: string
            variant: "primary" | "secondary"
          }
        ],
        show_quick_search: boolean
      }
    }
  }
}
```

### React Query Hook
```typescript
// src/features/home/hooks/useHomePage.ts
export function useHomePage(institutionSlug: string) {
  return useQuery({
    queryKey: ['home', institutionSlug],
    queryFn: () => fetchHomePage(institutionSlug),
    staleTime: 5 * 60 * 1000,
  })
}
```

---

## 🎨 Figma Integration Workflow

When this task is assigned, the following will be provided:

1. **Screenshots**:
   - Hero desktop view
   - Hero mobile view
   - Form focus states
   - CTA hover states

2. **Figma JSON Export**:
   - Spacing (padding, margins)
   - Typography (headline, subtitle, form labels)
   - Colors (overlay gradient, text colors)
   - Button styles

3. **Assets**:
   - Background images (all carousel slides)
   - Background video (if applicable)
   - Institution logo overlay
   - Icons for form inputs

---

## 📝 Implementation Notes

### Performance Considerations
- Use `priority` prop on next/image for hero image (LCP)
- Lazy load video (Intersection Observer)
- Optimize video (compressed, multiple formats)
- Debounce autocomplete search

### Accessibility
- Carousel has `role="region"` with `aria-label`
- Auto-advance carousel can be paused
- Form inputs have visible labels
- Sufficient color contrast on overlay

### SEO
- H1 tag for main headline
- Alt text on background image
- Descriptive CTA link text

### Animation Best Practices
- Respect `prefers-reduced-motion`
- Use GPU-accelerated properties (transform, opacity)
- Keep animations < 500ms

---

## ✅ Definition of Done

- [ ] Code merged to main branch
- [ ] All tests passing
- [ ] Accessibility audit passed
- [ ] Works on all breakpoints
- [ ] Tested with all institution themes
- [ ] Strapi integration working
- [ ] Video background working (with fallback)
- [ ] Animations smooth and performant
- [ ] Search form submits correctly
- [ ] Code reviewed and approved

---

**Created**: 2025-11-07
**Last Updated**: 2025-11-07
**Status**: To Do
