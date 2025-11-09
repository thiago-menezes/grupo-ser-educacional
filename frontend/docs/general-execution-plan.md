# Plano Geral de Execução - Sistema Multi-Institucional de Websites Universitários

## 1. Visão Geral do Projeto

### 1.1 Objetivo

Desenvolver um sistema unificado de websites para múltiplas instituições de ensino do Grupo Ser, utilizando Next.js 15 com arquitetura multi-tenant baseada em slugs (`/[institution]`), onde todo o conteúdo dinâmico será gerenciado via Strapi CMS e dados de cursos virão de API externa.

### 1.2 Escopo Inicial

- **Instituição Piloto**: UNINASSAU
- **Páginas**: Home, Busca de Cursos, Detalhes do Curso, Enriquecimento de Lead
- **Design System**: Reshaped (já implementado)
- **Backend**: Strapi CMS + API externa de cursos

---

## 2. Arquitetura Técnica

### 2.1 Stack Tecnológico

- **Frontend**: Next.js 15 (App Router), TypeScript, React Query
- **UI**: Reshaped Design System
- **CMS**: Strapi (headless)
- **Autenticação**: NextAuth v5 + Auth0
- **Testes**: Vitest + Testing Library
- **Gerenciamento de Estado**: React Query + Context API
- **Validação de Formulários**: React Hook Form + Zod

### 2.2 Estrutura de Rotas

```
/[institution]                    # Home institucional
/[institution]/cursos             # Busca de cursos
/[institution]/cursos/[slug]      # Detalhes do curso
/[institution]/inscricao/[courseId] # Lead enrichment
```

### 2.3 Fluxo de Dados

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│      Next.js Frontend           │
│  - React Query (cache)          │
│  - Institution Theme Provider   │
└────┬──────────────────┬─────────┘
     │                  │
     ▼                  ▼
