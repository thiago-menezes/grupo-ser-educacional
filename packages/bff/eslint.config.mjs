import { config as baseConfig } from '@grupo-ser/eslint/base';

export default [
  ...baseConfig,
  {
    ignores: ['dist/**', '**/*.spec.ts', '**/*.test.ts'],
  },
];
