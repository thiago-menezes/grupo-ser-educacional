# Theme Implementation Analysis

## Executive Summary

**Current Implementation Status**: ✅ Working, but not optimal
**Recommendation**: Use Reshaped's official `getThemeCSS()` API with dynamic theme generation

---

## Current Implementation Analysis

### What We Built (InstitutionThemeInjector)

**Approach**: CSS variable override via runtime `<style>` tag injection

```typescript
// Current approach - Manual CSS injection
style.textContent = `
  [data-rs-theme*=" slate "] {
    --rs-color-primary-base: ${theme.primary};
    --rs-color-brand-base: ${theme.secondary};
  }
  /* 150+ lines of manual CSS overrides */
`;
```

### Problems with Current Approach

1. **Manual CSS Maintenance**
   - 150+ lines of hand-written CSS selectors
   - Need to manually map each component variant
   - Brittle and error-prone

2. **Not Using Reshaped's APIs**
   - Bypasses Reshaped's official theming system
   - Won't benefit from Reshaped updates/improvements
   - Risk of breaking with Reshaped version upgrades

3. **Incomplete Coverage**
   - Only overrides colors we manually selected
   - Missing automatic color variants (light, dark, hover states)
   - No automatic a11y color adjustments

4. **CSS Specificity Issues**
   - Relies on selector specificity battles
   - Fragile when Reshaped changes internal selectors
   - Hard to debug style conflicts

5. **Against Reshaped Philosophy**
   - Documentation says: "custom styling can be unsafe"
   - Recommends: "composition and theming"
   - We're doing direct CSS manipulation instead

---

## Reshaped's Official Theming API

### What Reshaped Provides

Reshaped exports a comprehensive theming API:

```typescript
import {
  baseThemeDefinition,    // Base theme object
  generateThemeColors,    // Generate color tokens from HEX
  getThemeCSS,           // Generate complete theme CSS
  transform              // Transform theme definition
} from 'reshaped/themes';
```

### How It Should Work

```typescript
// 1. Generate colors from HEX values
const colors = generateThemeColors({
  primary: '#E31E24',  // UNINASSAU red
  brand: '#003DA5'     // UNINASSAU blue
});

// 2. Create theme definition
const themeDefinition = {
  ...baseThemeDefinition,
  color: colors
};

// 3. Generate CSS
const themeCSS = getThemeCSS('uninassau', themeDefinition);

// 4. Inject CSS
<style dangerouslySetInnerHTML={{ __html: themeCSS }} />
```

### Benefits of Official API

✅ **Automatic color generation**
- Generates all color variants (50-900 scale)
- Creates hover/focus/active states
- Handles light/dark mode automatically
- Ensures accessible color contrasts

✅ **Future-proof**
- Uses official Reshaped APIs
- Compatible with version updates
- Follows framework best practices

✅ **Less code**
- ~10 lines vs 150+ lines
- No manual CSS selectors
- Reshaped handles all edge cases

✅ **Complete coverage**
- All components automatically themed
- All variants properly styled
- All states (hover, focus, etc.) included

✅ **Type-safe**
- TypeScript types for theme definition
- Compile-time checking
- IntelliSense support

---

## Proposed Solution: Three Approaches

### Option 1: Server-Side Theme Generation (RECOMMENDED)

**Best for**: Production, performance, maintainability

Generate theme CSS at build time and inject based on institution:

```typescript
// src/lib/themes/generator.ts
import {
  baseThemeDefinition,
  generateThemeColors,
  getThemeCSS
} from 'reshaped/themes';
import { INSTITUTIONS } from '@/config/institutions';

export function generateInstitutionThemeCSS(institutionId: string) {
  const theme = INSTITUTIONS[institutionId];

  const colors = generateThemeColors({
    primary: theme.primary,
    brand: theme.secondary,
  });

  const themeDefinition = {
    ...baseThemeDefinition,
    color: colors,
  };

  return getThemeCSS(institutionId.toLowerCase(), themeDefinition);
}

// Pre-generate all themes at build time
export const INSTITUTION_THEMES = Object.keys(INSTITUTIONS).reduce(
  (acc, id) => ({
    ...acc,
    [id]: generateInstitutionThemeCSS(id),
  }),
  {} as Record<string, string>
);
```

