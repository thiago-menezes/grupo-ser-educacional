# Arquitetura Multi-Tenant - Grupo SER CMS

## Visão Geral da Estrutura

```
┌─────────────────────────────────────────────────────────────────┐
│                         STRAPI CMS                              │
│                      (Single Instance)                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ▼                                           ▼
┌───────────────┐                          ┌───────────────┐
│  Institution  │◄─────────────────────────│     Course    │
│               │     many-to-one          │               │
│  • name       │                          │  • name       │
│  • slug       │                          │  • price      │
│  • code       │                          │  • sector     │
│  • logo       │                          │  • level      │
│  • colors     │                          │  • modality   │
└───────┬───────┘                          └───────────────┘
        │
        │ one-to-many
        │
        ▼
┌───────────────┐
│ Page Content  │
│               │
│  • title      │
│  • category   │
│  • blocks     │
│  • order      │
└───────────────┘
```

## Fluxo de Dados

### 1. Admin Panel (Gestão de Conteúdo)

```
Admin User
    │
    ├─► Cria 7 Instituições
    │   └─► Cada uma com: slug único, code único, logo, cores
    │
    ├─► Cria Cursos
    │   └─► Vincula cada curso a UMA instituição
    │
    └─► Cria Conteúdos de Página
        └─► Vincula cada conteúdo a UMA instituição
        └─► Define categoria (home-hero, about-mission, etc)
```

### 2. Frontend (Consumo de Dados)

```
Frontend App
    │
    │ ENV: INSTITUTION_SLUG=faculdade-exemplo
    │
    ├─► GET /api/institutions?filters[slug][$eq]=faculdade-exemplo
    │   └─► Retorna: logo, cores, nome → aplicar branding
    │
    ├─► GET /api/courses?filters[institution][slug][$eq]=faculdade-exemplo
    │   └─► Retorna: apenas cursos desta instituição
    │
    └─► GET /api/page-contents?filters[institution][slug][$eq]=faculdade-exemplo
                                &filters[category][$eq]=home-hero
        └─► Retorna: conteúdo do hero específico desta instituição
```

## Exemplo Prático

### Cenário: 3 Instituições

```
┌──────────────────┬──────────────────┬──────────────────┐
│  Faculdade Tech  │  Instituto Saúde │  Escola Gestão   │
│  slug: fac-tech  │  slug: inst-saude│  slug: esc-gestao│
│  code: FT        │  code: IS        │  code: EG        │
├──────────────────┼──────────────────┼──────────────────┤
│  Cursos:         │  Cursos:         │  Cursos:         │
│  • Web Dev       │  • Enfermagem    │  • MBA Executivo │
│  • Data Science  │  • Nutrição      │  • Adm Empresas  │
│  • UX Design     │  • Fisioterapia  │  • Marketing     │
├──────────────────┼──────────────────┼──────────────────┤
│  Conteúdo:       │  Conteúdo:       │  Conteúdo:       │
│  home-hero:      │  home-hero:      │  home-hero:      │
│    "Tecnologia   │    "Cuidar de    │    "Lidere o     │
│     do Futuro"   │     Vidas"       │     Mercado"     │
└──────────────────┴──────────────────┴──────────────────┘
```

### Query Examples

**Site da Faculdade Tech:**

```javascript
// .env
INSTITUTION_SLUG = fac - tech;

// Retorna apenas cursos da Faculdade Tech
fetch("/api/courses?filters[institution][slug][$eq]=fac-tech");
// → Web Dev, Data Science, UX Design

// Retorna hero específico da Faculdade Tech
fetch(
  "/api/page-contents?filters[institution][slug][$eq]=fac-tech&filters[category][$eq]=home-hero",
);
// → "Tecnologia do Futuro"
```

**Site do Instituto Saúde:**

