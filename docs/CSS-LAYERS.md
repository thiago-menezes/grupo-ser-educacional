# CSS Cascade Layers Guide

This document explains how CSS cascade layers are configured in the Grupo Ser project to ensure proper style precedence between Reshaped (design system) and component styles.

## Why CSS Layers?

CSS `@layer` provides explicit control over cascade precedence, independent of specificity and source order. This eliminates the need for `!important` hacks and makes style overrides predictable and maintainable.

## Layer Architecture

The project uses 4 layers in order of precedence (lowest to highest):

```css
@layer reshaped, base, components, utilities;
```

### 1. `reshaped` (Lowest Priority)

- **Purpose**: Design system base styles from Reshaped
- **Location**: Imported in `apps/next/src/styles/global.scss:9`
- **Contains**: All Reshaped UI component styles
- **Why lowest?**: Allows all custom styles to override design system defaults

### 2. `base`

- **Purpose**: Global styles, design tokens, and institution themes
- **Location**: Defined in `apps/next/src/styles/global.scss:12-27`
- **Contains**:
  - Design tokens (`tokens.scss`)
  - Institution themes (`uninassau.scss`, `ung.scss`, etc.)
  - Global element styles (e.g., `body` background)

### 3. `components`

- **Purpose**: Component and feature-specific styles
- **Location**: All `*.module.scss` files in `src/components/` and `src/features/`
- **Contains**: Custom component styles that override Reshaped when needed
- **Highest priority for styles**: This layer wins over Reshaped and base

### 4. `utilities` (Highest Priority)

- **Purpose**: Utility classes and one-off overrides
- **Reserved for**: Future utility class system
- **Currently**: Unused, but available for urgent overrides

## How to Use Layers

### In Component/Feature SCSS Files

**Always wrap your styles in the `components` layer:**

```scss
// ✅ CORRECT
@layer components {
  .myComponent {
    background: var(--rs-color-background-primary);
    padding: var(--rs-unit-x4);
  }

  .myButton {
    color: var(--rs-color-foreground-neutral);
  }
}
```

```scss
// ❌ WRONG - No layer wrapper
.myComponent {
  background: var(--rs-color-background-primary);
}
```

### Example: Override Reshaped Button

```scss
// src/components/my-button/styles.module.scss
@layer components {
  .button {
    // This will override Reshaped button styles
    // even if Reshaped has higher specificity!
    border-radius: var(--rs-radius-large);
    padding: var(--rs-unit-x6);

    &:hover {
      transform: translateY(-2px);
    }
  }
}
```

## Benefits

1. **No !important needed**: Component layer always wins over Reshaped layer
2. **Predictable cascade**: Order is explicit in `@layer` declaration
3. **Better performance**: Browser optimizes cascade resolution
4. **Easier maintenance**: Clear separation of concerns
5. **Source order independence**: Layers work regardless of CSS file load order

## Migration Checklist

When creating or updating SCSS files:

- [ ] Wrap all styles in `@layer components { ... }`
- [ ] Use Reshaped design tokens (never hardcode colors)
- [ ] Verify styles work without `!important`
- [ ] Test at all breakpoints (use `--rs-viewport-*` media queries)

## Browser Support

CSS Cascade Layers are supported in:

- Chrome 99+
- Firefox 97+
- Safari 15.4+
- Edge 99+

No polyfill needed for modern browsers (2022+).

## References

- [MDN: CSS Cascade Layers](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)
- [Reshaped Documentation](https://reshaped.so/docs)
- Project Architecture: `docs/HFSA-ARCHITECTURE.md`
