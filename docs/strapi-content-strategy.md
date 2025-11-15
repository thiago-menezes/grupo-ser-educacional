# Estratégia de Conteúdo - Strapi CMS

## 1. Visão Geral

Este documento define a estrutura de dados no Strapi para o sistema multi-institucional de websites universitários. O objetivo é centralizar todo o conteúdo editável, permitindo que diferentes instituições gerenciem seus sites sem necessidade de deploy de código.

---

## 2. Arquitetura de Dados

### 2.1 Princípios

1. **Multi-tenancy**: Cada conteúdo deve estar associado a uma instituição
2. **Reutilização**: Componentes compartilhados entre diferentes collection types
3. **Flexibilidade**: Dynamic Zones para seções customizáveis
4. **Performance**: Relações otimizadas, evitar N+1 queries
5. **SEO-friendly**: Campos dedicados para metadados

---

## 3. Collection Types

### 3.1 Institution (Single Type por instituição)

**Descrição**: Configurações e dados da instituição

**Campos**:

```typescript
{
  slug: string (unique, required)           // "uninassau", "ung"
  name: string (required)                   // "UNINASSAU"
  full_name: string                         // "Universidade Nassa"
  logo: media (required)                    // Logo principal
  logo_footer: media                        // Logo para footer (pode ser diferente)
  favicon: media                            // Favicon customizado

  // Tema (JSON)
  theme_config: JSON {
    primary_color: string                   // "#003366"
    secondary_color: string
    accent_color: string
    // ... outros tokens
  }

  // Contato
  contact: component<Contact>               // Ver seção de Components

  // Redes sociais
  social_media: component<SocialMedia>[]    // Repeatable

  // SEO
  default_seo: component<SEO>               // Meta tags padrão

  // Configurações
  is_active: boolean (default: true)
  default_campus_id: string                 // ID do campus padrão na API externa
  ga_tracking_id: string                    // Google Analytics

  // Criado/Atualizado
  createdAt: datetime
  updatedAt: datetime
}
```

**API Endpoint**: `/api/institutions?filters[slug][$eq]=uninassau`

---

### 3.2 Home Page (Collection Type)

**Descrição**: Conteúdo da página inicial (uma por instituição)

**Campos**:

```typescript
{
  institution: relation<Institution> (required, unique)

  // Hero Section
  hero: component<HeroSection>

  // Banners Promocionais
  promotional_banners: component<PromotionalBanner>[] (max: 3)

  // Cursos em Destaque
  featured_courses_title: string            // "Encontre o seu curso e transforme sua carreira!"
  featured_courses: relation<CourseEnrichment>[] (max: 8)

  // Seção de Modalidades
  modalities_section: component<ModalitiesSection>

  // Áreas de Estudo
  areas_section: component<AreasSection>

  // Já sabe que área seguir?
  career_decision: component<CareerDecisionSection>

  // Formas de Ingresso
  entry_methods: component<EntryMethodsSection>

  // Cursos Mais Procurados
  popular_courses_title: string
  popular_courses: relation<CourseEnrichment>[] (max: 8)

  // Infraestrutura
  infrastructure_section: component<InfrastructureSection>

  // SEO
  seo: component<SEO>

  // Controle
  is_published: boolean (default: false)
  published_at: datetime
}
```

**API Endpoint**: `/api/home-pages?filters[institution][slug][$eq]=uninassau&populate=deep`

---

### 3.3 Course Enrichment (Collection Type)

**Descrição**: Conteúdo adicional para cursos (complementa dados da API externa)

**Campos**:

```typescript
{
  // Identificação
  course_id: string (unique, required)      // ID da API externa
  institution: relation<Institution> (required)

  // Conteúdo Rico
  description: richtext                     // "Sobre o curso"
  career_opportunities: richtext            // Oportunidades de carreira
  curriculum_highlights: richtext           // Destaques do currículo
  differentials: richtext                   // Diferenciais do curso

  // Mídia
  hero_image: media                         // Imagem principal
  hero_video_url: string                    // URL do vídeo (YouTube, Vimeo)
  gallery: media[]                          // Galeria de imagens

  // Relacionamentos
  related_courses: relation<CourseEnrichment>[] (max: 4)

  // SEO
  seo_title: string
  seo_description: text
  seo_keywords: string[]

  // Flags
  is_featured: boolean (default: false)     // Aparece na home?
  is_popular: boolean (default: false)      // Aparece em "mais procurados"?
  display_order: number                     // Ordem de exibição

  // Datas
  createdAt: datetime
  updatedAt: datetime
}
```

