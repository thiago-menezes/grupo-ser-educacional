import {
  getCurrentInstitution,
  getInstitutionTheme,
} from '@/config/institutions';
import { generateInstitutionThemeCSS } from './generator';

export function generateThemeInjectionScript(slug?: string): string {
  //
  const institutionId = getCurrentInstitution(slug);
  const theme = getInstitutionTheme(institutionId);

  const themeCSS = generateInstitutionThemeCSS(institutionId, theme);

  const escapedCSS = themeCSS
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');

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
