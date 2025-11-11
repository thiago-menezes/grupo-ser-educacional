# Padrões de Escrita de Código

Documentação dos padrões de escrita utilizados no projeto.

## 📦 Estrutura de Componentes React

### Arquivo Principal (index.tsx)

```typescript
// 1. Imports de React/Next (alfabético)
import { useCallback, useEffect, useRef } from 'react';

// 2. Imports de bibliotecas externas (alfabético)
import { Button } from 'reshaped';

// 3. Imports de componentes locais (alfabético)
import { Icon } from '@/components/icon';
import { HeroBanner } from './hero-banner';

// 4. Imports de estilos
import styles from './styles.module.scss';

// 5. Imports de tipos
import type { ComponentProps } from './types';

// Componente
export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // lógica do componente
  return <div className={styles.container}>{/* conteúdo */}</div>;
}

// 6. Export do tipo no final
export type { ComponentProps };
```

**Ordem de importações:**
1. React/Next built-ins
2. Bibliotecas externas (node_modules)
3. Componentes locais
4. Estilos (`.module.scss`)
5. Tipos (`type`)

### Tipos de Props (types.ts)

```typescript
// Sempre nomear: ComponentNameProps
export type ComponentNameProps = {
  // Propriedades obrigatórias primeiro
  requiredProp: string;
  requiredNumber: number;

  // Propriedades opcionais com defaults documentados
  optionalProp?: boolean;
  optionalWithDefault?: string; // default: 'value'

  // Callbacks no final
  onClick?: () => void;
  onEvent?: (data: EventData) => void;
};

// DTOs/tipos de dados séparadamente
export type EventData = {
  id: string;
  timestamp: Date;
};
```

### Estilos (styles.module.scss)

```scss
// Sempre CSS Modules (não global CSS)
.container {
  display: flex;
  padding: var(--rs-unit-x4);
  border-radius: var(--rs-radius-medium);
  background: var(--rs-color-background-primary);
}

// Classes filhas com underscore ou aninhamento
.container {
  &:hover {
    background: var(--rs-color-foreground-primary);
  }
}

// Estados separados com .active, .disabled, etc
.button {
  &.active {
    background: var(--rs-color-brand);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

// Responsividade com mobile-first
.button {
  width: 36px;
  height: 36px;

  @media (min-width: 768px) {
    width: 40px;
    height: 40px;
  }

  @media (min-width: 1024px) {
    width: 44px;
    height: 44px;
  }
}
```

---

## 🎨 Design System & Componentes UI

### Reshaped Components

Use componentes do Reshaped ao invés de HTML customizado:

```typescript
// ✅ CORRETO
import { Button } from 'reshaped';
<Button
  icon={<Icon name="chevron-left" />}
  variant="solid"
  color="primary"
  size="large"
/>

// ❌ ERRADO
<button className={styles.custom}>Click</button>
```

### Icon Component

Sempre use o componente `Icon` centralizado, nunca SVGs inline:

```typescript
// ✅ CORRETO
import { Icon } from '@/components/icon';
<Icon name="chevron-left" />
<Icon name="school" />
<Icon name="briefcase" />

// ❌ ERRADO
<svg><polyline points="..." /></svg>
```

---

## 🔤 Convenções de Nomenclatura

### Componentes
```typescript
// ✅ CORRETO - Use const com arrow function
export const ComponentName = () => { }
// Arquivo: component-name/index.tsx

// ❌ ERRADO - Não use function declaration
export function ComponentName() { }
```

### Tipos
```typescript
// ✅ CORRETO - Todos os tipos devem estar em types.ts
// Arquivo: types.ts
export type ComponentNameProps = { }
export type ComponentNameData = { }
export type CourseLevel = 'graduation' | 'postgraduate';

// ❌ ERRADO - NUNCA defina tipos dentro do arquivo do componente
// Arquivo: index.tsx
type ComponentNameProps = { } // ❌ ERRADO!
```

**Regra importante**: Todos os tipos TypeScript devem ser definidos no arquivo `types.ts` do feature, nunca dentro do arquivo do componente (`index.tsx`). Isso inclui:
- Props types (`ComponentNameProps`)
- Data types (`ComponentNameData`)
- Enums e unions
- Qualquer outro tipo exportado ou usado pelo componente

