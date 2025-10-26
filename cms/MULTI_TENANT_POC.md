# POC - Multi-Tenant CMS para Grupo SER

## Objetivo

Gerenciar conteúdo de **7 instituições educacionais** em um único CMS Strapi, permitindo que sites frontend filtrem dados por instituição via variável de ambiente.

## Arquitetura

### Modelo de Dados

```
Institution (base)
├── courses (1:N)
└── page-contents (1:N)
```

### Content Types Criados

#### 1. Institution (Instituição)
Representa cada instituição do Grupo SER.

**Campos principais:**
- `name` (string, único, obrigatório) - Nome da instituição
- `slug` (uid, obrigatório) - Identificador URL-friendly (auto-gerado)
- `code` (string, único, obrigatório) - Código curto (ex: "FEX", "UNI")
- `description` (text) - Descrição da instituição
- `logo` (media - imagem) - Logotipo
- `website` (string) - URL do site
- `primaryColor` (string) - Cor primária da marca (formato hex: #RRGGBB)
- `secondaryColor` (string) - Cor secundária da marca
- `active` (boolean, default: true) - Instituição ativa/inativa

#### 2. Course (Curso)
Cursos oferecidos por cada instituição.

**Campos principais:**
- `name` (string, obrigatório) - Nome do curso
- `slug` (uid) - Identificador URL-friendly
- `description` (text) - Descrição curta
- `detailedDescription` (richtext) - Descrição detalhada
- `price` (decimal) - Valor do curso
- `duration` (string) - Duração (ex: "2 anos", "360 horas")
- `curriculum` (richtext) - Grade curricular detalhada
- `coverImage` (media - imagem) - Imagem de capa
- `gallery` (media - múltiplas imagens) - Galeria de fotos
- `workload` (integer) - Carga horária total em horas
- `enrollmentOpen` (boolean) - Matrícula aberta
- `featured` (boolean) - Curso em destaque
- `institution` (relation - many-to-one) - **Instituição vinculada**

**Enumerações:**
- `sector`: saude | tecnologia | gestao | educacao | direito | engenharia | outros
- `level`: tecnico | graduacao | pos-graduacao | extensao | curso-livre
- `modality`: presencial | ead | hibrido

**Draft & Publish:** ✅ Habilitado

#### 3. Page Content (Conteúdo de Página)
Blocos de conteúdo flexíveis para diferentes seções do site, organizados por categoria.

**Campos principais:**
- `title` (string, obrigatório) - Título do conteúdo
- `slug` (uid) - Identificador URL-friendly
- `category` (enumeration, obrigatório) - Categoria do conteúdo
- `order` (integer, default: 0) - Ordem de exibição
- `blocks` (dynamic zone) - Blocos de conteúdo dinâmico
- `metadata` (json) - Metadados adicionais flexíveis
- `active` (boolean) - Conteúdo ativo/inativo
- `institution` (relation - many-to-one) - **Instituição vinculada**

**Categorias disponíveis:**
- `home-hero` - Hero da homepage
- `home-about` - Seção sobre na homepage
- `home-courses` - Showcase de cursos na homepage
- `home-testimonials` - Depoimentos de alunos
- `home-cta` - Call-to-actions
- `about-hero` - Hero da página sobre
- `about-mission` - Missão/visão
- `about-team` - Equipe/professores
- `contact-info` - Informações de contato
- `footer` - Conteúdo do rodapé
- `custom` - Conteúdo customizado

**Blocos dinâmicos disponíveis:**
- `shared.media` - Upload de mídia única
- `shared.quote` - Citações
- `shared.rich-text` - Texto rico
- `shared.slider` - Carrossel de imagens

**Draft & Publish:** ✅ Habilitado

## Como Usar

### 1. Acessar o Admin Panel

```bash
npm run dev
```

Acesse: http://localhost:1337/admin

Na primeira execução, será necessário criar um usuário administrador.

### 2. Cadastrar Instituições

1. Vá em **Content Manager** > **Institution**
2. Clique em **Create new entry**
3. Preencha os dados:
   - Name: "Faculdade de Exemplo"
   - Code: "FEX" (único para cada instituição)
   - Description, logo, cores, etc.
4. Salve

Repita para as 7 instituições.

### 3. Criar Cursos

1. Vá em **Content Manager** > **Course**
2. Clique em **Create new entry**
3. Preencha os dados do curso
4. **Importante:** Selecione a instituição no campo `institution`
5. Configure sector, level, modality
6. Adicione preço, carga horária, grade curricular
7. Salve como rascunho ou **Publish** para publicar

### 4. Criar Conteúdos de Página

1. Vá em **Content Manager** > **Page Content**
2. Clique em **Create new entry**
3. Escolha a categoria (ex: `home-hero`)
4. **Importante:** Selecione a instituição no campo `institution`
5. Adicione blocos dinâmicos conforme necessário
6. Configure a ordem de exibição (campo `order`)
7. Salve e publique

**Exemplo:** Para criar o hero da homepage de cada instituição:
- Crie 7 entries com categoria `home-hero`
- Cada uma vinculada a uma instituição diferente
- Use blocos `rich-text` ou `media` para conteúdo

### 5. Configurar Permissões Públicas

Para que o frontend possa consumir os dados:

1. Vá em **Settings** > **Users & Permissions Plugin** > **Roles** > **Public**
2. Expanda cada content type:
   - **Institution:** ✅ find, findOne
   - **Course:** ✅ find, findOne
   - **Page Content:** ✅ find, findOne
3. Salve

## Integração com Frontend

### Exemplo: Next.js/React

```javascript
// .env.local
NEXT_PUBLIC_INSTITUTION_SLUG=faculdade-exemplo
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

```javascript
// lib/strapi.js
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const INSTITUTION_SLUG = process.env.NEXT_PUBLIC_INSTITUTION_SLUG;

export async function getCourses() {
  const res = await fetch(
    `${STRAPI_URL}/api/courses?` +
    `filters[institution][slug][$eq]=${INSTITUTION_SLUG}&` +
    `filters[publishedAt][$notNull]=true&` +
    `populate=*`
  );
  return res.json();
}

export async function getHomeHero() {
  const res = await fetch(
    `${STRAPI_URL}/api/page-contents?` +
    `filters[institution][slug][$eq]=${INSTITUTION_SLUG}&` +
    `filters[category][$eq]=home-hero&` +
    `filters[active][$eq]=true&` +
    `populate=deep&` +
    `sort=order:asc`
  );
  return res.json();
}

export async function getInstitution() {
  const res = await fetch(
    `${STRAPI_URL}/api/institutions?` +
    `filters[slug][$eq]=${INSTITUTION_SLUG}&` +
    `populate=logo`
  );
  const data = await res.json();
  return data.data[0];
}

export async function getFeaturedCourses() {
  const res = await fetch(
    `${STRAPI_URL}/api/courses?` +
    `filters[institution][slug][$eq]=${INSTITUTION_SLUG}&` +
    `filters[featured][$eq]=true&` +
    `filters[enrollmentOpen][$eq]=true&` +
    `populate=*`
  );
  return res.json();
}
```

### Queries Úteis

```
# Todos os cursos de uma instituição
GET /api/courses?filters[institution][slug][$eq]=faculdade-exemplo&populate=*

# Cursos em destaque abertos para matrícula
GET /api/courses?filters[institution][slug][$eq]=faculdade-exemplo&filters[featured][$eq]=true&filters[enrollmentOpen][$eq]=true&populate=*

# Cursos por setor
GET /api/courses?filters[institution][slug][$eq]=faculdade-exemplo&filters[sector][$eq]=saude&populate=*

# Hero da homepage
GET /api/page-contents?filters[institution][slug][$eq]=faculdade-exemplo&filters[category][$eq]=home-hero&populate=deep

# Dados da instituição com logo
GET /api/institutions?filters[slug][$eq]=faculdade-exemplo&populate=logo

# Conteúdos de uma categoria ordenados
GET /api/page-contents?filters[institution][slug][$eq]=faculdade-exemplo&filters[category][$eq]=home-testimonials&sort=order:asc&populate=deep
```

## Vantagens desta Abordagem

✅ **Single Source of Truth** - Um único CMS para todas as instituições
✅ **Fácil Manutenção** - Atualizações de código afetam todas as instituições
✅ **Escalável** - Adicionar novas instituições é trivial
✅ **Flexível** - Cada instituição tem conteúdo totalmente customizável
✅ **Branding Separado** - Cores e logos únicos por instituição
✅ **Custo Reduzido** - Uma infraestrutura para 7 instituições
✅ **Categorização Clara** - Page contents com categorias pré-definidas
✅ **Dynamic Zones** - Conteúdo flexível com blocos reutilizáveis

## Próximos Passos

1. **Seed Script** - Criar script para popular dados de exemplo das 7 instituições
2. **Custom Endpoints** - Criar endpoints customizados se necessário (ex: `/api/institution-content/:slug`)
3. **Middleware de Filtro** - Considerar middleware global para auto-filtrar por instituição
4. **Admin UI Customization** - Melhorar UX do admin para facilitar seleção de instituição
5. **Validações** - Adicionar validações customizadas (ex: não permitir cursos duplicados por instituição)
6. **Multi-idioma** - Considerar internacionalização se necessário

## Documentação Adicional

- Ver [CLAUDE.md](./CLAUDE.md) para detalhes completos da arquitetura
- [Strapi Filtering](https://docs.strapi.io/dev-docs/api/rest/filters-locale-publication)
- [Strapi Relations](https://docs.strapi.io/dev-docs/backend-customization/models#relations)
