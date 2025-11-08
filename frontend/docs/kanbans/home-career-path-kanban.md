# Home Career Path Selector - Kanban

## 📋 Component Overview

**Component**: Career Path Chooser Section
**Page**: `/[institution]` (Homepage)
**Priority**: Medium
**Estimated Effort**: 1.5 days

### Design Reference
- **Mockup**: `/docs/home.jpg` (section with Graduação vs Pós-graduação)
- **Figma**: Awaiting JSON export

### Features
- Section title: "Escolha o caminho que combina com você"
- Two large cards side by side:
  - **Graduação**: Undergraduate programs
  - **Pós-graduação**: Graduate programs
- Each card shows:
  - Icon
  - Title
  - Description text
  - Modality badges (Presencial, Semipresencial, EAD)
  - CTA button
- Responsive (stack on mobile)

---

## 🎯 Technical Requirements

### Stack
- Next.js 15 (Server Component)
- Reshaped UI (Card, Badge, Button)
- TypeScript
- SCSS Modules

### Data Sources
- **Strapi**: Career decision section content

### Key Components
```typescript
<CareerPathSection>
  <SectionHeader />
  <PathCards>
    <PathCard type="Graduação" />
    <PathCard type="Pós-graduação" />
  </PathCards>
</CareerPathSection>
```

### Responsive Breakpoints
- Mobile: < 768px (1 column, stacked)
- Desktop: >= 768px (2 columns, side by side)

---

## 📊 Tasks

### Backlog
- [ ] Review career path section design
- [ ] Define Strapi career_decision component

### To Do
- [ ] **Task 1**: Create career path section container
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - `src/features/home/components/CareerPathSection/CareerPathSection.tsx`
    - `src/features/home/components/CareerPathSection/CareerPathSection.module.scss`
  - **Acceptance Criteria**:
    - Section with title
    - Two-column layout on desktop
    - Proper spacing
  - **Figma Support**: Screenshot + JSON export

- [ ] **Task 2**: Build path card component
  - **Assignee**: TBD
  - **Effort**: 1 day
  - **Deliverables**:
    - `src/features/home/components/CareerPathSection/PathCard.tsx`
  - **Acceptance Criteria**:
    - Reshaped Card component
    - Icon at top
    - Title (h3)
    - Description richtext
    - Modality badges row
    - CTA button at bottom
    - Hover effect (shadow lift)
    - Equal height cards
  - **Figma Support**: Individual card screenshot

- [ ] **Task 3**: Implement modality badges
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - Badge row component (reuse from other sections)
  - **Acceptance Criteria**:
    - 3 badges: Presencial, Semipresencial, EAD
    - Horizontal layout
    - Reshaped Badge component
    - Color coded
  - **Figma Support**: Badge specs

- [ ] **Task 4**: Add icons for each path
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - Icon components
  - **Acceptance Criteria**:
    - Graduação: Graduation cap icon
    - Pós-graduação: Book/scholar icon
    - Consistent size and color
  - **Figma Support**: Icon exports

- [ ] **Task 5**: Make responsive
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - Mobile-optimized layout
  - **Acceptance Criteria**:
    - Cards stack vertically on mobile
    - Full width on mobile
    - Maintain readability
  - **Figma Support**: Mobile screenshot

### In Progress
<!-- Tasks being actively worked on -->

### Review
<!-- Tasks pending code review or testing -->

### Done
<!-- Completed tasks -->

---

## 🔗 Dependencies

### Blocked By
- [ ] Strapi Home Page with career_decision section
- [ ] Badge component from modalities section

### Blocks
- [ ] None (self-contained section)

---

## 🧪 Testing Checklist

- [ ] **Unit Tests**
  - [ ] PathCard renders with props
  - [ ] Correct icons display
  - [ ] Badges render correctly

- [ ] **Integration Tests**
  - [ ] Strapi content loads
  - [ ] Links navigate to correct pages

- [ ] **Visual Tests**
  - [ ] Screenshot at all breakpoints
  - [ ] Hover states captured
  - [ ] Equal height cards

- [ ] **Accessibility Tests**
  - [ ] Semantic headings
  - [ ] Links descriptive
  - [ ] Keyboard navigation
  - [ ] Color contrast

---

## 📦 Strapi Integration

### API Endpoint
```
GET /api/home-pages?filters[institution][slug][$eq]=uninassau&populate[career_decision][populate]=*
```

### Expected Response
```typescript
{
  data: {
    attributes: {
      career_decision: {
        title: "Escolha o caminho que combina com você",
        graduation: {
          title: "Graduação",
          description: "Aqui você encontra a trilha ideal para começar ou...",
          icon: { data: { ... } },
          badges: ["Presencial", "Semipresencial", "EAD"],
          cta_text: "Veja cursos Graduação",
          cta_url: "/uninassau/cursos?degree_type=Graduação"
        },
        post_graduation: {
          title: "Pós-graduação",
          description: "Formações profissionais para o mercado, com foco...",
          icon: { data: { ... } },
          badges: ["Presencial", "Semipresencial", "EAD"],
          cta_text: "Veja cursos Pós-graduação",
          cta_url: "/uninassau/cursos?degree_type=Pós-graduação"
        }
      }
    }
  }
}
```

---

## 🎨 Figma Integration Workflow

When this task is assigned, the following will be provided:

1. **Screenshots**:
   - Full section (desktop)
   - Individual cards
   - Mobile stacked view

2. **Figma JSON Export**:
   - Card dimensions
   - Typography (title, description)
   - Spacing (internal padding, gap between cards)
   - Colors (background, borders)

3. **Assets**:
   - Path icons (SVG)

---

## 📝 Implementation Notes

### Performance
- Server Component (no client JS)
- Icons as inline SVG

### Accessibility
- Semantic headings
- Descriptive link text
- Keyboard accessible

### SEO
- Internal links help crawlability
- Descriptive text

---

## ✅ Definition of Done

- [ ] Code merged to main branch
- [ ] All tests passing
- [ ] Accessibility audit passed
- [ ] Works on all breakpoints
- [ ] Tested with all institution themes
- [ ] Strapi integration working
- [ ] Code reviewed and approved

---

**Created**: 2025-11-07
**Last Updated**: 2025-11-07
**Status**: To Do