### Constantes
```typescript
// UPPER_SNAKE_CASE
export const DEFAULT_HERO_CONTENT = { };
export const CAROUSEL_CONFIG = { };
export const HOME_HERO_QUERY_KEY = ['home-hero'] as const;
```

### Classes CSS
```scss
// camelCase
.container { }
.arrowButton { }
.dot { }
.active { } // estado
.disabled { } // estado
```

### Variáveis/Funções
```typescript
// camelCase
const currentSlide = 0;
function handleKeyDown() { }
const buildSearchParams = () => { };
```

### Hooks Customizados
```typescript
// useFeatureName
export function useHeroCarousel() { }
export function useQuickSearchForm() { }
```

---

## 📋 Tipos & Interfaces

### Props Sempre Tipadas

```typescript
// ✅ CORRETO
function Component({ name, age }: { name: string; age: number }) { }

// Ou melhor ainda:
function Component(props: ComponentProps) { }
```

### Tipos de Dados (DTOs)

Para dados vindos da API, prefixe com `DTO`:

```typescript
// api/types.ts
export type HeroPageDTO = {
  id: string;
  attributes: {
    title: string;
    backgroundImage: HeroImageDTO;
  };
};

// types.ts - tipos internos da feature (sem DTO)
export type HeroContent = {
  backgroundImage?: HeroBannerImage;
  showCarouselControls?: boolean;
};
```

---

## 🎯 Padrões de Renderização

### Renderização Condicional

Use operador `&&` para renderização simples:

```typescript
// ✅ CORRETO
{content.showCarouselControls && (
  <CarouselControls {...props} />
)}

// Para lógica mais complexa, use função:
function renderCarousel() {
  if (!content.showCarouselControls) return null;
  if (isLoading) return <Skeleton />;
  return <CarouselControls {...props} />;
}
```

### Listas com .map()

Sempre use `key` adequado (nunca index se lista pode mudar):

```typescript
// ✅ CORRETO
{slides.map((slide) => (
  <SlideCard key={slide.id} slide={slide} />
))}

// ❌ ERRADO
{slides.map((slide, index) => (
  <SlideCard key={index} slide={slide} />
))}
```

---

## ♿ Acessibilidade

### ARIA Labels

```typescript
// ✅ CORRETO
<button
  aria-label="Previous slide (or press ← arrow)"
  onClick={onPrevious}
/>

// ✅ Para ícones
<Icon name="chevron-left" aria-hidden="true" />
```

### Títulos & Hints

```typescript
// ✅ CORRETO - aria-label inclui hint de keyboard
<button aria-label="Search (press Enter to submit)" />

// ✅ Use title para contexto adicional
<input title="Enter at least one search term" />
```

### Semântica HTML

```typescript
// ✅ CORRETO
<button type="button">Click me</button>
<form onSubmit={handleSubmit}>
  <input type="text" />
  <button type="submit">Send</button>
</form>

// ❌ ERRADO
<div onClick={handleClick}>Click me</div>
```

---

## 🔄 Hooks Customizados

### Padrão

```typescript
// hooks.ts
export function useHeroCarousel(totalSlides: number = 1) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    // Setup/cleanup
    return () => {
      // Cleanup
    };
  }, [dependencies]);

  return {
    currentSlide,
    nextSlide,
    // ... mais propriedades
  };
}
```

### Return Type

Sempre retornar objeto com propriedades nomeadas, não array:

```typescript
// ✅ CORRETO
return { currentSlide, nextSlide, previousSlide };

// ❌ ERRADO
return [currentSlide, nextSlide, previousSlide];
```

---

## 🎨 Design Tokens (Reshaped)

### Cores

```scss
var(--rs-color-brand)                    // Primary brand color
var(--rs-color-background-primary)      // Background
var(--rs-color-foreground-primary)      // Foreground/text
var(--rs-color-background-page)         // Page background
var(--rs-color-white)                   // White
var(--rs-color-rgb-background-primary)  // RGB version (para rgba())
```

