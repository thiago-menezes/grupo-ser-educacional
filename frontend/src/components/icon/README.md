# Icon Component

Componente de ícone reutilizável usando Tabler Icons, uma biblioteca de ícones de alta qualidade.

## Instalação

O CSS do Tabler Icons é carregado automaticamente via CDN no `src/app/layout.tsx`.

## Uso Básico

```tsx
import { Icon } from '@/components/icon';

export function Example() {
  return (
    <div>
      {/* Ícone simples */}
      <Icon name="menu" />

      {/* Ícone com tamanho customizado */}
      <Icon name="x" size={32} />

      {/* Ícone preenchido */}
      <Icon name="star" filled />

      {/* Combinando propriedades */}
      <Icon name="check-circle" size={20} filled />

      {/* Com className customizada */}
      <Icon name="arrow-right" className="custom-class" />
    </div>
  );
}
```

## Propriedades

| Propriedade | Tipo | Padrão | Descrição |
|---|---|---|---|
| `name` | `string` | Obrigatório | Nome do ícone Tabler (sem prefixo `ti-`) |
| `size` | `number \| string` | `24` | Tamanho do ícone em pixels, rem, etc |
| `filled` | `boolean` | `false` | Se o ícone deve ser preenchido (solid) |
| `className` | `string` | - | Classes CSS adicionais |
| `style` | `CSSProperties` | - | Estilos inline |

## Herança de Cores

O componente herda a cor do elemento pai via `currentColor`:

```tsx
import { Icon } from '@/components/icon';

export function ColorExample() {
  return (
    <div>
      {/* Herda a cor vermelha */}
      <span style={{ color: 'red' }}>
        <Icon name="heart" filled />
      </span>

      {/* Herda a cor através de classe */}
      <a className="text-blue-500">
        <Icon name="arrow-right" />
      </a>

      {/* Com Tailwind */}
      <span className="text-green-500">
        <Icon name="star" filled />
      </span>
    </div>
  );
}
```

## Ícones Disponíveis

Veja a lista completa de ícones em: https://tabler.io/icons

### Exemplos Comuns

- `menu` - Menu sanduíche (hamburguer)
- `x` - Fechar (X)
- `arrow-right` - Seta para a direita
- `arrow-left` - Seta para a esquerda
- `chevron-down` - Chevron para baixo
- `user` - Usuário/Perfil
- `heart` - Coração
- `star` - Estrela
- `check` - Checkmark
- `check-circle` - Círculo com checkmark
- `alert-circle` - Alerta
- `brand-whatsapp` - Logo WhatsApp
- `search` - Busca
- `settings` - Configurações
- `trash` - Lixeira/Delete
- `edit` - Editar
- `plus` - Adicionar
- `minus` - Remover

## Variações de Estilo

```tsx
// Diferentes tamanhos
<Icon name="menu" size={16} />
<Icon name="menu" size={24} />
<Icon name="menu" size={32} />

// Tamanhos responsivos
<Icon name="menu" size="1.5rem" />
<Icon name="menu" size="2em" />

// Preenchido (solid/filled)
<Icon name="star" filled />
<Icon name="heart" filled />

// Com classes CSS
<Icon name="arrow-right" className="hover:text-red-500" />
```

## Header Component

No componente Header, os ícones foram implementados com Tabler Icons:

```tsx
// Top bar - utility links
<Icon name="brand-whatsapp" size={16} />
<Icon name="user" size={16} />
<Icon name="arrow-right" size={16} />

// Navigation dropdowns
<Icon name="chevron-down" size={16} />

// Mobile menu
<Icon name={mobileMenuOpen ? 'x' : 'menu'} size={24} />
```

## HTML Gerado

O componente renderiza um elemento `<i>` com as classes corretas do Tabler Icons:

```html
<!-- Ícone normal -->
<i class="ti ti-menu" style="font-size: 24px;"></i>

<!-- Ícone preenchido -->
<i class="ti ti-star-filled" style="font-size: 24px;"></i>

<!-- Com className adicional -->
<i class="ti ti-arrow-right custom-class" style="font-size: 16px;"></i>
```

## Performance

- Ícones são renderizados como elementos inline (`<i>`)
- CSS carregado via CDN (jsDelivr)
- Herança automática de cor via `currentColor`
- Zero bundle size adicional (CSS do CDN não é incluído no bundle)

## Compatibilidade

- ✅ Chrome/Edge (88+)
- ✅ Firefox (87+)
- ✅ Safari (14+)
- ✅ Mobile (iOS Safari, Chrome Android)

## Estrutura de Classe

O componente gera automaticamente as classes:
- `ti` - Classe base obrigatória
- `ti-{name}` - Ícone normal (outline)
- `ti-{name}-filled` - Ícone preenchido (filled)

Nomes de ícones usam hífens: `arrow-right`, `brand-whatsapp`, `check-circle`, etc.

## CDN Link

O CSS do Tabler Icons é carregado de:
```
https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css
```

Você pode verificar a disponibilidade e versões em https://www.jsdelivr.com/package/npm/@tabler/icons-webfont
