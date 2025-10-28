/**
 * Institution Brand Configuration
 *
 * This file defines color palettes for each institution in the Grupo SER network.
 * Colors are used to dynamically theme the Reshaped design system at runtime.
 *
 * @see THEMING.md for how to add new institutions
 */

/**
 * Color palette with primary and secondary brand colors in HEX format.
 * Reshaped's `generateThemeColors()` will convert these to OKLCH color space
 * and generate all necessary variants (foreground, background, border, etc.)
 */
export type InstitutionTheme = {
  /** Primary brand color (used for buttons, links, active states) */
  primary: string;
  /** Secondary/accent brand color (used for highlights, secondary actions) */
  secondary: string;
  /** Institution full name */
  name: string;
  /** Institution short code */
  code: string;
};

/**
 * Registry of all supported institutions with their brand colors.
 * Add new institutions here following the same structure.
 */
export const INSTITUTIONS = {
  UNINASSAU: {
    name: 'UNINASSAU',
    code: 'UNINASSAU',
    primary: '#E31E24', // Red - primary brand color
    secondary: '#003DA5', // Blue - secondary brand color
  },
  UNG: {
    name: 'UNG - Universidade Guarulhos',
    code: 'UNG',
    primary: '#00C853', // Green - primary brand color
    secondary: '#1B5E20', // Dark Green - secondary brand color
  },
  UNINORTE: {
    name: 'UNINORTE',
    code: 'UNINORTE',
    primary: '#FF6F00', // Orange - placeholder, update with actual brand color
    secondary: '#E65100', // Dark Orange - placeholder, update with actual brand color
  },
  UNIFAEL: {
    name: 'UNIFAEL',
    code: 'UNIFAEL',
    primary: '#1976D2', // Blue - placeholder, update with actual brand color
    secondary: '#0D47A1', // Dark Blue - placeholder, update with actual brand color
  },
  UNAMA: {
    name: 'UNAMA',
    code: 'UNAMA',
    primary: '#7B1FA2', // Purple - placeholder, update with actual brand color
    secondary: '#4A148C', // Dark Purple - placeholder, update with actual brand color
  },
  // Add more institutions as needed
  // INSTITUTION_NAME: {
  //   name: 'Full Institution Name',
  //   code: 'SHORT_CODE',
  //   primary: '#HEX_COLOR',
  //   secondary: '#HEX_COLOR',
  // },
} as const;

/**
 * Type-safe institution identifier
 */
export type InstitutionId = keyof typeof INSTITUTIONS;

/**
 * Default institution to use when NEXT_PUBLIC_INSTITUTION is not set
 */
export const DEFAULT_INSTITUTION: InstitutionId = 'UNINASSAU';

/**
 * Get theme configuration for a specific institution.
 * Falls back to default institution if the requested one doesn't exist.
 *
 * @param institutionId - Institution identifier (e.g., 'UNINASSAU', 'UNG')
 * @returns Institution theme configuration
 *
 * @example
 * ```typescript
 * const theme = getInstitutionTheme('UNINASSAU');
 * console.log(theme.primary); // '#E31E24'
 * ```
 */
export function getInstitutionTheme(
  institutionId?: string | null,
): InstitutionTheme {
  const id = institutionId?.toUpperCase() as InstitutionId;

  if (id && id in INSTITUTIONS) {
    return INSTITUTIONS[id];
  }

  // Fallback to default institution
  console.warn(
    `[Theme] Institution "${institutionId}" not found. Falling back to ${DEFAULT_INSTITUTION}.`,
  );
  return INSTITUTIONS[DEFAULT_INSTITUTION];
}

/**
 * Get the current institution from environment variable
 *
 * @returns Current institution ID from NEXT_PUBLIC_INSTITUTION env var
 */
export function getCurrentInstitution(): InstitutionId {
  const envInstitution = process.env.NEXT_PUBLIC_INSTITUTION;
  const id = envInstitution?.toUpperCase() as InstitutionId;

  if (id && id in INSTITUTIONS) {
    return id;
  }

  return DEFAULT_INSTITUTION;
}

/**
 * Check if an institution ID is valid
 *
 * @param institutionId - Institution identifier to validate
 * @returns true if institution exists, false otherwise
 */
export function isValidInstitution(institutionId?: string | null): boolean {
  if (!institutionId) return false;
  const id = institutionId.toUpperCase() as InstitutionId;
  return id in INSTITUTIONS;
}

/**
 * Get list of all available institutions
 *
 * @returns Array of institution IDs
 */
export function getAvailableInstitutions(): InstitutionId[] {
  return Object.keys(INSTITUTIONS) as InstitutionId[];
}
