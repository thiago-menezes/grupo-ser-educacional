/**
 * Theme Generator Utility
 *
 * Uses Reshaped's official theming APIs to generate complete theme CSS
 * from institution brand colors. This replaces manual CSS injection with
 * a proper, maintainable solution.
 *
 * @see https://reshaped.so/docs/theming
 * @see /src/config/institutions.ts for institution colors
 */

import {
  baseThemeDefinition,
  generateThemeColors,
  getThemeCSS,
} from 'reshaped/themes';
import type { InstitutionTheme } from '@/config/institutions';

/**
 * Generate complete Reshaped theme CSS from institution colors
 *
 * This function:
 * 1. Uses Reshaped's `generateThemeColors()` to create all color variants
 * 2. Merges with base theme definition
 * 3. Uses `getThemeCSS()` to generate complete CSS
 *
 * Benefits over manual CSS:
 * - Automatic color variants (light, dark, hover, focus states)
 * - Accessible color contrasts (a11y compliant)
 * - Future-proof (uses official Reshaped APIs)
 * - Complete coverage (all components, all variants)
 *
 * @param institutionId - Institution identifier (e.g., 'UNINASSAU', 'UNG')
 * @param theme - Institution theme with primary and secondary colors
 * @returns Complete CSS string for the institution theme
 *
 * @example
 * ```typescript
 * const css = generateInstitutionThemeCSS('UNINASSAU', {
 *   name: 'UNINASSAU',
 *   code: 'UNINASSAU',
 *   primary: '#E31E24',
 *   secondary: '#003DA5'
 * });
 * // Returns complete CSS with all color variants
 * ```
 */
export function generateInstitutionThemeCSS(
  institutionId: string,
  theme: InstitutionTheme,
): string {
  // Generate complete color palette from HEX values
  // This creates all necessary variants:
  // - foreground colors (text, icons)
  // - background colors (surfaces, elevations)
  // - border colors
  // - hover/focus/active states
  // - light and dark mode variants
  const colors = generateThemeColors({
    primary: theme.primary,
    brand: theme.secondary,
  });

  // Merge generated colors with base theme definition
  // Base includes: fonts, spacing, shadows, radii, etc.
  const themeDefinition = {
    ...baseThemeDefinition,
    color: colors,
  };

  // Generate complete CSS using Reshaped's official API
  // This creates all CSS custom properties (--rs-color-*)
  // and ensures they work with all Reshaped components
  const css = getThemeCSS(institutionId.toLowerCase(), themeDefinition);

  return css;
}
