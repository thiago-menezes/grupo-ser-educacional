/**
 * Theme Script Generator
 *
 * Generates a blocking inline script that injects theme CSS before React hydration.
 * This prevents FOUC (Flash of Unstyled Content) by ensuring CSS is present for first paint.
 *
 * @see /src/lib/themes/generator.ts for theme CSS generation
 * @see /src/app/layout.tsx for usage
 */

import {
  getCurrentInstitution,
  getInstitutionTheme,
} from '@/config/institutions';
import { generateInstitutionThemeCSS } from './generator';

/**
 * Generate blocking JavaScript that injects theme CSS before first paint.
 *
 * **How it prevents FOUC:**
 * 1. This function is called during Next.js SSR (server-side)
 * 2. Generated script is injected in HTML <head> without async/defer
 * 3. Browser executes script synchronously before rendering page
 * 4. CSS is present in DOM before first paint
 * 5. No flash - correct colors from the start
 *
 * **Technical details:**
 * - Returns IIFE (Immediately Invoked Function Expression)
 * - CSS is escaped for safe injection in JavaScript string
 * - Uses backticks for template literals (escaped properly)
 * - Creates <style> tag and injects before any rendering happens
 *
 * @param slug - Institution slug from URL (e.g., 'ung', 'uninassau')
 * @returns JavaScript code as string (IIFE that injects CSS)
 *
 * @example
 * ```tsx
 * // In layout.tsx (Server Component)
 * const themeScript = generateThemeInjectionScript('ung');
 *
 * return (
 *   <html>
 *     <head>
 *       <script dangerouslySetInnerHTML={{ __html: themeScript }} />
 *     </head>
 *     <body>{children}</body>
 *   </html>
 * );
 * ```
 */
export function generateThemeInjectionScript(slug?: string): string {
  // Get institution from slug or fall back to environment variable
  const institutionId = getCurrentInstitution(slug);
  const theme = getInstitutionTheme(institutionId);

  // Generate complete theme CSS using Reshaped APIs
  const themeCSS = generateInstitutionThemeCSS(institutionId, theme);

  // Escape CSS for safe injection in JavaScript string
  // Must escape: backslashes, backticks, and dollar signs (template literal syntax)
  const escapedCSS = themeCSS
    .replace(/\\/g, '\\\\') // Escape backslashes first
    .replace(/`/g, '\\`') // Escape backticks (template literal delimiter)
    .replace(/\$/g, '\\$'); // Escape dollar signs (template literal variables)

  // Return IIFE that executes immediately when script loads
  // This runs BEFORE React hydration, preventing FOUC
  return `
(function() {
  try {
    // Theme CSS injection - runs before first paint
    var styleId = 'institution-theme';

    // Remove existing style tag if present (for dev hot reload)
    var existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create and inject new style tag
    var style = document.createElement('style');
    style.id = styleId;
    style.textContent = \`${escapedCSS}\`;

    // Inject into head (synchronous, blocks rendering)
    document.head.appendChild(style);

    // Log for debugging (only in development)
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.log('[Theme] Injected ${theme.name} theme (blocking script)');
    }
  } catch (error) {
    // Fail silently to avoid breaking page load
    console.error('[Theme] Failed to inject theme CSS:', error);
  }
})();
`.trim();
}
