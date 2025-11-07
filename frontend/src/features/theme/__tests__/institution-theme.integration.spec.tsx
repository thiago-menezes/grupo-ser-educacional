/**
 * Institution Theme Integration Tests
 *
 * Tests the dynamic theme switching functionality based on
 * URL slugs (e.g., /ung, /uninassau) with fallback to
 * NEXT_PUBLIC_INSTITUTION environment variable.
 */

import { InstitutionThemeProvider } from '@/components/InstitutionThemeProvider';
import {
  getInstitutionTheme,
  getCurrentInstitution,
  isValidInstitution,
  getAvailableInstitutions,
  INSTITUTIONS,
  DEFAULT_INSTITUTION,
} from '@/config/institutions';
import { generateInstitutionThemeCSS } from '@/lib/themes/generator';
import { render } from '@/libs/testing/testing-wrapper';

describe('Institution Configuration', () => {
  it('should export all required institution data', () => {
    expect(INSTITUTIONS).toBeDefined();
    expect(INSTITUTIONS.UNINASSAU).toBeDefined();
    expect(INSTITUTIONS.UNG).toBeDefined();
  });

  it('should have correct structure for each institution', () => {
    Object.values(INSTITUTIONS).forEach((institution) => {
      expect(institution).toHaveProperty('name');
      expect(institution).toHaveProperty('code');
      expect(institution).toHaveProperty('primary');
      expect(institution).toHaveProperty('secondary');

      // Verify colors are valid hex codes
      expect(institution.primary).toMatch(/^#[0-9A-F]{6}$/i);
      expect(institution.secondary).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });

  it('should have UNINASSAU with correct brand colors', () => {
    const uninassau = INSTITUTIONS.UNINASSAU;
    expect(uninassau.name).toBe('UNINASSAU');
    expect(uninassau.code).toBe('UNINASSAU');
    expect(uninassau.primary).toBe('#E31E24');
    expect(uninassau.secondary).toBe('#003DA5');
  });

  it('should have UNG with correct brand colors', () => {
    const ung = INSTITUTIONS.UNG;
    expect(ung.name).toBe('UNG - Universidade Guarulhos');
    expect(ung.code).toBe('UNG');
    expect(ung.primary).toBe('#00C853');
    expect(ung.secondary).toBe('#1B5E20');
  });
});

describe('getInstitutionTheme', () => {
  it('should return correct theme for valid institution ID', () => {
    const theme = getInstitutionTheme('UNINASSAU');
    expect(theme).toEqual(INSTITUTIONS.UNINASSAU);
  });

  it('should be case-insensitive', () => {
    const theme1 = getInstitutionTheme('uninassau');
    const theme2 = getInstitutionTheme('UNINASSAU');
    const theme3 = getInstitutionTheme('UnInAsSaU');

    expect(theme1).toEqual(theme2);
    expect(theme2).toEqual(theme3);
  });

  it('should return default institution for invalid ID', () => {
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    const theme = getInstitutionTheme('INVALID_INSTITUTION');
    expect(theme).toEqual(INSTITUTIONS[DEFAULT_INSTITUTION]);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('INVALID_INSTITUTION'),
    );

    consoleWarnSpy.mockRestore();
  });

  it('should return default institution for null/undefined', () => {
    const theme1 = getInstitutionTheme(null);
    const theme2 = getInstitutionTheme(undefined);

    expect(theme1).toEqual(INSTITUTIONS[DEFAULT_INSTITUTION]);
    expect(theme2).toEqual(INSTITUTIONS[DEFAULT_INSTITUTION]);
  });
});

describe('getCurrentInstitution', () => {
  const originalEnv = process.env.NEXT_PUBLIC_INSTITUTION;

  afterEach(() => {
    // Restore original env value
    process.env.NEXT_PUBLIC_INSTITUTION = originalEnv;
  });

  describe('with slug parameter (new behavior)', () => {
    it('should return institution from slug parameter', () => {
      const institution = getCurrentInstitution('ung');
      expect(institution).toBe('UNG');
    });

    it('should be case-insensitive for slug', () => {
      expect(getCurrentInstitution('ung')).toBe('UNG');
      expect(getCurrentInstitution('UNG')).toBe('UNG');
      expect(getCurrentInstitution('UnG')).toBe('UNG');
    });

    it('should prioritize slug over environment variable', () => {
      process.env.NEXT_PUBLIC_INSTITUTION = 'UNINASSAU';
      const institution = getCurrentInstitution('ung');
      expect(institution).toBe('UNG');
    });

    it('should return default for invalid slug', () => {
      const institution = getCurrentInstitution('invalid');
      expect(institution).toBe(DEFAULT_INSTITUTION);
    });
  });

  describe('with environment variable (legacy behavior)', () => {
    it('should return institution from environment variable', () => {
      process.env.NEXT_PUBLIC_INSTITUTION = 'UNG';
      const institution = getCurrentInstitution();
      expect(institution).toBe('UNG');
    });

    it('should return default institution when env is not set', () => {
      delete process.env.NEXT_PUBLIC_INSTITUTION;
      const institution = getCurrentInstitution();
      expect(institution).toBe(DEFAULT_INSTITUTION);
    });

    it('should be case-insensitive for env variable', () => {
      process.env.NEXT_PUBLIC_INSTITUTION = 'ung';
      const institution = getCurrentInstitution();
      expect(institution).toBe('UNG');
    });
  });
});

describe('isValidInstitution', () => {
  it('should return true for valid institution IDs', () => {
    expect(isValidInstitution('UNINASSAU')).toBe(true);
    expect(isValidInstitution('UNG')).toBe(true);
    expect(isValidInstitution('uninassau')).toBe(true);
    expect(isValidInstitution('ung')).toBe(true);
  });

  it('should return false for invalid institution IDs', () => {
    expect(isValidInstitution('INVALID')).toBe(false);
    expect(isValidInstitution('')).toBe(false);
    expect(isValidInstitution(null)).toBe(false);
    expect(isValidInstitution(undefined)).toBe(false);
  });
});

describe('getAvailableInstitutions', () => {
  it('should return array of all institution IDs', () => {
    const institutions = getAvailableInstitutions();

    expect(Array.isArray(institutions)).toBe(true);
    expect(institutions.length).toBeGreaterThan(0);
    expect(institutions).toContain('UNINASSAU');
    expect(institutions).toContain('UNG');
  });

  it('should match the keys of INSTITUTIONS object', () => {
    const institutions = getAvailableInstitutions();
    const institutionKeys = Object.keys(INSTITUTIONS);

    expect(institutions).toEqual(institutionKeys);
  });
});

describe('Theme Generator', () => {
  it('should generate valid CSS from institution theme', () => {
    const theme = getInstitutionTheme('UNINASSAU');
    const css = generateInstitutionThemeCSS('UNINASSAU', theme);

    // Verify CSS was generated
    expect(css).toBeTruthy();
    expect(css.length).toBeGreaterThan(100);

    // Verify it contains theme name
    expect(css).toContain('uninassau');

    // Verify it contains CSS custom properties
    expect(css).toContain('--rs-');
  });

  it('should generate different CSS for different institutions', () => {
    const uninassauTheme = getInstitutionTheme('UNINASSAU');
    const ungTheme = getInstitutionTheme('UNG');

    const uninassauCSS = generateInstitutionThemeCSS(
      'UNINASSAU',
      uninassauTheme,
    );
    const ungCSS = generateInstitutionThemeCSS('UNG', ungTheme);

    // CSS should be different
    expect(uninassauCSS).not.toBe(ungCSS);

    // Each should contain its own theme name
    expect(uninassauCSS).toContain('uninassau');
    expect(ungCSS).toContain('ung');
  });
});

describe('InstitutionThemeProvider (V2.1 - Cleanup Only)', () => {
  beforeEach(() => {
    // Clean up any existing theme style tags
    const existingStyle = document.getElementById('institution-theme');
    if (existingStyle) {
      existingStyle.remove();
    }
  });

  afterEach(() => {
    // Clean up style tag after each test
    const styleTag = document.getElementById('institution-theme');
    if (styleTag) {
      styleTag.remove();
    }
  });

  it('should render without crashing', () => {
    render(<InstitutionThemeProvider />);
    // Component renders null, so no screen assertions needed
  });

  it('should clean up style tag on unmount if it exists', () => {
    // Simulate blocking script having already injected CSS
    const style = document.createElement('style');
    style.id = 'institution-theme';
    style.textContent = '/* theme CSS */';
    document.head.appendChild(style);

    // Verify CSS was injected
    expect(document.getElementById('institution-theme')).toBeTruthy();

    const { unmount } = render(<InstitutionThemeProvider />);

    // Unmount component
    unmount();

    // Verify CSS was removed
    const styleTagAfterUnmount = document.getElementById('institution-theme');
    expect(styleTagAfterUnmount).toBeNull();
  });

  it('should not throw error if style tag does not exist on unmount', () => {
    // Render without pre-existing style tag
    const { unmount } = render(<InstitutionThemeProvider />);

    // Should not throw when unmounting
    expect(() => unmount()).not.toThrow();
  });
});

describe('Theme Integration with Environment Variables', () => {
  const originalEnv = process.env.NEXT_PUBLIC_INSTITUTION;

  afterEach(() => {
    process.env.NEXT_PUBLIC_INSTITUTION = originalEnv;
  });

  it('should use UNINASSAU theme when env is set to UNINASSAU', () => {
    process.env.NEXT_PUBLIC_INSTITUTION = 'UNINASSAU';
    const theme = getInstitutionTheme(getCurrentInstitution());

    expect(theme.code).toBe('UNINASSAU');
    expect(theme.primary).toBe('#E31E24');
    expect(theme.secondary).toBe('#003DA5');
  });

  it('should use UNG theme when env is set to UNG', () => {
    process.env.NEXT_PUBLIC_INSTITUTION = 'UNG';
    const theme = getInstitutionTheme(getCurrentInstitution());

    expect(theme.code).toBe('UNG');
    expect(theme.primary).toBe('#00C853');
    expect(theme.secondary).toBe('#1B5E20');
  });

  it('should fall back to default theme when env is invalid', () => {
    process.env.NEXT_PUBLIC_INSTITUTION = 'INVALID';
    const theme = getInstitutionTheme(getCurrentInstitution());

    expect(theme).toEqual(INSTITUTIONS[DEFAULT_INSTITUTION]);
  });
});
