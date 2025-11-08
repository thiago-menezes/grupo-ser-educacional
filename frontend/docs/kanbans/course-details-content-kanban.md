# Course Details Content - Kanban

## 📋 Component Overview

**Component**: Course Details Content Section
**Page**: `/[institution]/cursos/[slug]` (Course Details)
**Priority**: High
**Estimated Effort**: 2 days

### Design Reference
- **Mockup**: `/docs/curso.jpg` (main content area)
- **Figma**: Awaiting JSON export

### Features
- Section: "Sobre o curso"
  - Rich text description from Strapi
  - Career opportunities
  - Curriculum highlights
  - Differentials
- Section: "Encontre o seu curso e transforme sua carreira!"
  - Related courses carousel
  - Reuses CourseCard component
  - Horizontal scrolling on mobile
- Responsive layout

---

## 🎯 Technical Requirements

### Stack
- Next.js 15 (Server Component for content, Client for carousel)
- Reshaped UI components
- TypeScript
- SCSS Modules
- Swiper or custom carousel

### Data Sources
- **Strapi Course Enrichment**: Description, career info, etc.
- **Courses API**: Related courses

### Key Components
```typescript
<CourseContent>
  <AboutSection>
    <RichTextContent />
  </AboutSection>
  <RelatedCoursesSection>
    <SectionHeader />
    <CourseCarousel>
      <CourseCard />
      <CourseCard />
      ...
    </CourseCarousel>
  </RelatedCoursesSection>
</CourseContent>
```

### Responsive Breakpoints
- Mobile: < 768px (full-width, carousel scrolls)
- Desktop: >= 768px (main content with sidebar)

---

## 📊 Tasks

### Backlog
- [ ] Review content section design
- [ ] Understand Strapi richtext format
- [ ] Research carousel libraries

### To Do
- [ ] **Task 1**: Create course content container
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - `src/features/course-details/components/CourseContent/CourseContent.tsx`
    - `src/features/course-details/components/CourseContent/CourseContent.module.scss`
  - **Acceptance Criteria**:
    - Main content area layout
    - Proper spacing from hero
    - Two-column layout (content + sidebar on desktop)
  - **Figma Support**: Screenshot + JSON export

- [ ] **Task 2**: Build "Sobre o curso" section
  - **Assignee**: TBD
  - **Effort**: 1 day
  - **Deliverables**:
    - `src/features/course-details/components/CourseContent/AboutSection.tsx`
    - `src/components/RichText/RichText.tsx` (reusable)
  - **Acceptance Criteria**:
    - Renders richtext from Strapi
    - Section title (h2)
    - Multiple subsections:
      - Description
      - Career opportunities
      - Curriculum highlights
      - Differentials
    - Proper typography styling
    - Links, lists, bold, italic supported
  - **Figma Support**: Content typography specs

- [ ] **Task 3**: Create related courses section
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/features/course-details/components/CourseContent/RelatedCoursesSection.tsx`
  - **Acceptance Criteria**:
    - Section title + "Ver todos os cursos" link
    - Carousel container
    - Fetches related courses from API
  - **Figma Support**: Section header design

- [ ] **Task 4**: Implement course carousel
  - **Assignee**: TBD
  - **Effort**: 1 day
  - **Deliverables**:
    - `src/components/CourseCarousel/CourseCarousel.tsx` (reusable)
  - **Acceptance Criteria**:
    - Horizontal carousel with CourseCard
    - 4 cards visible on desktop
    - 1-2 cards on mobile
    - Left/right navigation arrows
    - Touch/swipe support on mobile
    - Keyboard navigation (arrow keys)
    - Smooth animations
    - Optional: Auto-scroll
  - **Figma Support**: Carousel design with arrows

- [ ] **Task 5**: Fetch related courses
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/features/course-details/hooks/useRelatedCourses.ts`
  - **Acceptance Criteria**:
    - Query related courses from Strapi enrichment
    - Fallback to same area courses from API
    - React Query caching
    - Max 8 related courses
  - **Figma Support**: N/A (backend integration)

- [ ] **Task 6**: Make responsive
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - Mobile-optimized layout
  - **Acceptance Criteria**:
    - Content full-width on mobile
    - Carousel scrollable
    - Proper spacing
  - **Figma Support**: Mobile content screenshot

### In Progress
<!-- Tasks being actively worked on -->

### Review
<!-- Tasks pending code review or testing -->

### Done
<!-- Completed tasks -->

---

## 🔗 Dependencies

### Blocked By
- [ ] Strapi Course Enrichment with richtext content
- [ ] CourseCard component (reused)
- [ ] Courses API for related courses

### Blocks
- [ ] None (content is standalone)

---

## 🧪 Testing Checklist

- [ ] **Unit Tests**
  - [ ] RichText renders HTML correctly
  - [ ] Carousel navigation works
  - [ ] Related courses display

- [ ] **Integration Tests**
  - [ ] Strapi content loads
  - [ ] Related courses load from API
  - [ ] Carousel swipe on mobile

- [ ] **Visual Tests**
  - [ ] Screenshot content section
  - [ ] Carousel at different breakpoints

- [ ] **Accessibility Tests**
  - [ ] Semantic headings
  - [ ] RichText links accessible
  - [ ] Carousel keyboard navigable
  - [ ] Alt text on carousel images

- [ ] **Performance Tests**
  - [ ] RichText renders efficiently
  - [ ] Carousel smooth on mobile

---

## 📦 Strapi Integration

### API Endpoint
```
GET /api/course-enrichments?filters[course_id][$eq]=:id&populate[related_courses][populate]=*
```

**Response**:
```typescript
{
  data: {
    attributes: {
      description: string // richtext HTML or Markdown
      career_opportunities: string
      curriculum_highlights: string
      differentials: string
      related_courses: {
        data: [
          {
            attributes: {
              course_id: string // Fetch full course from Courses API
            }
          }
        ]
      }
    }
  }
}
```

### RichText Component
```typescript
// src/components/RichText/RichText.tsx
export function RichText({ content }: { content: string }) {
  return (
    <div
      className="richtext"
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
    />
  )
}
```

---

## 🎨 Figma Integration Workflow

When this task is assigned, the following will be provided:

1. **Screenshots**:
   - Full content section (desktop)
   - Related courses carousel
   - Mobile scrollable carousel

2. **Figma JSON Export**:
   - Typography (headings, paragraphs)
   - Spacing between sections
   - Carousel navigation styles

3. **Assets**:
   - Arrow icons for carousel

---

## 📝 Implementation Notes

### Performance
- Server-render content
- Lazy load carousel images
- Prefetch related courses

### Accessibility
- Semantic HTML in richtext
- Carousel accessible (ARIA labels)
- Keyboard navigation

### SEO
- Semantic heading hierarchy
- Internal links to related courses

### Carousel Library Options
- **Swiper**: Full-featured, accessible
- **Embla Carousel**: Lightweight
- **Custom**: Full control, more work

---

## ✅ Definition of Done

- [ ] Code merged to main branch
- [ ] All tests passing
- [ ] Accessibility audit passed
- [ ] Works on all breakpoints
- [ ] Strapi integration working
- [ ] RichText renders correctly
- [ ] Carousel functional and smooth
- [ ] Related courses load
- [ ] Code reviewed and approved

---

**Created**: 2025-11-07
**Last Updated**: 2025-11-07
**Status**: To Do
