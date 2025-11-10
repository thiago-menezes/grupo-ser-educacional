# Home Hero Feature

Seção hero da página inicial com carousel, formulário de busca rápida e conteúdo dinâmico.

## 📁 Estrutura

```
home-hero/
├── api/
│   ├── types.ts              # DTOs (Data Transfer Objects)
│   ├── query.ts              # Queries (fetch data)
│   └── mutation.ts           # Mutations (update/submit data)
├── carousel-controls/        # Componente: navegação do carousel
│   ├── index.tsx
│   ├── types.ts
│   └── styles.module.scss
├── hero-banner/              # Componente: imagem/banner do hero
│   ├── index.tsx
│   ├── types.ts
│   └── styles.module.scss
├── quick-search-form/        # Componente: formulário de busca
│   ├── index.tsx
│   ├── types.ts
│   └── styles.module.scss
├── constants.ts              # Constantes e configurações
├── hooks.ts                  # Custom hooks (carousel, form, animations)
├── index.tsx                 # Componente principal (entry point)
├── types.ts                  # Tipos globais da feature
├── utils.ts                  # Funções utilitárias
└── styles.module.scss        # Estilos do wrapper/container
```

## 🎯 Padrões de Componentes

### 1. **Estrutura Base de um Componente**

```typescript
// componente/index.tsx
import styles from './styles.module.scss';
import type { ComponentProps } from './types';

export function ComponentName({ prop1, prop2 }: ComponentProps) {
  return <div className={styles.container}>{/* ... */}</div>;
}

export type { ComponentProps };
```

### 2. **Types de Props**

```typescript
// componente/types.ts
export type ComponentProps = {
  // Propriedades obrigatórias
  requiredProp: string;
  // Propriedades opcionais com defaults
  optionalProp?: boolean;
  // Callbacks tipados
  onEvent?: (data: EventData) => void;
};
```

### 3. **Componentes do Design System**

Utilize **Reshaped** para componentes UI:
- `Button` - Botões com suporte a `icon`, `variant`, `color`, `size`
- `TextField` - Inputs de texto
- `Checkbox` - Checkboxes
- `FormControl` - Wrapper para erros e labels

```typescript
import { Button } from 'reshaped';
import { Icon } from '@/components/icon';

// ✅ Usar Icon do sistema
<Button icon={<Icon name="chevron-left" />} />

// ❌ NÃO usar SVGs inline
<Button><svg>...</svg></Button>
```

### 4. **Ícones**

Sempre use o componente `Icon` centralizado:

```typescript
import { Icon } from '@/components/icon';

// Sintaxe: <Icon name="icon-name" />
<Icon name="chevron-left" />      // Ícone padrão
<Icon name="school" />            // School icon
<Icon name="briefcase" />         // Briefcase icon
<Icon name="chevron-right" />     // Chevron right
```

## 🏗️ Padrões de Tipos

### HeroContent (Tipo Global da Feature)

```typescript
export type HeroContent = {
  backgroundImage?: HeroBannerImage;     // Imagem do hero
  showCarouselControls?: boolean;        // Mostrar/ocultar carousel
  showQuickSearch?: boolean;             // Mostrar/ocultar formulário
};
```

Sempre incluir `showCarouselControls` e `showQuickSearch` ao retornar dados da API.

### QuickSearchFormData (Dados do Formulário)

```typescript
export type QuickSearchFormData = {
  city: string;                                    // Cidade
  course: string;                                  // Curso
  modalities: Array<'presencial' | 'semi' | 'ead'>; // Modalidades
  courseLevel: 'graduation' | 'postgraduate';     // Nível do curso
};
```

Quando enviar dados de busca, **sempre incluir `courseLevel`**.

## 🎨 Padrões de Estilo

- **CSS Modules** para escopo local (`styles.module.scss`)
- **Design tokens Reshaped** para cores, espacamento, etc:
  - Cores: `var(--rs-color-background-primary)`, `var(--rs-color-brand)`
  - Espaçamento: `var(--rs-unit-x3)`, `var(--rs-unit-x4)` (múltiplos de 4px)
  - Border radius: `var(--rs-radius-small)`, `var(--rs-radius-medium)`, `var(--rs-radius-large)`
  - Durações: `var(--rs-duration-medium)`, `var(--rs-easing-standard)`

### Breakpoints

```scss
$breakpoint-tablet: 768px;
$breakpoint-desktop: 1024px;

@media (min-width: $breakpoint-tablet) { /* ... */ }
@media (min-width: $breakpoint-desktop) { /* ... */ }
```

## ✅ Checklist para Novos Componentes

- [ ] Criar pasta `componente/` com `index.tsx`, `types.ts`, `styles.module.scss`
- [ ] Exportar tipo de props: `export type { ComponentProps }`
- [ ] Usar Design tokens (cores, espaçamento, etc)
- [ ] Implementar acessibilidade: `aria-label`, `aria-hidden` onde apropriado
- [ ] Adicionar comentários para lógica complexa
- [ ] Componentes UI devem usar Reshaped, não custom HTML buttons
- [ ] Ícones devem usar `Icon` component, não SVGs inline
- [ ] Responsividade com mobile-first approach

## 🚫 Anti-Padrões (NÃO FAZER)

```typescript
// ❌ SVGs inline/hardcoded
<svg><polyline points="..." /></svg>

// ✅ Usar Icon component
<Icon name="chevron-left" />

// ❌ Buttons customizados
<button className={styles.custom}>Click</button>

// ✅ Usar Reshaped Button
<Button icon={<Icon name="..." />}>Click</Button>

// ❌ Props sem tipos
export function Component(props) { }

// ✅ Props com interface
export function Component(props: ComponentProps) { }

// ❌ Classes globais
<div className="container">...</div>

// ✅ CSS Modules
<div className={styles.container}>...</div>

// ❌ courseLevel sem documentação
const searchData = { city, course, modalities };

// ✅ Incluir courseLevel
const searchData = { city, course, modalities, courseLevel };
```

## 📝 Convenções de Nomenclatura

- **Componentes**: PascalCase (`CarouselControls`, `QuickSearchForm`)
- **Tipos**: `ComponentNameProps`, `ComponentNameData`
- **Hooks**: `useComponentLogic`, `useFormState`
- **Constantes**: `UPPER_SNAKE_CASE` (`DEFAULT_HERO_CONTENT`, `CAROUSEL_CONFIG`)
- **Classes CSS**: `camelCase` (`.container`, `.arrowButton`, `.active`)
- **Arquivos**: match component name (`carousel-controls/index.tsx`)

## 🔄 Renderização Condicional

Sempre verificar flags da API antes de renderizar componentes opcionais:

```typescript
{content.showCarouselControls && <CarouselControls {...props} />}
{content.showQuickSearch && <QuickSearchForm {...props} />}
```

Isso permite controlar visibilidade via CMS/API sem mudanças de código.

---

**Nota**: Documentação de API (queries e mutations) será adicionada em breve com padrões definidos.
