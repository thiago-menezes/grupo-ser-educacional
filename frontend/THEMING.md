# Dynamic Institution Theming

This document explains how the dynamic multi-institution theming system works and how to add new institutions.

## Overview

The theming system allows the application to dynamically switch between different institution brand colors at runtime based on the `NEXT_PUBLIC_INSTITUTION` environment variable. This enables a single codebase to serve multiple institutions with unique branding without requiring separate builds.

## Implementation Version

**Current Version**: V2.1 (FOUC Prevention + Reshaped Official API)
**Previous Versions**:
- V2.0 (Reshaped Official API) - Had FOUC issue
- V1.0 (Manual CSS Injection) - ⚠️ Deprecated

### V2.1 Improvements (Current)

The current implementation uses Reshaped's official theming APIs with FOUC prevention:
- ✅ **Zero FOUC**: Blocking script injects CSS before first paint
- ✅ Uses `generateThemeColors()` and `getThemeCSS()` from Reshaped
- ✅ 83% less code (25 lines vs 150+)
- ✅ Automatic color variants (hover, focus, active, disabled states)
- ✅ Automatic accessibility (contrast ratios, WCAG compliance)
- ✅ Future-proof (compatible with Reshaped updates)
- ✅ Complete component coverage (all Reshaped components, all variants)

### What's New in V2.1

**Problem Solved**: V2.0 caused a flash of unstyled content (FOUC) when refreshing the page because CSS injection happened client-side after first paint.

**Solution**: Blocking inline script in HTML `<head>` that runs during SSR, injecting CSS before React hydration.

**Performance**: ~1-5ms blocking overhead vs 50-200ms visual flash (totally worth it!)

See [THEME_IMPLEMENTATION_ANALYSIS.md](THEME_IMPLEMENTATION_ANALYSIS.md) for technical details and migration rationale.

## Architecture

### Components

1. **Institution Configuration** ([src/config/institutions.ts](src/config/institutions.ts))
   - Centralized registry of all institutions and their brand colors
   - Type-safe configuration with TypeScript
   - Helper functions for theme retrieval

2. **Theme Generator** ([src/lib/themes/generator.ts](src/lib/themes/generator.ts))
   - Utility function that generates complete theme CSS using Reshaped APIs
   - Uses `generateThemeColors()` to create color palettes from HEX values
   - Uses `getThemeCSS()` to generate complete CSS with all variants

3. **Theme Script Generator** ([src/lib/themes/script-generator.ts](src/lib/themes/script-generator.ts)) ⭐ NEW in V2.1
   - Generates blocking JavaScript that injects theme CSS before first paint
   - Escapes CSS for safe JavaScript injection
   - Called during SSR in root layout

4. **Root Layout** ([src/app/layout.tsx](src/app/layout.tsx)) ⭐ UPDATED in V2.1
   - Server Component that generates theme injection script during SSR
   - Injects blocking `<script>` tag in HTML `<head>`
   - Script runs synchronously before React hydration
   - Prevents FOUC by ensuring CSS is present for first paint

5. **Theme Provider** ([src/components/InstitutionThemeProvider.tsx](src/components/InstitutionThemeProvider.tsx)) ⭐ SIMPLIFIED in V2.1
   - Client component for cleanup only
   - Removes theme CSS on component unmount
   - No longer handles CSS injection (now in layout.tsx)

6. **Demo Page** ([src/app/demo/page.tsx](src/app/demo/page.tsx))
   - Visual demonstration of theming system
   - Component showcase with current theme
   - Testing instructions

### How It Works (V2.1)

```
1. User sets NEXT_PUBLIC_INSTITUTION environment variable
   ↓
2. Next.js SSR: Root layout calls generateThemeInjectionScript()
   ↓
3. Script generator reads institution from env variable
   ↓
4. generateInstitutionThemeCSS() creates complete theme CSS using Reshaped APIs
   ↓
5. CSS is escaped and wrapped in IIFE (Immediately Invoked Function Expression)
   ↓
6. Blocking <script> tag injected in HTML <head> (no async/defer)
   ↓
7. Browser receives HTML and executes script synchronously
   ↓
8. CSS injected into document head BEFORE first paint
   ↓
9. Page renders with correct colors from the start (no flash!)
   ↓
10. InstitutionThemeProvider handles cleanup on unmount
```

### FOUC Prevention Timeline