**Índices**:

- `course_id` (unique)
- `institution` + `is_featured`
- `institution` + `is_popular`

**API Endpoint**:

- `/api/course-enrichments?filters[course_id][$eq]=123&populate=*`
- `/api/course-enrichments?filters[institution][slug][$eq]=uninassau&filters[is_featured][$eq]=true`

---

### 3.4 Enrollment Process (Collection Type)

**Descrição**: Processos seletivos ativos

**Campos**:

```typescript
{
  // Identificação
  name: string (required)                   // "Processo Seletivo 2026.1"
  slug: string (required)                   // "processo-seletivo-2026-1"
  institution: relation<Institution> (required)

  // Período
  start_date: date (required)
  end_date: date (required)

  // Descrição
  description: richtext
  terms_and_conditions: richtext

  // Status
  is_active: boolean (default: true)

  // Datas
  createdAt: datetime
  updatedAt: datetime
}
```

**API Endpoint**: `/api/enrollment-processes?filters[institution][slug][$eq]=uninassau&filters[is_active][$eq]=true`

---

### 3.5 Lead Form Configuration (Single Type)

**Descrição**: Configuração global do formulário de leads

**Campos**:

```typescript
{
  // Campos Obrigatórios
  required_fields: JSON {
    personal_info: string[]                 // ["full_name", "email", "phone"]
    academic_info: string[]                 // ["has_enem", "when_to_start"]
    work_info: string[]                     // ["is_employed"]
  }

  // Perguntas Acadêmicas
  academic_questions: component<FormQuestion>[]

  // Perguntas de Trabalho
  work_questions: component<FormQuestion>[]

  // Mensagens
  success_message: richtext
  error_message: richtext

  // Privacy
  privacy_policy_url: string
  terms_of_use_url: string
}
```

---

## 4. Components

### 4.1 Contact

```typescript
{
  phone: string;
  whatsapp: string;
  email: string;
  address: text;
  support_hours: string; // "Seg-Sex: 8h às 18h"
}
```

### 4.2 Social Media

```typescript
{
  platform: enum ["Instagram", "Facebook", "Twitter", "LinkedIn", "YouTube", "TikTok"]
  url: string (required)
  icon: media (optional)
}
```

### 4.3 SEO

```typescript
{
  meta_title: string (max: 60)
  meta_description: text (max: 160)
  meta_keywords: string[]
  og_image: media
  og_title: string
  og_description: text
  canonical_url: string
  no_index: boolean (default: false)
  no_follow: boolean (default: false)
}
```

### 4.4 Hero Section

```typescript
{
  title: richtext (required)
  subtitle: richtext
  background_image: media (required)
  background_video_url: string
  cta_buttons: component<CTAButton>[] (max: 2)
  show_quick_search: boolean (default: true)
}
```

### 4.5 CTA Button

```typescript
{
  label: string (required)
  url: string
  variant: enum ["primary", "secondary", "outline"]
  icon: media
  opens_modal: boolean (default: false)
  modal_content: richtext                   // Se opens_modal = true
}
```

### 4.6 Promotional Banner

```typescript
{
  title: string(required);
  description: text;
  image: media(required);
  link: string;
  cta_text: string;
  background_color: string;
}
```

### 4.7 Modalities Section

```typescript
{
  title: string                             // "Nossas modalidades de Graduação"
  subtitle: text
  modalities: component<Modality>[] (fixed: 3)
}
```

### 4.8 Modality

```typescript
{
  type: enum ["Presencial", "Semipresencial", "EAD"]
  title: string
  description: text
  icon: media
  cta_text: string
  cta_url: string
}
```

### 4.9 Areas Section

```typescript
{
  title: string                             // "Já sabe que área seguir então busque o curso ideal"
  areas: component<StudyArea>[] (max: 8)
}
```

### 4.10 Study Area

```typescript
{
  name: string(required); // "Engenharia & Tecnologia"
  image: media(required);
  icon: media;
  courses_count: number; // Exibir "X cursos"
  filter_tag: string; // Tag usada no filtro de busca
}
```

