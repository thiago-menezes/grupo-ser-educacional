# Footer Component - Kanban

## 📋 Component Overview

**Component**: Global Footer
**Pages**: All pages across all institutions
**Priority**: Medium
**Estimated Effort**: 2-3 days

### Design Reference

- **Mockup**: All pages in `/docs/*.jpg`
- **Figma**: Awaiting JSON export

### Features

- Institution logo and branding
- Social media links (Instagram, Facebook, Twitter, WhatsApp)
- Multi-column navigation links
  - Sobre a instituição
  - Formas de ingresso
  - Áreas de estudo
- QR code (e-MEC registration)
- Copyright and legal links
- Responsive layout (stacks on mobile)

---

## 🎯 Technical Requirements

### Stack

- Next.js 15 (Server Component)
- Reshaped UI components
- TypeScript
- SCSS Modules

### Data Sources

- **Strapi**: Institution logo, social links, navigation, legal text
- **Props**: `institutionSlug` from route params

### Key Components

```typescript
<Footer institutionSlug={string}>
  <FooterBrand />
  <FooterNav />
  <FooterSocial />
  <FooterQRCode />
  <FooterLegal />
</Footer>
```

### Responsive Breakpoints

- Mobile: < 768px (single column, stacked)
- Tablet: 768px - 1024px (2 columns)
- Desktop: > 1024px (4 columns + brand)

---

## 📊 Tasks

### Backlog

- [ ] Review footer design in all mockups
- [ ] Define Strapi schema for footer content
- [ ] Identify all link categories

### To Do

- [ ] **Task 1**: Create base footer structure
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/components/Footer/Footer.tsx`
    - `src/components/Footer/Footer.module.scss`
  - **Acceptance Criteria**:
    - Blue background matching institution theme
    - Grid layout with proper spacing
    - White text on dark background
  - **Figma Support**: Screenshot + JSON export of footer

- [ ] **Task 2**: Build footer brand section
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - `src/components/Footer/FooterBrand.tsx`
  - **Acceptance Criteria**:
    - Institution logo (white version)
    - Social media icons in row
    - Proper spacing and alignment
  - **Figma Support**: Logo and spacing specs

- [ ] **Task 3**: Implement social media links
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - `src/components/Footer/FooterSocial.tsx`
  - **Acceptance Criteria**:
    - Icons for Instagram, Facebook, Twitter, WhatsApp
    - Links open in new tab
    - Hover states (slight opacity change)
    - Icons accessible (aria-label)
  - **Figma Support**: Icon specs and hover states

- [ ] **Task 4**: Create footer navigation columns
  - **Assignee**: TBD
  - **Effort**: 1 day
  - **Deliverables**:
    - `src/components/Footer/FooterNav.tsx`
    - `src/components/Footer/FooterNavColumn.tsx`
  - **Acceptance Criteria**:
    - 3 main columns:
      - "Sobre a instituição" (About links)
      - "Formas de ingresso" (Entry methods)
      - "Áreas de estudo" (Study areas)
    - Column titles in bold
    - Links with hover underline
    - Configurable from Strapi
  - **Figma Support**: Screenshot of all footer columns

- [ ] **Task 5**: Add QR code section
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/components/Footer/FooterQRCode.tsx`
  - **Acceptance Criteria**:
    - QR code image from Strapi
    - e-MEC branding/logo
    - "Consulte aqui o cadastro da instituição no e-MEC"
    - "ACESSAR" link button
    - White card background
  - **Figma Support**: QR code section design

- [ ] **Task 6**: Implement legal/copyright section
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - `src/components/Footer/FooterLegal.tsx`
  - **Acceptance Criteria**:
    - Copyright text
    - Privacy policy link
    - Terms of use link
    - Dynamic year
  - **Figma Support**: N/A (simple text)

- [ ] **Task 7**: Make footer responsive
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - Responsive SCSS
    - Mobile-first approach
  - **Acceptance Criteria**:
    - Single column on mobile
    - Columns stack gracefully
    - Social icons center on mobile
    - QR code section adapts
  - **Figma Support**: Mobile footer screenshot

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
- [ ] Institution theming system working
- [ ] Header component (for shared styles)

### Blocks

- [ ] None (footer is non-blocking)

---

## 🧪 Testing Checklist

- [ ] **Unit Tests**
  - [ ] Logo renders with correct src
  - [ ] Social links render correctly
  - [ ] Navigation columns render from data
  - [ ] QR code displays

- [ ] **Integration Tests**
  - [ ] Strapi data loads correctly
  - [ ] Links navigate to correct pages
  - [ ] External links open in new tab

- [ ] **Visual Tests**
  - [ ] Screenshot tests for all breakpoints
  - [ ] All institution themes

- [ ] **Accessibility Tests**
  - [ ] Keyboard navigation works
  - [ ] Links have descriptive text
  - [ ] Color contrast passes WCAG AA
  - [ ] Social icons have aria-labels

- [ ] **Cross-browser Tests**
  - [ ] Chrome/Edge
  - [ ] Firefox
  - [ ] Safari

---

## 📦 Strapi Integration

### API Endpoint

```
GET /api/institutions/:slug?populate[logo_footer]=*&populate[footer_navigation]=*&populate[social_media]=*&populate[emec_qr]=*
```

### Expected Response

```typescript
{
  data: {
    attributes: {
      logo_footer: {
        data: {
          attributes: {
            url: string
            alternativeText: string
          }
        }
      },
      social_media: [
        {
          platform: "Instagram" | "Facebook" | "Twitter" | "LinkedIn" | "WhatsApp"
          url: string
        }
      ],
      footer_navigation: {
        columns: [
          {
            title: string
            links: [
              {
                label: string
                url: string
              }
            ]
          }
        ]
      },
      emec_qr: {
        qr_code_image: {
          data: {
            attributes: {
              url: string
            }
          }
        },
        emec_url: string
      },
      copyright_text: string
      privacy_policy_url: string
      terms_of_use_url: string
    }
  }
}
```

### React Query Hook

```typescript
// src/features/navigation/hooks/useFooter.ts
export function useFooter(institutionSlug: string) {
  return useQuery({
    queryKey: ['footer', institutionSlug],
    queryFn: () => fetchFooter(institutionSlug),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}
```

---

## 🎨 Figma Integration Workflow

When this task is assigned, the following will be provided:

1. **Screenshots**:
   - Footer desktop view
   - Footer tablet view
   - Footer mobile view

2. **Figma JSON Export**:
   - Column widths and gaps
   - Typography (link sizes, titles)
   - Spacing (padding, margins)
   - Colors (use institution theme)

3. **Assets**:
   - Social media icons (SVG)
   - White version of logo
   - e-MEC logo
   - QR code placeholder

---

## 📝 Implementation Notes

### Performance Considerations

- Server Component (no client-side JS needed)
- Optimize QR code image (WebP format)
- SVG icons inline (no external requests)

### Accessibility

- Semantic HTML (`<footer>`)
- Nav sections use `<nav>` with aria-label
- Social links have descriptive aria-labels
- Sufficient color contrast

### SEO

- Internal links help crawlability
- Legal links (privacy, terms) important for trust
- Structured data for organization info

### Theme Integration

- Use institution primary color for background
- White text with proper contrast
- QR code section maintains brand colors

---

## ✅ Definition of Done

- [ ] Code merged to main branch
- [ ] All tests passing
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
