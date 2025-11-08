# Home Modalities Section - Kanban

## 📋 Component Overview

**Component**: Graduation Modalities Section
**Page**: `/[institution]` (Homepage)
**Priority**: Medium
**Estimated Effort**: 1-2 days

### Design Reference
- **Mockup**: `/docs/home.jpg` (blue section with 3 cards)
- **Figma**: Awaiting JSON export

### Features
- Section with dark blue background
- Title: "Nossas modalidades de Graduação"
- Subtitle text
- 3 modality cards:
  - **Presencial**: Classroom learning
  - **Semipresencial**: Hybrid model
  - **EAD**: Online learning
- Each card has:
  - Icon
  - Title
  - Description
  - "Veja cursos [Modality]" link
- Responsive layout

---

## 🎯 Technical Requirements

### Stack
- Next.js 15 (Server Component)
- Reshaped UI (Card, Button)
- TypeScript
- SCSS Modules

### Data Sources
- **Strapi**: Modalities section content

### Key Components
```typescript
<ModalitiesSection>
  <SectionHeader />
  <ModalityCards>
    <ModalityCard modality="Presencial" />
    <ModalityCard modality="Semipresencial" />
    <ModalityCard modality="EAD" />
  </ModalityCards>
</ModalitiesSection>
```

### Responsive Breakpoints
- Mobile: < 768px (1 column)
- Tablet: 768px - 1024px (2 columns, 1 on second row)
- Desktop: > 1024px (3 columns)

---

## 📊 Tasks

### Backlog
- [ ] Review modalities section design
- [ ] Define Strapi modalities component

### To Do
- [ ] **Task 1**: Create modalities section container
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - `src/features/home/components/ModalitiesSection/ModalitiesSection.tsx`
    - `src/features/home/components/ModalitiesSection/ModalitiesSection.module.scss`
  - **Acceptance Criteria**:
    - Full-width section
    - Dark blue background (from institution theme)
    - Section padding
    - White text color
  - **Figma Support**: Screenshot + JSON export

- [ ] **Task 2**: Build section header
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - Title and subtitle components
  - **Acceptance Criteria**:
    - Centered text
    - Title (h2)
    - Subtitle (p)
    - Content from Strapi
  - **Figma Support**: Typography specs

- [ ] **Task 3**: Create modality card component
  - **Assignee**: TBD
  - **Effort**: 1 day
  - **Deliverables**:
    - `src/features/home/components/ModalitiesSection/ModalityCard.tsx`
  - **Acceptance Criteria**:
    - White card background
    - Icon at top
    - Title (h3)
    - Description text
    - CTA link button at bottom
    - Reshaped Card component
    - Hover effect (subtle lift)
  - **Figma Support**: Individual card screenshot

- [ ] **Task 4**: Implement icons for each modality
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - Icon components or SVG imports
  - **Acceptance Criteria**:
    - Presencial: Building/classroom icon
    - Semipresencial: Hybrid icon
    - EAD: Computer/laptop icon
    - Consistent size and color
  - **Figma Support**: Icon exports

- [ ] **Task 5**: Add card grid layout
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - Grid CSS
  - **Acceptance Criteria**:
    - 3 equal-width columns
    - Equal height cards
    - Proper gap spacing
    - Responsive (stack on mobile)
  - **Figma Support**: Grid spacing specs

- [ ] **Task 6**: Make responsive
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - Mobile-optimized layout
  - **Acceptance Criteria**:
    - Cards stack on mobile
    - Maintain readability
    - Touch-friendly links
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
- [ ] Strapi Home Page with modalities_section component
- [ ] Institution theming working

### Blocks
- [ ] None (self-contained section)

---

## 🧪 Testing Checklist

- [ ] **Unit Tests**
  - [ ] ModalityCard renders with props
  - [ ] Correct icons display
  - [ ] Links navigate to filtered course search

- [ ] **Integration Tests**
  - [ ] Strapi content loads
  - [ ] All 3 modalities render

- [ ] **Visual Tests**
  - [ ] Screenshot at all breakpoints
  - [ ] Hover states captured

- [ ] **Accessibility Tests**
  - [ ] Semantic headings
  - [ ] Links descriptive
  - [ ] Color contrast (white on dark blue)
  - [ ] Keyboard navigation

---

## 📦 Strapi Integration

### API Endpoint
```
GET /api/home-pages?filters[institution][slug][$eq]=uninassau&populate[modalities_section][populate]=*
```

### Expected Response
```typescript
{
  data: {
    attributes: {
      modalities_section: {
        title: "Nossas modalidades de Graduação",
        subtitle: "Escolha a modalidade que se encaixa melhor no seu estilo de aprendizado",
        modalities: [
          {
            type: "Presencial",
            title: "Presencial",
            description: "Aulas no campus, contato direto com professores e colegas...",
            icon: { data: { ... } },
            cta_text: "Veja cursos Presencial",
            cta_url: "/uninassau/cursos?modality=Presencial"
          },
          {
            type: "Semipresencial",
            title: "Semipresencial",
            description: "O equilíbrio perfeito entre flexibilidade e estrutura...",
            icon: { data: { ... } },
            cta_text: "Veja cursos Semipresencial",
            cta_url: "/uninassau/cursos?modality=Semipresencial"
          },
          {
            type: "EAD",
            title: "EAD",
            description: "Estude de onde quiser no seu próprio ritmo...",
            icon: { data: { ... } },
            cta_text: "Veja cursos EAD",
            cta_url: "/uninassau/cursos?modality=EAD"
          }
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
   - Full section (desktop)
   - Individual cards
   - Mobile stacked view

2. **Figma JSON Export**:
   - Section padding
   - Card dimensions
   - Typography (title, description)
   - Spacing (gap between cards)
   - Colors (background, text)

3. **Assets**:
   - Modality icons (SVG)

---

## 📝 Implementation Notes

### Performance
- Server Component (no client JS needed)
- Icons as inline SVG (no external requests)

### Accessibility
- Section has aria-label
- Cards keyboard accessible
- Sufficient color contrast

### SEO
- Semantic HTML
- Descriptive link text
- Section heading (h2)

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