### 4.11 Career Decision Section

```typescript
{
  title: string; // "Escolha o caminho que combina com você"
  graduation: component<PathOption>;
  post_graduation: component<PathOption>;
}
```

### 4.12 Path Option

```typescript
{
  title: string
  description: richtext
  icon: media
  badges: string[]                          // ["Presencial", "Semipresencial", "EAD"]
  cta_text: string
  cta_url: string
}
```

### 4.13 Entry Methods Section

```typescript
{
  title: string                             // "Conheça nossas formas de ingresso"
  subtitle: text
  methods: component<EntryMethod>[] (fixed: 4)
}
```

### 4.14 Entry Method

```typescript
{
  type: enum ["Vestibular", "ENEM", "Transferência", "Outro diploma"]
  title: string
  description: text
  icon: media
  cta_text: string
  cta_url: string
}
```

### 4.15 Infrastructure Section

```typescript
{
  title: string                             // "Conheça nossa infraestrutura"
  subtitle: text
  images: media[] (required, max: 6)
  cta_text: string
  cta_url: string
}
```

### 4.16 Form Question

```typescript
{
  field_name: string (required)             // "has_enem"
  label: string (required)                  // "Fez Enem?"
  field_type: enum ["text", "select", "radio", "date", "number"]
  options: JSON                             // Para select/radio
  placeholder: string
  validation_rules: JSON {
    required: boolean
    min_length?: number
    max_length?: number
    pattern?: string
  }
  help_text: text
}
```

---

## 5. Relações e Constraints

### 5.1 Diagrama de Relacionamentos

```
Institution (1) ──────< (1) Home Page
Institution (1) ──────< (N) Course Enrichment
Institution (1) ──────< (N) Enrollment Process

Course Enrichment (N) ───> (N) Course Enrichment (related_courses)
```

### 5.2 Constraints Importantes

1. **Institution.slug**: Deve ser lowercase, sem espaços, único
2. **Home Page**: Apenas uma por instituição (constraint no Strapi)
3. **Course Enrichment.course_id**: Único globalmente (índice unique)
4. **Enrollment Process**: Apenas um ativo por vez por instituição (validação no backend)

---

## 6. População de Dados (populate)

### 6.1 Estratégia de Populate

Para evitar over-fetching, definir níveis de populate:

**Nível 1 - Homepage**:

```
?populate[hero][populate]=*
&populate[promotional_banners][populate]=*
&populate[featured_courses][populate][seo]=*
&populate[modalities_section][populate]=*
&populate[areas_section][populate]=*
&populate[entry_methods][populate]=*
&populate[infrastructure_section][populate]=*
&populate[institution][populate][social_media]=*
&populate[seo]=*
```

**Nível 2 - Course Enrichment**:

```
?populate[hero_image]=*
&populate[gallery]=*
&populate[related_courses][populate][hero_image]=*
&populate[institution][populate][logo]=*
```

**Nível 3 - Institution**:

```
?populate[logo]=*
&populate[logo_footer]=*
&populate[favicon]=*
&populate[contact]=*
&populate[social_media]=*
&populate[default_seo]=*
```

### 6.2 Caching Strategy

1. **Homepage**: Cache de 5 minutos (pode ser invalidado manualmente)
2. **Course Enrichment**: Cache de 15 minutos
3. **Institution**: Cache de 1 hora
4. **Enrollment Process**: Cache de 5 minutos

Usar React Query com `staleTime` e `cacheTime` configurados:

```typescript
const { data } = useQuery({
  queryKey: ["home", institutionSlug],
  queryFn: () => fetchHomePage(institutionSlug),
  staleTime: 5 * 60 * 1000, // 5 minutos
  cacheTime: 10 * 60 * 1000, // 10 minutos
});
```

---

## 7. Permissões e Roles

### 7.1 Roles no Strapi

1. **Super Admin**: Acesso total
2. **Institution Admin**: Pode editar apenas conteúdo da sua instituição
3. **Content Editor**: Pode editar conteúdo, mas não publicar
4. **Viewer**: Apenas visualização

### 7.2 Filtros por Instituição

Implementar plugin de multi-tenancy no Strapi para filtrar automaticamente por instituição baseado no usuário logado.

---

## 8. Workflow de Publicação

### 8.1 Fluxo

```
Rascunho → Em Revisão → Aprovado → Publicado
```

