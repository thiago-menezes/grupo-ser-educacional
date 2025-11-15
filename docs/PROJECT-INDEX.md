# Grupo Ser - Multi-Institutional Website System

## Project Documentation Index

**Last Updated**: 2025-11-11
**Version**: 1.1
**Status**: Development Phase

---

## 📚 Documentation Overview

This project aims to build a unified, multi-institutional website system for universities within Grupo Ser. All universities share the same codebase, differentiated by their URL slug (e.g., `/uninassau`, `/ung`). The pilot institution is **UNINASSAU**.

### Key Features

- **Multi-tenant architecture** via Next.js dynamic routes (`/[institution]`)
- **Dynamic theming** per institution (already implemented)
- **Headless CMS** (Strapi) for content management
- **External API integration** for course data
- **Reshaped Design System** for consistent UI
- **React Query** for data fetching and caching
- **Full responsive design** (mobile-first)

---

## 📖 Core Documents

### 1. [Quick Development Guide](./QUICK-DEVELOPMENT-GUIDE.md)

**Purpose**: Essential coding standards and project rules

**Key Sections**:

- TypeScript rules (always use `type`, never `interface`)
- **Type organization**: DO NOT create types in component, hook, or context files - only in `types.ts` files
- Component structure and file organization
- Design System (Reshaped) usage guidelines
- Styling guidelines with tokens (use Reshaped tokens, never custom SCSS variables)
- Viewport breakpoints (use PostCSS custom media queries)
- Project structure examples
- Important notes and commands

**When to use**:

- Daily development work
- Code reviews
- Onboarding new developers
- Ensuring consistency across the codebase

---

### 2. [Quick Reference](./QUICK-REFERENCE.md)

**Purpose**: Developer cheat sheet for common patterns

**Key Sections**:

- Development workflow
- File structure reference
- Reshaped components examples
- API integration patterns
- Form validation patterns
- Testing patterns
- Common commands and solutions

**When to use**:

- Quick syntax reminders
- Pattern implementation
- Troubleshooting common issues
- API integration reference

---

### 3. [HFSA Architecture](./HFSA-ARCHITECTURE.md)

**Purpose**: Project structure and organization principles

**Key Sections**:

- Feature-based organization
- Component vs feature boundaries
- File naming conventions
- API ownership patterns
- Current state analysis
- Migration steps

**When to use**:

- Understanding project architecture
- Creating new features
- Code organization decisions
- Migration planning

---

### 4. [General Execution Plan](./general-execution-plan.md)

**Purpose**: High-level roadmap, timeline, and business strategy

**Key Sections**:

- Project vision and scope
- Technical architecture
- Implementation roadmap (7 phases)
- Backend API requirements (detailed specs)
- Success criteria
- Risk management
- Dependencies and blockers

**When to use**:

- Project kickoff meetings
- Stakeholder presentations
- Sprint planning
- Understanding backend integration needs

---

### 5. [Strapi Content Strategy](./strapi-content-strategy.md)

**Purpose**: Complete guide to CMS architecture and data modeling

**Key Sections**:

- Collection Types (Institution, Home Page, Course Enrichment, etc.)
- Component definitions (reusable content blocks)
- Relationships and constraints
- API response examples
- Permissions and roles
- Migration and seeding strategies

**When to use**:

- Setting up Strapi CMS
- Defining content models
- Creating API endpoints
- Training content editors
- Understanding data flow

---

### 6. [DTO & API Reference](./dto-api-reference.md)

**Purpose**: Quick reference for DTO layer and API integration

**Key Sections**:

- DTO structure and patterns
- Type definitions
- API route handlers
- Data flow diagrams
- Integration points

**When to use**:

- Understanding data fetching patterns
- Working with course/unit APIs
- Adding new DTO modules
- Debugging API calls

---

## 🎯 Component Kanbans

All Kanban files follow a consistent structure:

- Component overview and design reference
- Technical requirements
- Detailed task breakdown
- Dependencies and blockers
- Testing checklist
- API integration specs
- Figma workflow notes
- Implementation notes
- Definition of Done

### Global Components