```javascript
// .env
INSTITUTION_SLUG = inst - saude;

// Retorna apenas cursos do Instituto Saúde
fetch("/api/courses?filters[institution][slug][$eq]=inst-saude");
// → Enfermagem, Nutrição, Fisioterapia

// Retorna hero específico do Instituto Saúde
fetch(
  "/api/page-contents?filters[institution][slug][$eq]=inst-saude&filters[category][$eq]=home-hero",
);
// → "Cuidar de Vidas"
```

## Estrutura de Arquivos Criada

```
src/api/
├── institution/
│   ├── content-types/
│   │   └── institution/
│   │       └── schema.json         ← Definição do modelo
│   ├── controllers/
│   │   └── institution.ts          ← Handlers de requisição
│   ├── services/
│   │   └── institution.ts          ← Lógica de negócio
│   └── routes/
│       └── institution.ts          ← Rotas da API
│
├── course/
│   ├── content-types/
│   │   └── course/
│   │       └── schema.json         ← Definição com relation para institution
│   ├── controllers/
│   │   └── course.ts
│   ├── services/
│   │   └── course.ts
│   └── routes/
│       └── course.ts
│
└── page-content/
    ├── content-types/
    │   └── page-content/
    │       └── schema.json         ← Definição com categories e relation
    ├── controllers/
    │   └── page-content.ts
    ├── services/
    │   └── page-content.ts
    └── routes/
        └── page-content.ts
```

## Benefícios da Arquitetura

### ✅ Isolamento de Dados

- Cada instituição tem seus próprios cursos e conteúdos
- Impossível misturar dados entre instituições acidentalmente
- Queries sempre filtram por instituição

### ✅ Branding Personalizado

- Logo único por instituição
- Cores primária/secundária configuráveis
- Frontend aplica branding dinamicamente

### ✅ Gestão Centralizada

- Um único painel admin para tudo
- Equipe pode gerenciar múltiplas instituições
- Atualizações de código beneficiam todas

### ✅ Escalabilidade

- Adicionar 8ª, 9ª instituição é trivial
- Sem duplicação de infraestrutura
- Performance não degrada com mais instituições

### ✅ Flexibilidade de Conteúdo

- Cada instituição customiza livremente
- Categorias pré-definidas mantêm consistência
- Dynamic zones permitem layouts únicos

## Categorias de Page Content

```
Homepage
├── home-hero           → Banner principal
├── home-about          → Seção sobre a instituição
├── home-courses        → Showcase de cursos
├── home-testimonials   → Depoimentos
└── home-cta            → Calls-to-action

Página Sobre
├── about-hero          → Banner da página
├── about-mission       → Missão/visão
└── about-team          → Equipe/professores

Outros
├── contact-info        → Informações de contato
├── footer              → Rodapé
└── custom              → Conteúdo livre
```

## Campos de Course (Detalhamento)

### Informações Básicas

- `name`: Nome do curso
- `slug`: URL-friendly identifier
- `description`: Descrição curta (para cards)
- `detailedDescription`: Descrição longa (página do curso)

### Dados Acadêmicos

- `curriculum`: Grade curricular completa (rich text)
- `workload`: Carga horária em horas
- `duration`: Duração textual ("2 anos", "360h")
- `sector`: Área do conhecimento
- `level`: Nível acadêmico
- `modality`: Formato de ensino

### Comercial

- `price`: Valor do curso
- `enrollmentOpen`: Matrícula disponível?
- `featured`: Destacar na home?

### Mídia

- `coverImage`: Imagem principal
- `gallery`: Galeria de fotos

### Relação

- `institution`: Vínculo com instituição (obrigatório via UI)

## Próximos Passos Recomendados

1. **Criar Seed Data** para popular 7 instituições de exemplo
2. **Configurar CORS** para permitir acesso do frontend
3. **Criar Custom Endpoint** `/api/institution-data/:slug` que retorna tudo de uma instituição
4. **Adicionar Validações** para evitar conteúdo duplicado
5. **Implementar Search** com Strapi's search functionality
6. **Adicionar Analytics** para tracking por instituição
7. **Configurar CDN** para otimizar entrega de imagens
8. **Implementar Cache** com Redis para performance