### Espaçamento

```scss
var(--rs-unit-x1)   // 4px
var(--rs-unit-x2)   // 8px
var(--rs-unit-x3)   // 12px
var(--rs-unit-x4)   // 16px
var(--rs-unit-x5)   // 20px
var(--rs-unit-x6)   // 24px
```

### Border Radius

```scss
var(--rs-radius-small)     // 4px
var(--rs-radius-medium)    // 8px
var(--rs-radius-large)     // 12px
```

### Duração & Easing

```scss
var(--rs-duration-medium)      // ~200-300ms
var(--rs-easing-standard)      // cubic-bezier padrão
```

---

## 📊 Conditional Content with Flags

Quando a API controla visibilidade de componentes:

```typescript
// types.ts
export type FeatureContent = {
  backgroundImage?: Image;
  showCarousel?: boolean;        // Feature flag
  showQuickSearch?: boolean;     // Feature flag
};

// Sempre checar antes de renderizar
{content.showCarousel && <Carousel {...props} />}
{content.showQuickSearch && <QuickSearch {...props} />}
```

---

## ❌ Anti-Padrões (NÃO FAZER)

```typescript
// ❌ SVGs inline/hardcoded
<svg><polyline points="..." /></svg>

// ❌ Components UI sem design system
<button className={styles.custom}>Click</button>

// ❌ Props sem tipos
function Component(props) { }

// ❌ Classes globais (sem CSS Modules)
<div className="container">...</div>

// ❌ Props desestruturadas sem type
function ({ a, b, c }) { }

// ❌ Keys com index em listas
{items.map((item, index) => <Item key={index} />)}

// ❌ Magic numbers em estilos/código
padding: 16px;  // use var(--rs-unit-x4)
width: 300px;   // use constantes

// ❌ Renderização complexa inline
{isLoading ? <div>Loading...</div> : isError ? <div>Error</div> : <Content />}
// Use funções helper ao invés
```

---

## 📝 Comentários

Adicione comentários apenas para lógica complexa ou não-óbvia:

```typescript
// ✅ BOM - explica o "por quê"
// Modulo aritmético garante wrap-around quando chegar no fim
setCurrentSlide((prev) => (prev + 1) % totalSlides);

// ✅ BOM - explica comportamento não-intuitivo
// Pausar auto-advance quando usuário interage manualmente
onToggleAutoAdvance?.(false);

// ❌ RUIM - óbvio demais
// Incrementar contador
count++;

// ❌ RUIM - comentários desatualizados são peores que nenhum
// TODO: fix bug (há 2 anos atrás)
```

---

## 🔍 Type Safety

### Evite `any`

```typescript
// ❌ ERRADO
function handle(data: any) { }

// ✅ CORRETO
function handle(data: SearchData) { }
```

### Use Union Types

```typescript
// ✅ CORRETO
type CourseLevel = 'graduation' | 'postgraduate';

// ❌ ERRADO
type CourseLevel = string;
```

### Nullish Coalescing

```typescript
// ✅ CORRETO - para valores que podem ser false, 0, ''
showCarousel ?? true

// ❌ ERRADO - pega também valores falsos válidos
showCarousel || true
```

---

## 📤 Exports

Sempre exporte tipos publicamente:

```typescript
// ✅ CORRETO
export function Component(props: ComponentProps) { }
export type { ComponentProps };

// Permite: import type { ComponentProps } from './component'
```

---

## 🚀 Resumo Rápido

| Item | Padrão |
|------|--------|
| **Componentes** | PascalCase, arquivo kebab-case |
| **Tipos de Props** | `ComponentNameProps` |
| **Dados** | `ComponentNameData` |
| **Constantes** | `UPPER_SNAKE_CASE` |
| **Funções** | `camelCase` |
| **Classes CSS** | `camelCase` |
| **Estilo** | CSS Modules, design tokens |
| **UI Components** | Reshaped (não custom HTML) |
| **Ícones** | `Icon` component (não SVGs) |
| **Renderização** | Condicional com `&&` |
| **Acessibilidade** | ARIA labels, semântica HTML |
| **Hooks** | `useFeatureName` |
