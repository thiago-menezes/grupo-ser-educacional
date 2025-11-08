# Lead Enrichment Form - Kanban

## 📋 Component Overview

**Component**: Lead Enrichment / Pre-Registration Form
**Page**: `/[institution]/inscricao/[courseId]` or `/pre-cadastro`
**Priority**: High (Critical conversion funnel)
**Estimated Effort**: 3-4 days

### Design Reference
- **Mockup**: `/docs/lead-enc.jpg`
- **Figma**: Awaiting JSON export

### Features
- Simplified header (logo + "Ambiente seguro")
- Two-column layout (form + summary)
- **Form sections**:
  - **Informações pessoais**:
    - Nome completo
    - E-mail
    - Data de nascimento
    - Celular/Telefone
  - **Informações acadêmicas**:
    - Fez Enem? (Sim/Não radio)
    - Qual foi sua nota? (conditional)
    - Quando deseja começar? (dropdown)
    - Ano de conclusão do ensino médio (date picker)
  - **Informações de trabalho**:
    - Você trabalha? (Sim/Não radio)
    - Qual sua faixa salarial? (dropdown, conditional)
- **Summary sidebar** (sticky):
  - Enrollment process banner
  - Course name
  - Degree type + duration
  - Selected modality
  - Monthly price
  - Campus location
  - "Finalizar pré-cadastro" CTA button
- Form validation
- Multi-step or single-page
- Progress indicator (optional)
- Responsive

---

## 🎯 Technical Requirements

### Stack
- Next.js 15 (Client Component for form)
- Reshaped UI (TextField, Select, Radio, Button, Card)
- TypeScript
- SCSS Modules
- React Hook Form + Zod (validation)

### Data Sources
- **URL Params**: Lead ID from previous step
- **Strapi**: Form configuration (required fields)
- **Courses API**: Course info (for summary)

### Key Components
```typescript
<LeadEnrichmentForm>
  <SimplifiedHeader />
  <FormLayout>
    <FormSections>
      <PersonalInfoSection />
      <AcademicInfoSection />
      <WorkInfoSection />
    </FormSections>
    <SummarySidebar>
      <EnrollmentBanner />
      <CourseInfo />
      <SubmitButton />
    </SummarySidebar>
  </FormLayout>
</LeadEnrichmentForm>
```

### Responsive Breakpoints
- Mobile: < 768px (single column, summary at bottom)
- Desktop: >= 768px (two columns: form 70%, summary 30%)

---

## 📊 Tasks

### Backlog
- [ ] Review enrichment form design
- [ ] Define all form fields and validation rules
- [ ] Plan conditional field logic

### To Do
- [ ] **Task 1**: Create page structure
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - `src/app/[institution]/inscricao/[courseId]/page.tsx`
    - `src/features/lead-enrichment/components/LeadEnrichmentForm.tsx`
  - **Acceptance Criteria**:
    - Two-column layout
    - Simplified header
    - Footer
  - **Figma Support**: Screenshot + JSON export

- [ ] **Task 2**: Build simplified header
  - **Assignee**: TBD
  - **Effort**: 0.25 day
  - **Deliverables**:
    - `src/features/lead-enrichment/components/SimplifiedHeader.tsx`
  - **Acceptance Criteria**:
    - Institution logo only
    - "Ambiente seguro" badge with lock icon
    - Minimal design (no navigation)
  - **Figma Support**: Header design

- [ ] **Task 3**: Create personal info section
  - **Assignee**: TBD
  - **Effort**: 1 day
  - **Deliverables**:
    - `src/features/lead-enrichment/components/PersonalInfoSection.tsx`
  - **Acceptance Criteria**:
    - Nome completo (pre-filled if available)
    - E-mail (pre-filled, disabled)
    - Data de nascimento (date picker)
    - Celular/Telefone (phone mask, pre-filled)
    - Section heading
    - All fields validated
  - **Figma Support**: Section screenshot

