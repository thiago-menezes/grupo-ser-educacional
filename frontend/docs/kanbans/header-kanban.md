# Header Component - Kanban

## 📋 Component Overview

**Component**: Global Header/Navigation
**Pages**: All pages across all institutions
**Priority**: High (blocking other pages)
**Estimated Effort**: 3-4 days

### Design Reference
- **Mockup**: All pages in `/docs/*.jpg`
- **Figma**: Awaiting JSON export

### Features
- Institution logo (dynamic)
- Main navigation menu
- Dropdown menus (Nossos cursos, A UNINASSAU, Formas de ingresso)
- Utility links (Whatsapp, Seu aluno, Acompanhe sua inscrição)
- CTA button (Inscreva-se)
- Mobile responsive menu (hamburger)
- Sticky header on scroll

---

## 🎯 Technical Requirements

### Stack
- Next.js 15 (Server Components where possible)
- Reshaped UI components
- TypeScript
- SCSS Modules

### Data Sources
- **Strapi**: Institution logo, navigation links, CTA config
- **Props**: `institutionSlug` from route params

### Key Components
```typescript
<Header institutionSlug={string}>
  <Logo />
  <Navigation />
  <UtilityNav />
  <MobileMenu />
</Header>
```

### Responsive Breakpoints
- Mobile: < 768px (hamburger menu)
- Tablet: 768px - 1024px (condensed menu)
- Desktop: > 1024px (full menu)

---

## 📊 Tasks

### Backlog
- [ ] Review design specs in Figma
- [ ] Identify all navigation items
- [ ] Define Strapi schema for navigation
- [ ] Research Reshaped components for nav

### To Do
- [ ] **Task 1**: Create base header structure
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/components/Header/Header.tsx`
    - `src/components/Header/Header.module.scss`
  - **Acceptance Criteria**:
    - Renders logo and basic nav items
    - Responsive layout structure in place
  - **Figma Support**: Screenshot + JSON export of header section

- [ ] **Task 2**: Implement Logo component
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - `src/components/Header/Logo.tsx`
  - **Acceptance Criteria**:
    - Loads institution logo from Strapi
    - Fallback to default logo
    - Proper alt text for accessibility
    - Links to institution homepage
  - **Figma Support**: Logo specs and spacing

- [ ] **Task 3**: Build main navigation menu
  - **Assignee**: TBD
  - **Effort**: 1 day
  - **Deliverables**:
    - `src/components/Header/Navigation.tsx`
    - `src/components/Header/NavItem.tsx`
  - **Acceptance Criteria**:
    - All nav items render correctly
    - Active state for current page
    - Hover states match design
    - Keyboard navigation support
  - **Figma Support**: Screenshot of all nav states (default, hover, active)

- [ ] **Task 4**: Implement dropdown menus
  - **Assignee**: TBD
  - **Effort**: 1 day
  - **Deliverables**:
    - `src/components/Header/Dropdown.tsx`
  - **Acceptance Criteria**:
    - Dropdowns open on click/hover (desktop)
    - Smooth animation (Reshaped Motion)
    - Click outside to close
    - Accessible (ARIA attributes)
  - **Figma Support**: Screenshot of dropdown expanded states

- [ ] **Task 5**: Create utility navigation
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/components/Header/UtilityNav.tsx`
  - **Acceptance Criteria**:
    - Whatsapp link with icon
    - "Seu aluno" link
    - "Acompanhe sua inscrição" link
    - Icons from Reshaped or custom
  - **Figma Support**: Screenshot of utility nav section

- [ ] **Task 6**: Build CTA button
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - Uses Reshaped Button component
  - **Acceptance Criteria**:
    - Primary button style
    - Links to enrollment page
    - Configurable text from Strapi
  - **Figma Support**: Button specs (padding, colors, font)

- [ ] **Task 7**: Implement mobile menu
  - **Assignee**: TBD
  - **Effort**: 1 day
  - **Deliverables**:
    - `src/components/Header/MobileMenu.tsx`
    - Hamburger icon component
  - **Acceptance Criteria**:
    - Hamburger icon toggles menu
    - Full-screen overlay on mobile
    - Smooth slide-in animation
    - All nav items accessible
    - Close button or swipe to dismiss
  - **Figma Support**: Screenshot of mobile menu open/closed states

