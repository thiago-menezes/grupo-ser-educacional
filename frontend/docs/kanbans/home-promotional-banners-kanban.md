# Home Promotional Banners - Kanban

## 📋 Component Overview

**Component**: Promotional Banners Section
**Page**: `/[institution]` (Homepage)
**Priority**: Medium
**Estimated Effort**: 1-2 days

### Design Reference

- **Mockup**: `/docs/home.jpg` (3 colorful cards below hero)
- **Figma**: Awaiting JSON export

### Features

- 3 promotional cards in a row
- Each card with:
  - Background color/image
  - Icon/illustration
  - Title text
  - CTA button/link
- Different background colors per card
- Responsive (stack on mobile)
- Hover effects

---

## 🎯 Technical Requirements

### Stack

- Next.js 15 (Server Component)
- Reshaped UI components
- TypeScript
- SCSS Modules

### Data Sources

- **Strapi**: Promotional banner content (max 3 items)

### Key Components

```typescript
<PromotionalBanners>
  <BannerCard />
  <BannerCard />
  <BannerCard />
</PromotionalBanners>
```

### Responsive Breakpoints

- Mobile: < 768px (1 column, stacked)
- Tablet: 768px - 1024px (2 columns)
- Desktop: > 1024px (3 columns)

---

## 📊 Tasks

### Backlog

- [ ] Review banner designs in mockup
- [ ] Define Strapi promotional banner component

### To Do

- [ ] **Task 1**: Create promotional banners container
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - `src/features/home/components/PromotionalBanners/PromotionalBanners.tsx`
    - `src/features/home/components/PromotionalBanners/PromotionalBanners.module.scss`
  - **Acceptance Criteria**:
    - Grid layout (3 columns on desktop)
    - Proper spacing between cards
    - Section padding
  - **Figma Support**: Screenshot + JSON export

- [ ] **Task 2**: Build banner card component
  - **Assignee**: TBD
  - **Effort**: 1 day
  - **Deliverables**:
    - `src/features/home/components/PromotionalBanners/BannerCard.tsx`
  - **Acceptance Criteria**:
    - Background color customizable
    - Background image support
    - Icon/illustration display
    - Title text (h3)
    - CTA button or entire card clickable
    - Border radius matching design
    - Hover effect (scale or shadow)
  - **Figma Support**: Individual card screenshot

- [ ] **Task 3**: Implement card variations
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - Support for different card styles
  - **Acceptance Criteria**:
    - Card 1: Red/orange gradient with icon
    - Card 2: Blue gradient with graphic
    - Card 3: Yellow gradient with photo
    - Colors from Strapi or institution theme
  - **Figma Support**: All 3 card variations

- [ ] **Task 4**: Add animations and interactions
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - Hover states
    - Click interactions
  - **Acceptance Criteria**:
    - Scale on hover (1.02)
    - Smooth transition (200ms)
    - Cursor pointer
    - Active/pressed state
  - **Figma Support**: Interaction specs

- [ ] **Task 5**: Make responsive
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - Mobile-optimized layout
  - **Acceptance Criteria**:
    - Cards stack vertically on mobile
    - Full width on mobile
    - Maintain aspect ratio
    - Touch-friendly (min 44px touch target)
  - **Figma Support**: Mobile banners screenshot

### In Progress

<!-- Tasks being actively worked on -->

### Review

<!-- Tasks pending code review or testing -->

### Done

<!-- Completed tasks -->

---

## 🔗 Dependencies

### Blocked By

- [ ] Strapi Home Page collection type with promotional_banners field
- [ ] Next/image configuration

### Blocks

- [ ] None (banners are self-contained)

---

## 🧪 Testing Checklist

- [ ] **Unit Tests**
  - [ ] BannerCard renders with props
  - [ ] Links navigate correctly
  - [ ] Background colors apply

- [ ] **Integration Tests**
  - [ ] Strapi banners load correctly
  - [ ] Max 3 banners enforced
  - [ ] Images lazy load

- [ ] **Visual Tests**
  - [ ] Screenshot all banner variations
  - [ ] Hover states captured
  - [ ] Mobile layout captured

- [ ] **Accessibility Tests**
  - [ ] Links have descriptive text
  - [ ] Images have alt text
  - [ ] Keyboard accessible
  - [ ] Color contrast sufficient

---

## 📦 Strapi Integration

### API Endpoint

```
GET /api/home-pages?filters[institution][slug][$eq]=uninassau&populate[promotional_banners][populate]=*
```

### Expected Response

```typescript
{
  data: {
    attributes: {
      promotional_banners: [
        {
          title: string
          description?: string
          image: {
            data: {
              attributes: {
                url: string
                alternativeText: string
              }
            }
          },
          background_color?: string
          link: string
          cta_text: string
          icon?: {
            data: { ... }
          }
        }
      ]
    }
  }
}
```

---

## 🎨 Figma Integration Workflow

When this task is assigned, the following will be provided:

1. **Screenshots**:
   - All 3 banners side by side (desktop)
   - Mobile stacked view
   - Hover states

2. **Figma JSON Export**:
   - Card dimensions
   - Border radius
   - Spacing between cards
   - Typography (title sizes)
   - Gradients/colors

3. **Assets**:
   - Banner images (if any)
   - Icons/illustrations

---

## 📝 Implementation Notes

### Performance

- Use next/image for banner images
- Lazy load images below the fold
- Optimize images (WebP, srcset)

### Accessibility

- Each card is a semantic link or button
- Descriptive link text (not just "Learn more")
- Alt text on images describes content

### SEO

- Descriptive anchor text
- Internal links improve crawlability

---

## ✅ Definition of Done

- [ ] Code merged to main branch
- [ ] All tests passing
- [ ] Accessibility audit passed
- [ ] Works on all breakpoints
- [ ] Tested with all institution themes
- [ ] Strapi integration working
- [ ] Animations smooth
- [ ] Code reviewed and approved

---

**Created**: 2025-11-07
**Last Updated**: 2025-11-07
**Status**: To Do
