'use client';

import { useEffect } from 'react';

/**
 * InstitutionThemeProvider (V2.1 - FOUC Prevention)
 *
 * Cleanup component for institution theme CSS. The actual CSS injection now happens
 * via a blocking script in layout.tsx to prevent FOUC (Flash of Unstyled Content).
 *
 * **Architecture (V2.1):**
 * 1. Server-side: `layout.tsx` generates blocking script during SSR
 * 2. Browser: Script executes synchronously before first paint
 * 3. CSS injected into <head> before React hydration
 * 4. This component: Only handles cleanup on unmount
 *
 * **Why this approach?**
 * - ✅ Zero FOUC: CSS present before first paint
 * - ✅ Better UX: No color flash on page load
 * - ✅ Performance: ~1-5ms blocking vs 50-200ms visual flash
 *
 * **Previous Implementation (V2.0):**
 * - Used `useEffect` to inject CSS client-side
 * - Caused FOUC because useEffect runs AFTER first paint
 * - CSS generation happened post-hydration
 *
 * @see /src/app/layout.tsx - Blocking script injection
 * @see /src/lib/themes/script-generator.ts - Script generation logic
 * @see /src/lib/themes/generator.ts - Theme CSS generation
 * @see THEMING.md - Complete theming documentation
 *
 * @example
 * ```tsx
 * <Reshaped theme="slate">
 *   <InstitutionThemeProvider />
 *   {children}
 * </Reshaped>
 * ```
 */
export function InstitutionThemeProvider() {
  // Cleanup effect - remove theme CSS when component unmounts
  // CSS injection now happens in layout.tsx via blocking script
  useEffect(() => {
    // Cleanup function runs on unmount
    return () => {
      const styleId = 'institution-theme';
      const styleTag = document.getElementById(styleId);

      if (styleTag) {
        styleTag.remove();

        // Log cleanup in development
        if (
          typeof window !== 'undefined' &&
          window.location.hostname === 'localhost'
        ) {
          console.log('[Theme] Removed institution theme on unmount');
        }
      }
    };
  }, []); // Empty dependency array - cleanup only runs on unmount

  // This component doesn't render anything visible
  // It exists only for cleanup purposes
  return null;
}