- [ ] **Task 8**: Add sticky header behavior
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - Scroll listener hook
    - CSS transitions
  - **Acceptance Criteria**:
    - Header becomes sticky after scrolling 100px
    - Smooth transition
    - Background changes (shadow/opacity)
    - Performance optimized (throttle scroll)
  - **Figma Support**: N/A (behavior spec)

### In Progress
<!-- Tasks being actively worked on -->

### Review
<!-- Tasks pending code review or testing -->

### Done
<!-- Completed tasks -->

---

## 🔗 Dependencies

### Blocked By
- [ ] Strapi Institution schema finalized
- [ ] Strapi Navigation collection type created
- [ ] Institution theming system working

### Blocks
- [ ] All page implementations (every page needs header)
- [ ] Footer component (shared styling patterns)

---

## 🧪 Testing Checklist

- [ ] **Unit Tests**
  - [ ] Logo renders with correct src
  - [ ] Navigation items render from data
  - [ ] Dropdown opens/closes correctly
  - [ ] Mobile menu toggles

- [ ] **Integration Tests**
  - [ ] Strapi data loads correctly
  - [ ] Institution slug changes logo
  - [ ] Active page highlights correctly

- [ ] **Visual Tests**
  - [ ] Screenshot tests for all breakpoints
  - [ ] Hover states captured
  - [ ] Dropdown expanded state

- [ ] **Accessibility Tests**
  - [ ] Keyboard navigation works
  - [ ] Screen reader announces correctly
  - [ ] Focus management in mobile menu
  - [ ] Color contrast passes WCAG AA

- [ ] **Cross-browser Tests**
  - [ ] Chrome/Edge
  - [ ] Firefox
  - [ ] Safari (desktop + iOS)

---

## 📦 Strapi Integration

### API Endpoint
```
GET /api/institutions/:slug?populate[logo]=*&populate[navigation]=*
```

### Expected Response
```typescript
{
  data: {
    attributes: {
      logo: {
        data: {
          attributes: {
            url: string
            alternativeText: string
          }
        }
      },
      navigation: {
        main_items: [
          {
            label: string
            url: string
            has_dropdown: boolean
            dropdown_items?: Array<{
              label: string
              url: string
            }>
          }
        ],
        utility_items: [
          {
            label: string
            url: string
            icon?: string
          }
        ],
        cta: {
          label: string
          url: string
        }
      }
    }
  }
}
```

### React Query Hook
```typescript
// src/features/navigation/hooks/useNavigation.ts
export function useNavigation(institutionSlug: string) {
  return useQuery({
    queryKey: ['navigation', institutionSlug],
    queryFn: () => fetchNavigation(institutionSlug),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
```

---

## 🎨 Figma Integration Workflow

When this task is assigned, the following will be provided:

1. **Screenshots**:
   - Header desktop (default state)
   - Header desktop (with dropdown open)
   - Header mobile (menu closed)
   - Header mobile (menu open)
   - Sticky header state

2. **Figma JSON Export**:
   - Spacing values (padding, margins)
   - Typography (font sizes, weights, line heights)
   - Colors (use institution theme tokens where possible)
   - Shadow/elevation specs
   - Animation durations

3. **Assets**:
   - Icons (if not available in Reshaped)
   - Institutional logos (all variations)

---

## 📝 Implementation Notes

### Performance Considerations
- Use React Server Components for static content
- Lazy load mobile menu component
- Memoize navigation items to prevent re-renders
- Use CSS transforms for animations (GPU accelerated)

### Accessibility
- ARIA landmarks: `<nav role="navigation">`
- Keyboard trap in mobile menu when open
- Focus returns to hamburger when menu closes
- Skip to main content link

### SEO
- Proper semantic HTML (`<header>`, `<nav>`)
- Descriptive link text
- Logo alt text includes institution name

### Theme Integration
- Use CSS custom properties from institution theme
- Fallback to default Reshaped theme tokens
- Test with all 5 institutions

---

## ✅ Definition of Done

- [ ] Code merged to main branch
- [ ] All tests passing (unit + integration)
- [ ] Visual regression tests captured
- [ ] Accessibility audit passed
- [ ] Works on all breakpoints
- [ ] Tested with all institution themes
- [ ] Strapi integration working
- [ ] Documentation updated
- [ ] Code reviewed and approved

---

**Created**: 2025-11-07
**Last Updated**: 2025-11-07
**Status**: To Do
