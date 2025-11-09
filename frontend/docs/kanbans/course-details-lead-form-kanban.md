# Course Details Lead Form - Kanban

## 📋 Component Overview

**Component**: Course Details Lead Form (Sidebar)
**Page**: `/[institution]/cursos/[slug]` (Course Details)
**Priority**: High (Critical conversion path)
**Estimated Effort**: 2-3 days

### Design Reference

- **Mockup**: `/docs/curso.jpg` (right sidebar)
- **Figma**: Awaiting JSON export

### Features

- Sticky sidebar on desktop
- Enrollment process banner: "Processo seletivo 2026.1 - Comece em Fevereiro"
- Form fields:
  - Nome completo (text input)
  - E-mail (email input)
  - Celular (phone input with mask)
- Selected course info display:
  - Course name
  - Degree type + duration
  - Selected modality (from hero selector)
  - Price display: "A partir de R$ 812,07 | Mensais"
  - Campus location
- "Inscrever-se" CTA button (primary)
- Form validation
- Loading state on submit
- Success/error states
- Mobile: Bottom sheet or inline

---

## 🎯 Technical Requirements

### Stack

- Next.js 15 (Client Component for form)
- Reshaped UI (TextField, Button, Card)
- TypeScript
- SCSS Modules
- React Hook Form + Zod (validation)

### Data Sources

- **Props/Context**: Selected modality, entry method from hero
- **Courses API**: Course info (pre-loaded)
- **Enrollment Process API**: Active process info

### Key Components

```typescript
<LeadForm>
  <EnrollmentBanner />
  <FormFields>
    <NameInput />
    <EmailInput />
    <PhoneInput />
  </FormFields>
  <CourseInfo>
    <CourseName />
    <CourseMetadata />
    <PriceDisplay />
    <CampusLocation />
  </CourseInfo>
  <SubmitButton />
  <SuccessMessage />
  <ErrorMessage />
</LeadForm>
```

### Responsive Breakpoints

- Mobile: < 768px (inline or bottom sheet)
- Desktop: >= 768px (sticky sidebar, width ~350px)

---

## 📊 Tasks

### Backlog

- [ ] Review lead form design
- [ ] Define validation rules
- [ ] Plan lead submission flow

### To Do

- [ ] **Task 1**: Create lead form container
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - `src/features/course-details/components/LeadForm/LeadForm.tsx`
    - `src/features/course-details/components/LeadForm/LeadForm.module.scss`
  - **Acceptance Criteria**:
    - Sticky sidebar on desktop
    - Reshaped Card component
    - Proper z-index
    - Sticky behavior (stays in viewport)
  - **Figma Support**: Screenshot + JSON export

- [ ] **Task 2**: Build enrollment process banner
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - `src/features/course-details/components/LeadForm/EnrollmentBanner.tsx`
  - **Acceptance Criteria**:
    - Blue background (institution primary)
    - White text
    - Process name and start date
    - Fetches from API or Strapi
  - **Figma Support**: Banner design specs

- [ ] **Task 3**: Implement form fields
  - **Assignee**: TBD
  - **Effort**: 1 day
  - **Deliverables**:
    - Form components using React Hook Form
  - **Acceptance Criteria**:
    - Nome completo: Text input, required, min 3 chars
    - E-mail: Email input, validated format
    - Celular: Phone input with mask (BR format)
    - Reshaped TextField components
    - Error messages below fields
    - Focus states
  - **Figma Support**: Input field designs