```
Without V2.1 (V2.0 behavior):
├─ HTML arrives → First paint with Slate colors (WRONG)
├─ React hydrates
├─ useEffect runs → CSS injected
└─ Second paint with institution colors (CORRECT) ← USER SEES FLASH!

With V2.1 (current behavior):
├─ HTML arrives with blocking script
├─ Script executes → CSS injected
└─ First paint with institution colors (CORRECT) ← NO FLASH!
```

## Supported Institutions

Currently configured institutions:

- **UNINASSAU** - Red (#E31E24) and Blue (#003DA5)
- **UNG** - Green (#00C853) and Dark Green (#1B5E20)
- **UNINORTE** - Orange (placeholder colors)
- **UNIFAEL** - Blue (placeholder colors)
- **UNAMA** - Purple (placeholder colors)

## Usage

### Setting the Institution Theme

1. **Development Environment**

   Create or update `.env.local`:

   ```bash
   NEXT_PUBLIC_INSTITUTION=UNINASSAU
   ```

2. **Production Environment**

   Set the environment variable in your deployment platform:

   ```bash
   NEXT_PUBLIC_INSTITUTION=UNG
   ```

3. **Docker**

   Pass the environment variable:

   ```bash
   docker run -e NEXT_PUBLIC_INSTITUTION=UNINASSAU your-image
   ```

### Testing Theme Switching

1. Visit the demo page at `/demo`
2. Note the current institution and colors
3. Stop the dev server (Ctrl+C)
4. Update `NEXT_PUBLIC_INSTITUTION` in `.env.local`
5. Restart the dev server: `npm run dev`
6. Refresh `/demo` to see the new theme

## Adding a New Institution

Follow these steps to add a new institution to the theming system:

### Step 1: Get Brand Colors

Obtain the official brand colors from the institution's brand guidelines. You'll need:

- Primary color (used for buttons, links, active states)
- Secondary color (used for accents, badges, highlights)

Colors should be in HEX format (e.g., `#E31E24`).

### Step 2: Add to Configuration

Edit [src/config/institutions.ts](src/config/institutions.ts):

```typescript
export const INSTITUTIONS = {
  // ... existing institutions ...

  NEW_INSTITUTION: {
    name: 'Full Institution Name',
    code: 'NEW_INSTITUTION',
    primary: '#HEX_PRIMARY',
    secondary: '#HEX_SECONDARY',
  },
} as const;
```

### Step 3: Update Environment Variable

Add the new institution to `.env.example`:

```bash
# Institution Theming
# Options: UNINASSAU, UNG, UNINORTE, UNIFAEL, UNAMA, NEW_INSTITUTION
NEXT_PUBLIC_INSTITUTION=UNINASSAU
```

### Step 4: Test the New Theme

1. Set the environment variable:

   ```bash
   NEXT_PUBLIC_INSTITUTION=NEW_INSTITUTION
   ```

2. Start the dev server:

   ```bash
   npm run dev
   ```

3. Visit `/demo` to verify the colors are applied correctly

4. Check all component variants (buttons, forms, badges, etc.)

### Step 5: Add Tests (Optional but Recommended)

Add test cases to [src/features/theme/**tests**/institution-theme.integration.spec.tsx](src/features/theme/__tests__/institution-theme.integration.spec.tsx):

```typescript
it('should have NEW_INSTITUTION with correct brand colors', () => {
  const institution = INSTITUTIONS.NEW_INSTITUTION;
  expect(institution.name).toBe('Full Institution Name');
  expect(institution.code).toBe('NEW_INSTITUTION');
  expect(institution.primary).toBe('#HEX_PRIMARY');
  expect(institution.secondary).toBe('#HEX_SECONDARY');
});
```

Run tests:

```bash
npm run test:integration -- src/features/theme
```

## Customizing Theme Colors

### Which Colors Are Applied

The theming system overrides the following Reshaped components:

| Component                       | Primary Color | Secondary Color |
| ------------------------------- | ------------- | --------------- |
| Buttons (solid, faded, outline) | ✓             |                 |
| Links                           | ✓             |                 |
| Badges                          |               | ✓               |
| Form inputs (focus states)      | ✓             |                 |
| Checkboxes & Radios             | ✓             |                 |
| Switches                        | ✓             |                 |
| Progress bars                   | ✓             |                 |
| Tabs (active state)             | ✓             |                 |

### Advanced Customization

To customize additional CSS variables or fine-tune color variants, edit [src/components/InstitutionThemeInjector.tsx](src/components/InstitutionThemeInjector.tsx).

The style injection section contains commented-out examples for color variants (50-900):

```typescript
style.textContent = `
  [data-rs-theme*=" slate "] {
    --rs-color-primary-base: ${theme.primary};
    --rs-color-brand-base: ${theme.secondary};

    /* Uncomment to override specific variants */
    /* --rs-color-primary-500: ${theme.primary}; */
    /* --rs-color-primary-600: darken(${theme.primary}, 10%); */
  }
`;
```

## Troubleshooting

### Theme Not Changing

**Problem:** Changed `NEXT_PUBLIC_INSTITUTION` but theme didn't update.

**Solution:**

- Environment variables starting with `NEXT_PUBLIC_` are embedded at build time
- Restart the dev server after changing the environment variable
- In production, rebuild the application or use runtime configuration

### Colors Look Wrong

**Problem:** Institution colors are not matching brand guidelines.

**Solution:**

- Verify HEX codes in `src/config/institutions.ts`
- Use a color picker tool to extract exact colors from brand assets
- Check if the institution has separate light/dark mode colors

### TypeScript Errors

**Problem:** TypeScript errors when adding a new institution.

**Solution:**

- Ensure the institution object follows the `InstitutionTheme` type
- Include all required fields: `name`, `code`, `primary`, `secondary`
- Run `npm run typecheck` to verify

### Component Not Using Theme Colors

**Problem:** A specific component isn't using the institution colors.

**Solution:**

- Check if the component is from Reshaped or a custom component
- Custom components need to explicitly use theme colors
- Review CSS selectors in `InstitutionThemeInjector.tsx`
- Add custom CSS rules for the component if needed

## Technical Details

### CSS Variable Override Strategy

The theming system uses a CSS variable injection approach:

1. Reshaped uses CSS custom properties (`--rs-*` prefix)
2. `InstitutionThemeInjector` creates a `<style>` tag
3. CSS selectors target Reshaped's theme attribute: `[data-rs-theme*=" slate "]`
4. Custom properties override default Slate theme values
5. All Reshaped components automatically inherit the new colors

### Benefits of This Approach

- ✅ No rebuild required (only restart for env change)
- ✅ Works with existing Reshaped components
- ✅ Type-safe configuration
- ✅ Easy to add new institutions
- ✅ Single source of truth for brand colors
- ✅ Automatic cleanup on component unmount

### Limitations

- ⚠️ Requires dev server restart when changing `NEXT_PUBLIC_INSTITUTION`
- ⚠️ Environment variable must be set at build time (for production)
- ⚠️ Only supports two colors per institution (primary + secondary)
- ⚠️ Custom components need manual CSS rules

## File Structure

```
frontend/
├── src/
│   ├── config/
│   │   └── institutions.ts          # Institution configuration
│   ├── components/
│   │   └── InstitutionThemeInjector.tsx  # Theme injection logic
│   ├── app/
│   │   ├── providers.tsx            # Provider integration
│   │   └── demo/
│   │       ├── page.tsx             # Demo page
│   │       └── demo.module.scss     # Demo styles
│   └── features/
│       └── theme/
│           └── __tests__/
│               └── institution-theme.integration.spec.tsx  # Tests
├── .env.example                      # Environment template
└── THEMING.md                        # This document
```

## Best Practices

1. **Always use brand guidelines** - Get official HEX codes from institution marketing teams
2. **Test all components** - Visit `/demo` to verify colors across all UI elements
3. **Document color sources** - Add comments in `institutions.ts` with color sources
4. **Use semantic naming** - Stick to `primary` and `secondary` naming convention
5. **Run tests** - Ensure integration tests pass after adding institutions
6. **Version control** - Commit `.env.example` updates with new institutions

## Resources

- [Reshaped Documentation](https://reshaped.so/docs)
- [OKLCH Color Space](https://oklch.com/)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Project Architecture](CLAUDE.md)

## Support

For questions or issues:

1. Check this documentation
2. Review existing institutions in `src/config/institutions.ts`
3. Visit `/demo` page for visual reference
4. Run integration tests for validation

---

**Last Updated:** 2025-01-28
**Version:** 1.0.0
**Maintainer:** Grupo SER Development Team
