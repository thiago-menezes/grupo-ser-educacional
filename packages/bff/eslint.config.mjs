import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginImportX from 'eslint-plugin-import-x';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'import-x': pluginImportX,
    },
    rules: {
      // Import ordering and organization
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import-x/no-duplicates': 'error',
    },
  },
  {
    rules: {
      // Quote preferences
      quotes: ['error', 'single', { avoidEscape: true }],
      // Other useful rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    ignores: ['dist/**', '**/*.spec.ts', '**/*.test.ts'],
  },
];

