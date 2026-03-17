import nextPlugin from '@next/eslint-plugin-next';
import { react } from './react.js';

/** @type {import('eslint').Linter.Config[]} */
export const next = [
  ...react,
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  // Test and config files — relax some strict rules
  {
    files: ['**/*.config.ts', '**/*.config.mjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