| Kanban File                                    | Component                | Priority | Effort   | Status |
| ---------------------------------------------- | ------------------------ | -------- | -------- | ------ |
| [header-kanban.md](./kanbans/header-kanban.md) | Global Header/Navigation | High     | 3-4 days | To Do  |
| [footer-kanban.md](./kanbans/footer-kanban.md) | Global Footer            | Medium   | 2-3 days | To Do  |

---

### Homepage Components (`/[institution]`)

| Kanban File                                                                        | Component                      | Priority | Effort   | Status |
| ---------------------------------------------------------------------------------- | ------------------------------ | -------- | -------- | ------ |
| [home-hero-kanban.md](./kanbans/home-hero-kanban.md)                               | Hero Section with Quick Search | High     | 2-3 days | To Do  |
| [home-promotional-banners-kanban.md](./kanbans/home-promotional-banners-kanban.md) | Promotional Banners (3 cards)  | Medium   | 1-2 days | To Do  |
| [home-course-catalog-kanban.md](./kanbans/home-course-catalog-kanban.md)           | Featured Courses Grid          | High     | 3-4 days | To Do  |
| [home-modalities-kanban.md](./kanbans/home-modalities-kanban.md)                   | Graduation Modalities Section  | Medium   | 1-2 days | To Do  |
| [home-areas-selector-kanban.md](./kanbans/home-areas-selector-kanban.md)           | Study Areas Grid               | Medium   | 2 days   | To Do  |
| [home-career-path-kanban.md](./kanbans/home-career-path-kanban.md)                 | Career Path Chooser            | Medium   | 1.5 days | To Do  |
| [home-entry-methods-kanban.md](./kanbans/home-entry-methods-kanban.md)             | Entry Methods Section          | Medium   | 1.5 days | To Do  |
| [home-infrastructure-kanban.md](./kanbans/home-infrastructure-kanban.md)           | Infrastructure Gallery         | Low      | 1 day    | To Do  |

---

### Course Search Page (`/[institution]/cursos`)

| Kanban File                                                                  | Component           | Priority | Effort   | Status |
| ---------------------------------------------------------------------------- | ------------------- | -------- | -------- | ------ |
| [course-search-filters-kanban.md](./kanbans/course-search-filters-kanban.md) | Filters Sidebar     | High     | 3-4 days | To Do  |
| [course-search-results-kanban.md](./kanbans/course-search-results-kanban.md) | Search Results Grid | High     | 2-3 days | To Do  |

---

### Course Details Page (`/[institution]/cursos/[slug]`)

| Kanban File                                                                        | Component                 | Priority | Effort   | Status |
| ---------------------------------------------------------------------------------- | ------------------------- | -------- | -------- | ------ |
| [course-details-hero-kanban.md](./kanbans/course-details-hero-kanban.md)           | Hero + Selectors          | High     | 2 days   | To Do  |
| [course-details-content-kanban.md](./kanbans/course-details-content-kanban.md)     | Content + Related Courses | High     | 2 days   | To Do  |
| [course-details-lead-form-kanban.md](./kanbans/course-details-lead-form-kanban.md) | Lead Form Sidebar         | High     | 2-3 days | To Do  |

---

### Lead Enrichment Page (`/[institution]/inscricao/[courseId]`)

| Kanban File                                                                | Component             | Priority | Effort   | Status |
| -------------------------------------------------------------------------- | --------------------- | -------- | -------- | ------ |
| [lead-enrichment-form-kanban.md](./kanbans/lead-enrichment-form-kanban.md) | Pre-Registration Form | High     | 3-4 days | To Do  |

---

## 🚀 Implementation Phases

### Phase 1: Foundation (2-3 weeks)

**Goal**: Setup infrastructure and base components

**Components**:

- Strapi CMS configuration
- Courses API client
- Header component
- Footer component
- CourseCard component (reusable)

**Deliverables**:

- Working Strapi instance with defined schemas
- API integration layer
- Global components tested and documented

---

### Phase 2: Homepage (2 weeks)

**Goal**: Complete homepage for UNINASSAU

**Components**:

- All homepage sections (hero through infrastructure)
- Strapi content integration
- Image optimization

**Deliverables**:

- Fully functional homepage
- Responsive at all breakpoints
- Content manageable via Strapi

---

### Phase 3: Course Search (2 weeks)

**Goal**: Course discovery and filtering

**Components**:

