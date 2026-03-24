import { base } from '@cosmos-explorer/eslint-config/base';

export default [
  ...base,
  {
    files: ['**/*.ts'],
    rules: {
      // Array index access is not checked without noUncheckedIndexedAccess,
      // so defensive null checks on response[0] appear "unnecessary" to TS.
      // These checks are intentional guards against GraphQL response data.
      '@typescript-eslint/no-unnecessary-condition': 'off',
    },
  },
];