```typescript
// src/components/InstitutionThemeProvider.tsx
'use client';

import { useEffect } from 'react';
import { getCurrentInstitution } from '@/config/institutions';
import { INSTITUTION_THEMES } from '@/lib/themes/generator';

export function InstitutionThemeProvider() {
  const institutionId = getCurrentInstitution();
  const themeCSS = INSTITUTION_THEMES[institutionId];

  useEffect(() => {
    const styleId = 'institution-theme';
    const existing = document.getElementById(styleId);
    if (existing) existing.remove();

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = themeCSS;
    document.head.appendChild(style);

    return () => {
      document.getElementById(styleId)?.remove();
    };
  }, [themeCSS]);

  return null;
}
```

```typescript
// Update providers.tsx to use theme name
<Reshaped theme={institutionId.toLowerCase()}>
  <InstitutionThemeProvider />
  {children}
</Reshaped>
```

**Pros:**
- ✅ Uses official Reshaped API
- ✅ Themes pre-generated at build time (fast)
- ✅ Type-safe, maintainable
- ✅ Automatic color variants
- ✅ Only ~30 lines of code

**Cons:**
- ⚠️ Still requires restart for env change (same as current)
- ⚠️ Slightly more complex setup

---

### Option 2: Runtime Theme Generation

**Best for**: Development flexibility, easier debugging

Generate theme CSS on-demand at runtime:

```typescript
'use client';

import { useMemo, useEffect } from 'react';
import {
  baseThemeDefinition,
  generateThemeColors,
  getThemeCSS
} from 'reshaped/themes';
import { getCurrentInstitution, getInstitutionTheme } from '@/config/institutions';

export function InstitutionThemeProvider() {
  const institutionId = getCurrentInstitution();
  const theme = getInstitutionTheme(institutionId);

  const themeCSS = useMemo(() => {
    const colors = generateThemeColors({
      primary: theme.primary,
      brand: theme.secondary,
    });

    return getThemeCSS(institutionId.toLowerCase(), {
      ...baseThemeDefinition,
      color: colors,
    });
  }, [institutionId, theme.primary, theme.secondary]);

  useEffect(() => {
    const styleId = 'institution-theme';
    const existing = document.getElementById(styleId);
    if (existing) existing.remove();

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = themeCSS;
    document.head.appendChild(style);

    return () => {
      document.getElementById(styleId)?.remove();
    };
  }, [themeCSS]);

  return null;
}
```

**Pros:**
- ✅ Uses official Reshaped API
- ✅ Simpler code (~25 lines)
- ✅ Easier to debug
- ✅ Type-safe

**Cons:**
- ⚠️ Generates CSS on every page load (small perf cost)
- ⚠️ Still requires restart for env change

---

### Option 3: CSS Module with CSS Variables (Hybrid)

**Best for**: Maximum performance, minimal bundle size

Use Reshaped API to generate only color values, apply via CSS module:

```typescript
// src/lib/themes/colors.ts
import { generateThemeColors } from 'reshaped/themes';
import { INSTITUTIONS } from '@/config/institutions';

export const INSTITUTION_COLORS = Object.keys(INSTITUTIONS).reduce(
  (acc, id) => {
    const theme = INSTITUTIONS[id];
    const colors = generateThemeColors({
      primary: theme.primary,
      brand: theme.secondary,
    });
    return { ...acc, [id]: colors };
  },
  {} as Record<string, ReturnType<typeof generateThemeColors>>
);
```

```scss
// src/components/InstitutionTheme/theme.module.scss
[data-institution-theme] {
  // CSS variables injected dynamically
}
```