- [ ] **Task 4**: Build academic info section
  - **Assignee**: TBD
  - **Effort**: 1 day
  - **Deliverables**:
    - `src/features/lead-enrichment/components/AcademicInfoSection.tsx`
  - **Acceptance Criteria**:
    - "Fez Enem?" radio buttons (Sim/Não)
    - "Qual foi sua nota?" (conditional, shows if Sim)
    - "Quando deseja começar?" dropdown (periods)
    - "Ano de conclusão do ensino médio" date picker
    - Conditional logic working
    - Section heading
  - **Figma Support**: Section screenshot

- [ ] **Task 5**: Implement work info section
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/features/lead-enrichment/components/WorkInfoSection.tsx`
  - **Acceptance Criteria**:
    - "Você trabalha?" radio buttons (Sim/Não)
    - "Qual sua faixa salarial?" dropdown (conditional, shows if Sim)
    - Options: salary ranges
    - Section heading
  - **Figma Support**: Section screenshot

- [ ] **Task 6**: Create summary sidebar
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/features/lead-enrichment/components/SummarySidebar.tsx`
  - **Acceptance Criteria**:
    - Sticky on desktop
    - Enrollment process banner
    - Course name and metadata
    - Price display
    - Campus location
    - "Finalizar pré-cadastro" button
    - Disabled state when form invalid
  - **Figma Support**: Sidebar design

- [ ] **Task 7**: Add form validation with Zod
  - **Assignee**: TBD
  - **Effort**: 1 day
  - **Deliverables**:
    - Zod schema for all fields
  - **Acceptance Criteria**:
    - All required fields validated
    - Date format validation
    - Phone format validation
    - Enem score range (0-1000)
    - Conditional validation (Enem note only if Fez Enem = Sim)
    - Portuguese error messages
  - **Figma Support**: N/A (validation logic)

- [ ] **Task 8**: Implement form submission
  - **Assignee**: TBD
  - **Effort**: 1 day
  - **Deliverables**:
    - `src/features/lead-enrichment/hooks/useLeadEnrichment.ts`
  - **Acceptance Criteria**:
    - Submit to Leads API (PUT /api/leads/:id)
    - Include all form data
    - Loading state during submission
    - Success: Redirect to confirmation page
    - Error: Show error message
    - React Query mutation
  - **Figma Support**: N/A (backend integration)

- [ ] **Task 9**: Add progress indicator (optional)
  - **Assignee**: TBD
  - **Effort**: 0.5 day (optional)
  - **Deliverables**:
    - Progress bar or step indicator
  - **Acceptance Criteria**:
    - Shows completion percentage
    - Updates as user fills form
    - Visual feedback
  - **Figma Support**: Progress indicator design

- [ ] **Task 10**: Create success/confirmation page
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - `src/app/[institution]/inscricao/confirmacao/page.tsx`
  - **Acceptance Criteria**:
    - Success message
    - Next steps instructions
    - "Voltar para o site" link
    - Optional: Download app CTA
  - **Figma Support**: Success page design (if available)

- [ ] **Task 11**: Make fully responsive
  - **Assignee**: TBD
  - **Effort**: 0.5 day
  - **Deliverables**:
    - Mobile-optimized form
  - **Acceptance Criteria**:
    - Single column on mobile
    - Summary at bottom (or floating footer)
    - Touch-friendly inputs
    - Date/select pickers mobile-friendly
  - **Figma Support**: Mobile form screenshot

### In Progress
<!-- Tasks being actively worked on -->

### Review
<!-- Tasks pending code review or testing -->

### Done
<!-- Completed tasks -->

---

## 🔗 Dependencies

### Blocked By
- [ ] Leads API (PUT /api/leads/:id)
- [ ] Course details lead form (provides initial lead)
- [ ] Strapi form configuration

### Blocks
- [ ] None (end of funnel)

---

## 🧪 Testing Checklist