- Filters sidebar with all filter types
- Results grid with pagination
- URL state management

**Deliverables**:

- Working search with all filters
- Performant with large datasets
- Shareable URLs

---

### Phase 4: Course Details (1.5 weeks)

**Goal**: Course information and lead capture

**Components**:

- Course hero with selectors
- Content sections
- Lead form sidebar

**Deliverables**:

- Complete course detail pages
- Lead form functional
- SEO optimized

---

### Phase 5: Lead Enrichment (1 week)

**Goal**: Complete enrollment funnel

**Components**:

- Full pre-registration form
- Success confirmation

**Deliverables**:

- End-to-end lead flow working
- Form validation robust
- Analytics tracking

---

### Phase 6: Multi-Institutional (1 week)

**Goal**: Expand to all institutions

**Deliverables**:

- System working for 5+ institutions
- Theming tested across all
- Content populated for each

---

### Phase 7: Polish & Launch (1 week)

**Goal**: Production readiness

**Deliverables**:

- Performance optimized (Lighthouse > 90)
- Accessibility compliant (WCAG AA)
- E2E tests passing
- Monitoring and analytics configured

---

## 🔄 Workflow Guide

### For Developers

1. **Starting a new component**:
   - Read the corresponding Kanban file
   - Review Figma designs
   - Check dependencies (blocked by)
   - Follow task breakdown in order

2. **During implementation**:
   - Request Figma screenshots + JSON export
   - Update Kanban task status (In Progress → Review → Done)
   - Write tests as you go
   - Document any deviations or blockers

3. **Before marking complete**:
   - All tests passing
   - Accessibility audit passed
   - Responsive at all breakpoints
   - Code reviewed
   - Documentation updated

### For Project Managers

1. **Sprint planning**:
   - Reference execution plan roadmap
   - Assign Kanban files to developers
   - Provide Figma exports when task starts
   - Track dependencies

2. **Daily standups**:
   - Check Kanban task statuses
   - Unblock dependencies
   - Adjust timelines if needed

3. **Weekly reviews**:
   - Demo completed components
   - Validate against mockups
   - Plan next sprint

### For Backend Team