```typescript
// src/components/InstitutionTheme/index.tsx
'use client';

import { getCurrentInstitution } from '@/config/institutions';
import { INSTITUTION_COLORS } from '@/lib/themes/colors';
import styles from './theme.module.scss';

export function InstitutionTheme() {
  const institutionId = getCurrentInstitution();
  const colors = INSTITUTION_COLORS[institutionId];

  // Convert color tokens to CSS variables
  const cssVars = Object.entries(colors).reduce((acc, [name, token]) => ({
    ...acc,
    [`--rs-color-${name}`]: token.hex,
    ...(token.hexDark && { [`--rs-color-${name}-dark`]: token.hexDark }),
  }), {});

  return (
    <div
      data-institution-theme
      className={styles.theme}
      style={cssVars as React.CSSProperties}
    />
  );
}
```

**Pros:**
- ✅ Uses Reshaped's color generation
- ✅ Optimal bundle size
- ✅ Best performance
- ✅ Type-safe

**Cons:**
- ⚠️ More complex implementation
- ⚠️ Need to manually map CSS vars
- ⚠️ Doesn't use full Reshaped theming

---

## Comparison Matrix

| Feature | Current (Manual CSS) | Option 1 (Server-Side) | Option 2 (Runtime) | Option 3 (Hybrid) |
|---------|---------------------|------------------------|-------------------|-------------------|
| **Code Lines** | 150+ | ~30 | ~25 | ~40 |
| **Uses Official API** | ❌ | ✅ | ✅ | ⚠️ Partial |
| **Auto Color Variants** | ❌ | ✅ | ✅ | ✅ |
| **Performance** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Maintainability** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Type Safety** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Future-Proof** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Bundle Size** | Medium | Small | Small | Smallest |
| **Restart Required** | Yes | Yes | Yes | Yes |
| **Complexity** | Medium | Low | Very Low | Medium |

---

## Recommendation

### Primary Recommendation: **Option 2 (Runtime Theme Generation)**

**Why:**
1. **Simplest to implement** - Only ~25 lines of code
2. **Uses official Reshaped API** - Future-proof and maintainable
3. **Complete coverage** - All components, variants, and states
4. **Easy migration** - Drop-in replacement for current implementation
5. **Good performance** - CSS generation is fast enough for runtime

**When to use Option 1 instead:**
- If you need maximum performance (e.g., serving millions of users)
- If you want to minimize runtime overhead
- If build-time pre-generation is acceptable

**When to use Option 3 instead:**
- If you need smallest possible bundle size
- If you want more control over CSS variable mapping
- If you're comfortable with more complex implementation

---

## Migration Path

### Phase 1: Proof of Concept (1 hour)
1. Create new `InstitutionThemeProvider` with Option 2
2. Test with UNINASSAU theme
3. Compare with current implementation

### Phase 2: Implementation (2 hours)
1. Replace current `InstitutionThemeInjector` with new provider
2. Update tests
3. Verify all components render correctly
4. Test theme switching

### Phase 3: Cleanup (30 min)
1. Remove old CSS injection code
2. Update documentation
3. Update THEMING.md with new approach

**Total effort**: ~3.5 hours

---

## Conclusion

The current implementation **works** but is not aligned with Reshaped's recommended practices. Moving to Option 2 (Runtime Theme Generation) provides:

- **80% less code** (25 lines vs 150+)
- **Official API usage** (future-proof)
- **Automatic color handling** (variants, states, a11y)
- **Better maintainability** (type-safe, self-documenting)

The migration is straightforward and low-risk, with minimal impact on existing functionality.

---

## Next Steps

1. **Decision**: Choose preferred option (recommend Option 2)
2. **Approval**: Get sign-off for migration
3. **Implementation**: Execute migration plan
4. **Validation**: Test with all institutions
5. **Documentation**: Update THEMING.md

---

**Document Version**: 1.0
**Date**: 2025-01-28
**Author**: Theme Implementation Review
