import { nextJsConfig } from '@grupo-ser/eslint/next';

export default [
  ...nextJsConfig,
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      '**/*.d.ts',
      'public/**',
      '.env*',
      'coverage/**',
    ],
  },
];