┌──────────┐      ┌───────────────┐
│  Strapi  │      │  Courses API  │
│   CMS    │      │   (External)  │
└──────────┘      └───────────────┘
```

---

## 3. Estratégia de Conteúdo (Strapi)

### 3.1 Collection Types Necessários

#### a) **Institution** (Single Type por instituição)

- slug (string, unique)
- name (string)
- logo (media)
- theme_config (JSON - cores, fontes)
- contact_info (component)
- social_media (component)

#### b) **Home Page** (Dynamic Zone)

- hero_section (component)
  - title (richtext)
  - subtitle (richtext)
  - background_image (media)
  - cta_buttons (component repeatable)
  - quick_search_form (boolean)
- promotional_banners (component repeatable)
  - title (string)
  - image (media)
  - link (string)
  - cta_text (string)
- featured_courses (relation to Course Enrichment)
- modalities_section (component)
- areas_of_study (component repeatable)
- entry_methods (component repeatable)
- infrastructure_images (media multiple)

#### c) **Course Enrichment** (Collection Type)

- course_id (string, unique) - ID da API externa
- institution (relation to Institution)
- description (richtext)
- career_opportunities (richtext)
- curriculum_highlights (richtext)
- video_url (string)
- gallery (media multiple)
- related_courses (relation self)
- seo_title (string)
- seo_description (text)
- is_featured (boolean)

#### d) **Enrollment Process** (Collection Type)

- institution (relation)
- name (string) - ex: "Processo Seletivo 2026.1"
- start_date (date)
- end_date (date)
- is_active (boolean)
- description (richtext)

#### e) **Lead Form Configuration** (Single Type)

- required_fields (JSON)
- academic_questions (component repeatable)
- work_questions (component repeatable)

### 3.2 Relacionamentos

```
Institution (1) ──────< (N) Course Enrichment
Institution (1) ──────< (N) Enrollment Process
Course Enrichment (N) ────> (N) Course Enrichment (related)
```

---

## 4. Integração com API Externa de Cursos

### 4.1 Requisitos para o Time de Backend

#### Endpoint: GET /api/courses

**Descrição**: Listar cursos com filtros

**Query Parameters Necessários**:

```typescript
{
  institution_code: string        // Código da instituição (ex: "UNINASSAU")
  area?: string                   // Área de estudo (ex: "Engenharia & Tecnologia")
  modality?: string[]             // ["Presencial", "Semipresencial", "EAD"]
  degree_type?: string            // "Graduação" ou "Pós-Graduação"
  city?: string                   // Cidade
  campus?: string                 // Campus específico
  shift?: string[]                // ["Manhã", "Tarde", "Noite", "Virtual"]
  min_price?: number              // Preço mínimo
  max_price?: number              // Preço máximo
  duration_years?: number[]       // [2, 3, 4, 5]
  search?: string                 // Busca textual
  page?: number
  limit?: number
  sort_by?: string                // "price_asc" | "price_desc" | "name_asc" | "relevance"
}
```

**Response Esperada**:

```typescript
{
  data: [
    {
      id: string                  // ID único do curso
      name: string                // "Engenharia Civil"
      area: string                // "Engenharia & Tecnologia"
      degree_type: string         // "Bacharelado" | "Licenciatura" | "Tecnólogo"
      modalities: string[]        // ["Presencial", "EAD"]
      duration: {
        years: number             // 5
        semesters: number         // 10
      }
      pricing: {
        monthly_fee: number       // 950.10
        currency: string          // "BRL"
        discount?: number         // 20 (percentual)
      }
      campus: {
        id: string
        name: string              // "Polo Centro"
        city: string              // "São José dos Campos"
        state: string             // "SP"
        coordinates?: {
          lat: number
          lng: number
        }
      }
      shifts: string[]            // ["Manhã", "Noite"]
      institution_code: string    // "UNINASSAU"
      slug: string                // "engenharia-civil"
    }
  ],
  meta: {
    total: number
    page: number
    limit: number
    total_pages: number
  }
}
```

#### Endpoint: GET /api/courses/:id

**Descrição**: Detalhes de um curso específico

**Response Esperada**:

```typescript
{
  id: string
  name: string
  area: string
  degree_type: string
  modalities: string[]
  duration: {
    years: number
    semesters: number
  }
  pricing: {
    monthly_fee: number
    currency: string
    discount?: number
    enrollment_fee?: number
  }
  campus: {
    id: string
    name: string
    city: string
    state: string
    address: string
    coordinates?: { lat: number, lng: number }
  }
  shifts: string[]
  institution_code: string
  slug: string

  // Informações adicionais para página de detalhes
  available_entry_methods: string[]  // ["Vestibular", "ENEM", "Transferência", "Outro diploma"]
  enrollment_process: {
    id: string
    name: string
    start_date: string
    end_date: string
  }
  coordinator?: {
    name: string
    bio?: string
    photo_url?: string
  }
}
```

#### Endpoint: GET /api/courses/nearby

**Descrição**: Buscar cursos próximos a uma localização

**Query Parameters**:

```typescript
{
  latitude: number
  longitude: number
  radius_km: number
  institution_code: string
  ...outros filtros do GET /api/courses
}
```

#### Endpoint: GET /api/campuses

**Descrição**: Listar campus disponíveis

**Query Parameters**:

```typescript
{
  institution_code: string
  city?: string
  state?: string
}
```

**Response**:

```typescript
{
  data: [
    {
      id: string
      name: string
      city: string
      state: string
      address: string
      coordinates?: { lat: number, lng: number }
    }
  ]
}
```

#### Endpoint: POST /api/leads

**Descrição**: Enviar lead de inscrição

**Request Body**:

```typescript
{
  course_id: string
  modality: string
  entry_method: string
  institution_code: string

  personal_info: {
    full_name: string
    email: string
    phone: string
    birth_date?: string
  }

  academic_info?: {
    has_enem: boolean
    enem_score?: number
    when_to_start: string
    high_school_completion_year: string
  }

  work_info?: {
    is_employed: boolean
    salary_range?: string
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
  status: "created" | "pending" | "approved"
  next_steps?: string
  enrollment_link?: string
}
```

### 4.2 Requisitos Não-Funcionais da API

1. **Performance**:
   - Tempo de resposta < 500ms para listagem
   - Suporte a cache (ETags, Cache-Control headers)
   - Paginação eficiente

2. **Disponibilidade**:
   - SLA mínimo de 99.5%
   - Rate limiting documentado
   - Timeout configurável

3. **Segurança**:
   - Autenticação via API Key (header `X-API-Key`)
   - CORS configurado para domínios do frontend
   - HTTPS obrigatório

4. **Documentação**:
   - OpenAPI/Swagger spec
   - Exemplos de request/response
   - Códigos de erro padronizados

---

## 5. Roadmap de Implementação

### Fase 1: Fundação (2-3 semanas)

**Objetivos**: Estrutura base e integrações essenciais

#### Sprint 1.1: Setup e Infraestrutura

- [ ] Configurar Strapi CMS (collections types)
- [ ] Criar client da API de cursos no frontend
- [ ] Setup de variáveis de ambiente
- [ ] Configurar React Query para cache
- [ ] Documentação de APIs

#### Sprint 1.2: Componentes Base

- [ ] Header component (reutilizável)
- [ ] Footer component (reutilizável)
- [ ] Course Card component
- [ ] Filter components (sidebar)
- [ ] Form components base

**Entregáveis**:

- Strapi rodando com schema definido
- Client da API funcionando
- Componentes base testados

---

### Fase 2: Homepage (2 semanas)

#### Sprint 2.1: Hero e Seções Estáticas

- [ ] Hero section com imagem/vídeo
- [ ] Banners promocionais
- [ ] Seção de modalidades
- [ ] Seção de áreas de estudo
- [ ] Seção de formas de ingresso

#### Sprint 2.2: Seções Dinâmicas e Integração

- [ ] Catálogo de cursos em destaque
- [ ] Integração com Strapi para conteúdo
- [ ] Galeria de infraestrutura
- [ ] Otimização de imagens (next/image)

**Entregáveis**:

- Homepage completa e responsiva
- Conteúdo gerenciável via Strapi
- Testes de integração passando

---

### Fase 3: Busca de Cursos (2 semanas)

#### Sprint 3.1: Filtros e Busca

- [ ] Sidebar de filtros
- [ ] Filtro por graduação/pós
- [ ] Filtro por cidade e raio
- [ ] Filtro por modalidade
- [ ] Filtro por preço
- [ ] Filtro por turno
- [ ] Busca textual

#### Sprint 3.2: Resultados e Navegação

- [ ] Grid de resultados
- [ ] Ordenação
- [ ] Paginação
- [ ] Estado vazio (sem resultados)
- [ ] Loading states
- [ ] URL state management (filtros na URL)

**Entregáveis**:

- Página de busca funcional
- Filtros sincronizados com URL
- Performance otimizada (debounce, lazy loading)

---

### Fase 4: Detalhes do Curso (1.5 semanas)

#### Sprint 4.1: Layout e Conteúdo

- [ ] Hero com imagem/vídeo
- [ ] Breadcrumb navigation
- [ ] Seleção de modalidade
- [ ] Seleção de forma de ingresso
- [ ] Descrição do curso (Strapi)
- [ ] Carrossel de cursos relacionados

#### Sprint 4.2: Lead Form

- [ ] Form de inscrição (sidebar sticky)
- [ ] Validação com Zod
- [ ] Integração com API de leads
- [ ] Estados de sucesso/erro

**Entregáveis**:

- Página de curso completa
- Lead form funcional
- SEO otimizado (meta tags dinâmicas)

---

### Fase 5: Enriquecimento de Lead (1 semana)

#### Sprint 5.1: Formulário Completo

- [ ] Layout simplificado (header + form)
- [ ] Validação de campos
- [ ] Etapas do formulário
- [ ] Resumo lateral (sticky)
- [ ] Submissão e confirmação

**Entregáveis**:

- Fluxo de pré-cadastro completo
- Integração com backend de leads
- Página de confirmação

---

### Fase 6: Multi-Institucional (1 semana)

#### Sprint 6.1: Expansão

- [ ] Aplicar tematização para outras instituições
- [ ] Testar fluxo completo em 3+ instituições
- [ ] Ajustes de conteúdo no Strapi
- [ ] Validação de rotas dinâmicas

**Entregáveis**:

- Sistema funcionando para 5 instituições
- Guia de adição de novas instituições

---

### Fase 7: Polimento e Lançamento (1 semana)

#### Sprint 7.1: QA e Performance

- [ ] Testes E2E (Playwright)
- [ ] Lighthouse audit (score 90+)
- [ ] Acessibilidade (WCAG AA)
- [ ] Cross-browser testing
- [ ] Mobile testing

#### Sprint 7.2: Deploy e Monitoramento

- [ ] Deploy em produção
- [ ] Setup de analytics
- [ ] Monitoramento de erros (Sentry)
- [ ] Documentação final

**Entregáveis**:

- Sistema em produção
- Métricas de performance
- Runbook de operações

---

## 6. Critérios de Sucesso

### 6.1 Técnicos

- [ ] Lighthouse Performance Score > 90
- [ ] Lighthouse Accessibility Score > 95
- [ ] Core Web Vitals no verde
- [ ] Cobertura de testes > 80%
- [ ] Zero erros de console em produção

### 6.2 Funcionais

- [ ] Todas as páginas responsivas (mobile-first)
- [ ] Conteúdo 100% gerenciável via Strapi
- [ ] Filtros de busca retornam resultados corretos
- [ ] Lead form funciona em todos os fluxos
- [ ] SEO implementado (meta tags, sitemap, robots.txt)

### 6.3 Negócio

- [ ] Taxa de conversão de lead > 5%
- [ ] Tempo médio de carregamento < 2s
- [ ] Bounce rate < 40%
- [ ] Tempo na página > 2min

---

## 7. Riscos e Mitigações

| Risco                       | Probabilidade | Impacto | Mitigação                                                  |
| --------------------------- | ------------- | ------- | ---------------------------------------------------------- |
| API de cursos instável      | Média         | Alto    | Implementar cache agressivo, fallback para dados estáticos |
| Strapi schema changes       | Baixa         | Médio   | Versionar schema, migrations automáticas                   |
| Performance em mobile       | Média         | Alto    | Image optimization, lazy loading, code splitting           |
| Tematização inconsistente   | Baixa         | Médio   | Design tokens centralizados, testes visuais                |
| Dados de cursos incompletos | Alta          | Médio   | Validação na ingestão, alertas para admins                 |

---

## 8. Dependências Externas

### 8.1 Time de Backend

- [ ] API de cursos implementada e documentada (Prazo: Fase 1)
- [ ] API de leads implementada (Prazo: Fase 4)
- [ ] Strapi configurado e acessível (Prazo: Fase 1)

### 8.2 Time de Design

- [ ] Mockups finalizados (Concluído ✓)
- [ ] Componentes do Figma exportados como JSON (Por demanda)
- [ ] Assets de imagens otimizados (Contínuo)

### 8.3 Time de Conteúdo

- [ ] Textos para homepage (Prazo: Fase 2)
- [ ] Descrições de cursos (Prazo: Fase 4)
- [ ] Imagens de infraestrutura (Prazo: Fase 2)

---

## 9. Stack de Monitoramento

### Produção

- **Analytics**: Google Analytics 4 ou Plausible
- **Error Tracking**: Sentry
- **Performance**: Vercel Analytics ou New Relic
- **Logs**: Datadog ou CloudWatch

### Desenvolvimento

- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode
- **Testing**: Vitest + Testing Library + Playwright

---

## 10. Próximos Passos Imediatos

1. **Validar este plano** com stakeholders
2. **Confirmar APIs** com time de backend
3. **Iniciar Sprint 1.1** (Setup e Infraestrutura)
4. **Criar repositório Strapi** (se necessário)
5. **Definir processo de colaboração** (Figma → Code)

---

## 11. Glossário

- **Institution Slug**: Identificador único da instituição na URL (ex: `uninassau`, `ung`)
- **Course ID**: ID único do curso na API externa
- **Course Enrichment**: Conteúdo adicional do curso gerenciado no Strapi
- **Lead**: Registro de interesse de um potencial aluno
- **Modality**: Modalidade de ensino (Presencial, Semipresencial, EAD)
- **Entry Method**: Forma de ingresso (Vestibular, ENEM, Transferência, Outro diploma)

---

**Última atualização**: 2025-11-07
**Versão**: 1.0
**Autor**: Claude (Anthropic)
