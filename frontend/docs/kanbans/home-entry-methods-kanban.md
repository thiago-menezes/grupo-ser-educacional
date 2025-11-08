# Home Entry Methods Section - Kanban

## 📋 Component Overview

**Component**: Entry Methods/Forms of Admission Section
**Page**: `/[institution]` (Homepage)
**Priority**: Medium
**Estimated Effort**: 1.5 days

### Design Reference
- **Mockup**: `/docs/home.jpg` (section showing admission methods)
- **Figma**: Awaiting JSON export

### Features
- Section title: "Conheça nossas formas de ingresso"
- Subtitle text
- 4 entry method cards:
  - **Vestibular**: Traditional entrance exam
  - **ENEM**: National exam
  - **Transferência**: Transfer from another institution
  - **Outro diploma**: Second degree
- Each card shows:
  - Icon
  - Title
  - Description
  - Optional: "Saiba mais" link
- Light background (white or light gray)
- Responsive layout (2x2 grid on desktop, stack on mobile)

---

## 🎯 Technical Requirements

### Stack
- Next.js 15 (Server Component)
- Reshaped UI (Card)
- TypeScript
- SCSS Modules

### Data Sources
- **Strapi**: Entry methods section content

### Key Components
```typescript
<EntryMethodsSection>
  <SectionHeader />
  <MethodsGrid>
    <MethodCard method="Vestibular" />
    <MethodCard method="ENEM" />
    <MethodCard method="Transferência" />
    <MethodCard method="Outro diploma" />
  </MethodsGrid>
</EntryMethodsSection>
```

### Responsive Breakpoints
- Mobile: < 768px (1 column)
- Tablet: 768px - 1024px (2 columns)
- Desktop: > 1024px (4 columns)

---

## 📊 Tasks

### Backlog
- [ ] Review entry methods section design
- [ ] Define Strapi entry_methods component

### To Do
- [ ] **Task 1**: Create entry methods section container
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - `src/features/home/components/EntryMethodsSection/EntryMethodsSection.tsx`
    - `src/features/home/components/EntryMethodsSection/EntryMethodsSection.module.scss`
  - **Acceptance Criteria**:
    - Section with title and subtitle
    - Grid container
    - Light background
  - **Figma Support**: Screenshot + JSON export

- [ ] **Task 2**: Build entry method card component
  - **Assignee**: TBD
  - **Effort**: 1 day
  - **Deliverables**:
    - `src/features/home/components/EntryMethodsSection/MethodCard.tsx`
  - **Acceptance Criteria**:
    - Icon at top (centered)
    - Title (h3)
    - Description text
    - Optional CTA link
    - Reshaped Card component
    - Hover effect (subtle shadow)
    - Equal height cards
  - **Figma Support**: Individual card screenshot

- [ ] **Task 3**: Implement icons for each method
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - Icon components or SVG imports
  - **Acceptance Criteria**:
    - Vestibular: Pencil/test icon
    - ENEM: Document/certificate icon
    - Transferência: Arrow/exchange icon
    - Outro diploma: Graduation cap icon
    - Consistent size and color (institution primary)
  - **Figma Support**: Icon exports

- [ ] **Task 4**: Add grid layout
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - Grid CSS
  - **Acceptance Criteria**:
    - 4 columns on desktop
    - 2 columns on tablet
    - 1 column on mobile
    - Equal height cards
    - Proper gap spacing
  - **Figma Support**: Grid spacing specs

- [ ] **Task 5**: Make responsive
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
- [ ] Strapi Home Page with entry_methods section

### Blocks
- [ ] None (self-contained section)

---

## 🧪 Testing Checklist

- [ ] **Unit Tests**
  - [ ] MethodCard renders with props
  - [ ] Correct icons display
  - [ ] Links navigate correctly

- [ ] **Integration Tests**
  - [ ] Strapi content loads
  - [ ] All 4 methods render

- [ ] **Visual Tests**
  - [ ] Screenshot at all breakpoints
  - [ ] Hover states captured

- [ ] **Accessibility Tests**
  - [ ] Semantic headings
  - [ ] Links descriptive
  - [ ] Icons have aria-labels
  - [ ] Keyboard navigation

---

## 📦 Strapi Integration

### API Endpoint
```
GET /api/home-pages?filters[institution][slug][$eq]=uninassau&populate[entry_methods][populate]=*
```

### Expected Response
```typescript
{
  data: {
    attributes: {
      entry_methods: {
        title: "Conheça nossas formas de ingresso",
        subtitle: "Diferentes formas para começar sua jornada...",
        methods: [
          {
            type: "Vestibular",
            title: "Vestibular",
            description: "Faça seu vestibular online",
            icon: { data: { ... } },
            cta_text: "Saiba mais",
            cta_url: "/uninassau/vestibular"
          },
          {
            type: "ENEM",
            title: "ENEM",
            description: "Utilize notas do ENEM dos últimos 5 anos",
            icon: { data: { ... } },
            cta_text: "Saiba mais",
            cta_url: "/uninassau/enem"
          },
          {
            type: "Transferência",
            title: "Transferência",
            description: "Transfira seu curso de outra instituição",
            icon: { data: { ... } },
            cta_text: "Saiba mais",
            cta_url: "/uninassau/transferencia"
          },
          {
            type: "Outro diploma",
            title: "Outro diploma",
            description: "Utilize seu diploma para ingressar",
            icon: { data: { ... } },
            cta_text: "Saiba mais",
            cta_url: "/uninassau/outro-diploma"
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
   - Card dimensions
   - Typography (title, description)
   - Spacing (internal padding, grid gaps)
   - Icon sizes

3. **Assets**:
   - Method icons (SVG)

---

## 📝 Implementation Notes

### Performance
- Server Component (no client JS)
- Icons as inline SVG

### Accessibility
- Semantic headings
- Descriptive link text
- Icons decorative with aria-hidden (text is primary)

### SEO
- Internal links
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
