# Quick Guide - Grupo Ser Frontend

## Core Rules

### TypeScript Types

- **Always use `type`** instead of `interface`
- All types go in `types.ts` files
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

- Always use tokens from:
  - `tokens.scss`
  - Theme files (grupo-ser.scss, uninassau.scss, etc.)
- **Never use hardcoded colors** (supports light/dark themes)

### RGB Transparency

- Don't use `rgba()`
- Use this format instead:
  ```css
  rgb(from var(--color-variable) r g b / 0.5)
  ```

## Important Notes

- **Never run `pnpm build`** when checking tests - it breaks the app
- Always follow the existing code patterns and conventions
- Check existing components before creating new ones

## Development Commands

- `pnpm dev` - Start development server
- `pnpm typecheck` - Run TypeScript checking
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm format` - Format with Prettier
- `pnpm test` - Run all tests
- `pnpm test:unit` - Run unit tests
- `pnpm test:integration` - Run integration tests
