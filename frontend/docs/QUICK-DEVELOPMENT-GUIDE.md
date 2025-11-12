# Quick Guide - Grupo Ser Frontend

## Core Rules

### TypeScript Types

- **Always use `type`** instead of `interface`
- **DO NOT create types in component, hook, or context files** - all types must go in `types.ts` files
- Only use `interface` for global definitions:
  - `env` files
  - `next-env.d.ts` files
  - User exception files

### Component Structure

- **Index file** (`index.ts`) centralizes all component logic
- Import component-specific items directly in the HTML component file
- Hooks should be component-specific (e.g., `useUserSelector`, not `useSelection`)

## Design System (Reshaped)

**Always prioritize Reshaped components before creating new ones**

### Available Components

**Main Components:**
ActionBar, Alert, Autocomplete, Avatar, Badge, Breadcrumbs, Button, Calendar, Card, Carousel, Checkbox, CheckboxGroup, ContextMenu, Divider, DropdownMenu, FileUpload, Hotkey, Link, Loader, MenuItem, Modal, NumberField, Pagination, PinField, Popover, Progress, ProgressIndicator, Radio, RadioGroup, Resizable, Scrim, Select, Skeleton, Slider, Stepper, Switch, Table, Tabs, TextArea, TextField, Timeline, Toast, ToggleButton, ToggleButtonGroup, Tooltip

**Utility Components:**
Accordion, Actionable, Container, Dismissible, Flyout, FormControl, Grid, Hidden, HiddenVisually, Icon, Image, Overlay, Reshaped, ScrollArea, Text, Theme, View

**Hooks:**
useElementId, useHandlerRef, useHotkeys, useKeyboardArrowNavigation, useKeyboardMode, useOnClickOutside, useRTL, useResponsiveClientValue, useScrollLock, useToggle

**Storybook:** https://main--5ed400f96e43cc00226d4df6.chromatic.com/

## Project Guidelines

### Component Reuse

- **Never recreate** existing Design System components
- Reuse any text/component that already exists in Reshaped
- Don't create unnecessary CSS or extra components

### File Organization

- **Mocks:** Create `mocks.ts` file (not folder) unless multiple mocks exist
- **Exports:** Only export the component itself via `index.ts`
- **Child components:** Keep in same folder as parent, not in `components/` subfolder

### Project Structure Example

```
component-name/
  constants.ts
  styles.scss
  types.ts
  hooks.ts
  mocks.ts
  utils.ts
  api/
    query.ts       (for queries)
    mutation.ts    (for mutations)
    types.ts       (Dtos types)
```

## Styling Guidelines

### Design System Tokens

- **Always use Reshaped design tokens** - never create custom SCSS variables for colors or breakpoints
- Use tokens from:
  - `tokens.scss` (Reshaped design tokens)
  - Theme files (grupo-ser.scss, uninassau.scss, etc.)
- **Never use hardcoded colors** (supports light/dark themes)
- **Never create custom breakpoint variables** - use Reshaped viewport tokens instead

### Viewport Breakpoints

- Use PostCSS custom media queries provided by Reshaped:

  ```scss
  // ✅ CORRECT - Use PostCSS custom media queries
  @media (--rs-viewport-m) {
    // Styles for medium viewport (≥660px)
  }

  @media (--rs-viewport-l) {
    // Styles for large viewport (≥900px)
  }

  @media (--rs-viewport-xl) {
    // Styles for extra large viewport (≥1280px)
  }
  ```

- **DO NOT** create custom breakpoint variables:

  ```scss
  // ❌ WRONG - Don't create custom breakpoint variables
  $breakpoint-tablet: 768px;
  $breakpoint-desktop: 1024px;

  // ❌ WRONG - Don't use calc() with viewport tokens
  @media (min-width: calc(var(--rs-viewport-m-min) * 1px)) {
  }
  ```

### Color Tokens

- Use Reshaped color tokens directly:

  ```scss
  // ✅ CORRECT - Use Reshaped color tokens
  .button {
    color: var(--rs-color-background-primary);
    background: var(--rs-color-background-primary-faded);
  }

  .critical {
    color: var(--rs-color-background-critical);
    background: var(--rs-color-background-critical-faded);
  }
  ```

- **DO NOT** create custom color variables:
  ```scss
  // ❌ WRONG - Don't create custom color variables
  $blue-primary: #052b82;
  $blue-light: #e7efff;
  $red-primary: #e2052c;
  ```

### RGB Transparency

- Don't use `rgba()`
- Use this format instead:
  ```css
  rgb(from var(--color-variable) r g b / 0.5)
  ```

## Important Notes

- **Never run `yarn build`** when checking tests - it breaks the app
- Always follow the existing code patterns and conventions
- Check existing components before creating new ones

## Development Commands

- `yarn dev:frontend` - Start development server
- `yarn workspace frontend typecheck` - Run TypeScript checking
- `yarn workspace frontend lint` - Run ESLint
- `yarn workspace frontend lint:fix` - Fix ESLint issues
- `yarn format` - Format with Prettier
- `yarn workspace frontend test` - Run all tests
- `yarn workspace frontend test:unit` - Run unit tests
- `yarn workspace frontend test:integration` - Run integration tests
