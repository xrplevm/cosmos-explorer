import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export const base = [
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/*.js', '**/*.mjs', '**/*.cjs'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // ── TypeScript strict rules ──────────────────────────────────────────
      ...tseslint.configs['strict-type-checked'].rules,
      ...tseslint.configs['stylistic-type-checked'].rules,

      // Explicit any is an escape hatch — warn, don't block
      '@typescript-eslint/no-explicit-any': 'warn',
      // Unsafe rules are noisy in mixed codebases — warn
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',

      // Enforce `import type` for type-only imports
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      // No unused vars (underscore prefix opt-out)
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // Async correctness
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      // Nullish coalescing over || for nullable checks
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      // Optional chaining
      '@typescript-eslint/prefer-optional-chain': 'error',
      // Non-null assertions are code smells — warn
      '@typescript-eslint/no-non-null-assertion': 'warn',
      // Restrict template literals to strings only
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true, allowBoolean: false, allowNullish: false },
      ],

      // ── General JS ──────────────────────────────────────────────────────
      'no-console': 'warn',
      'no-debugger': 'error',
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-empty': ['error', { allowEmptyCatch: false }],
      'object-shorthand': 'error',
    },
  },
];
