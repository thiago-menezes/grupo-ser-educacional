# Home Hero Section Kanban

## 📛 Item

- **Type**: Feature
- **Name**: Home Hero Section
- **Description**: Large hero section with background image/video, headline, CTA buttons, quick search form, carousel controls, and animations. Part of the institution homepage (`/[institution]`).
- **Owner**: TBD
- **Status**: Backlog
- **Updated**: 2025-11-09

---

## ✅ Checklist

- [ ] Create feature structure and entry point
  - Create `src/features/home-hero/` with `index.tsx`, `types.ts`, `constants.ts`, `hooks.ts`, `utils.ts`, `styles.module.scss`
  - Create API layer: `api/query.ts`, `api/mutation.ts`, `api/types.ts`
  - Full viewport height section with proper z-index layering and responsiveness
  - Effort: 0.5 day

- [ ] Build hero banner component
  - Create `src/features/home-hero/components/hero-banner/` with `index.tsx`, `styles.module.scss`, `types.ts`
  - next/image for static images, overlay gradient, autoplay (muted, loop), lazy load
  - Effort: 1 day

- [ ] Build CTA buttons component
  - Create `src/features/home-hero/components/hero-ctas/` with `index.tsx`, `styles.module.scss`, `types.ts`
  - Multiple button styles (primary, secondary), "GRADUAÇÃO E EAD" and "PÓS-GRADUAÇÃO" buttons, hover animations, configurable from Strapi
  - Effort: 0.5 day

- [ ] Build quick search form component
  - Create `src/features/home-hero/components/quick-search-form/` with `index.tsx`, `styles.module.scss`, `types.ts`, `hooks.ts`
  - Two inputs (course name, city), autocomplete support (optional), form submission to `/[institution]/cursos` with filters, validation, loading state
  - Effort: 1 day

- [ ] Build carousel controls component
  - Create `src/features/home-hero/components/carousel-controls/` with `index.tsx`, `styles.module.scss`, `types.ts`
  - Left/right arrows, dot indicators, auto-advance every 5 seconds, pause on hover, keyboard navigation (arrow keys)
  - Effort: 0.5 day

- [ ] Implement animations
  - Add Framer Motion variants in `hooks.ts` for composition in parent components
  - Title (fade + slide up, 0.3s delay), subtitle (fade in, 0.5s delay), CTAs (fade in, 0.7s delay), form (fade in, 0.9s delay)
  - Use GPU-accelerated properties (transform, opacity); respect `prefers-reduced-motion`
  - Effort: 0.5 day

- [ ] Make fully responsive
  - Mobile (< 768px), tablet (768px - 1024px), desktop (> 1024px), touch-friendly controls
  - Update `styles.module.scss` with breakpoint utilities
  - Effort: 0.5 day

- [ ] Add integration tests
  - Create `src/features/home-hero/__tests__/home-hero.integration.spec.tsx` using Vitest + Testing Library
  - Form validation, search button navigation, carousel auto-advance, Strapi content loading, video playback logic
  - Effort: 0.5 day

- [ ] Accessibility and performance validation
  - Keyboard navigation (carousel, form), color contrast (WCAG AA), ARIA labels, role attributes
  - LCP < 2.5s, image optimization (WebP), video lazy load via Intersection Observer
  - Effort: 0.5 day

---

## 🔗 Dependencies

**Blocked by**:

- Header component (for proper z-index)
- Strapi Home Page collection type

**Blocks**: None (self-contained component)