- [ ] **Task 4**: Create course info display
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/features/course-details/components/LeadForm/CourseInfo.tsx`
  - **Acceptance Criteria**:
    - Course name (h3 or strong)
    - Degree type + duration icons
    - Selected modality badge
    - Price (formatted currency)
    - Campus location with pin icon
    - Compact layout
  - **Figma Support**: Course info section design

- [ ] **Task 5**: Add form validation with Zod
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - Zod schema for form
  - **Acceptance Criteria**:
    - Required field validation
    - Email format validation
    - Phone format validation (BR)
    - Custom error messages in Portuguese
    - Real-time validation (onBlur)
  - **Figma Support**: N/A (validation logic)

- [ ] **Task 6**: Implement form submission
  - **Assignee**: TBD
  - **Effort**: 1 day
  - **Deliverables**:
    - `src/features/course-details/hooks/useLeadSubmission.ts`
  - **Acceptance Criteria**:
    - Submit to Leads API (POST /api/leads)
    - Include course_id, modality, entry_method
    - Loading state during submission
    - Success: Show success message or redirect
    - Error: Show user-friendly error
    - React Query mutation
  - **Figma Support**: N/A (backend integration)

- [ ] **Task 7**: Add success and error states
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - Success and error UI components
  - **Acceptance Criteria**:
    - Success: "Inscrição recebida!" message + next steps
    - Error: "Algo deu errado. Tente novamente." + retry button
    - Optional: Redirect to enrichment form on success
  - **Figma Support**: Success/error state designs

- [ ] **Task 8**: Make form responsive
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - Mobile-optimized form
  - **Acceptance Criteria**:
    - Inline on mobile (not sticky)
    - OR: Bottom sheet on scroll
    - Full-width fields
    - Touch-friendly
  - **Figma Support**: Mobile form screenshot

- [ ] **Task 9**: Add analytics tracking
  - **Assignee**: TBD
  - **Effort**: 0.25 day (optional)
  - **Deliverables**:
    - Event tracking on form interactions
  - **Acceptance Criteria**:
    - Track form view
    - Track field interactions
    - Track submission success/failure
    - GA4 or custom analytics
  - **Figma Support**: N/A

### In Progress

<!-- Tasks being actively worked on -->

### Review

<!-- Tasks pending code review or testing -->

### Done

<!-- Completed tasks -->

---

## 🔗 Dependencies

### Blocked By

- [ ] Leads API (POST endpoint)
- [ ] Course hero selectors (provide modality/entry method)
- [ ] Enrollment process API/Strapi

### Blocks

- [ ] Lead enrichment form (next step after submission)

---

## 🧪 Testing Checklist

- [ ] **Unit Tests**
  - [ ] Form validation works (all rules)
  - [ ] Phone mask formats correctly
  - [ ] Submit button disabled when invalid
  - [ ] Error messages display

- [ ] **Integration Tests**
  - [ ] Form submits to API
  - [ ] Success response shows success message
  - [ ] Error response shows error message
  - [ ] Modality selection updates form

- [ ] **Visual Tests**
  - [ ] Screenshot form at all states (empty, filled, error, success)
  - [ ] Sticky behavior captured

- [ ] **Accessibility Tests**
  - [ ] All fields labeled
  - [ ] Error messages associated with inputs
  - [ ] Form keyboard accessible
  - [ ] Focus management
  - [ ] Screen reader announces errors

- [ ] **UX Tests**
  - [ ] Form easy to fill on mobile
  - [ ] Loading state clear
  - [ ] Success message encouraging

---

## 📦 API Integration

### Leads API Endpoint

```
POST /api/leads
```

**Request Body**:

```typescript
{
  course_id: string
  modality: "Presencial" | "Semipresencial" | "EAD"
  entry_method: "Vestibular" | "ENEM" | "Transferência" | "Outro diploma"
  institution_code: string

  personal_info: {
    full_name: string
    email: string
    phone: string
  }

  utm_params?: {
    source?: string
    medium?: string
    campaign?: string
  }
}
```

**Response**:

```typescript
{
  lead_id: string
  status: "created"
  next_steps?: string
  enrollment_link?: string // Link to enrichment form
}
```

### Zod Schema

```typescript
import { z } from 'zod';

export const leadFormSchema = z.object({
  full_name: z.string().min(3, 'Nome muito curto').max(100),
  email: z.string().email('E-mail inválido'),
  phone: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido'),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;
```

---

## 🎨 Figma Integration Workflow

When this task is assigned, the following will be provided:

1. **Screenshots**:
   - Full sidebar form (desktop)
   - Form with validation errors
   - Success state
   - Mobile inline form

2. **Figma JSON Export**:
   - Sidebar width and padding
   - Input field styles
   - Button styles
   - Typography (labels, prices)

3. **Assets**:
   - Icons (if any)

---

## 📝 Implementation Notes

### Performance

- Debounce validation (300ms)
- Optimize re-renders
- Memoize course info display

### Accessibility

- Labels for all inputs
- Error messages with `aria-describedby`
- Loading state announced
- Focus on first error field

### UX

- Clear, helpful error messages
- Show password strength (if adding password field later)
- Autofocus first field on mobile
- Smooth scroll to errors

### Security

- Client + server-side validation
- Rate limiting on API
- Honeypot field (hidden, catch bots)
- Sanitize inputs

### Conversion Optimization

- Minimal fields (only essential info)
- Social proof (optional: "X alunos se inscreveram hoje")
- Trust indicators (secure badge, privacy note)
- Clear CTA: "Inscrever-se" not just "Submit"

---

## ✅ Definition of Done

- [ ] Code merged to main branch
- [ ] All tests passing
- [ ] Accessibility audit passed
- [ ] Works on all breakpoints
- [ ] API integration working
- [ ] Validation working correctly
- [ ] Success/error states functional
- [ ] Sticky behavior working
- [ ] Analytics tracking implemented
- [ ] Code reviewed and approved

---

**Created**: 2025-11-07
**Last Updated**: 2025-11-07
**Status**: To Do