1. **API Requirements**:
   - See [General Execution Plan - Section 4](./general-execution-plan.md#4-integração-com-api-externa-de-cursos)
   - All endpoint specs documented
   - Request/response examples provided

2. **Integration Points**:
   - Each Kanban has "API Integration" section
   - React Query hooks defined
   - Expected response formats specified

---

## 📊 Progress Tracking

### Summary Dashboard

| Phase               | Components           | Total Effort | Status      | Notes                     |
| ------------------- | -------------------- | ------------ | ----------- | ------------------------- |
| Foundation          | 2 global + API setup | 2-3 weeks    | Not Started | Blocking all others       |
| Homepage            | 8 sections           | 2 weeks      | Not Started | Depends on Foundation     |
| Course Search       | 2 components         | 2 weeks      | Not Started | Depends on Foundation     |
| Course Details      | 3 components         | 1.5 weeks    | Not Started | Depends on CourseCard     |
| Lead Enrichment     | 1 component          | 1 week       | Not Started | Depends on Course Details |
| Multi-Institutional | Expansion            | 1 week       | Not Started | Depends on all above      |
| Polish & Launch     | QA, optimization     | 1 week       | Not Started | Final phase               |

**Total Estimated Timeline**: ~10-11 weeks (2.5-3 months)

---

## 🎨 Design Assets

### Mockups Available

- [home.jpg](./home.jpg) - Homepage design
- [busca.jpg](./busca.jpg) - Course search page
- [curso.jpg](./curso.jpg) - Course details page
- [lead-enc.jpg](./lead-enc.jpg) - Lead enrichment form

### Figma Workflow

When a task is assigned:

1. Developer requests Figma access
2. PM provides:
   - Component screenshot
   - JSON export (spacing, typography, colors)
   - Asset exports (icons, images)
3. Developer implements following Reshaped DS
4. Visual regression tests capture final state

---

## 🧪 Testing Strategy

### Test Coverage Goals

- **Unit tests**: > 80%
- **Integration tests**: All API calls
- **E2E tests**: Critical paths (enrollment flow)
- **Visual regression**: All components at 3 breakpoints
- **Accessibility**: WCAG AA compliance

### Test Types per Component

Each Kanban defines:

- Unit test cases
- Integration test scenarios
- Visual test requirements
- Accessibility checklist
- Performance benchmarks

---

## 📝 How to Use This Documentation

### Scenario 1: "I'm starting work on the Homepage Hero"

1. Open [home-hero-kanban.md](./kanbans/home-hero-kanban.md)
2. Review component overview and features
3. Check dependencies (blocked by what?)
4. Follow task breakdown sequentially
5. Request Figma exports from PM
6. Implement following technical requirements
7. Run tests from checklist
8. Mark tasks as done in Kanban

### Scenario 2: "I need to understand the Strapi schema"

1. Open [strapi-content-strategy.md](./strapi-content-strategy.md)
2. Find relevant Collection Type (e.g., Home Page)
3. Review field definitions
4. Check component definitions
5. See API response examples
6. Implement in Strapi

### Scenario 3: "What does the backend team need to build?"

1. Open [general-execution-plan.md](./general-execution-plan.md)
2. Go to Section 4: API Requirements
3. Find specific endpoint (e.g., GET /api/courses)
4. Review query parameters
5. Check expected response format
6. Note non-functional requirements

### Scenario 4: "I want to see the project timeline"

1. Open [general-execution-plan.md](./general-execution-plan.md)
2. Go to Section 5: Roadmap
3. Review phases and sprints
4. Check deliverables for each phase
5. Identify dependencies

---

## 🔗 Key Links

- **Repository**: `/Users/thiago/Projects/grupo-ser/grupo-ser/frontend`
- **Current Branch**: `main`
- **Design System**: [Reshaped](https://reshaped.so/)
- **Framework**: Next.js 15 (App Router)
- **CMS**: Strapi (headless)
- **Project Instructions**: [CLAUDE.md](../CLAUDE.md)

---

## 📧 Contact & Collaboration

### When You Need Help

- **Technical questions**: Check component Kanban first
- **Design clarifications**: Request Figma access
- **Backend API questions**: Reference execution plan Section 4
- **Strapi questions**: Reference content strategy doc
- **Blockers**: Update Kanban dependency section

### Reporting Issues

When you encounter blockers:

1. Document in relevant Kanban file
2. Update status (mark task as blocked)
3. Specify what's needed to unblock
4. Notify team

---

## ✅ Quick Start Checklist

### For New Team Members

- [ ] Read [QUICK-DEVELOPMENT-GUIDE.md](./QUICK-DEVELOPMENT-GUIDE.md) (coding standards)
- [ ] Read [QUICK-REFERENCE.md](./QUICK-REFERENCE.md) (developer cheat sheet)
- [ ] Review [HFSA-ARCHITECTURE.md](./HFSA-ARCHITECTURE.md) (project structure)
- [ ] Review [general-execution-plan.md](./general-execution-plan.md) (big picture)
- [ ] Skim [strapi-content-strategy.md](./strapi-content-strategy.md) (data architecture)
- [ ] Look at mockups in `/docs` folder
- [ ] Review 2-3 Kanban files to understand structure
- [ ] Request Figma access
- [ ] Set up local development environment
- [ ] Run existing tests
- [ ] Ask questions!

### For Immediate Start

If you're ready to code:

1. Choose a component from Progress Tracking table above
2. Open corresponding Kanban file
3. Check if dependencies are met
4. Request Figma exports
5. Start with Task 1

---

## 🎯 Success Metrics

### Technical

- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility > 95
- [ ] Test coverage > 80%
- [ ] Zero console errors in production
- [ ] Core Web Vitals all green

### Business

- [ ] Lead form conversion rate > 5%
- [ ] Page load time < 2s
- [ ] Bounce rate < 40%
- [ ] 5+ institutions live
- [ ] Content 100% manageable via Strapi

### User Experience

- [ ] Mobile-friendly (all features work on touch)
- [ ] Keyboard navigable
- [ ] Screen reader compatible
- [ ] Works on slow connections (3G)
- [ ] Clear error messages

---

**Happy Building!** 🚀

This documentation is living - update as the project evolves.

---

**Document Version History**:

- v1.0 (2025-11-07): Initial planning documentation created
