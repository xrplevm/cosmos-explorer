import hooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';
import { base } from './base.js';

/** @type {import('eslint').Linter.Config[]} */
export const react = [
  ...base,
  {
    files: ['**/*.tsx', '**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      'react-hooks': hooksPlugin,
    },
    rules: {
      ...hooksPlugin.configs.recommended.rules,
    },
  },
];
