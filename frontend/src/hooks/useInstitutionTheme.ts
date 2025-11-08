'use client';

import { useEffect } from 'react';

export function useInstitutionTheme() {
  useEffect(() => {
    return () => {
      const styleId = 'institution-theme';
      const styleTag = document.getElementById(styleId);

      if (styleTag) {
        styleTag.remove();

        if (
          typeof window !== 'undefined' &&
          window.location.hostname === 'localhost'
        ) {
          console.log('[Theme] Removed institution theme on unmount');
        }
      }
    };
  }, []);
}
