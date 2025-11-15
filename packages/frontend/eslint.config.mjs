import { nextJsConfig } from '@grupo-ser/eslint/next';

export default [
  ...nextJsConfig,
  {
    ignores: [
      'dist/**',
      '**/*.spec.ts',
      '**/*.test.ts',
      '**/*.spec.tsx',
      '**/*.test.tsx',
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // Disable pages directory check for library packages
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
];