- [ ] **Unit Tests**
  - [ ] All fields validate correctly
  - [ ] Conditional fields show/hide
  - [ ] Date pickers work
  - [ ] Phone mask formats

- [ ] **Integration Tests**
  - [ ] Form pre-fills from lead data
  - [ ] Form submits successfully
  - [ ] Redirects to confirmation
  - [ ] Error handling works

- [ ] **Visual Tests**
  - [ ] Screenshot all form states
  - [ ] Mobile layout captured

- [ ] **Accessibility Tests**
  - [ ] All fields labeled
  - [ ] Radio groups accessible
  - [ ] Date pickers accessible
  - [ ] Error messages announced
  - [ ] Keyboard navigation

- [ ] **UX Tests**
  - [ ] Form easy to complete
  - [ ] Clear what's required
  - [ ] Loading state clear

---

## 📦 API Integration

### Leads API Endpoint
```
PUT /api/leads/:id
```

**Request Body**:
```typescript
{
  personal_info: {
    full_name: string
    email: string
    phone: string
    birth_date: string // ISO 8601
  }

  academic_info: {
    has_enem: boolean
    enem_score?: number
    when_to_start: string // "2026.1", "2026.2"
    high_school_completion_year: string // "2023"
  }

  work_info: {
    is_employed: boolean
    salary_range?: string // "R$ 1.000 - R$ 2.000"
  }
}
```

**Response**:
```typescript
{
  lead_id: string
  status: "enriched"
  next_steps: string
  enrollment_link?: string
}
```

### Zod Schema
```typescript
export const leadEnrichmentSchema = z.object({
  personal_info: z.object({
    full_name: z.string().min(3).max(100),
    email: z.string().email(),
    phone: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/),
    birth_date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/)
  }),

  academic_info: z.object({
    has_enem: z.boolean(),
    enem_score: z.number().min(0).max(1000).optional(),
    when_to_start: z.string(),
    high_school_completion_year: z.string()
  }).refine(data => !data.has_enem || data.enem_score !== undefined, {
    message: 'Nota do Enem é obrigatória'
  }),

  work_info: z.object({
    is_employed: z.boolean(),
    salary_range: z.string().optional()
  }).refine(data => !data.is_employed || data.salary_range !== undefined, {
    message: 'Faixa salarial é obrigatória'
  })
})
```

---

## 🎨 Figma Integration Workflow

When this task is assigned, the following will be provided:

1. **Screenshots**:
   - Full form (desktop two-column)
   - Mobile stacked view
   - All form sections
   - Summary sidebar
   - Success page

2. **Figma JSON Export**:
   - Form layout (column widths)
   - Input field styles
   - Section spacing
   - Typography

3. **Assets**:
   - Lock icon (secure badge)
   - Icons for form fields (if any)

---

## 📝 Implementation Notes

### Performance
- Debounce validation
- Optimize re-renders (React.memo)
- Lazy load date picker

### Accessibility
- All fields labeled
- Error messages associated
- Focus management
- Keyboard navigation
- Screen reader support

### UX
- Auto-save to localStorage (optional)
- Clear progress indicator
- Helpful error messages
- Mobile-friendly date/time pickers

### Security
- Client + server validation
- Rate limiting
- CSRF protection
- Sanitize inputs

### Conversion Optimization
- Minimize friction (pre-fill data)
- Show progress
- Clear next steps on success
- Trust indicators (secure badge)

---

## ✅ Definition of Done

- [ ] Code merged to main branch
- [ ] All tests passing
- [ ] Accessibility audit passed
- [ ] Works on all breakpoints
- [ ] API integration working
- [ ] Validation working correctly
- [ ] Conditional fields working
- [ ] Success page functional
- [ ] Auto-save implemented (optional)
- [ ] Code reviewed and approved

---

**Created**: 2025-11-07
**Last Updated**: 2025-11-07
**Status**: To Do