### 8.2 Campos de Controle

Adicionar em cada collection type:

```typescript
{
  status: enum ["draft", "in_review", "approved", "published"]
  reviewed_by: relation<User>
  approved_by: relation<User>
  published_at: datetime
  scheduled_publish_at: datetime           // Para agendamento
}
```

---

## 9. Validações Customizadas

### 9.1 Lifecycle Hooks

Exemplos de validações no Strapi:

**beforeCreate/beforeUpdate - Course Enrichment**:

```javascript
// Validar que course_id existe na API externa
async beforeCreate(event) {
  const { data } = event.params;
  const courseExists = await externalAPI.checkCourse(data.course_id);
  if (!courseExists) {
    throw new Error('Course ID não existe na API externa');
  }
}
```

**beforeCreate - Home Page**:

```javascript
// Garantir apenas uma homepage por instituição
async beforeCreate(event) {
  const { data } = event.params;
  const existing = await strapi.db.query('api::home-page.home-page').findOne({
    where: { institution: data.institution }
  });
  if (existing) {
    throw new Error('Já existe uma homepage para esta instituição');
  }
}
```

---

## 10. Migrations e Seeds

### 10.1 Seed de Instituições

Criar arquivo `seeds/institutions.json`:

```json
[
  {
    "slug": "uninassau",
    "name": "UNINASSAU",
    "full_name": "Universidade Nassa",
    "theme_config": {
      "primary_color": "#003366",
      "secondary_color": "#FFD700"
    },
    "is_active": true
  },
  {
    "slug": "ung",
    "name": "UNG",
    "full_name": "Universidade Guarulhos",
    "theme_config": {
      "primary_color": "#006633",
      "secondary_color": "#FFCC00"
    },
    "is_active": true
  }
]
```

### 10.2 Script de Seed

```javascript
// scripts/seed.js
const institutions = require("./seeds/institutions.json");

async function seed() {
  for (const inst of institutions) {
    await strapi.db.query("api::institution.institution").create({
      data: inst,
    });
  }
}

seed();
```

---

## 11. API Response Examples

### 11.1 GET Home Page

**Request**:

```
GET /api/home-pages?filters[institution][slug][$eq]=uninassau&populate=deep
```

**Response**:

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "hero": {
        "title": "ÚLTIMA CHAMADA PARA GARANTIR SEU FUTURO",
        "subtitle": "VEM PRA INTELIGÊNCIA UNINASSAU AGORA",
        "background_image": {
          "data": {
            "attributes": {
              "url": "/uploads/hero_bg.jpg"
            }
          }
        },
        "cta_buttons": [
          {
            "label": "GRADUAÇÃO E EAD",
            "url": "/uninassau/cursos?degree_type=Graduação",
            "variant": "primary"
          }
        ]
      },
      "featured_courses": {
        "data": [
          {
            "id": 1,
            "attributes": {
              "course_id": "eng-civil-123",
              "description": "...",
              "hero_image": {
                "data": {
                  "attributes": {
                    "url": "/uploads/eng_civil.jpg"
                  }
                }
              }
            }
          }
        ]
      }
    }
  }
}
```

---

## 12. Checklist de Implementação

### Setup Inicial

- [ ] Criar projeto Strapi
- [ ] Configurar banco de dados (PostgreSQL recomendado)
- [ ] Instalar plugins necessários (Upload, SEO, etc.)
- [ ] Configurar CORS para frontend

### Collection Types

- [ ] Criar Institution (Single Type)
- [ ] Criar Home Page
- [ ] Criar Course Enrichment
- [ ] Criar Enrollment Process
- [ ] Criar Lead Form Configuration

### Components

- [ ] Criar todos os components listados na seção 4
- [ ] Validar campos e tipos
- [ ] Configurar media library

### Permissões

- [ ] Configurar roles e permissões
- [ ] Implementar multi-tenancy plugin
- [ ] Testar acesso por instituição

### Testes

- [ ] Popular dados de teste
- [ ] Testar populate queries
- [ ] Validar performance
- [ ] Testar workflow de publicação

### Deploy

- [ ] Configurar variáveis de ambiente
- [ ] Deploy em staging
- [ ] Treinar time de conteúdo
- [ ] Deploy em produção

---

**Última atualização**: 2025-11-07
**Versão**: 1.0
